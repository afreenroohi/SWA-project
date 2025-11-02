import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-open',
  templateUrl: './bids-to-open.component.html',
  styleUrls: ['./bids-to-open.component.scss']
})
export class BidsToOpenComponent implements OnInit {
  CommitteeAction : String = localStorage.getItem('CMTID') !== '04' ? "BOPN" : "BEMR";
  OptionSelected = "BidOpen";

  constructor() { }

  ngOnInit(): void {
  }

}
