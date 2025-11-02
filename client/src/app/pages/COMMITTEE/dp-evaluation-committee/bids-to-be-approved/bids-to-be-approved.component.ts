import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-to-be-approved',
  templateUrl: './bids-to-be-approved.component.html',
  styleUrls: ['./bids-to-be-approved.component.scss']
})
export class BidsToBeApprovedComponent implements OnInit {

  committeeAction = 'BAPR';
  status = 'BAPR';
  option = 'bidtobeapproved'

  constructor() { }

  ngOnInit(): void {
  }

}
