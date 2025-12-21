import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-prequalification',
  templateUrl: './prequalification.component.html',
  styleUrls: ['./prequalification.component.scss']
})
export class PrequalificationComponent implements OnInit {
  currentStep = 0;
  placeOfExecution = 'inside';
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  saveAndContinue(): void {
    this.currentStep++;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  submitForm(): void {
    this.modal.success({
      nzTitle: 'Success',
      nzContent: 'Form submitted successfully!',
      nzCentered: true,
      nzOkText: 'OK',
      nzWidth: 400
    });
  }

}
