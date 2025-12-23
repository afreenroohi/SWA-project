import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TicketFormComponent } from '../../../components/ticket-form/ticket-form.component';
import { CommonService } from '../../../service/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-support-tickets',
  templateUrl: './my-support-tickets.component.html',
  styleUrls: ['./my-support-tickets.component.scss']
})
export class MySupportTicketsComponent implements OnInit {
  showInitialBoxes = true;
  selectedAction = '';

  // KPI Data
  totalTickets = 0;
  openTickets = 0;
  inProgressTickets = 0;
  closedTickets = 0;

  // Sample ticket data
  tickets = [
    {
      id: 'TKT-001',
      subject: 'SupportTickets.LoginIssue',
      description: 'SupportTickets.LoginIssueDesc',
      priority: 'High',
      status: 'Open',
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-16'),
      adminMessage: null
    },
    {
      id: 'TKT-002',
      subject: 'SupportTickets.FeatureRequest',
      description: 'SupportTickets.FeatureRequestDesc',
      priority: 'Medium',
      status: 'In-Progress',
      createdDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-14'),
      adminMessage: null
    },
    {
      id: 'TKT-003',
      subject: 'SupportTickets.BugReport',
      description: 'SupportTickets.BugReportDesc',
      priority: 'High',
      status: 'Closed',
      createdDate: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-12'),
      adminMessage: 'SupportTickets.BugReportAdminMsg'
    },
    {
      id: 'TKT-004',
      subject: 'SupportTickets.GeneralInquiry',
      description: 'SupportTickets.GeneralInquiryDesc',
      priority: 'Low',
      status: 'Open',
      createdDate: new Date('2024-01-08'),
      lastUpdated: new Date('2024-01-09'),
      adminMessage: null
    },
    {
      id: 'TKT-005',
      subject: 'SupportTickets.PasswordReset',
      description: 'SupportTickets.PasswordResetDesc',
      priority: 'Medium',
      status: 'Closed',
      createdDate: new Date('2024-01-12'),
      lastUpdated: new Date('2024-01-15'),
      adminMessage: 'SupportTickets.PasswordResetAdminMsg'
    }
  ];

  constructor(private modal: NzModalService, public cs: CommonService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.calculateKPIs();
  }

  onBoxClick(action: string): void {
    if (action === 'create') {
      this.openTicketForm();
    } else if (action === 'view') {
      this.selectedAction = action;
      this.showInitialBoxes = false;
    }
  }

  openTicketForm(): void {
    this.modal.create({
      nzTitle: this.translate.instant('SupportTickets.SubmitSupportTicket'),
      nzContent: TicketFormComponent,
      nzFooter: null,
      nzWidth: 600
    });
  }

  calculateKPIs(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'Open').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'In-Progress').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'Closed').length;
  }

  viewTicket(ticket: any): void {
    console.log('Viewing ticket:', ticket);
    // Implement ticket detail view
  }

  goBack(): void {
    this.showInitialBoxes = true;
    this.selectedAction = '';
  }
}