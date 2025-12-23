import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
    const storedTickets = JSON.parse(localStorage.getItem('ticketList') || '[]');
    
    // Add static data if no tickets exist
    if (storedTickets.length === 0) {
      this.tickets = [
        {
          id: 'TKT-001',
          subject: 'Login Issues with RFP Module',
          description: 'Users unable to access RFP module after recent update',
          priority: 'High',
          status: 'Open',
          createdDate: new Date('2024-01-15T10:30:00').toISOString(),
          createdBy: 'John Smith'
        },
        {
          id: 'TKT-002',
          subject: 'Committee Member Assignment Error',
          description: 'Error when assigning committee members to evaluation process',
          priority: 'Medium',
          status: 'In Progress',
          createdDate: new Date('2024-01-14T14:20:00').toISOString(),
          createdBy: 'Sarah Johnson'
        },
        {
          id: 'TKT-003',
          subject: 'Contract Template Missing Fields',
          description: 'Some required fields are missing from contract templates',
          priority: 'Low',
          status: 'Open',
          createdDate: new Date('2024-01-13T09:15:00').toISOString(),
          createdBy: 'Mike Davis'
        },
        {
          id: 'TKT-004',
          subject: 'Report Generation Timeout',
          description: 'System timeout when generating large reports',
          priority: 'High',
          status: 'Open',
          createdDate: new Date('2024-01-12T16:45:00').toISOString(),
          createdBy: 'Lisa Wilson'
        },
        {
          id: 'TKT-005',
          subject: 'Email Notification Delay',
          description: 'Email notifications are being sent with significant delay',
          priority: 'Medium',
          status: 'Closed',
          createdDate: new Date('2024-01-11T11:30:00').toISOString(),
          createdBy: 'Tom Brown'
        }
      ];
    } else {
      this.tickets = storedTickets;
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
    ticket.status = ticket.status === 'Open' ? 'Closed' : 'Open';
    
    // Update localStorage if tickets are stored there
    const storedTickets = JSON.parse(localStorage.getItem('ticketList') || '[]');
    if (storedTickets.length > 0) {
      const index = storedTickets.findIndex((t: any) => t.id === ticket.id);
      if (index !== -1) {
        storedTickets[index].status = ticket.status;
        localStorage.setItem('ticketList', JSON.stringify(storedTickets));
      }
    }
    
    this.calculateKPIs();
  }
}