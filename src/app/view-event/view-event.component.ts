import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from '../_models';
import { UserService } from '../_services';
import { AlertService, EventService } from '../_services';
import { Event } from '../_models';
import { Event_Subscriber } from '../_models';
import { Location } from '@angular/common';
import { DecToTimePipe } from '../_pipes/dec-to-time.pipe';


@Component({
	selector: 'app-view-event',
	templateUrl: './view-event.component.html',
	styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

	event: Event;
	currentUser: User;
	currentSubscribers: Event_Subscriber[];
	eventId: string;
	loading = false;
	subscribed = false;
	userIsCreator = false;

	constructor(private userService: UserService,
		private eventService: EventService,
		private alertService: AlertService,
		private location: Location,
		private route: ActivatedRoute) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		//alert(JSON.stringify(this.currentUser));
	}

	ngOnInit() {
		this.loading = true;
		this.eventId = this.route.snapshot.params['id'];
		this.loadEventData();
	}

	goBack(): void {
		this.location.back();
	}

	subscribe() {
		if(this.currentUser._id == this.event.creator['id']) {
			return;
		}

		let newSubscriber = new Event_Subscriber;

		newSubscriber.id = this.currentUser._id;
		newSubscriber.avatar = this.currentUser.avatar;
		newSubscriber.email = this.currentUser.email;
		newSubscriber.firstName = this.currentUser.firstName;
		newSubscriber.lastName = this.currentUser.lastName;
		newSubscriber.major = this.currentUser.major;

		this.eventService.subscribe(this.event._id, newSubscriber)
			.pipe(first())
			.subscribe(
				data => {
					this.loadEventData();
					this.alertService.success('Subscribed!');
					//this.router.navigate(['/']);
				},
				error => {
					this.alertService.error(error);
					//this.loading = false;
				});

	}

	unsubscribe() {

		this.eventService.unsubscribe(this.event._id, { id: this.currentUser._id })
			.pipe(first())
			.subscribe(
				data => {
					this.loadEventData();
					this.alertService.success('Unsubscribed!');
				},
				error => {
					this.alertService.error(error);
					//this.loading = false;
				});
	}


	loadEventData(cb?: () => void) {
		this.eventService.getById(this.eventId).pipe(first()).subscribe(event => {
			this.event = event;
			this.currentSubscribers = this.event.subscribers;
			this.subscribed = this.isSubscribed();
			this.userIsCreator = this.isCreator();
			this.loading = false;
		});
	}

	private isSubscribed() {
		return this.currentSubscribers.find(o => o['id'] === this.currentUser._id) ? true : false;
	}

	isCreator() {
		//return this.currentUser._id == input ? true : false;
		return this.currentUser._id == this.event.creator['id'] ? true : false;

	}

	deleteEvent(eventId: string) {
		this.loading = true;
		this.eventService.delete(eventId)
			.pipe(first())
			.subscribe(
				data => {
					//this.loadEventData(() => { this.alertService.success('Event Deleted'); this.loading = false;  });
					this.goBack();
				});

	}

}
