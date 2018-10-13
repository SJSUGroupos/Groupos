import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProfileModule } from './profile/profile.module';  //1012
 import {ProfilesService } from './shared'; //1012

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ProfileModule //1012
  ],
  providers: [
  ProfilesService], //1012
  bootstrap: [AppComponent]
})
export class AppModule { }
