import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { listOfColumnRFPMG } from 'src/app/shared/shared';

@Component({
  selector: 'app-dashbard',
  templateUrl: './dashbard.component.html',
  styleUrls: ['./dashbard.component.scss']
})
export class DashbardComponent implements OnInit {


  listArray: any;
 
  rfpList: any;

  departmentList: any[] = [];
  pendingDepartmentList: any[] = [];


  listOfColumnList = listOfColumnRFPMG


  size: NzButtonSize = 'large';

  repForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(private api: ApiService,
    readonly cs: CommonService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private rfp: RFPService,
    public translate: TranslateService,) {
    this.repForm = this.fb.group({
      rfpNo: new FormControl(' '),
      dep: new FormControl(''),
      pendingDept: new FormControl('')
    })

  }


  ngOnInit(): void {
    this.rfp.setIsSearchRFPMenuActive(true)

    this.getDepartment(); // * To get list of department
    this.getData();
    this.repForm.controls['dep'].valueChanges.subscribe((value: any) => {
      if (value) {
        this.repForm.controls['rfpNo'].setValue('');
        this.rfpList = [];
      }
    })
    this.repForm.controls['pendingDept'].valueChanges.subscribe((value: any) => {
      if (value) {
        this.repForm.controls['rfpNo'].setValue('');
        this.rfpList = [];
      }
    })
  }

  filterSearch() {
    this.listArray = [];
    let data = {
      userid: ' ',
      dep: this.repForm.get('dep')?.value ? this.repForm.get('dep')?.value : 'ALL',
      CwfDept: this.repForm.get('pendingDept')?.value ? this.repForm.get('pendingDept')?.value : ' ',
      rfpno: this.repForm.controls['rfpNo'].value ? this.repForm.controls['rfpNo'].value : ' ',
      proj: ' ',
      Ind: "8"
    }
    this.getData(data)
  }

  getDepartment() {
    this.spinner.show();
    forkJoin([this.api.get(`rfp-department-list?userid=${this.cs.getUserData().userid.toUpperCase()}`),
      this.api.get('rfp-pending-departments')
    ]).pipe(takeUntil(this.destroy$))
    .subscribe(([departments, pendingwithDepartments]) => {
      this.departmentList = departments;
      this.pendingDepartmentList = pendingwithDepartments;
    }, ([departmentError, pendingwithDepartmentError]) => {
      if (departmentError) {
        this.cs.createMessage("error", departmentError.statusText)
      }
      if (pendingwithDepartmentError) {
        this.cs.createMessage("error", pendingwithDepartmentError.statusText)
      }

    })
  }

  getData(value?: any) {
    if (value) {
      this.spinner.show()
      this.api.post('RfpSearch', value).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.listArray = res.d.results;
        this.rfpList = res.d.results;
        this.listArray = this.listArray.map((listItem: any) => {
          if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
            listItem.Sla = listItem.SlaAr = ''
            listItem.WfPendUsrEn = listItem.WfPendUsrAr = ''
            // listItem.WfPendUsrEn =  listItem.WfPendUsrEn = ''
          }
          return listItem;
        });
        this.spinner.hide()
      }, (error) => {

        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      })
    }
    else {
      let data = {
        userid: ' ',
        rfpno: ' ',
        proj: ' ',
        Ind: '8',
        dep: 'ALL',
        CwfDept: ' ',
      }
      this.spinner.show()
      this.api.post('RfpSearch', data).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.listArray = res.d.results
        this.rfpList = res.d.results;
        this.listArray = this.listArray.map((listItem: any) => {
          if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
            listItem.Sla = listItem.SlaAr = ''
            listItem.WfPendUsrEn = listItem.WfPendUsrAr = ''
            // listItem.WfPendUsrEn =  listItem.WfPendUsrEn = ''
          }
          return listItem;
        });

        this.spinner.hide()
      }, (error) => {

        this.spinner.hide()
        this.cs.createMessage("error", error.statusText)

      })
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
