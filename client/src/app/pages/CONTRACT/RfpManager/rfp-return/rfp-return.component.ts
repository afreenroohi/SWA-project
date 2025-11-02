import { BankDetail, Manpower } from './../../../../shared/shared';
import { Component, DoCheck, EventEmitter, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import * as _l from 'lodash';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { IslamicI18n } from '../../Common/hijri-datepicker/hijri-datepicker.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CommitteeService } from 'src/app/pages/COMMITTEE/committee.service';
import { dropDown } from 'src/app/pages/COMMITTEE/committee.model';

interface DocParamsLevels {
  firstLevelId: string,
  firstLevelName: string,
  secondLevelId: string,
  secondLevelName: string,
  thirdLevelId: string,
  operation: string,
  uploadedBy: string
}

interface userDetails {
  ROLE: string,
  CommitteeId: string,
  CommitteeName: string,
  LogdInUsrID: string
}

@Component({
  selector: 'app-rfp-return',
  templateUrl: './rfp-return.component.html',
  styleUrls: ['./rfp-return.component.scss'],
  providers: [DatePipe,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura }, //year
    { provide: NgbDatepickerI18n, useClass: IslamicI18n } // month , week days
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RfpReturnComponent implements OnInit {
  [x: string]: any;
  ProxyUserId = 'TSUDHA';

  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    PRnumber: new FormControl({ value: '', disabled: true }),
    PrintAwardLetter: new FormControl({ value: '', disabled: true }),
    PrintAwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    ProjectDuration: new FormControl({ value: '', disabled: true }),
    DurationTypeEN: new FormControl({ value: '', disabled: true }),
    DurationTypeAR: new FormControl({ value: '', disabled: true }),
    ContractStartDate: new FormControl({ value: '', disabled: true }),
    ContractStartText: new FormControl({ value: '', disabled: true }),
    ContractStartToggle: new FormControl({ value: true, disabled: true }),
    RegNumber: new FormControl({ value: '', disabled: true }),
    ProcessDescription: new FormControl({ value: '', disabled: true }),
    Amount: new FormControl({ value: '', disabled: true }),
    AmountInWords: new FormControl({ value: '', disabled: true }),
    BidNumber: new FormControl({ value: '', disabled: true }),
    DateOfBid: new FormControl({ value: '', disabled: true }),

    GuranteeNumber: new FormControl({ value: '', disabled: true }),
    GuranteePercent: new FormControl({ value: '', disabled: true }),
    GuranteeAmount: new FormControl({ value: '', disabled: true }),
    GuranteeCurrency: new FormControl({ value: '', disabled: true }),
    GuranteeIssuedBy: new FormControl({ value: '', disabled: true }),
    DateOfIssue: new FormControl({ value: '', disabled: true }),
    ValidTill: new FormControl({ value: '', disabled: true }),
    BgValidDateCal: new FormControl({ value: '', disabled: true }),


    DeligateName: new FormControl({ value: '', disabled: true }),
    CommNation: new FormControl({ value: '', disabled: true }),
    proofId: new FormControl({ value: '', disabled: true }),
    NationalId: new FormControl({ value: '', disabled: true }),
    ResidenceNumber: new FormControl({ value: '', disabled: true }),
    PassportNumber: new FormControl({ value: '', disabled: true }),
    delegateStatus: new FormControl({ value: 'Select the delegate status', disabled: true }),

    signAuth: new FormControl({ value: '', disabled: true }),
    authLetter: new FormControl({ value: '', disabled: true }),
    authLetterNumber: new FormControl({ value: '', disabled: true }),
    authLetterDate: new FormControl({ value: '', disabled: true }),
    powerNumber: new FormControl({ value: '', disabled: true }),
    powerDate: new FormControl({ value: '', disabled: true }),

    conAddress: new FormControl({ value: '', disabled: true }),
    conCity: new FormControl({ value: '', disabled: true }),
    signCity: new FormControl({ value: '', disabled: true }),
    FinalApproval: new FormControl({value: '', disabled: true}),
    company: new FormControl({ value: '', disabled: true }),
    otherEntity: new FormControl({ value: '', disabled: true }),
    conCountry: new FormControl({ value: '', disabled: true }),
    conPhone: new FormControl({ value: '', disabled: true }),
    mailBox: new FormControl({ value: '', disabled: true }),
    postalCode: new FormControl({ value: '', disabled: true }),
    eMail: new FormControl({ value: '', disabled: true }),
    conBidNumber: new FormControl({ value: '', disabled: true }),
    conDate: new FormControl({ value: '', disabled: true }),
    conSignDate: new FormControl({ value: '', disabled: true }),
    conSignDay: new FormControl({ value: '', disabled: true }),

    durationWork: new FormControl({ value: '', disabled: true }),
    proFirst: new FormControl({ value: '', disabled: true }),
    proSecond: new FormControl({ value: '', disabled: true }),

    downRate: new FormControl({ value: '', disabled: true }),
    downPercent: new FormControl({ value: '', disabled: true }),
    downAmount: new FormControl({ value: '', disabled: true }),

    EvaluationPeriod: new FormControl({ value: '', disabled: true }),

    MtdCalcFines: new FormControl({ value: '', disabled: true }),
    FineText: new FormControl({ value: '', disabled: true }),
    FineFirst: new FormControl({ value: '', disabled: true }),
    FinePercent: new FormControl({ value: '', disabled: true }),
    // WeeklyPnltyPerctg: new FormControl({ value: '', disabled: true }),
    // MaximumPnltyPerctg: new FormControl({ value: '', disabled:true }),
    FineThird: new FormControl({ value: '', disabled: true }),
    FineSecond: new FormControl({ value: '', disabled: true }),
    FineFourth: new FormControl({ value: '', disabled: true }),
    ExtractFirst: new FormControl({ value: '', disabled: true }),
    ExtractSecond: new FormControl({ value: '', disabled: true }),
    ExtractThird: new FormControl({ value: '', disabled: true }),
    TableQP: new FormControl({ value: '', disabled: true }),
    Insurance: new FormControl({ value: '', disabled: true }),
    WorkScope: new FormControl({ value: '', disabled: true }),
    WorkSite: new FormControl({ value: '', disabled: true }),
    Location: new FormControl({ value: '', disabled: true }),
    ExePlace: new FormControl({ value: '', disabled: true }),
    SpecsTeam: new FormControl({ value: '', disabled: true }),
    SpecsMat: new FormControl({ value: '', disabled: true }),
    SpecsEqui: new FormControl({ value: '', disabled: true }),
    SpecsWork: new FormControl({ value: '', disabled: true }),
    SpecsQual: new FormControl({ value: '', disabled: true }),
    SpecsSafety: new FormControl({ value: '', disabled: true }),
    SpecsWorkGroup: new FormControl({ value: '', disabled: true }),
    SpecsImplServ: new FormControl({ value: '', disabled: true }),
    ContentMand: new FormControl({ value: '', disabled: true }),
    ContentRatio: new FormControl({ value: '', disabled: true }),
    ContentShare: new FormControl({ value: '', disabled: true }),
    TermsInsur: new FormControl({ value: '', disabled: true }),
    TermsHours: new FormControl({ value: '', disabled: true }),
    TermsFollow: new FormControl({ value: '', disabled: true }),
    TermsInsp: new FormControl({ value: '', disabled: true }),
    TermsChart: new FormControl({ value: '', disabled: true }),
    TermsTrain: new FormControl({ value: '', disabled: true }),
    TermsReport: new FormControl({ value: '', disabled: true }),
    NatureSepclCond: new FormControl({ value: '', disabled: true }),
    ProfRules: new FormControl({ value: '', disabled: true }),
    WorkSuppServ: new FormControl({ value: '', disabled: true }),
    ServProgRep: new FormControl({ value: '', disabled: true }),
    ModernSkills: new FormControl({ value: '', disabled: true }),
    WarrantPeriod: new FormControl({ value: '', disabled: true }),
    DetailedTerm: new FormControl({ value: '', disabled: true }),
    PaySchedule: new FormControl({ value: '', disabled: true }),
    Accessories: new FormControl({ value: '', disabled: true }),
    Comment: new FormControl('', [Validators.required]),
    ManPower: new FormArray([]),
    ContPayment: new FormArray([]),
    ContEvaluation: new FormArray([]),
    showPerfEval: new FormControl({ value: false, disabled: true }),
    PerfEval: new FormControl({ value: '', disabled: true }),
    DaysForAction: new FormControl({ value: '', disabled: true }),

    RetentionPeriod: new FormControl({ value: '', disabled: true }),
    RenewalDays: new FormControl({ value: '', disabled: true }),
    ResponsePeriod: new FormControl({ value: '', disabled: true }),
    PurResponseTime: new FormControl({ value: '', disabled: true }),
    showFirstArb: new FormControl({ value: false, disabled: true }),
    showSecondArb: new FormControl({ value: false, disabled: true }),
    showThirdArb: new FormControl({ value: false, disabled: true }),
    FirstArb: new FormControl({ value: '', disabled: true }),
    SecondArb: new FormControl({ value: '', disabled: true }),
    ThirdArb: new FormControl({ value: '', disabled: true }),
    showFirstAgree: new FormControl({ value: false, disabled: true }),
    showSecondAgree: new FormControl({ value: false, disabled: true }),
    showThirdAgree: new FormControl({ value: false, disabled: true }),
    FirstAgree: new FormControl({ value: '', disabled: true }),
    SecondAgree: new FormControl({ value: '', disabled: true }),
    ThirdAgree: new FormControl({ value: '', disabled: true }),
    AgreePeriod: new FormControl({ value: '', disabled: true }),
    NumberOfParties: new FormControl({ value: '', disabled: true }),
    ReplacePeriod: new FormControl({ value: '', disabled: true }),

    showFirstBusiness: new FormControl({ value: false, disabled: true }),
    showSecondBusiness: new FormControl({ value: false, disabled: true }),
    showThirdBusiness: new FormControl({ value: false, disabled: true }),
    FirstBusiness: new FormControl({ value: '', disabled: true }),
    SecondBusiness: new FormControl({ value: '', disabled: true }),
    ThirdBusiness: new FormControl({ value: '', disabled: true }),
    showFirstWorkPro: new FormControl({ value: false, disabled: true }),
    showSecondWorkPro: new FormControl({ value: false, disabled: true }),
    showThirdWorkPro: new FormControl({ value: false, disabled: true }),
    showFourthWorkPro: new FormControl({ value: false, disabled: true }),
    FirstWorkPro: new FormControl({ value: '', disabled: true }),
    SecondWorkPro: new FormControl({ value: '', disabled: true }),
    ThirdWorkPro: new FormControl({ value: '', disabled: true }),
    FourthWorkPro: new FormControl({ value: '', disabled: true }),
    DisputeResolutionDays: new FormControl({ value: '', disabled: true }),
    ContRespPeriod: new FormControl({ value: '', disabled: true }),
    PriorNotifPerson: new FormControl({ value: '', disabled: true }),

    showFirstInvoice: new FormControl({ value: false, disabled: true }),
    showSecondInvoice: new FormControl({ value: false, disabled: true }),
    showThirdInvoice: new FormControl({ value: false, disabled: true }),
    FirstInvoice: new FormControl({ value: '', disabled: true }),
    SecondInvoice: new FormControl({ value: '', disabled: true }),
    ThirdInvoice: new FormControl({ value: '', disabled: true }),
    showFirstPrices: new FormControl({ value: false, disabled: true }),
    FirstPrices: new FormControl({ value: '', disabled: true }),
    showFirstBenef: new FormControl({ value: false, disabled: true }),
    FirstBenef: new FormControl({ value: '', disabled: true }),

    showDynamicInsurance: new FormControl({ value: false, disabled: true }),
    showDynamicScope: new FormControl({ value: false, disabled: true }),
    showDynamicLocation: new FormControl({ value: false, disabled: true }),
    showDynamicWorkSite: new FormControl({ value: false, disabled: true }),
    showSpecsTeam: new FormControl({ value: false, disabled: true }),
    showSpecsMat: new FormControl({ value: false, disabled: true }),
    showSpecsEqui: new FormControl({ value: false, disabled: true }),
    showSpecsWork: new FormControl({ value: false, disabled: true }),
    showSpecsQual: new FormControl({ value: false, disabled: true }),
    showSpecsSafety: new FormControl({ value: false, disabled: true }),
    showSpecsWorkGroup: new FormControl({ value: false, disabled: true }),
    showSpecsImplServ: new FormControl({ value: false, disabled: true }),
    showContentMand: new FormControl({ value: false, disabled: true }),
    showContentRatio: new FormControl({ value: false, disabled: true }),
    showContentShare: new FormControl({ value: false, disabled: true }),
    showTermsInsur: new FormControl({ value: false, disabled: true }),
    showTermsHours: new FormControl({ value: false, disabled: true }),
    showTermsFollow: new FormControl({ value: false, disabled: true }),
    showTermsInsp: new FormControl({ value: false, disabled: true }),
    showTermsChart: new FormControl({ value: false, disabled: true }),
    showTermsTrain: new FormControl({ value: false, disabled: true }),
    showTermsReport: new FormControl({ value: false, disabled: true }),
    showNatureSepclCond: new FormControl({ value: false, disabled: true }),
    showProfRules: new FormControl({ value: false, disabled: true }),
    showWorkSuppServ: new FormControl({ value: false, disabled: true }),
    showServProgRep: new FormControl({ value: false, disabled: true }),
    showModernSkills: new FormControl({ value: false, disabled: true }),
    showWarrantPeriod: new FormControl({ value: false, disabled: true }),

  });

  bankList: BankDetail[] = [];
  finalApproverList: dropDown[] = [];


  constructor(
    private router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
    private CDR: ChangeDetectorRef,
    private committeeService: CommitteeService
  ) {
    this.cs.getCurrentUserLanguage().subscribe((lang: string) => {
      if (lang == 'ar') {
        this.ContractForm.get('AmountInWords')?.setValue(
          this.contractDetails.AmountInAr
        );
      } else {
        this.ContractForm.get('AmountInWords')?.setValue(
          this.contractDetails.AmountInEn
        );
      }
    });

    this.userDetails = {
      ROLE: localStorage.getItem("ROLEOP") ?? '',
      CommitteeId: localStorage.getItem("CMTID") ?? '',
      CommitteeName: localStorage.getItem("CommitteeName") ?? '',
      LogdInUsrID: localStorage.getItem("LogdInUsrID") ?? ''
    };
  }

  status = {
    contractHeadApproval: false,
    contractManagerApproval: false,
    RFPManagerRMI: false,
    RFPManagerApproval: false,
    SSDirectorApproval: false
  }

  user_name: any;
  approvePayload: any = [];
  award_number: number = 0;
  role = '';
  checkedGuarantee: boolean = false;
  checkDown: boolean = false;
  selected = '';
  auth = '';
  fileList: NzUploadFile[] = [];
  uploading = false;
  isVisible = false;
  isOkLoading = false;
  isCommNum = false;
  contractDetails: any = [];
  contractType = '';

  commentsArray: any;
  showComments: boolean = false;
  isTextDurationChecked: boolean = false;

  selectAll = false;
  copyToList: any[] = [];

  fileNetList: any[] = [];
  userDetails: userDetails;

  //checked text areas
  checkEvaluation = true;
  checkPenalties = true;
  checkExtracts = true;
  checkTableQuant = true;
  checkInsurance = true;
  checkScope = true;
  checkLocation = true;  
  checkWorkSite = true;
  checkPlace = true;
  checkSpecs = true;
  checkSpecsTeam = true;
  checkSpecsMat = true;
  checkSpecsEqui = true;
  checkSpecsWork = true;
  checkSpecsQual = true;
  checkSpecsSafety = true;
  checkSpecsWorkGroup = true;
  checkSpecsImplServ = true;
  checkContent = true;
  checkContentMand = true;
  checkContentRatio = true;
  checkContentShare = true;
  checkTerms = true;
  checkTermsInsur = true;
  checkTermsHours = true;
  checkTermsFollow = true;
  checkTermsInsp = true;
  checkTermsChart = true;
  checkTermsTrain = true;
  checkTermsReport = true;
  checkNatureSepclCond = true;
  checkProfRules = true;
  checkWorkSuppServ = true;
  checkServProgRep = true;
  checkModernSkills = true;
  checkWarrantPeriod = true;
  // checkAppendix = true;
  checkPerfEval = true;
  checkFirstArb = true;
  checkSecondArb = true;
  checkThirdArb = true;
  checkFirstAgree = true;
  checkSecondAgree = true;
  checkThirdAgree = true;

  checkFirstBusiness = true;
  checkSecondBusiness = true;
  checkThirdBusiness = true;

  checkFirstWorkPro = true;
  checkSecondWorkPro = true;
  checkThirdWorkPro = true;
  checkFourthWorkPro = true;

  checkFirstInvoice = true;
  checkSecondInvoice = true;
  checkThirdInvoice = true;
  checkFirstPrices = true;
  checkFirstBenef = true;

  showHideComments(comments?: any) {
    this.commentsArray = comments;
    this.showComments = !this.showComments;
  }

  detailedCountryList: any[] = [];
  countryList: any = [];
  commNationId = '';
  conCountryId = '';

  listOfPayData: any = [];

  idList: any = [];
  delegateList: any = [];
  authList: any = [];
  totalPercentage = 0;
  checkRFP = false;

  //* collapse heading
  project_details = 'Project Details';
  bank_guarantee = 'Bank Guarantee';
  delegate_details = 'Delegate Details';
  authorization = "Authorization";
  contractor_details = "Contractor's Contact Details";
  duration_of_work = "Duration of Completion of Work";
  prog_work = "Programme of Work";
  cont_evaluation = "Contractor Evaluation";
  downpayment = "Downpayment";
  cont_copy = "Copy of Contract";
  gen_provision = "General Provision";
  implement_services = "Implementation of Services";
  finance_term = "Financial Terms";
  beneficiary_section = "Beneficiary";
  insurance_head = "Insurance"
  penalties_head = "Penalties";
  extracts_head = "Extracts";
  quant_head = "Quantities and Prices";
  scope_head = "Scope of Work";
  place_head = "Place of Execution of Work";
  specs_head = "Specifications";
  content_head = "Local Content Requirement";
  detail_head = "Detailed Terms";
  manpower_head = "ManPower";
  pay_head = "Payment Schedule";
  appendix_head = "Appendix";
  
  
  expandIconPosition: 'left' | 'right' = 'right';
  selectedNation = "";
  listOfManPowerData: any[] = [];
  listOfContPaymentData: any[] = [];
  listOfContEvaluationData: any = [];
  jobTitle = '';
  qualification = '';
  experience = '';

  checkUncheckAll(evt: any) {
    this.copyToList.forEach((c) => c.isSelected = evt.target.checked)
  }

  ngDoCheck() {
    //*list of proof of Id
    if (this.cs.userLanguage == 'en') {
      this.idList = ["National ID Number", "Residence Number", "Passport Number of Delegate"]
    } else {
      this.idList = ["الهوية الوطنية", "رقم الإقامة", "رقم جواز السفر"]
    }

    //* list of authorization
    if (this.cs.userLanguage == 'en') {
      this.authList = ["Authorization letter certified by chamber of commerce and Industry", "The power of attorney issued by a notary public"]
    } else {
      this.authList = ["خطاب مصادقة معتمد من الغرفة التجارية", "التوكيل الصادر عن كاتب العدل"]
    }

    //* id proof translation
    if ((this.cs.userLanguage == 'en') && (this.selected == "الهوية الوطنية")) {
      this.selected = "National ID Number";
    } else if ((this.cs.userLanguage == 'ar') && (this.selected == "National ID Number")) {
      this.selected = "الهوية الوطنية";
    }

    if ((this.cs.userLanguage == 'en') && (this.selected == "رقم الإقامة")) {
      this.selected = "Residence Number";
    } else if ((this.cs.userLanguage == 'ar') && (this.selected == "Residence Number")) {
      this.selected = "رقم الإقامة";
    }

    if ((this.cs.userLanguage == 'en') && (this.selected == "رقم جواز السفر")) {
      this.selected = "Passport Number of Delegate";
    } else if ((this.cs.userLanguage == 'ar') && (this.selected == "Passport Number of Delegate")) {
      this.selected = "رقم جواز السفر";
    }

    this.detailedCountryList.forEach((country: any) => {
      if (this.commNationId == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['CommNation'].setValue(country.Natx50AR);
        } else {
          this.ContractForm.controls['CommNation'].setValue(country.Natx50En);
        }
      }
    })

    // set contractor's country name from country code
    this.detailedCountryList.forEach((country: any) => {
      if (this.conCountryId == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50Ar);
        } else {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50En);
        }
      }
    })

    // if (this.cs.userLanguage == 'ar') {
    //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInAr);
    // } else {
    //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInEn);
    // }
  }

  ngOnInit(): void {
    this.user_name = localStorage.getItem('ID')
    this.user_name = atob(this.user_name)
    this.spinner.show();
    this.award_number = history.state.award_number;
    this.role = history.state.role;
    this.getDetails(this.award_number);
    this.getDeptList(this.award_number);
    this.getManPower(this.award_number);
    this.getContEvaluation(this.award_number);
    // this.getContractPayment(this.award_number);
    this.getComments(this.award_number);
    this.getCopyOfContract(this.award_number);
    this.getDynamicText(this.award_number);
  }

  getCopyOfContract(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getPDFText", AwardNum).subscribe(
      (res) => {
        this.checkEvaluation = (res.d.ContEval == 'X') ? true : false;
        this.checkPenalties = (res.d.Penalties == 'X');
        this.checkExtracts = (res.d.Extracts == 'X') ? true : false;
        this.checkTableQuant = (res.d.QuantDPrice == 'X') ? true : false;
        this.checkInsurance = (res.d.Insurance == 'X') ? true : false;
        this.checkScope = (res.d.ScopeOfWork == 'X') ? true : false;
        this.checkLocation = (res.d.Location == 'X') ? true : false;
        this.checkWorkSite = (res.d.WorkSite == 'X') ? true : false;
        this.checkPlace = (res.d.ExecutionOfWork == 'X') ? true : false;
        this.checkSpecs = (res.d.Specification == 'X') ? true : false;
        this.checkContent = (res.d.ContentReq == 'X') ? true : false;
        this.checkTerms = (res.d.Detailederms == 'X') ? true : false;
        // this.checkAppendix = (res.d.Appendix == 'X') ? true : false;
        this.checkSpecsTeam = (res.d.Team_S == 'X') ? true : false;
        this.checkSpecsMat = (res.d.Material_S == 'X') ? true : false;
        this.checkSpecsEqui = (res.d.Equip_S == 'X') ? true : false;
        this.checkSpecsWork = (res.d.Work_Caryot_S == 'X') ? true : false;
        this.checkSpecsQual = (res.d.Qual_S == 'X') ? true : false;
        this.checkSpecsSafety = (res.d.SafetySpec == 'X') ? true : false;
        this.checkSpecsWorkGroup = (res.d.WorkingGroup == 'X') ? true : false;
        this.checkSpecsImplServ = (res.d.MethodImpServ == 'X') ? true : false;
        this.checkContentMand = (res.d.Mand_Terms_L == 'X') ? true : false;
        this.checkContentRatio = (res.d.Local_Cnt_Ratio_L == 'X') ? true : false;
        this.checkContentShare = (res.d.Nat_Prod_Share_L == 'X') ? true : false;
        this.checkTermsInsur = (res.d.Insurance_Rqts_T == 'X') ? true : false;
        this.checkTermsHours = (res.d.Work_Hrs_T == 'X') ? true : false;
        this.checkTermsFollow = (res.d.Follwup_T == 'X') ? true : false;
        this.checkTermsInsp = (res.d.Inspection_T == 'X') ? true : false;
        this.checkTermsChart = (res.d.Save_Charts_T == 'X') ? true : false;
        this.checkTermsTrain = (res.d.Training_T == 'X') ? true : false;
        this.checkTermsReport = (res.d.Wrk_Prog_Rep_T == 'X') ? true : false;
        this.checkNatureSepclCond = (res.d.SpecialConditions == 'X') ? true : false;
        this.checkProfRules = (res.d.RulesPrinciples == 'X') ? true : false;
        this.checkWorkSuppServ = (res.d.SupportServices == 'X') ? true : false;
        this.checkServProgRep = (res.d.ServiceProgRep == 'X') ? true : false;
        this.checkModernSkills = (res.d.SkillsMethods == 'X') ? true : false;
        this.checkWarrantPeriod = (res.d.WarrantPeriod == 'X') ? true : false;
        this.checkPerfEval = (res.d.ContPerfEval == 'X') ? true : false;
        this.isTextDurationChecked = (res.d.DurCompWrk == 'X') ? true : false;
        this.checkFirstArb = (res.d.Arbitrations_One == 'X') ? true : false;
        this.checkSecondArb = (res.d.Arbitrations_Two == 'X') ? true : false;
        this.checkThirdArb = (res.d.Arbitrations_Three == 'X') ? true : false;
        this.checkFirstAgree = (res.d.TermsOfAgrmt_one == 'X') ? true : false;
        this.checkSecondAgree = (res.d.TermsOfAgrmt_two == 'X') ? true : false;
        this.checkThirdAgree = (res.d.TermsOfAgrmt_three == 'X') ? true : false;
        this.checkFirstBusiness = (res.d.BussinessSubSec_one == 'X') ? true : false;
        this.checkSecondBusiness = (res.d.BussinessSubSec_two == 'X') ? true : false;
        this.checkThirdBusiness = (res.d.BussinessSubSec_three == 'X') ? true : false;
        this.checkFirstInvoice = (res.d.Invoices_one == 'X') ? true : false;
        this.checkSecondInvoice = (res.d.Invoices_two == 'X') ? true : false;
        this.checkThirdInvoice = (res.d.Invoices_three == 'X') ? true : false;
        this.checkFirstPrices = (res.d.ReferencePrices == 'X') ? true : false;
        this.checkFirstBenef = (res.d.Beneficiary == 'X') ? true : false;

        this.checkFirstWorkPro = (res.d.WorkProgramme == 'X') ? true : false;
        this.checkSecondWorkPro = (res.d.WorkProgramme_two == 'X') ? true : false;
        this.checkThirdWorkPro = (res.d.WorkProgramme_three == 'X') ? true : false;
        this.checkFourthWorkPro = (res.d.WorkProgramme_four == 'X') ? true : false;
        this.checkedGuarantee = (res.d.BankGuarantee == 'X') ? true : false;

      });
  }

  getDynamicText(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getDynamicText", AwardNum).subscribe(
      (res) => {
        this.ContractForm.get('showDynamicInsurance')?.setValue((res.d.Insurance == 'D') ? true : false);
        this.ContractForm.get('showDynamicScope')?.setValue((res.d.ScopeOfWork == 'D') ? true : false);
        this.ContractForm.get('showDynamicLocation')?.setValue((res.d.Location == 'D') ? true : false);
        this.ContractForm.get('showDynamicWorkSite')?.setValue((res.d.WorkSite == 'D') ? true : false);
        this.ContractForm.get('showSpecsTeam')?.setValue((res.d.TeamSpecification == 'D') ? true : false);
        this.ContractForm.get('showSpecsMat')?.setValue((res.d.MaterialSpecification == 'D') ? true : false);
        this.ContractForm.get('showSpecsEqui')?.setValue((res.d.EquipmentSpecification == 'D') ? true : false);
        this.ContractForm.get('showSpecsWork')?.setValue((res.d.WorkCarryoutMethods == 'D') ? true : false);
        this.ContractForm.get('showSpecsQual')?.setValue((res.d.QualitySpecification == 'D') ? true : false);
        this.ContractForm.get('showSpecsSafety')?.setValue((res.d.SafetySpec == 'D') ? true : false);
        this.ContractForm.get('showSpecsWorkGroup')?.setValue((res.d.WorkingGroup == 'D') ? true : false);
        this.ContractForm.get('showSpecsImplServ')?.setValue((res.d.MethodImpServ == 'D') ? true : false);
        this.ContractForm.get('showContentMand')?.setValue((res.d.MandatoryTerms == 'D') ? true : false);
        this.ContractForm.get('showContentRatio')?.setValue((res.d.LocalContentRatio == 'D') ? true : false);
        this.ContractForm.get('showContentShare')?.setValue((res.d.NationalProductsShare == 'D') ? true : false);
        this.ContractForm.get('showTermsInsur')?.setValue((res.d.InsuranceRequirements == 'D') ? true : false);
        this.ContractForm.get('showTermsHours')?.setValue((res.d.WorkHours == 'D') ? true : false);
        this.ContractForm.get('showTermsFollow')?.setValue((res.d.Followup == 'D') ? true : false);
        this.ContractForm.get('showTermsInsp')?.setValue((res.d.Inspection == 'D') ? true : false);
        this.ContractForm.get('showTermsChart')?.setValue((res.d.SaveCharts == 'D') ? true : false);
        this.ContractForm.get('showTermsTrain')?.setValue((res.d.SaudiTraining == 'D') ? true : false);
        this.ContractForm.get('showTermsReport')?.setValue((res.d.WorkProgressReport == 'D') ? true : false);
        this.ContractForm.get('showNatureSepclCond')?.setValue((res.d.SpecialConditions == 'D') ? true : false);
        this.ContractForm.get('showProfRules')?.setValue((res.d.RulesPrinciples == 'D') ? true : false);
        this.ContractForm.get('showWorkSuppServ')?.setValue((res.d.SupportServices == 'D') ? true : false);
        this.ContractForm.get('showServProgRep')?.setValue((res.d.ServiceProgRep == 'D') ? true : false);
        this.ContractForm.get('showModernSkills')?.setValue((res.d.SkillsMethods == 'D') ? true : false);
        this.ContractForm.get('showWarrantPeriod')?.setValue((res.d.WarrantPeriod == 'D') ? true : false);
        this.ContractForm.get('showPerfEval')?.setValue((res.d.ContPerfEval == 'D') ? true : false);
        this.ContractForm.get('showFirstArb')?.setValue((res.d.Arbitrations_One == 'D') ? true : false);
        this.ContractForm.get('showSecondArb')?.setValue((res.d.Arbitrations_Two == 'D') ? true : false);
        this.ContractForm.get('showThirdArb')?.setValue((res.d.Arbitrations_Three == 'D') ? true : false);
        this.ContractForm.get('showFirstAgree')?.setValue((res.d.TermsOfAgrmt_one == 'D') ? true : false);
        this.ContractForm.get('showSecondAgree')?.setValue((res.d.TermsOfAgrmt_two == 'D') ? true : false);
        this.ContractForm.get('showThirdAgree')?.setValue((res.d.TermsOfAgrmt_three == 'D') ? true : false);
        this.ContractForm.get('showFirstBusiness')?.setValue((res.d.BussinessSubSec_one == 'D') ? true : false);
        this.ContractForm.get('showSecondBusiness')?.setValue((res.d.BussinessSubSec_two == 'D') ? true : false);
        this.ContractForm.get('showThirdBusiness')?.setValue((res.d.BussinessSubSec_three == 'D') ? true : false);
        this.ContractForm.get('showFirstInvoice')?.setValue((res.d.Invoices_one == 'D') ? true : false);
        this.ContractForm.get('showSecondInvoice')?.setValue((res.d.Invoices_two == 'D') ? true : false);
        this.ContractForm.get('showThirdInvoice')?.setValue((res.d.Invoices_three == 'D') ? true : false);
        this.ContractForm.get('showFirstPrices')?.setValue((res.d.ReferencePrices == 'D') ? true : false);
        this.ContractForm.get('showFirstBenef')?.setValue((res.d.Beneficiary == 'D') ? true : false);

        this.ContractForm.get('showFirstWorkPro')?.setValue((res.d.WorkProgramme_one == 'D') ? true : false);
        this.ContractForm.get('showSecondWorkPro')?.setValue((res.d.WorkProgramme_two == 'D') ? true : false);
        this.ContractForm.get('showThirdWorkPro')?.setValue((res.d.WorkProgramme_three == 'D') ? true : false);
        this.ContractForm.get('showFourthWorkPro')?.setValue((res.d.WorkProgramme_four == 'D') ? true : false);

      });
  }

  downloadPDF(flag: any) {
    this.apiService.downloadPDF(flag, this.award_number, this.contractType);
  }


  getDetails(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    //api call for detail of contract
    if (this.award_number) {
      this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');

      const getCountryList = this.api.post("getCountryList", this.award_number);
      const getDetails = this.api.post("getDetails", { ...AwardNum, userName: this.ProxyUserId });
      const getPayment = this.api.post("getContractPayment", AwardNum);
      const getAttachment = this.api.post("getAttachment", AwardNum);
      const getBankList = this.api.get("get-bank-list");
      const getFinalApproverList = this.committeeService.getFinalApproversList();

      forkJoin([getCountryList, getDetails, getPayment, getAttachment,getBankList, 
        getFinalApproverList]).subscribe(
        (result) => {
          let countryListRes = result[0];
          let detailsGetRes = result[1];
          let paymentDetails = result[2];
          let attachmentDetails = result[3];
          let bankList = result[4];
          let finalApproverList = result[5];
          this.spinner.hide();

          // * Set the data for Country list Get call 
          if (countryListRes) {
            let list = countryListRes.d.results;
            this.detailedCountryList = countryListRes.d.results;
            list.forEach((l: any) => {
              this.countryList.push(l.Landx50);
            })
            this.countryList.sort();
            this.countryList[0] = 'Saudi Arabia';
          }

          // * Set the data for Details Get call 
          if (detailsGetRes) {
            this.approvePayload = detailsGetRes.d;
            this.spinner.hide();
            this.contractDetails = this.apiService.mappingDetails(detailsGetRes.d);
            
            this.mapObjectToForm(this.contractDetails);
          }

          if (paymentDetails) {
            this.listOfContPaymentData = paymentDetails.d.results;
            this.mapObjectToFormContPayment(this.listOfContPaymentData);
          }

          // * Set the data for attachments
          if (attachmentDetails) {
            this.mapObjectToFormAttachment(attachmentDetails.d.results);
          }

          // * Bank List
          if(bankList) {
            this.bankList = bankList;
          }

          // * Final Approver List
          if (finalApproverList) {
            this.finalApproverList = finalApproverList;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.spinner.hide();
      this.router.navigateByUrl('contract/RfpManagerDashboard/Rmi')
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', 'You have been redirected to contract list')
      } else {
        this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
      }

    }
  }
  mapObjectToForm(obj: any) {

    // this.checkedGuarantee = obj.BankGuarantee == 'X' ? true : false;
    this.checkRFP = obj.PHtoRFP == 'X' ? false : true;

    let statusID = obj.ContractStatus;
    switch(statusID){
      case 'RRMR': 
        this.status.RFPManagerRMI = true;
        break;
      case 'RRMA': 
        this.status.RFPManagerApproval = true;
        break;
      case 'PCHA':
        this.status.contractHeadApproval = true;
        break;
      case 'PCMA':
        this.status.contractManagerApproval = true;
        break;
      case 'PCDA':
        this.status.SSDirectorApproval = true;
        break;
      default:
        break;
    }


    //contract form
    this.contractType = obj.ContractType;
    this.ContractForm.get('ProjectName')?.setValue(obj.ProjectName);
    this.ContractForm.get('ProjectType')?.setValue(obj.ProjectType);
    this.ContractForm.get('AwardNumber')?.setValue(obj.AwardNumber);
    this.ContractForm.get('AwardDate')?.setValue(obj.AwardDate);
    this.ContractForm.get('PRnumber')?.setValue(obj.PRnumber);
    this.ContractForm.get('PrintAwardLetter')?.setValue(obj.PrintAwardLetter);
    const [day, month, year] = this.contractDetails.PrintAwardDate.split('/');
      const objDate = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day)
      };
      this.ContractForm.get('PrintAwardDate')?.setValue(objDate);
    
    this.ContractForm.get('VendorName')?.setValue(obj.VendorName);
    this.ContractForm.get('ProjectDuration')?.setValue(obj.ProjectDuration);
    this.ContractForm.get('DurationTypeEN')?.setValue(obj.DurationTypeEN);
    this.ContractForm.get('DurationTypeAR')?.setValue(obj.DurationTypeAR);
    this.ContractForm.get('ContractStartDate')?.setValue(obj.ContractStartDate);
    this.ContractForm.get('ContractStartText')?.setValue(obj.ContractStartText);
    this.ContractForm.get('ContractStartToggle')?.setValue(obj.ContractStartToggle == 'X' ? true : false);
    this.ContractForm.get('RegNumber')?.setValue(obj.RegNumber);
    this.ContractForm.get('ProcessDescription')?.setValue(obj.ProcessDescription);
    this.ContractForm.get('Amount')?.setValue(obj.Amount);
    this.ContractForm.get('BidNumber')?.setValue(obj.BidNumber)
    this.ContractForm.get('DateOfBid')?.setValue(obj.DateOfBid);
    this.ContractForm.get('conAddress')?.setValue(obj.conAddress);
    this.ContractForm.get('conCity')?.setValue(obj.conCity);
    this.ContractForm.get('signCity')?.setValue(obj.signCity);
    this.ContractForm.get('FinalApproval')?.setValue(obj.FinalApproval)
    this.ContractForm.get('company')?.setValue(obj.company);
    this.ContractForm.get('otherEntity')?.setValue(obj.otherEntity);
    // this.ContractForm.get('conCountry')?.setValue(obj.conCountry);
    this.ContractForm.get('conPhone')?.setValue(Number(obj.conPhone));
    this.ContractForm.get('mailBox')?.setValue(Number(obj.mailBox));
    this.ContractForm.get('postalCode')?.setValue(Number(obj.postalCode));
    this.ContractForm.get('eMail')?.setValue(obj.eMail);
    this.ContractForm.get('conBidNumber')?.setValue(obj.conBidNumber);
    this.ContractForm.get('conDate')?.setValue(obj.conDate);
    this.ContractForm.get('conSignDate')?.setValue(obj.conSignDate);
    this.ContractForm.get('conSignDay')?.setValue('');
    this.ContractForm.get('GuranteeNumber')?.setValue(obj.BgNum);
    this.ContractForm.get('GuranteePercent')?.setValue(Number(obj.BgPercent));
    this.ContractForm.get('GuranteeAmount')?.setValue(Number(obj.BgAmount));
    this.ContractForm.get('GuranteeCurrency')?.setValue(obj.BgCurrency);
    this.ContractForm.get('GuranteeIssuedBy')?.setValue(obj.BgIssuedBy);
    this.ContractForm.get('BgValidDateCal')?.setValue(this.contractDetails.BgValidDateCal);

    if (this.contractDetails.BgValidDateCal == 'H') {
      const [day, month, year] = this.contractDetails.BgDate.split('/');
      const obj1 = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day)
      };
      this.ContractForm.get('DateOfIssue')?.setValue(obj1);
    } else {
      this.ContractForm.get('DateOfIssue')?.setValue(this.contractDetails.BgDate ? (moment(this.contractDetails.BgDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    }

    if (this.contractDetails.BgValidDateCal == 'H') {
      const [day, month, year] = this.contractDetails.BgValid.split('/');
      const obj1 = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day)
      };
      this.ContractForm.get('ValidTill')?.setValue(obj1);
    } else {
      this.ContractForm.get('ValidTill')?.setValue(this.contractDetails.BgValid ? (moment(this.contractDetails.BgValid, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    }



    this.ContractForm.get('DeligateName')?.setValue(obj.DelName);
    // this.ContractForm.get('CommNation')?.setValue(obj.Nation);
    this.ContractForm.get('proofId')?.setValue(obj.IdType);
    this.ContractForm.get('NationalId')?.setValue(obj.NationalId);
    this.ContractForm.get('ResidenceNumber')?.setValue(obj.ResidenceId);
    this.ContractForm.get('PassportNumber')?.setValue(obj.PassportId);
    this.ContractForm.get('signAuth')?.setValue(obj.SignAuth);
    this.ContractForm.get('authLetterNumber')?.setValue(Number(obj.AuthLetterNum));
    this.ContractForm.get('authLetterDate')?.setValue(obj.AuthLetterDate);
    this.ContractForm.get('powerNumber')?.setValue(Number(obj.PowerNum));
    this.ContractForm.get('powerDate')?.setValue(obj.PowerDate ? (moment(obj.PowerDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('proFirst')?.setValue(obj.ProFirst);
    this.ContractForm.get('proSecond')?.setValue(obj.ProSecond);
    this.ContractForm.get('DaysForAction')?.setValue(obj.DaysForAction);
    this.ContractForm.get('downRate')?.setValue(Number(obj.DownRate));
    this.ContractForm.get('downPercent')?.setValue(Number(obj.DownPercent));
    this.ContractForm.get('downAmount')?.setValue(Number(obj.DownAmount));
    this.ContractForm.get('EvaluationPeriod')?.setValue(obj.EvalPeriod);
    // this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
    // this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
    this.ContractForm.get('FinePercent')?.setValue(Number(obj.PenaltyPercent));
    // this.ContractForm.get('WeeklyPnltyPerctg')?.setValue(obj.WeeklyPnltyPerctg);
    // this.ContractForm.get('MaximumPnltyPerctg')?.setValue(obj.MaximumPnltyPerctg);
    this.ContractForm.get('MtdCalcFines')?.setValue(obj.MtdCalcFines);
    // this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);

    switch (this.contractType) {
      case 'I':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);
        this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
        break;
      case 'M':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);
        this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
        break;
      case 'C':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineSecond')?.setValue(obj.PenaltyThird);
        this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
        break;
      case 'P':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineSecond')?.setValue(obj.PenalltyTxtBox);
        this.ContractForm.get('FineFourth')?.setValue(obj.PenaltyThird);
        this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
        break;
      case 'E':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineSecond')?.setValue(obj.PenaltyThird);
        break;
      case 'D':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineSecond')?.setValue(obj.PenaltyThird);
        break;
      case 'R':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);
        break;
      case 'T':
        this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
        break;
      case 'G':
        this.ContractForm.get('FineText')?.setValue(obj.PenaltyFirst);
        break;
      default:
        break;

    }


    this.ContractForm.get('ExtractFirst')?.setValue(obj.ExtractFirst);
    this.ContractForm.get('ExtractSecond')?.setValue(obj.ExtractSecond);
    this.ContractForm.get('ExtractThird')?.setValue(obj.ExtractThird);
    this.ContractForm.get('TableQP')?.setValue(obj.QuantPrice);
    this.ContractForm.get('Insurance')?.setValue(obj.Insurance);
    this.ContractForm.get('WorkScope')?.setValue(obj.WorkScope);
    this.ContractForm.get('WorkSite')?.setValue(obj.WorkSite);
    this.ContractForm.get('Location')?.setValue(obj.Location);
    this.ContractForm.get('WorkSite')?.setValue(obj.WorkSite);
    this.ContractForm.get('ExePlace')?.setValue(obj.ExePlace);
    this.ContractForm.get('SpecsTeam')?.setValue(obj.SpecsTeam);
    this.ContractForm.get('SpecsMat')?.setValue(obj.SpecsMat);
    this.ContractForm.get('SpecsEqui')?.setValue(obj.SpecsEqui);
    this.ContractForm.get('SpecsWork')?.setValue(obj.SpecsWork);
    this.ContractForm.get('SpecsQual')?.setValue(obj.SpecsQual);
    this.ContractForm.get('SpecsSafety')?.setValue(obj.SpecsSafety);
    this.ContractForm.get('SpecsImplServ')?.setValue(obj.SpecsImplServ);
    this.ContractForm.get('SpecsWorkGroup')?.setValue(obj.SpecsWorkGroup);

    this.ContractForm.get('ContentMand')?.setValue(obj.ContentMand);
    this.ContractForm.get('ContentRatio')?.setValue(obj.ContentRatio);
    this.ContractForm.get('ContentShare')?.setValue(obj.ContentShare);

    this.ContractForm.get('TermsInsur')?.setValue(obj.TermsInsur);
    this.ContractForm.get('TermsHours')?.setValue(obj.TermsHours);
    this.ContractForm.get('TermsFollow')?.setValue(obj.TermsFollow);
    this.ContractForm.get('TermsInsp')?.setValue(obj.TermsInsp);
    this.ContractForm.get('TermsChart')?.setValue(obj.TermsChart);
    this.ContractForm.get('TermsTrain')?.setValue(obj.TermsTrain);
    this.ContractForm.get('TermsReport')?.setValue(obj.TermsReport);
    this.ContractForm.get('NatureSepclCond')?.setValue(obj.NatureSepclCond);
    this.ContractForm.get('ProfRules')?.setValue(obj.ProfRules);
    this.ContractForm.get('WorkSuppServ')?.setValue(obj.WorkSuppServ);
    this.ContractForm.get('ServProgRep')?.setValue(obj.ServProgRep);
    this.ContractForm.get('ModernSkills')?.setValue(obj.ModernSkills);
    this.ContractForm.get('WarrantPeriod')?.setValue(obj.WarrantPeriod);

    this.ContractForm.get('Accessories')?.setValue(obj.Appendix);
    this.ContractForm.get('PaySchedule')?.setValue(obj.PayText);
    this.ContractForm.get('durationWork')?.setValue(obj.TextDuration);

    this.ContractForm.get('PerfEval')?.setValue(obj.PerfEval);
    this.ContractForm.get('RetentionPeriod')?.setValue(obj.RetentionPeriod);
    this.ContractForm.get('RenewalDays')?.setValue(obj.RenewalDays);
    this.ContractForm.get('ResponsePeriod')?.setValue(obj.ResponsePeriod);
    this.ContractForm.get('PurResponseTime')?.setValue(obj.ResponseTime);
    this.ContractForm.get('FirstArb')?.setValue(obj.ArbitrationFirst);
    this.ContractForm.get('SecondArb')?.setValue(obj.ArbitrationSecond);
    this.ContractForm.get('ThirdArb')?.setValue(obj.ArbitrationThird);
    this.ContractForm.get('FirstAgree')?.setValue(obj.TermsAgrFirst);
    this.ContractForm.get('SecondAgree')?.setValue(obj.TermsAgrSecond);
    this.ContractForm.get('ThirdAgree')?.setValue(obj.TermsAgrThird);
    this.ContractForm.get('AgreePeriod')?.setValue(obj.AgreePeriod);
    this.ContractForm.get('NumberOfParties')?.setValue(obj.NumberOfParties);
    this.ContractForm.get('ReplacePeriod')?.setValue(obj.ReplacePeriod);

    this.ContractForm.get('FirstBusiness')?.setValue(obj.BusinessFirst);
    this.ContractForm.get('SecondBusiness')?.setValue(obj.BusinessSecond);
    this.ContractForm.get('ThirdBusiness')?.setValue(obj.BusinessThird);

    this.ContractForm.get('FirstWorkPro')?.setValue(obj.WorkProFirst);
    this.ContractForm.get('SecondWorkPro')?.setValue(obj.WorkProSecond);
    this.ContractForm.get('ThirdWorkPro')?.setValue(obj.WorkProThird);
    this.ContractForm.get('FourthWorkPro')?.setValue(obj.WorkProFourth);

    this.ContractForm.get('DisputeResolutionDays')?.setValue(obj.ResolutionDays);
    this.ContractForm.get('ContRespPeriod')?.setValue(obj.ContRespPeriod);
    this.ContractForm.get('PriorNotifPerson')?.setValue(obj.PriorNotifPerson);
    this.ContractForm.get('FirstInvoice')?.setValue(obj.InvoiceFirst);
    this.ContractForm.get('SecondInvoice')?.setValue(obj.InvoiceSecond);
    this.ContractForm.get('ThirdInvoice')?.setValue(obj.InvoiceThird);
    this.ContractForm.get('FirstPrices')?.setValue(obj.PricesFirst);
    this.ContractForm.get('FirstBenef')?.setValue(obj.BenefFirst);


    // set country name from country code
    this.commNationId = obj.Nation;
    this.detailedCountryList.forEach((country: any) => {
      if (obj.Nation == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['CommNation'].setValue(country.Natx50AR);
        } else {
          this.ContractForm.controls['CommNation'].setValue(country.Natx50En);
        }
      }
    })

    // set contractor's country name from country code
    this.conCountryId = obj.conCountry;
    this.detailedCountryList.forEach((country: any) => {
      if (obj.conCountry == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50Ar);
        } else {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50En);
        }
      }
    })

    this.isCommNum = obj.RegType == 'C' ? true : false;

    if (this.cs.userLanguage == 'ar') {
      this.ContractForm.get('AmountInWords')?.setValue(obj.AmountInAr);
    } else {
      this.ContractForm.get('AmountInWords')?.setValue(obj.AmountInEn);
    }


    this.selectedNation = obj.Nation;

    this.ContractForm.get('authLetter')?.setValue(obj.AuthSelect);
    // if (obj.AuthSelect == 'C') {
    //   if (this.cs.userLanguage == 'en') {
    //     this.auth = "Authorization letter certified by chamber of commerce and Industry";
    //   } else {
    //     this.auth = "خطاب مصادقة معتمد من الغرفة التجارية"
    //   }
    //   this.ContractForm.get('authLetter')?.setValue(this.auth)
    // }

    // if (obj.AuthSelect == 'A') {
    //   if (this.cs.userLanguage == 'en') {
    //     this.auth = "The power of attorney issued by a notary public";
    //   } else {
    //     this.auth = "التوكيل الصادر عن كاتب العدل"
    //   }
    //   this.ContractForm.get('authLetter')?.setValue(this.auth)
    // }

    // if (obj.AuthSelect == 'A') {
    //   if (this.cs.userLanguage == 'en') {
    //     this.auth = "The power of attorney issued by a notary public";
    //   } else {
    //     this.auth = "التوكيل الصادر عن كاتب العدل"
    //   }
    //   this.ContractForm.get('authLetter')?.setValue(2)
    // }

    if (obj.DownPay == 'X') {
      this.checkDown = true;
    } else {
      this.checkDown = false;
    }

  }

  getDeptList(award_number: any) {
    let selectFlag = true;
    let AwardNum = {
      "AwardNum": award_number
    }
    this.api.post("getDeptConBased", AwardNum).subscribe(
      (res) => {
        let list = res.d.results;
        list.forEach((l: any) => {
          let item = {
            "value": l.department,
            "isSelected": (l.flag == 'X') ? true : false
          }
          if (item.isSelected == false) {
            selectFlag = false;
          }
          this.copyToList.push(item);
        })
        if (selectFlag) {
          this.selectAll = true;
        }
      }
    )
  }


  getContEvaluation(award_number: any) {
    let listOfDates: string[] = []
    let AwardNum = {
      "award_number": award_number
    }

    this.api.post("getContEvaluation", AwardNum).subscribe(
      (res) => {
        let list = res.d.results;
        list.forEach((l: any) => {
          listOfDates.push((moment(l.EvalDate, "DD.MM.YYYY").format('DD/MM/YYYY')).toString())
        })
        this.listOfContEvaluationData = listOfDates;


        // this.mapObjectToFormContEvaluation(this.listOfContEvaluationData);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // mapObjectToFormContEvaluation(data: any) {
  //   const ContEvaluation = this.ContractForm.get('ContEvaluation') as FormArray;
  //   this.ContEvaluation.clear();
  //   data.forEach((item: any) => {
  //     ContEvaluation.push(
  //       new FormGroup({
  //         AwardNum: new FormControl(this.award_number),
  //         EvalId: new FormControl(item.EvalId),
  //         EvalDate: new FormControl((moment(item.EvalDate, 'DD.MM.YYYY').format('DD/MM/YYYY'))),
  //       })
  //     )
  //   });
  //   // console.log(this.ContractForm.controls['ManPower'].value);
  // }

  getManPower(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }

    this.api.post("getManPower", AwardNum).subscribe(
      (res) => {
        this.listOfManPowerData = res.d.results;
        this.mapObjectToFormManPower(this.listOfManPowerData);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  mapObjectToFormManPower(data: any) {
    const ManPower = this.ContractForm.get('ManPower') as FormArray;
    // this.listOfManPowerData = [];
    this.Manpower.clear();
    let i = 1;
    data.forEach((item: any) => {
      ManPower.push(
        new FormGroup({
          AwardNum: new FormControl(this.award_number),
          ExpBasicHr: new FormControl({ value: item.ExpBasicHr, disabled: true }, Validators.required),
          ItemNo: new FormControl({ value: i.toString(), disabled: true }, Validators.required),
          JobTitle: new FormControl({ value: item.JobTitle, disabled: true }, Validators.required),
          SpeExp: new FormControl({ value: item.SpeExp, disabled: true }, Validators.required)
        })
      )
      i++;
    });
    // console.log(this.ContractForm.controls['ManPower'].value);
  }

  getContractPayment(award_number: any) {
    let totalPercent = 0;
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getContractPayment", AwardNum).subscribe(
      (res) => {
        this.listOfContPaymentData = res.d.results;
        this.listOfContPaymentData.forEach((per: any) => {
          totalPercent += Number(per.Percentage)
        });

        this.mapObjectToFormContPayment(this.listOfContPaymentData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getComments(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getComments", AwardNum).subscribe(
      (res) => {
        this.commentsArray = res.d.results;
      },
      (err) => {
        console.log(err);
      });
  }
  mapObjectToFormContPayment(data: any) {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    ContPayment.clear();
    let i = 1;
    let totalAmount = Number(this.ContractForm.controls['Amount'].value);
    data.forEach((item: any) => {
      ContPayment.push(
        new FormGroup({
          ContractNo: new FormControl(item.ContractNo),
          Descr: new FormControl({ value: item.Descr, disabled: true }, Validators.required),
          ItemNo: new FormControl({ value: i.toString(), disabled: true }, Validators.required),
          Percentage: new FormControl({ value: item.Percentage, disabled: true }, Validators.required),
          PayAmount: new FormControl({ value: this.cs.numberWithCommas(((Number(item.Percentage) / 100) * totalAmount).toFixed(2)).toLocaleString(), disabled: true }, Validators.required),
        })
      )
      i++;
    });
    let totalPercent = 0;
    for (let pay of data) {
      totalPercent += Number(pay.Percentage);
    }
    this.totalPercentage = totalPercent;
  }

  // attachment mapping function
  mapObjectToFormAttachment(data: any) {
    data.forEach((attach: any) => {
      this.fileNetList.push({
        FilenetID: attach.FilenetId,
        FileName: attach.FileName,
        CommitteeId: this.userDetails.CommitteeId,
        CommitteeRole: this.userDetails.ROLE,
        CommitteeUser: attach.CreatedBy,
        TenderId: attach.AwardNum,
      })
    });
  }

  // backToDashboard() {
  //   this.router.navigateByUrl('contract/RfpManagerDashboard/Rmi')
  // }

  submit() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'ASG';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Submitted Successfully!')
        } else {
          this.message.create('success', "تم إرسال العقد بنجاح!")
        }
        this.router.navigateByUrl('contract/RfpManagerDashboard/Rmi')
      }
    });
  }

  addComment(status: any) {
    let dataComment = {
      data: {
        "Flag": "SUBMIT",
        "comment_id": "",
        "AwardNum": this.approvePayload.AwardNum,
        "Status": status,
        "Comment_by": this.user_name,
        "Role": this.role,
        // "Comments": "",
        "CommentsTxt": this.ContractForm.controls['Comment'].value
      },
      AwardNum: this.award_number
    }
    this.api.post('addComment', dataComment).subscribe((res) => {
      if (res == 201) {
        console.log("Comment added successfully")
      }
    })
  }

  get Manpower() {
    return this.ContractForm.get('ManPower') as FormArray;
  }
  get ContPayment() {
    return this.ContractForm.get('ContPayment') as FormArray;
  }

  // @Output()
  // paramsForDocHandle = new EventEmitter();

  // onFileUpload(_event: any, _doc: any) {
  // }
  // get getFormGroup(): FormGroup {
  //   return new FormGroup({
  //     AttachGuid: new FormControl(''),
  //     documentsList: new FormArray([]),
  //     docParams: new FormGroup({
  //       control: new FormControl(''),
  //       doDocsGet: new FormControl(''),
  //       multipleFiles: new FormControl(''),
  //       srcType: new FormControl(''),
  //       displayMode: new FormControl(''),
  //       docParams: new FormGroup({
  //         Origin: new FormControl(''),
  //         ProfileId: new FormControl(''),
  //         UserId: new FormControl(''),
  //         HeaderKey: new FormControl(''),
  //         ItemKey: new FormControl(''),
  //         ItemSecKey: new FormControl(''),
  //         EntityId: new FormControl(''),
  //         EntityName: new FormControl(''),
  //         RelatedEntityId: new FormControl(''),
  //         RelatedEntityName: new FormControl(''),
  //         UploadedBy: new FormControl(''),
  //         DefId: new FormControl(''),
  //         DocId: new FormControl(''),
  //         DocName: new FormControl(''),
  //         operationType: new FormControl(''),
  //       }),
  //     }),
  //   });
  // }

  // get createFGParams(): DocParamsLevels {
  //   return {
  //     firstLevelName: 'P2PContract',
  //     firstLevelId: this.award_number.toString(),
  //     secondLevelName: 'P2PContractAward',
  //     secondLevelId: this.award_number.toString(),
  //     thirdLevelId: this.award_number.toString(),
  //     operation: "C",
  //     uploadedBy: this.user_name
  //   }
  // }
  // returnDocParamsFromTypeIds(_paramsForUpdate: any) {
  //   let docParams = {
  //     control: 'full',
  //     doDocsGet: true,
  //     multipleFiles: true,
  //     srcType: 'normal', //table
  //     displayMode: 'edit', //view
  //     docParams: {
  //       HeaderKey: "P2PCommitte",
  //       ItemKey: "VendorEval",
  //       EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
  //       EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
  //       RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
  //       RelatedEntityId: _l.get(_paramsForUpdate, 'secondLevelId', ''),
  //       DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
  //       DocName: "",
  //       FileNetId: "",
  //       Origin: "P2P",
  //       UploadedBy: _l.get(_paramsForUpdate, 'uploadedBy', ''),
  //       UploadedOn: "",
  //       MimeDocType: "text/xml",
  //       Operation: _l.get(_paramsForUpdate, 'operation', ''),
  //       GuiId: "",
  //       ContentSize: 0
  //     },
  //   };
  //   return docParams;
  // }
  // getAttachFormGroup(_params: any): FormGroup {
  //   let attachFG = this.getFormGroup;
  //   let docParamsFromType = this.returnDocParamsFromTypeIds(_params);
  //   attachFG.get('docParams')?.patchValue(docParamsFromType);
  //   return attachFG;
  // }

  // returnDocParamsFromTypeView(_paramsForUpdate: any) {
  //   let docParams = {
  //     control: 'full',
  //     doDocsGet: true,
  //     multipleFiles: true,
  //     srcType: 'normal', //table
  //     displayMode: 'view', //view
  //     docParams: {
  //       HeaderKey: "P2PCommitte",
  //       ItemKey: "VendorEval",
  //       EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
  //       EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
  //       RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
  //       RelatedEntityId: _l.get(_paramsForUpdate, 'secondLevelId', ''),
  //       DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
  //       DocName: "",
  //       FileNetId: "",
  //       Origin: "P2P",
  //       UploadedBy: "",
  //       UploadedOn: "",
  //       MimeDocType: "text/xml",
  //       Operation: _l.get(_paramsForUpdate, 'operation', ''),
  //       GuiId: "",
  //       ContentSize: 0
  //     },
  //   };
  //   return docParams;
  // }

  // getAttachFormGroupView(_params: any): FormGroup {
  //   let attachFG = this.getFormGroup;
  //   let docParamsFromType = this.returnDocParamsFromTypeView(_params);
  //   attachFG.get('docParams')?.patchValue(docParamsFromType);
  //   return attachFG;
  // }

  // getPenaltiesForMapping(isChecked: boolean): boolean {
  //   if (this.contractType == 'G') {
  //     this.setPenaltiesValidater();
  //     return true;
  //   } else {
  //     return isChecked;
  //   }
  // }

  public showWorkSite() {
    this.checkWorkSite = !this.checkWorkSite;
  }

  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        // this.cs.createMessage("success", this.translate.instant("Contract.OTPvalidatedSucccessfully"))
        this.approve();
      }
      else if (data !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  SubmitOTPReject(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        // this.cs.createMessage("success", this.translate.instant("Contract.OTPvalidatedSucccessfully"))
        this.reject();
      }
      else if (data !== this.otp) {
        this.cs.createMessage("error", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }
  
  getOTP(flag: any) {
    let data = {
      UserId: this.cs.getUserData().userid
    }
    this.api.post("/OTP", data).subscribe((res: any) => {
      console.log(res.d.results.MessageId)
      if (res.d.results[0].MessageId === "S") {

        this.cs.otpToast(res.d.results[0])
        
        // this.message.success(this.translate.instant('COM.OTP') + ' : ' + res.d.results[0].OtpNo, {
        //   nzDuration: 10000
        // });
        this.otp = res.d.results[0].OtpNo;
        if (flag == 'APP') {
          this.getOTPModel = !this.getOTPModel;
          this.CDR.detectChanges();
        } else if (flag == 'REJ') {
          this.getOTPModelReject = !this.getOTPModelReject;
          this.CDR.detectChanges();
        }

      }

      else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      }
      else {
        this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    })

  }
  updateOTP(value: any) {
    console.log(value);
    this.getOTPModel = value;
    this.getOTPModelReject = value;


    if (value) {
      if (value === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
      }
      else if (value !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  approve() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'APP';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Approved Successfully!')
        } else {
          this.message.create('success', "تم اعتماد العقد بنجاح!")
        }

        switch(conStatus){
          case 'RRMA': 
          this.router.navigateByUrl('contract/RfpManagerDashboard/ContAppr');
            break;
          case 'PCHA':
            this.router.navigateByUrl('contract/dashboard/approve');
            break;
          case 'PCMA':
            this.router.navigateByUrl('contract/ContractManagerDashboard')
            break;
          case 'PCDA':
            this.router.navigateByUrl('contract/SsDirectorDashboard')
            break;
          default:
            break;
        }
        
      }
    });
  }

  reject() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'REJ';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Rejected Successfully!')
        } else {
          this.message.create('success', 'تم رفض العقد بنجاح!')
        }

        switch(conStatus){
          case 'RRMA': 
          this.router.navigateByUrl('contract/RfpManagerDashboard/ContAppr');
            break;
          case 'PCHA':
            this.router.navigateByUrl('contract/dashboard/approve');
            break;
          case 'PCMA':
            this.router.navigateByUrl('contract/ContractManagerDashboard')
            break;
          case 'PCDA':
            this.router.navigateByUrl('contract/SsDirectorDashboard')
            break;
          default:
            break;
        }
      }
    });
  }

  assign() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'ASG';
    this.approvePayload.PHtoRFP = 'Y';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Assigned Successfully!')
        } else {
          this.message.create('success', "تم اعتماد العقد بنجاح!") // to do:  change assign in arabic
        }
        this.router.navigateByUrl('contract/dashboard/approve');
      }
    });
  }

  checkRFPMethod() {
    this.checkRFP = !this.checkRFP;
  }

  //UI/UX attachment starts
  filenetUpload(evt: any) {
    let file : any = [];
    file = {
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: this.userDetails.CommitteeId,
      CommitteeRole: this.userDetails.ROLE,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.award_number
    }

    this.fileNetList.push(file);
    this.fileNetList = [...this.fileNetList];

    let item = {
      "AwardNum" : this.award_number,
      "FilenetId" : file.FilenetID,
      "FileName" : file.FileName,
      "Operation" : "",
      "CreatedBy" : this.user_name
    }
    this.api.post('postAttachment', item).subscribe(
      (res) => {
        console.log(res);
      });

  }

  fileSapUpload(evt: any) {
    let file : any = [];
    file = {
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: this.userDetails.CommitteeId,
      CommitteeRole: this.userDetails.ROLE,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.award_number
    }

    this.fileNetList.push(file);
    this.fileNetList = [...this.fileNetList];

    let item = {
      "AwardNum" : this.award_number,
      "FilenetId" : file.FilenetID,
      "FileName" : file.FileName,
      "Operation" : "",
      "CreatedBy" : this.user_name
    }
    this.api.post('postAttachment', item).subscribe(
      (res) => {
        console.log(res);
      });
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
    let item = {
      "AwardNum" : this.award_number,
      "FilenetId" : evt.FilenetID,
      "FileName" : evt.FileName,
      "Operation" : "D",
      "CreatedBy" : this.user_name
    }
    this.api.post('postAttachment', item).subscribe(
      (res) => {
        console.log(res);
      });
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
    let item = {
      "AwardNum" : this.award_number,
      "FilenetId" : evt.FilenetID,
      "FileName" : evt.FileName,
      "Operation" : "D",
      "CreatedBy" : this.user_name
    }
    this.api.post('postAttachment', item).subscribe(
      (res) => {
        console.log(res);
      });
  }
  // UI/UX attachments end

}
