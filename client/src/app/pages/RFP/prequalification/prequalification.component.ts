import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prequalification',
  templateUrl: './prequalification.component.html',
  styleUrls: ['./prequalification.component.scss']
})
export class PrequalificationComponent implements OnInit {
  currentStep = 0;

  constructor() { }

  ngOnInit(): void {
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

}
