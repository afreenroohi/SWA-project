import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  showSupportForm = false;
  totalTickets = 0;
  highPriorityTickets = 0;
  openTickets = 0;
  supportForm: FormGroup;
  loading = false;
  showCloseModal = false;
  selectedTicket: any = null;
  closeMessage = '';
  staticTicketsLoaded = false;

  // Action modal properties
  showActionModal = false;
  currentAction = '';
  actionText = '';
  transferId = '';
  actionModalTitle = '';

  // RFP KPI values
  totalRfp = Math.floor(Math.random() * 100) + 50;
  totalContracts = Math.floor(Math.random() * 80) + 30;
  totalBidsOpen = Math.floor(Math.random() * 60) + 20;
  totalBidsEvaluated = Math.floor(Math.random() * 40) + 15;

  constructor(private fb: FormBuilder, public cs: CommonService, private router: Router) {
    this.supportForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['Medium']
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    setInterval(() => {
      this.loadTickets();
    }, 5000);
  }

  loadTickets(): void {
    // Only load static data once
    if (!this.staticTicketsLoaded) {
      this.tickets = [
        {
          id: 'TKT-001',
          subject: 'SupportTickets.LoginIssue',
          description: 'SupportTickets.LoginIssueDesc',
          priority: 'High',
          status: 'Open',
          assignedTo: 's1',
          adminMessage: 'Please check user credentials',
          createdDate: new Date('2024-01-15T10:30:00').toISOString(),
          createdBy: 'John Smith',
          createdByAr: 'جون سميث'
        },
        {
          id: 'TKT-002',
          subject: 'SupportTickets.FeatureRequest',
          description: 'SupportTickets.FeatureRequestDesc',
          priority: 'Medium',
          status: 'In Progress',
          assignedTo: 's2',
          adminMessage: 'Under review by development team',
          createdDate: new Date('2024-01-14T14:20:00').toISOString(),
          createdBy: 'Sarah Johnson',
          createdByAr: 'سارة جونسون'
        },
        {
          id: 'TKT-003',
          subject: 'SupportTickets.BugReport',
          description: 'SupportTickets.BugReportDesc',
          priority: 'Low',
          status: 'Open',
          assignedTo: 'admin',
          adminMessage: '',
          createdDate: new Date('2024-01-13T09:15:00').toISOString(),
          createdBy: 'Mike Davis',
          createdByAr: 'مايك ديفيس'
        },
        {
          id: 'TKT-004',
          subject: 'SupportTickets.GeneralInquiry',
          description: 'SupportTickets.GeneralInquiryDesc',
          priority: 'High',
          status: 'Open',
          assignedTo: 's1',
          adminMessage: 'Escalated to senior support',
          createdDate: new Date('2024-01-12T16:45:00').toISOString(),
          createdBy: 'Lisa Wilson',
          createdByAr: 'ليزا ويلسون'
        },
        {
          id: 'TKT-005',
          subject: 'SupportTickets.PasswordReset',
          description: 'SupportTickets.PasswordResetDesc',
          priority: 'Medium',
          status: 'Closed',
          assignedTo: 's2',
          adminMessage: 'Password reset completed successfully',
          createdDate: new Date('2024-01-11T11:30:00').toISOString(),
          createdBy: 'Tom Brown',
          createdByAr: 'توم براون'
        }
      ];
      this.staticTicketsLoaded = true;
    }
    
    this.calculateKPIs();
  }

  calculateKPIs(): void {
    this.totalTickets = this.tickets.length;
    this.highPriorityTickets = this.tickets.filter(t => t.priority === 'High').length;
    this.openTickets = this.tickets.filter(t => t.status === 'Open').length;
  }

  onSubmit(): void {
    if (this.supportForm.valid) {
      this.loading = true;
      
      const ticketData = {
        id: Date.now().toString(),
        subject: this.supportForm.value.subject,
        description: this.supportForm.value.description,
        priority: this.supportForm.value.priority,
        status: 'Open',
        createdDate: new Date().toISOString(),
        createdBy: localStorage.getItem('username') || 'User'
      };

      const existingTickets = JSON.parse(localStorage.getItem('ticketList') || '[]');
      existingTickets.push(ticketData);
      localStorage.setItem('ticketList', JSON.stringify(existingTickets));

      this.loading = false;
      this.supportForm.reset();
      this.supportForm.patchValue({ priority: 'Medium' });
      this.showSupportForm = false;
      this.loadTickets();
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'default';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open': return 'blue';
      case 'Closed': return 'green';
      case 'In Progress': return 'orange';
      default: return 'default';
    }
  }

  toggleTicketStatus(ticket: any): void {
    if (ticket.status === 'Open') {
      // Show modal for closing ticket
      this.selectedTicket = ticket;
      this.showCloseModal = true;
    } else {
      // Directly reopen ticket
      ticket.status = 'Open';
      this.calculateKPIs();
    }
  }

  closeTicket(): void {
    if (this.selectedTicket && this.closeMessage.trim()) {
      this.selectedTicket.status = 'Closed';
      this.selectedTicket.closeMessage = this.closeMessage;
      this.selectedTicket.closedDate = new Date().toISOString();
      
      this.showCloseModal = false;
      this.closeMessage = '';
      this.selectedTicket = null;
      this.calculateKPIs();
    }
  }

  cancelClose(): void {
    this.showCloseModal = false;
    this.closeMessage = '';
    this.selectedTicket = null;
  }

  openActionModal(action: string, ticket: any): void {
    this.selectedTicket = ticket;
    this.currentAction = action;
    this.actionText = '';
    this.transferId = '';
    
    switch(action) {
      case 'approve':
        this.actionModalTitle = 'Approve Ticket';
        break;
      case 'reject':
        this.actionModalTitle = 'Reject Ticket';
        break;
      case 'transfer':
        this.actionModalTitle = 'Transfer Ticket';
        break;
      case 'moreInfo':
        this.actionModalTitle = 'More Information';
        break;
    }
    
    this.showActionModal = true;
  }

  submitAction(): void {
    if (this.actionText.trim() && (this.currentAction !== 'transfer' || this.transferId.trim())) {
      console.log(`${this.currentAction} action for ticket ${this.selectedTicket.id}:`, {
        message: this.actionText,
        transferId: this.currentAction === 'transfer' ? this.transferId : undefined
      });
      
      this.cancelAction();
    }
  }

  cancelAction(): void {
    this.showActionModal = false;
    this.currentAction = '';
    this.actionText = '';
    this.transferId = '';
    this.selectedTicket = null;
  }

  isUserRoute(): boolean {
    return this.router.url.includes('/suser/');
  }

  takeTicket(ticket: any): void {
    console.log('Taking ticket:', ticket.id);
    // Add take ticket logic here
  }

  approveTicket(ticket: any): void {
    console.log('Approving ticket:', ticket.id);
    // Add approval logic here
  }

  rejectTicket(ticket: any): void {
    console.log('Rejecting ticket:', ticket.id);
    // Add rejection logic here
  }

  transferTicket(ticket: any): void {
    console.log('Transferring ticket:', ticket.id);
    // Add transfer logic here
  }

  showMoreInfo(ticket: any): void {
    console.log('Showing more info for ticket:', ticket.id);
    // Add more info logic here
  }
}