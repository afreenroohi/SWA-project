import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-be-opened',
  templateUrl: './bids-to-be-opened.component.html',
  styleUrls: ['./bids-to-be-opened.component.scss']
})
export class DpBidsToBeOpenedComponent implements OnInit {

  OptionSelected = "BidsToOpen";

  constructor() { }
/////
  ngOnInit(): void {
  }

}
