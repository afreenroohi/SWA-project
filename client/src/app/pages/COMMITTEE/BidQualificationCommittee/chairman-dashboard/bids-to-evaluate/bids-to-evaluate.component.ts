import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-evaluate',
  templateUrl: './bids-to-evaluate.component.html',
  styleUrls: ['./bids-to-evaluate.component.scss']
})
export class BidsToEvaluateComponent implements OnInit {

  OptionSelected : String = "BidToEval";

  constructor() { }

  ngOnInit(): void {
 //   console.log(this.OptionSelected);
  }

}
