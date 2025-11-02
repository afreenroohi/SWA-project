import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconList } from 'src/app/components/icon/icon.component';
import { CommonService } from 'src/app/service/common.service';
import { CardEvent, CardTitle } from '../../dashboard.model';

@Component({
  selector: 'dashboard-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title: string = 'Card Title';
  @Input() value: string = '0';
  @Input() description: string = '';
  @Input() icon: IconList = IconList.file;
  @Input() secondaryValue: string = '';
  @Input() secondaryDescription: string = '';
  @Output() viewTableDetailsToggle = new EventEmitter<string>()

  constructor(public cs: CommonService) { }

  ngOnInit(): void {
  }

  toggleViewDetails(){
    switch (this.title) {
      case CardTitle.rfp:
        this.viewTableDetailsToggle.emit('rfp');
        break;
      case CardTitle.tender:
        this.viewTableDetailsToggle.emit('tender');
        break;
      case CardTitle.contract:
        this.viewTableDetailsToggle.emit('contract');
        break;
      case CardTitle.contractSAP: 
        this.viewTableDetailsToggle.emit('contractSAP');
        break;
      case CardTitle.coc:
        this.viewTableDetailsToggle.emit('coc');
        break;
      default:
        this.viewTableDetailsToggle.emit('');
        break;
    }
  }

}
