import { Component, OnInit } from '@angular/core';

// component for contract preparation forms
@Component({
  selector: 'app-request-contract-preparation',
  templateUrl: './request-contract-preparation.component.html',
  styleUrls: ['./request-contract-preparation.component.scss']
})
export class LORequestContractPreparationComponent implements OnInit {
  optionSelected = 'ContPrep';
  constructor() { }

  ngOnInit(): void {
  }

}
