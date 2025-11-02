import { Component, OnInit } from '@angular/core';

// component for list of contract for RMI
@Component({
  selector: 'app-rmi',
  templateUrl: './rmi.component.html',
  styleUrls: ['./rmi.component.scss']
})
export class ContOfficerRmiComponent implements OnInit {

  optionSelected = 'rmi';
  constructor() { }

  ngOnInit(): void {
  }

}
