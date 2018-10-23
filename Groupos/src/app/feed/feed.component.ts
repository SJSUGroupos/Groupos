import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/event';
import { EVENTS } from '../shared/events';
import { Profile } from '../shared/profile';
import { PROFILES } from '../shared/profiles';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  event: Event;
  events: Event[] = EVENTS;

  constructor() { }

  ngOnInit() {
  }

}
