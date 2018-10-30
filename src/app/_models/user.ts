export class User {
	_id: string;
	avatar: string;
	username: string;
	email: string;
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
