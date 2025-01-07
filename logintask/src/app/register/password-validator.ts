
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    const minLength = password && password.length >= 6;
    const startsWithCapital = /^[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password && (!minLength || !startsWithCapital || !hasNumbers || !hasSpecialChar)) {
      return {
        passwordStrength: {
          minLength,
          startsWithCapital,
          hasNumbers,
          hasSpecialChar,
        },
      };
    }

    return null;
  };
}
