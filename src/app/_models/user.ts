export class User {
	id: number;
	avatar: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	major: string;
	availabilities: {
		monday: [[Date]],
			tuesday: [[Date]],
			wednesday: [[Date]],
			thursday: [[Date]],
			friday: [[Date]],
			saturday: [[Date]],
			sunday: [[Date]]
	};
		coursework: [String];
}
