import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-final-approval',
  templateUrl: './final-approval.component.html',
  styleUrls: ['./final-approval.component.scss']
})
export class FinalApprovalComponent implements OnInit {


  committeeAction = 'BFAP';
  status = 'BFAP';
  option = 'finalapproval'

  constructor() { }

  ngOnInit(): void {
  }

}
