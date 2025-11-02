import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-luh-approval',
  templateUrl: './luh-approval.component.html',
  styleUrls: ['./luh-approval.component.scss']
})
export class LuhApprovalComponent implements OnInit {

  constructor() { }
  optionSelected = "Approve";

  ngOnInit(): void {
  }

}
