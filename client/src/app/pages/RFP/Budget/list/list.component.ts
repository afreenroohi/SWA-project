import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { DataItem, listOfColumnBudget } from 'src/app/shared/shared';
import { IconList } from 'src/app/components/icon/icon.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  listOfColumn = listOfColumnBudget;
  IconList =IconList;
  detArray: any;
  showDetails = false;
  listOfDisplayData: any
  listOfData: any[] = [];
  FilterList:any = [];
  repForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router,
    private cd: ChangeDetectorRef,
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public translate: TranslateService,
    private fb: FormBuilder) {
      this.repForm = this.fb.group({
        trasferBugetFrom: new FormControl(''),
        trasferBugetTo: new FormControl(''),
        projectName: new FormControl(''),
        budgetType: new FormControl('')
      });
  }
  ngOnInit(): void {
    this.getProjs();
    this.getbudgetTypes();
    // console.log('dfjkdhj')
    let role: any = localStorage.getItem('ROLERFP');
    let role1: any = localStorage.getItem('ROLEBUD');

    if (atob(role1) === 'Budallocator') {
      let data = {
        "LogonUsr": this.cs.getUserData().userid
      }
      if (data) {
        this.spinner.show()

        this.api.post('RfpBaHdrSetLogonUsr', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          res.d.results.forEach((element:any) => {
            element['actualStatus'] = this.cs.returnStatus(element.Status);
          });
          this.listOfData = res.d.results;
          this.listOfDisplayData = [...this.listOfData]

          this.spinner.hide()
        }, (error) => {

          this.spinner.hide()
          this.cs.createMessage("error", error.statusText)

        })
      }

    }
    else if (atob(role) === 'Requestor') {
      let data = {
        "userid": this.cs.getUserData().userid
      }

      if (data) {
        this.spinner.show()

        this.api.post('RfpBaHdrSet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          res.d.results.forEach((element:any) => {
            element['actualStatus'] = this.cs.returnStatus(element.Status);
          });
          this.listOfData = res.d.results;
          this.listOfDisplayData = [...this.listOfData]

          this.spinner.hide()
        }, (error) => {
          this.spinner.hide()
          this.cs.createMessage("error", error.statusText)

        })
      }
    }

  }
  projects:any = [];
  getProjs() {
    this.spinner.show()

    let data = {
      ProjId: '',
      CostCenter: localStorage.getItem("CC"),
      ControllingArea: localStorage.getItem("CA")
    }
    this.api.post('F4ProjIdSet', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.projects = res.d.results;
    }, (error) => {
      this.cs.createMessage("error", error.statusText)

    })
  }


  budgetTypes:any = [];
  getbudgetTypes() {
    this.spinner.show()
    this.api.get('getBudgetTypes').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.budgetTypes = res.d.results;

    }, (error) => {
      // this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    })
  }

  openDetails(ProjId: any, ProjType: any, TrfProjid: any) {
    this.spinner.show()


    let data = {
      ProjId: ProjId,
      ProjType: ProjType,
      TrfProjid: TrfProjid
    }
    this.api.post('RfpBaHdrSetDet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.detArray = res.d.results[0];
      this.spinner.hide()
      this.showDetails = true;

    }, (error) => {
      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    })
  }

  close() {
    this.showDetails = false;
  }
  searchValue = '';
  reset(): void {
    this.searchValue = '';
  }

  statusvisible = false;
  searchStatus(): void {
    this.statusvisible = false;
    let search = "";
    if (this.searchValue === 'Draft') { search = "D" }
    if (this.searchValue === 'Submitted') { search = "S" }
    if (this.searchValue === 'Cancelled') { search = "C" }
    if (this.searchValue === 'Approved') { search = "A" }
    if (this.searchValue === 'Returned') { search = "R" }
    this.listOfDisplayData = this.listOfData.filter(
      (item: any) => item.RfpStatus.indexOf(search) !== -1
    );
  }



  handleOk(): void {
    console.log('Button ok clicked!');
    this.showDetails = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.showDetails = false;
  }

  search() {
    this.listOfDisplayData = [...this.listOfData];
    if (this.repForm.value.trasferBugetFrom) {
      this.listOfDisplayData = this.listOfDisplayData.filter((data:any) => data.ProjId == this.repForm.value.trasferBugetFrom);
    }
    if (this.repForm.value.trasferBugetTo) {
      this.listOfDisplayData = this.listOfDisplayData.filter((data:any) => data.TrfProjid == this.repForm.value.trasferBugetTo);
    }
    if (this.repForm.value.projectName) {
      this.listOfDisplayData = this.listOfDisplayData.filter((data:any) => data.UpProjName.toLowerCase().indexOf(this.repForm.value.projectName) > -1);
    }
    if (this.repForm.value.budgetType) {
      this.listOfDisplayData = this.listOfDisplayData.filter((data:any) => data.ProjType == this.repForm.value.budgetType);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
