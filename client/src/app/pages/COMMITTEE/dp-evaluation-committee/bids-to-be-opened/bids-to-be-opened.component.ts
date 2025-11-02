import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-be-opened',
  templateUrl: './bids-to-be-opened.component.html',
  styleUrls: ['./bids-to-be-opened.component.scss']
})
export class BidsToBeOpenedComponent implements OnInit {

  committeeAction = 'BOPN';
  status = 'BOPN';
  option = 'bidstobeopen'

  constructor() { }

  ngOnInit(): void {
  }

}
