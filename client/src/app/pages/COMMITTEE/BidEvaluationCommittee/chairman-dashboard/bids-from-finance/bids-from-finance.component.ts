import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-from-finance',
  templateUrl: './bids-from-finance.component.html',
  styleUrls: ['./bids-from-finance.component.scss']
})
export class BidsFromFinanceComponent implements OnInit {

  CommitteeAction : String = "BEFM";
  OptionSelected = "BidFromFinance";
  constructor() { }

  ngOnInit(): void {
  }

}
