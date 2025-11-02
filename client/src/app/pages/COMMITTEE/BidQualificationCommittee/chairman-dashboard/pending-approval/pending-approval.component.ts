import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.scss']
})
export class PendingApprovalComponent implements OnInit {

  OptionSelected = "PendingApproval";
  constructor() { }

  ngOnInit(): void {
  }

}
