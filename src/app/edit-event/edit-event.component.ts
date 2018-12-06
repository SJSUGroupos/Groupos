import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AlertService, EventService } from '../_services';
import { Event } from '../_models';
import { Event_Subscriber } from '../_models';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  event: Event;
  eventId: string;
  updatedForm: FormGroup;
  loading = false;
  submitted = false;
  minDate = new Date();
  hours: number[] = [];
  minutes: number[] = [];
  currentUser: User;

  constructor(
		private formBuilder: FormBuilder,
    private route: ActivatedRoute,
		private router: Router,
		private eventService: EventService,
		private alertService: AlertService,
    private location: Location) {
		this.hours = this.retRange(1,12,false);
		this.minutes = this.retRange(0,59,true);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.loadEventData(() => {
      this.updatedForm = this.formBuilder.group({
        eventName: ['', Validators.required],
        eventDate: [+moment(this.event.eventDate), Validators.required],
        course: [''],
        public: [false, Validators.required],
        description: [''],
        sTHSent: ['1'],
        sTMSent: ['00'],
        sPer: ['AM'],
        eTHSent: ['1'],
        eTMSent: ['00'],
        ePer: ['AM'],
        startTime: [+moment('01:00:00','HH:mm:ss'), Validators.required],
        endTime: [+moment('01:00:00','HH:mm:ss'), Validators.required],
      },{ validator: this.timeRangeValidator });
    });
  }

  loadEventData(cb?: () => void) {
		this.eventService.getById(this.eventId).pipe(first()).subscribe(event => {
			this.event = event;
			this.loading = false;
      cb();
		});
	}

	get f() { return this.updatedForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.updatedForm.invalid) {
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
    this.eventService.update(obj, this.eventId)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Event successfully updated', true);
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  goBack(): void {
    this.location.back();
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
    this.f.eventDate.setValue(+moment(event.value));
  }

  startTimeChange(startTimeH: string, startTimeM: string, periodS: string) {
    var nt = moment(startTimeH+':'+startTimeM+' '+periodS, ["h:mm A"]);
    this.f.startTime.setValue(+nt);
  }

  endTimeChange(endTimeH, endTimeM, period) {
    var nt = moment(endTimeH+':'+endTimeM+' '+period, ["h:mm A"]);
    this.f.endTime.setValue(+nt);
  }

  timeRangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
		const start = control.get('startTime');
		const end = control.get('endTime');
		if(start.value > end.value) {
			Object.keys(control.controls).forEach(key => {
				control.controls[key].setErrors({'invalid': true});
				control.controls[key].markAsTouched();
			});
			control.controls.eTHSent.setErrors({'invalid': true});
			control.controls.eTHSent.markAsTouched();
		}
		else {
			Object.keys(control.controls).forEach(key => {
				control.controls[key].setErrors(null);
				control.controls[key].markAsTouched();
			});
			control.controls['eTHSent'].setErrors(null);
			control.controls.eTHSent.markAsTouched();
		}
		return start.value > end.value ? { 'invalidTimeRange': true } : null;
	}

}
