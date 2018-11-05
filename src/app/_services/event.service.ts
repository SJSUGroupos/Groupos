import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Event } from '../_models';

@Injectable()
export class EventService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Event[]>(`${environment.apiUrl}/events`);
    }

    getById(id: string) {
        return this.http.get<Event>(`${environment.apiUrl}/events/` + id);
    }

    createEvent(event: Event) {
        return this.http.post(`${environment.apiUrl}/events/new`, event);
    }

    update(event: Event, id) {
        return this.http.put(`${environment.apiUrl}/events/` + id, event);
    }

    subscribe(id, userInfo) {
		return this.http.put(`${environment.apiUrl}/events/sub/` + id, userInfo);
    }

    unsubscribe(id, userId) {
		return this.http.put(`${environment.apiUrl}/events/unsub/` + id, userId);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/events/` + id);
    }
}
