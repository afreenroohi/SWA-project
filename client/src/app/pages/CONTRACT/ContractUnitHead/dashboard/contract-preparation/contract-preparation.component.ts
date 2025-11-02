import { Component, OnInit } from '@angular/core';

// component for list of contracts for assignment of Contract unit officer
@Component({
  selector: 'app-contract-preparation',
  templateUrl: './contract-preparation.component.html',
  styleUrls: ['./contract-preparation.component.scss']
})
export class ContractPreparationComponent implements OnInit {

  constructor() { }
  optionSelected = "Preparation"

  ngOnInit(): void {
  }

}
