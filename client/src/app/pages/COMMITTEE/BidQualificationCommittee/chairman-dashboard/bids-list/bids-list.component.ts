import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-list',
  templateUrl: './bids-list.component.html',
  styleUrls: ['./bids-list.component.scss']
})
export class BidsListComponent implements OnInit {

  OptionSelected = "BidList";
  constructor() { }

  ngOnInit(): void {
  }

}
