import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnBtQlt } from 'src/app/shared/shared';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class BQOfficerDashboardComponent implements OnInit {
  listOfColumn = listOfColumnBtQlt;
  listOfDisplayData : undefined;

  Action : String = "change";

  StepStatus = "BQ";

  private readonly destroy$ = new Subject<void>();

  constructor(
    private api :ApiService,
    private spinner : NgxSpinnerService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    const UserName = {
      "UserName": atob(localStorage.getItem("ID")!)
    };
    this.api.post("OCOM_BID_LIST_GET",UserName).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
      //  console.log(res.d.results);
        this.spinner.hide();
        this.listOfDisplayData = res.d.results;
        this.commonService.setBidsCount({ count: res.d.__count, committeeAction: 'BLST' });
      },
      (error)=>{
        this.spinner.hide();
        this.commonService.createMessage("error", error.statusText);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
