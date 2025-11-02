import { BankDetail, Manpower } from './../../../../shared/shared';
import { Component, DoCheck, EventEmitter, OnInit, Output, ChangeDetectionStrategy, Type } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import * as _l from 'lodash';
import * as moment from 'moment';
import { differenceInCalendarDays, setHours } from 'date-fns';

import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { IslamicI18n } from '../../Common/hijri-datepicker/hijri-datepicker.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { createMask } from '@ngneat/input-mask';
import { forkJoin } from 'rxjs';
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

// contract preparation form for legal unit officer
@Component({
  selector: 'app-contract-preparation-form',
  templateUrl: './contract-preparation-form.component.html',
  styleUrls: ['./contract-preparation-form.component.scss'],
  providers: [DatePipe,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura }, //year
    { provide: NgbDatepickerI18n, useClass: IslamicI18n } // month , week days
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractPreparationFormComponent implements OnInit {
  [x: string]: any;

  ProxyUserId = 'TSUDHA';
  @Output() pageIndex = new EventEmitter<string>();

  percentageInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: "2",
    digitsOptional: true,
    prefix: '',
    placeholder: '0',
    max: 100,
    rightAlign: false
  });


  // Contract form
  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    PRnumber: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    ProjectDuration: new FormControl({ value: '', disabled: true }),
    // ContractStartDate: new FormControl('', [Validators.required]),
    ContractStartDate: new FormControl(new Date(), [Validators.required]),
    RegNumber: new FormControl({ value: '', disabled: true }),
    ProcessDescription: new FormControl({ value: '', disabled: true }),
    Amount: new FormControl({ value: '', disabled: true }),
    AmountInWords: new FormControl({ value: '', disabled: true }),
    BidNumber: new FormControl({ value: '', disabled: true }),
    DateOfBid: new FormControl({ value: '', disabled: true }),

    // BankGuarantee: new FormControl(true),
    GuranteeNumber: new FormControl('', [Validators.required]),
    GuranteePercent: new FormControl(null, [Validators.required]),
    // GuranteeAmount: new FormControl(null, [Validators.required, Validators.pattern(/^\-?[0-9]+(?:\.[0-9]{1,2})?$/)]),
    GuranteeAmount: new FormControl('', [Validators.required, Validators.pattern(/^\-?[0-9,]+(?:\.[0-9]{1,2})?$/)]),
    GuranteeIssuedBy: new FormControl('', [Validators.required]),
    DateOfIssue: new FormControl(new Date(), [Validators.required]),
    ValidTill: new FormControl(new Date(), [Validators.required]),


    DeligateName: new FormControl('', [Validators.required]),
    CommNation: new FormControl('', [Validators.required]),
    proofId: new FormControl('', [Validators.required]),
    NationalId: new FormControl(''),
    ResidenceNumber: new FormControl(''),
    PassportNumber: new FormControl(''),
    delegateStatus: new FormControl('Select the delegate status'),

    signAuth: new FormControl('', [Validators.required]),
    authLetter: new FormControl('', [Validators.required]),
    authLetterNumber: new FormControl(''),
    authLetterDate: new FormControl(new Date()),
    powerNumber: new FormControl(''),
    powerDate: new FormControl(new Date()),

    conAddress: new FormControl('', [Validators.required]),
    conCity: new FormControl('', [Validators.required]),
    signCity: new FormControl(''),
    FinalApproval: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    conCountry: new FormControl('', [Validators.required]),
    conPhone: new FormControl('', [Validators.required]),
    mailBox: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    eMail: new FormControl('', [Validators.required]),
    conBidNumber: new FormControl('', [Validators.required]),
    conDate: new FormControl(new Date(), [Validators.required]),
    conSignDate: new FormControl(new Date()),
    conSignDay: new FormControl(''),

    durationWork: new FormControl('',),
    proFirst: new FormControl('',),
    proSecond: new FormControl('',),

    Downpayment: new FormControl(false),
    DurCompWrk: new FormControl(false),
    downRate: new FormControl(null),
    downAmount: new FormControl(null, [Validators.pattern(/^\-?[0-9,]+(?:\.[0-9]{1,2})?$/)]),
    downPercent: new FormControl(null),

    EvaluationPeriod: new FormControl(''),

    MtdCalcFines: new FormControl(null),
    FineFirst: new FormControl(null),
    FinePercent: new FormControl(null),
    FineThird: new FormControl('في حال عدم التزام المتعاقد بنسبة المحتوى المحلي، فسيتم إيقاع غرامة مالية تصل إلى 10% من قيمة العقد وفقًا لملحق الشروط والأحكام الخاص بالآلية المطبقة.'),
    FineText: new FormControl(''),
    ExtractFirst: new FormControl(''),
    ExtractSecond: new FormControl(''),
    ExtractThird: new FormControl(''),
    TableQP: new FormControl(''),
    Insurance: new FormControl(''),
    WorkScope: new FormControl(''),
    Location: new FormControl(''),
    WorkSite: new FormControl(''),
    ExePlace: new FormControl(''),
    SpecsTeam: new FormControl(''),
    SpecsMat: new FormControl(''),
    SpecsEqui: new FormControl(''),
    SpecsWork: new FormControl(''),
    SpecsQual: new FormControl(''),
    SpecsSafety: new FormControl(''),
    ContentMand: new FormControl(''),
    ContentRatio: new FormControl(''),
    ContentShare: new FormControl(''),
    TermsInsur: new FormControl(''),
    NatureSepclCond: new FormControl(''),
    WorkSuppServ: new FormControl(''),
    ServProgRep: new FormControl(''),
    ProfRules: new FormControl(''),
    WarrantPeriod: new FormControl(''),
    ModernSkills: new FormControl(''),
    TermsHours: new FormControl(''),
    TermsFollow: new FormControl(''),
    TermsInsp: new FormControl(''),
    TermsChart: new FormControl(''),
    TermsTrain: new FormControl(''),
    TermsReport: new FormControl(''),

    PaySchedule: new FormControl(''),
    Accessories: new FormControl(''),
    Comment: new FormControl('', [Validators.required]),
    ManPower: new FormArray([]),
    ContPayment: new FormArray([]),
    ContEvaluation: new FormArray([]),
    showDynamicInsurance: new FormControl(false),
    showDynamicScope: new FormControl(false),
    showDynamicLocation: new FormControl(false),
    showDynamicWorkSite: new FormControl(false),
    showSpecsTeam: new FormControl(false),
    showSpecsMat: new FormControl(false),
    showSpecsEqui: new FormControl(false),
    showSpecsWork: new FormControl(false),
    showSpecsQual: new FormControl(false),
    showSpecsSafety: new FormControl(false),
    showContentMand: new FormControl(false),
    showContentRatio: new FormControl(false),
    showContentShare: new FormControl(false),
    showTermsInsur: new FormControl(false),
    showNatureSepclCond: new FormControl(false),
    showWorkSuppServ: new FormControl(false),
    showServProgRep: new FormControl(false),
    showProfRules: new FormControl(false),
    showWarrantPeriod: new FormControl(false),
    showModernSkills: new FormControl(false),
    showTermsHours: new FormControl(false),
    showTermsFollow: new FormControl(false),
    showTermsInsp: new FormControl(false),
    showTermsChart: new FormControl(false),
    showTermsTrain: new FormControl(false),
    showTermsReport: new FormControl(false),

    showFirstArb: new FormControl(false),
    showSecondArb: new FormControl(false),
    showThirdArb: new FormControl(false),
    FirstArb: new FormControl(''),
    SecondArb: new FormControl(''),
    ThirdArb: new FormControl(''),
    RetentionPeriod: new FormControl(''),
    RenewalDays: new FormControl(''),
    ResponsePeriod: new FormControl(''),
    PurResponseTime: new FormControl(''),
    showFirstAgree: new FormControl(false),
    showSecondAgree: new FormControl(false),
    showThirdAgree: new FormControl(false),
    FirstAgree: new FormControl(''),
    SecondAgree: new FormControl(''),
    ThirdAgree: new FormControl(''),
    AgreePeriod: new FormControl(''),
    NumberOfParties: new FormControl(''),
    ReplacePeriod: new FormControl(''),
    showFirstBusiness: new FormControl(false),
    showSecondBusiness: new FormControl(false),
    showThirdBusiness: new FormControl(false),
    FirstBusiness: new FormControl(''),
    SecondBusiness: new FormControl(''),
    ThirdBusiness: new FormControl(''),
    showFirstWorkPro: new FormControl(false),
    showSecondWorkPro: new FormControl(false),
    showThirdWorkPro: new FormControl(false),
    showFourthWorkPro: new FormControl(false),
    FirstWorkPro: new FormControl(''),
    SecondWorkPro: new FormControl(''),
    ThirdWorkPro: new FormControl(''),
    FourthWorkPro: new FormControl(''),
    DisputeResolutionDays: new FormControl(''),
    ContRespPeriod: new FormControl(''),
    PriorNotifPerson: new FormControl(''),
    showFirstInvoice: new FormControl(false),
    showSecondInvoice: new FormControl(false),
    showThirdInvoice: new FormControl(false),
    FirstInvoice: new FormControl(''),
    SecondInvoice: new FormControl(''),
    ThirdInvoice: new FormControl(''),
    showFirstPrices: new FormControl(false),
    FirstPrices: new FormControl(''),
    showFirstBenef: new FormControl(false),
    FirstBenef: new FormControl(''),
    showPerfEval: new FormControl(false),
    PerfEval: new FormControl(''),
    DaysForAction: new FormControl(''),

  });

  constructor(
    private router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private location: Location,
    private committeeService: CommitteeService
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.award_number = params['award_number'];
        this.project_name = params['project_name'];
      }
    });

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
  }

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

  user_name: any;
  contractType = '';
  showError: boolean = false;
  errorList: any = [];
  approvePayload: any = [];
  award_number: number = 0;
  project_name = '';
  auth = '';
  fileList: NzUploadFile[] = [];
  uploading = false;
  isVisible = false;
  isOkLoading = false;
  contractDetails: any = [];
  isValidDownRate = false;
  isCommNum = true;

  commentsArray: any;
  showComments: boolean = false;

  selectAll = false;
  copyToList: any[] = [];

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
  checkContent = true;
  checkContentMand = true;
  checkContentRatio = true;
  checkContentShare = true;
  checkTerms = true;
  checkTermsInsur = true;
  checkNatureSepclCond = true;
  checkWorkSuppServ = true;
  checkServProgRep = true;
  checkProfRules = true;
  checkWarrantPeriod = true;
  checkModernSkills = true;
  checkTermsHours = true;
  checkTermsFollow = true;
  checkTermsInsp = true;
  checkTermsChart = true;
  checkTermsTrain = true;
  checkTermsReport = true;
  checkAppendix = true;
  showPayError = false;
  showNewSchedule = false;
  showEvalDateError = false;
  totalPercentage = 0;

  EvaluationDate: any = []

  checkCancel = false;

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
  checkPerfEval = true;


  bankList: BankDetail[] = [];
  finalApproverList: dropDown[] = [];


  checkUncheckAll(evt: any) {
    this.copyToList.forEach((c) => c.flag = evt.target.checked)
  }

  showHideComments(comments?: any) {
    this.commentsArray = comments;
    this.showComments = !this.showComments;
  }
  setTwoNumberDecimal(val: any) {
    this.ContractForm.controls[val].setValue(parseFloat(this.ContractForm.controls[val].value));
    console.log(val)
  }


  myDate = new Date();
  detailedCountryList: any[] = [];
  countryList: any = [];
  countryListAr: any = [];
  countryListEn: any = [];

  listOfPayData: any = [];

  idList: any = [];
  delegateList: any = [];
  authList: any = [];


  listOfManPowerData: any[] = [];
  listOfContPaymentData: any[] = [];
  listOfContEvaluationData: any[] = [];
  jobTitle = '';
  qualification = '';
  experience = '';
  isTextDurationChecked: boolean = true;

  listOfPaySchedule: any[] = [
    "Item/Phase", "Percentage", "Amount", ""
  ]

  listOfManPower: any[] = [
    "SI. No", "Job Title", "Lowest Qualification for Admission", "Minimum Years of Experience", ""
  ]


  selectedAuth() {
    if (this.ContractForm.get('authLetter')?.value == 1) {
      this.ContractForm.get('powerNumber')?.setValue(0);
      this.ContractForm.get('powerDate')?.reset();
    } else if (this.ContractForm.get('authLetter')?.value == 2) {
      this.ContractForm.get('authLetterNumber')?.setValue(0);
      this.ContractForm.get('authLetterDate')?.reset();
    }
    this.setValidators();
  }

  selectedId() {
    this.setValidators();
  }

  delegateStatus() { }

  showEvaluation() {
    if (this.checkEvaluation) {
      this.checkEvaluation = false;
    } else {
      this.checkEvaluation = true;
    }
    this.setEvaluationValidater();
  }

  textDurationChange(event: any) {
    event.target.checked ? this.isTextDurationChecked = true : this.isTextDurationChecked = false;
  }

  setEvaluationValidater() {
    if (this.checkEvaluation && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'T' && this.contractType != 'R') {
      this.ContractForm.get('EvaluationPeriod')?.setValidators([Validators.required]);
      // this.ContractForm.get('EvaluationDate')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('EvaluationPeriod')?.clearValidators();
      this.ContractForm.get('EvaluationPeriod')?.setErrors(null);
      this.ContractForm.get('EvaluationPeriod')?.updateValueAndValidity();

      // this.ContractForm.get('EvaluationDate')?.clearValidators();
      // this.ContractForm.get('EvaluationDate')?.setErrors(null);
      // this.ContractForm.get('EvaluationDate')?.updateValueAndValidity();
    }
  }

  showPenalties() {
    if (this.checkPenalties) {
      this.checkPenalties = false;
    } else {
      this.checkPenalties = true;
    }
    this.setPenaltiesValidater();
  }

  setPenaltiesValidater() {
    if (this.checkPenalties) {
      this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
      this.ContractForm.get('FineThird')?.setValidators([Validators.required]);
      this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('FineFirst')?.clearValidators();
      this.ContractForm.get('FineFirst')?.setErrors(null);
      this.ContractForm.get('FineFirst')?.updateValueAndValidity();

      this.ContractForm.get('FinePercent')?.clearValidators();
      this.ContractForm.get('FinePercent')?.setErrors(null);
      this.ContractForm.get('FinePercent')?.updateValueAndValidity();

      this.ContractForm.get('FineThird')?.clearValidators();
      this.ContractForm.get('FineThird')?.setErrors(null);
      this.ContractForm.get('FineThird')?.updateValueAndValidity();
    }

    if (this.checkPenalties && this.contractType == 'P') {
      this.ContractForm.get('FineText')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('FineText')?.clearValidators();
      this.ContractForm.get('FineText')?.setErrors(null);
      this.ContractForm.get('FineText')?.updateValueAndValidity();
    }

    if (this.checkPenalties && this.contractType == 'F') {
      this.ContractForm.get('FineFirst')?.clearValidators();
      this.ContractForm.get('FineFirst')?.setErrors(null);
      this.ContractForm.get('FineFirst')?.updateValueAndValidity();
    }

    if (this.checkPenalties && (this.contractType == 'G' || this.contractType == 'T' || this.contractType == 'D' || this.contractType == 'F')) {
      this.ContractForm.get('FineThird')?.clearValidators();
      this.ContractForm.get('FineThird')?.setErrors(null);
      this.ContractForm.get('FineThird')?.updateValueAndValidity();
    }

    if (this.checkPenalties && this.contractType == 'G') {
      this.ContractForm.get('FineFirst')?.clearValidators();
      this.ContractForm.get('FineFirst')?.setErrors(null);
      this.ContractForm.get('FineFirst')?.updateValueAndValidity();
    }


  }

  showExtracts() {
    if (this.checkExtracts) {
      this.checkExtracts = false;
    } else {
      this.checkExtracts = true;
    }
    this.setExtractsValidater();
  }

  setExtractsValidater() {
    if (this.checkExtracts) {
      this.ContractForm.get('ExtractFirst')?.setValidators([Validators.required]);
      this.ContractForm.get('ExtractSecond')?.setValidators([Validators.required]);
      this.ContractForm.get('ExtractThird')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ExtractFirst')?.clearValidators();
      this.ContractForm.get('ExtractFirst')?.setErrors(null);
      this.ContractForm.get('ExtractFirst')?.updateValueAndValidity();

      this.ContractForm.get('ExtractSecond')?.clearValidators();
      this.ContractForm.get('ExtractSecond')?.setErrors(null);
      this.ContractForm.get('ExtractSecond')?.updateValueAndValidity();

      this.ContractForm.get('ExtractThird')?.clearValidators();
      this.ContractForm.get('ExtractThird')?.setErrors(null);
      this.ContractForm.get('ExtractThird')?.updateValueAndValidity();
    }
  }

  showTableQuant() {
    if (this.checkTableQuant) {
      this.checkTableQuant = false;
    } else {
      this.checkTableQuant = true;
    }
    this.setTableQuantValidater();
  }

  setTableQuantValidater() {
    if (this.checkTableQuant && this.contractType != 'C' && this.contractType != 'F' && this.contractType != 'R' && this.contractType != 'T') {
      this.ContractForm.get('TableQP')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TableQP')?.clearValidators();
      this.ContractForm.get('TableQP')?.setErrors(null);
      this.ContractForm.get('TableQP')?.updateValueAndValidity();
    }
  }

  showSpecs() {
    if (this.checkSpecs) {
      this.checkSpecs = false;
    } else {
      this.checkSpecs = true;
    }
    this.setSpecsValidators();
  }

  showSpecsTeam() {
    if (this.checkSpecsTeam) {
      this.checkSpecsTeam = false;
    } else {
      this.checkSpecsTeam = true;
    }
    this.setSpecsValidators();
  }

  showSpecsMat() {
    if (this.checkSpecsMat) {
      this.checkSpecsMat = false;
    } else {
      this.checkSpecsMat = true;
    }
    this.setSpecsValidators();
  }

  showSpecsEqui() {
    if (this.checkSpecsEqui) {
      this.checkSpecsEqui = false;
    } else {
      this.checkSpecsEqui = true;
    }
    this.setSpecsValidators();
  }

  showSpecsWork() {
    if (this.checkSpecsWork) {
      this.checkSpecsWork = false;
    } else {
      this.checkSpecsWork = true;
    }
    this.setSpecsValidators();
  }

  showSpecsQual() {
    if (this.checkSpecsQual) {
      this.checkSpecsQual = false;
    } else {
      this.checkSpecsQual = true;
    }
    this.setSpecsValidators();
  }

  showSpecsSafety() {
    if (this.checkSpecsSafety) {
      this.checkSpecsSafety = false;
    } else {
      this.checkSpecsSafety = true;
    }
    this.setSpecsValidators();
  }

  showFirstArb() {
    if (this.checkFirstArb) {
      this.checkFirstArb = false;
    } else {
      this.checkFirstArb = true;
    }
  }

  showSecondArb() {
    if (this.checkSecondArb) {
      this.checkSecondArb = false;
    } else {
      this.checkSecondArb = true;
    }
  }

  showThirdArb() {
    if (this.checkThirdArb) {
      this.checkThirdArb = false;
    } else {
      this.checkThirdArb = true;
    }
  }

  showFirstAgree() {
    if (this.checkFirstAgree) {
      this.checkFirstAgree = false;
    } else {
      this.checkFirstAgree = true;
    }
  }

  showSecondAgree() {
    if (this.checkSecondAgree) {
      this.checkSecondAgree = false;
    } else {
      this.checkSecondAgree = true;
    }
  }

  showThirdAgree() {
    if (this.checkThirdAgree) {
      this.checkThirdAgree = false;
    } else {
      this.checkThirdAgree = true;
    }
  }

  showFirstBusiness() {
    if (this.checkFirstBusiness) {
      this.checkFirstBusiness = false;
    } else {
      this.checkFirstBusiness = true;
    }
  }

  showSecondBusiness() {
    if (this.checkSecondBusiness) {
      this.checkSecondBusiness = false;
    } else {
      this.checkSecondBusiness = true;
    }
  }

  showThirdBusiness() {
    if (this.checkThirdBusiness) {
      this.checkThirdBusiness = false;
    } else {
      this.checkThirdBusiness = true;
    }
  }

  showFirstInvoice() {
    if (this.checkFirstInvoice) {
      this.checkFirstInvoice = false;
    } else {
      this.checkFirstInvoice = true;
    }
  }

  showSecondInvoice() {
    if (this.checkSecondInvoice) {
      this.checkSecondInvoice = false;
    } else {
      this.checkSecondInvoice = true;
    }
  }

  showThirdInvoice() {
    if (this.checkThirdInvoice) {
      this.checkThirdInvoice = false;
    } else {
      this.checkThirdInvoice = true;
    }
  }

  showFirstPrices() {
    if (this.checkFirstPrices) {
      this.checkFirstPrices = false;
    } else {
      this.checkFirstPrices = true;
    }
  }

  showFirstBenef() {
    if (this.checkFirstBenef) {
      this.checkFirstBenef = false;
    } else {
      this.checkFirstBenef = true;
    }
  }

  showPerfEval() {
    if (this.checkPerfEval) {
      this.checkPerfEval = false;
    } else {
      this.checkPerfEval = true;
    }
  }

  showFirstWorkPro() {
    if (this.checkFirstWorkPro) {
      this.checkFirstWorkPro = false;
    } else {
      this.checkFirstWorkPro = true;
    }
  }

  showSecondWorkPro() {
    if (this.checkSecondWorkPro) {
      this.checkSecondWorkPro = false;
    } else {
      this.checkSecondWorkPro = true;
    }
  }

  showThirdWorkPro() {
    if (this.checkThirdWorkPro) {
      this.checkThirdWorkPro = false;
    } else {
      this.checkThirdWorkPro = true;
    }
  }

  showFourthWorkPro() {
    if (this.checkFourthWorkPro) {
      this.checkFourthWorkPro = false;
    } else {
      this.checkFourthWorkPro = true;
    }
  }

  setSpecsValidators() {
    if (this.checkSpecs && this.checkSpecsTeam && this.ContractForm.controls['showSpecsTeam'].value && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'G') {
      this.ContractForm.get('SpecsTeam')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsTeam')?.clearValidators();
      this.ContractForm.get('SpecsTeam')?.setErrors(null);
      this.ContractForm.get('SpecsTeam')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsMat && this.ContractForm.controls['showSpecsMat'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D') {
      this.ContractForm.get('SpecsMat')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsMat')?.clearValidators();
      this.ContractForm.get('SpecsMat')?.setErrors(null);
      this.ContractForm.get('SpecsMat')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsEqui && this.ContractForm.controls['showSpecsEqui'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D' && this.contractType != 'E') {
      this.ContractForm.get('SpecsEqui')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsEqui')?.clearValidators();
      this.ContractForm.get('SpecsEqui')?.setErrors(null);
      this.ContractForm.get('SpecsEqui')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsWork && this.ContractForm.controls['showSpecsWork'].value && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'E') {
      this.ContractForm.get('SpecsWork')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsWork')?.clearValidators();
      this.ContractForm.get('SpecsWork')?.setErrors(null);
      this.ContractForm.get('SpecsWork')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsQual && this.ContractForm.controls['showSpecsQual'].value) {
      this.ContractForm.get('SpecsQual')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsQual')?.clearValidators();
      this.ContractForm.get('SpecsQual')?.setErrors(null);
      this.ContractForm.get('SpecsQual')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsSafety && this.ContractForm.controls['showSpecsSafety'].value) {
      this.ContractForm.get('SpecsSafety')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsSafety')?.clearValidators();
      this.ContractForm.get('SpecsSafety')?.setErrors(null);
      this.ContractForm.get('SpecsSafety')?.updateValueAndValidity();
    }


  }

  showScope() {
    if (this.checkScope) {
      this.checkScope = false;
    } else {
      this.checkScope = true;
    }
    // this.setScopeValidators();
  }

  showInsurance() {
    if (this.checkInsurance) {
      this.checkInsurance = false;
    } else {
      this.checkInsurance = true;
    }
    // this.setScopeValidators();
  }

  showLocation() {
    if (this.checkLocation) {
      this.checkLocation = false;
    } else {
      this.checkLocation = true;
    }
    // this.setScopeValidators();
  }

  showWorkSite() {
    if (this.checkWorkSite) {
      this.checkWorkSite = false;
    } else {
      this.checkWorkSite = true;
    }
    // this.setScopeValidators();
  }

  // setScopeValidators() {
  //   if (this.checkScope && this.ContractForm.controls['showDynamicScope'].value) {
  //     this.ContractForm.get('WorkScope')?.setValidators([Validators.required]);
  //   } else {
  //     this.ContractForm.get('WorkScope')?.clearValidators();
  //     this.ContractForm.get('WorkScope')?.setErrors(null);
  //     this.ContractForm.get('WorkScope')?.updateValueAndValidity();
  //   }
  // }

  showPlace() {
    if (this.checkPlace) {
      this.checkPlace = false;
    } else {
      this.checkPlace = true;
    }
    this.setPlaceValidators();
  }

  setPlaceValidators() {
    if (this.checkPlace && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'R') {
      this.ContractForm.get('ExePlace')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ExePlace')?.clearValidators();
      this.ContractForm.get('ExePlace')?.setErrors(null);
      this.ContractForm.get('ExePlace')?.updateValueAndValidity();
    }
  }

  showContent() {
    if (this.checkContent) {
      this.checkContent = false;
    } else {
      this.checkContent = true;
    }
    this.setContentValidators();
  }

  showContentMand() {
    if (this.checkContentMand) {
      this.checkContentMand = false;
    } else {
      this.checkContentMand = true;
    }
    this.setContentValidators();
  }

  showContentRatio() {
    if (this.checkContentRatio) {
      this.checkContentRatio = false;
    } else {
      this.checkContentRatio = true;
    }
    this.setContentValidators();
  }

  showContentShare() {
    if (this.checkContentShare) {
      this.checkContentShare = false;
    } else {
      this.checkContentShare = true;
    }
    this.setContentValidators();
  }

  setContentValidators() {
    if (this.checkContent && this.checkContentMand && this.ContractForm.controls['showContentMand'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'D' && this.contractType != 'E') {
      this.ContractForm.get('ContentMand')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ContentMand')?.clearValidators();
      this.ContractForm.get('ContentMand')?.setErrors(null);
      this.ContractForm.get('ContentMand')?.updateValueAndValidity();
    }

    if (this.checkContent && this.checkContentRatio && this.ContractForm.controls['showContentRatio'].value && this.contractType != 'G' && this.contractType != 'F') {
      this.ContractForm.get('ContentRatio')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ContentRatio')?.clearValidators();
      this.ContractForm.get('ContentRatio')?.setErrors(null);
      this.ContractForm.get('ContentRatio')?.updateValueAndValidity();
    }

    if (this.checkContent && this.checkContentShare && this.ContractForm.controls['showContentShare'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'F' && this.contractType != 'D' && this.contractType != 'E') {
      this.ContractForm.get('ContentShare')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ContentShare')?.clearValidators();
      this.ContractForm.get('ContentShare')?.setErrors(null);
      this.ContractForm.get('ContentShare')?.updateValueAndValidity();
    }
  }

  showTerms() {
    if (this.checkTerms) {
      this.checkTerms = false;
    } else {
      this.checkTerms = true;
    }
    this.setTermsValidators();
  }

  showTermsInsur() {
    if (this.checkTermsInsur) {
      this.checkTermsInsur = false;
    } else {
      this.checkTermsInsur = true;
    }
    this.setTermsValidators();
  }

  showNatureSepclCond() {
    if (this.checkNatureSepclCond) {
      this.checkNatureSepclCond = false;
    } else {
      this.checkNatureSepclCond = true;
    }
  }

  showWorkSuppServ() {
    if (this.checkWorkSuppServ) {
      this.checkWorkSuppServ = false;
    } else {
      this.checkWorkSuppServ = true;
    }
  }

  showServProgRep() {
    if (this.checkServProgRep) {
      this.checkServProgRep = false;
    } else {
      this.checkServProgRep = true;
    }
  }

  showProfRules() {
    if (this.checkProfRules) {
      this.checkProfRules = false;
    } else {
      this.checkProfRules = true;
    }
  }

  showWarrantPeriod() {
    if (this.checkWarrantPeriod) {
      this.checkWarrantPeriod = false;
    } else {
      this.checkWarrantPeriod = true;
    }
  }

  showModernSkills() {
    if (this.checkModernSkills) {
      this.checkModernSkills = false;
    } else {
      this.checkModernSkills = true;
    }
  }

  showTermsHours() {
    if (this.checkTermsHours) {
      this.checkTermsHours = false;
    } else {
      this.checkTermsHours = true;
    }
    this.setTermsValidators();
  }

  showTermsFollow() {
    if (this.checkTermsFollow) {
      this.checkTermsFollow = false;
    } else {
      this.checkTermsFollow = true;
    }
    this.setTermsValidators();
  }

  showTermsInsp() {
    if (this.checkTermsInsp) {
      this.checkTermsInsp = false;
    } else {
      this.checkTermsInsp = true;
    }
    this.setTermsValidators();
  }

  showTermsChart() {
    if (this.checkTermsChart) {
      this.checkTermsChart = false;
    } else {
      this.checkTermsChart = true;
    }
    this.setTermsValidators();
  }

  showTermsTrain() {
    if (this.checkTermsTrain) {
      this.checkTermsTrain = false;
    } else {
      this.checkTermsTrain = true;
    }
    this.setTermsValidators();
  }

  showTermsReport() {
    if (this.checkTermsReport) {
      this.checkTermsReport = false;
    } else {
      this.checkTermsReport = true;
    }
    this.setTermsValidators();
  }

  setTermsValidators() {
    if (this.checkTerms && this.checkTermsInsur && this.ContractForm.controls['showTermsInsur'].value && this.contractType != 'F' && (this.contractType == 'E' || this.contractType == 'D' || this.contractType == 'I' || this.contractType == 'G' || this.contractType == 'M' || this.contractType == 'P' || this.contractType == 'C')) {
      this.ContractForm.get('TermsInsur')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsInsur')?.clearValidators();
      this.ContractForm.get('TermsInsur')?.setErrors(null);
      this.ContractForm.get('TermsInsur')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsHours && this.ContractForm.controls['showTermsHours'].value && this.contractType != 'G' && this.contractType != 'F') {
      this.ContractForm.get('TermsHours')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsHours')?.clearValidators();
      this.ContractForm.get('TermsHours')?.setErrors(null);
      this.ContractForm.get('TermsHours')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsFollow && this.ContractForm.controls['showTermsFollow'].value && this.contractType != 'G' && this.contractType != 'F') {
      this.ContractForm.get('TermsFollow')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsFollow')?.clearValidators();
      this.ContractForm.get('TermsFollow')?.setErrors(null);
      this.ContractForm.get('TermsFollow')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsInsp && this.ContractForm.controls['showTermsInsp'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D' && this.contractType != 'E') {
      this.ContractForm.get('TermsInsp')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsInsp')?.clearValidators();
      this.ContractForm.get('TermsInsp')?.setErrors(null);
      this.ContractForm.get('TermsInsp')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsChart && this.ContractForm.controls['showTermsChart'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D' && this.contractType != 'E') {
      this.ContractForm.get('TermsChart')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsChart')?.clearValidators();
      this.ContractForm.get('TermsChart')?.setErrors(null);
      this.ContractForm.get('TermsChart')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsTrain && this.ContractForm.controls['showTermsTrain'].value && this.contractType != 'G' && this.contractType != 'F') {
      this.ContractForm.get('TermsTrain')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsTrain')?.clearValidators();
      this.ContractForm.get('TermsTrain')?.setErrors(null);
      this.ContractForm.get('TermsTrain')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsReport && this.ContractForm.controls['showTermsReport'].value && this.contractType != 'G' && this.contractType != 'F') {
      this.ContractForm.get('TermsReport')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsReport')?.clearValidators();
      this.ContractForm.get('TermsReport')?.setErrors(null);
      this.ContractForm.get('TermsReport')?.updateValueAndValidity();
    }
  }

  showAppendix() {
    if (this.checkAppendix) {
      this.checkAppendix = false;
    } else {
      this.checkAppendix = true;
    }
    this.setAppendixValidators();
  }

  setAppendixValidators() {
    if (this.checkAppendix && this.contractType != 'M' && this.contractType != 'C' && this.contractType != 'P' && this.contractType != 'T' && this.contractType != 'F' && this.contractType != 'R') {
      this.ContractForm.get('Accessories')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('Accessories')?.clearValidators();
      this.ContractForm.get('Accessories')?.setErrors(null);
      this.ContractForm.get('Accessories')?.updateValueAndValidity();
    }
  }

  ngDoCheck() {
    //* proof of Id on change of language
    if (this.cs.userLanguage == 'en') {
      this.idList = ["National ID Number", "Residence Number", "Passport Number of Delegate"]
    } else {
      this.idList = ["الهوية الوطنية", "رقم الإقامة", "رقم جواز السفر"]
    }

    //* authorization list on change of language
    if (this.cs.userLanguage == 'en') {
      this.authList = [{
        id: 1,
        name: "Authorization letter certified by chamber of commerce and Industry"
      }, {
        id: 2,
        name: "The power of attorney issued by a notary public"
      }]
    } else {
      this.authList = [{
        id: 1,
        name: "خطاب مصادقة معتمد من الغرفة التجارية"
      }, {
        id: 2,
        name: "التوكيل الصادر عن كاتب العدل"
      }]

      // if (this.cs.userLanguage == 'ar') {
      //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInAr);
      // } else {
      //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInEn);
      // }
    }


    //* country list on change of language
    if (this.cs.userLanguage == 'en') {
      this.countryList = [];
      this.countryList[0] = "Saudi Arabia"
      this.countryList.push(...this.countryListEn);
    } else {
      this.countryList = [];
      this.countryList[0] = "السعودية"
      this.countryList.push(...this.countryListAr);
    }



    // bank guarantee validations


    // authorization validations


    // // penalties validations
    // if (this.checkPenalties) {
    //   this.ContractForm.controls['FineFirst'].setValidators([Validators.required]);
    //   this.ContractForm.controls['FineThird'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['FineFirst'].removeValidators;
    //   this.ContractForm.controls['FineThird'].removeValidators;
    // }

    // // extracts validations
    // if (this.checkExtracts) {
    //   this.ContractForm.controls['ExtractFirst'].setValidators([Validators.required]);
    //   this.ContractForm.controls['ExtractSecond'].setValidators([Validators.required]);
    //   this.ContractForm.controls['ExtractThird'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['ExtractFirst'].removeValidators;
    //   this.ContractForm.controls['ExtractSecond'].removeValidators;
    //   this.ContractForm.controls['ExtractThird'].removeValidators;
    // }

    // // table of quant validations
    // if (this.checkTableQuant) {
    //   this.ContractForm.controls['TableQP'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['TableQP'].removeValidators;
    // }

    // // scope of work validations
    // if (this.checkScope) {
    //   this.ContractForm.controls['WorkScope'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['WorkScope'].removeValidators;
    // }

    // // place execution validations
    // if (this.checkPlace) {
    //   this.ContractForm.controls['ExePlace'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['ExePlace'].removeValidators;
    // }

    // // specification validations
    // if (this.checkSpecs) {
    //   this.ContractForm.controls['SpecsTeam'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['SpecsTeam'].removeValidators;
    // }

    // // local content requirement validations
    // if (this.checkContent) {
    //   this.ContractForm.controls['ContentMand'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['ContentMand'].removeValidators;
    // }

    // // detailed terms validations
    // if (this.checkTerms) {
    //   this.ContractForm.controls['TermsInsur'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['TermsInsur'].removeValidators;
    // }

    // // appendix validations
    // if (this.checkAppendix) {
    //   this.ContractForm.controls['Accessories'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['Accessories'].removeValidators;
    // }

  }

  oneYearBack: any;
  today: any;
  afterToday: any;
  descLengthError: boolean = false;
  onKeypressEvent(event: any, length: any) {
    if (event.length < length) {
      console.log(event)
      this.descLengthError = false;
    }
    else if (event.length === length) {
      if (this.cs.userLanguage == 'en') {

        this.message.create('error', 'The maximum number of characters can not exceed ' + length);

      } else {
        this.message.create('error', 'الحد الأعلى للمدخلات لا يمكن أن يتعدى ' + length + ' حرفا')
      }
      this.descLengthError = true;
    }

  }
  // function to restrict the date input in date fields
  getDates() {
    this.today = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')?.toString();
    const tomorrow = new Date(this.myDate.setDate(this.myDate.getDate() + 1));
    this.afterToday = this.datePipe.transform(tomorrow, 'yyyy-MM-dd')?.toString();
    let date = this.myDate.getDate() - 1;
    let date0 = this.myDate.getDate() + 1;
    let month = this.myDate.getMonth() + 1;
    let year = this.myDate.getFullYear() - 1;
    this.oneYearBack = year + "-" + month + "-" + date;
  }

  // Can not select days before today and today
  maxDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) > 0;

  minDate = (current: Date): boolean => differenceInCalendarDays(new Date(), current) > 0;
  ngOnInit(): void {
    this.getDates();

    this.user_name = localStorage.getItem('ID')
    this.user_name = atob(this.user_name)
    this.spinner.show();
    this.getDetails(this.award_number);
    this.getDeptList(this.award_number);
    this.getManPower(this.award_number);
    this.getContEvaluation(this.award_number);

    // this.getContractPayment(this.award_number);
    this.getComments(this.award_number);
    this.initialValidators();
    this.getCopyOfContract(this.award_number);
    this.getDynamicText(this.award_number);

    this.setAuthorizationSelectListener();
  }

  setAuthorizationSelectListener() {
    this.ContractForm.get('signAuth')?.valueChanges
      .subscribe((val) => {
        if (val === 'A') {
          this.ContractForm.get('authLetter')?.setValue(1);
        }
        if (val === 'D') {
          this.ContractForm.get('authLetter')?.setValue(2);
        }
      });
  }

  // get API call for the checkboxes (whether to print in PDF or not)
  getCopyOfContract(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getPDFText", AwardNum).subscribe(
      (res) => {
        this.checkEvaluation = (res.d.ContEval == 'X') ? true : false;
        // * If the contract type is General supply Penalties is manditory in PDF,
        // * so checkPenalties is always true for General supply
        this.checkPenalties = this.getPenaltiesForMapping(res.d.Penalties == 'X');
        // this.checkPenalties = (this.contractType =='G' || res.d.Penalties == 'X') ? true : false;
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
        this.checkAppendix = (res.d.Appendix == 'X') ? true : false;
        this.checkSpecsTeam = (res.d.Team_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsMat = (res.d.Material_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsEqui = (res.d.Equip_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsWork = (res.d.Work_Caryot_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsQual = (res.d.Qual_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsSafety = (res.d.SafetySpec == 'X' && this.checkSpecs) ? true : false;
        this.checkContentMand = (res.d.Mand_Terms_L == 'X' && this.checkContent) ? true : false;
        this.checkContentRatio = (res.d.Local_Cnt_Ratio_L == 'X' && this.checkContent) ? true : false;
        this.checkContentShare = (res.d.Nat_Prod_Share_L == 'X' && this.checkContent) ? true : false;
        this.checkTermsInsur = (res.d.Insurance_Rqts_T == 'X' && this.checkTerms) ? true : false;
        this.checkNatureSepclCond = (res.d.SpecialConditions == 'X' && this.checkTerms) ? true : false;
        this.checkWorkSuppServ = (res.d.SupportServices == 'X' && this.checkTerms) ? true : false;
        this.checkServProgRep = (res.d.ServiceProgRep == 'X' && this.checkTerms) ? true : false;
        this.checkProfRules = (res.d.RulesPrinciples == 'X' && this.checkTerms) ? true : false;
        this.checkWarrantPeriod = (res.d.WarrantPeriod == 'X') ? true : false;
        this.checkModernSkills = (res.d.SkillsMethods == 'X') ? true : false;
        this.checkTermsHours = (res.d.Work_Hrs_T == 'X') ? true : false;
        this.checkTermsFollow = (res.d.Follwup_T == 'X') ? true : false;
        this.checkTermsInsp = (res.d.Inspection_T == 'X') ? true : false;
        this.checkTermsChart = (res.d.Save_Charts_T == 'X') ? true : false;
        this.checkTermsTrain = (res.d.Training_T == 'X') ? true : false;
        this.checkTermsReport = (res.d.Wrk_Prog_Rep_T == 'X') ? true : false;
        this.checkFirstArb = (res.d.Arbitrations_One == 'X') ? true : false;
        this.checkSecondArb = (res.d.Arbitrations_Two == 'X') ? true : false;
        this.checkThirdArb = (res.d.Arbitrations_Three == 'X') ? true : false;
        this.checkFirstAgree = (res.d.TermsOfAgrmt_one == 'X') ? true : false;
        this.checkSecondAgree = (res.d.TermsOfAgrmt_two == 'X') ? true : false;
        this.checkThirdAgree = (res.d.TermsOfAgrmt_three == 'X') ? true : false;
        this.checkThirdAgree = (res.d.TermsOfAgrmt_three == 'X') ? true : false;
        this.checkFirstBusiness = (res.d.BussinessSubSec_one == 'X') ? true : false;
        this.checkSecondBusiness = (res.d.BussinessSubSec_two == 'X') ? true : false;
        this.checkThirdBusiness = (res.d.BussinessSubSec_three == 'X') ? true : false;
        this.checkFirstWorkPro = (res.d.WorkProgramme == 'X') ? true : false;
        this.checkSecondWorkPro = (res.d.WorkProgramme_two == 'X') ? true : false;
        this.checkThirdWorkPro = (res.d.WorkProgramme_three == 'X') ? true : false;
        this.checkFourthWorkPro = (res.d.WorkProgramme_four == 'X') ? true : false;
        this.checkFirstInvoice = (res.d.Invoices_one == 'X') ? true : false;
        this.checkSecondInvoice = (res.d.Invoices_two == 'X') ? true : false;
        this.checkThirdInvoice = (res.d.Invoices_three == 'X') ? true : false;
        this.checkFirstPrices = (res.d.ReferencePrices == 'X') ? true : false;
        this.checkFirstBenef = (res.d.Beneficiary == 'X') ? true : false;
        this.checkPerfEval = (res.d.ContPerfEval == 'X') ? true : false;
        this.isTextDurationChecked = (res.d.DurCompWrk == 'X') ? true : false;
      });
  }

  // post API call for the checkboxes (whether to print in PDF or not)
  addTextInPDF() {
    let dataComment = {
      data: {
        AwardNum: this.award_number,
        ContEval: this.checkEvaluation ? 'X' : '',
        Penalties: this.checkPenalties ? 'X' : '',
        Extracts: this.checkExtracts ? 'X' : '',
        QuantDPrice: this.checkTableQuant ? 'X' : '',
        Insurance: this.checkInsurance ? 'X' : '',
        ScopeOfWork: this.checkScope ? 'X' : '',
        Location: this.checkLocation ? 'X' : '',
        WorkSite: this.checkWorkSite ? 'X' : '',
        ExecutionOfWork: this.checkPlace ? 'X' : '',
        Specification: this.checkSpecs ? 'X' : '',
        ContentReq: this.checkContent ? 'X' : '',
        Detailederms: this.checkTerms ? 'X' : '',
        Appendix: this.checkAppendix ? 'X' : '',
        Team_S: (this.checkSpecs && this.checkSpecsTeam) ? 'X' : '',
        Material_S: (this.checkSpecs && this.checkSpecsMat) ? 'X' : '',
        Equip_S: (this.checkSpecs && this.checkSpecsEqui) ? 'X' : '',
        Work_Caryot_S: (this.checkSpecs && this.checkSpecsWork) ? 'X' : '',
        Qual_S: (this.checkSpecs && this.checkSpecsQual) ? 'X' : '',
        SafetySpec: (this.checkSpecs && this.checkSpecsSafety) ? 'X' : '',
        Mand_Terms_L: (this.checkContent && this.checkContentMand) ? 'X' : '',
        Local_Cnt_Ratio_L: (this.checkContent && this.checkContentRatio) ? 'X' : '',
        Nat_Prod_Share_L: (this.checkContent && this.checkContentShare) ? 'X' : '',
        Insurance_Rqts_T: (this.checkTerms && this.checkTermsInsur) ? 'X' : '',
        SpecialConditions: (this.checkTerms && this.checkNatureSepclCond) ? 'X' : '',
        SupportServices: (this.checkTerms && this.checkWorkSuppServ) ? 'X' : '',
        ServiceProgRep: (this.checkTerms && this.checkServProgRep) ? 'X' : '',
        RulesPrinciples: (this.checkTerms && this.checkProfRules) ? 'X' : '',
        WarrantPeriod: (this.checkTerms && this.checkWarrantPeriod) ? 'X' : '',
        SkillsMethods: (this.checkTerms && this.checkModernSkills) ? 'X' : '',
        Work_Hrs_T: (this.checkTerms && this.checkTermsHours) ? 'X' : '',
        Follwup_T: (this.checkTerms && this.checkTermsFollow) ? 'X' : '',
        Inspection_T: (this.checkTerms && this.checkTermsInsp) ? 'X' : '',
        Save_Charts_T: (this.checkTerms && this.checkTermsChart) ? 'X' : '',
        Training_T: (this.checkTerms && this.checkTermsTrain) ? 'X' : '',
        Wrk_Prog_Rep_T: (this.checkTerms && this.checkTermsReport) ? 'X' : '',
        Arbitrations_One: this.checkFirstArb ? 'X' : '',
        Arbitrations_Two: this.checkSecondArb ? 'X' : '',
        Arbitrations_Three: this.checkThirdArb ? 'X' : '',
        TermsOfAgrmt_one: this.checkFirstAgree ? 'X' : '',
        TermsOfAgrmt_two: this.checkSecondAgree ? 'X' : '',
        TermsOfAgrmt_three: this.checkThirdAgree ? 'X' : '',
        BussinessSubSec_one: this.checkFirstBusiness ? 'X' : '',
        BussinessSubSec_two: this.checkSecondBusiness ? 'X' : '',
        BussinessSubSec_three: this.checkThirdBusiness ? 'X' : '',
        WorkProgramme: this.checkFirstWorkPro ? 'X' : '',
        WorkProgramme_two: this.checkSecondWorkPro ? 'X' : '',
        WorkProgramme_three: this.checkThirdWorkPro ? 'X' : '',
        WorkProgramme_four: this.checkFourthWorkPro ? 'X' : '',
        Invoices_one: this.checkFirstInvoice ? 'X' : '',
        Invoices_two: this.checkSecondInvoice ? 'X' : '',
        Invoices_three: this.checkThirdInvoice ? 'X' : '',
        ReferencePrices: this.checkFirstPrices ? 'X' : '',
        Beneficiary: this.checkFirstBenef ? 'X' : '',
        ContPerfEval: this.checkPerfEval ? 'X' : '',
        DurCompWrk: this.isTextDurationChecked ? 'X' : '',

      },
      AwardNum: this.approvePayload.AwardNum
    }
    this.api.post('addTextInPDF', dataComment).subscribe((res) => {
      if (res == 204) {
        console.log("")
      }
    })
  }

  // get API call for the toggles (whether the text to be printed in PDF is static or dynamic)
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
        this.ContractForm.get('showContentMand')?.setValue((res.d.MandatoryTerms == 'D') ? true : false);
        this.ContractForm.get('showContentRatio')?.setValue((res.d.LocalContentRatio == 'D') ? true : false);
        this.ContractForm.get('showContentShare')?.setValue((res.d.NationalProductsShare == 'D') ? true : false);
        this.ContractForm.get('showTermsInsur')?.setValue((res.d.InsuranceRequirements == 'D') ? true : false);
        this.ContractForm.get('showNatureSepclCond')?.setValue((res.d.SpecialConditions == 'D') ? true : false);
        this.ContractForm.get('showWorkSuppServ')?.setValue((res.d.SupportServices == 'D') ? true : false);
        this.ContractForm.get('showServProgRep')?.setValue((res.d.ServiceProgRep == 'D') ? true : false);
        this.ContractForm.get('showProfRules')?.setValue((res.d.RulesPrinciples == 'D') ? true : false);
        this.ContractForm.get('showWarrantPeriod')?.setValue((res.d.WarrantPeriod == 'D') ? true : false);
        this.ContractForm.get('showModernSkills')?.setValue((res.d.SkillsMethods == 'D') ? true : false);
        this.ContractForm.get('showTermsHours')?.setValue((res.d.WorkHours == 'D') ? true : false);
        this.ContractForm.get('showTermsFollow')?.setValue((res.d.Followup == 'D') ? true : false);
        this.ContractForm.get('showTermsInsp')?.setValue((res.d.Inspection == 'D') ? true : false);
        this.ContractForm.get('showTermsChart')?.setValue((res.d.SaveCharts == 'D') ? true : false);
        this.ContractForm.get('showTermsTrain')?.setValue((res.d.SaudiTraining == 'D') ? true : false);
        this.ContractForm.get('showTermsReport')?.setValue((res.d.WorkProgressReport == 'D') ? true : false);
        this.ContractForm.get('showFirstArb')?.setValue((res.d.Arbitrations_One == 'D') ? true : false);
        this.ContractForm.get('showSecondArb')?.setValue((res.d.Arbitrations_Two == 'D') ? true : false);
        this.ContractForm.get('showThirdArb')?.setValue((res.d.Arbitrations_Three == 'D') ? true : false);
        this.ContractForm.get('showFirstAgree')?.setValue((res.d.TermsOfAgrmt_one == 'D') ? true : false);
        this.ContractForm.get('showSecondAgree')?.setValue((res.d.TermsOfAgrmt_two == 'D') ? true : false);
        this.ContractForm.get('showThirdAgree')?.setValue((res.d.TermsOfAgrmt_three == 'D') ? true : false);

        this.ContractForm.get('showFirstBusiness')?.setValue((res.d.BussinessSubSec_one == 'D') ? true : false);
        this.ContractForm.get('showSecondBusiness')?.setValue((res.d.BussinessSubSec_two == 'D') ? true : false);
        this.ContractForm.get('showThirdBusiness')?.setValue((res.d.BussinessSubSec_three == 'D') ? true : false);

        this.ContractForm.get('showFirstWorkPro')?.setValue((res.d.WorkProgramme_one == 'D') ? true : false);
        this.ContractForm.get('showSecondWorkPro')?.setValue((res.d.WorkProgramme_two == 'D') ? true : false);
        this.ContractForm.get('showThirdWorkPro')?.setValue((res.d.WorkProgramme_three == 'D') ? true : false);
        this.ContractForm.get('showFourthWorkPro')?.setValue((res.d.WorkProgramme_four == 'D') ? true : false);

        // * Use checkDynamic function to check dynamic based on contract type

        // * In Framework Genereal (contractType == 'R') Invoice first, second and third didn't have
        // * dynamic toggle, default value is retrived from backend.

        // * The Invoice first, second and third should be set as dynamic as default for Framework Genereal (contractType == 'R')
        this.ContractForm.get('showFirstInvoice')?.setValue(this.checkDynamic('showFirstInvoice', res.d));
        this.ContractForm.get('showSecondInvoice')?.setValue(this.checkDynamic('showSecondInvoice', res.d));
        this.ContractForm.get('showThirdInvoice')?.setValue(this.checkDynamic('showThirdInvoice', res.d));

        this.ContractForm.get('showFirstPrices')?.setValue((res.d.ReferencePrices == 'D') ? true : false);
        this.ContractForm.get('showFirstBenef')?.setValue((res.d.Beneficiary == 'D') ? true : false);
        this.ContractForm.get('showPerfEval')?.setValue((res.d.ContPerfEval == 'D') ? true : false);

      });
  }

  // post APi call for the toggles (whether the text to be printed in PDF is static or dynamic)
  addDynTextInPDF() {
    let dataDyn = {
      data: {
        ContractNumber: this.award_number,
        Insurance: this.checkInsurance ? (this.ContractForm.controls['showDynamicInsurance'].value ? 'D' : 'S') : 'S',
        ScopeOfWork: this.checkScope ? (this.ContractForm.controls['showDynamicScope'].value ? 'D' : 'S') : 'S',
        Location: this.checkLocation ? (this.ContractForm.controls['showDynamicLocation'].value ? 'D' : 'S') : 'S',
        WorkSite: this.checkWorkSite ? (this.ContractForm.controls['showDynamicWorkSite'].value ? 'D' : 'S') : 'S',
        TeamSpecification: (this.checkSpecs && this.checkSpecsTeam) ? (this.ContractForm.controls['showSpecsTeam'].value ? 'D' : 'S') : 'S',
        MaterialSpecification: (this.checkSpecs && this.checkSpecsMat) ? (this.ContractForm.controls['showSpecsMat'].value ? 'D' : 'S') : 'S',
        EquipmentSpecification: (this.checkSpecs && this.checkSpecsEqui) ? (this.ContractForm.controls['showSpecsEqui'].value ? 'D' : 'S') : 'S',
        WorkCarryoutMethods: (this.checkSpecs && this.checkSpecsWork) ? (this.ContractForm.controls['showSpecsWork'].value ? 'D' : 'S') : 'S',
        QualitySpecification: (this.checkSpecs && this.checkSpecsQual) ? (this.ContractForm.controls['showSpecsQual'].value ? 'D' : 'S') : 'S',
        SafetySpec: (this.checkSpecs && this.checkSpecsSafety) ? (this.ContractForm.controls['showSpecsSafety'].value ? 'D' : 'S') : 'S',
        MandatoryTerms: (this.checkContent && this.checkContentMand) ? (this.ContractForm.controls['showContentMand'].value ? 'D' : 'S') : 'S',
        LocalContentRatio: (this.checkContent && this.checkContentRatio) ? (this.ContractForm.controls['showContentRatio'].value ? 'D' : 'S') : 'S',
        NationalProductsShare: (this.checkContent && this.checkContentShare) ? (this.ContractForm.controls['showContentShare'].value ? 'D' : 'S') : 'S',
        InsuranceRequirements: (this.checkTerms && this.checkTermsInsur) ? (this.ContractForm.controls['showTermsInsur'].value ? 'D' : 'S') : 'S',
        WarrantPeriod: (this.checkTerms && this.checkWarrantPeriod) ? (this.ContractForm.controls['showWarrantPeriod'].value ? 'D' : 'S') : 'S',
        SpecialConditions: (this.checkTerms && this.checkNatureSepclCond) ? (this.ContractForm.controls['showNatureSepclCond'].value ? 'D' : 'S') : 'S',
        SupportServices: (this.checkTerms && this.checkWorkSuppServ) ? (this.ContractForm.controls['showWorkSuppServ'].value ? 'D' : 'S') : 'S',
        ServiceProgRep: (this.checkTerms && this.checkServProgRep) ? (this.ContractForm.controls['showServProgRep'].value ? 'D' : 'S') : 'S',
        RulesPrinciples: (this.checkTerms && this.checkProfRules) ? (this.ContractForm.controls['showProfRules'].value ? 'D' : 'S') : 'S',
        SkillsMethods: (this.checkTerms && this.checkModernSkills) ? (this.ContractForm.controls['showModernSkills'].value ? 'D' : 'S') : 'S',
        WorkHours: (this.checkTerms && this.checkTermsHours) ? (this.ContractForm.controls['showTermsHours'].value ? 'D' : 'S') : 'S',
        Followup: (this.checkTerms && this.checkTermsFollow) ? (this.ContractForm.controls['showTermsFollow'].value ? 'D' : 'S') : 'S',
        Inspection: (this.checkTerms && this.checkTermsInsp) ? (this.ContractForm.controls['showTermsInsp'].value ? 'D' : 'S') : 'S',
        SaveCharts: (this.checkTerms && this.checkTermsChart) ? (this.ContractForm.controls['showTermsChart'].value ? 'D' : 'S') : 'S',
        SaudiTraining: (this.checkTerms && this.checkTermsTrain) ? (this.ContractForm.controls['showTermsTrain'].value ? 'D' : 'S') : 'S',
        WorkProgressReport: (this.checkTerms && this.checkTermsReport) ? (this.ContractForm.controls['showTermsReport'].value ? 'D' : 'S') : 'S',
        Arbitrations_One: this.checkFirstArb ? (this.ContractForm.controls['showFirstArb'].value ? 'D' : 'S') : 'S',
        Arbitrations_Two: this.checkSecondArb ? (this.ContractForm.controls['showSecondArb'].value ? 'D' : 'S') : 'S',
        Arbitrations_Three: this.checkThirdArb ? (this.ContractForm.controls['showThirdArb'].value ? 'D' : 'S') : 'S',
        TermsOfAgrmt_one: this.checkFirstAgree ? (this.ContractForm.controls['showFirstAgree'].value ? 'D' : 'S') : 'S',
        TermsOfAgrmt_two: this.checkSecondAgree ? (this.ContractForm.controls['showSecondAgree'].value ? 'D' : 'S') : 'S',
        TermsOfAgrmt_three: this.checkThirdAgree ? (this.ContractForm.controls['showThirdAgree'].value ? 'D' : 'S') : 'S',
        BussinessSubSec_one: this.checkFirstBusiness ? (this.ContractForm.controls['showFirstBusiness'].value ? 'D' : 'S') : 'S',
        BussinessSubSec_two: this.checkSecondBusiness ? (this.ContractForm.controls['showSecondBusiness'].value ? 'D' : 'S') : 'S',
        BussinessSubSec_three: this.checkThirdBusiness ? (this.ContractForm.controls['showThirdBusiness'].value ? 'D' : 'S') : 'S',
        WorkProgramme_one: this.checkFirstWorkPro ? (this.ContractForm.controls['showFirstWorkPro'].value ? 'D' : 'S') : 'S',
        WorkProgramme_two: this.checkSecondWorkPro ? (this.ContractForm.controls['showSecondWorkPro'].value ? 'D' : 'S') : 'S',
        WorkProgramme_three: this.checkThirdWorkPro ? (this.ContractForm.controls['showThirdWorkPro'].value ? 'D' : 'S') : 'S',
        WorkProgramme_four: this.checkFourthWorkPro ? (this.ContractForm.controls['showFourthWorkPro'].value ? 'D' : 'S') : 'S',
        Invoices_one: this.checkFirstInvoice ? (this.ContractForm.controls['showFirstInvoice'].value ? 'D' : 'S') : 'S',
        Invoices_two: this.checkSecondInvoice ? (this.ContractForm.controls['showSecondInvoice'].value ? 'D' : 'S') : 'S',
        Invoices_three: this.checkThirdInvoice ? (this.ContractForm.controls['showThirdInvoice'].value ? 'D' : 'S') : 'S',
        ReferencePrices: this.checkFirstPrices ? (this.ContractForm.controls['showFirstPrices'].value ? 'D' : 'S') : 'S',
        Beneficiary: this.checkFirstBenef ? (this.ContractForm.controls['showFirstBenef'].value ? 'D' : 'S') : 'S',
        ContPerfEval: this.checkPerfEval ? (this.ContractForm.controls['showPerfEval'].value ? 'D' : 'S') : 'S',


      }
    }
    this.api.post('addDynTextInPDF', dataDyn).subscribe((res) => {
      if (res == 201) {
        console.log("")
      }
    })
  }


  // get details API call
  getDetails(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    //api call for detail of contract
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    if (this.award_number) {
      const getCountryList = this.api.post("getCountryList", this.award_number);
      const getDetails = this.api.post("getDetails", { ...AwardNum, userName: this.ProxyUserId });
      const getPayment = this.api.post("getContractPayment", AwardNum);
      const getBankList = this.api.get("get-bank-list");
      const getFinalApproverList = this.committeeService.getFinalApproversList();
      forkJoin([getCountryList, getDetails, getPayment,getBankList, 
        getFinalApproverList]).subscribe(
        (result) => {
          let countryListRes = result[0];
          let detailsGetRes = result[1];
          let paymentDetails = result[2];
          let bankList = result[3];
          let finalApproverList = result[4];

          // * Set the data for Country list Get call
          if (countryListRes) {
            let list = countryListRes.d.results;
            this.detailedCountryList = countryListRes.d.results;
            list.forEach((l: any) => {
              if (l.Landx50En !== 'Saudi Arabia') {
                this.countryListAr.push(l.Landx50Ar);
                this.countryListEn.push(l.Landx50En);
              }
            })
            this.countryListAr.sort();
            this.countryListEn.sort();
            // console.log(this.countryListAr,this.countryListEn)
            if (this.cs.userLanguage == 'en') {
              this.countryList[0] = 'Saudi Arabia';
              this.countryList.push(...this.countryListEn);
              console.log(this.countryList)
            } else {
              this.countryList[0] = "السعودية";
              this.countryList.push(...this.countryListAr);
            }
          }

          // * Set the data for Details Get call
          if (detailsGetRes) {
            this.approvePayload = detailsGetRes.d;
            this.contractDetails = this.apiService.mappingDetails(detailsGetRes.d);
            this.mapObjectToForm(this.contractDetails);
            this.spinner.hide();
          }

          // * Set the data for Payment scheduled
          if (paymentDetails) {
            this.api.post("getContractPayment", AwardNum).subscribe(
              (res) => {
                console.log(res);
                this.listOfContPaymentData = res.d.results;
                this.mapObjectToFormContPayment(this.listOfContPaymentData);
              },
              (error) => {
                console.log(error);
              }
            );
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
      this.location.back();
      // this.router.navigateByUrl('contract/legalOfficerDashboard/ContPrep')
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', 'You have been redirected to contract list')
      } else {
        this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
      }

    }
  }

  // mapping function for contract details
  mapObjectToForm(obj: any) {
    console.log(obj)
    //contract form
    this.ContractForm.get('ProjectName')?.setValue(obj.ProjectName);
    this.ContractForm.get('ProjectType')?.setValue(obj.ProjectType);
    this.ContractForm.get('AwardNumber')?.setValue(obj.AwardNumber);
    this.ContractForm.get('PRnumber')?.setValue(obj.PRnumber);
    this.ContractForm.get('AwardDate')?.setValue(obj.AwardDate);
    this.ContractForm.get('VendorName')?.setValue(obj.VendorName);
    this.ContractForm.get('ProjectDuration')?.setValue(obj.ProjectDuration);
    this.ContractForm.get('ContractStartDate')?.setValue(obj.ContractStartDate ? (moment(obj.ContractStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    // let dateComing = new NgbDate(obj.ContractStartDate.split('/')[2], obj.ContractStartDate.split('/')[1], obj.ContractStartDate.split('/')[0])
    // const [day, month, year] = obj.ContractStartDate.split('/');
    // const obj1 = {
    //   year: parseInt(year), month: parseInt(month), day:
    //     parseInt(day)
    // };
    // this.ContractForm.get('ContractStartDate')?.setValue(obj1);
    this.ContractForm.get('RegNumber')?.setValue(obj.RegNumber);
    this.ContractForm.get('ProcessDescription')?.setValue(obj.ProcessDescription);
    this.ContractForm.get('Amount')?.setValue(obj.Amount);
    this.ContractForm.get('BidNumber')?.setValue(obj.BidNumber);
    this.ContractForm.get('DateOfBid')?.setValue(obj.DateOfBid);
    this.ContractForm.get('conAddress')?.setValue(obj.conAddress);
    this.ContractForm.get('conCity')?.setValue(obj.conCity);
    this.ContractForm.get('signCity')?.setValue(obj.signCity);
    this.ContractForm.get('FinalApproval')?.setValue(obj.FinalApproval)
    this.ContractForm.get('company')?.setValue(obj.company);
    // this.ContractForm.get('conCountry')?.setValue(obj.conCountry);
    this.ContractForm.get('conPhone')?.setValue(Number(obj.conPhone) != 0 ? Number(obj.conPhone) : '');
    this.ContractForm.get('mailBox')?.setValue(Number(obj.mailBox) != 0 ? Number(obj.mailBox) : '');
    this.ContractForm.get('postalCode')?.setValue(Number(obj.postalCode) != 0 ? Number(obj.postalCode) : '');
    this.ContractForm.get('eMail')?.setValue(obj.eMail);
    this.ContractForm.get('conBidNumber')?.setValue(Number(obj.conBidNumber) != 0 ? Number(obj.conBidNumber) : '');
    this.ContractForm.get('conDate')?.setValue(obj.conDate ? (moment(obj.conDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('conSignDate')?.setValue(obj.conSignDate ? (moment(obj.conSignDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('conSignDay')?.setValue('');
    // this.ContractForm.get('BankGuarantee')?.setValue(obj.BankGuarantee == 'Yes' ? true : false);
    this.ContractForm.get('GuranteeNumber')?.setValue(Number(obj.BgNum) != 0 ? Number(obj.BgNum) : '');
    this.ContractForm.get('GuranteePercent')?.setValue(Number(obj.BgPercent) != 0 ? Number(obj.BgPercent) : '')
    this.ContractForm.get('GuranteeAmount')?.setValue(this.cs.numberWithCommas(Number(obj.BgAmount) != 0 ? Number(obj.BgAmount) : ''));
    this.ContractForm.get('GuranteeIssuedBy')?.setValue(obj.BgIssuedBy);
    this.ContractForm.get('DateOfIssue')?.setValue(obj.BgDate ? (moment(obj.BgDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('ValidTill')?.setValue(obj.BgValid ? (moment(obj.BgValid, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('DeligateName')?.setValue(obj.DelName);
    // this.ContractForm.get('CommNation')?.setValue(obj.Nation);
    this.ContractForm.get('proofId')?.setValue(obj.IdType);
    this.ContractForm.get('NationalId')?.setValue(obj.NationalId);
    this.ContractForm.get('ResidenceNumber')?.setValue(obj.ResidenceId);
    this.ContractForm.get('PassportNumber')?.setValue(obj.PassportId);
    this.ContractForm.get('signAuth')?.setValue(obj.SignAuth);
    this.ContractForm.get('authLetterNumber')?.setValue(obj.AuthLetterNum);
    this.ContractForm.get('authLetterDate')?.setValue(obj.AuthLetterDate ? (moment(obj.AuthLetterDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('powerNumber')?.setValue(obj.PowerNum);
    this.ContractForm.get('powerDate')?.setValue(obj.PowerDate ? (moment(obj.PowerDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
    this.ContractForm.get('proFirst')?.setValue(obj.ProFirst);
    this.ContractForm.get('proSecond')?.setValue(obj.ProSecond);
    this.ContractForm.get('Downpayment')?.setValue(obj.DownPay == 'X' ? true : false);
    this.ContractForm.get('DurCompWrk')?.setValue(obj.TextDuration != '' ? true : false);
    this.ContractForm.get('downRate')?.setValue(Number(obj.DownRate) != 0 ? Number(obj.DownRate) : '');
    // this.ContractForm.get('downAmount')?.setValue(Number(obj.DownAmount));
    this.ContractForm.get('downAmount')?.setValue(this.cs.numberWithCommas(Number(obj.DownAmount) != 0 ? Number(obj.DownAmount) : ''));

    this.ContractForm.get('downPercent')?.setValue(Number(obj.DownPercent) != 0 ? Number(obj.DownPercent) : '');
    this.ContractForm.get('FineText')?.setValue(obj.PenalltyTxtBox);
    this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
    this.ContractForm.get('FinePercent')?.setValue(obj.PenaltyPercent);
    this.ContractForm.get('MtdCalcFines')?.setValue(obj.MtdCalcFines);
    this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);
    this.ContractForm.get('ExtractFirst')?.setValue(obj.ExtractFirst);
    this.ContractForm.get('ExtractSecond')?.setValue(obj.ExtractSecond);
    this.ContractForm.get('ExtractThird')?.setValue(obj.ExtractThird);
    this.ContractForm.get('TableQP')?.setValue(obj.QuantPrice);
    this.ContractForm.get('Insurance')?.setValue(obj.Insurance);
    this.ContractForm.get('Location')?.setValue(obj.Location);
    this.ContractForm.get('WorkSite')?.setValue(obj.WorkSite);
    this.ContractForm.get('WorkScope')?.setValue(obj.WorkScope);
    this.ContractForm.get('ExePlace')?.setValue(obj.ExePlace);
    this.ContractForm.get('SpecsTeam')?.setValue(obj.SpecsTeam);
    this.ContractForm.get('SpecsMat')?.setValue(obj.SpecsMat);
    this.ContractForm.get('SpecsEqui')?.setValue(obj.SpecsEqui);
    this.ContractForm.get('SpecsWork')?.setValue(obj.SpecsWork);
    this.ContractForm.get('SpecsQual')?.setValue(obj.SpecsQual);
    this.ContractForm.get('SpecsSafety')?.setValue(obj.SpecsSafety);

    this.ContractForm.get('ContentMand')?.setValue(obj.ContentMand);
    this.ContractForm.get('ContentRatio')?.setValue(obj.ContentRatio);
    this.ContractForm.get('ContentShare')?.setValue(obj.ContentShare);

    this.ContractForm.get('TermsInsur')?.setValue(obj.TermsInsur);
    this.ContractForm.get('NatureSepclCond')?.setValue(obj.NatureSepclCond);
    this.ContractForm.get('WorkSuppServ')?.setValue(obj.WorkSuppServ);
    this.ContractForm.get('ServProgRep')?.setValue(obj.ServProgRep);
    this.ContractForm.get('ProfRules')?.setValue(obj.ProfRules);
    this.ContractForm.get('WarrantPeriod')?.setValue(obj.WarrantPeriod);
    this.ContractForm.get('ModernSkills')?.setValue(obj.ModernSkills);
    this.ContractForm.get('TermsHours')?.setValue(obj.TermsHours);
    this.ContractForm.get('TermsFollow')?.setValue(obj.TermsFollow);
    this.ContractForm.get('TermsInsp')?.setValue(obj.TermsInsp);
    this.ContractForm.get('TermsChart')?.setValue(obj.TermsChart);
    this.ContractForm.get('TermsTrain')?.setValue(obj.TermsTrain);
    this.ContractForm.get('TermsReport')?.setValue(obj.TermsReport);
    this.ContractForm.get('Accessories')?.setValue(obj.Appendix);
    this.ContractForm.get('PaySchedule')?.setValue(obj.PayText);
    this.ContractForm.get('durationWork')?.setValue(obj.TextDuration);
    this.ContractForm.get('EvaluationPeriod')?.setValue(obj.EvalPeriod);
    this.ContractForm.get('Comment')?.setValue(obj.Comment);

    this.ContractForm.get('RetentionPeriod')?.setValue(obj.RetentionPeriod);
    this.ContractForm.get('RenewalDays')?.setValue(obj.RenewalDays);
    this.ContractForm.get('FirstArb')?.setValue(obj.ArbitrationFirst);
    this.ContractForm.get('SecondArb')?.setValue(obj.ArbitrationSecond);
    this.ContractForm.get('ThirdArb')?.setValue(obj.ArbitrationThird);
    this.ContractForm.get('ResponsePeriod')?.setValue(obj.ResponsePeriod);
    this.ContractForm.get('PurResponseTime')?.setValue(obj.ResponseTime);
    this.ContractForm.get('AgreePeriod')?.setValue(obj.AgreePeriod);
    this.ContractForm.get('NumberOfParties')?.setValue(obj.NumberOfParties);
    this.ContractForm.get('ReplacePeriod')?.setValue(obj.ReplacePeriod);
    this.ContractForm.get('FirstAgree')?.setValue(obj.TermsAgrFirst);
    this.ContractForm.get('SecondAgree')?.setValue(obj.TermsAgrSecond);
    this.ContractForm.get('ThirdAgree')?.setValue(obj.TermsAgrThird);

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
    this.ContractForm.get('PerfEval')?.setValue(obj.PerfEval);
    this.ContractForm.get('DaysForAction')?.setValue(Number(obj.DaysForAction) != 0 ? Number(obj.DaysForAction) : '');

    // set country name from country code
    this.detailedCountryList.forEach((country: any) => {
      if (obj.Nation == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['CommNation'].setValue(country.Landx50Ar);
        } else {
          this.ContractForm.controls['CommNation'].setValue(country.Landx50En);
        }
        console.log(this.ContractForm.controls['CommNation'].value);
      }
    })

    // set contractor's country name from country code
    this.detailedCountryList.forEach((country: any) => {
      if (obj.conCountry == country.Land1) {
        if (this.cs.userLanguage == 'ar') {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50Ar);
        } else {
          this.ContractForm.controls['conCountry'].setValue(country.Landx50En);
        }
        console.log(this.ContractForm.controls['conCountry'].value)
      }
    })

    this.isCommNum = obj.RegType == 'C' ? true : false;

    if (this.cs.userLanguage == 'ar') {
      this.ContractForm.get('AmountInWords')?.setValue(obj.AmountInAr);
    } else {
      this.ContractForm.get('AmountInWords')?.setValue(obj.AmountInEn);
    }

    if (obj.AuthSelect == 'C') {
      if (this.cs.userLanguage == 'en') {
        this.auth = "Authorization letter certified by chamber of commerce and Industry";
      } else {
        this.auth = "خطاب مصادقة معتمد من الغرفة التجارية"
      }
      this.ContractForm.get('authLetter')?.setValue(1)
    }

    if (obj.AuthSelect == 'A') {
      if (this.cs.userLanguage == 'en') {
        this.auth = "The power of attorney issued by a notary public";
      } else {
        this.auth = "التوكيل الصادر عن كاتب العدل"
      }
      this.ContractForm.get('authLetter')?.setValue(2)
    }

    this.contractType = obj.ContractType;

    //  this.ContractForm.get('FineFirst')?.value !='' ? this.ContractForm.get('FineFirst')?.setValue(this.ContractForm.get('FineFirst')?.value) : this.ContractForm.get('FineFirst')?.setValue(this.getFirstDefalultValues(obj.ContractType));

    // if (obj.EvalPeriod == 'M') {
    //   this.ContractForm.get('EvaluationPeriod')?.setValue('Monthly')
    // } else if (obj.EvalPeriod == 'Q') {
    //   this.ContractForm.get('EvaluationPeriod')?.setValue('Quarterly')
    // } else if (obj.EvalPeriod == 'H') {
    //   this.ContractForm.get('EvaluationPeriod')?.setValue('Half-Yearly')
    // } else if (obj.EvalPeriod == 'A') {
    //   this.ContractForm.get('EvaluationPeriod')?.setValue('Annual')
    // }
  }


  // get API call for the list of department for Contract PDF delivered to (Copy of contract section on UI)
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
            "serialNo": l.serialNo,
            "awardNumber": this.award_number,
            "department": l.department,
            "flag": (l.flag == 'X') ? true : false
          }
          if (item.flag == false) {
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

  // post API call for the list of department for Contract PDF delivered to (Copy of contract section on UI)
  sendDeptCopyTo() {
    let list: any = JSON.parse(JSON.stringify(this.copyToList));
    list.forEach((c: any) => {
      if (c.flag) {

        c.flag = 'X';
      } else {
        c.flag = '';
      }
    })

    let payloadData = {
      "awardNumber": this.award_number,
      "department": list
    }
    this.api.post('putDeptCopy', payloadData).subscribe(
      (res) => {
        console.log(res);
      });
  }

  // download contract PDF APi call
  downloadPDF(flag: any) {
    this.apiService.downloadPDF(flag, this.award_number, this.contractType);
  }


  copyChecked(event: any, i: any) {
    this.copyToList[i].flag = event.target.checked;
    this.selectAll = this.copyToList.every(i => i.flag);

  }

  //** Contractor Evaluation starts **//
  getContEvaluation(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }

    this.api.post("getContEvaluation", AwardNum).subscribe(
      (res) => {
        this.listOfContEvaluationData = res.d.results;
        this.mapObjectToFormContEvaluation(this.listOfContEvaluationData);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  mapObjectToFormContEvaluation(data: any) {
    const ContEvaluation = this.ContractForm.get('ContEvaluation') as FormArray;
    this.ContEvaluation.clear();
    data.forEach((item: any) => {
      ContEvaluation.push(
        new FormGroup({
          AwardNum: new FormControl(this.award_number),
          EvalId: new FormControl(item.EvalId),
          EvalDate: new FormControl((moment(item.EvalDate, 'DD.MM.YYYY').format('YYYY-MM-DD')), Validators.required),
        })
      )
    });
    // console.log(this.ContractForm.controls['ManPower'].value);
  }
  addContEvaluation() {
    const ContEvaluation = this.ContractForm.get('ContEvaluation') as FormArray;
    ContEvaluation.push(
      new FormGroup({
        AwardNum: new FormControl(this.award_number),
        EvalId: new FormControl((ContEvaluation.value.length + 1).toString()),
        EvalDate: new FormControl('', Validators.required)
      })
    )
  }
  deleteContEvaluation(index: any) {
    const add = this.ContractForm.get('ContEvaluation') as FormArray;
    add.removeAt(index);
    // * Remove the item from the final list - if the item is saved
    if (this.listOfContEvaluationData[index]) {
      this.listOfContEvaluationData = this.listOfContEvaluationData.filter(item => item !== this.listOfContEvaluationData[index]);
    }
    if (this.cs.userLanguage == 'en') {
      this.message.create('success', 'Contractor evaluation removed successfully');
    } else {
      this.message.create('success', 'تمت إزالة تقييم المتعاقد بنجاح');
    }

    this.checkEvalDate(null, null, true);

  }
  resetContEvaluation(index: any) {
    this.ContEvaluation.at(index).patchValue(this.listOfContEvaluationData[index]);
  }

  checkEvalDate(date: any, index: any, itemRemoved = false) {
    if (!itemRemoved) {
      const dateExist = this.listOfContEvaluationData.findIndex(
        (i, key) =>
          i.EvalDate === moment(date).format('DD.MM.YYYY') && key !== index
      );
      if (dateExist !== -1) {
        this.showEvalDateError = true;
      } else {
        this.showEvalDateError = false;
      }
    } else {
      this.showEvalDateError = false;
    }
  }

  saveContEvaluation(index: any) {
    this.spinner.show();
    if (this.ContEvaluation.at(index).valid) {
      this.ContEvaluation.at(index).value.EvalDate = moment(this.ContEvaluation.at(index).value.EvalDate, 'YYYY-MM-DD').format('DD.MM.YYYY').toString();
      let ContEvaluation = this.ContEvaluation.at(index).value;
      // delete ContEvaluation.IsNewAdded
      this.listOfContEvaluationData[index] = ContEvaluation;
      if (this.cs.userLanguage == 'en') {
        this.spinner.hide();
        this.message.create('success', 'Contractor evaluation saved successfully');

      } else {
        this.spinner.hide();
        this.message.create('success', 'تم حفظ تقييم المتعاقد بنجاح')
      }
    }
    this.listOfContEvaluationData.forEach((data: any) => {
      delete data.EvalId
      delete data.__metadata
    })

    // this.EvaluationDate = [];
    // const ContEvaluation = this.ContractForm.get('ContEvaluation') as FormArray;
    // for (let evaluation of ContEvaluation.controls) {
    //   let dates = moment(evaluation.value.EvalDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
    //   this.EvaluationDate.push(dates);
    // }
    // this.checkEvalDate()

  }

  submitContEvaluation() {
    let payloadData = {
      "AwardNum": this.award_number,
      "EvaluationPeriod": this.listOfContEvaluationData
    }

    this.api.post('putContEvaluation', payloadData).subscribe(
      (res) => {
        console.log(res);
      });
  }
  //** Contractor Evaluation ends **//


  //** Manpower starts **//
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
          ExpBasicHr: new FormControl(item.ExpBasicHr, Validators.required),
          ItemNo: new FormControl({ value: i.toString(), disabled: true }, Validators.required),
          JobTitle: new FormControl(item.JobTitle, Validators.required),
          SpeExp: new FormControl(item.SpeExp, Validators.required)
        })
      )
      i++;
    });
    // console.log(this.ContractForm.controls['ManPower'].value);
  }
  // i = 0; j = 0
  addManPower(manPowr: any) {

    const ManPower = this.ContractForm.get('ManPower') as FormArray;

    ManPower.push(
      new FormGroup({
        AwardNum: new FormControl(this.award_number),
        ExpBasicHr: new FormControl('', Validators.required),
        ItemNo: new FormControl({ value: (ManPower.value.length + 1).toString(), disabled: true }, Validators.required),
        JobTitle: new FormControl('', Validators.required),
        SpeExp: new FormControl('', Validators.required),
        IsNewAdded: new FormControl('Y')
      })
    );
  }

  onPageIndexChange(pageIndex: any | null) {
    console.log(pageIndex)
    this.pageIndex.emit(pageIndex);
    this.pageIndexx = pageIndex;
  }

  deleteManPower(index: any) {
    const add = this.ContractForm.get('ManPower') as FormArray;
    add.removeAt(index);

    this.listOfManPowerData = this.ContractForm.get('ManPower')?.value;
    this.mapObjectToFormManPower(this.listOfManPowerData);
    // * Call Man Power delete api
    if (this.cs.userLanguage == 'en') {
      this.message.create('success', 'ManPower removed successfully');
    } else {
      this.message.create('success', 'تمت إزالة مواصفات فريق العمل بنجاح')
    }


  }
  resetManPower(index: any) {
    this.Manpower.at(index).patchValue(this.listOfManPowerData[index]);
  }

  // * Man power data Post call
  saveManPower(index: any) {
    this.spinner.show();
    if (this.Manpower.at(index).valid) {
      let manPower = this.Manpower.at(index).value;
      // this.Manpower.at(index).value.ItemNo = this.Manpower.at(index).value.ItemNo.toString();
      delete manPower.IsNewAdded
      this.listOfManPowerData[index] = manPower;
      if (this.cs.userLanguage == 'en') {
        this.spinner.hide();
        this.message.create('success', 'ManPower saved successfully');

      } else {
        this.spinner.hide();
        this.message.create('success', 'تم حفظ مواصفات فريق العمل بنجاح')
      }
    }
  }

  submitManPower() {
    let payloadData = {
      "AwardNum": this.award_number,
      "manpower": this.listOfManPowerData

    }
    this.api.post('putManPower', payloadData).subscribe(
      (res) => {
        console.log(res);
      });
  }

  //** Manpower ends **//



  //** Contract Payment schedule starts **//
  // getContractPayment(award_number: any) {
  //   let AwardNum = {
  //     "award_number": award_number
  //   }
  //   this.api.post("getContractPayment", AwardNum).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.listOfContPaymentData = res.d.results;
  //       this.mapObjectToFormContPayment(this.listOfContPaymentData);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  mapObjectToFormContPayment(data: any) {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    ContPayment.clear();
    let i = 1;
    let totalAmount = Number(this.ContractForm.controls['Amount'].value);
    data.forEach((item: any) => {
      ContPayment.push(
        new FormGroup({
          ContractNo: new FormControl(item.ContractNo),
          Descr: new FormControl(item.Descr, Validators.required),
          ItemNo: new FormControl({ value: i.toString(), disabled: true }, Validators.required),
          Percentage: new FormControl(item.Percentage, Validators.required),
          PayAmount: new FormControl({ value: (((Number(item.Percentage) / 100) * totalAmount).toFixed(2)).toLocaleString(), disabled: true }, Validators.required),
        })
      )
      i++;
    });

    let totalPercent = 0;
    for (let pay of ContPayment.controls) {
      totalPercent += Number(pay.value.Percentage);
    }
    this.totalPercentage = totalPercent;
    this.calculateAmountBasedOnPercent('Draft');
  }

  checkPayPercent(i: any) {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    let totalPercent = 0;
    for (let pay of ContPayment.controls) {
      totalPercent += Number(pay.value.Percentage);
    }
    // * Setting the value of amount based on percentage (index passed)
    this.calculateAmountBasedOnPercent(i);

    this.totalPercentage = totalPercent;
    if (totalPercent > 100) {
      this.showPayError = true;
      this.showNewSchedule = true;
      // setTimeout(() => {
      //   this.showPayError = false;
      // }, 5000);
    } else {
      this.showPayError = false;
      this.showNewSchedule = false;
    }
  }
  addContPayment() {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    let totalPercent = 0;
    for (let pay of ContPayment.controls) {
      totalPercent += Number(pay.value.Percentage);
    }
    this.totalPercentage = totalPercent;
    if (totalPercent >= 100) {
      this.showNewSchedule = true;
    } else {
      this.showNewSchedule = false;
    }
    if (!this.showNewSchedule) {
      const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
      ContPayment.push(
        new FormGroup({
          ContractNo: new FormControl(''),
          Descr: new FormControl('', Validators.required),
          ItemNo: new FormControl({ value: (ContPayment.value.length + 1).toString(), disabled: true }, Validators.required),
          Percentage: new FormControl('', [Validators.required]),
          PayAmount: new FormControl({ value: 0, disabled: true }, Validators.required),
          IsNewAdded: new FormControl('Y')
        })
      )
      this.showError = false;
    }

  }
  deleteContPayment(index: any) {
    const add = this.ContractForm.get('ContPayment') as FormArray;
    add.removeAt(index);
    this.listOfContPaymentData = this.ContractForm.get('ContPayment')?.value;
    this.mapObjectToFormContPayment(this.listOfContPaymentData);
    if (this.cs.userLanguage == 'en') {
      this.message.create('success', 'Payment Schedule removed successfully');
    } else {
      this.message.create('success', 'تمت إزالة جدول الدفع بنجاح')
    }
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    let totalPercent = 0;
    for (let pay of ContPayment.controls) {
      totalPercent += Number(pay.value.Percentage);
    }
    this.totalPercentage = totalPercent;
    if (totalPercent > 100) {
      this.showPayError = true;
      this.showNewSchedule = true;
      // setTimeout(() => {
      //   this.showPayError = false;
      // }, 5000);
    } else {
      this.showPayError = false;
      this.showNewSchedule = false;
    }
  }
  resetContPayment(index: any) {
    // this.ContPayment.at(index).patchValue(this.listOfContPaymentData[index]);
    let OrgData = this.listOfContPaymentData[index];
    let ChangeData = this.ContPayment.at(index);
    console.log(ChangeData.value);
    var mapData = {
      "ContractNo": OrgData.ContractNo,
      "Descr": OrgData.Descr,
      "ItemNo": OrgData.ItemNo,
      "Percentage": OrgData.Percentage
    }
    ChangeData.setValue(mapData);
  }

  // * Payment data Post call
  savePayment(index: any) {
    this.spinner.show();
    let totalPercent = 0;
    if (this.ContPayment.at(index).valid) {
      this.ContPayment.at(index).value.Percentage = this.ContPayment.at(index).value.Percentage.toString();
      // this.ContPayment.at(index).value.ItemNo = this.ContPayment.at(index).value.ItemNo.toString();
      this.ContPayment.at(index).value.ContractNo = this.award_number;
      let payment = this.ContPayment.at(index).value;
      delete payment.IsNewAdded
      this.listOfContPaymentData[index] = payment;
      if (this.cs.userLanguage == 'en') {
        this.spinner.hide();
        this.message.create('success', 'Paymemt Schedule saved successfully');

      } else {
        this.spinner.hide();
        this.message.create('success', 'تم حفظ جدول الدفع بنجاح')
      }
    }
  }

  submitPaySchedule() {
    let payloadData = {
      "ContractNo": this.award_number,
      "payment": this.listOfContPaymentData
    }
    this.api.post('putPayment', payloadData).subscribe(
      (res) => {
        console.log(res);
      });
  }

  //** Contract Payment schedule ends **//

  get Manpower() {
    return this.ContractForm.get('ManPower') as FormArray;
  }
  get ContPayment() {
    return this.ContractForm.get('ContPayment') as FormArray;
  }
  get ContEvaluation() {
    return this.ContractForm.get('ContEvaluation') as FormArray;
  }

  // Populate downpayment amount
  populateAmount(value: any) {
    // this.isValidDownRate = false;
    if (this.ContractForm.get('downPercent')?.value < Number(value)) {
      this.isValidDownRate = true;
      this.ContractForm.controls['downRate'].setValue(this.ContractForm.get('downPercent')?.value)
    }
    value = this.ContractForm.get('downRate')?.value
    let total = this.ContractForm.get('Amount')?.value;
    let percentageAmt = (total * value) / 100;
    this.ContractForm.get('downAmount')?.setValue(this.cs.numberWithCommas(percentageAmt.toFixed(2)));
  }

  // Populate downpayment percent
  populatePercent(value: any) {
    if (Number(this.ContractForm.get('Amount')?.value) <= Number(this.cs.removeCommas(value))) {
      this.ContractForm.controls['downAmount'].setValue(this.cs.numberWithCommas(this.ContractForm.get('Amount')?.value))
    } else {
      this.ContractForm.controls['downAmount'].setValue(
        this.cs.numberWithCommas(
          this.cs.removeCommas(value) == "" ? "" :
            this.cs.removeCommas(value)
        )
      );
    }
    value = this.cs.removeCommas(this.ContractForm.get('downAmount')?.value);
    let total = Number(this.ContractForm.get('Amount')?.value);
    let percentage = ((value * 100) / total).toFixed(2);
    if (Number(this.ContractForm.get('downPercent')?.value) < Number(percentage)) {
      this.ContractForm.controls['downRate'].setValue(this.ContractForm.get('downPercent')?.value);
      this.ContractForm.controls['downAmount'].setValue(this.cs.numberWithCommas(this.ContractForm.get('Amount')?.value))
    } else {
      this.ContractForm.get('downRate')?.setValue(Number(percentage).toFixed(2));
    }
  }

  // populate bank gurantee amount
  populateGurantee(value: any) {
    if (Number(this.ContractForm.get('Amount')?.value) <= Number(this.cs.removeCommas(value))) {
      this.ContractForm.controls['GuranteeAmount'].setValue(
        this.cs.numberWithCommas(
          Number(this.ContractForm.get('Amount')?.value)
        )
      );
    } else {
      this.ContractForm.controls['GuranteeAmount'].setValue(
        this.cs.numberWithCommas(
          this.cs.removeCommas(value) == "" ? "" :
            this.cs.removeCommas(value)
        )
      );
    }


    // if (Number(this.ContractForm.get('Amount')?.value) <= value) {
    //   this.ContractForm.controls['GuranteeAmount'].setValue(Number(this.ContractForm.get('Amount')?.value))
    // }
    // value = this.ContractForm.get('GuranteeAmount')?.value;
    // this.this.ContractForm.controls['GuranteeAmount'].setValue
  }
  isNumberKey(evt: any): boolean {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  // populateAdvance(value: any) {
  //   this.isValidDownRate = false;
  //   if (this.ContractForm.get('downRate')?.value >= value) {
  //     // this.ContractForm.controls['downRate'].setValue(this.ContractForm.get('downPercent')?.value)
  //     this.isValidDownRate = true;
  //     // let total = this.ContractForm.get('Amount')?.value;
  //     // let percentageAmt = (total * value) / 100;
  //     // this.ContractForm.get('downAmount')?.setValue(percentageAmt);
  //   }
  // }

  backToDashboard() {
    this.location.back();
    // this.router.navigateByUrl('contract/legalOfficerDashboard/ContPrep')
  }

  initialValidators() {
    this.setEvaluationValidater();
    this.setPenaltiesValidater();
    this.setTermsValidators();
    this.setContentValidators();
    this.setPlaceValidators();
    // this.setScopeValidators();
    this.setSpecsValidators();
    this.setTableQuantValidater();
    this.setExtractsValidater();
    this.setAppendixValidators();
  }

  setValidators() {
    if (this.ContractForm.get('proofId')?.value == 'N') {
      this.ContractForm.get('NationalId')?.setValidators([Validators.required]);
      this.ContractForm.get('ResidenceNumber')?.setErrors(null);
      this.ContractForm.get('PassportNumber')?.setErrors(null);
    } else if (this.ContractForm.get('proofId')?.value == 'R') {
      this.ContractForm.get('ResidenceNumber')?.setValidators([Validators.required]);
      this.ContractForm.get('NationalId')?.setErrors(null);
      this.ContractForm.get('PassportNumber')?.setErrors(null);
    } else if (this.ContractForm.get('proofId')?.value == 'P') {
      this.ContractForm.get('PassportNumber')?.setValidators([Validators.required]);
      this.ContractForm.get('NationalId')?.setErrors(null);
      this.ContractForm.get('ResidenceNumber')?.setErrors(null);
    }

    // if (this.ContractForm.get('BankGuarantee')?.value) {
    //   this.ContractForm.controls['GuranteeNumber'].setValidators([Validators.required]);
    //   this.ContractForm.controls['GuranteePercent'].setValidators([Validators.required]);
    //   this.ContractForm.controls['GuranteeAmount'].setValidators([Validators.required]);
    //   this.ContractForm.controls['GuranteeIssuedBy'].setValidators([Validators.required]);
    //   this.ContractForm.controls['DateOfIssue'].setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.controls['GuranteeNumber'].removeValidators;
    //   this.ContractForm.controls['GuranteePercent'].removeValidators;
    //   this.ContractForm.controls['GuranteeAmount'].removeValidators;
    //   this.ContractForm.controls['GuranteeIssuedBy'].removeValidators;
    //   this.ContractForm.controls['DateOfIssue'].removeValidators;
    // }
    if (this.ContractForm.get('Downpayment')?.value && this.contractType != 'F') {
      this.ContractForm.get('downRate')?.setValidators([Validators.required]);
      this.ContractForm.get('downAmount')?.setValidators([Validators.required]);
      this.ContractForm.get('downPercent')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('downRate')?.setErrors(null);
      this.ContractForm.get('downAmount')?.setErrors(null);
      this.ContractForm.get('downPercent')?.setErrors(null);
    }

    if (this.ContractForm.get('authLetter')?.value == 1) {
      this.ContractForm.controls['authLetterNumber'].setValidators([Validators.required]);
      this.ContractForm.controls['authLetterDate'].setValidators([Validators.required]);
    } else {
      this.ContractForm.get('authLetterNumber')?.clearValidators();
      this.ContractForm.get('authLetterNumber')?.setErrors(null);
      this.ContractForm.get('authLetterNumber')?.updateValueAndValidity();

      // this.ContractForm.controls['authLetterDate'].clearValidators();
      this.ContractForm.get('authLetterDate')?.clearValidators();
      this.ContractForm.get('authLetterDate')?.setErrors(null);
      this.ContractForm.get('authLetterDate')?.updateValueAndValidity();
    }

    if (this.ContractForm.get('authLetter')?.value == 2) {
      this.ContractForm.controls['powerNumber'].setValidators([Validators.required]);
      this.ContractForm.controls['powerDate'].setValidators([Validators.required]);
    } else {
      this.ContractForm.get('powerNumber')?.clearValidators();
      this.ContractForm.get('powerNumber')?.setErrors(null);
      this.ContractForm.get('powerNumber')?.updateValueAndValidity();

      this.ContractForm.get('powerDate')?.clearValidators();
      this.ContractForm.get('powerDate')?.setErrors(null);
      this.ContractForm.get('powerDate')?.updateValueAndValidity();
    }

  }

  // Validation pop-up field data population function
  getFormErrors() {
    let mandatory = '';
    if (this.cs.userLanguage == 'en') {
      mandatory = 'is required'
    } else {
      mandatory = 'مطلوب'
    }
    this.errorList = [];
    Object.keys(this.ContractForm.controls).forEach(key => {
      const controlErrors = this.ContractForm?.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          this.errorList.push(this.getStandardFormName(key) + " " + mandatory);
        });
      }
    });
  }

  cancelContract() {
    this.checkCancel = !this.checkCancel;
  }

  // Approve contract API call
  approve(status: any) {
    this.spinner.show();
    let flagVar = '';
    let commentAdded = '';
    let conStatus = this.approvePayload.ContreqStatus;
    this.ContractForm.markAllAsTouched();
    if (status == "approve") {
      commentAdded = '';
      if (this.checkCancel) {
        this.ContractForm.clearValidators();
        flagVar = "CCL";
      } else {
        flagVar = "APP"
      }
    } else if (status == "save") {
      this.ContractForm.clearValidators();
      flagVar = "DRAFT"
      commentAdded = this.ContractForm.controls['Comment'].value
    } else if (status == "CUO") {
      flagVar = "PROC_REV";
    } else if (status == "RFP") {
      flagVar = "INFO_REV"
    }

    if ((status == "approve" || status == "CUO" || status == "RFP") && !this.checkCancel) {


      this.setValidators();
      this.initialValidators();

      this.getFormErrors();
      if (this.errorList.length > 0) {
        this.spinner.hide();
        if (this.cs.userLanguage == 'en') {
          this.message.create('error', 'Please fill all required fields')
        } else {
          this.message.create('error', 'يرجى تعبئة جميع الحقول المطلوبة')
        }
        this.showError = true;
        return;
      } else {
        // * Shows error if the payment schedule total is not 100

        // * Unsaved data in table
        const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
        let totalPercentNotSaved = 0;
        for (let pay of ContPayment.controls) {
          totalPercentNotSaved += Number(pay.value.Percentage);
        }

        // * Saved data in table
        let totalPercent = 0;
        for (let pay of this.listOfContPaymentData) {
          totalPercent += Number(pay.Percentage);
        }

        // * Shows warning if the data is not saved
        if (totalPercentNotSaved == 100 && totalPercent < 100) {
          if (this.cs.userLanguage == 'en') {
            this.message.create('error', 'Kindly save all payment schedule records!');
          } else {
            this.message.create('error', '! الرجاء حفظ جميع الحقول لجدول الدفعات');
          }
          this.spinner.hide();
          return;
        }

        // * Shows warning if the saved data is not equal to 100 %
        if (totalPercent != 100) {
          if (this.cs.userLanguage == 'en') {
            this.message.create('error', 'Payment schedule total value should be 100');
          } else {
            this.message.create('error', 'يجب أن تكون القيمة الإجمالية لجدول الدفعات 100');
          }
          this.spinner.hide();
          return;
        }
      }
    }
    // console.log("this.getFormErrors: ", );
    // return

    let contStartDate = this.ContractForm.controls['ContractStartDate'].value;
    // let contStart = this.ContractForm.controls['ContractStartDate'].value;
    // let contStartDate = contStart.year + "-" + contStart.month + "-" + contStart.day;
    let bankGuarDate = this.ContractForm.controls['DateOfIssue'].value;
    let bankValidDate = this.ContractForm.controls['ValidTill'].value;
    let authDate = this.ContractForm.controls['authLetterDate'].value;
    let contDate = this.ContractForm.controls['conDate'].value;
    let signDate = this.ContractForm.controls['conSignDate'].value;
    let powerAttDate = this.ContractForm.controls['powerDate'].value;

    // if (!this.ContractForm.controls['BankGuarantee'].value) {
    //   this.ContractForm.get('GuranteeNumber')?.setValue("");
    //   this.ContractForm.get('GuranteePercent')?.setValue("");
    //   this.ContractForm.get('GuranteeAmount')?.setValue("");
    //   this.ContractForm.get('GuranteeIssuedBy')?.setValue("");
    // }

    let authorization = '';
    if (this.ContractForm.controls['authLetter'].value == 1) {
      authorization = 'C';
    } else if (this.ContractForm.controls['authLetter'].value == 2) {
      authorization = 'A';
    }

    if (!this.ContractForm.controls['Downpayment'].value) {
      this.ContractForm.get('downRate')?.setValue("");
      this.ContractForm.get('downAmount')?.setValue("");
      this.ContractForm.get('downPercent')?.setValue("");
    }

    //Country code assignment
    let CommNationality = '';
    this.detailedCountryList.forEach((country: any) => {
      if (this.ContractForm.controls['CommNation'].value == country.Landx50En || this.ContractForm.controls['CommNation'].value == country.Landx50Ar) {
        // this.ContPayment.get('CommNation')?.setValue(country.Land1)
        CommNationality = country.Land1;
      }
    })

    //Contract Country code assignment
    let ContractCountry = '';
    this.detailedCountryList.forEach((country: any) => {
      if (this.ContractForm.controls['conCountry'].value == country.Landx50En || this.ContractForm.controls['conCountry'].value == country.Landx50Ar) {
        // this.ContPayment.get('CommNation')?.setValue(country.Land1)
        ContractCountry = country.Land1;
      }
    })

    let payload = {
      Flag: flagVar,
      ContUoUsrId: this.approvePayload.ContUoUsrId,
      LglOffcierUsrId: this.approvePayload.LglOffcierUsrId,
      AwardNum: this.approvePayload.AwardNum,
      ProjName: this.approvePayload.ProjName,
      ProjType: this.approvePayload.ProjType,
      ProjNo: this.approvePayload.ProjNo,
      VendorID: this.approvePayload.VendorID,
      VNDRREGTYPE: this.approvePayload.VNDRREGTYPE,
      VendorName: this.approvePayload.VendorName,
      PurreqNum: this.approvePayload.PurreqNum,
      ContreqStatus: this.approvePayload.ContreqStatus,
      AwardDate: this.approvePayload.AwardDate,
      AwardTime: this.approvePayload.AwardTime,
      Assignee: this.approvePayload.Assignee,
      ContStartDate: contStartDate ? (moment(contStartDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      CommRegNum: this.approvePayload.CommRegNum,
      BriefDescr: this.approvePayload.BriefDescr,
      TotalValue: this.approvePayload.TotalValue,
      TotalAmtEn: this.approvePayload.TotalAmtEn,
      TotalAmtAr: this.approvePayload.TotalAmtAr,
      Attachment: "",
      ContUh: this.approvePayload.ContUh,
      ContUo: this.approvePayload.ContUo,
      ContStatus: this.approvePayload.ContStatus,
      LglUnitHead: this.approvePayload.LglUnitHead,
      LglOffcier: this.approvePayload.LglOffcier,
      LglManager: this.approvePayload.LglManager,
      PurContHead: this.approvePayload.PurContHead,
      PurContRm: this.approvePayload.PurContRm,
      PurContPcm: this.approvePayload.PurContPcm,
      PurContSsd: this.approvePayload.PurContSsd,
      PurContVpcs: this.approvePayload.PurContVpcs,
      RespBidNum: this.approvePayload.RespBidNum,
      RespBidNumDt: this.approvePayload.RespBidNumDt,
      CreatedDate: this.approvePayload.CreatedDate,
      CreatedTime: this.approvePayload.CreatedTime,
      CreatedBy: this.approvePayload.CreatedBy,
      CancelledDate: this.approvePayload.CancelledDate,
      CancelledTime: this.approvePayload.CancelledTime,
      CancelledBy: this.approvePayload.CancelledBy,
      BankGuarantee: 'Yes',
      BgNum: this.ContractForm.controls['GuranteeNumber']?.value ? this.ContractForm.controls['GuranteeNumber']?.value.toString() : '',
      BgPercentage: this.ContractForm.controls['GuranteePercent']?.value ? this.ContractForm.controls['GuranteePercent']?.value.toString() : '',
      BgAmount: this.ContractForm.controls['GuranteeAmount']?.value ? this.cs.removeCommas(this.ContractForm.controls['GuranteeAmount']?.value).toString() : '',
      BgIssuedBy: this.ContractForm.controls['GuranteeIssuedBy']?.value,
      BgDate: bankGuarDate ? (moment(bankGuarDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      BgValidDate: bankValidDate ? (moment(bankValidDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      DelegateName: this.ContractForm.controls['DeligateName'].value,
      ComNationality: CommNationality,
      IdType: this.ContractForm.controls['proofId'].value,
      IdNatId: this.ContractForm.controls['proofId'].value == 'N' ? this.ContractForm.controls['NationalId'].value.toString() : '',
      IdResiNumber: this.ContractForm.controls['proofId'].value == 'R' ? this.ContractForm.controls['ResidenceNumber'].value.toString() : '',
      IdPpNum: this.ContractForm.controls['proofId'].value == 'P' ? this.ContractForm.controls['PassportNumber'].value : '',
      DelegateStatus: this.approvePayload.DeligateStatus,
      SignAuth: this.ContractForm.controls['signAuth'].value,
      AuthSelect: authorization,
      AuthLetterNum: this.ContractForm.controls['authLetterNumber'].value ? this.ContractForm.controls['authLetterNumber'].value.toString() : '',
      AuthLetterDate: authDate ? (moment(authDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      PermContrAdd: this.ContractForm.controls['conAddress'].value,
      ContrCity: this.ContractForm.controls['conCity'].value,
      ContrSignCity: this.ContractForm.controls['signCity'].value,
      FinalApproval: this.ContractForm.controls['FinalApproval'].value,
      VendCompanyInst: this.ContractForm.controls['company'].value,
      ContrCountry: ContractCountry,
      ContrPhone: this.ContractForm.controls['conPhone'].value ? this.ContractForm.controls['conPhone'].value.toString() : '',
      ContrMailBox: this.ContractForm.controls['mailBox'].value ? this.ContractForm.controls['mailBox'].value.toString() : '',
      ContrPostalCode: this.ContractForm.controls['postalCode'].value ? this.ContractForm.controls['postalCode'].value.toString() : '',
      ContrEmail: this.ContractForm.controls['eMail'].value,
      BidNumSubVend: this.ContractForm.controls['conBidNumber'].value ? this.ContractForm.controls['conBidNumber'].value.toString() : '',
      BidNumSubVendDt: contDate ? (moment(contDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      DaySignContr: this.ContractForm.controls['conSignDay'].value,
      DateSignContr: signDate ? (moment(signDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      DurationContr: this.approvePayload.DurationContr,
      PwrAtrnyNum: this.ContractForm.controls['powerNumber'].value ? this.ContractForm.controls['powerNumber'].value.toString() : '',
      PwrAtrnyDate: powerAttDate ? (moment(powerAttDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      DurationText: this.isTextDurationChecked ? this.ContractForm.controls['durationWork'].value : '',
      PsText: this.ContractForm.controls['PaySchedule'].value,
      PowFirst: this.ContractForm.controls['proFirst'].value,
      PowSecond: this.ContractForm.controls['proSecond'].value,
      Downpayment: this.ContractForm.controls['Downpayment'].value ? 'X' : '',
      // DurCompWrk: this.ContractForm.controls['DurCompWrk'].value ? 'X' : '',
      DownpayRate: this.ContractForm.controls['downRate'].value ? this.ContractForm.controls['downRate'].value.toString() : '',
      AdvancePercentage: this.ContractForm.controls['downPercent'].value ? this.ContractForm.controls['downPercent'].value.toString() : '',
      DownpayAmt: this.ContractForm.controls['downAmount'].value ? this.cs.removeCommas(this.ContractForm.controls['downAmount'].value.toString()) : '',
      EvaluationPeriod: this.checkEvaluation ? this.ContractForm.controls['EvaluationPeriod'].value : '',
      PenalltyTxtBox: this.checkPenalties ? this.ContractForm.controls['FineText'].value : '',
      TextFineSection: this.checkPenalties ? this.ContractForm.controls['FineFirst'].value : '',
      // PenaltyPercentage: this.checkPenalties ? this.ContractForm.controls['FinePercent'].value.toString() : '',
      PenaltyPercentage: this.getPenaltyPercentage,
      MtdCalcFines: this.ContractForm.controls['MtdCalcFines'].value,
      PenaltyThird: this.checkPenalties ? this.ContractForm.controls['FineText'].value : '',
      TextExtractSection: this.checkExtracts ? this.ContractForm.controls['ExtractFirst'].value : '',
      ExtractsSecond: this.checkExtracts ? this.ContractForm.controls['ExtractSecond'].value : '',
      ExtractsThird: this.checkExtracts ? this.ContractForm.controls['ExtractThird'].value : '',
      TableOfQunatPrice: this.checkTableQuant ? this.ContractForm.controls['TableQP'].value : '',
      TextPlaceExeWork: this.checkPlace ? this.ContractForm.controls['ExePlace'].value : '',

      TextAccessories: this.checkAppendix ? this.ContractForm.controls['Accessories'].value : '',
      Comments: commentAdded,
      Attachments: "",

      Insurance: (this.checkInsurance && this.ContractForm.controls['showDynamicInsurance'].value) ? this.ContractForm.controls['Insurance'].value : '',
      ScopeOfWrk: (this.checkScope && this.ContractForm.controls['showDynamicScope'].value) ? this.ContractForm.controls['WorkScope'].value : '',
      Location: (this.checkLocation && this.ContractForm.controls['showDynamicLocation'].value) ? this.ContractForm.controls['Location'].value : '',
      WorkSite: (this.checkWorkSite && this.ContractForm.controls['showDynamicWorkSite'].value) ? this.ContractForm.controls['WorkSite'].value : '',

      TeamsSpec: (this.checkSpecs && this.checkSpecsTeam && this.ContractForm.controls['showSpecsTeam'].value) ? this.ContractForm.controls['SpecsTeam'].value : '',
      MaterialSpec: (this.checkSpecs && this.checkSpecsMat && this.ContractForm.controls['showSpecsMat'].value) ? this.ContractForm.controls['SpecsMat'].value : '',
      EquipSpec: (this.checkSpecs && this.checkSpecsEqui && this.ContractForm.controls['showSpecsEqui'].value) ? this.ContractForm.controls['SpecsEqui'].value : '',
      WorkCarryoutMethod: (this.checkSpecs && this.checkSpecsWork && this.ContractForm.controls['showSpecsWork'].value) ? this.ContractForm.controls['SpecsWork'].value : '',
      QualitySpec: (this.checkSpecs && this.checkSpecsQual && this.ContractForm.controls['showSpecsQual'].value) ? this.ContractForm.controls['SpecsQual'].value : '',
      SafetySpec: (this.checkSpecs && this.checkSpecsSafety && this.ContractForm.controls['showSpecsSafety'].value) ? this.ContractForm.controls['SpecsSafety'].value : '',
      Mandterms: (this.checkContent && this.checkContentMand && this.ContractForm.controls['showContentMand'].value) ? this.ContractForm.controls['ContentMand'].value : '',
      LocalContRatio: (this.checkContent && this.checkContentRatio && this.ContractForm.controls['showContentRatio'].value) ? this.ContractForm.controls['ContentRatio'].value : '',
      NatProdShare: (this.checkContent && this.checkContentShare && this.ContractForm.controls['showContentShare'].value) ? this.ContractForm.controls['ContentShare'].value : '',
      InsuranceRqts: (this.checkTerms && this.checkTermsInsur && this.ContractForm.controls['showTermsInsur'].value) ? this.ContractForm.controls['TermsInsur'].value : '',
      SpeclCond: (this.checkTerms && this.checkNatureSepclCond && this.ContractForm.controls['showNatureSepclCond'].value) ? this.ContractForm.controls['NatureSepclCond'].value : '',
      SupportServices: (this.checkTerms && this.checkWorkSuppServ && this.ContractForm.controls['showWorkSuppServ'].value) ? this.ContractForm.controls['WorkSuppServ'].value : '',
      ServiceProgRep: (this.checkTerms && this.checkServProgRep && this.ContractForm.controls['showServProgRep'].value) ? this.ContractForm.controls['ServProgRep'].value : '',
      RulesPrinciples: (this.checkTerms && this.checkProfRules && this.ContractForm.controls['showProfRules'].value) ? this.ContractForm.controls['ProfRules'].value : '',
      WarrantPeriod: (this.checkTerms && this.checkWarrantPeriod && this.ContractForm.controls['showWarrantPeriod'].value) ? this.ContractForm.controls['WarrantPeriod'].value : '',
      MdrnSkillsMthds: (this.checkTerms && this.checkModernSkills && this.ContractForm.controls['showModernSkills'].value) ? this.ContractForm.controls['ModernSkills'].value : '',
      WorkHrs: (this.checkTerms && this.checkTermsHours && this.ContractForm.controls['showTermsHours'].value) ? this.ContractForm.controls['TermsHours'].value : '',
      Followup: (this.checkTerms && this.checkTermsFollow && this.ContractForm.controls['showTermsFollow'].value) ? this.ContractForm.controls['TermsFollow'].value : '',
      Inspection: (this.checkTerms && this.checkTermsInsp && this.ContractForm.controls['showTermsInsp'].value) ? this.ContractForm.controls['TermsInsp'].value : '',
      SaveCharts: (this.checkTerms && this.checkTermsChart && this.ContractForm.controls['showTermsChart'].value) ? this.ContractForm.controls['TermsChart'].value : '',
      SauTraining: (this.checkTerms && this.checkTermsTrain && this.ContractForm.controls['showTermsTrain'].value) ? this.ContractForm.controls['TermsTrain'].value : '',
      WrkProgRep: (this.checkTerms && this.checkTermsReport && this.ContractForm.controls['showTermsReport'].value) ? this.ContractForm.controls['TermsReport'].value : '',

      RecRetPeriod: this.ContractForm.controls['RetentionPeriod'].value ? this.ContractForm.controls['RetentionPeriod'].value : '',
      MaxDaysRenLic: this.ContractForm.controls['RenewalDays'].value ? this.ContractForm.controls['RenewalDays'].value : '',
      FirstArbitration: (this.checkFirstArb && this.ContractForm.controls['showFirstArb'].value && this.ContractForm.controls['FirstArb'].value) ? this.ContractForm.controls['FirstArb'].value : '',
      SecondArbitration: (this.checkSecondArb && this.ContractForm.controls['showSecondArb'].value && this.ContractForm.controls['SecondArb'].value) ? this.ContractForm.controls['SecondArb'].value : '',
      ThirdArbitration: (this.checkThirdArb && this.ContractForm.controls['showThirdArb'].value && this.ContractForm.controls['ThirdArb'].value) ? this.ContractForm.controls['ThirdArb'].value : '',
      ResponsePeriod: this.ContractForm.controls['ResponsePeriod'].value ? this.ContractForm.controls['ResponsePeriod'].value : '',
      RespTmCntPr: this.ContractForm.controls['PurResponseTime'].value + '' ? this.ContractForm.controls['PurResponseTime'].value + '' : '',
      AgrPeriod: this.ContractForm.controls['AgreePeriod'].value ? this.ContractForm.controls['AgreePeriod'].value : '',
      NoOfParties: this.ContractForm.controls['NumberOfParties'].value ? this.ContractForm.controls['NumberOfParties'].value : '',
      PrdContRplRep: this.ContractForm.controls['ReplacePeriod'].value ? this.ContractForm.controls['ReplacePeriod'].value : '',
      TrmsAgrFirst: (this.ContractForm.controls['FirstAgree'].value) ? this.ContractForm.controls['FirstAgree'].value : '',
      TrmsAgrSecond: (this.ContractForm.controls['SecondAgree'].value) ? this.ContractForm.controls['SecondAgree'].value : '',
      TrmsAgrThird: (this.ContractForm.controls['ThirdAgree'].value) ? this.ContractForm.controls['ThirdAgree'].value : '',
      FirstSubSec: (this.checkFirstBusiness && this.ContractForm.controls['showFirstBusiness'].value && this.ContractForm.controls['FirstBusiness'].value) ? this.ContractForm.controls['FirstBusiness'].value : '',
      SecondSubSec: (this.checkSecondBusiness && this.ContractForm.controls['showSecondBusiness'].value && this.ContractForm.controls['SecondBusiness'].value) ? this.ContractForm.controls['SecondBusiness'].value : '',
      ThirdSubSec: (this.checkThirdBusiness && this.ContractForm.controls['showThirdBusiness'].value && this.ContractForm.controls['ThirdBusiness'].value) ? this.ContractForm.controls['ThirdBusiness'].value : '',
      WrkPgmFirst: (this.ContractForm.controls['FirstWorkPro'].value) ? this.ContractForm.controls['FirstWorkPro'].value : '',
      WrkPgmSecond: (this.ContractForm.controls['SecondWorkPro'].value) ? this.ContractForm.controls['SecondWorkPro'].value : '',
      WrkPgmThird: (this.ContractForm.controls['ThirdWorkPro'].value) ? this.ContractForm.controls['ThirdWorkPro'].value : '',
      WrkPgmFourth: (this.ContractForm.controls['FourthWorkPro'].value) ? this.ContractForm.controls['FourthWorkPro'].value : '',
      TeschDisReslDys: this.ContractForm.controls['DisputeResolutionDays'].value ? this.ContractForm.controls['DisputeResolutionDays'].value : '',
      RespPrdCnt: this.ContractForm.controls['ContRespPeriod'].value ? this.ContractForm.controls['ContRespPeriod'].value : '',
      InabtyToImp: this.ContractForm.controls['PriorNotifPerson'].value ? this.ContractForm.controls['PriorNotifPerson'].value : '',
      InvoiceFirst: (this.checkFirstInvoice && this.ContractForm.controls['showFirstInvoice'].value && this.ContractForm.controls['FirstInvoice'].value) ? this.ContractForm.controls['FirstInvoice'].value : '',
      InvoiceSecond: (this.checkSecondInvoice && this.ContractForm.controls['showSecondInvoice'].value && this.ContractForm.controls['SecondInvoice'].value) ? this.ContractForm.controls['SecondInvoice'].value : '',
      InvoiceThird: (this.checkThirdInvoice && this.ContractForm.controls['showThirdInvoice'].value && this.ContractForm.controls['ThirdInvoice'].value) ? this.ContractForm.controls['ThirdInvoice'].value : '',
      RefToPrices: (this.checkFirstPrices && this.ContractForm.controls['showFirstPrices'].value && this.ContractForm.controls['FirstPrices'].value) ? this.ContractForm.controls['FirstPrices'].value : '',
      Beneficiary: (this.checkFirstBenef && this.ContractForm.controls['showFirstBenef'].value && this.ContractForm.controls['FirstBenef'].value) ? this.ContractForm.controls['FirstBenef'].value : '',
      CntPerfEval: (this.checkPerfEval && this.ContractForm.controls['showPerfEval'].value && this.ContractForm.controls['PerfEval'].value) ? this.ContractForm.controls['PerfEval'].value : '',

      DaysForAction: this.ContractForm.controls['DaysForAction'].value ? this.ContractForm.controls['DaysForAction'].value.toString() : '',



    }

    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: payload,
      AwardNum: this.approvePayload.AwardNum,
      userName: this.ProxyUserId
    }

    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.sendDeptCopyTo();
        this.submitManPower();
        this.submitContEvaluation();
        this.submitPaySchedule();
        if (status != "save") {
          this.addComment(conStatus);
        }

        this.addTextInPDF();
        this.addDynTextInPDF();
        if (status == "approve" && flagVar == "APP") {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract Submitted Successfully')
          } else {
            this.message.create('success', "تم إرسال العقد بنجاح")
          }
        } else if (status == "approve" && flagVar == "CCL") {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract Cancelled Successfully')
          } else {
            this.message.create('success', 'تم الغاء العقد بنجاح')
          }
        } else if (status == "save") {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract Saved as draft')
          } else {
            this.message.create('success', "تم حفظ العقد كمسودة")
          }
        } else if (status == "CUO") {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract assigned to Contract Officer successfully')
          } else {
            this.message.create('success', 'تم تعيين العقد لموظف العقود بنجاح')
          }
        } else if (status == "RFP") {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', "Contract assigned to Requestor's Manager successfully")
          } else {
            this.message.create('success', 'تم تعيين العقد لمدير الطالب بنجاح')
          }
        }
        // this.location.back();
        if (status != "save") {
          this.router.navigateByUrl('contract/legalOfficerDashboard/ContPrep');
        }
      }
    });

  }


  // get API call for comments
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

  // post APi call to add comment
  addComment(status: any) {
    let dataComment = {
      data: {
        "Flag": "SUBMIT",
        "comment_id": "",
        "AwardNum": this.approvePayload.AwardNum,
        "Status": status,
        "Comment_by": this.user_name,
        "Role": "Legal Unit Officer",
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




  // ** Attachment section starts **//
  @Output()
  paramsForDocHandle = new EventEmitter();

  onFileUpload(_event: any, _doc: any) {
    console.log(_event, _doc);
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
          UploadedBy: new FormControl(''),
          DefId: new FormControl(''),
          DocId: new FormControl(''),
          DocName: new FormControl(''),
          operationType: new FormControl(''),
        }),
      }),
    });
  }

  get createFGParams(): DocParamsLevels {
    return {
      firstLevelName: 'P2PContract',
      firstLevelId: this.award_number.toString(),
      secondLevelName: 'P2PContractAward',
      secondLevelId: this.award_number.toString(),
      thirdLevelId: this.award_number.toString(),
      operation: "C",
      uploadedBy: this.user_name
    }
  }
  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //table
      displayMode: 'edit', //view
      docParams: {
        HeaderKey: "P2PCommitte",
        ItemKey: "VendorEval",
        EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
        EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
        RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
        RelatedEntityId: _l.get(_paramsForUpdate, 'secondLevelId', ''),
        DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
        DocName: "",
        FileNetId: "",
        Origin: "P2P",
        UploadedBy: _l.get(_paramsForUpdate, 'uploadedBy', ''),
        UploadedOn: "",
        MimeDocType: "text/xml",
        Operation: _l.get(_paramsForUpdate, 'operation', ''),
        GuiId: "",
        ContentSize: 0
      },
    };
    return docParams;
  }


  getAttachFormGroup(_params: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeIds(_params);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    return attachFG;
  }

  // ** Attachment section ends **//


  // Validation message standard name mapping
  getStandardFormName(name: string) {
    switch (name) {
      case 'ContractStartDate':
        if (this.cs.userLanguage == 'en') {
          return 'Contract Start Date';
        } else {
          return "تاريخ بدء العقد";
        }
      case 'DateOfIssue':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Date of Issue';
        } else {
          return 'تاريخ إصدار الضمان البنكي';
        }
      case 'ValidTill':
        if (this.cs.userLanguage == 'en') {
          return 'Valid Till';
        } else {
          return 'صالح لغاية';
        }
      case 'GuranteeIssuedBy':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Issued By';
        } else {
          return 'ضمان بنكي صادر عن';
        }
      case 'GuranteeAmount':
        if (this.cs.userLanguage == 'en') {
          return 'Guarantee Amount';
        } else {
          return 'مبلغ الضمان البنكي';
        }
      case 'GuranteeNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Number';
        } else {
          return 'رقم الضمان البنكي';
        }
      case 'GuranteePercent':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Percentage';
        } else {
          return 'نسبة الضمان البنكي';
        }
      case 'DeligateName':
        if (this.cs.userLanguage == 'en') {
          return 'Delegate Name';
        } else {
          return "اسم المُفوَّض";
        }
      case 'CommNation':
        if (this.cs.userLanguage == 'en') {
          return 'Commissioner Nationality';
        } else {
          return "جنسية المُفوِّض";
        }
      case 'proofId':
        if (this.cs.userLanguage == 'en') {
          return 'Proof of ID';
        } else {
          return "إثبات الهوية";
        }
      case 'NationalId':
        if (this.cs.userLanguage == 'en') {
          return 'National Id';
        } else {
          return "الهوية الوطنية";
        }
      case 'ResidenceNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Residence Number';
        } else {
          return "رقم الإقامة";
        }
      case 'PassportNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Passport Number';
        } else {
          return "رقم جواز السفر";
        }
      case 'signAuth':
        if (this.cs.userLanguage == 'en') {
          return 'Signing Authorization';
        } else {
          return "إذن التوقيع";
        }
      case 'authLetterNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Authorization Letter Number';
        } else {
          return "رقم خطاب المصادقة";
        }
      case 'authLetterDate':
        if (this.cs.userLanguage == 'en') {
          return 'Authorization Letter Date';
        } else {
          return "تاريخ خطاب المصادقة";
        }
      case 'powerNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Number of the power of attorney';
        } else {
          return "رقم التوكيل الرسمي";
        }
      case 'powerDate':
        if (this.cs.userLanguage == 'en') {
          return 'Date of the power of attorney';
        } else {
          return "تاريخ التوكيل";
        }
      case 'conAddress':
        if (this.cs.userLanguage == 'en') {
          return 'Permanent Contrator Address';
        } else {
          return "العنوان الدائم";
        }
      case 'conCity':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor City';
        } else {
          return "مدينة المتعاقد";
        }
      case 'signCity':
        if (this.cs.userLanguage == 'en') {
          return 'Contract Signing City';
        } else {
          return "مدينة توقيع العقد";
        }
        case 'FinalApproval': 
        if (this.cs.userLanguage == 'en') {
          return 'Final Approval';
        } else {
          return 'الموافقة النهائية';
        } 
      case 'company':
        if (this.cs.userLanguage == 'en') {
          return 'Entity Type';
        } else {
          return "نوع الكيان";
        }
      case 'conCountry':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor Country';
        } else {
          return "بلد المتعاقد";
        }
      case 'conPhone':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor phone number';
        } else {
          return 'رقم هاتف المتعاقد';
        }
      case 'mailBox':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor Additional Code';
        } else {
          return 'الرقم الإضافي للمتعاقد';
        }
      case 'postalCode':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor Postal Code';
        } else {
          return 'الرمز البريدي للمتعاقد';
        }
      case 'eMail':
        if (this.cs.userLanguage == 'en') {
          return 'Contractor E-mail';
        } else {
          return 'البريد الإلكتروني للمتعاقد';
        }
      case 'conBidNumber':
        if (this.cs.userLanguage == 'en') {
          return 'Bid Number Submitted by Contractor';
        } else {
          return "رقم العرض المقدم من المتعاقد";
        }
      case 'conDate':
        if (this.cs.userLanguage == 'en') {
          return 'Date of the offer submitted by contractor';
        } else {
          return "تاريخ العرض المقدم من المتعاقد";
        }
      case 'conSignDate':
        if (this.cs.userLanguage == 'en') {
          return 'Date of Signing of contract';
        } else {
          return "تاريخ توقيع العقد";
        }
      case 'downRate':
        if (this.cs.userLanguage == 'en') {
          return 'Rate of Downpayment';
        } else {
          return "نسبة الدفعة المقدمة";
        }
      case 'downAmount':
        if (this.cs.userLanguage == 'en') {
          return 'Downpayment Amount';
        } else {
          return "مبلغ الدفعة المقدمة";
        }
      case 'downPercent':
        if (this.cs.userLanguage == 'en') {
          return 'Maximum Advance Percentage';
        } else {
          return ' الحد الأقصى لنسبة الدفعة المسموح بها';
        }
      case 'EvaluationPeriod':
        if (this.cs.userLanguage == 'en') {
          return 'Evaluation Period';
        } else {
          return "فترة التقييم";
        }
      case 'FineFirst':
        if (this.cs.userLanguage == 'en') {
          return 'First section of penalty';
        } else {
          return 'القسم الأول من العقوبة';
        }
      case 'FinePercent':
        if (this.cs.userLanguage == 'en') {
          return 'Penalty Percentage';
        } else {
          return "نسبة العقوبة";
        }
      case 'FineThird':
        if (this.contractType == 'C' || this.contractType == 'E') {
          if (this.cs.userLanguage == 'en') {
            return 'Second section of penalty';
          } else {
            return "القسم الثاني من العقوبة";
          }
        } else if (this.contractType == 'P') {
          if (this.cs.userLanguage == 'en') {
            return 'Fourth section of penalty';
          } else {
            return "القسم الرابع من العقوبة";
          }
        } else {
          if (this.cs.userLanguage == 'en') {
            return 'Third section of penalty';
          } else {
            return 'القسم الثالث من العقوبة';
          }
        }
      case 'FineText':
        if (this.cs.userLanguage == 'en') {
          return 'Second section of penalty'
        } else {
          return 'القسم الثاني من العقوبة'
        }
      case 'ExtractFirst':
        if (this.cs.userLanguage == 'en') {
          return 'First section of extracts'
        } else {
          return 'القسم الأول من المقتطفات'
        }
      case 'ExtractSecond':
        if (this.cs.userLanguage == 'en') {
          return 'Second section of extracts'
        } else {
          return 'القسم الثاني من المقتطفات'
        }
      case 'ExtractThird':
        if (this.cs.userLanguage == 'en') {
          return 'Third section of extracts'
        } else {
          return 'القسم الثالث من المقتطفات'
        }
      case 'TableQP':
        if (this.cs.userLanguage == 'en') {
          return 'Quantities and Prices'
        } else {
          return "الكميات والأسعار"
        }
      case 'ExePlace':
        if (this.contractType != "P") {
          if (this.cs.userLanguage == 'en') {
            return 'Place of execution of work'
          } else {
            return "مكان تنفيذ العمل"
          }
        }
        else {
          if (this.cs.userLanguage == 'en') {
            return 'Place of execution of work'
          } else {
            return "مكان تنفيذ الخدمات"
          }
        }
      case 'SpecsTeam':
        if (this.cs.userLanguage == 'en') {
          return 'Team Specification'
        } else {
          return "مواصفات الفريق"
        }
      case 'SpecsMat':
        if (this.cs.userLanguage == 'en') {
          return 'Material Specification'
        } else {
          return "مواصفات المواد"
        }
      case 'SpecsEqui':
        if (this.cs.userLanguage == 'en') {
          return 'Equipment Specification'
        } else {
          return "مواصفات المعدات"
        }
      case 'SpecsWork':
        if (this.cs.userLanguage == 'en') {
          return 'Work Carryout Methods'
        } else {
          return "طرق تنفيذ العمل"
        }
      case 'SpecsQual':
        if (this.cs.userLanguage == 'en') {
          return 'Quality Specification'
        } else {
          return "مواصفات الجودة"
        }
      case 'SpecsSafety':
        if (this.cs.userLanguage == 'en') {
          return 'Safety Specification'
        } else {
          return "مواصفات السلامة"
        }
      case 'ContentMand':
        if (this.cs.userLanguage == 'en') {
          return 'Mandatory Terms'
        } else {
          return "الشروط الإلزامية"
        }
      case 'ContentRatio':
        if (this.cs.userLanguage == 'en') {
          return 'Local Content Ratio'
        } else {
          return "نسبة المحتوى المحلي"
        }
      case 'ContentShare':
        if (this.cs.userLanguage == 'en') {
          return 'National Products Share'
        } else {
          return "حصة المنتجات الوطنية"
        }
      case 'TermsInsur':
        if (this.cs.userLanguage == 'en') {
          return 'Insurance Requirements'
        } else {
          return "متطلبات التأمين"
        }
      case 'TermsHours':
        if (this.cs.userLanguage == 'en') {
          return 'Working Hours'
        } else {
          return "ساعات العمل"
        }
      case 'TermsFollow':
        if (this.cs.userLanguage == 'en') {
          return 'Follow-up'
        } else {
          return "متابعة"
        }
      case 'TermsInsp':
        if (this.cs.userLanguage == 'en') {
          return 'Inspection'
        } else {
          return "تفتيش"
        }
      case 'TermsChart':
        if (this.cs.userLanguage == 'en') {
          return 'Save Chart'
        } else {
          return "حفظ الرسم البياني"
        }
      case 'TermsTrain':
        if (this.cs.userLanguage == 'en') {
          return 'Saudi Training'
        } else {
          return "التدريب السعودي"
        }
      case 'TermsReport':
        if (this.cs.userLanguage == 'en') {
          return 'Service Progress Report'
        } else {
          return "تقرير تقدم العمل"
        }
      case 'PaySchedule':
        if (this.cs.userLanguage == 'en') {
          return 'Payment notes'
        } else {
          return 'ملاحظات الدفع'
        }
      case 'Accessories':
        if (this.cs.userLanguage == 'en') {
          return 'Appendix'
        } else {
          return "الملحق"
        }
      case 'Comment':
        if (this.cs.userLanguage == 'en') {
          return 'Comment'
        } else {
          return "تعليق"
        }
      case 'ManPower':
        if (this.cs.userLanguage == 'en') {
          return 'ManPower'
        } else {
          return "مواصفات فريق العمل"
        }
      case 'ContPayment':
        if (this.cs.userLanguage == 'en') {
          return "جدول الدفعات"
        } else {
          return ''
        }
      default: return '';
    }
  }

  savePaySchedule(index: any) {
  }

  // * Return the index of the element in the form Array
  getIndex(option: string, _data: any) {
    if (option === 'ContEvaluation') {
      const ContEvaluation = this.ContEvaluation;
      const index = ContEvaluation.value.findIndex((item: any) => item.EvalId == _data.EvalId);
      return index > -1 ? index : null;
    }
    if (option === 'ManPower') {
      const ManPower = this.Manpower;
      console.log(this.manPower)
      const index = ManPower.value.findIndex((item: any) => item.ItemNo == _data.ItemNo);
      return index > -1 ? index : null;
    }
  }

  getPenaltiesForMapping(isChecked: boolean): boolean {
    if (this.contractType == 'G' || this.contractType == 'T') {
      this.setPenaltiesValidater();
      return true;
    } else {
      return isChecked;
    }
  }

  // getFirstDefalultValues(value:string){
  //   console.log(value)
  //   if(value == 'G' || value == 'P'){
  //   return ' thara'
  //   }
  //   if(value == 'T'){
  //     return 'في حال عدم التزام المتعاقد بنسبة المحتوى المحلي المستهدفة، فسيتم إيقاع غرامة مالية تصل إلى 10% من مجموع قيمة أوامر الشراء وفقًا لملحق الشروط والأحكام الخاص بمتطلبات المحتوى المحلي في الاتفاقية الإطارية.'
  //   }
  //   else{
  //     return''
  //   }

  // }

  get getPenaltyPercentage() {
    if (
      this.contractType == 'G' ||
      this.contractType == 'C' ||
      this.contractType == 'T' ||
      this.contractType == 'D' ||
      this.contractType == 'E' ||
      this.contractType == 'P'
    ) {
      return this.ContractForm.controls['FinePercent'].value.toString();
    }
    if (this.checkPenalties) {
      return this.ContractForm.controls['FinePercent'].value.toString();
    }
    return '';
  }

  checkDynamic(formName: string, data: any): boolean {
    switch (formName) {
      case 'showFirstInvoice': {
        if (this.contractType == 'R') {
          return true;
        } else if (data.Invoices_one == 'D') {
          return true;
        } else {
          return false;
        }
      }
      case 'showSecondInvoice': {
        if (this.contractType == 'R') {
          return true;
        } else if (data.Invoices_two == 'D') {
          return true;
        } else {
          return false;
        }
      }
      case 'showThirdInvoice': {
        if (this.contractType == 'R') {
          return true;
        } else if (data.Invoices_three == 'D') {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  // * Calculates and sets the amount value based on the percentage (index is optional)
  calculateAmountBasedOnPercent(index: any): void {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    if (index != 'Draft') {
      let currentPercent = Number(ContPayment.controls[index].value.Percentage);
      let totalAmount = Number(this.ContractForm.controls['Amount'].value);
      let paymentSchedule = ContPayment.at(index) as FormGroup;
      this.updatePayAmount(paymentSchedule, currentPercent, totalAmount);
    } else {
      ContPayment.controls.forEach((control, index) => {
        let currentPercent = Number(control.value.Percentage);
        let totalAmount = Number(this.ContractForm.controls['Amount'].value);
        let paymentSchedule = ContPayment.at(index) as FormGroup;
        this.updatePayAmount(paymentSchedule, currentPercent, totalAmount);
      });
    }
  }

  updatePayAmount(paymentSchedule: any, currentPercent: any, totalAmount: any) {
    let amountNumber = this.cs.calcValueFromPercentAndTotal(currentPercent, totalAmount);
    paymentSchedule.get('PayAmount')?.patchValue(
      this.cs.numberWithCommas(amountNumber)
    );
  }


}
