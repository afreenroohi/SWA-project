import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwoDigitDecimalNumbersDirective } from '../directives/two-digit-decimal-numbers.directive';
import { SubmitConfirmationDirective } from '../directives/submit-confirmation.directive';
import { AllowOnlyAlphabetsDirective } from '../directives/allow-only-alphabets.directive';
import { NumericDirective } from '../directives/numeric.directive';
import { DatePipe } from '../pipes/date.pipe';

const items = [TwoDigitDecimalNumbersDirective, SubmitConfirmationDirective, AllowOnlyAlphabetsDirective, NumericDirective, DatePipe];

const COMPONENTS = [TwoDigitDecimalNumbersDirective, SubmitConfirmationDirective];

@NgModule({
  declarations: items,
  imports: [CommonModule],
  exports: items,
})
export class SharedCustomModule {}
