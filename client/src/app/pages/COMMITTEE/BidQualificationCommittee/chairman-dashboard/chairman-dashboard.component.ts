import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnBtQlt } from 'src/app/shared/shared';

@Component({
  selector: 'app-chairman-dashboard-qual',
  templateUrl: './chairman-dashboard.component.html',
  styleUrls: ['./chairman-dashboard.component.scss']
})
export class BQChairmanDashboardComponent implements OnInit {

  @Input() OptionSelected: any;

  listOfColumn = listOfColumnBtQlt;
  listOfDisplayData: undefined;

  committeeId:any;
  committeeRole:any;
  committeeAction:any;
  username:any;
  userAction:any;

  Action: String = "change";

  StepStatus = "BQ";

  private readonly destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private formData: PassFormDataService
  ) { }

  ngOnInit(): void {
    this.committeeId = localStorage.getItem("CMTID");
    this.committeeRole = localStorage.getItem("ROLEQP");
    this.username = atob(localStorage.getItem("ID")!);

    //* Bids list
    if (this.OptionSelected === "BidList") {
      this.formData.setStatus("BidList");
      this.spinner.show();
      const UserName = {
        "UserName": this.username
        // "UserName": "CON_ABAP"
      };
      this.api.post("OCOM_BID_LIST_GET", UserName).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
      //    console.log(res.d.results);
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: 'BLST' });
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage("error", error.statusText);
        }
      );
    }
    //* Bids to be evaluated
    if (this.OptionSelected === "BidToEval") {
      this.formData.setStatus("BidToEval");
      this.spinner.show();
      if(this.committeeRole === "CH"){
        this.userAction = "BTEV";
      }
      if(this.committeeRole === "OF"){
        this.userAction = "BTEV";
      }
      const data = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": this.userAction,
        "UserName": this.username
        // "UserName": "CON_ABAP"
      }
      this.api.post("OCOM_BID_TO_ACT", data).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
        //  console.log(res.d.results);
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: data.CommitteeAction });
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage("error", error.statusText);
        }
      );
    }
    //* Qualification Committee
    if (this.OptionSelected === "QualCom") {
      this.formData.setStatus("QualCom");
      this.spinner.show();
      if(this.committeeRole === "CH"){
        this.userAction = "BFQC";
      }
      if(this.committeeRole === "OF"){
        this.userAction = "BEMR";
      }
      const data = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": this.userAction,
        "UserName": this.username
        // "UserName": "CON_ABAP"
      }
      this.api.post("OCOM_BID_TO_ACT", data).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
        //  console.log(res.d.results);
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: data.CommitteeAction });
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage("error", error.statusText);
        }
      );
    }
    // * Pending approval
    if (this.OptionSelected === "PendingApproval") {
      this.formData.setStatus("QualCom");
      this.spinner.show();
      if(this.committeeRole === "CH"){
        this.userAction = "QAPR";
      }
      if(this.committeeRole === "PM" || this.committeeRole === "FM" || this.committeeRole === "MR"){
        this.userAction = "QAPR";
      }
      const data = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": this.userAction,
        "UserName": this.username
        // "UserName": "CON_ABAP"
      }
      this.api.post("OCOM_BID_TO_ACT", data).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
        //  console.log(res.d.results);
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: data.CommitteeAction });
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage("error", error.statusText);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
