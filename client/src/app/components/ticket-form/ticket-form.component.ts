import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-ticket-form',
  template: `
    <form nz-form [formGroup]="ticketForm" (ngSubmit)="submitTicket()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'عنوان المشكلة' : 'Issue Title' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="title" [placeholder]="cs.userLanguage === 'ar' ? 'أدخل عنوان المشكلة' : 'Enter issue title'" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'الوصف' : 'Description' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea nz-input formControlName="description" rows="4" 
                    [placeholder]="cs.userLanguage === 'ar' ? 'اوصف مشكلتك' : 'Describe your issue'"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>{{ cs.userLanguage === 'ar' ? 'الأولوية' : 'Priority' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="priority" [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر الأولوية' : 'Select priority'">
            <nz-option nzValue="Low" [nzLabel]="cs.userLanguage === 'ar' ? 'منخفضة' : 'Low'"></nz-option>
            <nz-option nzValue="Medium" [nzLabel]="cs.userLanguage === 'ar' ? 'متوسطة' : 'Medium'"></nz-option>
            <nz-option nzValue="High" [nzLabel]="cs.userLanguage === 'ar' ? 'عالية' : 'High'"></nz-option>
            <nz-option nzValue="Critical" [nzLabel]="cs.userLanguage === 'ar' ? 'حرجة' : 'Critical'"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">{{ cs.userLanguage === 'ar' ? 'لقطة الشاشة' : 'Screenshot' }}</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-upload nzAction="" [nzBeforeUpload]="beforeUpload" nzListType="picture">
            <button nz-button>
              <i nz-icon nzType="upload"></i>
              {{ cs.userLanguage === 'ar' ? 'رفع لقطة الشاشة' : 'Upload Screenshot' }}
            </button>
          </nz-upload>
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button nz-button nzType="default" (click)="cancel()">{{ cs.userLanguage === 'ar' ? 'إلغاء' : 'Cancel' }}</button>
        <button nz-button nzType="primary" [nzLoading]="loading" 
                [disabled]="!ticketForm.valid" type="submit">
          {{ cs.userLanguage === 'ar' ? 'إرسال التذكرة' : 'Submit Ticket' }}
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
export class TicketFormComponent {
  ticketForm: FormGroup;
  loading = false;
  uploadedFile: any = null;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    public cs: CommonService
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['Medium', [Validators.required]]
    });
  }

  beforeUpload = (file: any): boolean => {
    this.uploadedFile = file.originFileObj || file;
    return false; // Prevent auto upload
  };

  submitTicket() {
    if (this.ticketForm.valid) {
      this.loading = true;
      
      const ticketData = {
        ...this.ticketForm.value,
        status: 'Open',
        screenshot: this.uploadedFile ? (this.uploadedFile.name || this.uploadedFile.fileName) : undefined
      };

      // Simulate ticket creation
      const newTicket = {
        ticketNumber: 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        ...ticketData,
        createdDate: new Date(),
        lastUpdated: new Date()
      };
      
      this.loading = false;
      this.message.success(this.cs.userLanguage === 'ar' ? 
        `تم إنشاء التذكرة ${newTicket.ticketNumber} بنجاح!` : 
        `Ticket ${newTicket.ticketNumber} created successfully!`);
      this.modal.close(newTicket);
    }
  }

  cancel() {
    this.modal.close();
  }
}