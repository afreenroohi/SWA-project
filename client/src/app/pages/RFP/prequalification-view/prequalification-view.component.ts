import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-prequalification-view',
  templateUrl: './prequalification-view.component.html',
  styleUrls: ['./prequalification-view.component.scss']
})
export class PrequalificationViewComponent implements OnInit {
  qualificationData: any;
  activePanels = [true, false, false];

  constructor(
    private router: Router,
    private location: Location
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.qualificationData = navigation.extras.state;
    }
  }

  ngOnInit(): void {
  }

  back(): void {
    this.location.back();
  }

  scrollToSection(index: number): void {
    this.activePanels = this.activePanels.map((_, i) => i === index);
  }
}
