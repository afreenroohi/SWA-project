import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { listOfColumnRFPAppRej } from 'src/app/shared/shared';

@Component({
  selector: 'app-rfplist',
  templateUrl: './rfplist.component.html',
  styleUrls: ['./rfplist.component.scss']
})
export class RfplistComponent implements OnInit, OnChanges {


  listArray: any;
  projects: any;

  rfpList: any;
  userList: any;


  listOfColumnList = listOfColumnRFPAppRej


  size: NzButtonSize = 'large';

  repForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(private api: ApiService,
    readonly cs: CommonService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private rfp: RFPService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,) {
    this.repForm = this.fb.group({
      rfpNo: new FormControl(' '),
      creater: new FormControl(' '),
      Dept: new FormControl({ value: this.cs.getUserData().DeptId, disabled: true }),

    })

  }


  ngOnInit(): void {
    this.rfp.setIsSearchRFPMenuActive(true)
    this.getUserList(); // * To get user list from API
    this.getData()
    this.repForm.controls['creater'].valueChanges.subscribe((value: any) => {
      if (value) {
        this.repForm.controls['rfpNo'].setValue('');
        this.rfpList = [];
      }
    })
  }

  filterSearch(value?: any) {

    let data = {
      userid: this.repForm.controls['creater'].value ? this.repForm.controls['creater'].value : ' ',
      dep: this.repForm.controls['Dept'].value ? this.repForm.controls['Dept'].value : localStorage.getItem("Dep"),
      CwfDept: ' ',
      rfpno: this.repForm.controls['rfpNo'].value ? this.repForm.controls['rfpNo'].value : ' ',
      LogonUsr: this.cs.getUserData().userid,
      proj: ' ',
      Ind: "2"
    }
    this.getData(data)
  }

  ngOnChanges() {

  }

  getData(value?: any) {
    if (value) {
      this.spinner.show()
      this.api.post('RfpSearch', value).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.listArray = res.d.results;
        this.rfpList = res.d.results;
        this.spinner.hide()
      }, (error) => {

        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      })
    }
    else {
      let data = {
        rfpno: "",
        proj: "",
        userid: '',
        Ind: "2",
        LogonUsr: this.cs.getUserData().userid,
        CwfDept: ' ',
        dep: this.cs.getUserData().DeptId
      }
      this.spinner.show()
      this.api.post('RfpSearch', data).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.listArray = res.d.results
        this.rfpList = res.d.results;
        this.spinner.hide()
      }, (error) => {

        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      })
    }

  }


  getUserList() {
    this.spinner.show()
    this.api.get('rfp-creators').pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (error) => {
        this.cs.createMessage('error', error.statusText);

      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
