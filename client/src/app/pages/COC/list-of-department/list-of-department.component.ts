import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import { IconList } from 'src/app/components/icon/icon.component';
import { Router } from '@angular/router';
import { COCService } from '../coc.service';
import { TranslateService } from '@ngx-translate/core';

export interface DepartmentList {
  SiNo: number,
  DepartmentName: string,
  ProfitCentre: string
};
@Component({
  selector: 'app-list-of-department',
  templateUrl: './list-of-department.component.html',
  styleUrls: ['./list-of-department.component.scss']
})
export class ListOfDepartmentComponent implements OnInit {

  departmentList: DepartmentList[] = [];
  displayDepartmentList: DepartmentList[] = [];

  readonly IconList = IconList;

  // * Search Variables
  showSearchDepartment = false;
  searchDepartmentValue = '';

  constructor(
    private spinner: NgxSpinnerService,
    public cs: CommonService,
    private api: ApiService,
    private routr: Router,
    private cocService: COCService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.api.get('CocDepartmentSet').subscribe((res) => {
      this.departmentList = this.cocService.addSerialNumber(res.d.results).map((department: DepartmentList) => {
        return {
          SiNo: department.SiNo,
          DepartmentName: department.DepartmentName,
          ProfitCentre: department.ProfitCentre
        }
      });
      this.displayDepartmentList = this.departmentList;
    }, err => {
      this.departmentList = [];
    }).add(() => {
      this.spinner.hide()
    });

  }


  OpenPOandContract(data: any) {
    this.cs.selectedDepartment = data;
    this.routr.navigate(['coc/listofcontractandpo']);
  }

  /**
   * Search Department
   */
  searchDepartment() : void  {
    this.showSearchDepartment = false;
    this.displayDepartmentList = this.departmentList.filter((item) => (item.DepartmentName).toLocaleLowerCase().indexOf(this.searchDepartmentValue.toLocaleLowerCase()) !== -1);
  }

  /**
   * Reset Department Search
   */
  resetDepartment() : void {
    this.searchDepartmentValue = '';
    this.searchDepartment();
  }

}
