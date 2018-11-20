import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import * as socketIo from 'socket.io-client';

import { Socket } from '../_shared/interfaces';

//declare var io : {
//  connect(url: string): Socket;
//};

@Injectable({
	providedIn: 'root'
})
export class InviteService {
	socket: Socket;
	observer: Observer<any>;
	obs: Observer<any>[] = [];
	currentUser: User;

	constructor() {
		this.socket = socketIo(`${environment.apiUrl}`);
		this.onConnect();
		this.socket.on('invite', (res) => {
			//this.observer.next(res.data);
			localStorage.setItem('newInvite', "true");
			this.obs.forEach(o => o.next(res.data));
		});
	}

	getInvites() : Observable<any> {


		return this.createObservable();
	}

	sendMessage(event: string, data: any) : void {
		this.socket.emit(event, data);
	}

	sendTest(): void {
		//this.sendMessage(this.currentUser['_id']+'.invite', { invite: "test" });
		this.sendMessage(this.currentUser['_id']+'.invite', { data: true });
	}


	onConnect() : void {
		this.socket.on('connect', (data) => {
			if(localStorage.getItem('currentUser') != null) {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				//alert(this.currentUser['_id']);
				this.socket.emit("clientId", { id: this.currentUser['_id'] });
			}
		});
	}

	createObservable() : Observable<any> {
		return new Observable(observer => {
			//this.observer = observer;
			this.obs.push(observer);
		});
	}

	reset() : void {
		localStorage.setItem('newInvite', "false");
		this.obs.forEach(o => o.next(false));

	}

	private handleError(error) {
		console.error('server error:', error);
		if (error.error instanceof Error) {
			let errMessage = error.error.message;
			return Observable.throw(errMessage);
		}
		return Observable.throw(error || 'Socket.io server error');
	}

}
