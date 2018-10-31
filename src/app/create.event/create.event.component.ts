import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, EventService } from '../_services';
import { Event } from '../_models';


@Component({
	templateUrl: 'create.event.component.html',
	selector: 'app-create.event',
	styleUrls: ['./create.event.component.css']
})

export class CreateEventComponent implements OnInit {
	eventForm: FormGroup;
	loading = false;
	submitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private eventService: EventService,
		private alertService: AlertService) { }

	ngOnInit() {
		this.eventForm = this.formBuilder.group({
			eventName: ['', Validators.required],
			eventDate: ['', Validators.required],
			course: [''],
			public: [false, Validators.required],
			description: ['']
		});
	}

	// convenience getter for easy access to form fields
	get f() { return this.eventForm.controls; }

	onSubmit() {
		this.submitted = true;
		// stop here if form is invalid
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
}
