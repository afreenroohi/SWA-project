import { Component, OnInit } from '@angular/core';

// component for list of contract for preparation
@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  styleUrls: ['./contract-create.component.scss']
})
export class ContOfficerContractCreateComponent implements OnInit {

  constructor() { }
  optionSelected = "ContCreate";
  ngOnInit(): void {
  }

}
