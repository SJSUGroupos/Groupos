import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../_models';
import { UserService, AlertService, EventService } from '../_services';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	updateProfileForm: FormGroup;
	updateCourseworkForm: FormGroup;
	currentUser: User;
	users: User[] = [];

	loading = false;
	courseworkSubmitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private eventService: EventService,
		private userService: UserService,
		private alertService: AlertService
	) { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		//this.updateProfileForm = this.formBuilder.group({
		//});
		this.updateCourseworkForm = this.formBuilder.group({
			addCourse: [''],
		});
	}


	ngOnInit() {
		this.loadUserInfo();
		alert(JSON.stringify(this.currentUser));
	}


	private loadUserInfo() {

	}

	get coursework() { return this.updateCourseworkForm.controls; }

	onSubmit() {
		this.courseworkSubmitted = true;
		// stop here if form is invalid
		alert(this.coursework.addCourse.value);
		if (this.updateCourseworkForm.invalid) {
			//return;
		}

		var obj = new User();
		obj = this.currentUser;
		obj.coursework.push(this.coursework.addCourse.value)


		alert(JSON.stringify(obj));
		this.loading = true;
		this.userService.update(obj)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Coursework Updated', true);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});
	}
}
