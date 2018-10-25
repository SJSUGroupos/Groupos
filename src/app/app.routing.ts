import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { CreateEventComponent } from './create.event';
import { ProfileComponent } from './profile';
import { FeedComponent } from './feed';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
    { path: '', component: FeedComponent, canActivate: [AuthGuard] },
	{ path: 'listusers', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
	{ path: 'create', component: CreateEventComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
