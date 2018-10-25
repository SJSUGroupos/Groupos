import { Component, OnInit } from '@angular/core';
import { Profile } from '../shared/profile';
import { PROFILES } from '../shared/profiles';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: Profile = PROFILES[0];

  constructor() { }

  ngOnInit() {
  }

}
