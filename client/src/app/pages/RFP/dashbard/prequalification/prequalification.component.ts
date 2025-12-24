import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


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
  showInitialBoxes = true;

  constructor(
    private modal: NzModalService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  onBoxClick(type: string): void {
    if (type === 'create') {
      this.showInitialBoxes = false;
    } else if (type === 'view') {
      // Navigate to dashboard or list view
      this.router.navigate(['/rfp/myprequal']);
    }
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
    nzTitle: this.translate.instant('COMMON.SUCCESS'),
    nzContent: this.translate.instant('FORM.SUBMIT_SUCCESS'),
    nzCentered: true,
    nzOkText: this.translate.instant('COMMON.OK'),
    nzWidth: 400,
    nzOnOk: () => {
      this.resetForm();
    }
  });
}

  resetForm(): void {
    this.currentStep = 0;
    this.placeOfExecution = 'inside';
    this.selectedFileName = '';
    this.selectedFile = null;
  }

}
