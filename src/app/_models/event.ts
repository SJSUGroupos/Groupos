export class Event {
	_id: string;
	creator: string;
	subscribers: [string];
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
