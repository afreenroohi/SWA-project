import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-initiative-form',
  template: `
    <form nz-form [formGroup]="initiativeForm" (ngSubmit)="submitInitiative()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'عنوان المبادرة' : 'Initiative Title' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="title" [placeholder]="cs.userLanguage === 'ar' ? 'أدخل عنوان المبادرة' : 'Enter initiative title'" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'الوصف' : 'Description' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea nz-input formControlName="description" rows="4" 
                    [placeholder]="cs.userLanguage === 'ar' ? 'اوصف مبادرتك' : 'Describe your initiative'"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'الأقسام المستفيدة' : 'Benefited Departments' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="benefitedDepartments" [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر الأقسام المستفيدة' : 'Select benefited departments'">
            <nz-option nzValue="department1" [nzLabel]="cs.userLanguage === 'ar' ? 'القسم الأول' : 'Department1'"></nz-option>
            <nz-option nzValue="department2" [nzLabel]="cs.userLanguage === 'ar' ? 'القسم الثاني' : 'Department2'"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">{{ cs.userLanguage === 'ar' ? 'المرفقات' : 'Attachments' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-upload nzAction="" [nzBeforeUpload]="beforeUpload" nzListType="picture">
            <button nz-button>
              <i nz-icon nzType="upload"></i>
              {{ cs.userLanguage === 'ar' ? 'رفع المرفقات' : 'Upload Attachments' }}
            </button>
          </nz-upload>
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button nz-button nzType="default" (click)="cancel()">{{ cs.userLanguage === 'ar' ? 'إلغاء' : 'Cancel' }}</button>
        <button nz-button nzType="primary" [nzLoading]="loading" 
                [disabled]="!initiativeForm.valid" type="submit">
          {{ cs.userLanguage === 'ar' ? 'إرسال المبادرة' : 'Submit Initiative' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-actions {
      text-align: right;
      margin-top: 24px;
    }
    .form-actions button {
      margin-left: 8px;
    }
  `]
})
export class InitiativeFormComponent {
  initiativeForm: FormGroup;
  loading = false;
  uploadedFile: any = null;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    public cs: CommonService
  ) {
    this.initiativeForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      benefitedDepartments: ['', [Validators.required]]
    });
  }

  beforeUpload = (file: any): boolean => {
    this.uploadedFile = file.originFileObj || file;
    return false; // Prevent auto upload
  };

  submitInitiative() {
    if (this.initiativeForm.valid) {
      this.loading = true;
      
      const initiativeData = {
        ...this.initiativeForm.value,
        status: 'Submitted',
        attachment: this.uploadedFile ? (this.uploadedFile.name || this.uploadedFile.fileName) : undefined
      };

      // Simulate initiative creation
      const newInitiative = {
        initiativeNumber: 'INI-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        ...initiativeData,
        createdDate: new Date(),
        lastUpdated: new Date()
      };
      
      this.loading = false;
      this.message.success(this.cs.userLanguage === 'ar' ? 
        `تم إنشاء المبادرة ${newInitiative.initiativeNumber} بنجاح!` : 
        `Initiative ${newInitiative.initiativeNumber} created successfully!`);
      this.modal.close(newInitiative);
    }
  }

  cancel() {
    this.modal.close();
  }
}