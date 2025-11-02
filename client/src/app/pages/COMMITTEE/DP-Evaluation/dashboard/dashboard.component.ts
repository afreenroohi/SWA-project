import { PassFormDataService } from './../../../../service/FormData/pass-form-data.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { listOfColumnBtEvl } from 'src/app/shared/shared';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DpDashboardComponent implements OnInit {

  @Input() OptionSelected: any;

  listOfColumn = listOfColumnBtEvl;
  listOfDisplayData: undefined;

  Action: String = "change";
  StepStatus = "DP";
  committeeId: string | null | undefined;
  committeeRole: string | null | undefined;
  username: string | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private formData : PassFormDataService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.committeeId = localStorage.getItem("CMTID");
    this.committeeRole = localStorage.getItem("ROLEDP");
    this.username = atob(localStorage.getItem("ID")!);

    // * API calls to get data for list 
    if (this.OptionSelected === "BidsToOpen") {
      this.formData.setStatus("BidsToOpen");
      let reqBody = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": "BOPN",
        "UserName": this.username
      }
      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT",reqBody).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: reqBody.CommitteeAction });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }
    if(this.OptionSelected === "FromEvalCommittee"){
      this.formData.setStatus("FromEvalCommittee");
      let reqBody = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": "BFEM",
        "UserName": this.username
      }
      if (this.location.path().endsWith(`/committee/dp_dashboard/fromQualification`)) {
        reqBody.CommitteeAction = `BFQC`;
        this.formData.setStatus("FromQualification");
      }
      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT",reqBody).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: reqBody.CommitteeAction });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }    
    if(this.OptionSelected === "BidToEval"){
      this.formData.setStatus("BidToEval");
      let reqBody = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": "BTEV",
        "UserName": this.username
      }
      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT",reqBody).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: reqBody.CommitteeAction });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }
    if(this.OptionSelected === "BidList"){
      this.formData.setStatus("BidList");
      let UserName = {
        "UserName": this.username
      }
      this.spinner.show();
      this.api.post("OCOM_BID_LIST_GET",UserName).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: 'BLST' });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }
    if(this.OptionSelected === "BidToFinal"){
      this.formData.setStatus("BidToFinal");
      let reqBody = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": "BFAP",
        "UserName": this.username
      }
      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT",reqBody).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: reqBody.CommitteeAction });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }
    if(this.OptionSelected === "BidToFinalCH"){
      this.formData.setStatus("BidToFinalCH");
      let reqBody = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": "BFAP",
        "UserName": this.username
      }
      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT",reqBody).pipe(takeUntil(this.destroy$)).subscribe(
        (res)=>{
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: reqBody.CommitteeAction });
        },
        (error)=>{
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }

    // if(this.OptionSelected === "BidToFinalCH"){
    //   this.formData.setStatus("BidToFinalCH");
    //   let UserName = {
    //     "UserName": this.username
    //   }
    //   this.api.post("OCOM_BID_LIST_GET",UserName).pipe(takeUntil(this.destroy$)).subscribe(
    //     (res)=>{
    //       this.spinner.hide();
    //       this.listOfDisplayData = res.d.results;
    //     },
    //     (error)=>{
    //       this.spinner.hide();
    //       this.commonService.createMessage('error', error.statusText);
    //     }
    //   );
    // }

    // if(this.OptionSelected === "BidToFinal"){
    //   this.formData.setStatus("BidToFinal");
    //   let UserName = {
    //     "UserName": this.username
    //   }
    //   this.api.post("OCOM_BID_LIST_GET",UserName).pipe(takeUntil(this.destroy$)).subscribe(
    //     (res)=>{
    //       this.spinner.hide();
    //       this.listOfDisplayData = res.d.results;
    //     },
    //     (error)=>{
    //       this.spinner.hide();
    //       this.commonService.createMessage('error', error.statusText);
    //     }
    //   );
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
