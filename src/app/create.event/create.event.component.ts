import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, EventService } from '../_services';
import { Event } from '../_models';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({templateUrl: 'create.event.component.html',
	styleUrls: ['./create.event.component.css'],
	providers: [
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	],
})
export class CreateEventComponent implements OnInit {
	eventForm: FormGroup;
	loading = false;
	submitted = false;
	minDate = new Date();
	hours: number[] = [];
	minutes: number[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private eventService: EventService,
		private alertService: AlertService) { 
		this.hours = this.retRange(1,12,false);
		this.minutes = this.retRange(0,59,true);
	}

	ngOnInit() {
		this.eventForm = this.formBuilder.group({
			eventName: ['', Validators.required],
			eventDate: ['', Validators.required],
			course: [''],
			public: [false, Validators.required],
			description: [''],
			sTHSent: ['1'],
			sTMSent: ['00'],
			sPer: ['AM'],
			eTHSent: ['1'],
			eTMSent: ['00'],
			ePer: ['AM'],
			startTime: [moment('01:00:00','HH:mm:ss'), Validators.required],
			endTime: [moment('01:00:00','HH:mm:ss'), Validators.required],
		},{ validator: this.timeRangeValidator });
	}

	get f() { return this.eventForm.controls; }

	onSubmit() {
		this.submitted = true;
		alert(this.f.eventDate.value)
		if (this.eventForm.invalid) {
			return;
		}

		var obj = new Event();

		let currentUser = JSON.parse(localStorage.getItem("currentUser")).username;

		obj.eventName = this.f.eventName.value;
		obj.eventCourse = this.f.course.value;
		obj.eventDate = this.f.eventDate.value;
		obj.creator = currentUser;
		obj.public = this.f.public.value;
		obj.description = this.f.description.value;

		alert(JSON.stringify(obj));
		this.loading = true;
		//this.eventService.createEvent(this.eventForm.value)
		this.eventService.createEvent(obj)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Event creation successful', true);
					this.router.navigate(['/']);
				},
				error => {
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

	startTimeChange(startTimeH: string, startTimeM: string, periodS: string) {
		var nt = moment(startTimeH+':'+startTimeM+' '+periodS, ["h:mm A"]);
		this.f.startTime.setValue(nt);
	}

	endTimeChange(endTimeH, endTimeM, period) {
		var nt = moment(endTimeH+':'+endTimeM+' '+period, ["h:mm A"]);
		this.f.endTime.setValue(nt);
	}


	timeRangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
		const start = control.get('startTime');
		const end = control.get('endTime');
		//if(start.value > end.value) {
			//		Object.keys(control.controls).forEach(key => {
			//	control.controls[key].setErrors({'invalid': true});
			//	control.controls[key].markAsTouched();
		//		});
			//control.controls.eTHSent.setErrors({'invalid': true});
			//control.controls.eTHSent.markAsTouched();
		//	}
		//	else {
			//Object.keys(control.controls).forEach(key => {
			//	control.controls[key].setErrors(null);
			//	control.controls[key].markAsTouched();
		//		});
			//control.controls['eTHSent'].setErrors(null);
			//control.controls.eTHSent.markAsTouched();
		//	}
		//alert(start.value > end.value);
		return start.value > end.value ? { 'invalidTimeRange': true } : null;
	};

}
