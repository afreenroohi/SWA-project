import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RFPService } from 'src/app/service/RFP/rfp.service';

@Component({
  selector: 'app-ticket-form',
  template: `
    <form nz-form [formGroup]="ticketForm" (ngSubmit)="submitTicket()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Issue Title</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="title" placeholder="Enter issue title" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Description</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea nz-input formControlName="description" rows="4" 
                    placeholder="Describe your issue"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Priority</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="priority" nzPlaceHolder="Select priority">
            <nz-option nzValue="Low" nzLabel="Low"></nz-option>
            <nz-option nzValue="Medium" nzLabel="Medium"></nz-option>
            <nz-option nzValue="High" nzLabel="High"></nz-option>
            <nz-option nzValue="Critical" nzLabel="Critical"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">Screenshot</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-upload nzAction="" [nzBeforeUpload]="beforeUpload" nzListType="picture">
            <button nz-button>
              <i nz-icon nzType="upload"></i>
              Upload Screenshot
            </button>
          </nz-upload>
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button nz-button nzType="default" (click)="cancel()">Cancel</button>
        <button nz-button nzType="primary" [nzLoading]="loading" 
                [disabled]="!ticketForm.valid" type="submit">
          Submit Ticket
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
    private rfpService: RFPService
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

      const newTicket = this.rfpService.addTicket(ticketData);
      
      this.loading = false;
      this.message.success(`Ticket ${newTicket.ticketNumber} created successfully!`);
      this.modal.close(newTicket);
    }
  }

  cancel() {
    this.modal.close();
  }
}