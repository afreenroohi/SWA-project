import { Component, OnInit } from '@angular/core';


// Approval list component for Contract unit head
@Component({
  selector: 'app-contract-approval',
  templateUrl: './contract-approval.component.html',
  styleUrls: ['./contract-approval.component.scss']
})
export class ContractApprovalComponent implements OnInit {

  constructor() { }
  optionSelected = "Approve"

  ngOnInit(): void {
  }

}
