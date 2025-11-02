import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-be-evaluated',
  templateUrl: './bids-to-be-evaluated.component.html',
  styleUrls: ['./bids-to-be-evaluated.component.scss']
})
export class BidsToBeEvaluatedComponent implements OnInit {

  committeeAction = 'BEMR';
  status = 'BEMR';
  option = 'bidstobeeval'

  constructor() { }

  ngOnInit(): void {
  }

}
