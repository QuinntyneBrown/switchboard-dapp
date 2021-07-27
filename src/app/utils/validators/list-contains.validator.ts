import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function listContainsValidator<T>(source: T[], property: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const exists = source.find(key => key[property] === control.value);
      return exists ? {listContains: {value: control.value}} : null;
    };
}