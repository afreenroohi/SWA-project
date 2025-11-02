import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IconList } from '../icon/icon.component';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {

  @Input() errorList: string [] = [];
  @Input() sectionHeight: string = '0px';

  public readonly IconList = IconList;

  constructor(private modalRef: NzModalRef) { }

  ngOnInit(): void {
  }

  onClose () : void {
    this.modalRef.close();
  }

}
