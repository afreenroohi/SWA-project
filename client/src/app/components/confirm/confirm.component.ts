import { Component, Input, OnInit } from '@angular/core';
import { IconList } from '../icon/icon.component';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/service/common.service';
import { userList } from 'src/app/pages/COC/coc.model';
import {ReturnConfig, IConfig, AssignConfig} from '../common.model'


@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: [`./confirm.component.scss`],
})

export class ConfirmComponent implements OnInit {
    @Input() public config: IConfig = {
        titleText: this.translateService.instant(`COM.confirmationApproval`),
        bodyText: this.translateService.instant(`COM.areYouSure`),
    };

    @Input() isReturn: boolean | undefined = undefined;
    @Input() isAssign: boolean = false;

    @Input() assignConfig: AssignConfig | undefined  = undefined
    @Input() returnConfig: ReturnConfig | undefined  = undefined

    listofUsers: any[] = [];
    selectedUser: string = '';

    public readonly IconList = IconList;
    constructor(private translateService: TranslateService, private modalRef: NzModalRef,
        public cs: CommonService,
    ) {}

    ngOnInit() { 
        if (this.isReturn) {
            this.listofUsers = this.returnConfig?.listofUsers ?? [];
            console.log(this.listofUsers)
        }   
        if(this.isAssign){
            console.log(this.assignConfig)
            this.listofUsers = this.assignConfig?.listOfUsers ?? [];
        }
    }

    disableSubmission(): boolean{
        return this.isAssign && this.selectedUser === ''
    }

    onConfirm() : void {
        console.log(this.selectedUser);
        
        if (this.isReturn ) {
            this.modalRef.close(this.selectedUser);
        } else if(this.isAssign){
            this.modalRef.close(this.selectedUser);

        } {
            this.modalRef.close(true);
        }
    }

    onClose () : void {
        this.modalRef.close(false);
    }
}