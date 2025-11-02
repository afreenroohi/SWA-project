import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { DataItem } from 'src/app/shared/shared';
import { doumentDownload } from '../committee.model';
import { IconList } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'common-committee-table',
  templateUrl: './committee-table.component.html',
  styleUrls: ['./committee-table.component.scss'],
})
export class CommitteeTableComponent implements OnInit {
  @Input() listOfDisplayData: any;
  @Input() Action: String = '';
  @Input() listOfColumn: any;
  @Input() StepStatus: String = '';
  @Input() Status: String = '';
  @Input() loading: boolean = false;
  @Output() pageIndex = new EventEmitter<string>();
  @Output() page = new EventEmitter<string>();

  role: any;
  cmtid: any;

  searchValue = '';
  visible = false;
  listOfFilterData: any = [];
  listOfOriginalData: any = [];
  readonly IconList = IconList;

  constructor(
    public commonService: CommonService,
    private dataService: PassFormDataService,
    private router: Router,
    public cs: CommonService
  ) { }

  ngOnInit(): void {
    this.listOfFilterData = this.listOfDisplayData;
    console.log(this.StepStatus, 'this.StepStatus')
    

    this.role = localStorage.getItem('ROLEOP');

    if (this.role) {
      this.cmtid = '01'
    }
    if (!this.role) {
      this.role = localStorage.getItem('ROLEEV');
      this.cmtid = '02'
    }
    if (!this.role) {
      this.role = localStorage.getItem('ROLEQP');
      this.cmtid = '03'
    }
    if (!this.role) {
      this.role = localStorage.getItem('ROLEDP');
      this.cmtid = '04'
    }
    if (!this.role) {
      this.role = localStorage.getItem('ROLEMG');
      this.cmtid = '05'
    }
    if (!this.role) {
      this.role = localStorage.getItem('ROLETE');
      this.cmtid = '06';
    }

  }

  /**
   * Open Form Method
   * @param data Selected Line Item Data
   */
  openForm(data: any): void {
    if (this.StepStatus === 'BAP') {
      data.StepStatus === 'BAP';
      this.dataService.storeLineData(data);
      this.router.navigate(['/committee/Bid_Opening_Committe']);
    }
    this.dataService.storeLineData(data);
    if (this.StepStatus === 'BO') {
      this.router.navigate(['/committee/Bid_Opening_Committe']);
    }
    if (this.StepStatus === 'PR') {
      this.router.navigate(['/committee/Bid_Opening_Committe']);
    }
    if (this.StepStatus === 'BDFO') {
      this.router.navigate(['/committee/Bid_Opening_Committe']);
    }
    if (this.StepStatus === 'BQ') {
      this.router.navigate(['/committee/Bid_Qualification_Committee']);
    }
    if (this.StepStatus === 'DP') {
      this.router.navigate(['/committee/dp-evaluation/form']),
      {
        state: { Statis: this.Status },
      };
    }
    if (this.StepStatus === 'BE') {
      this.router.navigate(['/committee/Bid_Eval']);
    }
    if ( this.StepStatus === 'TE' ) {
      this.router.navigate(['/committee/technical-evaluation/evaluation-form'], {
        state: {action: this.Action}
      });
    }
    if ( this.StepStatus === 'VN' ) {
      this.router.navigate(['/committee/vendor/vendor-create'])
    }
    if ( this.StepStatus === 'CO' ) {
      this.router.navigate(['/committee/dp-evaluation/form']),
      {
        state: { Statis: this.Status },
      };
    }
  }

  /**
   * On Page Index change listner method
   * @param pageIndex Page Index
   */
  onPageIndexChange(pageIndex: any | null): void {
    this.pageIndex.emit(pageIndex);
  }


  downloadMoM(data: any) {
    
    const payload: doumentDownload = {
      CommitteeID: data.CommitteeId ?? '',
      TndrID: data.TenderId ?? '',
      Role: this.role,
      Identifier: data.Identifier ?? ''
    };

    this.cs.downloadMOM(payload, `${data.TenderId ?? ''}_${data.MomDecAr ?? ''}`)

  }

  /**
   * Reset Search
   */
  reset(): void {
    this.listOfDisplayData = this.listOfOriginalData;
    this.searchValue = '';
    this.search();
  }

  /**
   * Searh Method
   */
  search(): void {
    this.listOfOriginalData = this.listOfDisplayData;
    this.listOfFilterData = this.listOfDisplayData;
    this.visible = false;
    this.listOfDisplayData = this.listOfFilterData.filter(
      (item: DataItem) => item.TndrName.indexOf(this.searchValue) !== -1
    );
  }

  /**
   * Sort Method
   * @param item1 
   * @param item2 
   */
  sortFn(item1: DataItem, item2: DataItem) {
    item1.PurReqNo.localeCompare(item2.PurReqNo);
  }


}
