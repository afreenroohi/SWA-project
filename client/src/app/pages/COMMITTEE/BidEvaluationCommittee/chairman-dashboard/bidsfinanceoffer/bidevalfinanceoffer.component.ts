import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bidevalfinanceoffer',
  templateUrl: './bidevalfinanceoffer.component.html',
  styleUrls: ['./bidevalfinanceoffer.component.scss']
})
export class BidEvalFinanceOfferComponent implements OnInit {

  CommitteeAction : String = "BOFR";
  OptionSelected = "BidFinance";
  constructor() { }

  ngOnInit(): void {
  }
  

}
