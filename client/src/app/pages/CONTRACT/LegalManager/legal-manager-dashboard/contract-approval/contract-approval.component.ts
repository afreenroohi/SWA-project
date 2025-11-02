import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract-approval',
  templateUrl: './contract-approval.component.html',
  styleUrls: ['./contract-approval.component.scss']
})
export class LMContractApprovalComponent implements OnInit {
  optionSelected = 'approve';
  constructor() { }

  ngOnInit(): void {
  }

}
