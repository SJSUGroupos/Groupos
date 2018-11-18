import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'decToTime'
})
export class DecToTimePipe implements PipeTransform {

	transform(value: number, args?: any): string {
		return this.retTimeString(value);
	}

	retTimeString(time: number): string {
		var per = 'AM';	
		var mins = (Math.round(time%1*60));
		var hour = Math.floor(time);
		if(hour > 12){
			hour = hour - 12;
			per = 'PM';
		}
		return hour.toString()+":"+this.fillMinutesWithZ(mins.toString())+" "+per;
	}

	fillMinutesWithZ(mins: string) {
		if(parseInt(mins) < 10) {
			return mins = "0"+mins;
		}
	}
}
