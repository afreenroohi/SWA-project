import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RFPService } from 'src/app/service/RFP/rfp.service';

@Component({
  selector: 'app-ticket-list',
  template: `
    <div class="ticket-list-container">
      <nz-table #ticketTable [nzData]="tickets" nzBordered>
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ticket of ticketTable.data">
            <td>{{ ticket.ticketNumber }}</td>
            <td>{{ ticket.title }}</td>
            <td>
              <span class="priority-tag" [ngClass]="'priority-' + ticket.priority.toLowerCase()">
                {{ ticket.priority }}
              </span>
            </td>
            <td>
              <span class="status-tag" [ngClass]="'status-' + ticket.status.toLowerCase().replace(' ', '-')">
                {{ ticket.status }}
              </span>
            </td>
            <td>{{ ticket.createdAt | date:'short' }}</td>
            <td>
              <button nz-button nzType="link" (click)="viewTicket(ticket)">
                View
              </button>
              <button nz-button nzType="link" nzDanger 
                      *ngIf="ticket.status !== 'Closed'"
                      (click)="closeTicket(ticket)">
                Close
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .ticket-list-container {
      padding: 24px;
    }
    .priority-tag, .status-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .priority-low { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
    .priority-medium { background: #fff7e6; color: #fa8c16; border: 1px solid #ffd591; }
    .priority-high { background: #fff2f0; color: #ff4d4f; border: 1px solid #ffb3b3; }
    .priority-critical { background: #f9f0ff; color: #722ed1; border: 1px solid #d3adf7; }
    .status-open { background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }
    .status-in-progress { background: #fff7e6; color: #fa8c16; border: 1px solid #ffd591; }
    .status-resolved { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
    .status-closed { background: #f5f5f5; color: #8c8c8c; border: 1px solid #d9d9d9; }
  `]
})
export class TicketListComponent implements OnInit {
  tickets: any[] = [];

  constructor(
    private rfpService: RFPService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.tickets = this.rfpService.getTickets();
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'Low': 'green',
      'Medium': 'orange',
      'High': 'red',
      'Critical': 'purple'
    };
    return colors[priority] || 'default';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Open': 'blue',
      'In Progress': 'orange',
      'Resolved': 'green',
      'Closed': 'default'
    };
    return colors[status] || 'default';
  }

  viewTicket(ticket: any) {
    this.modal.create({
      nzTitle: `Ticket Details - ${ticket.ticketNumber}`,
      nzContent: `
        <div>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Description:</strong> ${ticket.description}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
          ${ticket.screenshot ? `<p><strong>Screenshot:</strong> ${ticket.screenshot}</p>` : ''}
        </div>
      `,
      nzFooter: null,
      nzWidth: 600
    });
  }

  closeTicket(ticket: any) {
    this.modal.confirm({
      nzTitle: 'Close Ticket',
      nzContent: `Are you sure you want to close ticket ${ticket.ticketNumber}?`,
      nzOnOk: () => {
        this.rfpService.updateTicketStatus(ticket.id, 'Closed');
        this.loadTickets();
        this.message.success('Ticket closed successfully');
      }
    });
  }
}