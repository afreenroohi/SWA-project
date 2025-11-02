import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const initialValue = this.el.nativeElement.value;

    // Replace any non-numeric character
    this.el.nativeElement.value = initialValue.replace(/[^0-9]/g, '');

    // If the value was changed, dispatch an input event to update Angular form control
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
