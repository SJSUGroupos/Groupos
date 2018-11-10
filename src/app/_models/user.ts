export class User {
	_id: string;
	avatar: string;
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	major: string;
	availabilities: 
	{ 
		monday: [{
			startTime: Date,
			endTime: Date
		}],
		tuesday: [{
			startTime: Date,
			endTime: Date
		}],
		wednesday: [{
			startTime: Date,
			endTime: Date
		}],
		thursday: [{
			startTime: Date,
			endTime: Date
		}],
		friday: [{
			startTime: Date,
			endTime: Date
		}],
		saturday: [{
			startTime: Date,
			endTime: Date
		}],
		sunday: [{
			startTime: Date,
			endTime: Date
		}]
	};
	coursework: [String];
}
