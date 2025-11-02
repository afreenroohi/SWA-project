import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-final-approve',
  templateUrl: './final-approve.component.html',
  styleUrls: ['./final-approve.component.scss']
})
export class FinalApproveComponent implements OnInit {
 // CommitteeAction : String = "BFAP";
  OptionSelected = "BidToFinal";
  constructor() { }

  ngOnInit(): void {
  }

}
