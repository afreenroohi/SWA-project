import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnSLA, DataItem, SES } from 'src/app/shared/shared';

@Component({
  selector: 'app-seslist',
  templateUrl: './seslist.component.html',
  styleUrls: ['./seslist.component.scss']
})
export class SESListComponent implements OnInit {

  listOfColumn = SES;
  listOfDisplayData: any;
  listOfData: DataItem[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.spinner.show()
    let data = {
      UserId: this.cs.getUserData().userid,
      CocStatus: "P"
    };

    this.api.post('CocCompletionSet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {

      if(res.d.results[0].MessageId == "E"){
        this.spinner.hide()
        this.cs.createMessage('error', this.cs.userLanguage === "en"? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
       }
       else {
        this.spinner.hide()
       // this.cs.createMessage('success', res.d.MessageEn);
        this.listOfData = res.d.results;
        this.listOfDisplayData = [...this.listOfData];
      
      } 
    } ,(error) => {
      this.cs.createMessage("error",error.statusText)
      this.spinner.hide()
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
