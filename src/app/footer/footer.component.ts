import { Component, OnInit, OnDestroy } from '@angular/core';
import { InviteService } from '../_services/invite.service';
import { Subscription } from 'rxjs';
import { User } from '../_models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
	inviteRecv: boolean;
	sub: Subscription;
	inviteColor: string;

	constructor(
		private inviteService: InviteService
	) {
		this.inviteRecv = this.inviteStatus();
	}

	ngOnInit() {
		this.sub = this.inviteService.getInvites()
			.subscribe(invite => {
				this.inviteRecv = this.inviteStatus();
			});
		//this.setInviteColor();
		//this.inviteService.onConnect();
		//this.inviteService.sendMessage(this.currentUser['_id']+'.invite', { invite: "test" });
		//setTimeout(() => {this.inviteService.sendTest();}, 3000);
	}

	ngOnDestroy() {
			this.sub.unsubscribe();
	}

	setInviteColor() : void {
		if(!this.inviteRecv) {
			this.inviteColor = "primary";
		}
		else {
			this.inviteColor = "accent";
		}
	}

	inviteStatus(): boolean {
		var inv = localStorage.getItem('newInvite');
		if (inv == "true") {
			return true;
		}
		else {
			return false;
		}
	}

}
