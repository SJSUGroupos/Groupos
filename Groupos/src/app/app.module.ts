import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
// used to create fake backend
//import { fakeBackendProvider } from './_helpers';

import { routing }        from './app.routing';

import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AlertService, AuthenticationService, UserService } from './_services';

import { AppComponent }  from './app.component';
import { AlertComponent } from './_directives';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';;
import { ProfileComponent } from './profile/profile.component'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        FlexLayoutModule,
        MatListModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent
      ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
		//fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
