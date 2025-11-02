import { Component, OnInit } from '@angular/core';
import { listofColumnCEO } from 'src/app/shared/shared';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-ceo',
  templateUrl: './ceo.component.html',
  styleUrls: ['./ceo.component.scss']
})
export class CEOComponent implements OnInit {

  CommitteeAction: string = 'BFAP';
  Status: string = 'BFAP';
  OptionSelected: string = 'finalapproval';
  listOfDisplayData: undefined;
  listOfColumn = listofColumnCEO;
  Action: string = 'BFAP';
  StepStatus = 'CO';
  LogInId: string | null = '';
  committeeId: any;
  committeeRole: any;
  username: string = '';

  private readonly destroy$ = new Subject<void>()
 
  constructor(
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private commonService: CommonService,
      private formData: PassFormDataService
    ) { }

  ngOnInit(): void {
    this.committeeId = localStorage.getItem("CMTID");
    this.committeeRole = localStorage.getItem("ROLEMG");
    this.username = atob(localStorage.getItem("ID")!);

    this.LogInId = localStorage.getItem("LogdInUsrID");

    // this.Action = this.Status;

    if (this.OptionSelected) {
      this.formData.setStatus(this.OptionSelected);
    }

    if (this.CommitteeAction) {

      const UserDetails = {
        "CommitteeId": this.committeeId,
        "CommitteeRole": this.committeeRole,
        "CommitteeAction": this.CommitteeAction,
        "UserName": this.LogInId,
      };

      this.spinner.show();
      this.api.post("OCOM_BID_TO_ACT", UserDetails).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.listOfDisplayData = res?.d?.results;
          this.commonService.setBidsCount({ count: res?.d?.__count, committeeAction: UserDetails.CommitteeAction });
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