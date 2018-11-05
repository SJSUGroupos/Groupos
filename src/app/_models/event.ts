import {Event_Subscriber} from './event_subscriber';

export class Event {
	_id: string;
	creator: string;
	subscribers: Array<Event_Subscriber>; 
	public: boolean;
	description: string;
	eventName: string;
	eventDate: string;
	eventPlace: string;
	eventStartTime: Date;
	eventEndTime: Date;
	eventCourse: string;
	createdDate: string;
}
