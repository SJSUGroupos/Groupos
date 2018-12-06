import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { User } from '../_models';
import { UserService } from '../_services';
import { Ng2ImgMaxService } from 'ng2-img-max';
import * as $ from 'jquery';
import * as moment from 'moment';

const URL = 'users/avatar';

@Component({
	selector: 'app-view-profile',
	templateUrl: './view-profile.component.html',
	styleUrls: ['./view-profile.component.css']
})

export class ViewProfileComponent implements OnInit {
	selectedUser: User;
	userId: string;
	firstName: string;
	lastName: string;
	// avatar: string;
	avail: Object;
	major: String;
	coursework: [String];
	loading = false;
	email: string;

	constructor(private router: ActivatedRoute,
		private userService: UserService,
		private alertService: AlertService,
		private location: Location,
		private ng2ImgMax: Ng2ImgMaxService) {
	}

	ngOnInit() {
		this.loading = true;
		this.userId = this.router.snapshot.params['id'];
		this.loadUserData(() => {});
	}

	private loadUserData(cb?: () => void) {
		this.userService.getById(this.userId).pipe(first()).subscribe(data => {
			localStorage.setItem('selectedUser', JSON.stringify(data));
			this.selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
			this.firstName = this.selectedUser.firstName;
			this.lastName = this.selectedUser.lastName;
			this.email = this.selectedUser.email;
			this.major = this.selectedUser.major;
			this.coursework = this.selectedUser.coursework;
			this.avail = this.selectedUser.availabilities;
			cb();
		},
		error => {
			this.alertService.error(error); });
		}

		goBack(): void {
			this.location.back();
		}

	// retRange(start: number, end: number, zeroExtend: boolean) {
	// 	var range = [];
	// 	for (var i = start; i <= end; i++) {
	// 		if(zeroExtend && i < 10) {
	// 			range.push('0'+i.toString());
	// 		}
	// 		else {
	// 			range.push(i.toString());
	// 		}
	// 	}
	// 	return range;
	// }

// 	onFileChange(event) {
// 		const reader = new FileReader();
// 		var resizedImg = new Blob();
//
// 		if(event.target.files && event.target.files.length) {
// 			const [file] = event.target.files;
// 			this.ng2ImgMax.resizeImage(file, 100, 10000).subscribe(
// 				result => {
// 					//resizedImg = new File([result], result.name);
// 					resizedImg = (result);
// 					reader.readAsDataURL(resizedImg);
// 					reader.onload = () => {
// 						this.selectedUser.avatar = reader.result;
// 						this.updateAvatarForm.patchValue({
// 							avatar: reader.result
// 						});
//
// 						// need to run CD since file load runs outside of zone
// 						this.cd.markForCheck();
// 					};
// 				},
// 				error => {
// 					console.log('ng2ImgMax: ', error);
// 				}
// 			);
//
// 		}
// 	}
//
// 	startTimeChange(startTimeH: string, startTimeM: string, periodS: string) {
// 		var st = new Date('1/1/1970 '+ moment(startTimeH+':'+startTimeM+' '+periodS, ["h:mm A"]).format("HH:mm") +':00');
// 		this.availForm.startTime.setValue(st);
// 	}
//
// 	endTimeChange(endTimeH, endTimeM, period) {
// 		var et = new Date('1/1/1970 '+ moment(endTimeH+':'+endTimeM+' '+period, ["h:mm A"]).format("HH:mm") +':00');
// 		this.availForm.endTime.setValue(et);
// 	}
 }
