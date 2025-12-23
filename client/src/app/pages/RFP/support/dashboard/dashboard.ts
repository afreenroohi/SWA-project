import { Component, OnInit } from '@angular/core';
import { RFPService } from 'src/app/service/RFP/rfp.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    total: 0,
    resolved: 0,
    pending: 0,
    highPriority: 0
  };

  constructor(private ticketService: RFPService) {}

  ngOnInit() {
    const tickets = this.ticketService.getTickets();
    this.stats.total = tickets.length;
    this.stats.resolved = tickets.filter(t => t.status === 'Closed').length;
    this.stats.pending = tickets.filter(t => t.status !== 'Closed').length;
    this.stats.highPriority = tickets.filter(t => t.priority === 'High' && t.status !== 'Closed').length;
  }
}
