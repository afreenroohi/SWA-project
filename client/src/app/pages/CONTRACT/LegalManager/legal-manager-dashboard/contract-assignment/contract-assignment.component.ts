import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract-assignment',
  templateUrl: './contract-assignment.component.html',
  styleUrls: ['./contract-assignment.component.scss']
})
export class LMContractAssignmentComponent implements OnInit {
  optionSelected = 'assign'
  constructor() { }

  ngOnInit(): void {
  }

}
