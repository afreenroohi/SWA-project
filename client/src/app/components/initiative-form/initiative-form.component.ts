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
        <nz-form-label nzRequired nzFor="title">{{ cs.userLanguage === 'ar' ? 'عنوان المبادرة' : 'Initiative Title' }}</nz-form-label>
        <nz-form-control>
          <input nz-input id="title" formControlName="title" 
                 [placeholder]="cs.userLanguage === 'ar' ? 'أدخل عنوان المبادرة' : 'Enter initiative title'" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired nzFor="description">{{ cs.userLanguage === 'ar' ? 'الوصف' : 'Description' }}</nz-form-label>
        <nz-form-control>
          <textarea nz-input id="description" formControlName="description" rows="4" 
                    [placeholder]="cs.userLanguage === 'ar' ? 'اوصف مبادرتك' : 'Describe your initiative'"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired nzFor="benefitedDepartments">{{ cs.userLanguage === 'ar' ? 'الأقسام المستفيدة' : 'Benefited Departments' }}</nz-form-label>
        <nz-form-control>
          <nz-select id="benefitedDepartments" formControlName="benefitedDepartments" 
                     [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر الأقسام المستفيدة' : 'Select benefited departments'">
            <nz-option nzValue="department1" [nzLabel]="cs.userLanguage === 'ar' ? 'القسم الأول' : 'Department1'"></nz-option>
            <nz-option nzValue="department2" [nzLabel]="cs.userLanguage === 'ar' ? 'القسم الثاني' : 'Department2'"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>{{ cs.userLanguage === 'ar' ? 'رفعت بواسطة' : 'Raised By' }}</nz-form-label>
        <nz-form-control>
          <nz-switch [(ngModel)]="raisedByMe" [ngModelOptions]="{standalone: true}" 
                     (ngModelChange)="onRaisedByChange($event)"
                     [nzCheckedChildren]="cs.userLanguage === 'ar' ? 'أنا' : 'Me'" 
                     [nzUnCheckedChildren]="cs.userLanguage === 'ar' ? 'آخر' : 'Other'"></nz-switch>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item *ngIf="!raisedByMe">
        <nz-form-label nzRequired nzFor="raisedByUser">{{ cs.userLanguage === 'ar' ? 'اختر المستخدم' : 'Select User' }}</nz-form-label>
        <nz-form-control>
          <nz-select id="raisedByUser" formControlName="raisedByUser" 
                     [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر المستخدم' : 'Select user'">
            <nz-option *ngFor="let user of usersList" [nzValue]="user.id" [nzLabel]="user.name"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="impacts">{{ cs.userLanguage === 'ar' ? 'التأثيرات' : 'Impacts' }}</nz-form-label>
        <nz-form-control>
          <nz-select id="impacts" formControlName="impacts" 
                     [nzPlaceHolder]="cs.userLanguage === 'ar' ? 'اختر التأثير' : 'Select impact'">
            <nz-option nzValue="1" nzLabel="1"></nz-option>
            <nz-option nzValue="2" nzLabel="2"></nz-option>
            <nz-option nzValue="3" nzLabel="3"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>{{ cs.userLanguage === 'ar' ? 'المرفقات' : 'Attachments' }}</nz-form-label>
        <nz-form-control>
          <nz-upload nzAction="" [nzBeforeUpload]="beforeUpload" nzListType="picture">
            <button nz-button type="button">
              <i nz-icon nzType="upload"></i>
              {{ cs.userLanguage === 'ar' ? 'رفع المرفقات' : 'Upload Attachments' }}
            </button>
          </nz-upload>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="default" (click)="cancel()" type="button" style="margin-right: 8px;">
            {{ cs.userLanguage === 'ar' ? 'إلغاء' : 'Cancel' }}
          </button>
          <button nz-button nzType="primary" [nzLoading]="loading" 
                  [disabled]="!initiativeForm.valid" type="submit">
            {{ cs.userLanguage === 'ar' ? 'إرسال المبادرة' : 'Submit Initiative' }}
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [`
    nz-form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    nz-form-item {
      margin-bottom: 20px;
    }
    nz-form-control {
      display: block;
    }
  `]
})
export class InitiativeFormComponent {
  initiativeForm: FormGroup;
  loading = false;
  uploadedFile: any = null;
  raisedByMe = true;
  usersList = [
    { id: 'user1', name: 'User 1' },
    { id: 'user2', name: 'User 2' },
    { id: 'user3', name: 'User 3' }
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    public cs: CommonService
  ) {
    this.initiativeForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      benefitedDepartments: ['', [Validators.required]],
      raisedBy: ['me'],
      raisedByUser: [null],
      impacts: ['']
    });
  }

  onRaisedByChange(value: boolean) {
    this.raisedByMe = value;
    if (value) {
      this.initiativeForm.patchValue({ raisedBy: 'me', raisedByUser: null });
      this.initiativeForm.get('raisedByUser')?.clearValidators();
    } else {
      this.initiativeForm.patchValue({ raisedBy: 'other' });
      this.initiativeForm.get('raisedByUser')?.setValidators([Validators.required]);
    }
    this.initiativeForm.get('raisedByUser')?.updateValueAndValidity();
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