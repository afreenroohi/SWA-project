import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-be-evaluated',
  templateUrl: './bids-to-be-evaluated.component.html',
  styleUrls: ['./bids-to-be-evaluated.component.scss']
})
export class DpBidsToBeEvaluatedComponent implements OnInit {
  OptionSelected = "BidToEval";
  constructor() { }

  ngOnInit(): void {
  }

}
