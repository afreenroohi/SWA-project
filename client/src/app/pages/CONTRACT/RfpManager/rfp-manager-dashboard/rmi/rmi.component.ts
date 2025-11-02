import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rmi',
  templateUrl: './rmi.component.html',
  styleUrls: ['./rmi.component.scss']
})
export class RFPRmiComponent implements OnInit {
  optionSelected = 'rmi';
  constructor() { }

  ngOnInit(): void {
  }

}
