import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract-approval',
  templateUrl: './contract-approval.component.html',
  styleUrls: ['./contract-approval.component.scss']
})
export class RFPContractApprovalComponent implements OnInit {
  optionSelected = 'ContAppr';
  constructor() { }

  ngOnInit(): void {
  }

}
