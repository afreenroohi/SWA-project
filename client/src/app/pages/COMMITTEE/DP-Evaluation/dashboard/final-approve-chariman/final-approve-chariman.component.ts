import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-final-approve-chariman',
  templateUrl: './final-approve-chariman.component.html',
  styleUrls: ['./final-approve-chariman.component.scss']
})
export class FinalApproveCharimanComponent implements OnInit {
 // CommitteeAction : String = "BFAP";
  OptionSelected = "BidToFinalCH";
  constructor() { }

  ngOnInit(): void {
  }

}
