import { Component, OnInit } from '@angular/core';

// component for contract list returned from RMI
@Component({
  selector: 'app-return-from-rmi',
  templateUrl: './return-from-rmi.component.html',
  styleUrls: ['./return-from-rmi.component.scss']
})
export class LOReturnFromRmiComponent implements OnInit {
  optionSelected = 'RetFrRmi'
  constructor() { }

  ngOnInit(): void {
  }

}
