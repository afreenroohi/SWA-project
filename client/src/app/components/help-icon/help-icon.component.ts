import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-help-icon',
  template: `
    <div class="help-icon-container" [ngClass]="{
      'rtl-position': cs.userLanguage === 'ar'
    }">
      <button nz-button nzType="primary" nzShape="circle" nzSize="large" 
              (click)="openTicketForm()" class="help-button">
        <i nz-icon nzType="customer-service" nzTheme="outline"></i>
      </button>
    </div>
  `,
  styles: [`
    .help-icon-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .help-icon-container.rtl-position {
      right: auto;
      left: 20px;
    }
    .help-button {
      width: 60px;
      height: 60px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class HelpIconComponent {
  constructor(private modal: NzModalService, public cs: CommonService) {}

  openTicketForm() {
    this.modal.create({
      nzTitle: this.cs.userLanguage === 'ar' ? 'إرسال تذكرة دعم' : 'Submit Support Ticket',
      nzContent: TicketFormComponent,
      nzFooter: null,
      nzWidth: 600
    });
  }
}