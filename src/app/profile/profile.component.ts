import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../_models';
import { Availabilities } from '../_models';
import { TimeRange } from '../_models';
import { UserService, AlertService, EventService } from '../_services';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as $ from 'jquery';
import * as moment from 'moment';
import {degreeList} from './degreeList';
import {courseList} from '../courseList';

const URL = 'users/avatar';

function stringExistsInMem(arr: any): ValidatorFn {
	return (control: AbstractControl): {[key: string]: boolean} | null => {
		if($.inArray($.trim(control.value), arr) >= 0) {
			//alert(arr);
			control.markAsTouched();
			return {'invalid': true } 
		}
		else {
			return null;
		}
	}
}

function valueSelected(myArray: any[]): ValidatorFn {

	return (c: AbstractControl): { [key: string]: boolean } | null => {
		let selectboxValue = c.value;
		let pickedOrNot = myArray.filter(alias => alias === selectboxValue);

		if (pickedOrNot.length > 0) {
			// everything's fine. return no error. therefore it's null.
			return null;

		} else {
			//there's no matching selectboxvalue selected. so return match error.
			return { 'match': true };
		}
	}
}

function courseSelected(myArray: any[]): ValidatorFn {

	return (c: AbstractControl): { [key: string]: boolean } | null => {
		let selectboxValue = c.value;
		let pickedOrNot = myArray.filter(alias => alias.label+' - '+alias.title === selectboxValue);

		if (pickedOrNot.length > 0) {
			// everything's fine. return no error. therefore it's null.
			return null;

		} else {
			//there's no matching selectboxvalue selected. so return match error.
			return { 'match': true };
		}
	}
}
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	updateProfileForm: FormGroup;
	updateAvatarForm: FormGroup;
	updateAvailForm: FormGroup;
	updateCourseForm: FormGroup;
	currentUser: User;
	users: User[] = [];
	avail: Object;
	hours: number[] = [];
	minutes: number[] = [];
	options: string[] = degreeList;
	courseOptions: any[] = courseList;
	filteredOptions: Observable<string[]>;
	filteredCourseOptions: Observable<any[]>;

	loading = false;
	submitted = false;
	public uploader:FileUploader = new FileUploader({url: URL});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private eventService: EventService,
		private userService: UserService,
		private alertService: AlertService,
		private cd: ChangeDetectorRef,
		private ng2ImgMax: Ng2ImgMaxService,
	) { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.avail = (this.currentUser.availabilities);
		this.hours = this.retRange(1,12,false);
		this.minutes = this.retRange(0,59,true);
	}


	ngOnInit() {
		//this.loadUserInfo();
		//alert(JSON.stringify(this.currentUser));
		//alert(this.avail['monday']);
		this.updateProfileForm = this.formBuilder.group({
			firstName: [this.currentUser.firstName, Validators.required],
			lastName: [this.currentUser.lastName, Validators.required],
			major: [this.currentUser.major, Validators.compose([ Validators.required, valueSelected(this.options) ]) ],
			email: [this.currentUser.email, [Validators.required,Validators.email] ],
		});

		this.updateCourseForm = this.formBuilder.group({
			addCourse: ['', Validators.compose([courseSelected(this.courseOptions), stringExistsInMem(this.currentUser.coursework)])],
		});

		this.updateAvatarForm = this.formBuilder.group({
			avatar: [null, Validators.required],
			filename: [this.currentUser._id],
		});

		this.updateAvailForm = this.formBuilder.group({
			startTime: [+moment("01:00:00", "HH:mm:ss")],
			endTime: [+moment("01:00:00", "HH:mm:ss")],
			eTHSent: ['1'], 
			eTMSent: ['00'], 
			sTHSent: ['1'], 
			sTMSent: ['00'], 
			ePer: ['AM'], 
			sPer: ['AM'], 
		},{validator: this.availableTimeValidator});


		this.filteredOptions = this.updateProfileForm.controls.major.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filter(value))
			);

		this.filteredCourseOptions = this.updateCourseForm.controls.addCourse.valueChanges
			.pipe(
				startWith(''),
				map(value => this._courseFilter(value))
			);
	}

	get f() { return this.updateProfileForm.controls; }
	get c() { return this.updateCourseForm.controls; }
	get a() { return this.updateAvatarForm.controls; }
	get availForm() { return this.updateAvailForm.controls; }


	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}


	private _courseFilter(value: string): any[] {
		const filterValue = value.toLowerCase();
		return this.courseOptions.filter(option => option.label.toLowerCase().includes(filterValue));
	}

	availableTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
		const start = control.get('startTime');
		const end = control.get('endTime');
		if(start.value > end.value) {
			Object.keys(control.controls).forEach(key => {
				control.controls[key].setErrors({'invalid': true});
				control.controls[key].markAsTouched();
			});
			//control.controls.eTHSent.setErrors({'invalid': true});
			//control.controls.eTHSent.markAsTouched();
		}
		else {
			Object.keys(control.controls).forEach(key => {
				control.controls[key].setErrors(null);
				control.controls[key].markAsTouched();
			});
			//control.controls['eTHSent'].setErrors(null);
			//control.controls.eTHSent.markAsTouched();
		}

		return start.value > end.value ? { 'invalidTimeRange': true } : null;
	};



	onSubmit() {

		this.submitted = true;
		this.onAvatarSubmit(() => this.updateProfile());

	}


	updateProfile() {

		var userRef = new User();
		// stop here if form is invalid
		if (this.updateProfileForm.invalid) {
			return;
		}



		var obj = new User();
		obj = this.currentUser;

		obj.firstName = this.f.firstName.value;
		obj.lastName = this.f.lastName.value;
		obj.major = this.f.major.value;
		obj.email = this.f.email.value;


		userRef = JSON.parse(localStorage.getItem('currentUser'));

		if(JSON.stringify(userRef) === JSON.stringify(obj)) {
			return;
		}
		//obj.coursework.push(this.c.addCourse.value);


		this.loading = true;
		this.userService.update(obj)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Profile Updated');
					this.reloadUserData(obj);
					this.loading = false;
					setTimeout(()=>{ this.alertService.clear() }, 3000);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});

	}

	onAvatarSubmit(cb?: () => void) {


		//this.submitted = true;
		// stop here if form is invalid
		if (this.updateAvatarForm.invalid) {
			cb();
			return;
		}


		let fd = new FormData();
		//fd.append('avatar', this.updateAvatarForm.value);
		fd.append('avatar', this.a.avatar.value);
		fd.append('filename', this.a.filename.value);
		this.loading = true;
		this.userService.uploadAvatar(fd)
			.pipe(first())
			.subscribe(
				data => {
					this.currentUser.avatar=data['src'];
					cb();
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
		//$.post('users/avatar', {avatar: this.a.avatar.value}, function(res){alert("success")}).fail(function(){alert("fail")});

	}

	test(event) { console.log(event);}

	addClass(value: string) { 
		if(this.c.addCourse.hasError('invalid') || this.c.addCourse.hasError('match')){
			return;
		}
		value = $.trim(value); 
		if(value ==''){
			return;
		}
		else if($.inArray(value, this.currentUser.coursework) < 0) { 
			this.currentUser.coursework.push(value); 
		}
	}

	addAvail(day: string, startTime: string, endTime: string, periodS: string, periodE) { 
		//var st = new Date('1/1/1970 '+ moment(startTime+' '+periodS, ["h:mm A"]).format("HH:mm") +':00');
		//var et = new Date('1/1/1970 '+ moment(endTime+' '+periodE, ["h:mm A"]).format("HH:mm") +':00'); 
		//this.currentUser.availabilities[day].push([st,et]); 
		//alert(this.f.startTime.value);
		//this.currentUser.availabilities[day].push([this.availForm.startTime.value,this.availForm.endTime.value]); 
		var avail = new Availabilities();
		avail = this.currentUser.availabilities;
		var timeRange = new TimeRange();
		timeRange.startTime = this.availForm.startTime.value;
		timeRange.endTime = this.availForm.endTime.value;
		avail[day].push(timeRange);
		this.currentUser.availabilities = avail; 
	}

	reset() { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
		this.avail = (this.currentUser.availabilities);
		this.f.firstName.setValue(this.currentUser.firstName);
		this.f.lastName.setValue(this.currentUser.lastName);
		this.f.major.setValue(this.currentUser.major);
		this.a.avatar.setValue(null);
	}


	deleteCourse(course: string) {
		var arr = this.currentUser.coursework;
		arr.splice($.inArray(course, arr),1);
	}

	deleteTimeSlot(times, day) {
		var arr = this.currentUser.availabilities[day];
		arr.splice($.inArray(times, arr),1);
	}

	private reloadUserData(obj: User) {
		this.userService.getById(this.currentUser._id)
			.pipe(first())
			.subscribe(
				data => {
					localStorage.setItem('currentUser', JSON.stringify(data));
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
	}

	retRange(start: number, end: number, zeroExtend: boolean) {
		var range = [];
		for (var i = start; i <= end; i++) {
			if(zeroExtend && i < 10) {
				range.push('0'+i.toString());
			}
			else {
				range.push(i.toString());
			}
		}
		return range;
	}

	onFileChange(event) {
		const reader = new FileReader();
		var resizedImg = new Blob();

		if(event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			this.ng2ImgMax.resizeImage(file, 100, 10000).subscribe(
				result => {
					//resizedImg = new File([result], result.name);
					resizedImg = (result);
					reader.readAsDataURL(resizedImg);
					reader.onload = () => {
						this.currentUser.avatar = reader.result;
						this.updateAvatarForm.patchValue({
							avatar: reader.result
						});

						// need to run CD since file load runs outside of zone
						this.cd.markForCheck();
					};
				},
				error => {
					console.log('ng2ImgMax: ', error);
				}
			);

		}
	}

	startTimeChange(startTimeH: string, startTimeM: string, periodS: string) {
		var st = moment(startTimeH+':'+startTimeM+' '+periodS, ["h:mm A"]);
		this.availForm.startTime.setValue(+st);
	}

	endTimeChange(endTimeH, endTimeM, period) {
		var et = moment(endTimeH+':'+endTimeM+' '+period, ["h:mm A"]);
		this.availForm.endTime.setValue(+et);
	}
}
