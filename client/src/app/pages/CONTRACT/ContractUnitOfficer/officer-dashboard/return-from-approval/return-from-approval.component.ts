import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-return-from-approval',
  templateUrl: './return-from-approval.component.html',
  styleUrls: ['./return-from-approval.component.scss']
})
export class ReturnFromApprovalComponent implements OnInit {

  optionSelected = 'returnFromApproval';
  constructor() { }

  ngOnInit(): void {
  }

}
