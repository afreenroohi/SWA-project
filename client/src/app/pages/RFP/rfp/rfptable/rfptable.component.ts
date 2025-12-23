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
  @Input() dashboardType: string = 'my';
  @Input() isEndUser: boolean = false;
  @Input() isPRQualUser: boolean = false;
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
  
  showApproveModal = false;
  showDeclineModal = false;
  showTransferModal = false;
  selectedRowData: any;

  directProcurementCommittees = [
    { en: "Direct Purchasing Committee", ar: "لجنة الشراء المباشر" },
    { en: "Direct Procurement Committee - for Materials and Spare Parts, Head Office", ar: "لجنة الشراء المباشر - للمواد وقطع الغيار، المكتب الرئيسي" },
    { en: "Direct Procurement Committee of the Agency for Research and Promising Technologies Management", ar: "لجنة الشراء المباشر لوكالة إدارة البحوث والتقنيات الواعدة" },
    { en: "Direct Procurement Committee - Services and Projects Head Office", ar: "لجنة الشراء المباشر - الخدمات والمشاريع المكتب الرئيسي" },
    { en: "Direct Procurement Committee of the Groundwater and Surface Water Desalination Agency", ar: "لجنة الشراء المباشر لوكالة تحلية المياه الجوفية والسطحية" },
    { en: "Direct Procurement Committee for Business and Projects Related to Supply Chains", ar: "لجنة الشراء المباشر للأعمال والمشاريع المتعلقة بسلاسل الإمداد" }
  ];

  bidOpeningCommittees = [
    { en: "Bid Opening Committee", ar: "لجنة فتح العروض" },
    { en: "Envelope Opening Committee", ar: "لجنة فتح المظاريف" },
    { en: "Bids Opening Committee for Materials and Spare Parts – Main Center and Coastal Branches", ar: "لجنة فتح العروض للمواد وقطع الغيار - المركز الرئيسي والفروع الساحلية" },
    { en: "East Coast Competitions Opening Committee", ar: "لجنة فتح منافسات الساحل الشرقي" },
    { en: "Bidding Opening Committee for West Coast Competitions", ar: "لجنة فتح العطاءات لمنافسات الساحل الغربي" }
  ];

  bidReviewCommittees = [
    { en: "Bid Review Committee", ar: "لجنة فحص العروض" },
    { en: "Bidding Committee for Competitions", ar: "لجنة العطاءات للمنافسات" },
    { en: "Committee to examine bids for limited and public tenders for spare parts and materials at the main center", ar: "لجنة فحص العروض للمناقصات المحدودة والعامة لقطع الغيار والمواد بالمركز الرئيسي" },
    { en: "Bids Review Committee for Operation and Maintenance", ar: "لجنة فحص العروض للتشغيل والصيانة" },
    { en: "Committee for reviewing bids submitted for public and limited tenders for works and projects related to production systems on the West Coast", ar: "لجنة فحص العروض المقدمة للمناقصات العامة والمحدودة للأعمال والمشاريع المتعلقة بأنظمة الإنتاج بالساحل الغربي" },
    { en: "Committee for reviewing bids submitted for public and limited tenders for works and projects related to production systems on the East Coast", ar: "لجنة فحص العروض المقدمة للمناقصات العامة والمحدودة للأعمال والمشاريع المتعلقة بأنظمة الإنتاج بالساحل الشرقي" },
    { en: "Five-year capital portfolio projects and projects financed by public debt", ar: "مشاريع محفظة رأس المال الخمسية والمشاريع الممولة من الدين العام" },
    { en: "Committee for reviewing bids for public and limited tenders related to the Research and Innovation Institute, the General Administration for Local Competency Projects, the Executive Administration of the Saudi Water Academy, and Shared Services Agency projects", ar: "لجنة فحص العروض للمناقصات العامة والمحدودة المتعلقة بمعهد البحوث والابتكار والإدارة العامة لمشاريع الكفاءة المحلية والإدارة التنفيذية لأكاديمية المياه السعودية ومشاريع وكالة الخدمات المشتركة" },
    { en: "Committee for reviewing bids for public and limited tenders for works and purchases with an estimated cost not exceeding five hundred thousand riyals related to main center departments and transportation systems", ar: "لجنة فحص العروض للمناقصات العامة والمحدودة للأعمال والمشتريات بتكلفة تقديرية لا تتجاوز خمسمائة ألف ريال المتعلقة بإدارات المركز الرئيسي وأنظمة النقل" },
    { en: "Committee for reviewing bids from the Groundwater and Surface Water Purification Agency", ar: "لجنة فحص العروض من وكالة تنقية المياه الجوفية والسطحية" },
    { en: "Committee for the draft agreement on the disposal of treated wastewater, rainwater, and industrial cities", ar: "لجنة مشروع الاتفاقية الخاصة بالتخلص من مياه الصرف الصحي المعالجة ومياه الأمطار والمدن الصناعية" },
    { en: "Committee for reviewing bids for supply chain and strategic transformation projects", ar: "لجنة فحص العروض لمشاريع سلسلة الإمداد والتحول الاستراتيجي" }
  ];

  selectedDirectCommittee: string = '';
  selectedBidOpeningCommittee: string = '';
  selectedBidReviewCommittee: string = '';

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
        if (elem.CreatedOn) {
          elem.CreatedOn = this.cs.getDateNew(elem.CreatedOn);
        }
        if (elem.SlaEndDate) {
          elem.SlaEndDate = this.cs.getDateNew(elem.SlaEndDate);
        }
        if (elem.SlaEndTime) {
          elem.SlaEndTime = this.cs.extractTimeFromString(elem.SlaEndTime);
        }
      });
      this.listOfDisplayData = [...this.listOfData];
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
    if (this.isPRQualUser) {
      this.router.navigate(['rfp/prequalification-view'], {
        state: {
          RequestID: detail.RequestID,
          QualificationCallName: detail.QualificationCallName,
          TechnicalEntity: detail.TechnicalEntity,
          QualificationCommittee: detail.QualificationCommittee,
          Region: detail.Region,
          Activity: detail.Activity
        }
      });
    } else {
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
    }
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

  onActionClick(action: string, data: any): void {
    this.selectedRowData = data;
    this.selectedDirectCommittee = '';
    this.selectedBidOpeningCommittee = '';
    this.selectedBidReviewCommittee = '';
    switch(action) {
      case 'approve':
        this.showApproveModal = true;
        break;
      case 'decline':
        this.showDeclineModal = true;
        break;
      case 'transfer':
        this.showTransferModal = true;
        break;
    }
  }

  isDirectPurchase(): boolean {
    return this.selectedRowData?.CompetitionType === 'Direct Purchase';
  }

  getCommitteeLabel(committee: any): string {
    return this.cs.userLanguage === 'en' ? committee.en : committee.ar;
  }

  handleApproveCancel(): void {
    this.showApproveModal = false;
  }

  handleDeclineCancel(): void {
    this.showDeclineModal = false;
  }

  handleTransferCancel(): void {
    this.showTransferModal = false;
  }

  handleApproveSubmit(): void {
    this.nzMessageService.success(`Approved: ${this.selectedRowData.RfpName || this.selectedRowData.QualificationCallName}`);
    this.showApproveModal = false;
  }

  handleDeclineSubmit(): void {
    this.nzMessageService.success('Rejected Successfully');
    this.showDeclineModal = false;
  }

  handleTransferSubmit(): void {
    this.nzMessageService.info(`Transferred: ${this.selectedRowData.RfpName}`);
    this.showTransferModal = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
