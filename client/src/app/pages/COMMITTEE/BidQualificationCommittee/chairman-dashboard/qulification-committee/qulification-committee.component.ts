import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qulification-committee',
  templateUrl: './qulification-committee.component.html',
  styleUrls: ['./qulification-committee.component.scss']
})
export class QulificationCommitteeComponent implements OnInit {

  OptionSelected = "QualCom";

  constructor() { }

  ngOnInit(): void {
  }

}
