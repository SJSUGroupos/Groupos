import { Component, OnInit, OnDestroy } from '@angular/core';
import { InviteService } from './_services/invite.service';
import { Subscription } from 'rxjs';
import { User } from './_models';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

	inviteRecv: any;
	sub: Subscription;

	constructor(
		private inviteService: InviteService
		) {}

	ngOnInit() {
		this.sub = this.inviteService.getInvites()
			.subscribe(invite => {
				this.inviteRecv = this.inviteStatus();
				//alert(this.inviteRecv);
			});
		this.inviteRecv = this.inviteStatus();
		//this.inviteService.onConnect();
		//this.inviteService.sendMessage(this.currentUser['_id']+'.invite', { invite: "test" });
		//setTimeout(() => {this.inviteService.sendTest();}, 3000);
	}

	ngOnDestroy() {
			this.sub.unsubscribe();
	}
	
	inviteStatus() {
		var inv = sessionStorage.getItem('newInvite');
		if (inv == "true") {
			return true;
		}
		else {
			return false;
		}
	}
}
