import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnBdList } from 'src/app/shared/shared';

@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.scss'],
})
export class BidListComponent implements OnInit {
  listOfColumn = listOfColumnBdList;
  listOfDisplayData: any[] = [];
  Action : String = "change";
  StepStatus = "BL";
  OptionSelected = "BidList";
  loading = true;

  pIndex = 5;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private api :ApiService,
    private spinner : NgxSpinnerService,
    private formData: PassFormDataService,
    private commonService: CommonService,) { }

  ngOnInit(): void {

   
    this.formData.setStatus("BidList");
    const UserName = {
      "UserName": atob(localStorage.getItem("ID")!),
      // "top":""
    };
    
    // this.spinner.show();
    this.api.post("OCOM_BID_LIST_GET", UserName).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
      //  console.log(res.d.results);
        // this.spinner.hide();
        this.loading = false;
        this.listOfDisplayData = res.d.results;        
        this.listOfDisplayData.forEach((elem) => {
          elem.SLAEndDate = this.commonService.getDateNew(elem.SLAEndDate);
          elem.SLAEndTime = this.commonService.extractTimeFromString(elem.SLAEndTime);
        });
        this.commonService.setBidsCount({ count: res.d.__count, committeeAction: 'BLST' });
      },
      (error)=>{
        // this.spinner.hide();
        this.loading = false;
        this.commonService.createMessage("error", error.statusText);
      }
    );
  }

  getPageIndex(value:any){
      this.pIndex = value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
