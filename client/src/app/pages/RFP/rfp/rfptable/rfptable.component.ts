import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ar_EG, en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { ColumnItem, DataItem } from 'src/app/shared/shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IconList } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'app-rfptable',
  templateUrl: './rfptable.component.html',
  styleUrls: ['./rfptable.component.scss'],
})
export class RfptableComponent implements OnInit, OnChanges {
  @Input() listOfColumn: any;
  @Input() listArray: any;
  @Input() Action: any;
  @Input() selectedType: any;
  @Input() isSearchRFPSelected: boolean = false;
  readonly IconList = IconList;

  detArray: any;
  showDetails = false;
  listOfDisplayData: any;
  listOfData: DataItem[] = [];
  isVisible: any;
  Actiondet: any;

  reqComments: any;

  userList: any;


  searchValue = '';
  visible = false;
  statusvisible = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private nzMessageService: NzMessageService,
    private i18n: NzI18nService,
    private translate: TranslateService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.listArray) {
      this.listOfData = [...this.listArray];
      this.listOfData.forEach((elem) => {
        elem.CreatedOn = this.cs.getDateNew(elem.CreatedOn);
        elem.SlaEndDate = this.cs.getDateNew(elem.SlaEndDate);
        elem.SlaEndTime = this.cs.extractTimeFromString(elem.SlaEndTime);

      });
      this.listOfDisplayData = [...this.listOfData];
      console.log(this.listOfDisplayData,'listOfDisplayData==================')
      
    }
    
  }

  ngOnInit(): void {

  }

 onReAnnouncedChange(data: any) {
  console.log('Re-announced toggled for:', data.RfpNo, '->', data.isReAnnounced);
  // you can call API or update form here
}


  navigate(rfpno: any, RfpVersion: any, stat?: string) {

    if (stat == 'reopen') {
      this.router.navigate(['rfp/change'], {
        state: { RfpNo: rfpno, RfpVersion: RfpVersion, RfpReopen: 'X' },
      });
    }
    else {
      this.router.navigate(['rfp/change'], {
        state: { RfpNo: rfpno, RfpVersion: RfpVersion },
      });
    }
  }

  confirm(rfpno: any, RfpVersion: any, stat?: string) {
    this.spinner.show()
    let data = {
      "RfpNo": rfpno,
      "RfpVersion": RfpVersion,
      "RfpStatus": "C",
      "ReqToMpwrNavg": [],
      "ReqToWorkNavg": [],
      "ReqToTechNavg": [],
      "ReqToAttchNavg": [],
      "ReqToPayNavg": [],
      "ReqToQualfNavg": []
    }
    this.api.post("RfpCancel", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.d.MessageId === 'S') {
        this.cs.createMessage('success', this.cs.userLanguage === "en" ? this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr : res.d.MessageAr);
        // this.spinner.show()
        let data = {
          userid: this.cs.getUserData().userid,
          DeptId: this.cs.getUserData().DeptId,
          Ind: "1"
        }
        data.Ind = this.selectedType;
        this.api.post('RfpHeader', data).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.listArray = res.d.results
          this.listOfData = this.listArray;
          this.listArray = this.listArray.map((listItem: any) => {
            if (listItem.RfpStatus === 'D') {
              listItem.Sla = listItem.SlaAr = ''
            }
            return listItem;
          });
          this.listOfDisplayData = [...this.listArray];


          this.spinner.hide()

        }, (error) => {
          this.spinner.hide()
          this.cs.createMessage("error", error.statusText)

        })
        // this.ngOnChanges()

      }
      else {
        this.cs.createMessage('error', this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr);
        this.spinner.hide();
      }
    }, (error) => {

      this.spinner.hide();
      this.cs.createMessage('error', error);

    })
  }
  cancel() {

    // this.nzMessageService.info('click confirm');
  }

  downloadBtn(CwfDept:string,IsRfpRddApproved:string){
    return this.cs.showEsmPriceBtn(CwfDept,IsRfpRddApproved)
  }

  openDetails(detail: any, Action: any) {
    console.log(detail,'detail=========')
    this.router.navigate(['rfp/detail'], {
      state: {
        RfpNo: detail.RfpNo,
        RfpVersion: detail.RfpVersion,
        RfpDeptId: detail.DeptId,
        WfFlowType: detail.WfFlowType,
        CwfDept: detail.CwfDept,
        CwfApprvLevel: detail.CwfApprvLevel,
        CwfApprvRole: detail.CwfApprvRole,
        NwfApprvDept: detail.NwfApprvDept,
        NwfApprvLevel: detail.NwfApprvLevel,
        NwfApprvRole: detail.NwfApprvRole,
        NwfApprvId: detail.NwfApprvId,
        NwfDept: detail.NwfDept,
        WfReqComment: detail.WfReqComment,
        Action: Action,
        IsRfpRddApproved : detail.IsRfpRddApproved
      },
    });
    this.spinner.show();
  }

  close() {
    this.showDetails = false;
  }



  downloadAttachment(RfpNo:string,RfpVersion:string){
    this.cs.downloadRfpEstmPricePdf(RfpNo,RfpVersion)
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    setTimeout(() => {
      this.isVisible = false;
      // this.isConfirmLoading = false;
    }, 1000);
  }

  openModel() {
    // this.isVisible = true;
    // this.getUserList()
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter(
      (item: DataItem) => item.RfpName.trim().toLowerCase().indexOf(this.searchValue.trim().toLowerCase()) !== -1
    );
  }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
