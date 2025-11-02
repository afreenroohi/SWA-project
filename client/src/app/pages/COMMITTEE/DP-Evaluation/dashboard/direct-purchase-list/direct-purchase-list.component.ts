import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-direct-purchase-list',
  templateUrl: './direct-purchase-list.component.html',
  styleUrls: ['./direct-purchase-list.component.scss']
})
export class DirectPurchaseListComponent implements OnInit {

  OptionSelected = "BidList";
  constructor() { }

  ngOnInit(): void {
  }

}
