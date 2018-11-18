import { Validators, ValidationErrors, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';



export class FormValidators {
	
	
	courseSelected(myArray: any[]): ValidatorFn {

		return (c: AbstractControl): { [key: string]: boolean } | null => {
			let selectboxValue = c.value;
			if(c.value == ''){
				return null;
			}
			let pickedOrNot = myArray.filter(alias => alias.label+' - '+alias.title === selectboxValue);

			if (pickedOrNot.length > 0) {
				// everything's fine. return no error. therefore it's null.
				return null;

			} else {
				//there's no matching selectboxvalue selected. so return match error.
				return { 'match': true };
			}
		}
	}
}
