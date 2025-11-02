import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { IslamicI18n } from '../hijri-datepicker/hijri-datepicker.component';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'hijri-input',
  templateUrl: './hijri-input.component.html',
  styleUrls: ['./hijri-input.component.scss'],
  providers: [DatePipe,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura }, //year
    { provide: NgbDatepickerI18n, useClass: IslamicI18n } // month , week days
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class HijriInputComponent implements OnInit {

  @Input() ControlName = '';

  hovering = false;

  constructor(private ControlContainer: ControlContainer) { }

  ngOnInit(): void {
  }

  change() {
    this.hovering = false;
  }

  clearDate() {
    this.ControlContainer.control?.get(this.ControlName)?.setValue('');
  }

  // * Getter methods
  get showClear(): boolean {
    if (this.ControlContainer.control?.get(this.ControlName)?.value) {
      return false;
    }
    return true;
  }
}
