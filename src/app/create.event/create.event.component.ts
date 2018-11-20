import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Event_Subscriber } from '../_models';
import { InviteService, AlertService, EventService, UserSuggestionService, UserService } from '../_services';
import { Event } from '../_models';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormValidators } from '../_helpers/FormValidators';
import * as $ from 'jquery';
import * as moment from 'moment';
import { courseList } from '../courseList';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({templateUrl: 'create.event.component.html',
	styleUrls: ['./create.event.component.css'],
})
export class CreateEventComponent implements OnInit {
	eventForm: FormGroup;
	loading = false;
	submitted = false;
	minDate = new Date();
	hours: number[] = [];
	minutes: number[] = [];
	currentUser: User;
	courseOptions: any[] = courseList;
	filteredCourseOptions: Observable<any[]>;
	formValidators: FormValidators = new FormValidators();
	userSuggestions: any[] = [];
	day: string = "";
	usersToInvite: string[] = [];
	composedInvites: any[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private eventService: EventService,
		private userService: UserService,
		private alertService: AlertService,
		private inviteService: InviteService,
		private userSuggestionService: UserSuggestionService) { 
		this.hours = this.retRange(1,12,false);
		this.minutes = this.retRange(0,59,true);
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.eventForm = this.formBuilder.group({
			eventName: ['', Validators.required],
			eventDate: ['', Validators.required],
			course: ['', this.formValidators.courseSelected(this.courseOptions)],
			public: [false, Validators.required],
			description: [''],
			sTHSent: ['1'],
			sTMSent: ['00'],
			sPer: ['AM'],
			eTHSent: ['1'],
			eTMSent: ['00'],
			ePer: ['AM'],
			startTime: [1],
			endTime: [1],
		},{ validator: this.timeRangeValidator });

		
		this.filteredCourseOptions = this.f.course.valueChanges
			.pipe(
				startWith(''),
				map(value => this._courseFilter(value))
			);
	}


	private _courseFilter(value: string): any[] {
		const filterValue = value.toLowerCase();
		return this.courseOptions.filter(option => option.label.toLowerCase().includes(filterValue));
	}


	get f() { return this.eventForm.controls; }

	onSubmit() {
		this.submitted = true;
		if (this.eventForm.invalid) {
			return;
		}

		var obj = new Event();

		let creator = new Event_Subscriber();
		creator.id = this.currentUser._id;
		creator.avatar = this.currentUser.avatar;
		creator.email = this.currentUser.email;
		creator.firstName = this.currentUser.firstName;
		creator.lastName = this.currentUser.lastName;
		creator.major = this.currentUser.major;


		obj.eventName = this.f.eventName.value;
		obj.eventCourse = this.f.course.value;
		obj.eventDate = this.f.eventDate.value;
		obj.eventStartTime = this.f.startTime.value;
		obj.eventEndTime = this.f.endTime.value;
		obj.creator = creator;
		obj.public = this.f.public.value;
		obj.description = this.f.description.value;

		this.loading = true;
		//this.eventService.createEvent(this.eventForm.value)
		this.eventService.createEvent(obj)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Event creation successful', true);
					//alert(JSON.stringify(data));
					this.composeInvites(data['eventId'], (invites) => {
						//alert(JSON.stringify(invites));
						this.sendInvites(invites, () => {
							this.usersToInvite.forEach(usr => {
								this.inviteService.sendMessage('invite', { recvId: usr, data: true })
							});
							this.router.navigate(['/']);
						});
					})

				},
				error => {
					alert("error creating event");
					this.alertService.error(error);
					this.loading = false;
				});
	}

	getDateError() {
		if(this.f.eventDate.hasError('required')) {
			return "event date required";
		}
		else if(this.f.eventDate.hasError('min')) {
			return "invalid date";
		}
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

	changeFormDate(event: MatDatepickerInputEvent<Date>) {
		//alert(event.value);
		var date = moment(event.value);
		this.f.eventDate.setValue(+date);
		//var date = moment.unix(this.f.eventDate.value / 1000);
		this.day = date.format('dddd').toLowerCase();
	}

	startTimeChange(startTimeH: string, startTimeM: string, period: string) {
		var nt = moment(startTimeH+':'+startTimeM+' '+period, ["h:mm A"]);
		//this.f.startTime.setValue(+nt);

		var hours = parseInt(startTimeH);
		var mins = parseInt(startTimeM);
		if(period == "PM"){
			hours = hours + 12;
		}

		var time = hours+mins/60;
		this.f.startTime.setValue(time);

		if(this.eventForm.hasError('invalidTimeRange')) return;

		this.userSuggestionService.findUsers(this.currentUser._id, this.f.startTime.value, this.f.endTime.value, this.day, (data) => {
			this.userSuggestions = data;
			//alert(JSON.stringify(this.userSuggestions));
		});
	}

	endTimeChange(endTimeH, endTimeM, period) {
		//var nt = moment(endTimeH+':'+endTimeM+' '+period, ["h:mm A"]);
		//this.f.endTime.setValue(+nt);
		var hours = parseInt(endTimeH);
		var mins = parseInt(endTimeM);
		if(period == "PM"){
			hours = hours + 12;
		}

		var time = hours+mins/60;
		this.f.endTime.setValue(time);
		//alert(day);

		if(this.eventForm.hasError('invalidTimeRange')) return;

		this.userSuggestionService.findUsers(this.currentUser._id, this.f.startTime.value, this.f.endTime.value, this.day, (data) => {
			this.userSuggestions = data;
			//alert(JSON.stringify(this.userSuggestions));
		});

	}


	timeRangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
		const start = control.get('startTime');
		const end = control.get('endTime');
		if(start.value > end.value) {
			control.controls.eTHSent.setErrors({'invalid': true});
			control.controls.eTHSent.markAsTouched();
			control.controls.eTMSent.setErrors({'invalid': true});
			control.controls.eTMSent.markAsTouched();
			control.controls.ePer.setErrors({'invalid': true});
			control.controls.ePer.markAsTouched();
		}
		else {
			control.controls['eTHSent'].setErrors(null);
			control.controls.eTHSent.markAsTouched();
			control.controls.eTMSent.setErrors(null);
			control.controls.eTMSent.markAsTouched();
			control.controls.ePer.setErrors(null);
			control.controls.ePer.markAsTouched();
		}
		return start.value > end.value ? { 'invalidTimeRange': true } : null;
	};

	inviteUser(userId: string): void {
		//alert(userId);
		var inviteCheck = this.usersToInvite.indexOf(userId);
		if(inviteCheck > -1) {
			this.usersToInvite.splice(inviteCheck, 1);
		}
		else {
			this.usersToInvite.push(userId);
		}
	}

	composeInvites(eventId: any, cb: (invites) => void ): void {
		var composedInvites = [];
		for(var i=0; i < this.usersToInvite.length; i++) {

			composedInvites[i] = {
				"userId": this.usersToInvite[i],
				"invites": {
					"senderId" : this.currentUser._id,
					"firstName": this.currentUser.firstName,
					"lastName": this.currentUser.lastName,
					"avatar"  : this.currentUser.avatar,
					"eventName": this.f.eventName.value,
					"eventId"  : eventId,
					"viewed"   : false,
					"course": this.f.course.value,
					"eventDate": this.f.eventDate.value,
					"eventStartTime": this.f.startTime.value,
					"eventEndTime": this.f.endTime.value
				}
			}

		}
		var obj = { "invites": composedInvites };
		//alert(JSON.stringify(obj));
		cb(composedInvites);
		//cb(obj);
	}

	sendInvites(invites: any, cb: () => void): void {
		//alert("inside sendInvites:"+JSON.stringify(invites));
		this.userService.sendInvite(invites)
		.pipe(first())
		.subscribe(
			data => {
				cb();
			},
			error => {
				//this.alertService.error(error);
				cb();
			});
	}
}
