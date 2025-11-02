import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { IconList } from 'src/app/components/icon/icon.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { SectionCode } from 'src/app/service/loader';
import { CommonServicesService } from 'src/app/shared/services/common-services.service';
import { LegalRest, tendertypes, COMMITTEE_ROLE, UserActionCode } from 'src/app/shared/shared';
import { environment } from 'src/environments/environment';
import { TechnicalRequirementStauts, TechnicalEvaluation, MemberList, Department, Subcriteria, TechnicalRequirement, doumentDownload, actionButtonDetails } from '../../committee.model';
import { CommitteeService } from '../../committee.service';
import * as _l from 'lodash';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';



interface IPanel {
  name: string, active: boolean, panels?: any
}

interface userDetails {
  ROLE: string,
  CommitteeId: string,
  CommitteeName: string,
  LogdInUsrID: string
}

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]

})
export class WorkflowFormComponent implements OnInit {

 
  @ViewChild('carousel')
  carousel!: NzCarouselComponent;

  IconList = IconList;
  CommitteeID = this.cs.getUserData().CommitteeId;

  id: string | null | undefined;
  bidEvaluationCommitteeForm: FormGroup;
  listOfDisplayData: any;
  initialTenderDetails: any;
  checked: boolean = false;
  value?: string;
  role: string | null = 'CHBO';
  bidEvalData: any;
  membersListData: any = [];
  chairmanDetails: any;
  userDetails: userDetails;
  confirmModal?: NzModalRef; // For testing by now
  vendorResultOpts = LegalRest;
  showCommentsT: boolean = false;
  showAddCommentsT: boolean = false;
  isViewEvaluation: boolean = false;
  Tcmt: any;
  LogdInUsrID: any;
  openMdl = false;
  selectedSecretary: any;

  tendertypes = tendertypes;
  legalresult: any;
  reasonforDisqualification = '';
  otp: any
  getOTPModel: boolean = false;
  @Output()
  paramsForDocHandle = new EventEmitter();

  // FormGroups
  otherDocsFormGroup!: FormGroup;


  showChecklists: boolean = false;

  seletedVenCom = ''

  to_VndrChkLst: any[] = []


  selectedVendor: any;
  selectedVendorDetails: any;
  technicalVendorDetails: any;
  Evalarray: any = [];

  QntySum: any = 0;

  Techtotal = 0
  chkvesele = 0;
  chktecres = 0;

  showlegalcomment = false;
  showtechcomment = false;

  isvendpass = false;

  LegalCmt: any;
  TechCmt: any;
  // VendorComment = '';
  disLegalsub: any;
  disTechsub: any
  ChairmanFinalQual: any;
  LegalList?: FormArray;

  ShowEval = false;
  ShowLegal = false;
  MemFinal = false;

  VendName: string = "";
  viewMode = false;
  chklegres = 0;

  commentsArray: any =[];
  showComments: boolean = false;
  allowBidsQual: boolean = false;
  vendorDetails: any
  OptionSelected: any;

  ChairmanFinalApp = ""
  VndrTnclWgtgeTotal = 0;
  totWeight: number = 0;

  BidsapprovedRole = false;
  BidsOpenCmt = false;

  OFBidFinance = false;
  CHBidFinance = false;

  to_RqstMbrs: any = [];
  finalMOM: any = "";

  ReadOCOM_to_RqstMbrs: any = [];

  techCrtPerct: any;
  selectedVendorIndex!: number;

  isFinancialoffer: boolean = false;

  dateFormat = 'yyyy/MM/dd';
  competitionTypes: any[] = [];

  fileList: NzUploadFile[] = [];
  fileNetList: any[] = [];
  uploadedfiles: any[] = [];
  prevuploadedfiles: any[] = [];
  itnatt: any;
  uploading = false;
  attList?: FormArray;
  otherCommitteeAttachments: any[] = [];

  openSecretarySelectionFinalSubmit: boolean = false;

  F4_TechReqStatus: TechnicalRequirementStauts[] = [];
  showTechEvalCrit: boolean = false;

  IsAttachmentModel: any = false;
  IsAttachmentModelup: any = false;
  selectedBovalue: any;
  public readonly panels: IPanel[] = [
    {name: `TenderDetails`, active: true},
    {name: `CommitteeMembers`, active: false},
    {name: `Vendors`, active: false},
    {name: `CommitteeRecommendations`, active: false},
    {name: `Attachments`, active: false},
  ];

  public readonly COMMITTEE_ROLE = COMMITTEE_ROLE;

  private readonly destroy$ = new Subject<void>();

  subCriteriaForm: FormGroup = this.fb.group({
    to_tevalsub: this.fb.array([])
  });

  isSubCriteria: boolean = false;
  criteriaIndex: number = 0;
  technicalEvaluationByMember: any;
  rfpEstimationPrice: number = 0

  actionButtons!: actionButtonDetails[] ;

  isBidsFromTechMem: boolean = false;

  expandIconPosition: 'left' | 'right' = 'right';

  isCriteriaApplicableArray: string[] = [];
  to_VndrTec: any[] = [];
  showAllTechMemEvaluation: boolean = false;
  selectedTechMemvEvalData: any[] = [];
  

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public cs: CommonService,
    private changeDetector: ChangeDetectorRef,
    private modal: NzModalService,
    private formData: PassFormDataService,
    private formDataSrv: PassFormDataService,
    private committeeService: CommitteeService,
    private filterPipe: FilterPipe,
    public translate: TranslateService,
    public commonService: CommonService,
    public sharedCommonService: CommonServicesService

  ) {
    this.bidEvaluationCommitteeForm = this.fb.group({
      RFPNumber: new FormControl(''),
      TenderName: new FormControl(''),
      openingDate: new FormControl(''),
      FinanceOfferOpeningDate: new FormControl(''),
      ReferenceNumber: new FormControl(''),
      typeOfPurchase: new FormControl(''),
      typeOfTendering: new FormControl(''),
      etimadNumber: new FormControl(''),
      CmtFrmNumber: new FormControl({value: '', disabled: true}),
      CmtFrmDate: new FormControl({value: '', disabled: true}),
      technicalEvaluationMember: new FormControl(''),
      committeeHead: new FormControl(''),
      committeeHeadMembers: new FormControl('', [Validators.required]),
      noOfVendors: new FormControl(''),
      to_RqstVndrs: new FormControl('', [Validators.required]),
      qualCommResult: new FormControl(''),
      legalEvaluation: new FormControl(''),
      qualCommComment: new FormControl(''),
      Comments: new FormControl(''),
      evalComments: new FormControl(''),
      chairmanComment: new FormControl(''),
      mom: new FormControl({ value: '', disabled: true }),
      attachments: new FormControl(''),
      cmtworks: new FormControl(''),
      finalOfferPrice: new FormControl(''),
      comments: new FormControl(''),
      finalResult: new FormControl(''),
      finalComments: new FormControl(''),
      to_TechEval: this.fb.array([]),
      TchnclMbrCmnt: this.fb.control(''),
      to_LeglEval: this.fb.array([]),
      SubmissionDate: new FormControl({
        value: '',
        disabled: true,
      }),
      CompetitionTypeID: new FormControl({
        value: '',
        disabled: true,
      }),
      vendorInvitationsSent: this.fb.array([]),
      Attachments: this.fb.array([]),
      to_TechReqEval: this.fb.array([]),
      FinWeightage: new FormControl({value: '' , disabled: true}),
      TechWeightage: new FormControl({value: '' , disabled: true})
    });

    this.attList = this.bidEvaluationCommitteeForm.get(
      'Attachments'
    ) as FormArray;

    this.to_TechEval.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calculateTechnicalTotal(this.bidEvaluationCommitteeForm.getRawValue()?.to_TechEval);
    });

    // * Checks for the Technical Requirement Form value changes - All the Technical Requirement has application
    this.to_TechReqEval.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((TechnicalReq) => {
      this.showTechEvalCrit = this.checkAllApplicable(TechnicalReq);
    });

    // * Trim the comments value
    this.TchnclMbrCmnt.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(2000)).subscribe((commentValue: string) => {
      this.TchnclMbrCmnt.setValue(commentValue.trim());
    });

    // * Set the User details Object
    this.userDetails = {
      ROLE: localStorage.getItem("ROLETE") ?? localStorage.getItem(`ROLEMG`) ?? ``,
      CommitteeId: "06",
      CommitteeName: localStorage.getItem("CommitteeName") ?? '',
      LogdInUsrID: localStorage.getItem("LogdInUsrID") ?? ''
    };
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  async addLegal(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any, reasonfordisqualification?: any) {
    await this.LegalList?.push(this.createLegalEval(VendorId, TenderId, CommitteeId, LegalResult, reasonfordisqualification))
  }
  removeLegal(i: any) {
    this.LegalList?.removeAt(i)
  }

  ngOnInit(): void {
    this.OptionSelected = this.formDataSrv.getStatus();
    this.LegalList = this.bidEvaluationCommitteeForm.get('to_LeglEval') as FormArray;
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID');

    this.role = this.userDetails.ROLE;

    // * Chairman role and option selected
    if (this.role === "CH") {
      if (this.OptionSelected == "BidToEval") {
      }
      else if (this.OptionSelected == "QualCom") {
        this.ChairmanFinalQual = "FinalQual"
      }
      else if (this.OptionSelected === "BidOpen") {
      }
      else if (this.OptionSelected === "BidToEval") {
      }
      else if (this.OptionSelected === "BidFinance") {
        this.CHBidFinance = true;
      }
      else if (this.OptionSelected === "BidList") {
        this.viewMode = true;
      }
      else if (this.OptionSelected === "BidAppr") {
        // this.ChairmanFinalApp = "Final"
        this.ChairmanFinalQual = "FinalQual";
        this.BidsapprovedRole = true;
      }

      else if (this.OptionSelected === "BidToFinal") {
        this.MemFinal = true;

      }
    }
    // * Officer role and option selected
    else if (this.role === "OF") {
      if (this.OptionSelected == "BidToEval") {
        // Todo: set to bids to be
      }
      else if (this.OptionSelected === "BidFinance") {
        this.OFBidFinance = true;
      }
      else if (this.OptionSelected === "BidOpen") {
        // Todo: set bid open
      }
      else if (this.OptionSelected === "BidList") {
        this.viewMode = true;
        // Todo: set to bid list
      }

      else if (this.OptionSelected === "BidToFinal") {
        this.MemFinal = true;

      }

    }
    // * Member role and option selected
    else if (this.role === "LM" || this.role === "TM" || this.role === "FM" || this.role === "PM") {
      if (this.OptionSelected == "BidToEval") {
        this.ChairmanFinalApp = "X"
      }
      else if (this.OptionSelected === "BidList") {
        // Todo: set to bid list
        this.viewMode = true;
      }
      else if (this.OptionSelected === "BidAppr") {
        // Todo: set to bid list
      }
      else if (this.OptionSelected === "BidToFinal") {
        this.MemFinal = true;
      }

    }

    // For CEO, VP and Director
    else if (localStorage.getItem('ROLEMG') == 'VP' || localStorage.getItem('ROLEMG') == 'SS' || localStorage.getItem('ROLEMG') == 'CO') {
      this.viewMode = true;
    }

    this.initialTenderDetails = this.formData.getData();
    if (this.initialTenderDetails && this.initialTenderDetails.WFCmtMnuAction == 'BOFR') {
      this.isFinancialoffer = true;
    }

    if (window.history.state.action === "BFTM") {
      this.isBidsFromTechMem = true;
    }

    this.getTenderDetails();

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: LangChangeEvent) => {
      this.bidEvaluationCommitteeForm.controls['typeOfPurchase']?.setValue(this.cs.returnPurchaseType(this.bidEvalData.PurTypID));
      this.bidEvaluationCommitteeForm.controls['typeOfPurchase'].updateValueAndValidity();

      this.bidEvaluationCommitteeForm.controls['typeOfTendering']?.setValue(this.cs.returnTypeOfEnvlope(this.bidEvalData.TndrTypeID));
      this.bidEvaluationCommitteeForm.controls['typeOfTendering'].updateValueAndValidity();
    });
    this.getCompetitionTypes();

    // * Get Evaluation Percentage
    this.getEvaluationWeightage();

    
  }

  getCompetitionTypes() {
    this.api
      .post('F4_CMPTN_TYPE', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.d.results.length > 0) {
          this.competitionTypes = res.d.results;
        }
      });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  showHideComments(data?: any) {
    if (data) {
      this.selectedVendor = data.VendorId
      this.getComments();
    }
    else {
      this.showComments = false
    }

  }

  checkValueSize() {

    if (this.Techtotal > 100) {
      this.cs.createMessage('error', this.translate.instant('COM.Actual Comment'));
      return;
    }

  }

  commentDate(date: any) {

    return date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + ' ' + date.slice(8, 10) + ':' + date.slice(10, 12) + ':' + date.slice(12, 14);


  }

  showLegalComment(value?: any) {
    if (value) {
      this.selectedVendor = value.VendorId
    }

    if (this.showlegalcomment) {
      this.showlegalcomment = false;
    }
    else {
      this.showlegalcomment = true;
    }
  }
  showTechComment(value?: any) {
    if (value) {
      this.selectedVendor = value.VendorId
    }

    if (this.showtechcomment) {
      this.showtechcomment = false;
    }
    else {
      this.showtechcomment = true;
    }

  }
  OpenRoleModal(value: string) {
    if (this.openMdl) {
      this.openMdl = false;
    }
    else {
      this.openMdl = true;
    }
  }

  getTenderDetails(): void {
    const tendDetails = {
      TenderId: this.initialTenderDetails?.TndrID
    }
    this.spinner.show();
    this.api.post("ECOM_TENDER_DETAILS", tendDetails).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        var data = res.d.results[0];
        this.bidEvalData = data;
        this.setActionsinActionButtons(res.d.results[0].to_Button.results)
        
        console.log(this.bidEvalData)
        if (this.bidEvalData) {
          this.bidEvaluationCommitteeForm.controls['TenderName']?.setValue(this.bidEvalData.TndrName);
          this.bidEvaluationCommitteeForm.controls['TenderName']?.updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['openingDate']?.setValue(this.cs.returnDate(this.bidEvalData.BidOpngDate));
          this.bidEvaluationCommitteeForm.controls['openingDate'].updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['FinanceOfferOpeningDate']?.setValue(this.cs.returnDate(this.bidEvalData.FinanceOfferOpeningDate));
          this.bidEvaluationCommitteeForm.controls['FinanceOfferOpeningDate']?.updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['ReferenceNumber']?.setValue(this.bidEvalData.PurReqNo);
          this.bidEvaluationCommitteeForm.controls['ReferenceNumber'].updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['typeOfPurchase']?.setValue(this.cs.returnPurchaseType(data.PurTypID));
          this.bidEvaluationCommitteeForm.controls['typeOfPurchase'].updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['typeOfTendering']?.setValue(this.cs.returnTypeOfEnvlope(this.bidEvalData.TndrTypeID));
          this.bidEvaluationCommitteeForm.controls['typeOfTendering'].updateValueAndValidity();


          this.bidEvaluationCommitteeForm.controls['etimadNumber']?.setValue(this.bidEvalData.EtimadNo);
          this.bidEvaluationCommitteeForm.controls['etimadNumber'].updateValueAndValidity();

          // Committee Formation Number and Date
          this.bidEvaluationCommitteeForm.controls['CmtFrmDate']?.setValue(this.cs.getDate(this.bidEvalData.CmtFrmtnOrdrDatebec));
          this.bidEvaluationCommitteeForm.controls['CmtFrmDate']?.updateValueAndValidity();
          this.bidEvaluationCommitteeForm.controls['CmtFrmNumber']?.setValue(this.bidEvalData.CmtFrmtnOrdrNobec);
          this.bidEvaluationCommitteeForm.controls['CmtFrmNumber']?.updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['technicalEvaluationMember']?.setValue(this.bidEvalData.TchnclEvltnMmbrName);
          this.bidEvaluationCommitteeForm.controls['technicalEvaluationMember'].updateValueAndValidity();

          this.bidEvaluationCommitteeForm.controls['committeeHead']?.setValue(this.bidEvalData.CommitteeUserName);
          this.bidEvaluationCommitteeForm.controls['committeeHead'].updateValueAndValidity();

          this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: number) => {
            if (element.IsVendorSelected == "Y") {
              if (this.role === 'OF' && this.MemFinal) {
                this.bidEvaluationCommitteeForm.controls['mom'].enable();
              }
              this.bidEvaluationCommitteeForm.controls['mom'].setValue(this.bidEvalData.CommitteeCmntsArea);
            }

            /* Commenting To fix - If legal result is fail then technical result is not required to be failed.
            if (element.VndrLegalResult === 'Fail') {
              this.bidEvalData.to_RqstVndrs.results[index].VndrTnclEvalScore = 'Fail'
            } */
          });


          this.bidEvaluationCommitteeForm.controls['attachments'].setValue(this.bidEvalData.CommitteeAtchArea);
          this.bidEvaluationCommitteeForm.controls['attachments'].updateValueAndValidity()
          this.bidEvaluationCommitteeForm.controls['attachments'].disable()

          this.bidEvaluationCommitteeForm.controls['cmtworks'].setValue(this.bidEvalData.CommitteeTxtArea);
          this.bidEvaluationCommitteeForm.controls['cmtworks'].updateValueAndValidity()
          this.bidEvaluationCommitteeForm.controls['cmtworks'].disable()

          const finalOfferPrice = this.getFinalOfferPrice();

          this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].setValue(finalOfferPrice);
          this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].updateValueAndValidity();
          this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].disable();

          if (this.role === 'OF') {
            this.bidEvaluationCommitteeForm.controls['attachments'].enable()
          }

          if ((this.role === 'CH' || this.role === 'OF') && this.MemFinal) {
            this.bidEvaluationCommitteeForm.controls['cmtworks'].enable();
            if (this.role === 'OF') {
              this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].enable();
              this.bidEvaluationCommitteeForm.controls['cmtworks'].addValidators(Validators.required);
              this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].addValidators(Validators.required);
              this.bidEvaluationCommitteeForm.controls['mom'].addValidators(Validators.required);
            }
          }

          // set competetion type value
          if (
            this.bidEvalData.CompetitionTypeID &&
            this.bidEvalData.CompetitionTypeID !== '00'
          ) {
            this.bidEvaluationCommitteeForm
              .get('CompetitionTypeID')
              ?.setValue(this.bidEvalData.CompetitionTypeID);
          }

          // set quotation submission date
          if (this.bidEvalData.SubmissionDate) {
            this.bidEvaluationCommitteeForm
              .get('SubmissionDate')
              ?.setValue(moment(this.bidEvalData.SubmissionDate, 'YYYYMMDD').toISOString());
          }

          if (
            this.bidEvalData.to_LmtdVndrs &&
            this.bidEvalData.to_LmtdVndrs.results &&
            this.bidEvalData.to_LmtdVndrs.results.length > 0
          ) {
            const limitedVendorsControl = this.bidEvaluationCommitteeForm.get(
              'vendorInvitationsSent'
            ) as FormArray;

            this.bidEvalData.to_LmtdVndrs.results.forEach(
              (limitedVendor: any, key: number) => {
                let form = limitedVendorsControl.at(key);
                if (form === undefined) {
                  this.addNewInvitationSent();
                  form = limitedVendorsControl.at(key);
                }
                form.get('LmtdVendorId')?.setValue(limitedVendor.LmtdVendorId);
                form.get('TenderId')?.setValue(limitedVendor.TenderId);
                form
                  .get('LmtdVendorName')
                  ?.setValue(limitedVendor.LmtdVendorName);
              }
            );
          }

        }
        this.getStatusList(false);
        if (this.bidEvalData) {
          this.vendorDetails = this.bidEvalData.to_RqstVndrs.results;

          if(this.isFinanceMemberCrossed){
            this.vendorDetails.forEach((element: any, index: any) => {
              element.PricePreference = parseFloat(element?.PricePreference).toString();
              element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
            });
          }

          this.vendorDetails.forEach((vendor: any, index: number) => {
            this.isCriteriaApplicableArray.push(vendor.IsCriteriaApplicable)
          })

         
          if (this.role === 'TM') {
            const currentUser = this.userDetails.LogdInUsrID;
            this.to_VndrTec = [];

            this.bidEvalData?.to_RqstVndrs.results.forEach((result: any) => {
              if (!result.to_VndrTec) result.to_VndrTec = { results: [] };

              // find vendor for current user
              const vendorForUser = result.to_VndrTec.results.find(
                (vendor: any) => vendor.CreatedBy === currentUser
              );

              if (vendorForUser) {
                this.to_VndrTec.push({
                  ...vendorForUser,
                  IsCriteriaApplicable: vendorForUser.IsCriteriaApplicable || ''
                });
              } else {
                // if no vendor exists for current user, create one
                const vendorObj = {
                  TenderId: result?.TenderId ?? '',
                  VendorId: result?.VendorId ?? '',
                  IsCriteriaApplicable: '',
                  CreatedBy: currentUser
                };
                result.to_VndrTec.results.push(vendorObj);
                this.to_VndrTec.push(vendorObj);
              }
            });

            console.log(this.to_VndrTec);
          }



          this.lowestPricebyVendors = parseInt(this.vendorDetails.reduce((lowest: any, vendor: any) => {
            return (parseInt(lowest.Price) < parseInt(vendor.Price)) ? lowest : vendor
          }).Price);

          this.committeeService.setPricePreference(this.vendorDetails);
          this.getMemberDetails();
        }

        if (this.bidEvalData?.to_Attach) {
          const { committeeFiles, notCommitteeFiles } = this.bidEvalData.to_Attach.results.reduce(
            (acc: any, node: any) => {
              // if ( node.FilenetID && node.FileName) {
              //     if (this.CommitteeID === node.CommitteeId) {
              //       acc.committeeFiles.push(node)
              //     }else {
              //       acc.notCommitteeFiles.push(node)
              //     }
              // }

              // New Requirement 
              // If this.CommitteeID === node.CommitteeId → Always push that node into committeeFiles.
              // If this.CommitteeID === '05', also include nodes where node.CommitteeId === '04'.
              // If this.CommitteeID === '06', also include nodes where node.CommitteeId === '04'
              if (node.FilenetID && node.FileName) {

                const isSameCommittee = this.CommitteeID === node.CommitteeId;
                const isSpecialCase =
                  (this.CommitteeID === '05' || this.CommitteeID === '06') &&
                  node.CommitteeId === '04';

                if (isSameCommittee || isSpecialCase) {
                  acc.committeeFiles.push(node);
                } else {
                  acc.notCommitteeFiles.push(node);
                }
              }
              return acc;
            },
            { committeeFiles: [], notCommitteeFiles: [] }
          );
          this.fileNetList = [
            ...committeeFiles
          ];
          this.otherCommitteeAttachments = [
            ...notCommitteeFiles
          ];
        }

      },
      (err) => {
        this.spinner.hide();
      }
    );

  }

addOrUpdateVendor(vendorObj: any) {
  const existingVendor = this.to_VndrTec.find(
    v => v.VendorId === vendorObj.VendorId && v.TenderId === vendorObj.TenderId
  );

  if (existingVendor) {
    if (vendorObj.CreatedBy === this.userDetails.LogdInUsrID) {
      // Only update if same user
      existingVendor.IsCriteriaApplicable = vendorObj.IsCriteriaApplicable;
    } else {
      // For other users, keep it empty so they can add their validation
      existingVendor.IsCriteriaApplicable = '';
    }
  } else {
    this.to_VndrTec.push(vendorObj);
  }
}

  editIsCriteriaApplicable(index: number) {
    this.bidEvalData.to_RqstVndrs.results[index].IsCriteriaApplicable = this.isCriteriaApplicableArray[index];
  }

editIsCriteriaApplicableTM(vendor: any, index: number) {
  const currentUser = this.userDetails.LogdInUsrID;
  const result = this.bidEvalData.to_RqstVndrs.results[index];
  const existingVendors = result.to_VndrTec.results;

  const vendorIndex = existingVendors.findIndex(
    (v:any) => v.VendorId === vendor.VendorId && v.TenderId === vendor.TenderId
  );

  if (vendorIndex > -1) {
    if (existingVendors[vendorIndex].CreatedBy === currentUser) {
      // Update only current user's entry
      existingVendors[vendorIndex] = {
        ...existingVendors[vendorIndex],
        IsCriteriaApplicable: vendor.IsCriteriaApplicable
      };
    } else {
      // Add a new entry for the current user
      existingVendors.push({
        ...vendor,
        IsCriteriaApplicable: vendor.IsCriteriaApplicable,
        CreatedBy: currentUser
      });
    }
  } else {
    // New vendor entirely
    existingVendors.push({
      ...vendor,
      CreatedBy: currentUser
    });
  }
}

  get isAllEvaluated(): boolean {
    const numberofVendors = this.bidEvalData.to_RqstVndrs?.results.length;
    let evaluation: any[] = [];
    this.bidEvalData?.to_RqstVndrs?.results?.forEach((vendor: any) => {
      const tempEval = vendor.to_VndrTec.results.find((evaluation: any) => 
        evaluation.CreatedBy === this.userDetails.LogdInUsrID);
      if(tempEval) {
        evaluation.push(tempEval);
      }
    })
    return numberofVendors === evaluation.length;
  }

  get isAllCriteria(): boolean {
    const numberofVendors = this.bidEvalData.to_RqstVndrs?.results.length;
    let criteriaNumber = 0;
    this.bidEvalData?.to_RqstVndrs?.results?.forEach((vendor: any) => {
      if (vendor.IsCriteriaApplicable !== "") {
        criteriaNumber++;
      }
    })
    return numberofVendors === criteriaNumber;
  }

  validationForButton () : boolean {
    if (this.isTenderDP) {
      return false;
    }
    return !this.isAllEvaluated || (this.role === 'CH' && this.highestTechvalScore === 0)
  }

  validationForButtonDP(): boolean {
    return !this.isAllCriteria
  } 


  otpKeys: string[] = [];

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    // Store the provided action buttons list
    this.actionButtons = actionButtonsList;
  
    // Define action mapping (with more flexible keys using Partial)
    const actionMap: Partial<Record<string, any>> = {

      // Chairman Action
      'BTTE_CH_SUB': this.assignMember.bind(this, UserActionCode.submit),
      'BFTM_CH_ABC': this.approve.bind(this, UserActionCode.assignToBidEvalCommittee),
      'BFTM_CH_ABO': this.approve.bind(this, UserActionCode.assignToBidOpeningCommittee),
      'BFTM_CH_RET': this.returnBid.bind(this, UserActionCode.return),
      'BFTM_CH_ADP': this.approve.bind(this, UserActionCode.assignToDirectPurchase),
      'BTTE_CH_ATM': this.assignMember.bind(this, UserActionCode.assignToTechnicalMember),

      // Technical Member Action
      'BTTE_TM_SUB': this.approve.bind(this, UserActionCode.submit),
      'BTTE_TM_APR': this.approve.bind(this, UserActionCode.approve)
    };

    const validationMap: Partial<Record<string, any>> = {

      // Chairman Validation
      'BFTM_CH_ABC': this.validationForButton.bind(this),
      'BFTM_CH_ABO': this.validationForButton.bind(this),
      'BFTM_CH_ADP': this.validationForButton.bind(this),
      'BTTE_CH_SUB': this.isTenderDP ? this.validationForButtonDP.bind(this) : () => {return false},

      // Technical Member Action
      'BTTE_TM_SUB': this.validationForButton.bind(this)

    }
  
    // Iterate over the action buttons
    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID, OTP_Required } = button;
  
      // Construct the key dynamically
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;

      // Check if the action exists in the actionMap and assign it if it does
      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
        if (OTP_Required === 'X') {
          this.otpKeys.push(actionKey)
        }
      }

      // Check if the action exists in the validationMap and assign it if it does
      if (validationMap[actionKey]) {
        button.validation = validationMap[actionKey]
      } else {
        button.validation = () => {return false};
      }
    });
  }

  actionCheckerForOTP(action?: UserActionCode): boolean {   
    const button = this.actionButtons.find(button => button.Button_ID === action);
    if (button) {
      const { CmtMenu, CmtRole, Button_ID } = button;      
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;    
      return this.otpKeys.includes(actionKey);       
    }else {
      return false;
    }
  } 


  getIsApplicableorNot(statusID: string): string {
    const currentStatus = this.F4_TechReqStatus.find(status => status.TechReqStatusID === statusID)
    if (this.isUserLanguageEnglish) {
      return currentStatus?.TechReqStatusDescEN ?? '-';
    } else {
      return currentStatus?.TechReqStatusDescAR ?? '-';
    }
  }

  financialWeightage: number = 0;
  technicalWeigtage: number = 0;

  // * Get Evaluation Percentage
  getEvaluationWeightage() {
    this.api.get(`get-evaluation-weightage?tender_id=${this.initialTenderDetails?.TndrID}`)
    .pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.financialWeightage = parseFloat(res.d.FinEvalWatage);
      this.bidEvaluationCommitteeForm.controls['FinWeightage'].setValue(res.d.FinEvalWatage);
      this.bidEvaluationCommitteeForm.controls['FinWeightage'].updateValueAndValidity();
      this.technicalWeigtage = parseFloat(res.d.TechEvalWatage);
      this.bidEvaluationCommitteeForm.controls['TechWeightage'].setValue(res.d.TechEvalWatage);
      this.bidEvaluationCommitteeForm.controls['TechWeightage'].updateValueAndValidity();
    }, (err) => {
      
    })
  }

  getFinalOfferPrice() {
    let finalPrice = '';
    this.bidEvalData?.to_RqstVndrs?.results.forEach((vendor: any) => {
      if (vendor.IsVendorSelected === 'Y') {
        finalPrice = vendor.FinalPriceOffer;
      }
    });
    return finalPrice;
  }

  get VendorInvitationsSent() {
    return this.bidEvaluationCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
  }

  vendorInvitationItem(): FormGroup {
    return this.fb.group({
      TenderId: '',
      LmtdVendorId: '',
      LmtdVendorName: [{ value: '', disabled: true }],
    });
  }

  addNewInvitationSent() {
    const control = this.bidEvaluationCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
    control.push(this.vendorInvitationItem());
  }

  getDate(date: string) {
    return this.cs.returnDate(date);
  }

  passFail(data: any, index: any): void {
    this.bidEvalData.to_RqstVndrs.results[index].to_LeglEval.results[index].LegalResult
  }

  onmemberChange(event: any, data: any, index: any) {
    if (data === 'fixed') {
      if (this.membersListData[index].SelectedMbr === 'M') {
        delete this.membersListData[index].SelectedMbr;
        this.to_RqstMbrs.forEach((element: any, ind: number) => {
          if (
            element.CommitteeUserName ===
            this.membersListData[index].CommitteeUserName
          ) {
            this.to_RqstMbrs.splice(ind, 1);
          }
        });
      } else {


        this.membersListData[index].SelectedMbr = 'M';
        this.membersListData[index].CommitteeUser
          ? this.membersListData[index].CommitteeUser
          : (this.membersListData[index].CommitteeUser =
            this.membersListData[index].CommitteeUserID);
        this.membersListData[index].CommitteeBckupUser =
          this.membersListData[index].CommitteeBkpUserID
        const i = this.to_RqstMbrs.findIndex(
          (_element: any) =>
            _element.CommitteeUserName ===
            this.membersListData[index].CommitteeUserName
        );
        if (i > -1) this.to_RqstMbrs[i] = this.membersListData[index]; // (2)
        else {

          this.to_RqstMbrs.push(this.membersListData[index]);
        }
      }
    } else if (data === 'Backup') {
      if (this.membersListData[index].SelectedMbr === 'B') {
        delete this.membersListData[index].SelectedMbr;
        this.to_RqstMbrs.forEach((element: any, ind: number) => {
          if (
            element.CommitteeUserName ===
            this.membersListData[index].CommitteeUserName
          ) {
            this.to_RqstMbrs.splice(ind, 1);
          }
        });
      } else {
        this.membersListData[index].SelectedMbr = 'B';
        this.membersListData[index].CommitteeUser
          ? this.membersListData[index].CommitteeUser
          : (this.membersListData[index].CommitteeUser =
            this.membersListData[index].CommitteeUserID);

        this.membersListData[index].CommitteeBckupUser =
          this.membersListData[index].CommitteeBkpUserID
        const i = this.to_RqstMbrs.findIndex(
          (_element: any) =>
            _element.CommitteeUserName ===
            this.membersListData[index].CommitteeUserName
        );
        if (i > -1) this.to_RqstMbrs[i] = this.membersListData[index]; // (2)
        else {
          // this.membersListData[index].TenderId = this.bidEvalData.TndrID;
          this.to_RqstMbrs.push(this.membersListData[index]);
        }
      }
    }
    // this.to_RqstMbrs.forEach((element: any) => {
    //   delete element.__metadata;
    //   delete element.ValidCmtUsr;
    //   delete element.ValidCmtBkpUsr;
    //   delete element.CommitteeYear;
    //   //element.CommitteeUser == '' ? element.CommitteeUser = element.CommitteeUserID : element.CommitteeUser;
    //   delete element.CommitteeUserID;
    //   element.CommitteeBckupUser = element.CommitteeBkpUserID
    //     ? element.CommitteeBkpUserID
    //     : element.CommitteeBckupUser;
    //   element.CommitteeBkpUserName = element.CommitteeBkpUserName
    //     ? element.CommitteeBkpUserName
    //     : element.CommitteeBkpUserName;
    //   element.TenderId = this.bidEvalData.TndrID;
    //   delete element.CommitteeBkpUserID;
    //   delete element.CommitteeRoleName;
    // });


  }

  selectVendor(value: any, selectedVendorId: any) {

    const i = this.bidEvalData.to_RqstVndrs.results.findIndex((vendor: any) => vendor.VendorId === selectedVendorId);

    if (this.MemFinal) {
      if (this.bidEvalData.to_RqstVndrs.results[i].IsVndrtechQualified === "X" || this.bidEvalData.to_RqstVndrs.results[i].IsVndrfnclQualified === "X") {
        if (value == true) {

          this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "Y"
        }
        else if (value == false) {
          this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "N"
        }
        else {
          this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "N"
        }
      }
      else {
        this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "N"
        this.cs.createMessage("success", this.translate.instant("COM.QualError"))
      }
    }
    else {
      // if(this.bidEvalData.to_RqstVndrs.results[i].)
      if (value == true) {
        this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "Y"
      }
      else if (value == false) {
        this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "N"
      }
      else {
        this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = "N"
      }
    }

  }

  openingDataBasedonTenderType(): boolean {
    return this.bidEvalData.TndrTypeID === '01';
  }

  assignOfficer(value: any) {
 
    console.log(this.membersListData)
    this.membersListData.forEach((item: any) => {
      if ((item.CommitteeRoleName == "Committee Legal Member" && item.SelectedMbr == "M") || (item.CommitteeRoleName == "Committee Financial Member" && item.SelectedMbr == "M")) {
        this.to_RqstMbrs.push(item)
      }
    })
    if (this.to_RqstMbrs.length > 0) {
      let members: {
        CommitteeId: any;
        TenderId: any;
        CommitteeRole: any;
        CommitteeUser: any;
        CommitteeBckupUser: any;
        CommitteeUserName: any;
        CommitteeBkpUserName: any;
        SelectedMbr: any;
      }[] = [];
      this.to_RqstMbrs.forEach((item: any) => {
        let memberItem = {
          //  CommitteeId
          "CommitteeId": item.CommitteeId,
          "TenderId": this.bidEvalData.TndrID,
          "CommitteeRole": item.CommitteeRole,
          "CommitteeUser": item.CommitteeUserID ? item.CommitteeUserID : item.CommitteeUser,
          "CommitteeBckupUser": item.CommitteeBkpUserID ? item.CommitteeBkpUserID : item.CommitteeBckupUser,
          "CommitteeUserName": item.CommitteeUserName,
          "CommitteeBkpUserName": item.CommitteeBkpUserName,
          "SelectedMbr": item.SelectedMbr
        }
        members.push(memberItem);
      });
      this.to_RqstMbrs = members;
      // this.bidEvalData.to_RqstMbrs.results = [members];
    }
    else {
      this.to_RqstMbrs = [];
    }

    if (this.isFinancialOffer && !this.checkMemberValid(this.to_RqstMbrs, this.bidEvalData.TndrTypeID)) { return; }

    this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
      
      element.PricePreference = this.vendorDetails[index]?.PricePreference !== undefined ? this.vendorDetails[index]?.PricePreference.toString() : "0";
      element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
    })

    let data: any = {
      TndrID: this.bidEvalData.TndrID,
      TndrName: this.bidEvalData.TndrName,
      BidOpngDate: this.bidEvalData.BidOpngDate,
      FinanceOfferOpeningDate: this.bidEvalData.FinanceOfferOpeningDate,
      RFPNumber: this.bidEvalData.RFPNumber,
      PurReqNo: this.bidEvalData.PurReqNo,
      PurTypID: this.bidEvalData.PurTypID,
      PurTypeDesc: this.bidEvalData.PurTypeDesc,
      TndrTypeID: this.bidEvalData.TndrTypeID,
      TndrTypeDesc: this.bidEvalData.TndrTypeDesc,
      EtimadNo: this.bidEvalData.EtimadNo,
      TndrStatus: this.bidEvalData.TndrStatus,
      CommitteeTxtArea: this.bidEvalData.CommitteeTxtArea,
      CommitteeAtchArea: this.bidEvalData.CommitteeAtchArea,
      CmtFrmtnOrderNodp: this.bidEvalData.CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.bidEvalData.CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.bidEvalData.CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.bidEvalData.CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.bidEvalData.CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.bidEvalData.CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.bidEvalData.CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.bidEvalData.CmtFrmtnOrdrNobqc,
      CommitteeID: '06',
      CommitteeName: localStorage.getItem('CommitteeName'),
      AsgnOpngCmtOfficerID: this.bidEvalData.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.bidEvalData.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: this.bidEvalData.AsgnQualCmtOfficerID,
      AsgnQualCmtOfficerName: this.bidEvalData.AsgnQualCmtOfficerName,
  
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.cs.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      LgdInUsr: this.userDetails.LogdInUsrID,
      LgdInUsrCmt: '06',
      LgdInUsrCmtRole: this.userDetails.ROLE,
      LgdInUsrAction: value,
      to_RqstMbrs: this.to_RqstMbrs,
      to_RqstVndrs: this.bidEvalData.to_RqstVndrs.results,
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidEvaluationCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidEvaluationCommitteeForm?.get('CompetitionTypeID')?.value;
    }

    if (this.bidEvaluationCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidEvaluationCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    if (data) {
      this.postTender(data);
    }

  }

  assignMember(value: UserActionCode) {

    // * If bid evolution secratory validation for Make selection of any one of the procurement member , 
    // * finance and legal members mandatory and also selection of technical member is mandatory.

    let members: MemberList[] = [];

    this.to_RqstMbrs.forEach((item: any) => {
      let memberItem: MemberList = {
        "CommitteeId": item.CommitteeId,
        "TenderId": this.bidEvalData.TndrID,
        "CommitteeRole": item.CommitteeRole,
        "CommitteeUser": item.CommitteeUserID ? item.CommitteeUserID : item.CommitteeUser,
        "CommitteeBckupUser": item.CommitteeBkpUserID ? item.CommitteeBkpUserID : item.CommitteeBckupUser,
        "CommitteeUserName": item.CommitteeUserName,
        "CommitteeBkpUserName": item.CommitteeBkpUserName,
        "SelectedMbr": item.SelectedMbr
      }
      members.push(memberItem);
    });

    this.to_RqstMbrs = members;

    // * Checks for the Members Valid
    if (!this.checkMemberValid(members, this.bidEvalData.TndrTypeID)) { return; }

    if (this.role === 'FM' || this.role === 'OF' && this.bidEvalData.FinancialOffer == 'X') {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        if (this.bidEvalData.to_RqstVndrs.results.length > this.vendorDetails.length && index === this.vendorDetails.length) {
          element.PricePreference = element.PricePreference.toString();
          element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
        } else {
          element.PricePreference = this.vendorDetails[index].PricePreference.toString();
          element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
        }
      })
    }
    else {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        element.PricePreference = element.PricePreference.toString();
        element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
        
      });
    }

    let data: any = {
      TndrID: this.bidEvalData.TndrID,
      TndrName: this.bidEvalData.TndrName,
      BidOpngDate: this.bidEvalData.BidOpngDate,
      FinanceOfferOpeningDate: this.bidEvalData.FinanceOfferOpeningDate,
      RFPNumber: this.bidEvalData.RFPNumber,
      PurReqNo: this.bidEvalData.PurReqNo,
      PurTypID: this.bidEvalData.PurTypID,
      PurTypeDesc: this.bidEvalData.PurTypeDesc,
      TndrTypeID: this.bidEvalData.TndrTypeID,
      TndrTypeDesc: this.bidEvalData.TndrTypeDesc,
      EtimadNo: this.bidEvalData.EtimadNo,
      TndrStatus: this.bidEvalData.TndrStatus,
      CmtFrmtnOrderNodp: this.bidEvalData.CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.bidEvalData.CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.bidEvalData.CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.bidEvalData.CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.bidEvalData.CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.bidEvalData.CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.bidEvalData.CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.bidEvalData.CmtFrmtnOrdrNobqc,
      CommitteeTxtArea: this.bidEvalData.CommitteeTxtArea
        ? this.bidEvalData.CommitteeTxtArea
        : this.bidEvaluationCommitteeForm.getRawValue().cmtworks,
      CommitteeAtchArea: this.bidEvaluationCommitteeForm.getRawValue()
        .attachments
        ? this.bidEvaluationCommitteeForm.getRawValue().attachments
        : this.bidEvalData.CommitteeAtchArea,
      CommitteeID: '06',
      CommitteeName: localStorage.getItem('CommitteeName'),
      AsgnOpngCmtOfficerID: this.bidEvalData.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.bidEvalData.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: this.bidEvalData.AsgnQualCmtOfficerID,
      AsgnQualCmtOfficerName: this.bidEvalData.AsgnQualCmtOfficerName,
      AsgnEvalCmtOfficerID: this.bidEvalData.AsgnEvalCmtOfficerID,
      AsgnEvalCmtOfficerName: this.bidEvalData.AsgnEvalCmtOfficerName,
      AsgnDPEvalCmtOfficerID: this.bidEvalData.AsgnDPEvalCmtOfficerID,
      AsgnDPEvalCmtOfficerName: this.bidEvalData.AsgnDPEvalCmtOfficerName,
      AsgnDPEvalCmtOfficerName_AR: this.bidEvalData.AsgnDPEvalCmtOfficerName_AR,
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.cs.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      LgdInUsr: this.userDetails.LogdInUsrID,
      LgdInUsrCmt: '06',
      LgdInUsrCmtRole: this.userDetails.ROLE,
      LgdInUsrAction: value,
      to_RqstMbrs: this.to_RqstMbrs,
      to_RqstVndrs: this.bidEvalData.to_RqstVndrs.results,
      NoOfByres: this.bidEvalData.NoOfByres,
      NoOfVndrs: this.bidEvalData.NoOfVndrs,
      NoOfQualificationInvitation: this.bidEvalData.NoOfQualificationInvitation,
      InvitationPublishDate: this.bidEvalData.InvitationPublishDate,
      QualDocReceivingDate: this.bidEvalData.QualDocReceivingDate,
      QualDocInspectionDate: this.bidEvalData.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.bidEvalData.NoOfVndrsInvolvedInQual,
      PassingRate: this.bidEvalData.PassingRate,
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidEvaluationCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidEvaluationCommitteeForm?.get('CompetitionTypeID')?.value;
    }

    if (this.bidEvaluationCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidEvaluationCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    this.showConfirm(data, value);
  }

  assignToChairman(action: UserActionCode) {
    this.bidEvalData.LgdInUsrAction = action;
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.updatePriceFieldstoStirng();
    this.showConfirm(this.bidEvalData, action);
  }

  /**
   * Checks whether the member list is valid or not.
   * It has two different conditions for One Envelope and Two Envelope.
   * 
   * 
   * @param memberList - List of Members
   * @param tendorTypeId - Tendor Type Id - '01' for One Envelope and '02' for Two Envelope
   * @returns Based on the condition returns - true | false
   */
  checkMemberValid(memberList: MemberList[], tendorTypeId: string): boolean {

    // * If No member has been selected
    if (memberList.length === 0) {
      this.cs.createMessage("error", this.translate.instant("COM.Select Members to assign"));
      return false;
    }

    const requiredDepartments = [
      Department['Technical Member']
    ];
    return this.cs.isRequiredMemberChecked(memberList, requiredDepartments);

  }

  async assignQualCmt(value: any) {

    // * Condition for the Return to Qulification Committee
    if (this.getIsVendorSelectedDisabled()) {
      this.cs.createMessage('error', this.translate.instant('COM.Vendor Passed in Qualificaiton Committee'));
      return;
    }

    this.chkvesele = 0
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach =
      this.combineOtherAttachmentsWithUpdated();
    // this.bidEvalData.to_RqstMbrs.results = this.membersListData;
    await this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      
      if (element.IsVendorSelected == "Y") {
        this.chkvesele = this.chkvesele + 1

      }
      // if(element.VndrLegalResult === "Pass"){
      //   this.isvendpass = true;
      // }

      if (element.Price) {
        if (parseInt(element.Price) > 0) {
          this.allowBidsQual = true
        }
      }
    });


    if (this.bidEvalData.to_RqstVndrs.results.length === 1) {
      if ((this.chkvesele == 1) && (this.allowBidsQual)) {
        this.showConfirm(this.bidEvalData, UserActionCode.submit);
      }
      else {
        this.spinner.hide()
        this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
      }
    }
    else if ((this.chkvesele == 1) && (this.allowBidsQual)) {

      // * Convert the Price Preference and Price Ranking values to String
      this.bidEvalData.to_RqstVndrs.results.forEach((vendor: any) => {
        vendor.PricePreference = vendor.PricePreference.toString();
        vendor.Ranking = vendor.Ranking.toString();
      });

      this.showConfirm(this.bidEvalData, UserActionCode.submit);

    }
    else if (!this.allowBidsQual) {
      this.cs.createMessage("error", this.translate.instant("COM.UpdatePrice"))
    }
    else if (this.chkvesele > 1) {
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    else if (this.chkvesele == 0) {
      this.cs.createMessage("error", this.translate.instant("COM.SelectOneVendor"))
    }
    else {
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
  }

  async assignQualCmtReturn(value: any) {

    this.chkvesele = 0
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    // this.bidEvalData.to_RqstMbrs.results = this.membersListDat
    await this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      
      if (element.IsVendorSelected == "Y") {
        this.chkvesele = this.chkvesele + 1
      }
      if (element.Price) {
        if (parseInt(element.Price) > 0) {
          this.allowBidsQual = true
        }
      }
    });


    if ((this.chkvesele == 1 || this.bidEvalData.to_RqstVndrs.results.length === 1) && this.allowBidsQual) {
      this.showConfirm(this.bidEvalData, UserActionCode.submit);
    }
    else if (this.chkvesele > 1) {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    else if (this.chkvesele == 0) {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    else if (!this.allowBidsQual) {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.UpdatePrice"))
    }

    else {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }

  }

  public FirstLevelFinalApproval(value: UserActionCode) {
    this.openSecretarySelectionFinalSubmit = !this.openSecretarySelectionFinalSubmit;

    // if (this.bidEvaluationCommitteeForm.controls['mom'].value === "" || this.bidEvaluationCommitteeForm.controls['mom'].value === undefined) {
    //   this.cs.createMessage("error", "Enter MOM to complete")
    // }
    // else {
    this.chkvesele = 0;

    // * Logged in User details
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;

    // * Other details
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
    this.bidEvalData.AsgnEvalCmtOfficerID = this.selectedSecretary.CommitteeUserID;
    this.bidEvalData.AsgnEvalCmtOfficerName =
      this.selectedSecretary.CommitteeUserName;
    if (this.bidEvalData.IsSingleTender === "") {
      this.bidEvalData.IsSingleTender = "N"
    }

    if (this.bidEvalData.IsTenderCancelled === "") {
      this.bidEvalData.IsTenderCancelled = "N"

    }
    if (this.bidEvalData.IsTenderUrgent === "") {
      this.bidEvalData.IsTenderUrgent = "N"
    }
    this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      
      if (element.IsVendorSelected == "Y") {
        this.chkvesele = this.chkvesele + 1
      }

    });


    if (this.chkvesele == 1) {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
        if (element.IsVendorSelected == "Y") {
          this.bidEvalData.CommitteeCmntsArea = this.bidEvaluationCommitteeForm.controls['mom'].value.toString()
        }

      });
      this.showConfirm(this.bidEvalData, value);
    }
    else if (this.chkvesele > 1) {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    else {
      this.spinner.hide()
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    // }
  }

  /**
   * Final Approval Method
   * @param userActionCode 
   */
  async FinalSubmit(userActionCode?: UserActionCode) {

    this.bidEvaluationCommitteeForm.markAllAsTouched();
    this.bidEvaluationCommitteeForm.markAsDirty();

    this.chkvesele = 0;

    if (userActionCode) {
      this.bidEvalData.LgdInUsrAction = userActionCode;
      this.bidEvalData.CommitteeTxtArea = this.bidEvaluationCommitteeForm.getRawValue().cmtworks ?? this.bidEvalData.CommitteeTxtArea;
    }

    const committeeComments = this.bidEvaluationCommitteeForm.controls['mom'].value.toString();
    const finalOfferPrice = this.bidEvaluationCommitteeForm.controls['finalOfferPrice'].value.toString();

    if (this.role === 'OF' && this.MemFinal && this.isVendorExceededEstPrice) {
      return this.cs.createMessage('error', this.translate.instant('RFP.EstimatedPriceExceeded'));
    }

    // Fix 70038: Committee Works should not be mandatory for return action in Final approval BEC Secretary screen.
    if ((this.role === `OF` && userActionCode === UserActionCode.reject || this.bidEvalData.CommitteeTxtArea) && committeeComments && (parseInt(finalOfferPrice) > 0)) {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
        if (element.IsVendorSelected == "Y") {
          this.bidEvalData.CommitteeCmntsArea = committeeComments;
          element.FinalPriceOffer = finalOfferPrice;
        }
      });
    } else {
      this.cs.createMessage('error', this.translate.instant('COM.Fill the required field'));
      return;
    }

    const selectedVendor = this.bidEvalData.to_RqstVndrs.results.find((vendor: any) => vendor.IsVendorSelected === 'Y');
    if (selectedVendor && userActionCode === UserActionCode.approve && (selectedVendor.IsVndrfnclQualified === '' && selectedVendor.IsVndrtechQualified === '')) {
      if(this.bidEvalData.IsTenderCancelled === 'N'){
    
      this.cs.createMessage('error', this.translate.instant(`COM.SelectedVendorNotQualified`));
      return;
      }
    }

    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
    this.bidEvalData.CommitteeAtchArea = this.bidEvaluationCommitteeForm.getRawValue().attachments;

    // * For Officer OTP is not required even for Approve
    // * OTP is required for Approve Action 
    if (userActionCode === UserActionCode.approve && this.role !== 'OF') {
      let data = {
        UserId: this.cs.getUserData().userid
      }
      this.spinner.show();
      this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.spinner.hide();
        if (res.d.results[0].MessageId === "S") {
          this.cs.otpToast(res.d.results[0])
          this.otp = res.d.results[0].OtpNo
          this.getOTPModel = !this.getOTPModel;
        }
        else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
          this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
        }
        else {
          this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
        }
      }, err => {
        this.spinner.hide();
      });

    }
    else {
      this.showConfirm(this.bidEvalData, userActionCode);
    }
  }

  assignTechMem(value?: UserActionCode) {
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
      this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
      this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
      this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
      this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
      this.updatePriceFieldstoStirng();
      this.showConfirm(this.bidEvalData, value);
    }
  }

  // * Technical Member Manager Approval
  approve(actionCode: UserActionCode) {
    this.bidEvalData.LgdInUsrAction = actionCode;
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();

    this.updatePriceFieldstoStirng();

    // * For FM UserAction is Approved but to API code has to be passed as Submit
    // * changing the actionCode to Approved only for the confirmation model.
    if (this.role == 'FM') {
      actionCode = UserActionCode.approve;
    }
    console.log(this.bidEvalData);
    this.showConfirm(this.bidEvalData, actionCode);
    // this.getOTP();
    // this.showConfirm(this.bidEvalData);
  }

  /**
   * Updates the Price and Rank fields to String in each Vendor
   * 
   */
  updatePriceFieldstoStirng(): void {
    if (this.role === 'CH' || this.role === 'FM' || this.role === 'OF' && this.bidEvalData.FinancialOffer == 'X') {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        if (this.bidEvalData.to_RqstVndrs.results.length > this.vendorDetails.length) {
          element.PricePreference = element.PricePreference.toString();
          element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
          element.VndrFinevalwgtge = this.vendorDetails[index]?.VndrFinevalwgtge;
          element.VndrTechevalwgtge = this.vendorDetails[index]?.VndrTechevalwgtge;
          element.EvalCMTVndrtnclactualtotal = this.vendorDetails[index]?.EvalCMTVndrtnclactualtotal;
        } else {
          element.PricePreference = this.vendorDetails[index].PricePreference.toString();
          element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
          element.VndrFinevalwgtge = this.vendorDetails[index]?.VndrFinevalwgtge;
          element.VndrTechevalwgtge = this.vendorDetails[index]?.VndrTechevalwgtge;
          element.EvalCMTVndrtnclactualtotal = this.vendorDetails[index]?.EvalCMTVndrtnclactualtotal;
        }
      })
    }
  }

  Assign(value?: UserActionCode) {
    if (this.role === 'OF') {
      this.to_RqstMbrs.forEach((element: any, index: any) => {
        if ((element.CommitteeRole === 'FM' || element.CommitteeRole === 'PM' || element.CommitteeRole === 'LM') && element.SelectedMbr === ' ') {
          return this.cs.createMessage('error', this.translate.instant("COM.MembersError"));
        }
        if (element.CommitteeRole === 'TM' && element.SelectedMbr === ' ') {
          return this.cs.createMessage('error', this.translate.instant("COM.TechMemberError"));
        }
        let memberItem: MemberList = {
          "CommitteeId": element.CommitteeId,
          "TenderId": this.bidEvalData.TndrID,
          "CommitteeRole": element.CommitteeRole,
          "CommitteeUser": element.CommitteeUserID ? element.CommitteeUserID : element.CommitteeUser,
          "CommitteeBckupUser": element.CommitteeBkpUserID ? element.CommitteeBkpUserID : element.CommitteeBckupUser,
          "CommitteeUserName": element.CommitteeUserName,
          "CommitteeBkpUserName": element.CommitteeBkpUserName,
          "SelectedMbr": element.SelectedMbr
        }
        // members.push(memberItem);

        const selectedMemberIndex = this.bidEvalData.to_RqstMbrs.results.findIndex((member: any) => member.CommitteeUser === memberItem.CommitteeUser);
        if (selectedMemberIndex > -1) {
          this.bidEvalData.to_RqstMbrs.results[selectedMemberIndex] = memberItem;
        } else {
          this.bidEvalData.to_RqstMbrs.results.push(memberItem);
        }
      });
    }
    this.chklegres = 0;
    this.chktecres = 0;
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.CommitteeAtchArea = this.bidEvaluationCommitteeForm.getRawValue().attachments;
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;

    this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
      
      if (element.VndrLegalResult === 'Pass' || element.VndrLegalResult === 'Fail') {
        this.chklegres = this.chklegres + 1;
      }

      if (this.role === 'FM' || this.role === 'OF' && this.bidEvalData.FinancialOffer == 'X') {
        element.PricePreference = this.vendorDetails[index].PricePreference.toString();
        element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
      }

      if (this.role === 'TM' && element.EvalCMTVndrtnclactualtotal) {
        let v = parseFloat(element.EvalCMTVndrtnclactualtotal)
        if (v >= 0) {
          this.chktecres = this.chktecres + 1;
        }
      }

    });
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();

    // if (this.role === 'LM' && this.chklegres === this.bidEvalData.to_RqstVndrs.results.length) {
    //   this.showConfirm(this.bidEvalData);
    // }
    if (this.role === 'LM' && this.chklegres === this.vendorDetails.length) {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        element.PricePreference = element.PricePreference.toString();
        element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
      })
      this.showConfirm(this.bidEvalData, UserActionCode.assign);
    }
    // else if (this.role === 'TM' && this.chktecres === this.bidEvalData.to_RqstVndrs.results.length) {
    else if (this.role === 'TM' && this.chktecres === this.vendorDetails.length) {
      this.showConfirm(this.bidEvalData, value);
    } else if (this.role === 'OF') {
      this.showConfirm(this.bidEvalData, value);
    }
    else if (this.role === 'PM') {
      this.showConfirm(this.bidEvalData, value);
    }
    else {

      this.cs.createMessage("error", this.translate.instant("COM.EvalCom"))


    }

  }


  async assignBidOpCmt(value: UserActionCode) {
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
    await this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      
      if (element.IsVendorSelected == "Y") {
        this.chkvesele = this.chkvesele + 1
      }
      if (element.Price) {
        // if (element.Price === "0.00" && element.IsVendorSelected == "Y") {
        //   this.allowBidsQual = true;
        // }
        // else 
        // if (element.Price === 0 && element.IsVendorSelected == "Y") {
        //   this.allowBidsQual = true;
        // }
        // else if ((parseInt(element.Price) > 0) && (element.IsVendorSelected == "Y")) {
        //   this.allowBidsQual = false
        // }
        // else
        if ((parseInt(element.Price) >= 0) && (element.IsVendorSelected == "Y")) {
          this.allowBidsQual = true;
        }
      }
    });

    if (this.chkvesele > 0 && this.allowBidsQual) {
      this.showConfirm(this.bidEvalData, value);
    }

    else if (this.chkvesele === 0) {
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }

    else if (!this.allowBidsQual) {
      this.cs.createMessage("error", this.translate.instant("COM.PriceError"))
    }

    else {
      this.cs.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }


  }

  /**
   * Shows the confirmation Model
   * @param data Payload data
   * @param action - UserActionCode - Enum
   */
  showConfirm(data: any, action?: UserActionCode): void {
    const config = {
      titleText: this.cs.getConfimationModalTitle(action ?? null),
      bodyText: this.cs.getConfimationMessage(action ?? null)
    };

    let isReturn: boolean | undefined = undefined;
    let returnConfig;

    if (action === UserActionCode.return) {
      isReturn = true;
      returnConfig = {
        label: this.translate.instant("COM.Select Role"),
        placeholder: this.translate.instant('COM.Select Role'),
        listofUsers: this.membersListData
      }
    }

    const modalRef = this.modal.create({
      nzContent: ConfirmComponent,
      nzComponentParams: { config, isReturn, returnConfig },
      nzWidth: 600,
      nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
      nzFooter: null
    });

    modalRef.afterClose
      .subscribe(result => {
        if (result) {
          if (isReturn) {
            this.bidEvalData.Returnuser = result ?? '';
            data.Returnuser = result ?? '';
          }
          if (this.actionCheckerForOTP(action)) {
            this.getOTP();
          } else {
            this.postTender(data);
          }
        }
      });
  }

  /**
   * Make an API call to post the Tender details
   * @param payload - Tender Details Payload
   */
  postTender(payload: any): void {
    this.spinner.show();
    // payload.to_RqstVndrs.results = payload.to_RqstVndrs.results.map((vendor: any) => {
    //   if ('defaultPricePreference' in vendor) {
    //     delete vendor.defaultPricePreference;
    //     return vendor;
    //   }
    // });
   
    this.api.post('OCOM_CRT_UPD', payload).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        if (res.d.MsgType === 'S') {
          this.cs.createMessage('success', this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
          if (this.OptionSelected === 'bidstobeeval') {
            this.cs.activeMenu = 'bidstobeevaluated',
            this.router.navigate(["committee/technical-evaluation/bids-to-be-evaluated"])
          } else if (this.OptionSelected === 'bidsFromTechMem') {
            this.cs.activeMenu = 'bidsfromtechmem',
            this.router.navigate(["committee/technical-evaluation/bids-from-tech-members"])
          } else {
            this.cs.activeMenu = `bidlist`;
            this.router.navigate(["/committee/BidList"]);
          }
        }
        else {
          this.cs.createMessage('success', this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
        }
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  getMemberDetails() {
    let cmtid = {
      Id: "06",
      TndrId: this.bidEvalData.TndrID,
    };
    this.spinner.show();
    if (this.BidsapprovedRole || this.ChairmanFinalQual == "FinalQual" || this.viewMode || this.MemFinal) {
      if (this.isTenderDP) {
        cmtid.Id = '04'; // * DP Committee Id
      }
      this.api.post('/F4_MEMBERS_COM', cmtid).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();

          this.membersListData = res.d.results;

          if (this.membersListData) {
            this.membersListData.forEach((ele: any) => {
              delete ele.__metadata;
              delete ele.CommitteeRoleName;
            });
          }

          this.setMembersList();
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );

    }
    else if (this.role === 'CH' && !this.BidsapprovedRole && this.ChairmanFinalQual != "FinalQual" && !this.viewMode && !this.MemFinal) {
      this.spinner.show();
      this.api.post('/F4_MEMBERS', cmtid).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          // let cmtHead = res.d.results.filter((el: any) => {
          //   if (el.CommitteeRole === this.role) {
          //     return el;
          //   }
          // });
          let memberList = res.d.results.filter((el: any) => {
            if (
              el.CommitteeRole === 'TM'

            ) {
              return el;
            }
          });
          this.membersListData = memberList;
          // this.bidEvaluationCommitteeForm.controls['CommitteeHead'].setValue(
          //   cmtHead[0].CommitteeUserName
          // );
          this.setMembersList();
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
    }

    //for officer role calling read OCOM service to bind committee member data
    else if (this.role === 'OF') {
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter((el: any) => {
        if (el.CommitteeId === '06') {
          return el;
        }
      });
      if (!this.OFBidFinance) {
        this.spinner.show();
        this.api.post('/F4_MEMBERS', cmtid).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.spinner.hide();
          let memberList = res.d.results.filter((el: any) => {
            if (
              el.CommitteeRole !== 'CH' &&
              el.CommitteeRole !== 'OF' &&
              el.CommitteeRole !== 'RM'

            ) {
              return el;
            }
          });
          this.membersListData = memberList;
          if (this.ReadOCOM_to_RqstMbrs.length === 0) {
            this.membersListData.forEach((ele: any) => {
              ele.CommitteeUser = ele.CommitteeUserID;
              delete ele.__metadata;
              delete ele.ValidCmtUsr;
              delete ele.ValidCmtBkpUsr;
              delete ele.CommitteeYear;
              delete ele.CommitteeUserID;
              delete ele.CommitteeBkpUserID;
            });
          }
          else {
            if (this.ReadOCOM_to_RqstMbrs.length > 0 && this.role === 'OF') {
              this.membersListData = memberList;
              this.membersListData.forEach((element: any) => {
                this.ReadOCOM_to_RqstMbrs.forEach((data: any) => {
                  if (element.CommitteeUserName === data.CommitteeUserName) {
                    element.SelectedMbr = data.SelectedMbr;
                  }
                });
              });
              this.to_RqstMbrs = this.ReadOCOM_to_RqstMbrs;
            }
            else {
              this.membersListData = this.ReadOCOM_to_RqstMbrs;

            }
          }

        }, err => {
          this.spinner.hide();
        });
      } else {
        this.membersListData = this.ReadOCOM_to_RqstMbrs;
      }
    }

    else if (this.role === 'TM') {
      this.spinner.show();
      this.api.post('/F4_MEMBERS_COM', cmtid).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.membersListData = res.d.results;

          if (this.membersListData) {
            this.membersListData.forEach((ele: any) => {
              ele.CommitteeUser = ele.CommitteeUserID;
              delete ele.__metadata;
              delete ele.ValidCmtUsr;
              delete ele.ValidCmtBkpUsr;
              delete ele.CommitteeYear;
              delete ele.CommitteeUserID;
              delete ele.CommitteeBkpUserID;
            });
          }
          this.setMembersList();

        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
    }
  }

  setMembersList() {
    if(this.role === 'CH' && !this.isBidsFromTechMem){
      this.membersListData.forEach((member: any) => {
        member.SelectedMbr = 'M'
      })
      this.to_RqstMbrs = JSON.parse(JSON.stringify(this.membersListData))
    }else{
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter((el: any) => {
        if (el.CommitteeId === '06') {
          return el;
        }
      });
      this.membersListData.forEach((element: any) => {
        this.ReadOCOM_to_RqstMbrs.forEach((data: any) => {
          if (element.CommitteeUserName === data.CommitteeUserName) {
            element.SelectedMbr = data.SelectedMbr;
          }
        });
      });
      this.to_RqstMbrs = JSON.parse(JSON.stringify(this.ReadOCOM_to_RqstMbrs));
    }
  }

  calculateTechEval(data: any) {
    let total = 0;
    data.forEach((d: any) => {
      total += parseFloat(d.Actual);
    })
    return total;
  }

  highestTechvalScore: number = 0;
  calculateTotalTechEvalAgainstVendor() {
    if(this.isAllEvaluated) {
      this.bidEvalData.to_RqstVndrs?.results.forEach((vendor: any) => {
        let total = 0;
        vendor.to_VndrTec?.results.forEach((evaluation: any) => {
          total += this.calculateTechEval(evaluation.to_TechEval?.results)
        })
        vendor.EvalCMTVndrtnclactualtotal = (total/vendor.to_VndrTec?.results.length).toFixed(2).toString();
        vendor.VndrTnclEvalScore = parseFloat(vendor.EvalCMTVndrtnclactualtotal) >= 
        parseFloat(this.bidEvalData.TechPassingPercentage) ? 'Pass' : 'Fail';
        vendor.IsVendorSelected = parseFloat(vendor.EvalCMTVndrtnclactualtotal) >= 
        parseFloat(this.bidEvalData.TechPassingPercentage) ? 'Y' : 'N';
        if(this.highestTechvalScore < parseFloat(vendor.EvalCMTVndrtnclactualtotal)){
          this.highestTechvalScore = parseFloat(vendor.EvalCMTVndrtnclactualtotal)
        }
      })
      console.log(this.bidEvalData);
      this.calculateTechnicalWeightage();
    } else {
      this.cs.createMessage('error', this.translate.instant("COM.Calculate Highest Error"));
    }
  }

  getUserDetails(userid: string) {
    return new Promise ((resolve, reject) => this.api.get(`get-user-details?userid=${userid}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
       resolve(res.d.results[0]);
    }, (err) => {
      console.log(err);
      reject(null)
    }))
  }

  async showTechnicalEvaluation(data: any, vendorIndex: number) {
    this.getTechnicalCriteria(data.VedorId, true);
      this.selectedVendorDetails = data;
      this.technicalVendorDetails = data.to_VndrTec?.results;
      if(this.role !== 'CH') {
        this.technicalVendorDetails = [this.technicalVendorDetails.find((techDetails: any) => 
          techDetails.CreatedBy === this.userDetails.LogdInUsrID)]
      }

      if(this.technicalVendorDetails.length > 1 || this.technicalVendorDetails[0]) {
        // Initialize as an array instead of an object
        this.technicalEvaluationByMember = [];

        // Initialize a map to group evaluations by 'CreatedBy'
        const techComments: any = {};
        const techReqEvalMap: any = {};
        const techEvalMap: any = {};

        console.log(this.technicalVendorDetails)
        this.technicalVendorDetails.forEach((details: any) => {

          techComments[details.CreatedBy] = {
            comment: details.TchnclMbrCmnt,
            score: details.VndrTnclEvalScore,
            value: details.EvalCMTVndrtnclactualtotal
          }

          // Group the technical requirements evaluations by CreatedBy
          details.to_TechReqEval.results.forEach((techReqEval: any) => {
            if (!techReqEvalMap[techReqEval.CreatedBy]) {
              techReqEvalMap[techReqEval.CreatedBy] = [];
            }
            techReqEvalMap[techReqEval.CreatedBy].push(techReqEval);
          });

          // Group the technical evaluations by CreatedBy
          details.to_TechEval.results.forEach((techEval: any) => {
            if (!techEvalMap[techEval.CreatedBy]) {
              techEvalMap[techEval.CreatedBy] = [];
            }
            techEvalMap[techEval.CreatedBy].push(techEval);
          });

        })

        
        // Combine both into the array format
        for (const createdBy in techReqEvalMap) {
          const userData = await this.getUserDetails(createdBy);
          this.technicalEvaluationByMember.push(
            {
              userDetails: userData,
              vendorComment: techComments[createdBy],
              to_TechReqEval: techReqEvalMap[createdBy] || [],
              to_TechEval: techEvalMap[createdBy] || []
            }
          );
        }

        // If there are any entries in techEvalMap that are not in techReqEvalMap
        for (const createdBy in techEvalMap) {
          if (!techReqEvalMap[createdBy]) {
            const userData = await this.getUserDetails(createdBy);
            this.technicalEvaluationByMember.push(
              {
                userDetails: userData,
                vendorComment: techComments[createdBy],
                to_TechReqEval: [],
                to_TechEval: techEvalMap[createdBy]
              }
            );
          }
        }

        console.log(this.technicalEvaluationByMember);

        this.selectedVendorIndex = vendorIndex;
        this.formattedTechEval = this.formatTechEval(
          this.technicalEvaluationByMember[0].to_TechEval)
          console.log(this.formattedTechEval, 'formattedTechEval')
        this.isViewEvaluation = true;
      } else {
        this.cs.createMessage('error', this.translate.instant('COM.Show Evaluation Error'))
      }
  }

  async showAllTechnicalMemberEvaluation(data: any, vendorIndex: number) {
    const items = data?.to_VndrTec?.results || [];
    const mappedData = await Promise.all(
      items.map(async (item: any) => {
        let userName = '';
        let isCriteriaLabel = ''
        const user: any = await this.getUserDetails(item.CreatedBy);
        userName = this.cs.userLanguage === 'en' ? (user?.UserEname || '') : (user?.UserAname || '')
        isCriteriaLabel = this.cs.userLanguage === 'en' ? (item.IsCriteriaApplicable === '01' ? 'Applicable' : 'Not Applicable') 
        : (item.IsCriteriaApplicable === '01' ? 'مجتاز' : 'غير مجتاز') 
        return {
          ...item,
          IsCriteriaApplicableLabel: isCriteriaLabel,
          CreatedByName: userName
        };
      })
    );

    mappedData.sort(
      (a: any, b: any) => parseInt(a.TecMemNo, 10) - parseInt(b.TecMemNo, 10)
    );

    this.selectedTechMemvEvalData = mappedData;
    this.showAllTechMemEvaluation = true;
  }


  previousResult() {
    this.carousel.pre();
    this.formattedTechEval = this.formatTechEval(
      this.technicalEvaluationByMember[this.carousel.activeIndex].to_TechEval)
  } 

  nextResult() {
    this.carousel.next();
    this.formattedTechEval = this.formatTechEval(
      this.technicalEvaluationByMember[this.carousel.activeIndex].to_TechEval)
  }
  
  // * Open Technical Evaluation - Edit and View handler method
  openTechnicalEvaluation(data: any, vendorIndex: any) {

    this.clearTechReqEval();
    this.clearTechEval();

    // * Get data values of Tendor details API
    const vendorEvalDetails = data?.to_VndrTec?.results.find((vendor:any) => vendor.CreatedBy === this.userDetails.LogdInUsrID)
    const TechnicalRequirement = vendorEvalDetails?.to_TechReqEval?.results;
    const TechnicalEvaluation = vendorEvalDetails?.to_TechEval?.results;


    // * Post call constants
    const payload = { RfpNo: this.bidEvalData.RFPNumber };
    const TechRequirementList = this.api.post('GET_CMT_TECHREQ', payload);

    // * Adds Techinical Member comments for Selected Vendor
    this.TchnclMbrCmnt.setValue(vendorEvalDetails?.TchnclMbrCmnt ?? '');
    this.TchnclMbrCmnt.setValidators([Validators.required, Validators.maxLength(60)]);
    console.log(this.TchnclMbrCmnt)

    if (TechnicalRequirement?.length > 0) {
      this.getStatusList(true);
      this.createTechReqEval(TechnicalRequirement, data.VendorId);
      this.ShowEval = true;
      this.selectedVendor = data.VendorId;
      this.selectedVendorIndex = vendorIndex;

      if (TechnicalEvaluation?.length > 0) {
        this.createTechEval(TechnicalEvaluation, data.VendorId);
        this.getTechnicalCriteria(data.VedorId, true);
      } else {
        this.getTechnicalCriteria(data.VendorId);
      }
      return;
    }

    this.spinner.show();

    TechRequirementList.pipe(takeUntil(this.destroy$)).subscribe(
      (TechRequirementListRes: TechnicalRequirement[]) => {
        this.spinner.hide();
        this.ShowEval = true;
        this.createTechReqEval(TechRequirementListRes, data.VendorId);
        this.getTechnicalCriteria(data.VendorId);

        this.selectedVendorIndex = vendorIndex;
        this.VendName = data.VendorName;
        this.selectedVendor = data.VendorId;
        this.TechCmt = "";
        this.disTechsub = false;
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );

  }

  // * Get the Status list if not available
  getStatusList(showLoading: boolean = false) {

    if (showLoading) this.spinner.show();

    if (this.F4_TechReqStatus.length == 0) {
      this.api.get('F4_TechStatus').pipe(takeUntil(this.destroy$)).subscribe(
        (F4_TechStatusRes) => {
          this.F4_TechReqStatus = F4_TechStatusRes;
          if (showLoading) this.spinner.hide();
        },
        (error) => {
          if (showLoading) this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        });
    } else {
      if (showLoading) this.spinner.hide();
    }
  }

  // * Get Technical Criteria from RFP
  getTechnicalCriteria(vendorId: string, loadPassPercentage: boolean = false): void {

    if (loadPassPercentage && this.techCrtPerct) {
      return;
    }

    // * Post call constant
    const payload = { RfpNo: this.bidEvalData.RFPNumber };
    const F4_TechCrit = this.api.post('F4_TechCRIT', payload);

    this.cs.startLoadingSection(SectionCode.GetTechnicalEvaluationCriteria);

    F4_TechCrit.pipe(takeUntil(this.destroy$)).subscribe(
      (F4_TechCritRes) => {
        this.techCrtPerct = F4_TechCritRes?.d?.results[0]?.TechEvalCrtra;
        if (!loadPassPercentage) {
          const criteriaList = F4_TechCritRes?.d?.results[0]?.to_RFPTechCrt?.results;
          this.createTechEval(criteriaList, vendorId);
        }
        this.cs.stopLoadingSection(SectionCode.GetTechnicalEvaluationCriteria);
      },
      (error) => {
        this.cs.stopLoadingSection(SectionCode.GetTechnicalEvaluationCriteria);
        this.cs.createMessage('error', error.statusText);
      });
  }

  createLegalEval(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any, reasonfordisqualification?: any): FormGroup {
    return this.fb.group({
      CommitteeId: [CommitteeId],
      TenderId: [TenderId],
      VendorId: [VendorId],
      LegalResult: [LegalResult ? LegalResult : 'Fail'],
      reasonfordisqualification: [reasonfordisqualification]
    });
  }

  // * Create Technical Evaluation Form Array
  createTechEval(TechnicalEvaluation: TechnicalEvaluation[], vendorId: string): void {
    TechnicalEvaluation.forEach((evaluation) => {
      let actualValue = evaluation.Actual ?? 0;
      const formGroup:any = {
        TenderId: [this.bidEvalData.TndrID],
        CommitteeId: [this.bidEvalData.CommitteeID],
        VendorId: [vendorId],
        // CreatedBy: [this.userDetails.LogdInUsrID],
        EvltnTechCriteriaId: [evaluation.EvltnTechCriteriaId ?? evaluation.EvltnTechCriteriaId_RFP ?? ''],
        Headline: [evaluation.Headline ?? ''],
        EvltnTechCriteriaDesc: [evaluation.EvltnTechCriteriaDesc ?? evaluation.EvltnTechCriteriaDesc_RFP ?? ''],
        Subcriflg: [evaluation.Subcriflg ?? ''],
        Weightage: [evaluation.Weightage ?? ''],
        Actual: [{value: this.cs.truncate(actualValue, 2) ?? '', 
          disabled: evaluation.Subcriflg == 'X' ? true : false}],
        PageNO: [evaluation.PageNO, !this.isTenderDP ? Validators.required : null],
        Comments: [evaluation.Comments ?? '', [Validators.required, Validators.maxLength(60)]],
        to_tevalsub: this.fb.array(this.createSubCriteriaFormArray(
          evaluation.to_tevalsub ? evaluation.to_tevalsub.results 
          : evaluation.to_tcritosubcri.results, vendorId))
      };
      // if (evaluation.Subcriflg !== 'X') {
      //   formGroup.PageNO = [evaluation.PageNO, Validators.required];
      //   formGroup.Comments = [evaluation.Comments, Validators.required];
      // }
      this.to_TechEval?.push(
        this.fb.group(formGroup)
      );
    });
  }

  createSubCriteriaFormArray(to_tevalsub: Subcriteria[], vendorId: string) {
    return to_tevalsub.map((subCriteria) => {
      return this.createSubCriteriaGroup(subCriteria, vendorId);
    });
  }

  get to_tevalsub() {
    return this.subCriteriaForm?.controls['to_tevalsub'] as FormArray
  }

  createSubCriteriaGroup(subCriteria: Subcriteria, vendorId?: string) {
    return this.fb.group({
      TenderId: [this.bidEvalData.TndrID],
      CommitteeId: [this.bidEvalData.CommitteeID],
      VendorId: [vendorId ?? ''],
      // CreatedBy: [this.userDetails.LogdInUsrID],
      EvltnTechCriteriaId: [subCriteria.ItemNo ?? subCriteria.EvltnTechCriteriaId ?? ''],
      EvltnTechSubCriteriaId: [subCriteria.SubItemNo ?? subCriteria.EvltnTechSubCriteriaId ?? ''],
      EvltnTechCriteriaDesc: [subCriteria.Descr ?? subCriteria.EvltnTechCriteriaDesc ?? ''],
      Weightage: [subCriteria.Percentage ?? subCriteria.Weightage ?? ''],
      Actual: [subCriteria.Actual ?? '', Validators.required],
      // PageNO: [subCriteria.PageNO ?? '', Validators.required],
      // Comments: [subCriteria.Comments ?? '', Validators.required]
    })
  }

  openSubCriteriaEvaluation(subs: Subcriteria[], index: number) {
    this.to_tevalsub.clear();
    subs.forEach((subCriteria) => {
      this.to_tevalsub.push(this.createSubCriteriaGroup(subCriteria));
    });
    this.criteriaIndex = index;
    this.isSubCriteria = true;
  }

  closeSubCriteria() {
    this.to_tevalsub.clear();
    this.isSubCriteria = false;
  }

  get techEvalSub() {
    return this.to_TechEval.at(this.criteriaIndex).get('to_tevalsub') as FormArray
  }

  saveSubCriteria() {
    let score = 0;
    this.to_tevalsub.value.forEach((sub: Subcriteria, index: number) => {
      score += _l.isNumber(sub.Actual) ? sub.Actual : parseFloat(sub.Actual);
      this.techEvalSub.at(index).setValue(
        {...sub, Actual:  _l.isNumber(sub.Actual) ? sub.Actual.toFixed(2).toString() : sub.Actual })    
    });
    this.to_TechEval.at(this.criteriaIndex).get('Actual')?.setValue(score.toFixed(2).toString());
    this.to_tevalsub.clear();
    this.isSubCriteria = false;
  }

  // * Create Technical Requirement Evaluation Form Array
  createTechReqEval(requirements: TechnicalRequirement[], vendorId: string) {
    requirements.forEach((requirement) => {
      this.to_TechReqEval.push(
        this.fb.group({
          TenderId: [this.bidEvalData.TndrID],
          VendorId: [vendorId],
          CommitteeId: [this.bidEvalData.CommitteeID],
          EvltnTechReqId: [requirement.EvltnTechReqId],
          EvltnTechReqDesc: [requirement.EvltnTechReqDesc],
          IscriteriaApplicable: [requirement.IscriteriaApplicable ?? '', Validators.required],
          TecReqJustification: [requirement.TecReqJustification ?? '', [Validators.required, Validators.maxLength(60)]]
        })
      )
    })
  }

  // * Reset Technical Requirement Evaluation Form Array
  clearTechReqEval(): void {
    this.to_TechReqEval.clear();
  }

  // * Reset Technical Evaluation Form Array
  clearTechEval(): void {
    this.to_TechEval.clear();
  }

  // * Submit Technical Evaluation
  submitTechnicalEvaluation(): void {

    // * Returns if the Technical Member comments for Vendor is empty
    if (this.TchnclMbrCmnt.value.trim() === '') {
      this.cs.createMessage('error', this.translate.instant('COC.Commentsreq'));
      return;
    }

    this.spinner.show()

    const TechnicalRequirementData = this.to_TechReqEval.getRawValue();
    
    // * If all the Technical Requirement is applicable - post the Technical Evaluation Criteria 
    if (this.showTechEvalCrit) {
      const TechnicalEvaluationData = this.cs.convertNumberToString(this.to_TechEval.getRawValue(), ['Actual', 'PageNO']);

      if (TechnicalEvaluationData.length > 0) {
        this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
          
          if (element.VendorId == this.selectedVendor) {
            const vendorTechnicalEval = {
              TenderId: this.bidEvalData.TndrID,
              VendorId: element.VendorId,
              TchnclMbrCmnt: this.TchnclMbrCmnt.value,
              to_TechEval: {
                results: TechnicalEvaluationData
              },
              to_TechReqEval: {
                results: TechnicalRequirementData
              }
            }
            this.bidEvalData.to_RqstVndrs.results[index].to_VndrTec.results.push(vendorTechnicalEval);
          }
        });
      } else {
        this.cs.createMessage("error", this.translate.instant("COM.NoCriteria"));
      }

    } else {
      // * If not all the Technical Requirement is applicable - post only Technical Requirement, Technical Evaluation not required...

      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        
        if (element.VendorId == this.selectedVendor) {
          const vendorTechnicalEval = {
            TenderId: this.bidEvalData.TndrID,
            VendorId: element.VendorId,
            TchnclMbrCmnt: this.TchnclMbrCmnt.value,
            to_TechEval: {
              results: []
            },
            to_TechReqEval: {
              results: TechnicalRequirementData
            }
          }
          this.bidEvalData.to_RqstVndrs.results[index].to_VndrTec.results.push(vendorTechnicalEval);
          // this.bidEvalData.to_RqstVndrs.results[index].to_TechEval.results = [];
          // this.bidEvalData.to_RqstVndrs.results[index].to_TechReqEval = TechnicalRequirementData;
          // this.bidEvalData.to_RqstVndrs.results[index].TchnclMbrCmnt = this.TchnclMbrCmnt.value;
        }
      });

    }

    // * Post call - Technical Requirement and Technical Evaluation
    if (this.bidEvalData) {

      this.commonService.startLoadingSection(SectionCode.SubmitTechnicalEvaluation);

      this.bidEvalData.LgdInUsrAction = 'DFT';

      this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
      this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
      this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
      this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();

      // * Convert the Price preference and Ranking to "string" for payload
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        
        element.PricePreference = this.vendorDetails[index]?.PricePreference !== undefined ? this.vendorDetails[index]?.PricePreference.toString() : "0";
        element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
      })

      this.api.post('OCOM_CRT_UPD', this.bidEvalData).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.commonService.stopLoadingSection(SectionCode.SubmitTechnicalEvaluation);
          this.spinner.hide()
          if (res.d.MsgType === 'S') {
            this.cs.createMessage("Success", this.translate.instant("COM.TechEvalSub"));
            this.highestTechvalScore = 0;
            this.resetTechnicalEvaluation();
            this.getTenderDetails();
          }
          else {
            this.cs.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.commonService.stopLoadingSection(SectionCode.SubmitTechnicalEvaluation);
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      )
    }
  }

  // * Enables or Disables the Forms Related to Technical Evaluation
  enableOrDisableTechEvaluation(enable: boolean = true): void {
    if (enable) {
      this.to_TechEval.enable();
      this.to_TechReqEval.enable();
      this.TchnclMbrCmnt.enable();
      return;
    }
    this.to_TechEval.disable();
    this.to_TechReqEval.disable();
    this.TchnclMbrCmnt.disable();
  }

  // * Reset the Technical Evalution Variables after successful post
  resetTechnicalEvaluation(): void {
    this.disTechsub = false;
    this.ShowEval = false;
    this.TechCmt = "";
    this.to_TechEval.clear();
    this.to_TechReqEval.clear();
  }

  // * Calculates Technical Evaluation Total value
  calculateTechnicalTotal(to_TechEval: any): void {

    let calculated: any;
    this.Techtotal = 0;
    to_TechEval.forEach((element: any) => {
      if (element.Actual) {
        calculated = (parseFloat(element.Actual));
        calculated = this.cs.truncate(calculated, 2);
      }
      else {
        calculated = 0;
      }
      this.Techtotal += parseFloat(calculated);
      this.Techtotal = this.cs.truncate(this.Techtotal, 2);
    });
  }

  addComments(comment: any) {

    let Cmtdata = {
      "CommitteeId": this.userDetails.CommitteeId,
      "TenderId": this.bidEvalData.TndrID,
      "VendorId": this.selectedVendor,
      "CmntdMember": this.userDetails.LogdInUsrID,
      "CmntdDate": "",
      "Comments": comment,
      "CommitteeRole": this.userDetails.ROLE
    }

    if (Cmtdata) {
      this.spinner.show();
      // post comments api called for saved vendor
      this.api.post('POST_CMTS', Cmtdata).pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          if (res) {
            this.spinner.hide();
            this.showlegalcomment = false;
            this.showtechcomment = false;
            this.TechCmt = "";
            this.LegalCmt = "";
          } else {
            this.spinner.hide();
            this.cs.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
    }


  }

  downloadMoM(data: any) {
    
    const payload: doumentDownload = {
      CommitteeID: data.CommitteeId ?? '',
      TndrID: data.TenderId ?? '',
      Role: this.userDetails.ROLE,
      Identifier: data.Identifier ?? ''
    };

    this.cs.downloadMOM(payload, data.TenderId ?? '' + '_' + data.MomDecEn)

  }


  getComments() {
    this.spinner.show()
    let dt = {
      "TenderId": this.bidEvalData.TndrID,
      // "MemberId":this.userDetails.ID,
      "VendorId": this.selectedVendor,
      //  "role":this.role,
    }
    this.api.post("/GET_CMTS", dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.commentsArray = res.d.results;
      this.commentsArray = this.commentsArray.filter((obj:any, index:any) => {
        return index === this.commentsArray.findIndex((o:any) => (obj.Comments === o.Comments && obj.CmntdMember === o.CmntdMember));
    });
      this.showComments = !this.showComments;
      this.spinner.hide()
    }, () => {
      this.spinner.hide();
    });
  }

  selectedVendorGUID = '';
  showChecklistsModal(_data: any) {
    this.to_VndrChkLst = _data.to_VndrChkLst.results;
    this.selectedVendorGUID = _data.VendorGUID;
    this.seletedVenCom = _data.VendorCommercialNo;
    if (!this.showChecklists) this.showChecklists = true;
  }

  hideChecklists() {
    if (this.showChecklists) this.showChecklists = false;
  }

  get AttachGuid(): FormControl {
    return this.otherDocsFG.get('AttachGuid') as FormControl;
  }

  get docParams(): FormGroup {
    return this.otherDocsFG.get('docParams') as FormGroup;
  }

  get otherDocsFG() {
    return this.otherDocsFormGroup as any;
  }

  getAttachFormGroup(_params: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeIds(_params);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    return attachFG;
  }

  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //table
      displayMode: 'view',
      docParams: {
        HeaderKey: "P2PCommitte",
        ItemKey: "VendorEval",
        EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
        EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
        RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
        RelatedEntityId: this.selectedVendorGUID,
        DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
        DocName: "",
        FileNetId: "",
        Origin: "P2P",
        UploadedBy: "",
        UploadedOn: "",
        MimeDocType: "text/xml",
        Operation: _l.get(_paramsForUpdate, 'operation', ''),
        GuiId: "",
        ContentSize: 0
      },
    };
    return docParams;
  }

  onFileUpload(_event: any, _doc: any) {
  }

  get getFormGroup(): FormGroup {
    return new FormGroup({
      AttachGuid: new FormControl(''),
      documentsList: new FormArray([]),
      docParams: new FormGroup({
        control: new FormControl(''),
        doDocsGet: new FormControl(''),
        multipleFiles: new FormControl(''),
        srcType: new FormControl(''),
        displayMode: new FormControl(''),
        docParams: new FormGroup({
          Origin: new FormControl(''),
          ProfileId: new FormControl(''),
          UserId: new FormControl(''),
          HeaderKey: new FormControl(''),
          ItemKey: new FormControl(''),
          ItemSecKey: new FormControl(''),
          EntityId: new FormControl(''),
          EntityName: new FormControl(''),
          RelatedEntityId: new FormControl(''),
          RelatedEntityName: new FormControl(''),
          DefId: new FormControl(''),
          DocId: new FormControl(''),
          DocName: new FormControl(''),
          operationType: new FormControl(''),
        }),
      }),
    });
  }

  getVendorForms(index: any) {
    return {
      firstLevelName: 'P2PCommitteTender',
      firstLevelId: this.bidEvalData.TndrID,
      secondLevelName: 'P2PCommitteVendor',
      secondLevelId: this.seletedVenCom,
      thirdLevelId: index.ChecklistId,
      operation: "C"
    }
  }

  // * otp approval
  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.updatePriceFieldstoStirng();
        this.postTender(this.bidEvalData);
      }
      else if (data !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  getOTP() {
    let data = {
      UserId: this.cs.getUserData().userid
    }
    this.spinner.show();
    this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.spinner.hide();
      if (res.d.results[0].MessageId === "S") {
        this.commonService.otpToast(res.d.results[0]);
        this.otp = res.d.results[0].OtpNo
        this.getOTPModel = !this.getOTPModel;
      }

      else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      }
      else {
        this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    }, () => {
      this.spinner.hide();
    });

  }


  updateOTP(value: any) {
    this.getOTPModel = value;

    if (value) {
      if (value === this.otp) {

        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.showConfirm(this.bidEvalData, UserActionCode.submit);
      }
      else if (value !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  toDecimalPlaces(value: any): any {
    if (value) {
      return parseInt(value).toFixed(2)
    }
    else {
      return ""
    }
  }

  returnBid(value: UserActionCode) {
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
      this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
      this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
      this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
      this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
      this.bidEvalData.CommitteeAtchArea = this.bidEvaluationCommitteeForm.getRawValue().attachments;
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any, index: any) => {
        
        element.PricePreference = element.PricePreference.toString();
        element.Ranking = this.vendorDetails[index]?.Ranking !== undefined ? this.vendorDetails[index]?.Ranking.toString() : "0";
      })
      console.log(this.bidEvalData);
      this.showConfirm(this.bidEvalData, value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadFile(value: any) {
    window.open(environment.downloadUrl + value.Attachment);
  }

  deleteFile(value: any) {
    console.log(value);
  }

  createAttachs(data: any): FormGroup {
    this.itnatt = this.itnatt + 1;
    return this.fb.group({
      CommitteeId: [this.CommitteeID],
      CommitteeRole: [this.role],
      CommitteeUser: [this.commonService.getUserData().userid],
      Attachment: [data],
      TenderId: [this.bidEvalData.TndrID],
      CreatedAt: [null],
    });
  }

  createAttachswithvalues(data: any): FormGroup {
    return this.fb.group({
      CommitteeId: [this.CommitteeID],
      CommitteeRole: [data.CommitteeRole],
      CommitteeUser: [data.CommitteeUser],
      Attachment: [data.Attachment],
      TenderId: [data.TenderId],
      CreatedAt: [data.CreatedAt],
    });
  }

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.spinner.show();
    this.api.post("uploadfile", formData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.messageId == "S") {
          res.paths.forEach((file: any) => {
            this.uploadedfiles.push(file);
            this.attList?.push(this.createAttachs(file));
          })
          this.uploading = false;
          this.fileList = [];
          this.cs.createMessage("success", this.translate.instant('RFP.UploadSuccess'));
        }
      },
      (error) => {
        this.spinner.hide();
        this.uploading = false;
        this.cs.createMessage("error", this.translate.instant('RFP.UploadFailed'));
      }
    );
  }

  combineOtherAttachmentsWithUpdated() {
    let list = [...this.fileNetList];
    list.forEach((node: any) => {
      delete node.hideDeleteButton;
      delete node.downloading;
    });
    const allAttachments = [
      ...this.otherCommitteeAttachments,
      ...this.bidEvaluationCommitteeForm.getRawValue().Attachments,
      ...list
    ];

    return allAttachments
  }

  filenetUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: this.userDetails.CommitteeId,
      CommitteeRole: this.userDetails.ROLE,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalData.TndrID,
    })

    this.fileNetList = [...this.fileNetList];
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: this.userDetails.CommitteeId,
      CommitteeRole: this.userDetails.ROLE,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalData.TndrID,
    })

    this.fileNetList = [...this.fileNetList];
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  showHideCommentsclose() {
    this.showCommentsT = false;
  }
  showHideAddCommentsclose() {
    this.showAddCommentsT = false;
  }
  showHideAddCommentsT() {
    this.Tcmt = ''
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  hideTechValue() {
    this.showAllTechMemEvaluation = false;
  }

  addCommentsT(comments: any) {
    if (comments != '') {
      this.spinner.show();
      let cmtData = {
        CommitteeId: "06",
        CommitteeRole: this.role,
        TenderId: this.bidEvalData.TndrID,
        VendorId: '',
        CmntdMember: this.LogdInUsrID,
        Comments: comments,
      };
      //  console.log('cmtData befor post comments for saved vendor', cmtData);
      if (cmtData) {
        // this.spinner.show();
        // post comments api called for saved vendor
        this.api.post('POST_CMTS', cmtData).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res) {
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.commonService.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            //  console.log(error);
            this.commonService.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );
      }
    }
    else {
      console.log("no comments", comments);
    }
    this.showAddCommentsT = !this.showAddCommentsT;
  }
  showHideCommentsT() {
    this.getCommentsT();
    this.showCommentsT = true;
  }
  getCommentsT() {
    this.spinner.show();
    let dt = {
      TenderId: this.bidEvalData.TndrID,
      VendorId: '0',
      CommitteeId: this.CommitteeID,
    };
    this.api.post('/GET_CMTS', dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      //  console.log(res.d.results);
      this.commentsArray = res.d.results;
      // this.showComments = !this.showComments;
      this.spinner.hide();
    });
  }


  lowestPricebyVendors: number = 0;

  public filterVendors(vendors: any): any[] {
    if (this.CommitteeID === `06`) {
      switch (this.role) {
        // case COMMITTEE_ROLE.LEGAL_MEMBER:
        // case COMMITTEE_ROLE.FINANCE_MEMBER:
        // case COMMITTEE_ROLE.TECHNICAL_MEMBER:
        // case COMMITTEE_ROLE.PROCUREMENT_MEMBER:
        //   if (this.MemFinal) {
        //     vendors = callFilter(this, vendors);
        //   }
        //   break;

        // case COMMITTEE_ROLE.CHAIRMAN:
        //   if (this.OptionSelected === `BidToFinal`) {
        //     vendors = callFilter(this, vendors);
        //   }
        //   break;

        case COMMITTEE_ROLE.VICE_PRESIDENT:
        case COMMITTEE_ROLE.DIRECTOR:
        case COMMITTEE_ROLE.CEO: {
          if (this.isTenderDP) {
            vendors = callDPFilter(this, vendors, this.DP_SPECIAL_SCENARIO);
            break;
          }
          // vendors = callFilter(this, vendors);
          break;
        }

        default:
          break;
      }
    }
    return vendors;

    // function callFilter(that: BidEvaluationCommitteeComponent, vendors: any) {
    //   return that.filterPipe.transform(vendors, [
    //     { key: 'IsVendorSelected', value: 'Y' },
    //     { key: 'IsVndrtechQualified', value: 'X' },
    //     { key: 'IsVndrfnclQualified', value: 'X' }
    //   ]);
    // }

    function callDPFilter(that: WorkflowFormComponent, vendors: any, isSpecialScenario: boolean) {
      let filterArray = [
        { key: 'IsVendorSelected', value: 'Y' }
      ];

      if (isSpecialScenario) {
        filterArray.push({ key: 'IsVndrtechQualified', value: 'X' });
        filterArray.push({ key: 'IsVndrfnclQualified', value: 'X' });
      }

      return that.filterPipe.transform(vendors, filterArray);
    }
  }


  // * Checks and Retruns True if all the Technical Requirement is Applicable
  checkAllApplicable(TechnicalReq: any): boolean {
    if (TechnicalReq.length === 0) return false;
    let all_applicable = true;
    TechnicalReq.forEach((TechReq: any) => {
      if (Number(TechReq.IscriteriaApplicable) !== 1) {
        all_applicable = false;
      }
    });
    return all_applicable;
  }

  //************/ Getter Methods /************//
  get to_TechEval() {
    return this.bidEvaluationCommitteeForm.get('to_TechEval') as FormArray;
  }
  get to_TechReqEval() {
    return this.bidEvaluationCommitteeForm.get('to_TechReqEval') as FormArray;
  }
  get Legal() {
    return this.bidEvaluationCommitteeForm.get('to_LeglEval') as FormArray;
  }
  get TchnclMbrCmnt(): FormControl {
    return this.bidEvaluationCommitteeForm.get('TchnclMbrCmnt') as FormControl;
  }
  get UserActionCode(): typeof UserActionCode {
    return UserActionCode;
  }
  get isUserLanguageEnglish(): boolean {
    if (this.cs.userLanguage === 'en') {
      return true;
    }
    return false;
  }
  get getTechEvalCritLoading(): boolean {
    return this.cs.isSectionLoading(SectionCode.GetTechnicalEvaluationCriteria);
  }
  get getSubmitTechEvalLoading(): boolean {
    return this.cs.isSectionLoading(SectionCode.SubmitTechnicalEvaluation);
  }
  get showTechnicalReportOption(): boolean {
    const SplRole = localStorage.getItem('ROLEMG');
    if (SplRole === 'VP' || SplRole === 'SS' || SplRole === 'CO') {
      return true;
    }

    if (
      this.OptionSelected === 'BidToEval' &&
      (
        this.userDetails.ROLE === 'CH' ||
        this.userDetails.ROLE === 'OF' ||
        this.userDetails.ROLE === 'LM'
      )
    ) {
      return false;
    }
    return true;
  }
  get isReturnFromProcurementMember(): boolean {
    if (this.role === 'LM' && this.bidEvalData?.TndrTypeID === '01' && this.bidEvalData?.LglFullAccess === 'X') {
      return true;
    }
    return false;
  }
  get isOneEnvelope(): boolean {
    return this.bidEvalData?.TndrTypeID === '01';
  }
  get isFinancialOffer(): boolean {
    return this.bidEvalData.FinancialOffer === 'X'
  }
  get isFinanceMemberCrossed(): boolean {
    // * One Envelope conditons
    if (this.isOneEnvelope) {
      if (
        this.role === 'FM' ||
        (this.role === 'PM' && this.OptionSelected === 'BidFromFinance') ||
        (this.role === 'CH' && (this.OptionSelected === 'BidAppr' || this.OptionSelected === 'QualCom')) ||
        this.MemFinal
      ) {
        return true;
      }
    }
    // * Two Envelope conditions
    if (
      this.bidEvalData.FinancialOffer == 'X' && (this.role === 'FM' || ((this.role === 'OF' || this.role === 'CH') && this.OptionSelected === 'BidFinance' || this.OptionSelected === 'BidAppr' || this.OptionSelected === 'QualCom')) || this.MemFinal
    ) {
      return true;
    }

    return false;
  }

  get IS_CEO_DIRECTOR_OR_VP(): boolean {
    return this.role === COMMITTEE_ROLE.CEO || this.role === COMMITTEE_ROLE.DIRECTOR || this.role === COMMITTEE_ROLE.VICE_PRESIDENT;
  }


  get isTenderDP(): boolean {
    return this.bidEvalData?.PurTypID === 'D';
  }

  get isTenderRFP(): boolean {
    return this.bidEvalData?.PurTypID === `R`;
  }

  get DP_SPECIAL_SCENARIO(): boolean {
    return this.bidEvalData.DPFlowException === `X`;
  }

  get isQualificationResultVisible(): boolean {
    if (this.IS_CEO_DIRECTOR_OR_VP) {
      if (this.isTenderDP && !this.DP_SPECIAL_SCENARIO) {
        return false;
      }
      return true;
    }
    return false;
  }

  get isVendorExceededEstPrice(): boolean {
    const finalOfferPrice = parseFloat(this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value);
    return finalOfferPrice > parseFloat(this.bidEvalData.EstPrice);
  }

  get isBoardMember() : boolean {
    return this.role === 'VP' || this.role === 'SS' || this.role === "CO";
  }

  /**
   * Returns the display valud of Technical Evaluation score based on the conditions.
   * @param vendorId Vendor Id
   * @param vendorTechnicalScore Vendor Technical Score
   * @param vendorTechnicalCalculateTotal Vendor Technical Calculated Total
   * @returns The display value of Technical Evaluation Score
   */
  getTechnicalScore(vendorId: string, vendorTechnicalScore: string | number, vendorTechnicalCalculateTotal: string | number): string {
    if (this.ShowEval && this.selectedVendor === vendorId) {
      if (this.checkAllApplicable(this.to_TechReqEval.value)) {
        return vendorTechnicalCalculateTotal.toString();
      } else {
        return '0';
      }
    } else {
      if (vendorTechnicalScore) {
        return this.truncate(vendorTechnicalCalculateTotal.toString());
      }
    }
    return '';
  }

  /**
   * Returns True if the Vendor is selected based on the conditions
   * @param vendorLegalResult Legal result of the Vendor
   * @param VndrTnclEvalScore Technical result of the Vendor
   * @param isVendorSelected IsVendorSelected property value of Vendor
   * @returns True | False
   */
  getIsVendorSelected(vendorId: string, vendorLegalResult: string, VndrTnclEvalScore: string, isVendorSelected: string): boolean {
    const _isVendorSelected = isVendorSelected === 'Y';

    if (this.bidEvalData.TndrTypeID === `02` && this.bidEvalData.CommitteeID === `06` &&
      this.role === COMMITTEE_ROLE.CHAIRMAN && !this.isFinancialOffer && VndrTnclEvalScore == 'Pass' && this.OptionSelected === "BidAppr") {
      const vendorIndex = this.bidEvalData.to_RqstVndrs.results.findIndex((vendor: any) => vendor.VendorId === vendorId);
      this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected = "Y";
      return true;
    }

    if (this.role === 'CH' && this.BidsapprovedRole && this.isFinancialOffer) {
      if (vendorLegalResult === 'Pass' && VndrTnclEvalScore == 'Pass' && _isVendorSelected) {
        return true;
      } else {
        const vendorIndex = this.bidEvalData.to_RqstVndrs.results.findIndex((vendor: any) => vendor.VendorId === vendorId);
        this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected = "N";
        return false;
      }
    }

    if (_isVendorSelected) {
      return true;
    }

    return false;
  }

  /**
   * Return True if the Venor Selected have to disable
   * @param vendorLegalResult Legal Result
   * @param vendorTechnicalResult Technical Result 
   * @returns `True` | `False`
   */
  getIsVendorSelectedDisabled(vendorLegalResult?: string, vendorTechnicalResult?: string): boolean {
    if (this.ChairmanFinalQual === 'FinalQual') {
      let vendorQualified = false;
      this.vendorDetails.forEach((vendor: any) => {
        if (vendor.IsVndrtechQualified === 'X' && vendor.IsVndrfnclQualified === 'X') {
          vendorQualified = true;
        }
      });
      if (vendorQualified) {
        return true;
      }
    }
    if (this.MemFinal || this.IS_CEO_DIRECTOR_OR_VP || vendorLegalResult === 'Fail' || vendorTechnicalResult === 'Fail') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Return True if the IsSME field is checked (Equals to 'X')
   * @param isSME 
   * @returns `True` | `False`
   */
  getIsSMEChecked(isSME: string): boolean {
    if (isSME === 'X') {
      return true;
    }
    return false;
  }

  /**
   * Update the Vendor Detials of IsSME for the paylaod
   * @param checked If IsSME is checked
   * @param vendorIndex 
   */
  updateIsSME(checked: boolean, vendorIndex: number): void {
    if (checked) {
      this.vendorDetails[vendorIndex].IsSME = 'X';
    } else {
      this.vendorDetails[vendorIndex].IsSME = '';
    }
    this.committeeService.setPricePreference(this.vendorDetails);
  }

  truncate(value: string) {
    value = Number(value).toFixed(2);
    return value;
  }

  finalOfferPriceChange() {
    this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.setValue(this.truncate(this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value));
  }

  formattedTechEval : any = []
  formatTechEval(data: any) {
    const formatedData = data.map((value:any) => {
      return { ...value, expand: false };
    })
    return formatedData;
  }


  calculateFinancialWeightage(data: any, index: number) {
    this.vendorDetails[index].VndrFinevalwgtge = ((
      this.lowestPricebyVendors/parseInt(data.Price)
    )*this.financialWeightage).toFixed(3).toString();
  }

  calculateTechnicalWeightage() {
    if(!this.isAllEvaluated) {
      this.cs.createMessage('error', this.translate.instant("COM.Calculate Highest Error"));
      return;
    }
    if(this.highestTechvalScore === 0) {
      this.cs.createMessage('error', this.translate.instant("COM.Weightage Error"));
      return;
    } 
    this.bidEvalData.to_RqstVndrs?.results.forEach((vendor: any) => {
      vendor.VndrTechevalwgtge = ((
        parseFloat(vendor.EvalCMTVndrtnclactualtotal)/this.highestTechvalScore
      )*this.technicalWeigtage).toFixed(2).toString();
    })
   
  } 

  showChkAttachModal1(value: any) {
    if (!this.IsAttachmentModel) {
      this.IsAttachmentModel = true;
      this.selectedBovalue = value;
    }
  }

  handleAttachModalCancel() {
    this.IsAttachmentModel = false;
  }

  handleAttachUpModalCancel() {
    this.IsAttachmentModelup = false;
  }

  //************/ Formatter Methods /************//
  formatterPercent = (value: number): string => {
    return value ? `${this.cs.truncate(value, 2)}%` : `0%`;
  }
  parserPercent = (value: string): string => value.replace('%', '');


  canShowSME(): boolean{
    let vendorQuotedPrice = this.vendorDetails.map((vendor:any)=>vendor.Price)
    return this.sharedCommonService.isSMEApplicable(vendorQuotedPrice)
  }


  toggleSubcriteriaVisibility(index: number) {
    console.log(index, 'toggle')
    this.formattedTechEval[index].expand = !this.formattedTechEval[index].expand;
  }

}
