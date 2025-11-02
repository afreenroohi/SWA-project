import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { listOfColumnRFPAppRej } from 'src/app/shared/shared';

@Component({
  selector: 'app-myinbox',
  templateUrl: './myinbox.component.html',
  styleUrls: ['./myinbox.component.scss']
})
export class MyinboxComponent implements OnInit {

  ActiveTab: any = 0;
  listOfColumnRFPAppRej = listOfColumnRFPAppRej;
  listArrayAppr: any;
  listArrayRej: any;
  listArray: any;
  private readonly destroy$ = new Subject<void>();

  constructor(private spinner: NgxSpinnerService, private cs: CommonService, private api: ApiService, private rfp: RFPService) {
  }

  ngOnInit(): void {
    this.getApproAndReviewData();
    this.rfp.setIsSearchRFPMenuActive(false)
  }


  checkTab() {

  }


  getApproAndReviewData() {
    let dataApp = {
      userid: this.cs.getUserData().userid,
      DeptId: this.cs.getUserData().DeptId,
      Ind: "7"
    }

    let dataRev = {
      userid: this.cs.getUserData().userid,
      DeptId: this.cs.getUserData().DeptId,
      Ind: "6"
    }

    this.spinner.show()
    forkJoin(this.api.post('RfpHeadinbox', dataApp),
    this.api.post('RfpHeadinbox', dataRev)).pipe(takeUntil(this.destroy$)).subscribe(([res1, res2]) => {

      if (res1.d.results[0].MessageId !== 'E') {
        this.listArrayAppr = res1.d.results
      }
      
      if (res2.d.results[0].MessageId !== 'E') {
        this.listArrayRej = res2.d.results
      }

    }, (error) => {

    }).add(() => {
      this.spinner.hide()
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
