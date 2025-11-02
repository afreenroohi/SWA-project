import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-with-eval-committee',
  templateUrl: './bids-with-eval-committee.component.html',
  styleUrls: ['./bids-with-eval-committee.component.scss']
})
export class BidsWithEvalCommitteeComponent implements OnInit {
  CommitteeAction : String = "BEMR";
  OptionSelected = "BidToEval";
  constructor() { }

  ngOnInit(): void {
  }

}
