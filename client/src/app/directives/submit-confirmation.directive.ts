import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { userList } from '../pages/COC/coc.model';
import { AssignConfig, ReturnConfig } from '../components/common.model';

@Directive({
  selector: '[appSubmitConfirmation]',
})
export class SubmitConfirmationDirective {
  @Input() confirmModalTitle = 'COM.Do you want to Submit?'; // string from translation file
  @Input() confirmModalBody = 'COM.areYouSure';
  @Input() directModalTitle = '';
  @Input() listOfuserForAssigning: userList[] = []
  @Input() isAssignable: boolean = false
  @Input() assignConfig: AssignConfig | undefined  = undefined
  @Output() confirmedAction = new EventEmitter<string>();

  constructor(
    private el: ElementRef,
    private modal: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.el.nativeElement.addEventListener('click', () => {
      //console.log('clicked from directive');
      console.log(this.directModalTitle, this.listOfuserForAssigning, this.assignConfig);
      
      const modalRef = this.modal.create({
        nzContent: ConfirmComponent,
        nzComponentParams: { config: { titleText: this.directModalTitle ? this.directModalTitle : this.translate.instant(this.confirmModalTitle), 
          bodyText: this.confirmModalBody.length ? this.translate.instant(this.confirmModalBody) : this.confirmModalBody }, isAssign: this.isAssignable, assignConfig:this.assignConfig },
        nzWidth: 600,
        nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
        nzFooter: null
      });

      modalRef.afterClose
        .subscribe(result => {
          console.log(result)
          if (result) {
            this.confirmedAction.emit(result);
          }
        });
    });
  }
}
