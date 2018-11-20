import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSuggestionService {

	constructor(private userService: UserService) { }


	findUsers(userId: string, startTime: number, endTime: number, day: string, cb?: (data: any[]) => void) : void {
		this.userService.getUsersByTime({ userId: userId, eventStartTime: startTime, eventEndTime: endTime, day: day })
			.pipe(first())
			.subscribe(
				data => {
					//alert(JSON.stringify(data));


					cb(data);


				},
				error => {
					//this.alertService.error(error);
				});

	}


}
