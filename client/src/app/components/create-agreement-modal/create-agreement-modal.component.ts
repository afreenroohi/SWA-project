import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-agreement-modal',
  templateUrl: './create-agreement-modal.component.html',
  styleUrls: ['./create-agreement-modal.component.scss']
})
export class CreateAgreementModalComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() optionSelected = new EventEmitter<string>();

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  selectOption(option: string): void {
    this.optionSelected.emit(option);
    this.handleCancel();
  }
}
