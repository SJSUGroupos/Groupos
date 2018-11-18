import {Availabilities} from './availabilities';

export class User {
	_id: string;
	avatar: string;
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	major: string;
	availabilities: Availabilities;
	coursework: [String];
}
