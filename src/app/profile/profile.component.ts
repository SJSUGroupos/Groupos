import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../_models';
import { UserService, AlertService, EventService } from '../_services';
import { Ng2ImgMaxService } from 'ng2-img-max';
import * as $ from 'jquery';
import * as moment from 'moment';

const URL = 'users/avatar';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	updateProfileForm: FormGroup;
	updateAvatarForm: FormGroup;
	currentUser: User;
	users: User[] = [];
	avail: Object;
	hours: number[] = [];
	minutes: number[] = [];

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
		alert(JSON.stringify(this.currentUser));
		alert(this.avail['monday']);
		this.updateProfileForm = this.formBuilder.group({
			firstName: [this.currentUser.firstName, Validators.required],
            lastName: [this.currentUser.lastName, Validators.required],
            major: [this.currentUser.major, Validators.required],

		});
		this.updateAvatarForm = this.formBuilder.group({
            avatar: [null, Validators.required],
			filename: [this.currentUser._id],
		});
	}

	get f() { return this.updateProfileForm.controls; }
	get a() { return this.updateAvatarForm.controls; }

	onSubmit() {

		var userRef = new User();

		this.submitted = true;
		// stop here if form is invalid
		if (this.updateProfileForm.invalid) {
			return;
		}



		var obj = new User();
		obj = this.currentUser;

		obj.firstName = this.f.firstName.value;
		obj.lastName = this.f.lastName.value;
		obj.major = this.f.major.value;

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

	onAvatarSubmit() {


		//this.submitted = true;
		// stop here if form is invalid
		if (this.updateAvatarForm.invalid) {
			return;
		}

		alert(typeof(this.a.avatar.value));

		let fd = new FormData();
		//fd.append('avatar', this.updateAvatarForm.value);
		fd.append('avatar', this.a.avatar.value);
		fd.append('filename', this.a.filename.value);
		this.loading = true;
		this.userService.uploadAvatar(fd)
			.pipe(first())
			.subscribe(
				data => {
					this.currentUser.avatar='/src/assets/images/'+this.a.filename.value+'.jpg'
					console.log("avatar submitted");
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
		//$.post('users/avatar', {avatar: this.a.avatar.value}, function(res){alert("success")}).fail(function(){alert("fail")});

	}

	test(event) { console.log(event);}

	fileUploadTest(event) {

		//var selectedFile = <HTMLInputElement>document.getElementById('avatar').files[0];
		var selectedFile = event.target.files;
		if(!selectedFile) {
			console.log("No files")
		}
		else {
			for(var i = 0; i < selectedFile.length; i++){
				console.log(selectedFile[i]);
			}
		}

		var formData: FormData = new FormData();

		formData.append("files", selectedFile[0], "avatar");

		console.log(formData.get("files"));

		this.userService.uploadAvatar(formData)
			.pipe(first())
			.subscribe(
				data => {
					//this.alertService.success('Avatar Updated');
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
	}	

	addClass(value: string) { this.currentUser.coursework.push(value); }

	addAvail(day: string, startTime: string, endTime: string, periodS: string, periodE) { 
		var st = new Date('1/1/1970 '+ moment(startTime+' '+periodS, ["h:mm A"]).format("HH:mm") +':00');
		var et = new Date('1/1/1970 '+ moment(endTime+' '+periodE, ["h:mm A"]).format("HH:mm") +':00'); 
		this.currentUser.availabilities[day].push([st,et]); 
	}

	reset() { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
		this.avail = (this.currentUser.availabilities);
		this.f.firstName.setValue(this.currentUser.firstName);
		this.f.lastName.setValue(this.currentUser.lastName);
		this.f.major.setValue(this.currentUser.major);
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
		this.userService.getById(obj._id)
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

		alert("got here");
		if(event.target.files && event.target.files.length) {
			const [file] = event.target.files;

			this.ng2ImgMax.resizeImage(file, 100, 10000).subscribe(
				result => {
					//resizedImg = new File([result], result.name);
					resizedImg = (result);
					reader.readAsDataURL(resizedImg);
					alert(JSON.stringify(resizedImg));
					reader.onload = () => {
						alert(reader.result);
						this.updateAvatarForm.patchValue({
							avatar: reader.result
						});

						// need to run CD since file load runs outside of zone
						this.cd.markForCheck();
					};
				},
				error => {
					console.log('Oh no!', error);
				}
			);

		}
	}


}
