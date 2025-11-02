import { Component, OnInit, Input,  } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent  {
  @Input() kpiHeading: string = 'SAR 150000'
  @Input() kpiDescription: string = 'RFP Estimated price (without VAT)'
  constructor() { }

  

}
