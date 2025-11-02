import { Component, OnInit, Input } from '@angular/core';
import { CardItem } from '../../dashboard.model';

@Component({
  selector: 'dashboard-top-five-card',
  templateUrl: './top-five-card.component.html',
  styleUrls: ['./top-five-card.component.scss']
})
export class TopFiveCardComponent implements OnInit {

  @Input('top5Heading') heading: string = '';
  @Input('top5Items') items: CardItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
