import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';

import { AlertService, EventService } from '../_services';
import { Event } from '../_models';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
	  events: Event[] = [];
    selectedEvent: Event;

    constructor(private userService: UserService,
        private eventService: EventService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllEvents();
    }

    onSelect(event: Event) {
      this.selectedEvent = event;
    }

    deleteEvent(id: number) {
        this.eventService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllEvents()
        });
    }

    private loadAllEvents() {
        this.eventService.getAll().pipe(first()).subscribe(events => {
            this.events = events;
        });
    }

}
