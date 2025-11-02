import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/service/RFP/api.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { ColumnItem, Indicator, listOfColumnBudget, listOfColumnRFP } from 'src/app/shared/shared';
import { CommonService } from 'src/app/service/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-myrfp',
  templateUrl: './myrfp.component.html',
  styleUrls: ['./myrfp.component.scss']
})
export class MyrfpComponent implements OnInit {

  selectedTab: number = 0;
  repForm: FormGroup;
  listArray: any;

  mode: any;

  isReturn = 'return';

  listArrayBudget: any;
  selectedType : any;

  private readonly destroy$ = new Subject<void>();

  constructor(private spinner: NgxSpinnerService,
    public cs: CommonService,
    private fb: FormBuilder,
    private translate: TranslateService, private api: ApiService) {

    this.repForm = this.fb.group({
      rfptype: new FormControl(this.FilterList[0].id),

    })
  }

  listOfColumnRFP = listOfColumnRFP;
  FilterList = Indicator;
  type: any;


  ngOnInit(): void {
    this.selectedType = this.repForm.controls['rfptype'].value;
   
    this.spinner.show()
    this.getMyRFP(this.FilterList[0].id)
    this.mode = "edit"
  }

  search() {
    this.selectedType = this.repForm.controls['rfptype'].value;
    this.listArray = [];
    this.getMyRFP(this.repForm.controls['rfptype'].value)

    if (this.repForm.controls['rfptype'].value == '3') {
      this.mode = "edit"
    }
    else if (this.repForm.controls['rfptype'].value === "4") {
      this.mode = "edit"
    }
    else if (this.repForm.controls['rfptype'].value === "5") {
      this.mode = "reopen"
    }
  }
  getMyRFP(rfpType: any) {
    let data = {
      userid: this.cs.getUserData().userid,
      DeptId: this.cs.getUserData().DeptId,
      Ind: ""
    }
    data.Ind = rfpType
    this.spinner.show()
    this.api.post('RfpHeader', data).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.listArray = res.d.results
      this.listArray = this.listArray.map((listItem: any) => {
        if (listItem.RfpStatus === 'D') {
          listItem.Sla = listItem.SlaAr = ''
        }
        return listItem;
      });
      this.listArray = [...this.listArray];
      this.spinner.hide()
    }, (error) => {
      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    })

  }

  getIndex(value: any) {

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
