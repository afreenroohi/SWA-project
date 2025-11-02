import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-from-eval-committee',
  templateUrl: './from-eval-committee.component.html',
  styleUrls: ['./from-eval-committee.component.scss']
})
export class DpFromEvalCommitteeComponent implements OnInit {

  OptionSelected = "FromEvalCommittee";
  constructor() { }

  ngOnInit(): void {
  }

}
