import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="alphabets"]'
})
export class AllowOnlyAlphabetsDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: InputEvent) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[\d]+/g, '').replace(/\s\s+/g, ' ');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
