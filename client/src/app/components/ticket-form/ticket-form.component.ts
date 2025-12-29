import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-ticket-form',
  template: `
    <form nz-form [formGroup]="ticketForm" (ngSubmit)="submitTicket()">
      
      <!-- Issue Title -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>
          {{ cs.userLanguage === 'ar' ? 'عنوان المشكلة' : 'Issue Title' }}
        </nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="title"
                 [placeholder]="cs.userLanguage === 'ar' ? 'أدخل عنوان المشكلة' : 'Enter issue title'" />
        </nz-form-control>
      </nz-form-item>

      <!-- Description -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>
          {{ cs.userLanguage === 'ar' ? 'الوصف' : 'Description' }}
        </nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea nz-input rows="4" formControlName="description"
            [placeholder]="cs.userLanguage === 'ar' ? 'اوصف مشكلتك' : 'Describe your issue'">
          </textarea>
        </nz-form-control>
      </nz-form-item>

      <!-- Category -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>
          {{ cs.userLanguage === 'ar' ? 'التصنيف' : 'Category' }}
        </nz-form-label>

        <nz-form-control [nzSpan]="18">
          <nz-select
            formControlName="category"
            [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'حدد الفئة' : 'Select category'">
            
            <ng-container *ngIf="!isAdmin">
              <nz-option nzValue="Procedures & Policies" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'إجراءات وسياسات' : 'Procedures & Policies'">
              </nz-option>

              <nz-option nzValue="Proposal" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'مقترح' : 'Proposal'">
              </nz-option>

              <nz-option nzValue="Priority" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'أولوية' : 'Priority'">
              </nz-option>

              <nz-option nzValue="Indicators" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'مؤشرات' : 'Indicators'">
              </nz-option>

              <nz-option nzValue="Achievements" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'منجزات' : 'Achievements'">
              </nz-option>

              <nz-option nzValue="Leadership Recommendations" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'توصيات قيادية' : 'Leadership Recommendations'">
              </nz-option>

              <nz-option nzValue="OtherText"
                [nzLabel]="cs.userLanguage === 'ar' ? 'أخرى (نص)' : 'Other (Text)'">
              </nz-option>
            </ng-container>

            <ng-container *ngIf="isAdmin">
              <nz-option nzValue="Procedures" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'إجراءات' : 'Procedures'">
              </nz-option>

              <nz-option nzValue="Approvals" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'تصاريح' : 'Approvals'">
              </nz-option>

              <nz-option nzValue="Priority" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'أولوية' : 'Priority'">
              </nz-option>

              <nz-option nzValue="Processing Time" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'مدة الإجراء' : 'Processing Time'">
              </nz-option>

              <nz-option nzValue="Weekly Deliverables" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'مخرجات أسبوعية' : 'Weekly Deliverables'">
              </nz-option>

              <nz-option nzValue="Leadership Recommendations" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'توصيات قيادية' : 'Leadership Recommendations'">
              </nz-option>

              <nz-option nzValue="Service Level Agreement" 
                [nzLabel]="cs.userLanguage === 'ar' ? 'ضمانات (SLA)' : 'Service Level Agreement (SLA)'">
              </nz-option>

              <nz-option nzValue="OtherText"
                [nzLabel]="cs.userLanguage === 'ar' ? 'أخرى (نص / Text)' : 'Other (Text)'">
              </nz-option>
            </ng-container>

          </nz-select>

          <!-- Other Text Field -->
          <div *ngIf="showOtherText" style="margin-top:10px">
            <input nz-input formControlName="otherCategory"
              [placeholder]="cs.userLanguage === 'ar' ? 'أدخل فئة أخرى' : 'Enter other category'"/>
          </div>
        </nz-form-control>
      </nz-form-item>

      <!-- Priority -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>
          {{ cs.userLanguage === 'ar' ? 'الأولوية' : 'Priority' }}
        </nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="priority"
            [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر الأولوية' : 'Select priority'">

            <nz-option nzValue="Low" [nzLabel]="cs.userLanguage === 'ar' ? 'منخفضة' : 'Low'"></nz-option>
            <nz-option nzValue="Medium" [nzLabel]="cs.userLanguage === 'ar' ? 'متوسطة' : 'Medium'"></nz-option>
            <nz-option nzValue="High" [nzLabel]="cs.userLanguage === 'ar' ? 'عالية' : 'High'"></nz-option>
            <nz-option nzValue="Critical" [nzLabel]="cs.userLanguage === 'ar' ? 'حرجة' : 'Critical'"></nz-option>

          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <!-- Assign To (Admin Only - Mandatory) -->
      <nz-form-item *ngIf="isAdmin">
        <nz-form-label [nzSpan]="6" nzRequired>
          {{ cs.userLanguage === 'ar' ? 'تعيين إلى' : 'Assign to' }}
        </nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="assignTo"
            [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر المستخدم' : 'Select user'">
            <nz-option *ngFor="let user of usersList" [nzValue]="user.id" [nzLabel]="user.name"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <!-- Attachment (Admin Only - Mandatory) -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" [nzRequired]="isAdmin">
          {{ cs.userLanguage === 'ar' ? 'المرفقات' : 'Attachments' }}
        </nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-upload nzAction="" [nzBeforeUpload]="beforeUpload" nzListType="picture">
            <button nz-button>
              <i nz-icon nzType="upload"></i>
              {{ cs.userLanguage === 'ar' ? 'رفع المرفقات' : 'Upload Attachments' }}
            </button>
          </nz-upload>
          <div *ngIf="isAdmin && !uploadedFile" style="color: red; font-size: 12px; margin-top: 4px;">
            {{ cs.userLanguage === 'ar' ? 'المرفق مطلوب' : 'Attachment is required' }}
          </div>
        </nz-form-control>
      </nz-form-item>

      <!-- Buttons -->
      <div class="form-actions">
        <button nz-button nzType="default" (click)="cancel()">
          {{ cs.userLanguage === 'ar' ? 'إلغاء' : 'Cancel' }}
        </button>

        <button nz-button nzType="primary"
          [nzLoading]="loading"
          [disabled]="!isFormValid()"
          type="submit">
          {{ cs.userLanguage === 'ar' ? 'إرسال التذكرة' : 'Submit Ticket' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-actions{
      text-align:right;
      margin-top:24px;
    }
  `]
})
export class TicketFormComponent {

  ticketForm: FormGroup;
  loading = false;
  uploadedFile: any = null;
  showOtherText = false;
  isAdmin = false;
  usersList = [
    { id: 's1', name: 'Support User 1' },
    { id: 's2', name: 'Support User 2' },
    { id: 's3', name: 'Support User 3' }
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    public cs: CommonService
  ) {

    const username = localStorage.getItem('username');
    this.isAdmin = username ? atob(username).toUpperCase() === 'ADMIN' : false;

    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['Medium', Validators.required],
      category: ['', Validators.required],
      otherCategory: [''],
      assignTo: ['']
    });

    // Set assignTo as required for admin
    if (this.isAdmin) {
      this.ticketForm.get('assignTo')?.setValidators([Validators.required]);
      this.ticketForm.get('assignTo')?.updateValueAndValidity();
    }

    // Listen for category change
    this.ticketForm.get('category')?.valueChanges.subscribe(value => {
      this.showOtherText = value === 'OtherText';

      if (this.showOtherText) {
        this.ticketForm.get('otherCategory')?.setValidators([Validators.required]);
      } else {
        this.ticketForm.get('otherCategory')?.clearValidators();
        this.ticketForm.get('otherCategory')?.setValue('');
      }

      this.ticketForm.get('otherCategory')?.updateValueAndValidity();
    });
  }

  beforeUpload = (file: any): boolean => {
    this.uploadedFile = file.originFileObj || file;
    return false;
  };

  isFormValid(): boolean {
    if (!this.ticketForm.valid) return false;
    if (this.isAdmin && !this.uploadedFile) return false;
    return true;
  }

  submitTicket() {
    if (!this.ticketForm.valid) return;

    this.loading = true;

    const formData = this.ticketForm.value;

    const finalCategory = formData.category === 'OtherText'
      ? formData.otherCategory
      : formData.category;

    const newTicket = {
      ticketNumber: 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      ...formData,
      category: finalCategory,
      status: 'Open',
      screenshot: this.uploadedFile?.name,
      assignedTo: formData.assignTo || '',
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    this.loading = false;

    this.message.success(
      this.cs.userLanguage === 'ar'
        ? `تم إنشاء التذكرة ${newTicket.ticketNumber} بنجاح!`
        : `Ticket ${newTicket.ticketNumber} created successfully!`
    );

    this.modal.close(newTicket);
  }

  cancel() {
    this.modal.close();
  }
}
