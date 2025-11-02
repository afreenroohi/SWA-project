import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { listOfColumnProjOwnDash } from 'src/app/shared/shared';
import { COCDashboardList, searchKey } from '../coc.model';
import { COCService } from '../coc.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mycoc',
  templateUrl: './mycoc.component.html',
  styleUrls: ['./mycoc.component.scss']
})
export class MycocComponent implements OnInit {

  currentRole = localStorage.getItem('RoleCOC') ?? '';

  listOfColumn = listOfColumnProjOwnDash;
  listOfData: COCDashboardList[] = [];
  listOfDisplayData: COCDashboardList[] = [];

  // * Search Variables
  showSearchContractNumber = false;
  searchContractNumberValue = '';
  showSearchPoNumber = false;
  searchPoNumberValue = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private cocService: COCService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.spinner.show();
    const data = {
      UserName: this.cs.getUserData().userid,
    };

    this.api.post('CocDashboardSet', data).pipe(takeUntil(this.destroy$)).subscribe((cocList) => {
      if (cocList.d.results.length) {
        this.listOfData = this.cocService.addSerialNumber(cocList.d.results);
        this.listOfDisplayData = this.listOfData;
      }
      this.spinner.hide();
    }, (error) => {
      this.cs.createMessage("error", error.statusText)
      this.spinner.hide()
    });
  }


  navigate(CocNo: any, CocStatus: string, reOpen: boolean = false) {
    if (reOpen) {
      this.router.navigate(['coc/create'], {
        state: { CocNo: CocNo, viewMode: false, reOpen: reOpen },
      });
      return;
    }
    this.router.navigate(['coc/update'], {
      state: { CocNo: CocNo, viewMode: true, reOpen: reOpen, allowCancel: this.isReOpenAllowed(CocStatus) },
    });
  }


  isReOpenAllowed(statusCode: string): boolean {
    if (this.currentRole === 'HU' && statusCode === 'CMPL') {
      return true;
    }
    return false;
  }

  search(key: string) {
    if (key === searchKey.ContractNumber) {
      this.searchPoNumberValue = '';
      this.listOfDisplayData = this.listOfData.filter((item) => (item.ContractNumber).indexOf(this.searchContractNumberValue) !== -1);
    }
    if (key === searchKey.PoNumber) {
      this.searchContractNumberValue = '';
      this.listOfDisplayData = this.listOfData.filter((item) => (item.PoNo).indexOf(this.searchPoNumberValue) !== -1);
    }
    this.closeOpenSearchModel();
  }

  reset() {
    if (this.searchContractNumberValue) this.searchContractNumberValue = '';
    if (this.searchPoNumberValue) this.searchPoNumberValue = '';
    this.listOfDisplayData = this.listOfData;
    this.closeOpenSearchModel();
  }

  closeOpenSearchModel(): void {
    if (this.showSearchContractNumber) this.showSearchContractNumber = !this.showSearchContractNumber;
    if (this.showSearchPoNumber) this.showSearchPoNumber = !this.showSearchPoNumber;
  }

  get searchKey() {
    return searchKey;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
