import { Component, OnInit } from '@angular/core';

// Component for list of contracts rejected from any approver
@Component({
  selector: 'app-return-from-approval',
  templateUrl: './return-from-approval.component.html',
  styleUrls: ['./return-from-approval.component.scss']
})
export class LOReturnFromApprovalComponent implements OnInit {
  optionSelected = 'RetFrAppr'
  constructor() { }

  ngOnInit(): void {
  }

}
