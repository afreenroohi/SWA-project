import { Component, OnInit, Input } from '@angular/core';
import { IconList } from '../icon/icon.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MessageType } from '../common.model';


@Component({
  selector: 'app-final-popup',
  templateUrl: './final-popup.component.html',
  styleUrls: ['./final-popup.component.scss']
})
export class FinalPopupComponent implements OnInit {

  @Input() message: string = '';
  @Input() messageType: MessageType = MessageType.Success

  readonly icon = IconList;

  constructor(private modalRef: NzModalRef) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.modalRef.close();
  }
  checkStatus(status: string): boolean {
    console.log(this.messageType);
    
    return this.messageType === status;
  }

}
