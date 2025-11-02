import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { BoqItem, PayItem, Work } from 'src/app/shared/shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rfpdetails',
  templateUrl: './rfpdetails.component.html',
  styleUrls: ['./rfpdetails.component.scss'],
})
export class RfpdetailsComponent implements OnInit {
  @Input() detArray: any;

  @Input() Action: any;

  @Input() Actiondet: any;

  ReqToBoqNavg: BoqItem[] = [];

  ReqToPayNavg: any[] = [];

  ReqToQualfNavg: PayItem[] = [];

  ReqToAttchNavg: PayItem[] = [];

  ReqToTechNavg: PayItem[] = [];

  ReqToMpwrNavg: any[] = [];

  ReqToWorkNavg: Work[] = [];

  reqComments: any;

  selectUser: any;

  expandIconPosition: 'left' | 'right' = 'right';

  userList: any;
  ApprvComments: any;

  ApprForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private api: ApiService,
    public cs: CommonService,
    public fb: FormBuilder,
    private translate: TranslateService,

  ) {
    this.ApprForm = this.fb.group({
      UserInfo: new FormControl("", Validators.required)
    })
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.detArray) {
      if (this.Action === 'budget') {
        this.spinner.hide();
      } else {
        this.detArray = this.detArray.results[0];
        this.ReqToBoqNavg = this.detArray.ReqToBoqNavg.results;
        this.ReqToPayNavg = this.detArray.ReqToPayNavg.results;
        this.ReqToQualfNavg = this.detArray.ReqToQualfNavg.results;
        this.ReqToAttchNavg = this.detArray.ReqToAttchNavg.results;
        this.ReqToMpwrNavg = this.detArray.ReqToMpwrNavg.results;
        this.ReqToWorkNavg = this.detArray.ReqToWorkNavg.results;
        this.ReqToTechNavg = this.detArray.ReqToTechNavg.results;
        this.ApprvComments = this.detArray.WfReqComment;

        if (this.Actiondet) {

          if (
            this.Actiondet.CwfApprvRole != 'APRT1'
          ) {
            this.getUserList();
          }
        }

        this.spinner.hide();
      }
    }
  }
  Assign() {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'ASSGN',
      NwfApprvDept: this.selectUser.NwfApprvDept,
      NwfApprvLevel: this.selectUser.NwfApprvLevel,
      NwfApprvRole: this.selectUser.NwfApprvRole,
      NwfApprvId: this.selectUser.NwfApprvId,
      NwfDept: this.selectUser.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };
    this.api.post('WfAction', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

      if (res == 204) {
        this.cs.createMessage("Success", this.translate.instant("RFP.RFPAssign"));
        this.router.navigate(['rfp/myinbox'])
      }
    }
      , (error) => {
        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      });
  }
  Approve() {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'APRVD',
      NwfApprvDept: this.Actiondet.NwfApprvDept,
      NwfApprvLevel: this.Actiondet.NwfApprvLevel,
      NwfApprvRole: this.Actiondet.NwfApprvRole,
      NwfApprvId: this.Actiondet.NwfApprvId,
      NwfDept: this.Actiondet.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };

    this.api.post('WfAction', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

      if (res == 204) {
        this.cs.createMessage("Success", this.translate.instant("RFP.RFPApproved"))
        this.router.navigate(['rfp/myinbox'])
      }
    }, (error) => {
      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    });
  }
  Return() {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'RETND',
      NwfApprvDept: this.Actiondet.NwfApprvDept,
      NwfApprvLevel: this.Actiondet.NwfApprvLevel,
      NwfApprvRole: this.Actiondet.NwfApprvRole,
      NwfApprvId: this.Actiondet.NwfApprvId,
      NwfDept: this.Actiondet.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };

    this.api.post('WfAction', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

      if (res == 204) {
        this.cs.createMessage("Success", this.translate.instant("RFP.RFPReturned"))
        this.router.navigate(['rfp/myinbox'])
      }
    }, (error) => {

      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    });
  }

  Review() {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'REVWD',
      NwfApprvDept: this.selectUser.NwfApprvDept,
      NwfApprvLevel: this.selectUser.NwfApprvLevel,
      NwfApprvRole: this.selectUser.NwfApprvRole,
      NwfApprvId: this.selectUser.NwfApprvId,
      NwfDept: this.selectUser.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };

    this.api.post('WfAction', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {


      if (res == 204) {
        this.cs.createMessage("Success", this.translate.instant("RFP.RFPReviewed"))
        this.router.navigate(['rfp/myinbox'])
      }
    }, (error) => {

      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    });
  }

  edit(rfpno: any, RfpVersion: any) {
    this.router.navigate(['rfp/change'], {
      state: { RfpNo: rfpno, RfpVersion: RfpVersion },
    });
  }

  getUserList() {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      RfpDeptId: this.detArray.DeptId,
      WfFlowType: this.Actiondet.WfFlowType,
      CwfDept: this.Actiondet.CwfDept,
      CwfApprvLevel: this.Actiondet.CwfApprvLevel,
      CwfApprvRole: this.Actiondet.CwfApprvRole,
    };
    this.api
      .post('RfpWfUsrlstSet', data)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.userList = res.d.results;
      }, (error) => {
        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      });
  }

  getAssgnUser(value: any) {
    this.selectUser = value;
  }


  downloadFile(value: any) {
   
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
