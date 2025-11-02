import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-from-qual-committee',
  templateUrl: './from-qual-committee.component.html',
  styleUrls: ['./from-qual-committee.component.scss']
})
export class FromQualCommitteeComponent implements OnInit {
  CommitteeAction : String = "BFQC";
  OptionSelected = "QualCom";
  constructor() { }

  ngOnInit(): void {
  }

}
