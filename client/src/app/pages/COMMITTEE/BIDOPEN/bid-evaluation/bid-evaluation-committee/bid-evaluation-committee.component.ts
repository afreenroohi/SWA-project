import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { ApiService } from 'src/app/service/RFP/api.service';
// import { LegalRest } from 'src/app/shared/shared';

import {
  CheckList,
  COMMITTEE_ROLE,
  LegalRest,
  tendertypes,
  UserActionCode,
  DocParamsLevels
} from 'src/app/shared/shared';

import * as _l from 'lodash';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SectionCode } from 'src/app/service/loader';
import {
  doumentDownload,
  TechnicalEvaluation,
  TechnicalRequirement,
  TechnicalRequirementStauts,
  MemberList,
  Department,
  Subcriteria,
  actionButtonDetails,
  ActionMap,
  CommitteeMembers,
  CommitteeMembersFromAPI,
  FinancialWeightageCheck,
  legalWeightageCheck,
  totalWeightageCheck,
  dropDown,
  highLevelDocParams,
  docParams
} from 'src/app/pages/COMMITTEE/committee.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { CommitteeService } from '../../../committee.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { IconList } from 'src/app/components/icon/icon.component';
import { CommonServicesService } from 'src/app/shared/services/common-services.service';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { TwoDecimalPipe } from 'src/app/pipes/two-decimal.pipe';

interface IPanel {
  name: string;
  active: boolean;
  panels?: any;
}

@Component({
  selector: 'app-bid-committee-evaluation',
  templateUrl: './bid-evaluation-committee.component.html',
  styleUrls: ['./bid-evaluation-committee.component.scss']

})
export class BidEvaluationCommitteeComponent
  implements OnInit
{
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
  membersListData: CommitteeMembers[] = [];
  chairmanDetails: any;
  officerDetails: any;
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
  otp: any;
  

  getOTPModel: boolean = false;
  @Output()
  paramsForDocHandle = new EventEmitter();
  actionButtons!: actionButtonDetails[];

  // FormGroups
  otherDocsFormGroup!: FormGroup;

  showChecklists: boolean = false;

  hasOnlyOneSelected:Boolean=false

  seletedVenCom = '';
  boqArray: any[] = [];
  groupedBoq: { [year: string]: BoqItem[] } = {};
  to_VndrChkLst: any[] = [];

  singleVen = 'Y';
  urgentTen = 'N';
  canTen = 'N';

  showBo = false;

  selectedVendor: any;
  selectedVendorDetails: any;
  technicalVendorDetails: any;
  Evalarray: any = [];

  QntySum: any = 0;

  Techtotal = 0;
  chkvesele = 0;
  chktecres = 0;

  showlegalcomment = false;
  showtechcomment = false;

  isvendpass = false;

  LegalCmt: any;
  TechCmt: any;
  // VendorComment = '';
  disLegalsub: any;
  disTechsub: any;
  ChairmanFinalQual: any;
  LegalList?: FormArray;

  ShowEval = false;
  ShowLegal = false;
  MemFinal = false;

  VendName: string = '';
  viewMode = false;
  chklegres = 0;

  commentsArray: any = [];
  showComments: boolean = false;
  allowBidsQual: boolean = false;
  vendorDetails: any;
  OptionSelected: any;

  ChairmanFinalApp = '';
  VndrTnclWgtgeTotal = 0;
  totWeight: number = 0;

  BidsapprovedRole = false;
  BidsOpenCmt = false;

  OFBidFinance = false;
  CHBidFinance = false;

  to_RqstMbrs: any = [];
  finalMOM: any = '';

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
  techEvalScore: any; 
  techEvalScoreArray: string[] = []
  isCriteriaApplicableArray: string[] = [];
  financialWeightageOfAllVendor: FinancialWeightageCheck[] = []
  ifFinancialweightageCalculatedForAllVendors: boolean = false
  leagalScoreOfAllVendors: legalWeightageCheck[] = []
  isLeagelScoreForAllVendorePresent: boolean = false
  totalWeightageOfAllVendors: totalWeightageCheck[] = []
  isatleastOneVendorSelected: boolean = false
  vendorSelectionList: string[] = [];
  SelectedvendorId!: number;
  SelectedcheckListId: any;
  
  initialVendorSelectionList: boolean[] = []
  checklistCheckerArray: { [vendorKey: string]: { [key: string]: boolean }[] } = {};
  isFieldsEditableBasedOnUser: boolean=false
  invalidChecklist: number[] = []
  invalidCheckListVendorName!: string 
  disableDPVendorEdit: { [vendorKey: string]: { [key: string]: boolean } } = {};
  processedData: any;
  expandIconPosition: 'left' | 'right' = 'right';
  estPrice: number = 0;
  estPriceWithoutVAT: number =0;
  rfpNo: string | null = null;

  public readonly panels: IPanel[] = [
    { name: `TenderDetails`, active: true },
    { name: `CommitteeMembers`, active: false },
    { name: `Vendors`, active: false,
      panels: [
        { name: `checklist`, active: false },
        { name: `attchments`, active: false },
        { name: `contentOfOffer`, active: false },
        { name: `committeeComments`, active: false },
        { name: `committeeCommentsForFinancialOffer`, active: false },
      ]
     },
    { name: `CommitteeRecommendations`, active: false },
    { name: `Attachments`, active: false },
  ];

  public readonly COMMITTEE_ROLE = COMMITTEE_ROLE;

  private readonly destroy$ = new Subject<void>();

  subCriteriaForm: FormGroup = this.fb.group({
    to_tevalsub: this.fb.array([]),
  });

  isSubCriteria: boolean = false;
  criteriaIndex: number = 0;
  technicalEvaluationByMember: any;
  rfpEstimationPrice: number = 0;
  tenderDataToPost!: any;
  buttonActionKeysthatRequiresOTP: string[] = [];
  showVendorSelectionToggleForTheBidsFromQualificationCmt: boolean = false;

  vendorFormGroup: FormGroup;
  Status: any;
  selectedStatus: any = [];
  IsFileUploaded: boolean = false;
  showVendorDetail: boolean = false;
  vendorCheckList = CheckList;
  isEditVendorEnabled: boolean = false
  MOMTypesList: dropDown[] = []
  finalApproversList: dropDown[] = []
  localContentList: dropDown[] = []

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
    public sharedCommonService: CommonServicesService,
    private twoDigitPipe: TwoDecimalPipe,
    private committeService: CommitteeService

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
      CmtFrmNumber: new FormControl({ value: '', disabled: true }),
      CmtFrmDate: new FormControl({ value: '', disabled: true }),
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
      mom: new FormControl('', [Validators.required]),
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
      TechWeightage: new FormControl({value: '' , disabled: true}),
      estimatedPrice: new FormControl({value: '', disabled: true}),
      momtype:new FormControl('', Validators.required),
      finalApproval:new FormControl('', Validators.required),
      localContent:new FormControl('', Validators.required),
    });

    this.attList = this.bidEvaluationCommitteeForm.get(
      'Attachments'
    ) as FormArray;

    this.to_TechEval.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateTechnicalTotal(
          this.bidEvaluationCommitteeForm.getRawValue()?.to_TechEval
        );
      });

      this.vendorFormGroup = this.fb.group({
        VendorName: [{ value: '', disabled: true }],
        VendorId: [{ value: '', disabled: true }],
        VendorCommercialNo: [{ value: '', disabled: true }],
        Price: [{ value: '', disabled: false }],
        CheckList: this.fb.array([]),
        Comments: [{ value: '', disabled: this.isFinancialoffer }],
        MOMDts: [{ value: '', disabled: true }],
        ContentOffer: [{ value: '', disabled: true }],
        FinancialOfferCmnts: [{value: '', disabled: false}],
        AttachmentCmnts: [{ value: '', disabled: true }],
        VendorGUID: [
          {
            value: '',
            disabled: true,
          },
        ],
      })
    // * Checks for the Technical Requirement Form value changes - All the Technical Requirement has application
    this.to_TechReqEval.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((TechnicalReq) => {
        this.showTechEvalCrit = this.checkAllApplicable(TechnicalReq);
      });

    // * Trim the comments value
    this.TchnclMbrCmnt.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(2000))
      .subscribe((commentValue: string) => {
        this.TchnclMbrCmnt.setValue(commentValue.trim());
      });

    // * Set the User details Object
    this.userDetails = {
      ROLE: this.commonService.getUserRoleBasedOnCmtID(this.CommitteeID ?? ''),
      CommitteeId: this.CommitteeID ?? '',
      CommitteeName: localStorage.getItem('CommitteeName') ?? '',
      LogdInUsrID: localStorage.getItem('LogdInUsrID') ?? '',
    };
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  async addLegal(
    VendorId?: any,
    TenderId?: any,
    CommitteeId?: any,
    LegalResult?: any,
    reasonfordisqualification?: any
  ) {
    await this.LegalList?.push(
      this.createLegalEval(
        VendorId,
        TenderId,
        CommitteeId,
        LegalResult,
        reasonfordisqualification
      )
    );
  }
  removeLegal(i: any) {
    this.LegalList?.removeAt(i);
  }

  ngOnInit(): void {
    this.OptionSelected = this.formDataSrv.getStatus();
    console.log(this.OptionSelected)
    this.LegalList = this.bidEvaluationCommitteeForm.get(
      'to_LeglEval'
    ) as FormArray;
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID');

    this.role = this.userDetails.ROLE;

    // * Chairman role and option selected
    if (this.role === 'CH') {
      if (this.OptionSelected == 'BidToEval') {
      } else if (this.OptionSelected == 'QualCom') {
        this.ChairmanFinalQual = 'FinalQual';
        this.showVendorSelectionToggleForTheBidsFromQualificationCmt = true
      } else if (this.OptionSelected === 'BidOpen') {
      } else if (this.OptionSelected === 'BidToEval') {
      } else if (this.OptionSelected === 'BidFinance') {
        this.CHBidFinance = true;
      } else if (this.OptionSelected === 'BidList') {
        this.viewMode = true;
      } else if (this.OptionSelected === 'BidAppr') {
        // this.ChairmanFinalApp = "Final"
        this.ChairmanFinalQual = 'FinalQual';
        this.BidsapprovedRole = true;
      } else if (this.OptionSelected === 'BidToFinal') {
        this.MemFinal = true;
      }
    }
    // * Officer role and option selected
    else if (this.role === 'OF') {
      if (this.OptionSelected == 'BidToEval') {
        // Todo: set to bids to be
      } else if (this.OptionSelected === 'BidFinance') {
        this.OFBidFinance = true;
      } else if (this.OptionSelected === 'BidOpen') {
        // Todo: set bid open
      } else if (this.OptionSelected === 'BidList') {
        this.viewMode = true;
        // Todo: set to bid list
      } else if (this.OptionSelected === 'BidToFinal') {
        this.MemFinal = true;
      }
    }
    // * Member role and option selected
    else if (
      this.role === 'LM' ||
      this.role === 'TM' ||
      this.role === 'FM' ||
      this.role === 'MM' ||
      this.role === 'PM'
    ) {
      if (this.OptionSelected == 'BidToEval') {
        this.ChairmanFinalApp = 'X';
      } else if (this.OptionSelected === 'BidList') {
        // Todo: set to bid list
        this.viewMode = true;
      } else if (this.OptionSelected === 'BidAppr') {
        // Todo: set to bid list
      } else if (this.OptionSelected === 'BidToFinal') {
        this.MemFinal = true;
      }
    }

    // For CEO, VP and Director
    else if (
      localStorage.getItem('ROLEMG') == 'VP' ||
      localStorage.getItem('ROLEMG') == 'SS' ||
      localStorage.getItem('ROLEMG') == 'CO'
    ) {
      this.viewMode = true;
    }

    this.initialTenderDetails = this.formData.getData();
    if (
      this.initialTenderDetails &&
      this.initialTenderDetails.WFCmtMnuAction == 'BOFR'
    ) {
      this.isFinancialoffer = true;
    }
    console.log(
      this.role,
      this.initialTenderDetails.WFCmtMnuAction,
      'role and action'
    );

    this.getTenderDetails();

     // * Read checList type as status from master data
     this.spinner.show();
     this.api
       .get('F4_CHKLST_TYPE')
       .pipe(takeUntil(this.destroy$))
       .subscribe(
         (res) => {
           this.spinner.hide();
           if (res.d.results.length > 0) {
             this.Status = res.d.results;
             this.selectedStatus = this.Status[0];
           }
         },
         () => {
           this.spinner.hide();
         }
       );

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.bidEvaluationCommitteeForm.controls['typeOfPurchase']?.setValue(
          this.cs.returnPurchaseType(this.bidEvalData.PurTypID)
        );
        this.bidEvaluationCommitteeForm.controls[
          'typeOfPurchase'
        ].updateValueAndValidity();

        this.bidEvaluationCommitteeForm.controls['typeOfTendering']?.setValue(
          this.cs.returnTypeOfEnvlope(this.bidEvalData.TndrTypeID)
        );
        this.bidEvaluationCommitteeForm.controls[
          'typeOfTendering'
        ].updateValueAndValidity();
      });
    this.getCompetitionTypes();

    // * Get Evaluation Percentage
    this.getEvaluationWeightage();
    this.loadDropdownData()
    this.isFieldsEditableBasedOnUser = this.isFieldsEditable()
    
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

  // ngAfterContentChecked(): void {
  //   this.changeDetector.detectChanges();
  // }

  // checkList group method
  checkListFormGroups(): FormArray {
    return this.vendorFormGroup.get('CheckList') as FormArray;
  }

  madateAttachmentChecklistIndicator(checklistId: string):boolean{
    if(this.bidEvalData?.TndrTypeID === '01'){
      if(checklistId === '001' || checklistId === '002'){
        return true;
      }
    }else if(this.bidEvalData?.TndrTypeID === '02' && this.bidEvalData?.FinancialOffer === 'X'){
      if( checklistId === '001'){
        return true;
      }
    }else if(this.bidEvalData?.TndrTypeID === '02' && this.bidEvalData?.FinancialOffer === ''){
      if( checklistId === '002'){
        return true;
      }
    }
    return false;
  }


  changeStatus( checkListID: any) {
    if (
      (<FormArray>this.vendorFormGroup.get('CheckList'))
        .controls[checkListID].value.ChecklistType === '01' ||
      (<FormArray>this.vendorFormGroup.get('CheckList'))
        .controls[checkListID].value.ChecklistType === '02'
    ) {
      // ! Commented and setValue() used
      // (<FormArray>(
      //   this.VendorFormGroup.controls[venId].get('CheckList')
      // )).controls[checkListID].value.IsAttachmentValid = false;
      (<FormArray>(
        this.vendorFormGroup.get('CheckList')
      )).controls[checkListID]
        .get('IsAttachmentValid')
        ?.setValue(false);
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid =  'Y'
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].ChecklistType =  '01'
        // console.log(this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid)
        
      } else if ((<FormArray>this.vendorFormGroup.get('CheckList'))
        .controls[checkListID].value.ChecklistType === '03') {
        (<FormArray>(
          this.vendorFormGroup.get('CheckList')
        )).controls[checkListID]
        .get('IsAttachmentValid')
        ?.setValue(true);
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid ='N'
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].ChecklistType =  '03'
        // console.log(this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid)
    } else if ((<FormArray>this.vendorFormGroup.get('CheckList'))
      .controls[checkListID].value.ChecklistType === '04') {
        (<FormArray>(
          this.vendorFormGroup.get('CheckList')
        )).controls[checkListID]
        .get('IsAttachmentValid')
        ?.setValue(true);
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid ='N'
        this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].ChecklistType =  '04'
    } else {
      (<FormArray>(
        this.vendorFormGroup.get('CheckList')
      )).controls[checkListID]
      .get('IsAttachmentValid')
      ?.setValue(false);
      this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].IsAttachmentValid ='Y'
      this.vendorDetails[this.SelectedvendorId].to_VndrChkLst.results[Number(checkListID) ].ChecklistType =  '01'
    }
    
    this.isAttachmentPresent(this.SelectedvendorId, checkListID)

  }

  getIsApplicableorNot(statusID: string): string {
    const currentStatus = this.F4_TechReqStatus.find(status => status.TechReqStatusID === statusID)
    if (this.isUserLanguageEnglish) {
      return currentStatus?.TechReqStatusDescEN ?? '-';
    } else {
      return currentStatus?.TechReqStatusDescAR ?? '-';
    }
  }

  showChkAttachModal(checkId: any) {
    this.SelectedcheckListId = checkId;
    this.commonService.successMsg$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: any) => {
        this.IsFileUploaded = msg;

        // ! Commented and setValue() used
        // (<FormArray>(
        //   this.VendorFormGroup.controls[vdId].get('CheckList')
        // )).controls[checkId - 1].value.AttachmentFlag =
        //   msg === true ? 'Y' : 'N';
        (<FormArray>(
          this.vendorFormGroup.get('CheckList')
        )).controls[checkId - 1]
          .get('AttachmentFlag')
          ?.setValue(msg);
      });
    this.IsAttachmentModel = true;
    // }
    // }
  }


  restrictZero(event: any) {
    if (event.target.value.length === 0 && event.key <= '0') {
      event.preventDefault();
    }
  }

  resetVendorForm() {
    this.vendorFormGroup.reset();
    this.checkListFormGroups().controls.splice(0, this.checkListFormGroups().controls.length);
    this.showVendorDetail = false;
    this.setEnableDPVendorEdit()
    const invalidFormControls = this.getInvaildFormControls();
const controlsToRemove = ['checkListAttachment', 'price'];

controlsToRemove.forEach(control => {
    const index = invalidFormControls.indexOf(control);
    if (index !== -1) {
        invalidFormControls.splice(index, 1); // Remove the control
    }

    console.log(this.getInvaildFormControls())
});

    
  }

  saveVendorDetails() {

    console.log(this.getInvaildFormControls(), 'this.getInvaildFormControls()' )
    if (this.getInvaildFormControls().includes('checkListAttachment')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Checklist attachment not found for the vendor ' +
          this.invalidCheckListVendorName
          : `قائمه التدقيق الخاصه بالمورد (${this.invalidCheckListVendorName}) مفقوده`
      );
      return;
    }
    // todo need to change the arabic traslation
    if (this.getInvaildFormControls().includes('price')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Price Cannot be empty or zero for the vendor ' +
          this.invalidCheckListVendorName
          : `قائمه التدقيق الخاصه بالمورد (${this.invalidCheckListVendorName}) مفقوده`
      );
      return;
    }

    this.bidEvalData.to_RqstVndrs.results[this.SelectedvendorId].Price = this.vendorFormGroup.get('Price')?.value;

    this.bidEvalData.LgdInUsrAction = 'DFT';

    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
    this.spinner.show();
    // console.log(this.bidEvalData, 'this.bidEvalData')

    this.api
        .post('OCOM_CRT_UPD', this.bidEvalData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.spinner.hide();
            if (res.d.MsgType === 'S') {
              this.cs.createMessage(
                'Success',
                this.translate.instant('COM.Vendor Details Saved')
              );
              this.getTenderDetails();
            } else {
              this.cs.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
  }

  get isDPSecretary(): boolean {
    return (this.CommitteeID === '04' 
      && this.bidEvalData.TndrTypeID === '02' &&
       this.role === 'OF')  
  }

  showEditVendor(data: any, index: number): void {
    this.SelectedvendorId = index;
    this.vendorFormGroup.patchValue(data);
    this.populateCheckListData(data.to_VndrChkLst.results);
    this.showVendorDetail = true;
    this.setDisableDPVendorEdit(index)
  }


  populateCheckListData(data: any[]) {
    data.forEach((ele) => {
      let controls = this.vendorFormGroup.get(
        'CheckList'
      ) as FormArray;

      controls.push(this.fb.group(ele));
      (<FormArray>(
        this.vendorFormGroup.get('CheckList')
      )).controls.forEach((ele: any) => {
        if (ele.get('ChecklistType').value === '') {
          ele.get('ChecklistType').patchValue(this.Status[0].ChklstTypeID);
        }
        if (ele.get('IsAttachmentValid').value === 'Y') {
          ele.get('IsAttachmentValid').patchValue(false);
        } else if (ele.get('IsAttachmentValid').value === 'N') {
          ele.get('IsAttachmentValid').patchValue(true);
        }
      });

      // * Check List Controls Array Iteration
      (<FormArray>(
        this.vendorFormGroup.get('CheckList')
      )).controls.forEach((control) => {
        // * Disable if not Secretary
        if (this.role !== 'OF') {
          control.disable();
          return;
        }
        // * Selected Menu - Bids to be Opened
        // * DP - Bids to be evaluated (BEMR) and From Qualification (BFQC)
        if (
          this.initialTenderDetails.WFCmtMnuAction === 'BOPN' || 
          this.initialTenderDetails.WFCmtMnuAction === 'BEMR' || 
          this.initialTenderDetails.WFCmtMnuAction === 'BFQC'
        ) {
          // * If Two Envelope And CheckList is Finanical Offer ( Check List Id is '1') and Financial Offer is not selected
          const isTwoEnvelope = Number(this.initialTenderDetails.TndrTypeID) === 2;
          const isFinancialOfferNotSelected =
            this.bidEvalData?.FinancialOffer === '';
          const checklistIdtodisableForTechnicalOffer = [1, 4].includes(
            Number(control.value.ChecklistId)
          );
          const checklistIdtodisableForFinancialOffer = [2].includes(
            Number(control.value.ChecklistId)
          );

          if (
            isTwoEnvelope &&
            checklistIdtodisableForTechnicalOffer &&
            isFinancialOfferNotSelected
          ) {
            control.disable();
            return;
          }
          if (
            isTwoEnvelope &&
            checklistIdtodisableForFinancialOffer &&
            !isFinancialOfferNotSelected
          ) {
            control.disable();
            return;
          }


          control.enable();
          return;
        }

        // * Selected Menu - Bids for financial Offer
        if (this.initialTenderDetails.WFCmtMnuAction === 'BFNC') {
          // * If Two Envelope And CheckList all are enabled
          if (Number(this.initialTenderDetails.TndrTypeID) === 2) {
            control.enable();
            return;
          }
          control.disable();
          return;
        }

        // * Selected Menu - Bids to be approved
        if (this.initialTenderDetails.WFCmtMnuAction === 'BPRV') {
          // * If Two Envelope
          if (Number(this.initialTenderDetails.TndrTypeID) === 2) {
            // * If Not Financial Offer
            if (this.bidEvalData?.FinancialOffer !== 'X') {
              // * CheckList is Finanical Offer ( Check List Id is '1')
              if (Number(control.value.ChecklistId) === 1) {
                control.disable();
                return;
              }
              control.enable();
              return;
            }
            // * If Financial Offer
            else {
              // * CheckList is not Finanical Offer ( Check List Id is '1')
              if (Number(control.value.ChecklistId) !== 1) {
                control.disable();
                return;
              }
              control.enable();
              return;
            }
          }
          control.enable();
          return;
        }

        // * Default all disabled
        control.disable();
      });
    });
  }

  testFnParams(test_vn: any, testParams: any) { 
    let vendorComnumber =
      this.vendorFormGroup?.get('VendorCommercialNo')?.value;
    let vendorGUID =
      this.vendorFormGroup?.get('VendorGUID')?.value;
    this.selectedVendorGUID = vendorGUID;
    const vendorChecklist = this.vendorFormGroup?.get(
      'CheckList'
    ) as FormArray;
    const selectedCheckList = vendorChecklist.controls.find((control) => {
      if (Number(control.value?.ChecklistId) === Number(testParams)) {
        return control;
      } else {
        return null;
      }
    });
    vendorComnumber = vendorComnumber
      ? vendorComnumber.toString().replace(/\b0+/g, '')
      : '';
    testParams = testParams.toString().replace(/\b0+/g, '');
    const currTenderId = _l.get(this.initialTenderDetails, 'TndrID', '');
    const objToReturn: DocParamsLevels = {
      firstLevelName: 'P2PCommitteTender',
      firstLevelId: currTenderId, // Tender ID
      secondLevelName: 'P2PCommitteVendor',
      secondLevelId: vendorComnumber ? vendorComnumber.toString() : '', //vendor comercial number
      thirdLevelId: testParams ? testParams : '', //ChecklistID
      operation: 'C',
      VendorGUID: vendorGUID,
      editable: selectedCheckList?.get('ChecklistType')?.enabled ? true : false,
    };
    // console.log(this.vendorList?.value, 'this.vendorList?.value');
    return objToReturn;
  }

  showHideComments(data?: any) {
    if (data) {
      this.selectedVendor = data.VendorId;
      this.getComments();
    } else {
      this.showComments = false;
    }
  }

  checkValueSize() {
    if (this.Techtotal > 100) {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.Actual Comment')
      );
      return;
    }
  }

  commentDate(date: any) {
    return (
      date.slice(0, 4) +
      '/' +
      date.slice(4, 6) +
      '/' +
      date.slice(6, 8) +
      ' ' +
      date.slice(8, 10) +
      ':' +
      date.slice(10, 12) +
      ':' +
      date.slice(12, 14)
    );
  }

  showLegalComment(value?: any) {
    if (value) {
      this.selectedVendor = value.VendorId;
    }

    if (this.showlegalcomment) {
      this.showlegalcomment = false;
    } else {
      this.showlegalcomment = true;
    }
  }
  showTechComment(value?: any) {
    if (value) {
      this.selectedVendor = value.VendorId;
    }

    if (this.showtechcomment) {
      this.showtechcomment = false;
    } else {
      this.showtechcomment = true;
    }
  }
  OpenRoleModal(value: string) {
    if (this.openMdl) {
      this.openMdl = false;
    } else {
      this.openMdl = true;
    }
  }

  getTenderDetails(): void {
    const tendDetails = {
      TenderId: this.initialTenderDetails?.TndrID,
    };
    this.spinner.show();
    this.api
      .post('ECOM_TENDER_DETAILS', tendDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.spinner.hide();
          var data = res.d.results[0];
          this.bidEvalData = data;
          this.vendorFormGroup.reset();
          this.checkListFormGroups().controls.splice(0, this.checkListFormGroups().controls.length);
          this.showVendorDetail = false;
          this.setActionsinActionButtons(res.d.results[0].to_Button.results);

          console.log(this.bidEvalData);
          this.setFormValues()
          
          if (this.bidEvalData) {
            this.vendorDetails = this.bidEvalData.to_RqstVndrs.results;
            this.checkisFinancialWeightagecalculated()
            this.getLegalScoreForAllVendors()
            this.getTotalWeightageOfAllVendors()
            this.getIsAllvendorSelected()

            this.initializeChecklistChecker(this.vendorDetails)

    

            this.vendorDetails.forEach((vendor:any, index: number)=>{
              this.techEvalScoreArray.push(vendor.VndrTnclEvalScore)
              this.isCriteriaApplicableArray.push(vendor.IsCriteriaApplicable)
              if(this.vendorDetails[index].VndrTnclEvalScore=== 'Fail' || this.vendorDetails[index].VndrLegalResult === 'Fail'){
                this.bidEvalData.to_RqstVndrs.results[index].IsVendorSelected ='N';
              }
              const isSelected = this.getIsVendorSelected(
                vendor.VendorId,
                vendor.VndrLegalResult,
                vendor.VndrTnclEvalScore,
                vendor.IsVendorSelected,
                this.getTotalWeightage(vendor.VndrTechevalwgtge, vendor.VndrFinevalwgtge)
              );
              this.initialVendorSelectionList.push(isSelected)
            })
            
            if (this. CommitteeID === '04') {
              this.getStatusList(true);
            }
            if (this.isFinanceMemberCrossed) {
              this.vendorDetails.forEach((element: any, index: any) => {
                element.PricePreference = parseFloat(
                  element?.PricePreference
                ).toString();
                element.Ranking =
                  this.vendorDetails[index]?.Ranking !== undefined
                    ? this.vendorDetails[index]?.Ranking.toString()
                    : '0';
              });
            }
            this.committeeService.setPricePreference(this.vendorDetails);
            this.getMemberDetails();
            this.getAssignableSecretaries();
          }

          if (this.bidEvalData?.to_Attach) {
            const { committeeFiles, notCommitteeFiles } = this.bidEvalData.to_Attach.results.reduce(
              (acc: any, node: any) => {
                if ( node.FilenetID && node.FileName) {
                    if (this.CommitteeID === node.CommitteeId) {
                      acc.committeeFiles.push(node)
                    }else {
                      acc.notCommitteeFiles.push(node)
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

  financialWeightage: number = 0;
  technicalWeigtage: number = 0;

  // * Get Evaluation Percentage
  getEvaluationWeightage() {
    this.api
      .get(
        `get-evaluation-weightage?tender_id=${this.initialTenderDetails?.TndrID}`
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.financialWeightage = parseFloat(res.d.FinEvalWatage);
          this.bidEvaluationCommitteeForm.controls['FinWeightage'].setValue(res.d.FinEvalWatage);
          this.bidEvaluationCommitteeForm.controls['FinWeightage'].updateValueAndValidity();
          this.technicalWeigtage = parseFloat(res.d.TechEvalWatage);
          this.bidEvaluationCommitteeForm.controls['TechWeightage'].setValue(res.d.TechEvalWatage);
          this.bidEvaluationCommitteeForm.controls['TechWeightage'].updateValueAndValidity();
        },
        (err) => {}
      );
  }

  getFinalOfferPrice() {
    let finalPrice = '0.000';
    if (this.bidEvalData?.FinalOfferPrice !== '0.000') {
      finalPrice = this.bidEvalData?.FinalOfferPrice;
    } else {
      const vendor = this.bidEvalData?.to_RqstVndrs?.results.find((vendor: any) => {
        if (vendor.IsVendorSelected === 'Y' 
          && vendor.IsVndrtechQualified === 'X' 
          && vendor.IsVndrfnclQualified === 'X') {
            return vendor;
        }
      });
      if (vendor) {
        finalPrice = vendor.PricePreference !== '0.00' 
                      ? vendor.PricePreference : vendor.Price;
      }
    }
    return finalPrice;
  }

  getAssignableSecretaries() {
    let cmtid = {
      Id: this.CommitteeID ?? '',
      TndrId: this.bidEvalData.TndrID,
    };
    this.api
      .post('/F4_MEMBERS_SECRETARY', cmtid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.officerDetails = [];
          this.officerDetails = res.d.results.filter((el: any) => {
            if (el.CommitteeRole === 'OF') {
              return el;
            }
          });
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
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
    this.bidEvalData.to_RqstVndrs.results[index].to_LeglEval.results[index]
      .LegalResult;
  }

  onmemberChange(event: Event, type: string, index: number) {
    const checkbox = event.target as HTMLInputElement;
    const member = this.membersListData[index];

    // Update the SelectedMbr property
    if(type === 'fixed'){
      if (checkbox.checked) {
        // Add member to selectedMembers if checked
        if(!member.isBackupChecked && member.CommitteeBkpUserName.length > 0){

          this.membersListData[index].isBackupChecked = true
          this.membersListData[index].isChecked = false
          this.membersListData[index].SelectedMbr = 'B'
          // this.to_RqstMbrs.push(this.membersListData[index])
          // console.log('Selected Members:', this.to_RqstMbrs);
        }else if(member.isBackupChecked && member.CommitteeBkpUserName.length > 0){
          this.membersListData[index].isBackupChecked = false
          this.membersListData[index].isChecked = true
        this.membersListData[index].SelectedMbr = 'M'

          // this.to_RqstMbrs.push(this.membersListData[index])
        }else{
          this.to_RqstMbrs.push(member);
          // console.log('Selected Members:', this.to_RqstMbrs);
        }
      } else {
        // Remove member from to_RqstMbrs if unchecked
        if(member.CommitteeBkpUserName.length > 0){

          this.membersListData[index].isBackupChecked = true
          this.membersListData[index].isChecked = false
          this.membersListData[index].SelectedMbr = 'B'
          // this.to_RqstMbrs.push(this.membersListData[index])
        }else{
          this.to_RqstMbrs = this.to_RqstMbrs.filter(
            (selected: { CommitteeUser: any }) =>
              selected.CommitteeUser !== member.CommitteeUser
          );
        }
        
       
      }
    }else if(type === 'backup'){
      if(checkbox.checked){
        console.log('backup checked')
        
        this.membersListData[index].isChecked = false
        this.membersListData[index].isBackupChecked = true
        this.membersListData[index].SelectedMbr = 'B'
        // this.to_RqstMbrs.push(this.membersListData[index])

        // this.to_RqstMbrs = this.to_RqstMbrs.filter(
        //   (selected: { CommitteeUser: any }) =>
        //     selected.CommitteeUser !== member.CommitteeUser
        // );
      }else{
       
        console.log('backup unchecked')
        this.membersListData[index].isBackupChecked = false
        this.membersListData[index].isChecked = true
        this.membersListData[index].SelectedMbr = 'M'

        // this.to_RqstMbrs.push(this.membersListData[index])
        
        // this.to_RqstMbrs = this.to_RqstMbrs.filter(
        //   (selected: { CommitteeUser: any }) =>
        //     selected.CommitteeUser !== member.CommitteeUser
        // );
      }
      
    }
    console.log('Selected Members:', this.to_RqstMbrs);

  }

  selectVendor(value: any, selectedVendorId: any) {
    const i = this.bidEvalData.to_RqstVndrs.results.findIndex(
      (vendor: any) => vendor.VendorId === selectedVendorId
    );
    console.log(value, 'select vendor trigger')

    if (value == true) {
      this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = 'Y';
    } else {
      this.bidEvalData.to_RqstVndrs.results[i].IsVendorSelected = 'N';
    }
    
    this.getIsAllvendorSelected()
  }

  openingDataBasedonTenderType(): boolean {
    return this.bidEvalData.TndrTypeID === '01';
  }

  assignOfficer(value: any) {
    
  
  

    if (
      this.isFinancialOffer &&
      !this.checkMemberValid(this.to_RqstMbrs, this.bidEvalData.TndrTypeID)
    ) {
      return;
    }

    this.bidEvalData.to_RqstVndrs.results.forEach(
      (element: any, index: any) => {
        element.PricePreference =
          this.vendorDetails[index]?.PricePreference !== undefined
            ? this.vendorDetails[index]?.PricePreference.toString()
            : '0';
        element.Ranking =
          this.vendorDetails[index]?.Ranking !== undefined
            ? this.vendorDetails[index]?.Ranking.toString()
            : '0';
      }
    );

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
      CommitteeID: this.CommitteeID ?? '',
      CommitteeName: localStorage.getItem('CommitteeName'),
      MomType: this.bidEvalData.MomType,
      FinalApproval: this.bidEvalData.FinalApproval,
      FinalOfferPrice: this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value,
      LocalContent: this.bidEvalData.LocalContent,
      AsgnOpngCmtOfficerID: this.bidEvalData.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.bidEvalData.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: this.bidEvalData.AsgnQualCmtOfficerID,
      AsgnQualCmtOfficerName: this.bidEvalData.AsgnQualCmtOfficerName,
      AsgnEvalCmtOfficerID: this.bidEvalData.AsgnEvalCmtOfficerID,
      AsgnEvalCmtOfficerName: this.bidEvalData.AsgnEvalCmtOfficerName,
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      NoOfByres:this.bidEvalData.NoOfByres,
      NoOfVndrs: this.bidEvalData.NoOfVndrs,
      NoOfQualificationInvitation: this.bidEvalData.NoOfQualificationInvitation,
      InvitationPublishDate: this.bidEvalData.InvitationPublishDate,
      QualDocReceivingDate: this.bidEvalData.QualDocReceivingDate,
      QualDocInspectionDate: this.bidEvalData.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.bidEvalData.NoOfVndrsInvolvedInQual,
      PassingRate: this.bidEvalData.PassingRate,
      CurrentDate: this.cs.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      LgdInUsr: this.userDetails.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID ?? '',
      LgdInUsrCmtRole: this.userDetails.ROLE,
      LgdInUsrAction: value,
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
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
    console.log(this.to_RqstMbrs, 'this.to_RqstMbrs')
    this.processedData = data

    this.showConfirm(data, value);

   
  }

  validationsForDpOF() {
    if (this.CommitteeID === '04' && this.role === 'OF') {
      const validations = [
        {
          control: 'checkListAttachment',
          message: {
            en: `Checklist attachment not found for the vendor ${this.invalidCheckListVendorName}`,
            ar: `قائمه التدقيق الخاصه بالمورد (${this.invalidCheckListVendorName}) مفقوده`,
          },
        },
        {
          control: 'price',
          message: {
            en: `Price cannot be empty or zero for the vendor ${this.invalidCheckListVendorName}`,
            ar: `قائمه التدقيق الخاصه بالمورد (${this.invalidCheckListVendorName}) مفقوده`,
          },
        },
        {
          control: 'momtype',
          message: {
            en: 'Please Fill the MOM Type',
            ar:'يرجى ملء ' + this.translate.instant(`COM.MOM Type`),
          },
        },
      ];
  
      for (const validation of validations) {
        if (this.getInvaildFormControls().includes(validation.control)) {
          this.commonService.createMessage(
            'error',
            this.commonService.userLanguage === 'en'
              ? validation.message.en
              : validation.message.ar
          );
          return false;
        }
      }
    }
  
    return true;
  }
  
  

  assignMember(value: UserActionCode) {
    // * If bid evolution secratory validation for Make selection of any one of the procurement member ,
    // * finance and legal members mandatory and also selection of technical member is mandatory.

  if(this.isFieldsEditable())  
 { 
  let formControlsToCheck: string[] = ['finalApproval', 'localContent', 'momtype', 'mom'];
  let alertKeys: string[] =[ 'FinalApproval', 'Local Content', 'MOM Type', 'CommitteeRecommendations']
  for (let control = 0; control < formControlsToCheck.length; control++) {
    console.log(this.checkInvalidControls().includes(formControlsToCheck[control]))
    if(this.checkInvalidControls().includes(formControlsToCheck[control])){
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Please Fill ' + this.translate.instant(`COM.${alertKeys[control]}`)
          :'يرجى ملء ' + this.translate.instant(`COM.${alertKeys[control]}`)
      );
      return
    }
  }}

  if (!this.validationsForDpOF()) {
    return; // Stop execution if validations fail
  }
   
  

    if (
      this.role === 'FM' ||
      (this.role === 'OF' && this.bidEvalData.FinancialOffer == 'X')
    ) {
      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          if (
            this.bidEvalData.to_RqstVndrs.results.length >
              this.vendorDetails.length &&
            index === this.vendorDetails.length
          ) {
            element.PricePreference = element.PricePreference.toString();
            element.Ranking =
              this.vendorDetails[index]?.Ranking !== undefined
                ? this.vendorDetails[index]?.Ranking.toString()
                : '0';
          } else {
            element.PricePreference =
              this.vendorDetails[index].PricePreference.toString();
            element.Ranking =
              this.vendorDetails[index]?.Ranking !== undefined
                ? this.vendorDetails[index]?.Ranking.toString()
                : '0';
          }
        }
      );
    } else {
      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          element.PricePreference = element.PricePreference.toString();
          element.Ranking =
            this.vendorDetails[index]?.Ranking !== undefined
              ? this.vendorDetails[index]?.Ranking.toString()
              : '0';
        }
      );
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
      MomType: this.bidEvaluationCommitteeForm.get('momtype')?.value,
      FinalApproval: this.bidEvaluationCommitteeForm.get('finalApproval')?.value,
      FinalOfferPrice: this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value,
      LocalContent: this.bidEvaluationCommitteeForm.get('localContent')?.value,
      CommitteeCmntsArea: this.bidEvaluationCommitteeForm.get('mom')?.value,
      CommitteeTxtArea: this.bidEvalData.CommitteeTxtArea
        ? this.bidEvalData.CommitteeTxtArea
        : this.bidEvaluationCommitteeForm.getRawValue().cmtworks,
      CommitteeAtchArea: this.bidEvaluationCommitteeForm.getRawValue()
        .attachments
        ? this.bidEvaluationCommitteeForm.getRawValue().attachments
        : this.bidEvalData.CommitteeAtchArea,
      CommitteeID: this.CommitteeID ?? '',
      CommitteeName: localStorage.getItem('CommitteeName'),
      AsgnOpngCmtOfficerID: this.bidEvalData.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.bidEvalData.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: this.bidEvalData.AsgnQualCmtOfficerID,
      AsgnQualCmtOfficerName: this.bidEvalData.AsgnQualCmtOfficerName,
      AsgnEvalCmtOfficerID: this.bidEvalData.AsgnEvalCmtOfficerID,
      AsgnEvalCmtOfficerName: this.bidEvalData.AsgnEvalCmtOfficerName,
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      NoOfByres:this.bidEvalData.NoOfByres,
      NoOfVndrs: this.bidEvalData.NoOfVndrs,
      NoOfQualificationInvitation: this.bidEvalData.NoOfQualificationInvitation,
      InvitationPublishDate: this.bidEvalData.InvitationPublishDate,
      QualDocReceivingDate: this.bidEvalData.QualDocReceivingDate,
      QualDocInspectionDate: this.bidEvalData.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.bidEvalData.NoOfVndrsInvolvedInQual,
      PassingRate: this.bidEvalData.PassingRate,
      CurrentDate: this.cs.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      LgdInUsr: this.userDetails.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID ?? '',
      LgdInUsrCmtRole: this.userDetails.ROLE,
      LgdInUsrAction: value,
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.vendorDetails,
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
    this.processedData = data

    console.log(data)

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
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.Select Members to assign')
      );
      return false;
    }

    if (this.CommitteeID === '04') {
      const requiredDepartments = [
        Department['Committee Member']
      ];
      return this.cs.isRequiredMemberChecked(memberList, requiredDepartments);
    }

    // * Conditions based on One Envelope
    if (tendorTypeId === '01') {
      const requiredDepartments = [
        Department['Legal Member'],
        Department['Procurement Member'],
        Department['Finance Member'],
      ];
      return this.cs.isRequiredMemberChecked(memberList, requiredDepartments);
    }

    // * Conditions based on Two Envelope
    if (tendorTypeId === '02') {
      let requiredDepartments = [Department['Procurement Member']];

      // * If the Tendor is for Finance evaluation
      if (this.OptionSelected === 'BidFinance') {
        requiredDepartments = [
          Department['Legal Member'],
          Department['Finance Member'],
        ];
      }

      return this.cs.isRequiredMemberChecked(memberList, requiredDepartments);
    }

    return true;
  }

  async assignQualCmt(value: any) {
    // * Condition for the Return to Qulification Committee
    if (this.getIsVendorSelectedDisabled()) {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.Vendor Passed in Qualificaiton Committee')
      );
      return;
    }

    this.chkvesele = 0;
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
    // this.bidEvalData.to_RqstMbrs.results = this.membersListData;
    await this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      if (element.IsVendorSelected == 'Y') {
        this.chkvesele = this.chkvesele + 1;
      }
      // if(element.VndrLegalResult === "Pass"){
      //   this.isvendpass = true;
      // }

      if (element.Price) {
        if (parseInt(element.Price) > 0) {
          this.allowBidsQual = true;
        }
      }
    });

    if (this.bidEvalData.to_RqstVndrs.results.length === 1) {
      if (this.chkvesele == 1 && this.allowBidsQual) {
        this.showConfirm(this.bidEvalData, UserActionCode.submit);
      } else {
        this.spinner.hide();
        this.cs.createMessage(
          'error',
          this.translate.instant('COM.SelectVendor')
        );
      }
    } else if (this.chkvesele == 1 && this.allowBidsQual) {
      // * Convert the Price Preference and Price Ranking values to String
      this.bidEvalData.to_RqstVndrs.results.forEach((vendor: any) => {
        vendor.PricePreference = vendor.PricePreference.toString();
        vendor.Ranking = vendor.Ranking.toString();
      });

      this.showConfirm(this.bidEvalData, UserActionCode.submit);
    } else if (!this.allowBidsQual) {
      this.cs.createMessage('error', this.translate.instant('COM.UpdatePrice'));
    } else if (this.chkvesele > 1) {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    } else if (this.chkvesele == 0) {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectOneVendor')
      );
    } else {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    }
  }

  async assignQualCmtReturn(value: any) {
    this.chkvesele = 0;
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
    }
    this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
    this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
    this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
    // this.bidEvalData.to_RqstMbrs.results = this.membersListDat
    await this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      if (element.IsVendorSelected == 'Y') {
        this.chkvesele = this.chkvesele + 1;
      }
      if (element.Price) {
        if (parseInt(element.Price) > 0) {
          this.allowBidsQual = true;
        }
      }
    });

    if (
      (this.chkvesele == 1 ||
        this.bidEvalData.to_RqstVndrs.results.length === 1) &&
      this.allowBidsQual
    ) {
      this.showConfirm(this.bidEvalData, UserActionCode.submit);
    } else if (this.chkvesele > 1) {
      this.spinner.hide();
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    } else if (this.chkvesele == 0) {
      this.spinner.hide();
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    } else if (!this.allowBidsQual) {
      this.spinner.hide();
      this.cs.createMessage('error', this.translate.instant('COM.UpdatePrice'));
    } else {
      this.spinner.hide();
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    }
  }

  public FirstLevelFinalApproval(value: UserActionCode) {
    this.openSecretarySelectionFinalSubmit =
      !this.openSecretarySelectionFinalSubmit;

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
    this.bidEvalData.AsgnEvalCmtOfficerID =
      this.selectedSecretary.CommitteeUserID;
    this.bidEvalData.AsgnEvalCmtOfficerName =
      this.selectedSecretary.CommitteeUserName;
    if (this.bidEvalData.IsSingleTender === '') {
      this.bidEvalData.IsSingleTender = 'N';
    }

    if (this.bidEvalData.IsTenderCancelled === '') {
      this.bidEvalData.IsTenderCancelled = 'N';
    }
    if (this.bidEvalData.IsTenderUrgent === '') {
      this.bidEvalData.IsTenderUrgent = 'N';
    }
    this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
      if (element.IsVendorSelected == 'Y') {
        this.chkvesele = this.chkvesele + 1;
      }
    });

    if (this.chkvesele == 1) {
      this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {
        if (element.IsVendorSelected == 'Y') {
          this.bidEvalData.CommitteeCmntsArea =
            this.bidEvaluationCommitteeForm.controls['mom'].value.toString();
        }
      });
      this.showConfirm(this.bidEvalData, value);
    } else if (this.chkvesele > 1) {
      this.spinner.hide();
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    } else {
      this.spinner.hide();
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    }
    // }
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
    if (
      this.role === 'CH' ||
      this.role === 'FM' ||
      (this.role === 'OF' && this.bidEvalData.FinancialOffer == 'X')
    ) {
      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          if (
            this.bidEvalData.to_RqstVndrs.results.length >
            this.vendorDetails.length
          ) {
            element.PricePreference = element.PricePreference.toString();
            element.Ranking =
              this.vendorDetails[index]?.Ranking !== undefined
                ? this.vendorDetails[index]?.Ranking.toString()
                : '0';
            element.VndrFinevalwgtge =
              this.vendorDetails[index]?.VndrFinevalwgtge;
            element.VndrTechevalwgtge =
              this.vendorDetails[index]?.VndrTechevalwgtge;
            element.EvalCMTVndrtnclactualtotal =
              this.vendorDetails[index]?.EvalCMTVndrtnclactualtotal;
          } else {
            element.PricePreference =
              this.vendorDetails[index].PricePreference.toString();
            element.Ranking =
              this.vendorDetails[index]?.Ranking !== undefined
                ? this.vendorDetails[index]?.Ranking.toString()
                : '0';
            element.VndrFinevalwgtge =
              this.vendorDetails[index]?.VndrFinevalwgtge;
            element.VndrTechevalwgtge =
              this.vendorDetails[index]?.VndrTechevalwgtge;
            element.EvalCMTVndrtnclactualtotal =
              this.vendorDetails[index]?.EvalCMTVndrtnclactualtotal;
          }
        }
      );
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
      if (element.IsVendorSelected == 'Y') {
        this.chkvesele = this.chkvesele + 1;
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
        if (parseInt(element.Price) >= 0 && element.IsVendorSelected == 'Y') {
          this.allowBidsQual = true;
        }
      }
    });

    if (this.chkvesele > 0 && this.allowBidsQual) {
      this.showConfirm(this.bidEvalData, value);
    } else if (this.chkvesele === 0) {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    } else if (!this.allowBidsQual) {
      this.cs.createMessage('error', this.translate.instant('COM.PriceError'));
    } else {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.SelectVendor')
      );
    }
  }

  /**
   * Shows the confirmation Model
   * @param data Payload data
   * @param action - UserActionCode - Enum
   */
  showConfirm(data: any, action: UserActionCode): void {
    const config = {
      titleText: this.cs.getConfimationModalTitle(action ?? null),
      bodyText: this.cs.getConfimationMessage(action ?? null),
    };

    if(this.MemFinal || this.showVendorSelectionToggleForTheBidsFromQualificationCmt|| this.IS_CEO_DIRECTOR_OR_VP || this.showVendorSelectionInVendorTable()){
      if(!this.hasOnlyOneSelected){
        this.cs.createMessage("error", `Only one vendor needs to be selected`)
        return
      }
    }

    const modalRef = this.modal.create({
      nzContent: ConfirmComponent,
      nzComponentParams: { config },
      nzWidth: 600,
      nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
      nzFooter: null,
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        if (this.actionCheckerForOTP(action)) {
          this.getOTP();
        } else {
          if (data) {
            this.postTender(data);
          }
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
    this.api
      .post('OCOM_CRT_UPD', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.d.MsgType === 'S') {
            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2
            );
            this.cs.activeMenu = `bidlist`;
            this.router.navigate(['/committee/BidList']);
          } else {
            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2
            );
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
      Id: this.CommitteeID ?? '',
      TndrId: this.bidEvalData.TndrID,
    };
    this.spinner.show();
    if (
      this.BidsapprovedRole ||
      this.ChairmanFinalQual == 'FinalQual' ||
      this.viewMode ||
      this.MemFinal
    ) {
      if (this.isTenderDP) {
        cmtid.Id = '04'; // * DP Committee Id
      }
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter(
        (el: any) => {
          if (el.CommitteeId === this.CommitteeID) {
            return el;
          }
        }
      );
      this.api
        .post('/F4_MEMBERS', cmtid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.spinner.hide();

            let membersList = res.d.results.filter((el: any) => {
              if (
                el.CommitteeRole !== 'CH' &&
                el.CommitteeRole !== 'OF' &&
                el.CommitteeRole !== 'RM' &&
                el.CommitteeRole !== 'MM' &&
                el.CommitteeRole !== 'TM'
              ) {
                return el;
              }
            });

            this.officerDetails = res.d.results.filter((el: any) => {
              if (el.CommitteeRole === 'OF') {
                return el;
              }
            });
            if (this.ReadOCOM_to_RqstMbrs.length === 0) {
              this.membersListData = this.transformMembers(membersList);
              console.log(this.membersListData, 'this.membersListData')
              this.to_RqstMbrs = this.membersListData.filter(
                (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
              );
            }else{
              console.log(this.ReadOCOM_to_RqstMbrs, 'this.ReadOCOM_to_RqstMbrs')
              this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs)
              this.to_RqstMbrs = this.membersListData.filter(
                (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
              );
              console.log(this.membersListData, 'this.membersListData')
            }
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
    } else if (
      this.role === 'CH' &&
      !this.BidsapprovedRole &&
      this.ChairmanFinalQual != 'FinalQual' &&
      !this.viewMode &&
      !this.MemFinal
    ) {
      this.spinner.show();
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter(
        (el: any) => {
          if (el.CommitteeId === this.CommitteeID && el.CommitteeRole != 'OF') {
            return el;
          }
        }
      );
      this.api
        .post('/F4_MEMBERS', cmtid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.spinner.hide();
            // let cmtHead = res.d.results.filter((el: any) => {
            //   if (el.CommitteeRole === this.role) {
            //     return el;
            //   }
            // });
            let memberList = res.d.results.filter((el: any) => {
              if (
                el.CommitteeRole !== 'CH' &&
                el.CommitteeRole !== 'OF' &&
                el.CommitteeRoleName !== 'Technical Member' &&
                el.CommitteeRole !== 'RM'
              ) {
                return el;
              }
            });
            this.officerDetails = res.d.results.filter((el: any) => {
              if (el.CommitteeRole === 'OF') {
                return el;
              }
            });
            if (this.ReadOCOM_to_RqstMbrs.length === 0) {
              this.membersListData = this.transformMembers(memberList);
              console.log(this.membersListData, 'this.membersListData')
              this.to_RqstMbrs = this.membersListData.filter(
                (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
              );
            }else{
              console.log(this.ReadOCOM_to_RqstMbrs, 'this.ReadOCOM_to_RqstMbrs')
              this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs)
              this.to_RqstMbrs = this.membersListData.filter(
                (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
              );
              console.log(this.membersListData, 'this.membersListData')
            }
            

            
            
           
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
    }

    //for officer role calling read OCOM service to bind committee member data
    else if (this.role === 'OF' || this.role === 'MR') {
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter(
        (el: any) => {
          if (el.CommitteeId === this.CommitteeID) {
            return el;
          }
        }
      );
      console.log('inside OF f4')
      if (!this.OFBidFinance) {
        this.spinner.show();
        this.api
          .post('/F4_MEMBERS', cmtid)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.spinner.hide();
              let memberList = res.d.results.filter((el: any) => {
                if (
                  el.CommitteeRole !== 'CH' &&
                  el.CommitteeRole !== 'OF' &&
                  el.CommitteeRole !== 'RM' &&
                  el.CommitteeRole !== 'MM' &&
                  el.CommitteeRole !== 'TM'
                ) {
                  return el;
                }
              });
              this.membersListData = this.transformMembers(memberList);
              console.log(this.membersListData, 'this.membersListData');

              this.officerDetails = res.d.results.filter((el: any) => {
                if (el.CommitteeRole === 'OF') {
                  return el;
                }
              });
              if (this.ReadOCOM_to_RqstMbrs.length === 0) {
                console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');
                this.to_RqstMbrs = this.membersListData.filter(
                  (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
                );
                console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');
              } else {
                this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs)
                console.log(this.membersListData)
                this.to_RqstMbrs = this.membersListData.filter(
                  (member: CommitteeMembers) => member.isChecked === true || member.isBackupChecked === true
                );
                console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');

              }
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs);
      }
    } else if (
      this.role === 'LM' ||
      this.role === 'MM' ||
      this.role === 'TM' ||
      this.role === 'FM' ||
      this.role === 'RM' ||
      this.role === 'PM'
    ) {
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter(
        (el: any) => {
          if (el.CommitteeId === this.CommitteeID) {
            return el;
          }
        }
      );
      if (!this.OFBidFinance) {
        this.spinner.show();
        this.api
          .post('/F4_MEMBERS', cmtid)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.spinner.hide();
              let memberList = res.d.results.filter((el: any) => {
                if (
                  el.CommitteeRole !== 'CH' &&
                  el.CommitteeRole !== 'OF' &&
                  el.CommitteeRole !== 'RM' &&
                  el.CommitteeRole !== 'MM' &&
                  el.CommitteeRole !== 'TM'
                ) {
                  return el;
                }
              });
              this.membersListData = this.transformMembers(memberList);
              console.log(this.membersListData, 'this.membersListData');

              this.officerDetails = res.d.results.filter((el: any) => {
                if (el.CommitteeRole === 'OF') {
                  return el;
                }
              });
              if (this.ReadOCOM_to_RqstMbrs.length === 0) {
                console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');
                this.to_RqstMbrs = this.membersListData.filter(
                  (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
                );
              } else {
                this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs)
                this.to_RqstMbrs = this.membersListData.filter(
                  (member: CommitteeMembers) => member.isChecked === true  || member.isBackupChecked === true
                );
                console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');

              }
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        this.membersListData = this.transformMembersFromTenderdetails(this.ReadOCOM_to_RqstMbrs)
      }
    }
    console.log(this.membersListData, 'this.membersListData');
  }

  setMembersList() {
    if (this.role === 'CH') {
      this.membersListData.forEach((member: any) => {
        member.SelectedMbr = 'M';
      });

      this.to_RqstMbrs = JSON.parse(JSON.stringify(this.membersListData));
    } else {
      this.ReadOCOM_to_RqstMbrs = this.bidEvalData.to_RqstMbrs.results.filter(
        (el: any) => {
          if (el.CommitteeId === this.CommitteeID) {
            return el;
          }
        }
      );
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

  openLegal(data: any, vname: any, i: any) {
    this.LegalCmt = '';
    this.VendName = vname.VendorName;
    this.selectedVendor = vname.VendorId;
    this.legalresult = vname.VndrLegalResult;
    this.reasonforDisqualification = vname.LglDisqltnReason;
    if (this.ShowLegal == true) {
      this.disLegalsub = false;
      this.removeLegal(0);
      if (data.length > 0) {
        this.addLegal();
        this.bidEvaluationCommitteeForm.controls['to_LeglEval'].patchValue(
          data
        );
        this.bidEvaluationCommitteeForm.controls[
          'to_LeglEval'
        ].updateValueAndValidity();
      } else {
        this.removeLegal(0);
        this.addLegal(
          vname.VendorId,
          vname.TenderId,
          this.userDetails.CommitteeId
        );
      }
    } else {
      this.disLegalsub = false;
      if (vname && vname.VndrLegalResult) {
        this.removeLegal(0);
        this.addLegal(
          vname.VendorId,
          vname.TenderId,
          this.userDetails.CommitteeId,
          this.bidEvalData.to_RqstVndrs.results[i].VndrLegalResult
        );
        this.ShowLegal = true;
      } else if (data && data.length == 0) {
        this.removeLegal(0);
        this.addLegal(
          vname.VendorId,
          vname.TenderId,
          this.userDetails.CommitteeId
        );
        this.ShowLegal = true;
      }
    }
  }

  /**
   * Submit Legal Evaluation
   *
   */
  addLegData() {
    // * Checking for the required fields value
    if (
      this.legalresult == 'Pass' ||
      (this.reasonforDisqualification != '' && this.legalresult == 'Fail')
    ) {
      if (this.bidEvalData) {
        const LegalResult =
          this.bidEvaluationCommitteeForm.getRawValue().to_LeglEval;

        this.bidEvalData.to_RqstVndrs.results.forEach((vendor: any) => {
          vendor.PricePreference = vendor.PricePreference.toString();
          vendor.Ranking = vendor.Ranking.toString();
          if (vendor.VendorId == LegalResult[0].VendorId) {
            vendor.VndrLegalResult = LegalResult[0].LegalResult;
            vendor.LglDisqltnReason = LegalResult[0].reasonfordisqualification;
          }
        });

        this.disLegalsub = false;
        this.ShowLegal = false;

        this.LegalCmt = '';

        // * Logged In User information
        this.bidEvalData.LgdInUsrAction = 'DFT';
        this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
        this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
        this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
        this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();

        this.bidEvalData.to_RqstVndrs.results.forEach((element: any) => {});

        this.spinner.show();
        this.api
          .post('OCOM_CRT_UPD', this.bidEvalData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.spinner.hide();
              if (res.d.MsgType === 'S') {
                this.legalresult = '';
                this.reasonforDisqualification = '';
                this.cs.createMessage(
                  'Success',
                  this.translate.instant('COM.Legal Evaluation Submitted')
                );
                this.getTenderDetails();
              } else {
                this.cs.createMessage('error', res.d.MessageEn);
              }
            },
            (error) => {
              this.spinner.hide();
              this.cs.createMessage('error', error.statusText);
            }
          );
      }
    } else {
      this.legalresult = '';
      this.reasonforDisqualification = '';
      this.cs.createMessage('error', this.translate.instant('RFP.FillMandate'));
    }
  }

  calculateTechEval(data: any) {
    let total = 0;
    data.forEach((d: any) => {
      total += parseInt(d.Actual);
    });
    return total;
  }

  highestTechvalScore: number = 0;
  calculateTotalTechEvalAgainstVendor() {
    const managerEvaluation = this.technicalEvaluationByMember.find(
      (evaluation: any) =>
        evaluation.userDetails.UserId === this.userDetails.LogdInUsrID
    );
    if (managerEvaluation) {
      let total = 0;
      this.technicalEvaluationByMember.forEach((evaluation: any) => {
        total += this.calculateTechEval(evaluation.to_TechEval);
      });
      this.vendorDetails[this.selectedVendorIndex].EvalCMTVndrtnclactualtotal =
        (total / this.technicalEvaluationByMember.length).toFixed(3).toString();
      if (
        this.highestTechvalScore <
        parseInt(
          this.vendorDetails[this.selectedVendorIndex]
            .EvalCMTVndrtnclactualtotal
        )
      ) {
        this.highestTechvalScore = parseInt(
          this.vendorDetails[this.selectedVendorIndex]
            .EvalCMTVndrtnclactualtotal
        );
      }
      this.isViewEvaluation = false;
    } else {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.Calculate Highest Error')
      );
    }
  }

  getUserDetails(userid: string) {
    return new Promise((resolve, reject) =>
      this.api
        .get(`get-user-details?userid=${userid}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            resolve(res.d.results[0]);
          },
          (err) => {
            console.log(err);
            reject(null);
          }
        )
    );
  }

  async showTechnicalEvaluation(data: any, vendorIndex: number) {
    this.getTechnicalCriteria(data.VedorId, true);
    this.selectedVendorDetails = data;
    this.technicalVendorDetails = data.to_VndrTec?.results;
    if (this.role !== 'RM') {
      this.technicalVendorDetails = [
        this.technicalVendorDetails.find(
          (techDetails: any) =>
            techDetails.CreatedBy === this.userDetails.LogdInUsrID
        ),
      ];
    }

    if (
      this.technicalVendorDetails.length > 1 ||
      this.technicalVendorDetails[0]
    ) {
      // Initialize as an array instead of an object
      this.technicalEvaluationByMember = [];

      // Initialize a map to group evaluations by 'CreatedBy'
      const techComments: any = {};
      const techReqEvalMap: any = {};
      const techEvalMap: any = {};

      console.log(this.technicalVendorDetails);
      this.technicalVendorDetails.forEach((details: any) => {
        techComments[details.CreatedBy] = {
          comment: details.TchnclMbrCmnt,
          score: details.VndrTnclEvalScore,
          value: details.EvalCMTVndrtnclactualtotal,
        };

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
      });

      // Combine both into the array format
      for (const createdBy in techReqEvalMap) {
        const userData = await this.getUserDetails(createdBy);
        this.technicalEvaluationByMember.push({
          userDetails: userData,
          vendorComment: techComments[createdBy],
          to_TechReqEval: techReqEvalMap[createdBy] || [],
          to_TechEval: techEvalMap[createdBy] || [],
        });
      }

      // If there are any entries in techEvalMap that are not in techReqEvalMap
      for (const createdBy in techEvalMap) {
        if (!techReqEvalMap[createdBy]) {
          const userData = await this.getUserDetails(createdBy);
          this.technicalEvaluationByMember.push({
            userDetails: userData,
            vendorComment: techComments[createdBy],
            to_TechReqEval: [],
            to_TechEval: techEvalMap[createdBy],
          });
        }
      }

      console.log(this.technicalEvaluationByMember);

      this.selectedVendorIndex = vendorIndex;
      // this.calculateTechnicalTotal(this.technicalVendorDetails?.to_TechEval?.results);
      this.formattedTechEval = this.formatTechEval(
        this.technicalEvaluationByMember[0].to_TechEval
      );
      this.isViewEvaluation = true;
    } else {
      this.cs.createMessage(
        'error',
        this.translate.instant('COM.Show Evaluation Error')
      );
    }
  }

  previousResult() {
    this.carousel.pre();
    this.formattedTechEval = this.formatTechEval(
      this.technicalEvaluationByMember[this.carousel.activeIndex].to_TechEval
    );
  }

  nextResult() {
    this.carousel.next();
    this.formattedTechEval = this.formatTechEval(
      this.technicalEvaluationByMember[this.carousel.activeIndex].to_TechEval
    );
  }

  // * Open Technical Evaluation - Edit and View handler method
  openTechnicalEvaluation(data: any, vendorIndex: any) {
    this.clearTechReqEval();
    this.clearTechEval();

    // * Get data values of Tendor details API
    const vendorEvalDetails = data?.to_VndrTec?.results.find(
      (vendor: any) => vendor.CreatedBy === this.userDetails.LogdInUsrID
    );
    const TechnicalRequirement = vendorEvalDetails?.to_TechReqEval?.results;
    const TechnicalEvaluation = vendorEvalDetails?.to_TechEval?.results;

    // * Post call constants
    const payload = { RfpNo: this.bidEvalData.RFPNumber };
    const TechRequirementList = this.api.post('GET_CMT_TECHREQ', payload);

    // * Adds Techinical Member comments for Selected Vendor
    this.TchnclMbrCmnt.setValue(vendorEvalDetails?.TchnclMbrCmnt ?? '');
    this.TchnclMbrCmnt.setValidators(Validators.required);
    console.log(this.TchnclMbrCmnt);

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
        if (data.EvalCMTVndrtnclactualtotal) {
          this.Techtotal = parseFloat(data.EvalCMTVndrtnclactualtotal);
        }
        this.TechCmt = '';
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
      this.api
        .get('F4_TechStatus')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (F4_TechStatusRes) => {
            this.F4_TechReqStatus = F4_TechStatusRes;
            if (showLoading) this.spinner.hide();
          },
          (error) => {
            if (showLoading) this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
    } else {
      if (showLoading) this.spinner.hide();
    }
  }

  // * Get Technical Criteria from RFP
  getTechnicalCriteria(
    vendorId: string,
    loadPassPercentage: boolean = false
  ): void {
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
          const criteriaList =
            F4_TechCritRes?.d?.results[0]?.to_RFPTechCrt?.results;
          this.createTechEval(criteriaList, vendorId);
        }
        this.cs.stopLoadingSection(SectionCode.GetTechnicalEvaluationCriteria);
      },
      (error) => {
        this.cs.stopLoadingSection(SectionCode.GetTechnicalEvaluationCriteria);
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  createLegalEval(
    VendorId?: any,
    TenderId?: any,
    CommitteeId?: any,
    LegalResult?: any,
    reasonfordisqualification?: any
  ): FormGroup {
    return this.fb.group({
      CommitteeId: [CommitteeId],
      TenderId: [TenderId],
      VendorId: [VendorId],
      LegalResult: [LegalResult ? LegalResult : 'Fail'],
      reasonfordisqualification: [reasonfordisqualification],
    });
  }

  // * Create Technical Evaluation Form Array
  createTechEval(
    TechnicalEvaluation: TechnicalEvaluation[],
    vendorId: string
  ): void {
    TechnicalEvaluation.forEach((evaluation) => {
      let actualValue = evaluation.Actual ?? 0;
      this.to_TechEval?.push(
        this.fb.group({
          TenderId: [this.bidEvalData.TndrID],
          CommitteeId: [this.bidEvalData.CommitteeID],
          VendorId: [vendorId],
          // CreatedBy: [this.userDetails.LogdInUsrID],
          EvltnTechCriteriaId: [
            evaluation.EvltnTechCriteriaId ??
              evaluation.EvltnTechCriteriaId_RFP ??
              '',
          ],
          Headline: [evaluation.Headline ?? ''],
          EvltnTechCriteriaDesc: [
            evaluation.EvltnTechCriteriaDesc ??
              evaluation.EvltnTechCriteriaDesc_RFP ??
              '',
          ],
          Subcriflg: [evaluation.Subcriflg ?? ''],
          Weightage: [evaluation.Weightage ?? ''],
          Actual: [
            {
              value: this.cs.truncate(actualValue, 2) ?? '',
              disabled: evaluation.Subcriflg == 'X' ? true : false,
            },
          ],
          to_tevalsub: this.fb.array(
            this.createSubCriteriaFormArray(
              evaluation.to_tevalsub
                ? evaluation.to_tevalsub.results
                : evaluation.to_tcritosubcri.results,
              vendorId
            )
          ),
        })
      );
    });
  }

  createSubCriteriaFormArray(to_tevalsub: Subcriteria[], vendorId: string) {
    return to_tevalsub.map((subCriteria) => {
      return this.createSubCriteriaGroup(subCriteria, vendorId);
    });
  }

  get to_tevalsub() {
    return this.subCriteriaForm?.controls['to_tevalsub'] as FormArray;
  }

  createSubCriteriaGroup(subCriteria: Subcriteria, vendorId?: string) {
    return this.fb.group({
      TenderId: [this.bidEvalData.TndrID],
      CommitteeId: [this.bidEvalData.CommitteeID],
      VendorId: [vendorId ?? ''],
      // CreatedBy: [this.userDetails.LogdInUsrID],
      EvltnTechCriteriaId: [
        subCriteria.ItemNo ?? subCriteria.EvltnTechCriteriaId ?? '',
      ],
      EvltnTechSubCriteriaId: [
        subCriteria.SubItemNo ?? subCriteria.EvltnTechSubCriteriaId ?? '',
      ],
      EvltnTechCriteriaDesc: [
        subCriteria.Descr ?? subCriteria.EvltnTechCriteriaDesc ?? '',
      ],
      Weightage: [subCriteria.Percentage ?? subCriteria.Weightage ?? ''],
      Actual: [subCriteria.Actual ?? '', Validators.required],
    });
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
    return this.to_TechEval
      .at(this.criteriaIndex)
      .get('to_tevalsub') as FormArray;
  }

  saveSubCriteria() {
    let score = 0;
    this.to_tevalsub.value.forEach((sub: Subcriteria, index: number) => {
      score += _l.isNumber(sub.Actual) ? sub.Actual : parseInt(sub.Actual);
      this.techEvalSub
        .at(index)
        .setValue({ ...sub, Actual: sub.Actual.toString() });
    });
    this.to_TechEval
      .at(this.criteriaIndex)
      .get('Actual')
      ?.setValue(score.toString());
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
          IscriteriaApplicable: [
            requirement.IscriteriaApplicable ?? '',
            Validators.required,
          ],
        })
      );
    });
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

    // if (this.Techtotal > 100) {
    //   this.cs.createMessage('error', this.translate.instant('COM.Actual Comment'));
    //   return;
    // }

    this.spinner.show();

    const TechnicalEvaluationData = this.cs.convertNumberToString(
      this.to_TechEval.getRawValue(),
      'Actual'
    );
    const TechnicalRequirementData = this.to_TechReqEval.getRawValue();

    // * If all the Technical Requirement is applicable - post the Technical Evaluation Criteria
    if (this.showTechEvalCrit) {
      if (TechnicalEvaluationData.length > 0) {
        this.bidEvalData.to_RqstVndrs.results.forEach(
          (element: any, index: any) => {
            if (element.VendorId == this.selectedVendor) {
              const vendorTechnicalEval = {
                TenderId: this.bidEvalData.TndrID,
                VendorId: element.VendorId,
                TchnclMbrCmnt: this.TchnclMbrCmnt.value,
                EvalCMTVndrtnclactualtotal: this.Techtotal.toString(),
                VndrTnclEvalScore:
                  parseFloat(this.techCrtPerct) < this.Techtotal
                    ? 'Pass'
                    : 'Fail',
                to_TechEval: {
                  results: TechnicalEvaluationData,
                },
                to_TechReqEval: {
                  results: TechnicalRequirementData,
                },
              };
              this.bidEvalData.to_RqstVndrs.results[
                index
              ].to_VndrTec.results.push(vendorTechnicalEval);
              // this.bidEvalData.to_RqstVndrs.results[index].to_TechEval = TechnicalEvaluationData;
              // this.bidEvalData.to_RqstVndrs.results[index].to_TechReqEval = TechnicalRequirementData;
              // this.bidEvalData.to_RqstVndrs.results[index].EvalCMTVndrtnclactualtotal = this.Techtotal.toString();
              // this.bidEvalData.to_RqstVndrs.results[index].TchnclMbrCmnt = this.TchnclMbrCmnt.value;
            }
          }
        );
      } else {
        this.cs.createMessage(
          'error',
          this.translate.instant('COM.NoCriteria')
        );
      }
    } else {
      // * If not all the Technical Requirement is applicable - post only Technical Requirement, Technical Evaluation not required...

      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          if (element.VendorId == this.selectedVendor) {
            const vendorTechnicalEval = {
              TenderId: this.bidEvalData.TndrID,
              VendorId: element.VendorId,
              TchnclMbrCmnt: this.TchnclMbrCmnt.value,
              EvalCMTVndrtnclactualtotal: this.Techtotal.toString(),
              VndrTnclEvalScore:
                parseFloat(this.techCrtPerct) < this.Techtotal
                  ? 'Pass'
                  : 'Fail',
              to_TechEval: {
                results: [],
              },
              to_TechReqEval: {
                results: TechnicalRequirementData,
              },
            };
            this.bidEvalData.to_RqstVndrs.results[
              index
            ].to_VndrTec.results.push(vendorTechnicalEval);
            // this.bidEvalData.to_RqstVndrs.results[index].to_TechEval.results = [];
            // this.bidEvalData.to_RqstVndrs.results[index].to_TechReqEval = TechnicalRequirementData;
            // this.bidEvalData.to_RqstVndrs.results[index].TchnclMbrCmnt = this.TchnclMbrCmnt.value;
          }
        }
      );
    }

    // * Post call - Technical Requirement and Technical Evaluation
    if (this.bidEvalData) {
      this.commonService.startLoadingSection(
        SectionCode.SubmitTechnicalEvaluation
      );

      this.bidEvalData.LgdInUsrAction = 'DFT';

      this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
      this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
      this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
      this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();

      // * Convert the Price preference and Ranking to "string" for payload
      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          element.PricePreference =
            this.vendorDetails[index]?.PricePreference !== undefined
              ? this.vendorDetails[index]?.PricePreference.toString()
              : '0';
          element.Ranking =
            this.vendorDetails[index]?.Ranking !== undefined
              ? this.vendorDetails[index]?.Ranking.toString()
              : '0';
        }
      );

      this.api
        .post('OCOM_CRT_UPD', this.bidEvalData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.commonService.stopLoadingSection(
              SectionCode.SubmitTechnicalEvaluation
            );
            this.spinner.hide();
            if (res.d.MsgType === 'S') {
              this.cs.createMessage(
                'Success',
                this.translate.instant('COM.TechEvalSub')
              );
              this.resetTechnicalEvaluation();
              this.getTenderDetails();
            } else {
              this.cs.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            this.commonService.stopLoadingSection(
              SectionCode.SubmitTechnicalEvaluation
            );
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
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
    this.TechCmt = '';
    // this.Techtotal = 0;
    //this.vendorDetails[this.selectedVendorIndex].EvalCMTVndrtnclactualtotal = 0;
    this.to_TechEval.clear();
    this.to_TechReqEval.clear();
  }

  // * Calculates Technical Evaluation Total value
  calculateTechnicalTotal(to_TechEval: any): void {
    let calculated: any;
    this.Techtotal = 0;
    to_TechEval.forEach((element: any) => {
      if (element.Actual) {
        calculated = parseFloat(element.Actual);
        calculated = this.cs.truncate(calculated, 2);
      } else {
        calculated = 0;
      }
      this.Techtotal += parseFloat(calculated);
      this.Techtotal = this.cs.truncate(this.Techtotal, 2);
    });

    if (this.ShowEval && this.techCrtPerct) {
      if (!this.showTechEvalCrit) {
        this.vendorDetails[this.selectedVendorIndex].VndrTnclEvalScore = 'Fail';
        this.vendorDetails[
          this.selectedVendorIndex
        ].EvalCMTVndrtnclactualtotal = this.Techtotal.toString();
      } else {
        if (this.Techtotal <= 100 && this.Techtotal >= this.techCrtPerct) {
          this.vendorDetails[this.selectedVendorIndex].VndrTnclEvalScore =
            'Pass';
        } else {
          this.vendorDetails[this.selectedVendorIndex].VndrTnclEvalScore =
            'Fail';
          this.vendorDetails[
            this.selectedVendorIndex
          ].EvalCMTVndrtnclactualtotal = this.Techtotal.toString();
        }
      }
    }

    if (
      this.vendorDetails[this.selectedVendorIndex].VndrTnclEvalScore == 'Fail'
    ) {
      this.Techtotal = 0;
      to_TechEval.forEach((element: any) => {
        if (element.Actual) {
          //element.Actual = 0;
          calculated = parseFloat(element.Actual).toFixed(2);
        } else {
          calculated = 0;
        }
        this.Techtotal += parseFloat(calculated);
        this.Techtotal = parseFloat(this.Techtotal.toFixed(2));
      });
    }
  }

  addComments(comment: any) {
    let Cmtdata = {
      CommitteeId: this.userDetails.CommitteeId,
      TenderId: this.bidEvalData.TndrID,
      VendorId: this.selectedVendor,
      CmntdMember: this.userDetails.LogdInUsrID,
      CmntdDate: '',
      Comments: comment,
      CommitteeRole: this.userDetails.ROLE,
    };

    if (Cmtdata) {
      this.spinner.show();
      // post comments api called for saved vendor
      this.api
        .post('POST_CMTS', Cmtdata)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            if (res) {
              this.spinner.hide();
              this.showlegalcomment = false;
              this.showtechcomment = false;
              this.TechCmt = '';
              this.LegalCmt = '';
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
    this.spinner.show();
    let dt = {
      TenderId: this.bidEvalData.TndrID,
      // "MemberId":this.userDetails.ID,
      VendorId: this.selectedVendor,
      //  "role":this.role,
    };
    this.api
      .post('/GET_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.commentsArray = res.d.results;
          this.commentsArray = this.commentsArray.filter(
            (obj: any, index: any) => {
              return (
                index ===
                this.commentsArray.findIndex(
                  (o: any) =>
                    obj.Comments === o.Comments &&
                    obj.CmntdMember === o.CmntdMember
                )
              );
            }
          );
          this.showComments = !this.showComments;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
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
    this.paramsForDocHandle.emit(docParamsFromType);
    return attachFG;
  }

  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //table
      displayMode: _l.get(_paramsForUpdate, 'editable', '') ? 'edit' : 'view',
      docParams: {
        HeaderKey: 'P2PCommitte',
        ItemKey: 'VendorEval',
        EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
        EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
        RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
        RelatedEntityId: this.selectedVendorGUID,
        DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
        DocName: '',
        FileNetId: '',
        Origin: 'P2P',
        UploadedBy: '',
        UploadedOn: '',
        MimeDocType: 'text/xml',
        Operation: _l.get(_paramsForUpdate, 'operation', ''),
        GuiId: '',
        ContentSize: 0,
      },
    };
    return docParams;
  }

  onFileUpload(_event: any, _doc: any) {
    console.log(_event, _doc, 'Attachment upload res')
    if (_event && (_event.hasOwnProperty('checkListID') || _event.hasOwnProperty('updateNameInTable'))) {
      console.log("checkListID found:", _event.checkListID);
  
      // Execute the function since checkListID exists
      let adjustCheckListID = Number(_event.checkListID - 1)
      setTimeout(() => {
        this.isAttachmentPresent(this.SelectedvendorId, String(adjustCheckListID));
      }, 5000); //
    } 

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
      operation: 'C',
    };
  }

  // * otp approval
  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        // this.showConfirm(this.bidEvalData)
      
        this.postTender(this.processedData);
      } else if (data !== this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  getOTP() {
    let data = {
      UserId: this.cs.getUserData().userid,
    };
    this.spinner.show();
    this.api
      .post('/OTP', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.d.results[0].MessageId === 'S') {
            this.commonService.otpToast(res.d.results[0]);
            this.otp = res.d.results[0].OtpNo;
            this.getOTPModel = !this.getOTPModel;
          } else if (
            res.d.results[0].MessageId === '' ||
            res.d.results[0].MessageId === 'E'
          ) {
            this.cs.createMessage(
              'error',
              this.cs.userLanguage === 'en'
                ? res.d.results[0].MessageEn
                : res.d.results[0].MessageAr
            );
          } else {
            this.cs.createMessage(
              'error',
              this.translate.instant('COM.OTPNotSent')
            );
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  updateOTP(value: any) {
    this.getOTPModel = value;

    if (value) {
      if (value === this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        this.showConfirm(this.bidEvalData, UserActionCode.submit);
      } else if (value !== this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  showBoq() {
    if (this.showBo) {
      this.showBo = false;
    } else {
      this.getBoq(this.bidEvalData.RFPNumber);
      this.showBo = true;
    }
  }
  getBoq(RfpNo: any) {
    this.QntySum = 0;
    this.spinner.show();
    let data = {
      RfpNo: RfpNo,
    };
    this.api
      .post('/F4_BOQ', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.boqArray = res.d.results[0].to_RFPBUDDts.results;
          this.rfpEstimationPrice = Number(res.d.results[0].EstPrice);
          this.rfpNo = res.d.results[0].RfpNo;
          this.estPriceWithoutVAT = Number(res.d.results[0].EstPriceWithoutVAT);
          const groupedByYear: { [year: string]: any[] } = {};

          this.boqArray.forEach((item: any) => {
            const year = item.BudYear;
            const quantity = +parseInt(item.Quantity);
            const price = +parseInt(item.UnitPrice);
            const total = quantity * price;
            if (!groupedByYear[year]) {
              groupedByYear[year] = [];
            }

            groupedByYear[year].push({
             Quantity: item.Quantity,
              Uom: item.Uom,
              UnitPrice: item.UnitProce,
              QntySum: total,
              ItemName: item.ItemName,
            });
          });

          this.groupedBoq = groupedByYear;
          this.spinner.hide();
        },
        (error) => {
          console.log(error)
          this.spinner.hide();
        }
      );
  }

  toDecimalPlaces(value: any): any {
    if (value) {
      return parseInt(value).toFixed(2);
    } else {
      return '';
    }
  }

  returnBid(value: UserActionCode) {
    if (value) {
      this.bidEvalData.LgdInUsrAction = value;
      this.bidEvalData.LgdInUsr = this.userDetails.LogdInUsrID;
      this.bidEvalData.LgdInUsrCmt = this.userDetails.CommitteeId;
      this.bidEvalData.LgdInUsrCmtRole = this.userDetails.ROLE;
      this.bidEvalData.to_Attach = this.combineOtherAttachmentsWithUpdated();
      this.bidEvalData.CommitteeAtchArea =
        this.bidEvaluationCommitteeForm.getRawValue().attachments;
      this.bidEvalData.to_RqstVndrs.results.forEach(
        (element: any, index: any) => {
          element.PricePreference = element.PricePreference.toString();
          element.Ranking =
            this.vendorDetails[index]?.Ranking !== undefined
              ? this.vendorDetails[index]?.Ranking.toString()
              : '0';
        }
      );
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
    this.api
      .post('uploadfile', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.messageId == 'S') {
            res.paths.forEach((file: any) => {
              this.uploadedfiles.push(file);
              this.attList?.push(this.createAttachs(file));
            });
            this.uploading = false;
            this.fileList = [];
            this.cs.createMessage(
              'success',
              this.translate.instant('RFP.UploadSuccess')
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.uploading = false;
          this.cs.createMessage(
            'error',
            this.translate.instant('RFP.UploadFailed')
          );
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
      ...list,
    ];

    return allAttachments;
  }

  filenetUpload(evt: any) {
    this.fileNetList.push({
      FilenetID:
        evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace(
          '{',
          ''
        ).replace('}', ''),
      FileName:
        evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: this.userDetails.CommitteeId,
      CommitteeRole: this.userDetails.ROLE,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalData.TndrID,
    });

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
    });

    this.fileNetList = [...this.fileNetList];
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter(
      (file: any) => evt.FilenetID !== file.FilenetID
    );
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter(
      (file: any) => evt.FilenetID !== file.FilenetID
    );
  }

  showHideCommentsclose() {
    this.showCommentsT = false;
  }
  showHideAddCommentsclose() {
    this.showAddCommentsT = false;
  }
  showHideAddCommentsT() {
    this.Tcmt = '';
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  addCommentsT(comments: any) {
    if (comments != '') {
      this.spinner.show();
      let cmtData = {
        CommitteeId: this.userDetails.CommitteeId,
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
        this.api
          .post('POST_CMTS', cmtData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
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
    } else {
      console.log('no comments', comments);
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
    this.api
      .post('/GET_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        //  console.log(res.d.results);
        this.commentsArray = res.d.results;
        // this.showComments = !this.showComments;
        this.spinner.hide();
      });
  }

  lowestPricebyVendors: number = 0;

  public filterVendors(vendors: any): any[] {
    if (this.CommitteeID === `02`) {
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

    function callDPFilter(
      that: BidEvaluationCommitteeComponent,
      vendors: any,
      isSpecialScenario: boolean
    ) {
      let filterArray = [{ key: 'IsVendorSelected', value: 'Y' }];

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
      (this.userDetails.ROLE === 'CH' ||
        this.userDetails.ROLE === 'OF' ||
        this.userDetails.ROLE === 'LM')
    ) {
      return false;
    }
    return true;
  }
  get isReturnFromProcurementMember(): boolean {
    if (
      this.role === 'LM' &&
      this.bidEvalData?.TndrTypeID === '01' &&
      this.bidEvalData?.LglFullAccess === 'X'
    ) {
      return true;
    }
    return false;
  }
  get isOneEnvelope(): boolean {
    return this.bidEvalData?.TndrTypeID === '01';
  }
  get isFinancialOffer(): boolean {
    return this.bidEvalData.FinancialOffer === 'X';
  }
  get isFinanceMemberCrossed(): boolean {
    // * One Envelope conditons
    if (this.isOneEnvelope) {
      if (
        this.role === 'FM' ||
        this.role === 'MM' ||
        this.role === 'LM' ||
        (this.role === 'PM' && this.OptionSelected === 'BidFromFinance') ||
        (this.role === 'CH' && this.initialTenderDetails.WFCmtMnuAction !== 'BOPN') ||
        this.MemFinal || 
        this.showVendorTableColForBidFromQual() || this.CommitteeID === '04'
      ) {
      
      return true;
    }
  }
  // * Two Envelope conditions
  if (
    (this.bidEvalData.FinancialOffer == 'X' &&
      (this.role === 'FM' || this.role === 'LM' ||
        ((this.role === 'OF' || this.role === 'CH') &&
        this.OptionSelected === 'BidFinance') ||
        (this.role === 'PM' && this.OptionSelected === 'BidFromFinance') ||
        this.OptionSelected === 'BidAppr' ||
        this.OptionSelected === 'QualCom')) ||
        this.MemFinal
      ) {
        return true;
      }
      
      
    return false;
  }

  get IS_CEO_DIRECTOR_OR_VP(): boolean {
    return (
      this.role === COMMITTEE_ROLE.CEO ||
      this.role === COMMITTEE_ROLE.DIRECTOR ||
      this.role === COMMITTEE_ROLE.VICE_PRESIDENT
    );
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
    const finalOfferPrice = parseFloat(
      this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value
    );
    return finalOfferPrice > parseFloat(this.bidEvalData.EstPrice);
  }

  get isBoardMember(): boolean {
    return this.role === 'VP' || this.role === 'SS' || this.role === 'CO';
  }

  /**
   * Returns the display valud of Technical Evaluation score based on the conditions.
   * @param vendorId Vendor Id
   * @param vendorTechnicalScore Vendor Technical Score
   * @param vendorTechnicalCalculateTotal Vendor Technical Calculated Total
   * @returns The display value of Technical Evaluation Score
   */
  getTechnicalScore(
    vendorId: string,
    vendorTechnicalScore: string | number,
    vendorTechnicalCalculateTotal: string | number
  ): string {
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
   * Returns the Technical Evlaution Score
   * @param vendorId Vendor Id
   * @param vendorTechnicalScore Vendor Technical Evaluation Score
   * @returns Returns `Pass` or `Fail`
   */
  getTechnicalResult(
    vendorId: string,
    vendorTechnicalScore: string,
    vendorTechnicalResult?: string
  ): string {
    if (this.ShowEval && this.selectedVendor === vendorId) {
      if (this.Techtotal < this.techCrtPerct || !this.showTechEvalCrit) {
        return this.cs.returnResultStat('Fail');
      } else {
        return this.cs.returnResultStat('Pass');
      }
    } else {
      if (vendorTechnicalScore) {
        return this.cs.returnResultStat(vendorTechnicalScore);
      } else {
        return this.cs.returnResultStat(vendorTechnicalResult ?? '');
      }
    }
  }

  /**
   * Returns True if the Vendor is selected based on the conditions
   * @param vendorLegalResult Legal result of the Vendor
   * @param VndrTnclEvalScore Technical result of the Vendor
   * @param isVendorSelected IsVendorSelected property value of Vendor
   * @returns True | False
   */
  getIsVendorSelected(
    vendorId: string,
    vendorLegalResult: string,
    VndrTnclEvalScore: string,
    isVendorSelected: string,
    vendorTotalWeightage: string
  ): boolean {
    
    const _isVendorSelected = isVendorSelected === 'Y';

    if((this.initialTenderDetails.WFCmtMnuAction === 'BFQC' || 
      this.initialTenderDetails.WFCmtMnuAction === 'BPFC' || 
      this.initialTenderDetails.WFCmtMnuAction === 'BFAP') && this.role === 'CH'){
      if(_isVendorSelected){
        return true
      }
      else{
        return false
      }
    }
    else{
      if (this.role === 'CH' &&  (this.CommitteeID === '04' || vendorLegalResult === 'Pass') &&
      VndrTnclEvalScore == 'Pass' ) {
      
        const vendorIndex = this.bidEvalData.to_RqstVndrs.results.findIndex(
          (vendor: any) => vendor.VendorId === vendorId
        );
      
       let totalWeightageOfAllVendorsFilter:totalWeightageCheck[]  =  this.totalWeightageOfAllVendors.filter((item)=> 
        (this.CommitteeID === '04' || item.LeagalSocre === 'Pass') 
       && item.isVendorpassed === true)

       const highestWeightageVendor:totalWeightageCheck  = totalWeightageOfAllVendorsFilter.reduce((max, current) =>
        current.totalWeightage > max.totalWeightage ? current : max
       
      );
      console.log(highestWeightageVendor.totalWeightage, vendorTotalWeightage)

      if(highestWeightageVendor.totalWeightage === Number(vendorTotalWeightage)){
        this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected = 'Y';
        console.log(this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected, 'inside ')
        this.getIsAllvendorSelected()

        
        return true
      }
      else{
        const vendorIndex = this.bidEvalData.to_RqstVndrs.results.findIndex(
          (vendor: any) => vendor.VendorId === vendorId
        );
        
        
        this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected =
        'N';
        console.log(this.bidEvalData.to_RqstVndrs.results[vendorIndex].IsVendorSelected, 'outside')
        this.getIsAllvendorSelected()
        return false;
      }
    }
    }

    this.getIsAllvendorSelected()


    return false;
  }

  /**
   * Return True if the Venor Selected have to disable
   * @param vendorLegalResult Legal Result
   * @param vendorTechnicalResult Technical Result
   * @returns `True` | `False`
   */
  getIsVendorSelectedDisabled(
    vendorLegalResult?: string,
    vendorTechnicalResult?: string
  ): boolean {
    console.log('getIsVendorSelectedDisabled')
    if (this.initialTenderDetails.WFCmtMnuAction === 'BPFC') {
      let vendorQualified = false;
      this.vendorDetails.forEach((vendor: any) => {
        if (
          vendor.IsVndrtechQualified === 'X' &&
          vendor.IsVndrfnclQualified === 'X'
        ) {
          console.log(vendor.IsVndrtechQualified, vendor.IsVndrfnclQualified)
          vendorQualified = true;
        }
      });
      if (vendorQualified) {
        return true;
      }
    }
    if (
      this.MemFinal ||
      this.IS_CEO_DIRECTOR_OR_VP ||
      vendorLegalResult === 'Fail' ||
      vendorTechnicalResult === 'Fail'
    ) {
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
    this.bidEvaluationCommitteeForm
      .get('finalOfferPrice')
      ?.setValue(
        this.truncate(
          this.bidEvaluationCommitteeForm.get('finalOfferPrice')?.value
        )
      );
  }

  onKeyChange(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    } else if (event.key === `Enter`) {
      return false;
    }
    this.getPriceRanking();
    return true;
  }

  /**
   * Event Listener method for Price Preference changes
   * @param event Emitted Event
   * @param data Updated Venodor details
   */
  onPricePreferenceValueChanged(event: any, data: any) {
    if (
      event &&
      event.target &&
      event.target.value &&
      data &&
      this.vendorDetails
    ) {
      const index = this.vendorDetails.findIndex((x: any) => x == data);
      this.vendorDetails[index].PricePreference = Number(event.target.value);
      this.getPriceRanking();
    }
  }

  /**
   * Calculate and return Ranking for Vendors
   * @param vendorId - Optional - Vendor Id
   * @returns Ranking of the Vendor
   */
  getPriceRanking(vendorId?: string) {
    let sortedVendorId: number[] = [];

    for (let i = 0; i < this.vendorDetails.length; i++) {
      let minValue = Infinity;
      let minVendorIndex = 0;
      this.vendorDetails.forEach((vendor: any, index: number) => {
        if (!sortedVendorId.includes(index)) {
          if (
            vendor.VndrLegalResult !== 'Fail' &&
            this.getTechnicalResult(
              vendor.VendorId,
              vendor.VndrTnclEvalScore
            ) !== 'Fail'
          ) {
            if (vendor.PricePreference && vendor.PricePreference > 0) {
              if (minValue > Number(vendor.PricePreference)) {
                minValue = Number(vendor.PricePreference);
                minVendorIndex = index;
              }
            } else {
              if (minValue > Number(vendor.Price)) {
                minValue = Number(vendor.Price);
                minVendorIndex = index;
              }
            }

            this.vendorDetails[minVendorIndex].Ranking = (i + 1).toString();
          }
        }
      });

      sortedVendorId.push(minVendorIndex);
    }

    if (vendorId) {
      const index = this.vendorDetails.findIndex(
        (vendor: any) => vendor.VendorId == vendorId
      );
      if (
        this.vendorDetails[index].VndrLegalResult === 'Fail' ||
        this.getTechnicalResult(
          this.vendorDetails[index].VendorId,
          this.vendorDetails[index].VndrTnclEvalScore
        ) === 'Fail'
      ) {
        return '';
      }
      return this.vendorDetails[index].Ranking;
    }
  }

  /*
  public isSelectedVendorQualified(): boolean {
    let selectedVendorCount = 0;

  //   this.bidEvalData.to_RqstVndrs.results.forEach((vendor: any) => {
  //     if (vendor.IsVendorSelected === `Y`) {
  //       selectedVendorCount++;
  //     }
  //   });

    switch (selectedVendorCount) {
      case 0:
        this.cs.createMessage('error', this.translate.instant(`COM.SelectOneVendor`));
        return false;
      case 1:
        const selectedVendor = this.bidEvalData.to_RqstVndrs.results.find((vendor: any) => vendor.IsVendorSelected === `Y`);
        if (selectedVendor && (selectedVendor.IsVndrfnclQualified === `X` && selectedVendor.IsVndrtechQualified === `X`)) {
          return true;
        } else {
          this.cs.createMessage('error', this.translate.instant(`COM.SelectedVendorNotQualified`));
          return false;
        }
      default:
        this.cs.createMessage('error', this.translate.instant(`COM.SelectVendor`));
        return false;
    }
  } */

  formattedTechEval: any = [];
  formatTechEval(data: any) {
    const formatedData = data.map((value: any) => {
      return { ...value, expand: false };
    });
    return formatedData;
  }


  get isSMEPresent(): boolean{
    return this.vendorDetails.filter((vendor:any)=> vendor.IsSME === 'X').length
  }

  calculateFinancialWeightage() {
    if( this.CommitteeID === '04'
    ) {
      for (const vendor of this.bidEvalData.to_RqstVndrs?.results || []) {
        if (vendor.VndrTnclEvalScore === 'Pass' && vendor.Price === '0.00') {
          this.cs.createMessage(
            'error',
            `${this.translate.instant('COM.pleaseFillTheVendorPrice')} ${vendor.VendorName}`
  
          );
          return; // Exit the method as soon as the condition is met
        }
      }
    }



    this.lowestPricebyVendors = parseInt(
      this.vendorDetails.reduce((lowest: number, vendor: any) => {
        if (vendor.VndrTnclEvalScore === 'Pass' ) {
          if(this.isSMEPresent){
            if(vendor.IsSME === 'X' && vendor.Price !== undefined){
              return lowest < parseInt(vendor.Price) ? lowest
              : parseInt(vendor.Price);
            } else if (vendor.IsSME !== 'X' && vendor.PricePreference !== undefined) {
              return lowest < parseInt(vendor.PricePreference) ? lowest
              : parseInt(vendor.PricePreference);
            }
          }
          return lowest < parseInt(vendor.Price)
            ? lowest
            : parseInt(vendor.Price);
        }
        return lowest;
      }) || 0
    );



    this.bidEvalData.to_RqstVndrs?.results.forEach((vendor: any, index: number) => {
      if (vendor.VndrTnclEvalScore === 'Fail') {
        vendor.VndrFinevalwgtge = '0.00';
      }
       if (vendor.VndrTnclEvalScore === 'Pass') {
        if(this.isSMEPresent){
          if(vendor.IsSME === 'X'){
            vendor.VndrFinevalwgtge = (
              (this.lowestPricebyVendors / parseInt(vendor.Price)) *
              this.financialWeightage
            ).toFixed(3).toString();
          } else if (vendor.IsSME !== 'X') {
            vendor.VndrFinevalwgtge = (
              (this.lowestPricebyVendors / parseInt(vendor.PricePreference)) *
              this.financialWeightage
            ).toFixed(3).toString();
          }
        }else{
          vendor.VndrFinevalwgtge = (
            (this.lowestPricebyVendors / parseInt(vendor.Price)) *
            this.financialWeightage
          ).toFixed(3).toString();
        }
         this.financialWeightageOfAllVendor = 
         this.updateIsCalculated(this.vendorDetails[index].VendorId, this.financialWeightageOfAllVendor )
       }
    })
    this.ifFinancialweightageCalculatedForAllVendors = this.financialWeightageOfAllVendor.some(item => item.isCalculated);




    // this.checkisFinancialWeightagecalculated()
  }
  checkisFinancialWeightagecalculated(){
    this.vendorDetails.forEach((item: any, index:number)=>{
      if(item.VndrFinevalwgtge === '0.00'){
        this.financialWeightageOfAllVendor.push({
          vendorname:this.vendorDetails[index].VendorId,
          isCalculated: false,
          isVendorpassed: this.vendorDetails.VndrTnclEvalScore === "Pass" ? true : false
        })
      }else{
        this.financialWeightageOfAllVendor.push({
          vendorname:this.vendorDetails.VendorId,
          isCalculated: true,
          isVendorpassed: this.vendorDetails.VndrTnclEvalScore === "Pass" ? true : false
        })
      }
    })
    this.ifFinancialweightageCalculatedForAllVendors = this.financialWeightageOfAllVendor.every(item => item.isCalculated);

    console.log(this.financialWeightageOfAllVendor)
  }

   updateIsCalculated(
    vendornameToFind: string,
    financialData: FinancialWeightageCheck[]
  ): FinancialWeightageCheck[] {
    const vendor = financialData.find(
      (vendor) => vendor.vendorname === vendornameToFind
    );
  
    if (vendor) {
      vendor.isCalculated = true; 
    }
  
    return financialData; 
  }

  getLegalScoreForAllVendors(){
    this.leagalScoreOfAllVendors = [];

    this.vendorDetails.forEach((item: any, index:number)=>{
      this.leagalScoreOfAllVendors.push({
        vendorname:this.vendorDetails[index].VendorId,
          LeagalSocre: this.vendorDetails[index].VndrLegalResult,
          isVendorpassed: this.vendorDetails.VndrTnclEvalScore === "Pass" ? true : false
      })
    })

    this.isLeagelScoreForAllVendorePresent = this.leagalScoreOfAllVendors.some(vendor=> vendor.LeagalSocre === 'Pass' || vendor.LeagalSocre === 'Fail')
    console.log(this.leagalScoreOfAllVendors,this.isLeagelScoreForAllVendorePresent )
  }

  getTotalWeightageOfAllVendors() {
    this.totalWeightageOfAllVendors = []
    this.vendorDetails.forEach((item: any, index: number) => {
      this.totalWeightageOfAllVendors.push({
        vendorname: item.VendorId,
        LeagalSocre: item.VndrLegalResult,
        isVendorpassed: item.VndrTnclEvalScore === "Pass" ? true : false,
        totalWeightage: Number(this.getTotalWeightage(item.VndrTechevalwgtge, item.VndrFinevalwgtge)) // Corrected closing parenthesis here
      });
    });

  }
  getIsAllvendorSelected(){
    let vendorSelectionList: string[] = []
    this.bidEvalData.to_RqstVndrs.results.forEach((vendor:any)=>{
      console.log(vendor.IsVendorSelected)
      vendorSelectionList.push(vendor.IsVendorSelected)
    })
    if(this.initialTenderDetails.WFCmtMnuAction === 'BAPR' || this.initialTenderDetails.WFCmtMnuAction === 'BPFC' || this.initialTenderDetails.WFCmtMnuAction === 'BFAP' ){

      this.isatleastOneVendorSelected = vendorSelectionList.some(vendor => vendor ==='Y')
      this.hasOnlyOneSelected = vendorSelectionList.filter(v => v === 'Y').length === 1;
    }else{
      this.isatleastOneVendorSelected = true
    }
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
  };
  parserPercent = (value: string): string => value.replace('%', '');

  canShowSME(): boolean {
    return this.sharedCommonService.isSMEApplicable(this.bidEvalData.EstPrice);
  }

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    // Store the provided action buttons list
    this.actionButtons = actionButtonsList;

    // Define action mapping (with more flexible keys using Partial)
    const actionMap: Partial<Record<string, any>> = {
      // todo: need to add other actions into the useraction enum

      // Secretary Actions
      BOPN_OF_SUB: this.assignMember.bind(this, UserActionCode.submit),
      BFTC_OF_SUB: this.assignMember.bind(this, UserActionCode.submit),
      BEMR_OF_SUB: this.assignMember.bind(this, UserActionCode.submit),
      BFQC_OF_STC: this.assignMember.bind(this, UserActionCode.submitToChairman),
      BFQC_OF_ABM: this.assignMember.bind(this, UserActionCode.asignBacktoMember),
      BEMR_OF_DFT: this.assignMember.bind(this, UserActionCode.draft),
      BOFR_OF_STC: this.assignMember.bind(this, UserActionCode.submitToChairman),

      // chairman
      BOPN_CH_RTS: this.returnBid.bind(this, UserActionCode.returnToSecretary),
      BOPN_CH_ABT: this.assignOfficer.bind(this, UserActionCode.assignToTechCommittee),
      BOFR_CH_AFM: this.assignOfficer.bind(this, UserActionCode.assignFinancemember),
      BOFR_CH_RTS: this.assignOfficer.bind(this, UserActionCode.returnToSecretary),
      BFTC_CH_AFM: this.assignOfficer.bind(this, UserActionCode.assignFinancemember),
      BFTC_CH_ABO: this.assignOfficer.bind(this, UserActionCode.assignToBidOpening),
      BAPR_CH_SFC: this.assignOfficer.bind(this, UserActionCode.approveForExternal),
      BPFC_CH_ABQ: this.assignOfficer.bind(this, UserActionCode.assignToBidQualificaiton),
      BFAP_CH_APR: this.assignOfficer.bind(this, UserActionCode.approve),
      BFAP_CH_SUB: this.assignOfficer.bind(this, UserActionCode.submit),
      BFQC_CH_SUB: this.assignOfficer.bind(this, UserActionCode.submit),
      BEMR_CH_ASG: this.assignOfficer.bind(this, UserActionCode.assign),
      BAPR_CH_SUB: this.assignOfficer.bind(this, UserActionCode.submit),
      BAPR_CH_ABQ: this.assignOfficer.bind(this, UserActionCode.assignToBidQualificaiton),
      BAPR_CH_CTR: this.assignOfficer.bind(this, UserActionCode.cancelTender),

      // finance member
      BEMR_FM_SPM: this.assignOfficer.bind(this, UserActionCode.submitToProcurementMember),

      // procurment member
      BEFM_PM_SLM: this.assignOfficer.bind(this, UserActionCode.submitToLegalMember),
      BEFM_PM_RFM: this.returnBid.bind(this, UserActionCode.returnToFinance),

      // legal member
      BEMR_LM_STC: this.assignOfficer.bind(this, UserActionCode.submitToChairman),
      BEMR_LM_RFM: this.returnBid.bind(this, UserActionCode.returnToFinance),

      //meaw member
      BEMR_MM_SUB: this.assignOfficer.bind(this, UserActionCode.submit),
      BEMR_MM_RFM: this.returnBid.bind(this, UserActionCode.returnToFinance),

      // Committee Members
      BEMR_MR_RET: this.returnBid.bind(this, UserActionCode.return),
      BEMR_MR_SUB: this.assignOfficer.bind(this, UserActionCode.submit)

    };

    // Iterate over the action buttons
    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID } = button;

      // Construct the key dynamically
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;

      // Check if the action exists in the actionMap and assign it if it does
      if (button.OTP_Required === 'X') {
        this.buttonActionKeysthatRequiresOTP.push(actionKey);
      }
      console.log(actionKey)
      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
        if (this.buttonValidationsBasedOnButtonID(Button_ID)
        ) {
          button.validation = ()=> this.evalCmtFooterActionBtnValidation()
        }else{
          button.validation = () => false
        }
      }
    });
  }

  buttonValidationsBasedOnButtonID(buttonID: string): boolean {
    //* removing validation for these btn ids
    const disallowedIDs = ['RET', 'RFM', 'RTS', 'DFT', 'CTR'];
    const isDisallowedCombinationForCancelTenderFM =
        this.bidEvalData.MomType === 'CANCEL_TEN' && buttonID === 'SPM';
    const isDisallowedCombinationForCancelTenderLM = this.bidEvalData.MomType === 'CANCEL_TEN' && buttonID === 'STC';
    return !disallowedIDs.includes(buttonID) && !isDisallowedCombinationForCancelTenderFM && !isDisallowedCombinationForCancelTenderLM;
}

  evalCmtFooterActionBtnValidation(): boolean {
    switch(this.role){
      case 'FM':
        return !this.ifFinancialweightageCalculatedForAllVendors
      case 'OF':
        return this.CommitteeID === '04' ? !this.ifFinancialweightageCalculatedForAllVendors : false
      case 'LM':
        return !this.isLeagelScoreForAllVendorePresent
      case 'CH':
        return !this.isatleastOneVendorSelected
      default:
        return false
    }
  }
  actionCheckerForOTP(actionKey: UserActionCode): boolean {
    const button = this.actionButtons.find(
      (button) => button.Button_ID === actionKey
    );
    if (button) {
      const { CmtMenu, CmtRole, Button_ID } = button;
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;
      return this.buttonActionKeysthatRequiresOTP.includes(actionKey);
    } else {
      return false;
    }
  }

  transformMembers(
    listOfMembers: CommitteeMembersFromAPI[]
  ): CommitteeMembers[] {
    return listOfMembers.map((member) => ({
      CommitteeBckupUser: member.CommitteeBkpUserID || '',
      CommitteeBkpUserName: member.CommitteeBkpUserName || '',
      CommitteeBkpUserName_AR: member.CommitteeBkpUserName_AR || '',
      CommitteeId: member.CommitteeId || '',
      CommitteeRole: member.CommitteeRole || '',
      CommitteeRoleName: member.CommitteeRoleName || '',
      CommitteeUser: member.CommitteeUserID || '',
      CommitteeUserName: member.CommitteeUserName || '',
      CommitteeUserName_AR: member.CommitteeUserName_AR || '',
      Identifier: '', 
      Inactive: false, 
      SelectedMbr:
        member.IsBackup === '' ? 'M' : member.IsBackup === 'X' ? 'B' : '', 
      TenderId: member.TenderId || '',
      isChecked: member.IsMemberSelected === 'X' ? true : false,
      isBackupChecked: member.IsBackup === 'X' ? true : false,
    }));
  }

  transformMembersFromTenderdetails(listOfMembers: CommitteeMembers[]): CommitteeMembers[]{
    return listOfMembers.map((member) => ({
      ...member,
      isChecked: member.SelectedMbr === 'M' ? true : false,
      isBackupChecked: member.SelectedMbr === 'B' ? true : false,
    }));
  }
  prepareCommitteeMembersDataForPost(
    members: CommitteeMembers[]
  ): Omit<CommitteeMembers, 'isChecked' | 'isBackupChecked'>[] {
    return members.map(({ isChecked, isBackupChecked, ...rest }) => rest);
  }

  disableVendorSelection(index: number): boolean{
    const validActions = ["BPFC", "BFAP", "BFQC"];
    if (this.role === 'CH' && validActions.includes(this.initialTenderDetails.WFCmtMnuAction)) {
      return true
    }
    if(this.vendorDetails){
      let vendorlegalResut = ((this.CommitteeID !== '04' && this.vendorDetails[index].VndrLegalResult === 'Fail') || this.vendorDetails[index].VndrTnclEvalScore === 'Fail' ) ? true : false
      return vendorlegalResut
    }
    return false
  }
  getTotalWeightage(techeval: string, fineval: string): string {
    const techEvalWeight = parseFloat(techeval) || 0;
    const fineEvalWeight = parseFloat(fineval) || 0;
    const total = techEvalWeight + fineEvalWeight;
  
    // Return '-' if total is 0, otherwise format to two decimal places
    return total === 0 ? '-' : total.toFixed(2);
  }

  showTechEvalScoreToEditInVendorTable():boolean{
   return ((this.role === 'OF' && 
    this.initialTenderDetails.WFCmtMnuAction === 'BFTC') || 
    (this.role === 'CH' && this.initialTenderDetails.WFCmtMnuAction === 'BFTC') )
  }

  get canChangeTechResult(): boolean {
    return this.CommitteeID === '04' && this.role === 'OF' && this.initialTenderDetails.WFCmtMnuAction === 'BEMR'
  }

  get canViewTechResult(): boolean {
    return this.CommitteeID === '04';
  }

  hideVendorcolumnsBFTC():boolean{
    return this.role === 'CH' && this.initialTenderDetails.WFCmtMnuAction === 'BFTC'
    
  }
  showVendorSelectionInVendorTable(): boolean{
    return this.role === 'CH' && (this.initialTenderDetails.WFCmtMnuAction === 'BAPR' || this.initialTenderDetails.WFCmtMnuAction === 'BPFC')

  }
  getTechEvalResult(score: any) {
    
    this.techEvalScore = this.cs.getTechScoreResult(score);
    return this.cs.getTechScoreResult(score)
}


editTechEvalScore(index: number){
  this.bidEvalData.to_RqstVndrs.results[index].VndrTnclEvalScore = this.techEvalScoreArray[index]
  this.ifFinancialweightageCalculatedForAllVendors = false;
}

editIsCriteriaApplicable(index: number) {
  this.bidEvalData.to_RqstVndrs.results[index].IsCriteriaApplicable = this.isCriteriaApplicableArray[index];
}

isFinancialWeightageCalcualtedForAllVendors(): boolean{
  return false
}


showVendorTableColForBidFromQual(): boolean{
  return this.role === 'OF' && this.initialTenderDetails.WFCmtMnuAction === 'BFQC'
}

isBOQVisibleForRole(){
  return this.role === 'CH' && (this.initialTenderDetails.WFCmtMnuAction === 'BAPR' || this.initialTenderDetails.WFCmtMnuAction === 'BPFC' || this.initialTenderDetails.WFCmtMnuAction === 'BFAP'  )
}

getInvaildFormControls(){
  
  let invalid: string[] = []
  const controls = this.bidEvaluationCommitteeForm.controls;
  console.log(this.bidEvaluationCommitteeForm.get('momType'))

  // * This is to check if there is at least one checklist attachment
  if(this.bidEvaluationCommitteeForm.get('momtype')?.invalid ){
    invalid.push('momtype');
  }
  let invaildVendorIndex: number[] =[]
  this.techEvalScoreArray.forEach((score:string, index:number)=>{
    if(score === 'Fail'){
      invaildVendorIndex.push(index)
    }
  }) 

  console.log(invaildVendorIndex, 'invaildVendorIndex')
    
  console.log(this.vendorDetails)
  this.vendorDetails.forEach((data: any, index: number) => {
  
    console.log("Processing vendor index:", index);
    console.log(this.bidEvalData, 'this.bidEvalData')
    console.log("ChecklistCheckerArray:", this.checklistCheckerArray);
  
    const vendorKey = Object.keys(this.checklistCheckerArray)[index];
    console.log("Vendor key:", vendorKey);
  
    let checkListCheckerItem = this.checklistCheckerArray[vendorKey];
    console.log("ChecklistCheckerItem:", checkListCheckerItem);

    
    
    if(this.showVendorDetail){
      if(this.vendorFormGroup.get('Price')!.value === '' || Number(this.vendorFormGroup.get('Price')!.value) <= 0){
        invalid.push('price');
      }
    }
    
    for (let i = 0; i < data?.to_VndrChkLst.results.length; i++) {
      console.log(`Checking vendor checklist item at index ${i} for vendor ${index}`);
      console.log("Checklist item details:", data.to_VndrChkLst.results[i]);
      if(invaildVendorIndex.includes(index)){
        console.log('invalid vendor index', index)
        continue
      }
      if (data?.to_VndrChkLst.results[i].IsAttachmentValid === 'N' && checkListCheckerItem[i][`checklist${i + 1}`] === false) {
        console.log("Invalid attachment detected.");
        // if (!this.invalidChecklist.includes(index + 1)) {
          this.invalidCheckListVendorName = this.vendorDetails[index].VendorName;
          console.log(this.invalidCheckListVendorName, 'this.invalidCheckListVendorName')
          invalid.push('checkListAttachment');

        // this.invalidChecklist.push(index + 1);
        }
      // }
    }
  
    if (this.bidEvalData.TndrTypeID === '01') {
      console.log("Tender type is '01'");
  
      for (let i = 0; i < data?.to_VndrChkLst.results.length; i++) {
        console.log("Checking ChecklistId for type '04':", data?.to_VndrChkLst.results[i]?.ChecklistId);
  
        if (data?.to_VndrChkLst.results[i]?.ChecklistId === '001' || data?.to_VndrChkLst.results[i]?.ChecklistId === '002') {
          if (data?.to_VndrChkLst.results[i].IsAttachmentValid === 'Y') {
            console.log("Invalid attachment found for type '01'.");
            // if (!this.invalidChecklist.includes(index + 1)) {
              invalid.push('checkListAttachment');

    
            this.invalidChecklist.push(index + 1);
            }
            break;
          // }
        }
      }
    } else if (this.bidEvalData.TndrTypeID === '02' && this.bidEvalData.FinancialOffer === '') {
      console.log("Tender type is '02' with no Financial Offer");
    
  
      for (let i = 0; i < data?.to_VndrChkLst.results.length; i++) {
       
        console.log("Checking ChecklistId for type '02' with no Financial Offer:", data?.to_VndrChkLst.results[i]?.ChecklistId);
  
        if (data?.to_VndrChkLst.results[i]?.ChecklistId === '002') {
          if (data?.to_VndrChkLst.results[i].IsAttachmentValid === 'Y') {
            console.log("Invalid attachment found for type '02' with no Financial Offer.");
            // if (!this.invalidChecklist.includes(index + 1)) {
              invalid.push('checkListAttachment');

    
            this.invalidChecklist.push(index + 1);
            }
            break;
          // }
        }
      }
    } else if (this.bidEvalData.TndrTypeID === '02' && this.bidEvalData?.FinancialOffer === 'X') {
      console.log("Tender type is '02' with Financial Offer 'X'");
     
  
      for (let i = 0; i < data?.to_VndrChkLst.results.length; i++) {
        
        console.log("Checking ChecklistId for type '02' with Financial Offer 'X':", data?.to_VndrChkLst.results[i]?.ChecklistId);
        if(invaildVendorIndex.includes(index)){
          console.log('invalid vendor index', index)
          continue
        }
        if (data?.to_VndrChkLst.results[i]?.ChecklistId === '001' && 
          data?.to_VndrChkLst.results[i].IsAttachmentValid === 'Y') {
      
        console.log("Invalid attachment found for type '02' with Financial Offer 'X'.");
        this.invalidCheckListVendorName = this.vendorDetails[index].VendorName;
      
        if (this.showVendorDetail && this.SelectedvendorId === index) {
          invalid.push('checkListAttachment');
          this.invalidChecklist.push(index + 1);
        } else if (!this.showVendorDetail) {
          invalid.push('checkListAttachment');
          this.invalidChecklist.push(index + 1);
        }
      }
        
        
      }
    }
  });


console.log(invalid)
return invalid

}

setFormValues(){
  if (this.bidEvalData) {
    const form = this.bidEvaluationCommitteeForm;
  
    // Utility function to set form control values
    const setControlValue = (
      controlName: string,
      value: any,
      options: { update?: boolean; enable?: boolean; disable?: boolean } = {}
    ) => {
      const control = form.get(controlName);
      if (control) {
        control.setValue(value);
        if (options.update) control.updateValueAndValidity();
        if (options.enable) control.enable();
        if (options.disable) control.disable();
      }
    };
  
    // Set common form control values
    setControlValue('TenderName', this.bidEvalData.TndrName, { update: true });
    setControlValue('openingDate', this.cs.returnDate(this.bidEvalData.BidOpngDate), { update: true });
    setControlValue('FinanceOfferOpeningDate', this.cs.returnDate(this.bidEvalData.FinanceOfferOpeningDate), { update: true });
    setControlValue('ReferenceNumber', this.bidEvalData.PurReqNo, { update: true });
    setControlValue('typeOfPurchase', this.cs.returnPurchaseType(this.bidEvalData.PurTypID), { update: true });
    setControlValue('typeOfTendering', this.cs.returnTypeOfEnvlope(this.bidEvalData.TndrTypeID), { update: true });
    setControlValue('etimadNumber', this.bidEvalData.EtimadNo, { update: true });
  
    // Committee Formation Number and Date
    setControlValue('CmtFrmDate', this.cs.getDate(this.CommitteeID !== '04' ? 
      this.bidEvalData.CmtFrmtnOrdrDatebec : this.bidEvalData.CmtFrmtnOrdrDatedp), { update: true });
    setControlValue('CmtFrmNumber', this.CommitteeID !== '04' ? this.bidEvalData.CmtFrmtnOrdrNobec
      : this.bidEvalData.CmtFrmtnOrderNodp
      , { update: true });
  
    // Committee members and comments
    setControlValue('technicalEvaluationMember', this.bidEvalData.TchnclEvltnMmbrName, { update: true });
    setControlValue('committeeHead', this.bidEvalData.CommitteeUserName, { update: true });
  
    // Attachments and comments
    setControlValue('attachments', this.bidEvalData.CommitteeAtchArea, {  update: true, disable: true});
    setControlValue('localContent', this.bidEvalData.LocalContent, {  update: true, disable: true});
    setControlValue('finalApproval', this.bidEvalData.FinalApproval, {  update: true, disable: true});
    setControlValue('momtype', this.bidEvalData.MomType, {  update: true, disable: true});

    setControlValue('cmtworks', this.bidEvalData.CommitteeTxtArea, { disable: true, update: true });
    setControlValue('mom', this.bidEvalData.CommitteeCmntsArea, {  update: true, disable: true});
    
  
    // Final offer price and estimated price
    setControlValue('finalOfferPrice', this.getFinalOfferPrice(), { update: true });
    setControlValue('estimatedPrice', this.twoDigitPipe.transform(this.bidEvalData.EstPrice), { update: true });
  
    // Enable fields based on roles and conditions
    if (this.isFieldsEditable()) {
    setControlValue('momtype', this.bidEvalData.MomType, {  update: true, enable: true});
    setControlValue('localContent', this.bidEvalData.LocalContent, {  update: true, enable: true});
    setControlValue('finalApproval', this.bidEvalData.FinalApproval, {  update: true, enable: true});
    setControlValue('mom', this.bidEvalData.CommitteeCmntsArea, {  update: true, enable: true});
    setControlValue('attachments',this.bidEvalData.CommitteeAtchArea , { enable: true });
  }
  if(this.isFieldsEditableDP()){
    setControlValue('momtype', this.bidEvalData.MomType, {  update: true, enable: true});
    }
  
    if ((this.role === 'CH' || this.role === 'OF') && this.MemFinal) {
      setControlValue('cmtworks', null, { enable: true });
  
      if (this.role === 'OF') {
        setControlValue('finalOfferPrice', null, { enable: true });
        form.get('cmtworks')?.addValidators(Validators.required);
        form.get('finalOfferPrice')?.addValidators(Validators.required);
        form.get('mom')?.addValidators(Validators.required);
      }
    }
  
    // Competition Type and Submission Date
    if (this.bidEvalData.CompetitionTypeID && this.bidEvalData.CompetitionTypeID !== '00') {
      setControlValue('CompetitionTypeID', this.bidEvalData.CompetitionTypeID);
    }
  
    if (this.bidEvalData.SubmissionDate) {
      setControlValue(
        'SubmissionDate',
        moment(this.bidEvalData.SubmissionDate, 'YYYYMMDD').toISOString()
      );
    }
  
    // Handle limited vendors
    if (
      this.bidEvalData.to_LmtdVndrs &&
      this.bidEvalData.to_LmtdVndrs.results &&
      this.bidEvalData.to_LmtdVndrs.results.length > 0
    ) {
      const limitedVendorsControl = form.get('vendorInvitationsSent') as FormArray;
  
      this.bidEvalData.to_LmtdVndrs.results.forEach((vendor: any, index: number) => {
        let vendorForm = limitedVendorsControl.at(index);
        if (!vendorForm) {
          this.addNewInvitationSent();
          vendorForm = limitedVendorsControl.at(index);
        }
        vendorForm.get('LmtdVendorId')?.setValue(vendor.LmtdVendorId);
        vendorForm.get('TenderId')?.setValue(vendor.TenderId);
        vendorForm.get('LmtdVendorName')?.setValue(vendor.LmtdVendorName);
      });
    }
  
    // Handle MOM and vendor results
    this.bidEvalData.to_RqstVndrs.results.forEach((vendor: any) => {
      if (vendor.IsVendorSelected === 'Y') {
        setControlValue('mom', this.bidEvalData.CommitteeCmntsArea, { enable: this.role === 'OF' && this.MemFinal });
      }
    });
  }
  
}

isFieldsEditable(): boolean {
  const isBFTCWithoutFinancialOffer = this.role === 'OF' && this.initialTenderDetails.WFCmtMnuAction === 'BFTC' && this.bidEvalData.TndrTypeID === '01';
  const isBOFRWithFinancialOffer = this.role === 'OF' && this.initialTenderDetails.WFCmtMnuAction === 'BOFR' && this.bidEvalData.TndrTypeID === '02';
  // console.log(isBFTCWithoutFinancialOffer, isBOFRWithFinancialOffer )
  // console.log('test')

  return isBFTCWithoutFinancialOffer || isBOFRWithFinancialOffer 
}

isFieldsEditableDP(): boolean{
  const isDpSecretary = this.role === 'OF' && this.initialTenderDetails.WFCmtMnuAction === 'BEMR' ;
  return isDpSecretary;
}


loadDropdownData() {
  forkJoin({
    momTypes: this.committeService.getMOMtypes(),
    finalApprovers: this.committeService.getFinalApproversList(),
    localContent: this.committeService.getLocalContentList(),
  }).subscribe({
    next: ({ momTypes, finalApprovers, localContent }) => {
      this.MOMTypesList = momTypes;
      this.finalApproversList = finalApprovers;
      this.localContentList = localContent;
    },
    error: (err) => {
      console.error('Error loading dropdown data:', err);
    },
  });
}

checkInvalidControls() {
  let invalid: string[] = [];
  let formControlsToCheck: string[] = ['finalApproval', 'localContent', 'momtype', 'mom'];

  for (let control = 0; control < formControlsToCheck.length; control++) {
      const controlName = formControlsToCheck[control];
      const formControl = this.bidEvaluationCommitteeForm.get(controlName);
      // console.log(controlName, formControl, formControl?.invalid)
      if (formControl?.invalid) {
          invalid.push(controlName);
      }
  }
  console.log(invalid)
  return invalid; // Return the list of invalid controls
}
initializeChecklistChecker(vendors: any[]) {
  
  
  console.log(vendors, 'vendorListValues')
  if (vendors.length === 0) {
    vendors.push({}); // Push a placeholder object for one iteration
  }

  // Iterate over the new vendor list
  vendors.forEach((vendor: any, index: number) => {
    const vendorKey = `vendor${index + 1}`;
    this.disableDPVendorEdit[vendorKey] = {};
    this.disableDPVendorEdit[vendorKey][`isEditEnable`] = false;

    
    // Check if the vendor key already exists
    if (!this.checklistCheckerArray[vendorKey]) {
      // If not, initialize the new vendor's checklist
      this.checklistCheckerArray[vendorKey] = [];
      
      for (let i = 1; i <= 10; i++) {
        this.checklistCheckerArray[vendorKey].push({ [`checklist${i}`]: false });
      }
    }
  });

  console.log(this.checklistCheckerArray, 'initiated checklistCheckerArray');
  console.log(this.disableDPVendorEdit, 'initiated disableDPVendorEdit');
  this.setCheckListValues()
}


setDisableDPVendorEdit(vendorIndex: number){
  const selectedVendorKey = Object.keys(this.disableDPVendorEdit)[vendorIndex];

  for (const key in this.disableDPVendorEdit) {
    if (this.disableDPVendorEdit.hasOwnProperty(key)) {
      this.disableDPVendorEdit[key] = { isEditEnable: key === selectedVendorKey ? false : true };
    }
  }
  console.log(this.disableDPVendorEdit, 'updatede disableDPVendorEdit')
}
setEnableDPVendorEdit(){
  for (const key in this.disableDPVendorEdit) {
    if (this.disableDPVendorEdit.hasOwnProperty(key)) {
      this.disableDPVendorEdit[key] = { isEditEnable: false };
    }
  }
}

getVendorKey(vendorIndex: number): string{
  const selectedVendorKey = Object.keys(this.disableDPVendorEdit)[vendorIndex];
  return selectedVendorKey; 
}

setCheckListValues(){
  console.log(this.vendorDetails)
  this.vendorDetails.forEach((vendor:any, vendorIndex: number)=>{
    vendor.to_VndrChkLst.results.forEach((checkList:any, checkListIndex: number)=>{
      if(checkList.IsAttachmentValid === 'N'){
        const vendorKey = Object.keys(this.checklistCheckerArray)[vendorIndex];
        const vendorChecklist = this.checklistCheckerArray[vendorKey];

        if (checkListIndex >= 0 && checkListIndex < vendorChecklist.length) {
          const checklistItem = vendorChecklist[checkListIndex];
          const checklistKey = Object.keys(checklistItem)[0]; // Get the key of the checklist item
    
          // Update the value for the checklist key
          checklistItem[checklistKey] = true;
    
          // console.log(`${vendorKey} checklist updated at index ${checklistIndex}`);
        } else {
          console.error("Invalid checklist index provided.");
        }
      }
    })
  })
  console.log(this.checklistCheckerArray, 'updated checklistCheckerArray after init');

}

updateChecklistChecker(vendorIndex: number, checklistIndex: number, value: boolean): void {
  // console.log(vendorIndex,checklistIndex,value )
  // Get the vendor key from the index
  
  const vendorKey = Object.keys(this.checklistCheckerArray)[vendorIndex];


  if (vendorKey) {
    const vendorChecklist = this.checklistCheckerArray[vendorKey];

    // Ensure the checklist index is within bounds
    if (checklistIndex >= 0 && checklistIndex < vendorChecklist.length) {
      const checklistItem = vendorChecklist[checklistIndex];
      const checklistKey = Object.keys(checklistItem)[0]; // Get the key of the checklist item

      // Update the value for the checklist key
      checklistItem[checklistKey] = value;

      // console.log(`${vendorKey} checklist updated at index ${checklistIndex}`);
    } else {
      console.error("Invalid checklist index provided.");
    }
  } else {
    console.error("Invalid vendor index provided.");
  }

  console.log(this.checklistCheckerArray, this.vendorDetails, 'updated');
}

isAttachmentPresent( vendorID: number, CheckListID: string){
    console.log(vendorID, CheckListID)
    

    let params: highLevelDocParams = this.testFnParams(vendorID, CheckListID)
    console.log(params)
    let audjestedCheckListId: number = Number(CheckListID ) + 1
    
    const docParams: docParams = {
      DefId: String(audjestedCheckListId),
      EntityId: params.firstLevelId,
      EntityName: params.firstLevelName,
      HeaderKey: "P2PCommitte",
      ItemKey: "VendorEval",
      ItemSecKey: "",
      RelatedEntityId: params.VendorGUID,
      RelatedEntityName: params.secondLevelName,
    };
    

    let docResult: any
    this.api.post('documentDetailsGet', docParams).subscribe({
      next: (res)=> {console.log(res), docResult = res

        if(docResult?.MessType === 'S'){
          // console.log(true)
          this.updateChecklistChecker(Number(vendorID),Number(CheckListID), true)
          
        }else{
          this.updateChecklistChecker(Number(vendorID),Number(CheckListID), false)
          
          // console.log(false)
        }
      },
      error: (err)=> console.log(err)
    })

    



    // console.log(docParams)
    // console.log(this.checklistCheckerArray)

  }




}



interface userDetails {
  ROLE: string;
  CommitteeId: string;
  CommitteeName: string;
  LogdInUsrID: string;
}

interface BoqItem {
  Quantity: number;
  Uom: string;
  UnitPrice: number;
  QntySum: number;
  ItemName: string;
}

