import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import {
  listOfColumnProjOwnDash,
} from 'src/app/shared/shared';
import { COCDashboardList, searchKey } from '../coc.model';
import { COCService } from '../coc.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-proj-own-dash',
  templateUrl: './proj-own-dash.component.html',
  styleUrls: ['./proj-own-dash.component.scss'],
})
export class ProjOwnDashComponent implements OnInit {

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
    const payload = {
      UserName: this.cs.getUserData().userid,
    };

    this.api.post('CocDashboardSetAction', payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {

      if (res?.d?.results.length) {
        this.listOfData = this.cocService.addSerialNumber(res.d.results);
        this.listOfDisplayData = this.listOfData;
      }

      this.spinner.hide();
    }, (error) => {
      this.spinner.hide()
    });
  }

  navigate(CocNo: any) {
    this.router.navigate(['coc/update'], {
      state: { CocNo: CocNo },
    });
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
    if(this.searchContractNumberValue)  this.searchContractNumberValue = '';
    if(this.searchPoNumberValue) this.searchPoNumberValue = '';
    this.listOfDisplayData = this.listOfData;
    this.closeOpenSearchModel();
  }

  closeOpenSearchModel() : void {
    if(this.showSearchContractNumber) this.showSearchContractNumber = !this.showSearchContractNumber;
    if(this.showSearchPoNumber) this.showSearchPoNumber = !this.showSearchPoNumber;
  }

  get searchKey() {
    return searchKey;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}