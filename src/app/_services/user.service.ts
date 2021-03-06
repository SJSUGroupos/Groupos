﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getInvites(id: string) {
		return this.http.get(`${environment.apiUrl}/users/getinvites/` + id);
    }

	sendInvite(data: any) {
		return this.http.put<any[]>(`${environment.apiUrl}/users/sendinvite`, data);
    }

	getUsersByTime(criteria: any) {
		return this.http.put<any[]>(`${environment.apiUrl}/users/usersbytime`, criteria);
    }

	uploadAvatar(filename: any) {
		return this.http.post(`${environment.apiUrl}/users/avatar`, filename)
	}

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get(`${environment.apiUrl}/users/` + id);
    }

    getByCriteria(criteria: object) {
		return this.http.get<User[]>(`${environment.apiUrl}/users/search`, criteria);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/` + user._id, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/` + id);
    }

    deleteInvite(inviteData: any) {
		return this.http.put<any>(`${environment.apiUrl}/users/deleteInvite`, inviteData);
    }
}
