﻿import '../polyfills';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule}    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'ng2-file-upload';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import { MaterialModule } from './material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, EventService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { CreateEventComponent } from './create.event';
import { ProfileComponent } from './profile';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { FeedComponent } from './feed';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { ViewEventComponent } from './view-event/view-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { ViewUserEventsComponent } from './view-user-events/view-user-events.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DecToTimePipe } from './_pipes/dec-to-time.pipe';
import { InvitesComponent } from './invites/invites.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		FormsModule,
		HttpClientModule,
		routing,
		MaterialModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		FileUploadModule,
		Ng2ImgMaxModule,
	],
	declarations: [
		AppComponent,
		AlertComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		CreateEventComponent,
		ProfileComponent,
		EditEventComponent,
		ViewProfileComponent,
		FeedComponent,
		FooterComponent,
		HeaderComponent,
		ViewEventComponent,
		ViewUserEventsComponent,
		DecToTimePipe,
		InvitesComponent,
	],
	providers: [
		AuthGuard,
		AlertService,
		AuthenticationService,
		UserService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
		EventService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
