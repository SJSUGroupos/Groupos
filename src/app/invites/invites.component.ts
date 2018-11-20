import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from '../_models';
import { UserService } from '../_services';
import { AlertService, EventService, InviteService } from '../_services';
import { Event } from '../_models';
import { Event_Subscriber } from '../_models';
import { Location } from '@angular/common';


@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit {

	event: Event;
	events: Event[];
	currentUser: User;
	currentSubscribers: Event_Subscriber[];
	eventId: string;
	loading = false;
	subscribed = false;
	invites: any;

	constructor(private userService: UserService,
		private eventService: EventService,
		private alertService: AlertService,
		private inviteService: InviteService,
		private location: Location,
		private route: ActivatedRoute) {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.inviteService.reset();
	}

	ngOnInit() {
		this.loading = true;
		//this.eventId = this.route.snapshot.params['id'];
		this.loadInvites(() => { 
			//alert(JSON.stringify(this.invites));
			this.loading = false; });
	}

	goBack(): void {
		this.location.back();
	}

	subscribe(eventId: string) : void {

		this.loading = true;
		let newSubscriber = new Event_Subscriber;

		newSubscriber.id = this.currentUser._id;
		newSubscriber.avatar = this.currentUser.avatar;
		newSubscriber.email = this.currentUser.email;
		newSubscriber.firstName = this.currentUser.firstName;
		newSubscriber.lastName = this.currentUser.lastName;
		newSubscriber.major = this.currentUser.major;

		this.eventService.subscribe(eventId, newSubscriber)
			.pipe(first())
			.subscribe(
				data => {
					this.loadEventData(() => { this.alertService.success('Subscribed!'); this.deleteInvite(eventId); this.loading = false; } );
					//this.router.navigate(['/']);
				},
				error => {
					this.alertService.error(error);
					this.loading = false;
				});

	}

	unsubscribe(eventId: string) {

		this.loading = true;
		this.eventService.unsubscribe(eventId, { id: this.currentUser._id })
			.pipe(first())
			.subscribe(
				data => {
					this.loadEventData(() => { this.alertService.success('Unsubscribed!'); this.loading = false;  });

				});
	}

	deleteEvent(eventId: string) {
		this.loading = true;
		this.eventService.delete(eventId)
			.pipe(first())
			.subscribe(
				data => {
					this.loadEventData(() => { this.alertService.success('Event Deleted'); this.loading = false;  });

				});

	}

	deleteInvite(eventId: string) {
		this.userService.deleteInvite({ userId: this.currentUser._id, eventId: eventId }).pipe(first()).subscribe(invites => {
			this.loadInvites(() => {});
		});
	}

	loadEventData(cb?: () => void) {
		this.eventService.getByUserId(this.currentUser._id).pipe(first()).subscribe(events => {
			this.events = events;
			//alert(JSON.stringify(events.select('-subscribers')));
			//this.currentSubscribers = this.event.subscribers;
			//this.subscribed = this.isSubscribed();
			cb();
		});
	}

	loadInvites(cb?: () => void) {
		this.userService.getInvites(this.currentUser._id).pipe(first()).subscribe(invites => {
			this.invites = invites;
			//alert(JSON.stringify(events.select('-subscribers')));
			//this.currentSubscribers = this.event.subscribers;
			//this.subscribed = this.isSubscribed();
			cb();
		});
	}

	private isSubscribed() {
		return this.currentSubscribers.find(o => o['id'] === this.currentUser._id) ? true : false;
	}

	isCreator(input: string) {
		return this.currentUser._id == input ? true : false;
	}

}
