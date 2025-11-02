import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bids-from-tech-members',
  templateUrl: './bids-from-tech-members.component.html',
  styleUrls: ['./bids-from-tech-members.component.scss']
})
export class BidsFromTechMembersComponent implements OnInit {

  committeeAction = 'BFTM';
  status = 'BFTM';
  option = 'bidsFromTechMem'

  constructor() { }

  ngOnInit(): void {
  }

}
