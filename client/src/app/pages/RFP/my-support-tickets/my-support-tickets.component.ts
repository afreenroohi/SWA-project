import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TicketFormComponent } from '../../../components/ticket-form/ticket-form.component';
import { InitiativeFormComponent } from '../../../components/initiative-form/initiative-form.component';
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
  showCategoryBoxes = false;
  selectedCategory = '';

  // KPI Data
  totalTickets = 0;
  openTickets = 0;
  inProgressTickets = 0;
  closedTickets = 0;

  // Initiative KPI Data
  totalInitiatives = 0;
  submittedInitiatives = 0;
  inReviewInitiatives = 0;
  approvedInitiatives = 0;

  // SCM Initiative KPI Data
  totalSCMInitiatives = 0;
  highPrioritySCMInitiatives = 0;
  openSCMInitiatives = 0;

  // Sample ticket data
  tickets = [
    {
      id: 'TKT-001',
      subject: 'SupportTickets.LoginIssue',
      description: 'SupportTickets.LoginIssueDesc',
      priority: 'High',
      status: 'Open',
      assignedTo: 'suser1',
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
      assignedTo: 'admin',
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
      assignedTo: 'suser2',
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
      assignedTo: 'suser1',
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
      assignedTo: 'admin',
      createdDate: new Date('2024-01-12'),
      lastUpdated: new Date('2024-01-15'),
      adminMessage: 'SupportTickets.PasswordResetAdminMsg'
    }
  ];

  // Sample initiative data
  initiatives = [
    {
      id: 'INI-001',
      title: 'ProcessAutomationInitiative',
      description: 'AutomateManualProcesses',
      category: 'Process Improvement',
      status: 'Submitted',
      assignedTo: 's1',
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-16'),
      adminMessage: null
    },
    {
      id: 'INI-002',
      title: 'CostReductionProgram',
      description: 'IdentifyCostOptimization',
      category: 'Cost Reduction',
      status: 'In-Review',
      assignedTo: 'admin',
      createdDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-14'),
      adminMessage: null
    },
    {
      id: 'INI-003',
      title: 'DigitalInnovationProject',
      description: 'ImplementDigitalSolutions',
      category: 'Innovation',
      status: 'Approved',
      assignedTo: 's2',
      createdDate: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-12'),
      adminMessage: 'InitiativeApprovedMsg'
    }
  ];

  // Sample SCM initiative data
  scmInitiatives = [
    {
      id: 'INI-001',
      title: 'Digital Transformation Initiative',
      description: 'Modernize legacy systems and implement digital solutions',
      category: 'SCM',
      status: 'Open',
      assignedTo: 'Take Initiative',
      createdDate: new Date('2024-01-20'),
      lastUpdated: new Date('2024-01-21'),
      adminMessage: null
    },
    {
      id: 'INI-002',
      title: 'Employee Training Program',
      description: 'Comprehensive training program for skill development',
      category: 'SCM',
      status: 'In-Progress',
      assignedTo: 's2',
      createdDate: new Date('2024-01-18'),
      lastUpdated: new Date('2024-01-22'),
      adminMessage: null
    },
    {
      id: 'INI-003',
      title: 'Green Energy Project',
      description: 'Implement renewable energy solutions',
      category: 'SCM',
      status: 'Open',
      assignedTo: 'Take Initiative',
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-19'),
      adminMessage: null
    },
    {
      id: 'INI-004',
      title: 'Customer Service Enhancement',
      description: 'Improve customer service processes and tools',
      category: 'SCM',
      status: 'Open',
      assignedTo: 'Take Initiative',
      createdDate: new Date('2024-01-12'),
      lastUpdated: new Date('2024-01-16'),
      adminMessage: null
    },
    {
      id: 'INI-005',
      title: 'Cost Optimization Initiative',
      description: 'Identify and implement cost-saving measures',
      category: 'SCM',
      status: 'Closed',
      assignedTo: 's2',
      createdDate: new Date('2024-01-08'),
      lastUpdated: new Date('2024-01-14'),
      adminMessage: null
    }
  ];

  constructor(private modal: NzModalService, public cs: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.calculateKPIs();
    this.calculateInitiativeKPIs();
    this.calculateSCMInitiativeKPIs();
  }

  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    this.showInitialBoxes = false;
    this.showCategoryBoxes = true;
  }

  onBoxClick(action: string): void {
    if (action === 'create-ticket') {
      this.openTicketForm();
    } else if (action === 'view-tickets') {
      this.selectedAction = 'view-tickets';
      this.showCategoryBoxes = false;
    } else if (action === 'create-initiative') {
      this.openInitiativeForm();
    } else if (action === 'view-initiatives') {
      this.selectedAction = 'view-initiatives';
      this.showCategoryBoxes = false;
    } else if (action === 'scm-initiative') {
      this.selectedAction = 'scm-initiative';
      this.showCategoryBoxes = false;
    }
  }

  openTicketForm(): void {
    try {
      const modal = this.modal.create({
        nzTitle: 'Submit Support Ticket', // Fallback title
        nzContent: TicketFormComponent,
        nzFooter: null,
        nzWidth: 600
      });

      modal.afterClose.subscribe(result => {
        if (result) {
          // Refresh tickets if a new ticket was created
          console.log('New ticket created:', result);
        }
      });
    } catch (error) {
      console.error('Error opening ticket form:', error);
    }
  }

  calculateKPIs(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'Open').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'In-Progress').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'Closed').length;
  }

  openInitiativeForm(): void {
    try {
      const modal = this.modal.create({
        nzTitle: 'Submit New Initiative',
        nzContent: InitiativeFormComponent,
        nzFooter: null,
        nzWidth: 600
      });

      modal.afterClose.subscribe(result => {
        if (result) {
          console.log('New initiative created:', result);
        }
      });
    } catch (error) {
      console.error('Error opening initiative form:', error);
    }
  }

  calculateInitiativeKPIs(): void {
    this.totalInitiatives = this.initiatives.length;
    this.submittedInitiatives = this.initiatives.filter(i => i.status === 'Submitted').length;
    this.inReviewInitiatives = this.initiatives.filter(i => i.status === 'In-Review').length;
    this.approvedInitiatives = this.initiatives.filter(i => i.status === 'Approved').length;
  }

  calculateSCMInitiativeKPIs(): void {
    this.totalSCMInitiatives = this.scmInitiatives.length;
    this.highPrioritySCMInitiatives = this.scmInitiatives.filter(i => i.status === 'In-Review').length;
    this.openSCMInitiatives = this.scmInitiatives.filter(i => i.status === 'Open' || i.status === 'Submitted').length;
  }

  viewTicket(ticket: any): void {
    console.log('Viewing ticket:', ticket);
    // Implement ticket detail view
  }

  goBack(): void {
    if (this.selectedAction) {
      this.selectedAction = '';
      this.showCategoryBoxes = true;
    } else if (this.showCategoryBoxes) {
      this.showCategoryBoxes = false;
      this.showInitialBoxes = true;
      this.selectedCategory = '';
    }
  }
}