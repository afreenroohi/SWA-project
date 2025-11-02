import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnBtOpn } from 'src/app/shared/shared';

@Component({
  selector: 'app-bidstobeopen-financialofficer-dashboard',
  templateUrl: './bidstobeopen-financialofficer-dashboard.component.html',
  styleUrls: ['./bidstobeopen-financialofficer-dashboard.component.scss']
})
export class BidstobeopenFinancialofficerDashboardComponent implements OnInit {
  listOfColumn = listOfColumnBtOpn;
  listOfDisplayData: undefined;
  Action: String = 'change';
  StepStatus = 'BDFO';
  
  private readonly destroy$ = new Subject<void>();

  constructor( private api: ApiService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService) { }

    ngOnInit(): void {
      this.spinner.show();
      const data = {
        UserName: atob(localStorage.getItem('ID')!),
        CommitteeId: localStorage.getItem("CMTID"),
        CommitteeRole: this.commonService.getUserRoleBasedOnCmtID(localStorage.getItem("CMTID") ?? ''),
        CommitteeAction: 'BFNC',
      };
  
      this.api.post('OCOM_BID_TO_ACT', data).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
       //   console.log(res.d.results);
          this.spinner.hide();
          this.listOfDisplayData = res.d.results;
          this.commonService.setBidsCount({ count: res.d.__count, committeeAction: data.CommitteeAction });
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
