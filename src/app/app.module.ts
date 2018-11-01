import '../polyfills';
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
import { FeedComponent } from './feed';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { ViewEventComponent } from './view-event/view-event.component';

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
  		FeedComponent,
  		FooterComponent,
  		HeaderComponent,
  		ViewEventComponent,
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		EventService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
