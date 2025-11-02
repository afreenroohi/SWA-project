import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-final-approval',
  templateUrl: './bids-final-approval.component.html',
  styleUrls: ['./bids-final-approval.component.scss']
})
export class BidsFinalApprovalComponent implements OnInit {

  CommitteeAction : String = "BFAP";
  OptionSelected = "BidToFinal";
  constructor() { }

  ngOnInit(): void {
  }

}
