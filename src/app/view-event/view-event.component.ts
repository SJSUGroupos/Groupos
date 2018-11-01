import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from '../_models';
import { UserService } from '../_services';
import { AlertService, EventService } from '../_services';
import { Event } from '../_models';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  event: Event;
  currentUser: User;

  constructor(private userService: UserService,
      private eventService: EventService,
      private alertService: AlertService,
      private location: Location,
      private route: ActivatedRoute) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.eventService.getById(id).pipe(first()).subscribe(event => {
      this.event = event;
    });
  }

  goBack(): void {
    this.location.back();
  }

}
