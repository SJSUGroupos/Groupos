export class Event {
	creator: string;
	subscribers: [string];
	public: boolean;
	description: string;
	eventName: string;
	eventDate: string;
	eventPlace: string;
	eventTime: Date;
	eventCourse: string;
	createdDate: string;


	/*constructor(eventId:number) 
	{
		this.eventId = eventId;
	}*/
}
