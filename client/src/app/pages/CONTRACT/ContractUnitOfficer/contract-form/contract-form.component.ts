import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, Type } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/RFP/api.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _l from 'lodash';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { createMask } from '@ngneat/input-mask';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { forkJoin } from 'rxjs';
import { BankDetail, Manpower } from './../../../../shared/shared';
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbCalendarIslamicCivil } from '@ng-bootstrap/ng-bootstrap';
import { IslamicI18n } from '../../Common/hijri-datepicker/hijri-datepicker.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconList } from 'src/app/components/icon/icon.component';
import { takeUntil } from 'rxjs/operators';
import { dropDown } from 'src/app/pages/COMMITTEE/committee.model';
import { CommitteeService } from 'src/app/pages/COMMITTEE/committee.service';

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

// Component for contract details containing both RMI and Preparation
@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
  providers: [DatePipe,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura }, //year
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }, // month , week days,
    { provide: NgbCalendarIslamicCivil, useClass: NgbCalendarIslamicCivil }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ContractFormComponent implements OnInit {
  [x: string]: any;
  commentsArray: any;
  showComments: boolean = false;
  project_name: any;
  attachmentLength = 0;
  ProxyUserId = 'TSUDHA';

  selectAll = false;
  copyToList: any[] = [];

  readonly IconList = IconList;
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
  // checkAppendix = true;
  showPayError = false;
  showNewSchedule = false;
  showEvalDateError = false;

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

  percentageInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: true,
    prefix: '',
    placeholder: '0',
    max: 100,
    rightAlign: false
  });

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
  contractType = '';
  myDate = new Date();
  detailedCountryList: any[] = [];
  countryList: any = [];
  countryListAr: any = [];
  countryListEn: any = [];
  conDetailedCountryList: any[] = [];
  conCountryList: any = [];
  conCountryListAr: any = [];
  conCountryListEn: any = [];
  user_name: any;
  rmiStatus: boolean = false;
  award_number: number = 0;
  contractDetails: any = [];
  approvePayload: any = [];
  authList: any = [];
  listOfContPaymentData: any[] = [];
  listOfContEvaluationData: any[] = [];
  showError: boolean = false;
  errorList: any = [];
  totalPercentage = 0;
  isValidDownRate = false;
  isCommNum = true;
  fileNetList: any[] = [];
  userDetails: userDetails;

  isTextDurationChecked: boolean = false;


  EvaluationDate: any = [];

  bankList: BankDetail[] = [];
  finalApproverList: dropDown[] = [];
  hijiriMaxDate!: { year: number; month: number; day: number };

  //* higiri date validaions
  todayHijri!: NgbDate;
  maxHijriDate!: NgbDate;


  // Contract form
  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    ProjectDuration: new FormControl({ value: '', disabled: true }),
    DurationTypeEN: new FormControl({ value: '', disabled: true }),
    DurationTypeAR: new FormControl({ value: '', disabled: true }),
    PRnumber: new FormControl({ value: '', disabled: true }),
    PrintAwardLetter: new FormControl('', [Validators.required]),
    PrintAwardDate: new FormControl(new Date(), [Validators.required]),
    // ContractStartDate: new FormControl({ value: '', disabled: true }),
    ContractStartDate: new FormControl(new Date(), [Validators.required]),
    ContractStartText: new FormControl('', [Validators.required]),
    ContractStartToggle: new FormControl(true),
    RegType: new FormControl('', [Validators.required]),
    RegNumber: new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    ProcessDescription: new FormControl('', [Validators.required]),
    Amount: new FormControl({ value: '', disabled: true }),
    AmountInWords: new FormControl({ value: '', disabled: true }),

    BankGuarantee: new FormControl(true),
    GuranteeNumber: new FormControl('', [Validators.required]),
    GuranteePercent: new FormControl('', [Validators.required]),
    GuranteeAmount: new FormControl('', [Validators.required, Validators.pattern(/^\-?[0-9,]+(?:\.[0-9]{1,2})?$/)]),
    GuranteeCurrency: new FormControl('', [Validators.required]),
    GuranteeIssuedBy: new FormControl('', [Validators.required]),
    DateOfIssue: new FormControl(new Date(), [Validators.required]),
    ValidTill: new FormControl(new Date(), [Validators.required]),
    BgValidDateCal: new FormControl('', [Validators.required]),

    DeligateName: new FormControl('', [Validators.required]),
    CommNation: new FormControl('', [Validators.required]),
    proofId: new FormControl('', [Validators.required]),
    NationalId: new FormControl(''),
    ResidenceNumber: new FormControl(''),
    PassportNumber: new FormControl(''),

    signAuth: new FormControl('', [Validators.required]),
    authLetter: new FormControl(''),
    authLetterNumber: new FormControl(''),
    authLetterDate: new FormControl(new Date()),
    powerNumber: new FormControl(''),
    powerDate: new FormControl(new Date()),

    conAddress: new FormControl('', [Validators.required]),
    conCity: new FormControl('', [Validators.required]),
    signCity: new FormControl(''),
    FinalApproval: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    otherEntity: new FormControl('', [Validators.required]),
    conCountry: new FormControl('', [Validators.required]),
    conPhone: new FormControl('', [Validators.required]),
    mailBox: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    eMail: new FormControl('', [Validators.required]),
    conBidNumber: new FormControl(''),
    conDate: new FormControl(new Date(), [Validators.required]),
    conSignDate: new FormControl(new Date(), [Validators.required]),
    conSignDay: new FormControl(''),

    durationWork: new FormControl('',),
    DurCompWrk: new FormControl(false),
    proFirst: new FormControl('',),
    proSecond: new FormControl('',),
    DaysForAction: new FormControl(''),

    Downpayment: new FormControl(false),
    downRate: new FormControl(null),
    downAmount: new FormControl(null, [Validators.pattern(/^\-?[0-9,]+(?:\.[0-9]{1,2})?$/)]),
    downPercent: new FormControl({value: null, disabled: true}),

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
    Insurance: new FormControl(''),

    MtdCalcFines: new FormControl(null),
    FineFirst: new FormControl(null),
    FineSecond: new FormControl(null),
    FineFourth: new FormControl(null),
    FinePercent: new FormControl(null),
    // WeeklyPnltyPerctg: new FormControl(null),
    // MaximumPnltyPerctg: new FormControl(null, Validators.required),
    FineThird: new FormControl('في حال عدم التزام المتعاقد بنسبة المحتوى المحلي، فسيتم إيقاع غرامة مالية تصل إلى 10% من قيمة العقد وفقًا لملحق الشروط والأحكام الخاص بالآلية المطبقة.'),
    FineText: new FormControl(''),
    ExtractFirst: new FormControl(''),
    ExtractSecond: new FormControl(''),
    ExtractThird: new FormControl(''),
    TableQP: new FormControl(''),
    showFirstBenef: new FormControl(false),
    FirstBenef: new FormControl(''),

    EvaluationPeriod: new FormControl(''),
    showDynamicInsurance: new FormControl(false),
    // showDynamicScope: new FormControl(false),
    showDynamicLocation: new FormControl(false),
    showDynamicWorkSite: new FormControl(false),
    WorkScope: new FormControl(''),
    Location: new FormControl(''),
    WorkSite: new FormControl(''),

    ManPower: new FormArray([]),
    ContEvaluation: new FormArray([]),
    showPerfEval: new FormControl(false),
    PerfEval: new FormControl(''),
    ContPayment: new FormArray([]),
    PaySchedule: new FormControl(''),
    showSpecsTeam: new FormControl(false),
    showSpecsMat: new FormControl(false),
    showSpecsEqui: new FormControl(false),
    showSpecsWork: new FormControl(false),
    showSpecsQual: new FormControl(false),
    showSpecsSafety: new FormControl(false),
    showSpecsWorkGroup: new FormControl(false),
    showSpecsImplServ: new FormControl(false),
    SpecsTeam: new FormControl(''),
    SpecsMat: new FormControl(''),
    SpecsEqui: new FormControl(''),
    SpecsWork: new FormControl(''),
    SpecsQual: new FormControl(''),
    SpecsSafety: new FormControl(''),
    SpecsWorkGroup: new FormControl(''),
    SpecsImplServ: new FormControl(''),
    showContentMand: new FormControl(false),
    showContentRatio: new FormControl(false),
    showContentShare: new FormControl(false),
    ContentMand: new FormControl(''),
    ContentRatio: new FormControl(''),
    ContentShare: new FormControl(''),
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
    Accessories: new FormControl(''),


    ExePlace: new FormControl(''),

    Comment: new FormControl('', [Validators.required])
  });

  constructor(
    public router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private committeeService: CommitteeService,
    private calendar: NgbCalendarIslamicCivil
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

  ngDoCheck() {
    // Authorization change on language change
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
    }

    // Country list change on language change
    if (this.cs.userLanguage == 'en') {
      this.countryList = this.countryListEn;
      this.countryList[0] = "Saudi Arabian"
    } else {
      this.countryList = this.countryListAr;
      this.countryList[0] = "سعودي"
    }

    if (this.cs.userLanguage == 'en') {
      this.conCountryList = this.conCountryListEn;
      this.conCountryList[0] = "Saudi Arabia"
    } else {
      this.conCountryList = this.conCountryListAr;
      this.conCountryList[0] = "السعودية"
    }

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("SKING")
      this.detailedCountryList.forEach((country: any) => {
        if (this.cs.userLanguage == 'ar' && (this.ContractForm.controls['CommNation'].value == country.Natx50En)) {
          this.ContractForm.get('CommNation')?.setValue(country.Natx50AR)
        }
        else if (this.cs.userLanguage == 'en' && (this.ContractForm.controls['CommNation'].value == country.Natx50AR)) {
          this.ContractForm.get('CommNation')?.setValue(country.Natx50En)
        }
      });

      this.detailedCountryList.forEach((country: any) => {
        if (this.cs.userLanguage == 'ar' && (this.ContractForm.controls['conCountry'].value == country.Landx50En)) {
          this.ContractForm.get('conCountry')?.setValue(country.Landx50Ar)
        }
        else if (this.cs.userLanguage == 'en' && (this.ContractForm.controls['conCountry'].value == country.Landx50Ar)) {
          this.ContractForm.get('conCountry')?.setValue(country.Landx50En)
        }
      })
    });
   

  }

  // numberOfFiles(_event: any) {
  //   this.attachmentLength = _event.documentLength;
  // }

  oneYearBack: any;
  today: any;
  afterToday: any;

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
  maxDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) > 0;

  minDate = (current: Date): boolean => differenceInCalendarDays(new Date(), current) > 0;



  ngOnInit(): void {
    this.getDates();
    this.user_name = localStorage.getItem('ID')
    this.user_name = atob(this.user_name)
    this.spinner.show();
    this.award_number = history.state.award_number;
    this.project_name = history.state.project_name;
    this.getDetails(this.award_number);
    this.getContEvaluation(this.award_number);
    this.getManPower(this.award_number);
    this.getDeptList(this.award_number);
    // this.getContractPayment(this.award_number);
    // this.numberOfFiles(event);
    this.getCopyOfContract(this.award_number);
    this.getDynamicText(this.award_number);

    this.setAuthorizationSelectListener();
    this.initialValidators();
    this.dateValidationInit()
  }

  dateValidationInit(){
     //* set maxdate for date validation
     this.todayHijri = this.calendar.getToday(); 
    this.maxHijriDate = this.todayHijri; 

  }


  isHijiriFutureDateDisabled(date: { year: number; month: number; day: number }): boolean {
    const today = new Date();
    return (
      date.year > today.getFullYear() ||
      (date.year === today.getFullYear() && date.month > today.getMonth() + 1) ||
      (date.year === today.getFullYear() && date.month === today.getMonth() + 1 && date.day > today.getDate())
    );
  }

  initialValidators() {
    this.setEvaluationValidater();
    this.setPenaltiesValidater();
    this.setTermsValidators();
    this.setContentValidators();
    this.setPlaceValidators();
    this.setScopeValidators();
    this.setSpecsValidators();
    this.setTableQuantValidater();
    this.setExtractsValidater();
    // this.setAppendixValidators();
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

  // get contract details API call
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
      forkJoin([getCountryList, getDetails, getPayment, getAttachment, getBankList, 
        getFinalApproverList]).subscribe(
        (result) => {
          let countryListRes = result[0];
          let detailsGetRes = result[1];
          let paymentDetails = result[2];
          let attachmentDetails = result[3];
          let bankList = result[4];
          let finalApproverList = result[5];

          // * Set the data for Country list Get call
          if (countryListRes) {
            let list = countryListRes.d.results;
            this.detailedCountryList = countryListRes.d.results;
            list.forEach((l: any) => {
              if(l.Natx50AR != '' && l.Natx50En != ''){
                this.countryListAr.push(l.Natx50AR);
                this.countryListEn.push(l.Natx50En);
              }
              

              this.conCountryListAr.push(l.Landx50Ar);
              this.conCountryListEn.push(l.Landx50En)
            })
            this.countryListAr.sort();
            this.countryListEn.sort();
            this.conCountryListAr.sort();
            this.conCountryListEn.sort();
            
            let arrEN = this.countryListEn;
            this.countryListEn = arrEN.filter(function(item: any, pos: any){
              return arrEN.indexOf(item)== pos; 
            });
            let arrAR = this.countryListAr;
            this.countryListAr = arrAR.filter(function(item: any, pos: any){
              return arrAR.indexOf(item)== pos; 
            });

            if (this.cs.userLanguage == 'en') {
              this.countryList = this.countryListEn;
              this.countryList[0] = "Saudi Arabian"
            } else {
              this.countryList = this.countryListAr;
              this.countryList[0] = "سعودي"
            }
        
            if (this.cs.userLanguage == 'en') {
              this.conCountryList = this.conCountryListEn;
              this.conCountryList[0] = "Saudi Arabia"
            } else {
              this.conCountryList = this.conCountryListAr;
              this.conCountryList[0] = "السعودية"
            }
          }

          // * Set the data for Details Get call
          if (detailsGetRes) {
            this.spinner.hide();
            this.approvePayload = detailsGetRes.d;
            this.rmiStatus = ((detailsGetRes.d.ContreqStatus == "RUOP") ? true : false);
            if (this.rmiStatus) {
              this.ContractForm.controls['ProjectDuration'].disable();
              this.ContractForm.controls['ProcessDescription'].disable();
              this.ContractForm.controls['RegNumber'].disable();

            }
            this.contractDetails = this.apiService.mappingDetails(detailsGetRes.d);
            //contract form
            this.contractType = this.contractDetails.ContractType;
            this.ContractForm.get('ProjectName')?.setValue(this.contractDetails.ProjectName);
            this.ContractForm.get('ProjectType')?.setValue(this.contractDetails.ProjectType);
            this.ContractForm.get('AwardNumber')?.setValue(this.contractDetails.AwardNumber);
            this.ContractForm.get('PRnumber')?.setValue(this.contractDetails.PRnumber);
            this.ContractForm.get('AwardDate')?.setValue(this.contractDetails.AwardDate);
            this.ContractForm.get('PrintAwardLetter')?.setValue(this.contractDetails.PrintAwardLetter);
            const [day, month, year] = this.contractDetails.PrintAwardDate.split('/');
            const objDate = {
              year: parseInt(year), month: parseInt(month), day:
                parseInt(day)
            };
            this.ContractForm.get('PrintAwardDate')?.setValue(objDate);

            this.ContractForm.get('VendorName')?.setValue(this.contractDetails.VendorName);
            this.ContractForm.get('ProjectDuration')?.setValue(this.contractDetails.ProjectDuration);
            this.ContractForm.get('DurationTypeEN')?.setValue(this.contractDetails.DurationTypeEN);
            this.ContractForm.get('DurationTypeAR')?.setValue(this.contractDetails.DurationTypeAR);
            this.ContractForm.get('ContractStartDate')?.setValue(this.contractDetails.ContractStartDate ? (moment(this.contractDetails.ContractStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
            this.ContractForm.get('ContractStartText')?.setValue(this.contractDetails.ContractStartText ? this.contractDetails.ContractStartText : '');
            this.ContractForm.get('ContractStartToggle')?.setValue(this.contractDetails.ContractStartToggle == 'X' ? true : false);
            this.ContractForm.get('RegNumber')?.setValue(this.contractDetails.RegNumber);
            this.ContractForm.get('RegType')?.setValue(this.contractDetails.RegType);
            this.ContractForm.get('ProcessDescription')?.setValue(this.contractDetails.ProcessDescription);
            this.ContractForm.get('Amount')?.setValue(this.contractDetails.Amount);
            this.ContractForm.get('Comment')?.setValue(this.contractDetails.Comment);
            // this.ContractForm.get('BankGuarantee')?.setValue(this.contractDetails.BankGuarantee == 'X' ? true : false);
            if (this.cs.isAlphanumeric(this.contractDetails.BgNum)) {
              this.ContractForm.get('GuranteeNumber')?.setValue(this.contractDetails.BgNum);
            } else if (Number(this.contractDetails.BgNum)) {
              this.ContractForm.get('GuranteeNumber')?.setValue(this.contractDetails.BgNum);
            } else {
              this.ContractForm.get('GuranteeNumber')?.setValue(``);
            }
            this.ContractForm.get('GuranteePercent')?.setValue(Number(this.contractDetails.BgPercent) != 0 ? Number(this.contractDetails.BgPercent) : '')
            this.ContractForm.get('GuranteeAmount')?.setValue(this.cs.numberWithCommas(Number(this.contractDetails.BgAmount) != 0 ? Number(this.contractDetails.BgAmount) : ''));
            this.ContractForm.get('GuranteeCurrency')?.setValue(this.contractDetails.BgCurrency);
            console.log(this.contractDetails.BgIssuedBy, 'this.contractDetails.BgIssuedBy');
            
            this.ContractForm.get('GuranteeIssuedBy')?.setValue(this.contractDetails.BgIssuedBy);
            this.ContractForm.get(`WorkSite`)?.setValue(this.contractDetails.WorkSite);
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


            this.ContractForm.get('DeligateName')?.setValue(this.contractDetails.DelName);
            // this.ContractForm.get('CommNation')?.setValue(this.contractDetails.Nation);
            this.ContractForm.get('proofId')?.setValue(this.contractDetails.IdType);
            this.ContractForm.get('NationalId')?.setValue(this.contractDetails.NationalId);
            this.ContractForm.get('ResidenceNumber')?.setValue(this.contractDetails.ResidenceId);
            this.ContractForm.get('PassportNumber')?.setValue(this.contractDetails.PassportId);
            this.ContractForm.get('signAuth')?.setValue(this.contractDetails.SignAuth);
            this.ContractForm.get('authLetterNumber')?.setValue(Number(this.contractDetails.AuthLetterNum) != 0 ? Number(this.contractDetails.AuthLetterNum) : '');
            this.ContractForm.get('authLetterDate')?.setValue(this.contractDetails.AuthLetterDate ? (moment(this.contractDetails.AuthLetterDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
            this.ContractForm.get('powerNumber')?.setValue(Number(this.contractDetails.PowerNum) != 0 ? Number(this.contractDetails.PowerNum) : '');
            this.ContractForm.get('powerDate')?.setValue(this.contractDetails.PowerDate ? (moment(this.contractDetails.PowerDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
            this.ContractForm.get('conAddress')?.setValue(this.contractDetails.conAddress);
            this.ContractForm.get('conCity')?.setValue(this.contractDetails.conCity);
            this.ContractForm.get('signCity')?.setValue(this.contractDetails.signCity);
            this.ContractForm.get('FinalApproval')?.setValue(this.contractDetails.FinalApproval)
            this.ContractForm.get('company')?.setValue(this.contractDetails.company);
            this.ContractForm.get('otherEntity')?.setValue(this.contractDetails.otherEntity);
            // this.ContractForm.get('conCountry')?.setValue(this.contractDetails.conCountry);
            this.ContractForm.get('conPhone')?.setValue(Number(this.contractDetails.conPhone) != 0 ? Number(this.contractDetails.conPhone) : '');
            this.ContractForm.get('mailBox')?.setValue(Number(this.contractDetails.mailBox) != 0 ? Number(this.contractDetails.mailBox) : '');
            this.ContractForm.get('postalCode')?.setValue(Number(this.contractDetails.postalCode) != 0 ? Number(this.contractDetails.postalCode) : '');
            this.ContractForm.get('eMail')?.setValue(this.contractDetails.eMail);
            // this.ContractForm.get('conBidNumber')?.setValue(Number(this.contractDetails.conBidNumber) != 0 ? Number(this.contractDetails.conBidNumber) : '');
            this.ContractForm.get('conBidNumber')?.setValue(this.contractDetails.conBidNumber ? this.contractDetails.conBidNumber : '');
            this.ContractForm.get('conDate')?.setValue(this.contractDetails.conDate ? (moment(this.contractDetails.conDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
            this.ContractForm.get('conSignDate')?.setValue(this.contractDetails.conSignDate ? (moment(this.contractDetails.conSignDate, 'DD/MM/YYYY').format('YYYY-MM-DD')) : '');
            this.ContractForm.get('conSignDay')?.setValue('');
            this.ContractForm.get('DurCompWrk')?.setValue(this.contractDetails.TextDuration != '' ? true : false);
            this.ContractForm.get('durationWork')?.setValue(this.contractDetails.TextDuration);
            this.ContractForm.get('proFirst')?.setValue(this.contractDetails.ProFirst);
            this.ContractForm.get('proSecond')?.setValue(this.contractDetails.ProSecond);
            this.ContractForm.get('DaysForAction')?.setValue(Number(this.contractDetails.DaysForAction) != 0 ? Number(this.contractDetails.DaysForAction) : '');
            this.ContractForm.get('EvaluationPeriod')?.setValue(this.contractDetails.EvalPeriod);
            this.ContractForm.get('PerfEval')?.setValue(this.contractDetails.PerfEval);

            this.ContractForm.get('Downpayment')?.setValue(this.contractDetails.DownPay == 'X' ? true : false);
            this.ContractForm.get('downRate')?.setValue(Number(this.contractDetails.DownRate) != 0 ? Number(this.contractDetails.DownRate) : '');
            // this.ContractForm.get('downAmount')?.setValue(Number(obj.DownAmount));
            this.ContractForm.get('downAmount')?.setValue(this.cs.numberWithCommas(Number(this.contractDetails.DownAmount) != 0 ? Number(this.contractDetails.DownAmount) : ''));
            this.ContractForm.get('downPercent')?.setValue(Number(this.contractDetails.DownPercent) != 0 ? Number(this.contractDetails.DownPercent) : '');

            this.ContractForm.get('RetentionPeriod')?.setValue(this.contractDetails.RetentionPeriod);
            this.ContractForm.get('RenewalDays')?.setValue(this.contractDetails.RenewalDays);
            this.ContractForm.get('FirstArb')?.setValue(this.contractDetails.ArbitrationFirst);
            this.ContractForm.get('SecondArb')?.setValue(this.contractDetails.ArbitrationSecond);
            this.ContractForm.get('ThirdArb')?.setValue(this.contractDetails.ArbitrationThird);
            this.ContractForm.get('ResponsePeriod')?.setValue(this.contractDetails.ResponsePeriod);
            this.ContractForm.get('PurResponseTime')?.setValue(this.contractDetails.ResponseTime);
            this.ContractForm.get('AgreePeriod')?.setValue(this.contractDetails.AgreePeriod);
            this.ContractForm.get('NumberOfParties')?.setValue(this.contractDetails.NumberOfParties);
            this.ContractForm.get('ReplacePeriod')?.setValue(this.contractDetails.ReplacePeriod);
            this.ContractForm.get('FirstAgree')?.setValue(this.contractDetails.TermsAgrFirst);
            this.ContractForm.get('SecondAgree')?.setValue(this.contractDetails.TermsAgrSecond);
            this.ContractForm.get('ThirdAgree')?.setValue(this.contractDetails.TermsAgrThird);

            this.ContractForm.get('FirstBusiness')?.setValue(this.contractDetails.BusinessFirst);
            this.ContractForm.get('SecondBusiness')?.setValue(this.contractDetails.BusinessSecond);
            this.ContractForm.get('ThirdBusiness')?.setValue(this.contractDetails.BusinessThird);

            this.ContractForm.get('FirstWorkPro')?.setValue(this.contractDetails.WorkProFirst);
            this.ContractForm.get('SecondWorkPro')?.setValue(this.contractDetails.WorkProSecond);
            this.ContractForm.get('ThirdWorkPro')?.setValue(this.contractDetails.WorkProThird);
            this.ContractForm.get('FourthWorkPro')?.setValue(this.contractDetails.WorkProFourth);

            this.ContractForm.get('DisputeResolutionDays')?.setValue(this.contractDetails.ResolutionDays);
            this.ContractForm.get('ContRespPeriod')?.setValue(this.contractDetails.ContRespPeriod);
            this.ContractForm.get('PriorNotifPerson')?.setValue(this.contractDetails.PriorNotifPerson);
            this.ContractForm.get('FirstInvoice')?.setValue(this.contractDetails.InvoiceFirst);
            this.ContractForm.get('SecondInvoice')?.setValue(this.contractDetails.InvoiceSecond);
            this.ContractForm.get('ThirdInvoice')?.setValue(this.contractDetails.InvoiceThird);
            this.ContractForm.get('FirstPrices')?.setValue(this.contractDetails.PricesFirst);
            this.ContractForm.get('Insurance')?.setValue(this.contractDetails.Insurance);
            this.ContractForm.get('MtdCalcFines')?.setValue(this.contractDetails.MtdCalcFines);
            this.ContractForm.get('FinePercent')?.setValue(this.contractDetails.PenaltyPercent);
            // this.ContractForm.get('WeeklyPnltyPerctg')?.setValue(this.contractDetails.WeeklyPnltyPerctg);
            // this.ContractForm.get('MaximumPnltyPerctg')?.setValue(this.contractDetails.MaximumPnltyPerctg);
            // this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenalltyTxtBox);
            // this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
            // this.ContractForm.get('FineThird')?.setValue(this.contractDetails.PenaltyThird);
            this.initialValidators();
            switch (this.contractType) {
              case 'I':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineThird')?.setValue(this.contractDetails.PenaltyThird);
                this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenalltyTxtBox);
                break;
              case 'M':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineThird')?.setValue(this.contractDetails.PenaltyThird);
                this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenalltyTxtBox);
                break;
              case 'C':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineSecond')?.setValue(this.contractDetails.PenaltyThird);
                this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenalltyTxtBox);
                break;
              case 'P':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineSecond')?.setValue(this.contractDetails.PenalltyTxtBox);
                this.ContractForm.get('FineFourth')?.setValue(this.contractDetails.PenaltyThird);
                this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenalltyTxtBox);
                break;
              case 'E':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineSecond')?.setValue(this.contractDetails.PenaltyThird);
                break;
              case 'D':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineSecond')?.setValue(this.contractDetails.PenaltyThird);
                break;
              case 'R':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                this.ContractForm.get('FineThird')?.setValue(this.contractDetails.PenaltyThird);
                break;
              case 'T':
                this.ContractForm.get('FineFirst')?.setValue(this.contractDetails.PenaltyFirst);
                break;
              case 'G':
                this.ContractForm.get('FineText')?.setValue(this.contractDetails.PenaltyFirst);
                break;
              default:
                break;

            }

            this.ContractForm.get('ExtractFirst')?.setValue(this.contractDetails.ExtractFirst);
            this.ContractForm.get('ExtractSecond')?.setValue(this.contractDetails.ExtractSecond);
            this.ContractForm.get('ExtractThird')?.setValue(this.contractDetails.ExtractThird);
            this.ContractForm.get('TableQP')?.setValue(this.contractDetails.QuantPrice);

            this.ContractForm.get('ExePlace')?.setValue(this.contractDetails.ExePlace);
            this.ContractForm.get('WorkScope')?.setValue(this.contractDetails.WorkScope);
            this.ContractForm.get('Location')?.setValue(this.contractDetails.Location);
            this.ContractForm.get('FirstBenef')?.setValue(this.contractDetails.BenefFirst);
            this.ContractForm.get('PaySchedule')?.setValue(this.contractDetails.PayText);

            this.ContractForm.get('SpecsTeam')?.setValue(this.contractDetails.SpecsTeam);
            this.ContractForm.get('SpecsMat')?.setValue(this.contractDetails.SpecsMat);
            this.ContractForm.get('SpecsEqui')?.setValue(this.contractDetails.SpecsEqui);
            this.ContractForm.get('SpecsWork')?.setValue(this.contractDetails.SpecsWork);
            this.ContractForm.get('SpecsQual')?.setValue(this.contractDetails.SpecsQual);
            this.ContractForm.get('SpecsSafety')?.setValue(this.contractDetails.SpecsSafety);
            this.ContractForm.get('SpecsWorkGroup')?.setValue(this.contractDetails.SpecsWorkGroup);
            this.ContractForm.get('SpecsImplServ')?.setValue(this.contractDetails.SpecsImplServ);
            this.ContractForm.get('ContentMand')?.setValue(this.contractDetails.ContentMand);
            this.ContractForm.get('ContentRatio')?.setValue(this.contractDetails.ContentRatio);
            this.ContractForm.get('ContentShare')?.setValue(this.contractDetails.ContentShare);
            this.ContractForm.get('TermsInsur')?.setValue(this.contractDetails.TermsInsur);
            this.ContractForm.get('NatureSepclCond')?.setValue(this.contractDetails.NatureSepclCond);
            this.ContractForm.get('WorkSuppServ')?.setValue(this.contractDetails.WorkSuppServ);
            this.ContractForm.get('ServProgRep')?.setValue(this.contractDetails.ServProgRep);
            this.ContractForm.get('ProfRules')?.setValue(this.contractDetails.ProfRules);
            this.ContractForm.get('WarrantPeriod')?.setValue(this.contractDetails.WarrantPeriod);
            this.ContractForm.get('ModernSkills')?.setValue(this.contractDetails.ModernSkills);
            this.ContractForm.get('TermsHours')?.setValue(this.contractDetails.TermsHours);
            this.ContractForm.get('TermsFollow')?.setValue(this.contractDetails.TermsFollow);
            this.ContractForm.get('TermsInsp')?.setValue(this.contractDetails.TermsInsp);
            this.ContractForm.get('TermsChart')?.setValue(this.contractDetails.TermsChart);
            this.ContractForm.get('TermsTrain')?.setValue(this.contractDetails.TermsTrain);
            this.ContractForm.get('TermsReport')?.setValue(this.contractDetails.TermsReport);
            this.ContractForm.get('Accessories')?.setValue(this.contractDetails.Appendix);



            // set country name from country code
            this.detailedCountryList.forEach((country: any) => {
              if (this.contractDetails.Nation == country.Land1) {
                if (this.cs.userLanguage == 'ar') {
                  this.ContractForm.controls['CommNation'].setValue(country.Natx50AR);
                } else {
                  this.ContractForm.controls['CommNation'].setValue(country.Natx50En);
                }
              }
            })

            // set contractor's country name from country code
            this.detailedCountryList.forEach((country: any) => {
              if (this.contractDetails.conCountry == country.Land1) {
                if (this.cs.userLanguage == 'ar') {
                  this.ContractForm.controls['conCountry'].setValue(country.Landx50Ar);
                } else {
                  this.ContractForm.controls['conCountry'].setValue(country.Landx50En);
                }
              }
            })

            if (this.cs.userLanguage == 'ar') {
              this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInAr);
            } else {
              this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInEn);
            }

            if (this.contractDetails.AuthSelect == 'C') {
              if (this.cs.userLanguage == 'en') {
                this.auth = "Authorization letter certified by chamber of commerce and Industry";
              } else {
                this.auth = "خطاب مصادقة معتمد من الغرفة التجارية"
              }
              this.ContractForm.get('authLetter')?.setValue(1)
            }

            if (this.contractDetails.AuthSelect == 'A') {
              if (this.cs.userLanguage == 'en') {
                this.auth = "The power of attorney issued by a notary public";
              } else {
                this.auth = "التوكيل الصادر عن كاتب العدل"
              }
              this.ContractForm.get('authLetter')?.setValue(2)
            }
          }

          // * Set the data for Payment scheduled
          if (paymentDetails) {
            this.listOfContPaymentData = paymentDetails.d.results;
            this.mapObjectToFormContPayment(this.listOfContPaymentData);
            // this.api.post("getContractPayment", AwardNum).subscribe(
            //   (res) => {
            //     console.log(res);
            //     this.listOfContPaymentData = res.d.results;
            //     this.mapObjectToFormContPayment(this.listOfContPaymentData);
            //   },
            //   (error) => {
            //     console.log(error);
            //   }
            // );
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
      // this.api.post("getDetails", { ...AwardNum, userName: this.ProxyUserId }).subscribe(
      //   (res) => {

      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );
    } else {
      if (this.rmiStatus) {
        this.router.navigateByUrl('contract/officerDashboard/rmi')
        if (this.cs.userLanguage == 'en') {
          this.message.create('error', 'You have been redirected to contract list')
        } else {
          this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
        }
      } else {
        this.router.navigateByUrl('contract/officerDashboard/ContCrt')
        if (this.cs.userLanguage == 'en') {
          this.message.create('error', 'You have been redirected to contract list')
        } else {
          this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
        }
      }

    }
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
        this.checkPenalties = (res.d.Penalties == 'X');
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
        // this.checkAppendix = (res.d.Appendix == 'X') ? true : false;
        this.checkSpecsTeam = (res.d.Team_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsMat = (res.d.Material_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsEqui = (res.d.Equip_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsWork = (res.d.Work_Caryot_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsQual = (res.d.Qual_S == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsSafety = (res.d.SafetySpec == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsWorkGroup = (res.d.WorkingGroup == 'X' && this.checkSpecs) ? true : false;
        this.checkSpecsImplServ = (res.d.MethodImpServ == 'X' && this.checkSpecs) ? true : false;
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
        this.ContractForm.get('BankGuarantee')?.setValue(res.d.BankGuarantee == 'X' ? true : false);
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
        // Appendix: this.checkAppendix ? 'X' : '',
        Team_S: (this.checkSpecs && this.checkSpecsTeam) ? 'X' : '',
        Material_S: (this.checkSpecs && this.checkSpecsMat) ? 'X' : '',
        Equip_S: (this.checkSpecs && this.checkSpecsEqui) ? 'X' : '',
        Work_Caryot_S: (this.checkSpecs && this.checkSpecsWork) ? 'X' : '',
        Qual_S: (this.checkSpecs && this.checkSpecsQual) ? 'X' : '',
        SafetySpec: (this.checkSpecs && this.checkSpecsSafety) ? 'X' : '',
        WorkingGroup: (this.checkSpecs && this.checkSpecsWorkGroup) ? 'X' : '',
        MethodImpServ: (this.checkSpecs && this.checkSpecsImplServ) ? 'X' : '',
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
        BankGuarantee: this.ContractForm.get('BankGuarantee')?.value ? 'X' : ''

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
        // this.ContractForm.get('showDynamicScope')?.setValue((res.d.ScopeOfWork == 'D') ? true : false);
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
        ScopeOfWork: '',
        Location: this.checkLocation ? (this.ContractForm.controls['showDynamicLocation'].value ? 'D' : 'S') : 'S',
        WorkSite: this.checkWorkSite ? (this.ContractForm.controls['showDynamicWorkSite'].value ? 'D' : 'S') : 'S',
        TeamSpecification: (this.checkSpecs && this.checkSpecsTeam) ? (this.ContractForm.controls['showSpecsTeam'].value ? 'D' : 'S') : 'S',
        MaterialSpecification: (this.checkSpecs && this.checkSpecsMat) ? (this.ContractForm.controls['showSpecsMat'].value ? 'D' : 'S') : 'S',
        EquipmentSpecification: (this.checkSpecs && this.checkSpecsEqui) ? (this.ContractForm.controls['showSpecsEqui'].value ? 'D' : 'S') : 'S',
        WorkCarryoutMethods: (this.checkSpecs && this.checkSpecsWork) ? (this.ContractForm.controls['showSpecsWork'].value ? 'D' : 'S') : 'S',
        QualitySpecification: (this.checkSpecs && this.checkSpecsQual) ? (this.ContractForm.controls['showSpecsQual'].value ? 'D' : 'S') : 'S',
        SafetySpec: (this.checkSpecs && this.checkSpecsSafety) ? (this.ContractForm.controls['showSpecsSafety'].value ? 'D' : 'S') : 'S',
        WorkingGroup: (this.checkSpecs && this.checkSpecsWorkGroup) ? (this.ContractForm.controls['showSpecsWorkGroup'].value ? 'D' : 'S') : 'S',
        MethodImpServ: (this.checkSpecs && this.checkSpecsImplServ) ? (this.ContractForm.controls['showSpecsImplServ'].value ? 'D' : 'S') : 'S',
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

  textDurationChange(event: any) {
    event.target.checked ? this.isTextDurationChecked = true : this.isTextDurationChecked = false;
  }

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

  // function to check the gurantee amount not more than total amount
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
            Number(this.cs.removeCommas(value))
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

  checkUncheckAll(evt: any) {
    this.copyToList.forEach((c) => c.flag = evt.target.checked)
  }

  showHideComments(comments?: any) {
    // this.commentsArray = comments;
    this.showComments = !this.showComments;
  }

  // validation on selection of authorization
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

  setValidators() {

    if (!this.ContractForm.controls['ContractStartToggle'].value) {
      this.ContractForm.controls['ContractStartDate'].setValidators([Validators.required]);
      this.ContractForm.get('ContractStartText')?.clearValidators();
      this.ContractForm.get('ContractStartText')?.setErrors(null);
      this.ContractForm.get('ContractStartText')?.updateValueAndValidity();
    } else {
      this.ContractForm.controls['ContractStartText'].setValidators([Validators.required]);
      this.ContractForm.get('ContractStartDate')?.clearValidators();
      this.ContractForm.get('ContractStartDate')?.setErrors(null);
      this.ContractForm.get('ContractStartDate')?.updateValueAndValidity();
    }

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

    if (this.ContractForm.get('Downpayment')?.value && this.contractType != 'F' && this.contractType != 'R' && this.contractType != 'T') {
      this.ContractForm.get('downRate')?.setValidators([Validators.required]);
      this.ContractForm.get('downAmount')?.setValidators([Validators.required]);
      this.ContractForm.get('downPercent')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('downRate')?.setErrors(null);
      this.ContractForm.get('downAmount')?.setErrors(null);
      this.ContractForm.get('downPercent')?.setErrors(null);
    }

    if (this.ContractForm.get('signAuth')?.value == 'D') {
      this.ContractForm.controls['authLetter'].setValidators([Validators.required]);
    } else {
      this.ContractForm.get('authLetter')?.clearValidators();
      this.ContractForm.get('authLetter')?.setErrors(null);
      this.ContractForm.get('authLetter')?.updateValueAndValidity();
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


    if (this.contractType == 'F' || this.contractType == 'T' || this.contractType == 'R') {
      if (this.ContractForm.get('BankGuarantee')?.value) {
        this.ContractForm.controls['GuranteeNumber'].setValidators([Validators.required]);
        this.ContractForm.controls['GuranteePercent'].setValidators([Validators.required]);
        this.ContractForm.controls['GuranteeAmount'].setValidators([Validators.required]);
        this.ContractForm.controls['GuranteeCurrency'].setValidators([Validators.required]);
        this.ContractForm.controls['GuranteeIssuedBy'].setValidators([Validators.required]);
        this.ContractForm.controls['DateOfIssue'].setValidators([Validators.required]);
        this.ContractForm.controls['ValidTill'].setValidators([Validators.required]);
        this.ContractForm.controls['BgValidDateCal'].setValidators([Validators.required]);
      } else {
        this.ContractForm.get('GuranteeNumber')?.clearValidators();
        this.ContractForm.get('GuranteeNumber')?.setErrors(null);
        this.ContractForm.get('GuranteeNumber')?.updateValueAndValidity();

        this.ContractForm.get('GuranteePercent')?.clearValidators();
        this.ContractForm.get('GuranteePercent')?.setErrors(null);
        this.ContractForm.get('GuranteePercent')?.updateValueAndValidity();

        this.ContractForm.get('GuranteeAmount')?.clearValidators();
        this.ContractForm.get('GuranteeAmount')?.setErrors(null);
        this.ContractForm.get('GuranteeAmount')?.updateValueAndValidity();

        this.ContractForm.get('GuranteeCurrency')?.clearValidators();
        this.ContractForm.get('GuranteeCurrency')?.setErrors(null);
        this.ContractForm.get('GuranteeCurrency')?.updateValueAndValidity();

        this.ContractForm.get('GuranteeIssuedBy')?.clearValidators();
        this.ContractForm.get('GuranteeIssuedBy')?.setErrors(null);
        this.ContractForm.get('GuranteeIssuedBy')?.updateValueAndValidity();

        this.ContractForm.get('DateOfIssue')?.clearValidators();
        this.ContractForm.get('DateOfIssue')?.setErrors(null);
        this.ContractForm.get('DateOfIssue')?.updateValueAndValidity();

        this.ContractForm.get('ValidTill')?.clearValidators();
        this.ContractForm.get('ValidTill')?.setErrors(null);
        this.ContractForm.get('ValidTill')?.updateValueAndValidity();

        this.ContractForm.get('BgValidDateCal')?.clearValidators();
        this.ContractForm.get('BgValidDateCal')?.setErrors(null);
        this.ContractForm.get('BgValidDateCal')?.updateValueAndValidity();
      }
      //   this.ContractForm.controls['GuranteeNumber'].setValidators([Validators.required]);
      //     this.ContractForm.controls['GuranteePercent'].setValidators([Validators.required]);
      //     this.ContractForm.controls['GuranteeAmount'].setValidators([Validators.required]);
      //     this.ContractForm.controls['GuranteeIssuedBy'].setValidators([Validators.required]);
      //     this.ContractForm.controls['DateOfIssue'].setValidators([Validators.required]);
      //     this.ContractForm.controls['ValidTill'].setValidators([Validators.required]);
      //     this.ContractForm.controls['BgValidDateCal'].setValidators([Validators.required]);
    }

    if(this.ContractForm.controls['company'].value != 'O'){
      this.ContractForm.get('otherEntity')?.clearValidators();
        this.ContractForm.get('otherEntity')?.setErrors(null);
        this.ContractForm.get('otherEntity')?.updateValueAndValidity();
    }

  }

  // contractor evaluation get API
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
  // contractor evaluation mapping function
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
  // add contractor evaluation function call
  addContEvaluation() {
    const ContEvaluation = this.ContractForm.get('ContEvaluation') as FormArray;
    ContEvaluation.push(
      new FormGroup({
        AwardNum: new FormControl(this.award_number),
        EvalId: new FormControl(''),
        EvalDate: new FormControl('', Validators.required)
      })
    )
  }
  // delete contract evaluation function call
  deleteContEvaluation(index: any) {
    const add = this.ContractForm.get('ContEvaluation') as FormArray;
    add.removeAt(index);
    this.listOfContEvaluationData.splice(index, 1);
    if (this.cs.userLanguage == 'en') {
      this.message.create('success', 'Contractor evaluation removed successfully');
    } else {
      this.message.create('success', 'تمت إزالة تقييم المتعاقد بنجاح')
    }

    this.checkEvalDate(null, null, true);

  }
  // reset contractor evaluation function call
  resetContEvaluation(index: any) {
    this.ContEvaluation.at(index).patchValue(this.listOfContEvaluationData[index]);
  }
  // check for duplication of evaluation dates
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


  get ContEvaluation() {
    return this.ContractForm.get('ContEvaluation') as FormArray;
  }
  // save contract evaluation function call
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
        this.message.create('success', 'تم حفظ تقييم المتعاقد بنجاح');
      }
    }
    this.listOfContEvaluationData.forEach((data: any) => {
      delete data.EvalId
      delete data.__metadata
    })
  }
  // submit contractor evaluation API call
  submitContEvaluation() {
    if (this.ContractForm.get('EvaluationPeriod')?.value == 'F') {
      this.listOfContEvaluationData = [];
    }

    let payloadData = {
      "AwardNum": this.award_number,
      "EvaluationPeriod": this.listOfContEvaluationData
    }

    this.api.post('putContEvaluation', payloadData).subscribe(
      (res) => {
        console.log(res);
      });
  }

  showEvaluation() {
    if (this.checkEvaluation) {
      this.checkEvaluation = false;
    } else {
      this.checkEvaluation = true;
    }
    this.setEvaluationValidater();
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

  FineFirstValidator() {
    this.ContractForm.get('FineFirst')?.clearValidators();
    this.ContractForm.get('FineFirst')?.setErrors(null);
    this.ContractForm.get('FineFirst')?.updateValueAndValidity();
  }

  FineSecondValidator() {
    this.ContractForm.get('FineSecond')?.clearValidators();
    this.ContractForm.get('FineSecond')?.setErrors(null);
    this.ContractForm.get('FineSecond')?.updateValueAndValidity();
  }

  FineThirdValidator() {
    this.ContractForm.get('FineThird')?.clearValidators();
    this.ContractForm.get('FineThird')?.setErrors(null);
    this.ContractForm.get('FineThird')?.updateValueAndValidity();
  }

  FineFourthValidator() {
    this.ContractForm.get('FineFourth')?.clearValidators();
    this.ContractForm.get('FineFourth')?.setErrors(null);
    this.ContractForm.get('FineFourth')?.updateValueAndValidity();
  }

  FineTextValidator() {
    this.ContractForm.get('FineText')?.clearValidators();
    this.ContractForm.get('FineText')?.setErrors(null);
    this.ContractForm.get('FineText')?.updateValueAndValidity();
  }

  FinePercentValidator() {
    this.ContractForm.get('FinePercent')?.clearValidators();
    this.ContractForm.get('FinePercent')?.setErrors(null);
    this.ContractForm.get('FinePercent')?.updateValueAndValidity();
  }

  setPenaltiesValidater() {
    // if (this.contractType && this.contractType !== 'M') {
    //   this.ContractForm.get('WeeklyPnltyPerctg')?.addValidators(Validators.required);
    //   this.ContractForm.get('WeeklyPnltyPerctg')?.updateValueAndValidity();
    // }
    // if (this.contractType != 'I' && this.contractType != 'M') {
    //   this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.get('FinePercent')?.clearValidators();
    //   this.ContractForm.get('FinePercent')?.setErrors(null);
    //   this.ContractForm.get('FinePercent')?.updateValueAndValidity();
    // }

    // if(this.contractType == 'I' || this.contractType == 'M' || this.contractType == 'R'){
    //   this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
    // } else{
    //   this.ContractForm.get('FinePercent')?.clearValidators();
    //   this.ContractForm.get('FinePercent')?.setErrors(null);
    //   this.ContractForm.get('FinePercent')?.updateValueAndValidity();
    // }

    switch (this.contractType) {
      case 'I':
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineThird')?.setValidators([Validators.required]);
          this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
          this.FineSecondValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        } else {
          this.ContractForm.get('FineText')?.setValidators([Validators.required]);
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FinePercentValidator();
        }
        break;
      case 'M':
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineThird')?.setValidators([Validators.required]);
          this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
          this.FineSecondValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        } else {
          this.ContractForm.get('FineText')?.setValidators([Validators.required]);
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FinePercentValidator();
        }
        break;
      case 'C':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineSecond')?.setValidators([Validators.required]);
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        } else {
          this.ContractForm.get('FineText')?.setValidators([Validators.required]);
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
        }
        break;
      case 'P':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineSecond')?.setValidators([Validators.required]);
          this.ContractForm.get('FineFourth')?.setValidators([Validators.required]);
          this.FineThirdValidator();
          this.FineTextValidator();
        } else {
          this.ContractForm.get('FineText')?.setValidators([Validators.required]);
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
        }
        break;
      case 'E':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineSecond')?.setValidators([Validators.required]);
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        } else {
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        }
        break;
      case 'D':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
        this.ContractForm.get('FineSecond')?.setValidators([Validators.required]);
        this.FineThirdValidator();
        this.FineFourthValidator();
        this.FineTextValidator();
        break;
      case 'R':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        if (this.checkPenalties) {
          this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
          this.ContractForm.get('FineThird')?.setValidators([Validators.required]);
          this.FineSecondValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        } else {
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
        }
        break;
      case 'T':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
        this.FineSecondValidator();
        this.FineThirdValidator();
        this.FineFourthValidator();
        this.FineTextValidator();
        break;
      case 'G':
        this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
        this.ContractForm.get('FineText')?.setValidators([Validators.required]);
        this.FineFirstValidator();
        this.FineSecondValidator();
        this.FineThirdValidator();
        this.FineFourthValidator();
        break;
      case 'F':
          this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
          this.FineFirstValidator();
          this.FineSecondValidator();
          this.FineThirdValidator();
          this.FineFourthValidator();
          this.FineTextValidator();
          break;
      default:
        this.ContractForm.get('FineFirst')?.clearValidators();
        this.ContractForm.get('FineFirst')?.setErrors(null);
        this.ContractForm.get('FineFirst')?.updateValueAndValidity();

        this.ContractForm.get('FineSecond')?.clearValidators();
        this.ContractForm.get('FineSecond')?.setErrors(null);
        this.ContractForm.get('FineSecond')?.updateValueAndValidity();

        this.ContractForm.get('FineThird')?.clearValidators();
        this.ContractForm.get('FineThird')?.setErrors(null);
        this.ContractForm.get('FineThird')?.updateValueAndValidity();

        this.ContractForm.get('FineFourth')?.clearValidators();
        this.ContractForm.get('FineFourth')?.setErrors(null);
        this.ContractForm.get('FineFourth')?.updateValueAndValidity();

        this.ContractForm.get('FineText')?.clearValidators();
        this.ContractForm.get('FineText')?.setErrors(null);
        this.ContractForm.get('FineText')?.updateValueAndValidity();
        
        this.ContractForm.get('FinePercent')?.clearValidators();
        this.ContractForm.get('FinePercent')?.setErrors(null);
        this.ContractForm.get('FinePercent')?.updateValueAndValidity();
        break;
    }




    // if (this.checkPenalties) {
    //   this.ContractForm.get('FineFirst')?.setValidators([Validators.required]);
    //   this.ContractForm.get('FineThird')?.setValidators([Validators.required]);
    //   this.ContractForm.get('FinePercent')?.setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.get('FineFirst')?.clearValidators();
    //   this.ContractForm.get('FineFirst')?.setErrors(null);
    //   this.ContractForm.get('FineFirst')?.updateValueAndValidity();

    //   this.ContractForm.get('FinePercent')?.clearValidators();
    //   this.ContractForm.get('FinePercent')?.setErrors(null);
    //   this.ContractForm.get('FinePercent')?.updateValueAndValidity();

    //   this.ContractForm.get('FineThird')?.clearValidators();
    //   this.ContractForm.get('FineThird')?.setErrors(null);
    //   this.ContractForm.get('FineThird')?.updateValueAndValidity();
    // }

    // if (this.checkPenalties && this.contractType == 'P' || this.contractType === 'E') {
    //   this.ContractForm.get('FineText')?.setValidators([Validators.required]);
    // } else {
    //   this.ContractForm.get('FineText')?.clearValidators();
    //   this.ContractForm.get('FineText')?.setErrors(null);
    //   this.ContractForm.get('FineText')?.updateValueAndValidity();
    // }

    // if (this.checkPenalties && this.contractType == 'F') {
    //   this.ContractForm.get('FineFirst')?.clearValidators();
    //   this.ContractForm.get('FineFirst')?.setErrors(null);
    //   this.ContractForm.get('FineFirst')?.updateValueAndValidity();
    // }

    // if (this.checkPenalties && (this.contractType == 'G' || this.contractType == 'T' || this.contractType == 'D' || this.contractType == 'F' || this.contractType === 'E')) {
    //   this.ContractForm.get('FineThird')?.clearValidators();
    //   this.ContractForm.get('FineThird')?.setErrors(null);
    //   this.ContractForm.get('FineThird')?.updateValueAndValidity();
    // }

    // if (this.checkPenalties && this.contractType == 'G') {
    //   this.ContractForm.get('FineFirst')?.clearValidators();
    //   this.ContractForm.get('FineFirst')?.setErrors(null);
    //   this.ContractForm.get('FineFirst')?.updateValueAndValidity();
    // }


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
    if (this.checkExtracts && !this.rmiStatus && this.contractType != 'R' && this.contractType != 'T') {
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

  showPlace() {
    if (this.checkPlace) {
      this.checkPlace = false;
    } else {
      this.checkPlace = true;
    }
    this.setPlaceValidators();
  }

  setPlaceValidators() {
    if (this.checkPlace && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'R' && this.contractType != 'P') {
      this.ContractForm.get('ExePlace')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('ExePlace')?.clearValidators();
      this.ContractForm.get('ExePlace')?.setErrors(null);
      this.ContractForm.get('ExePlace')?.updateValueAndValidity();
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

  get Manpower() {
    return this.ContractForm.get('ManPower') as FormArray;
  }

  //** Manpower ends **//

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

  copyChecked(event: any, i: any) {
    this.copyToList[i].flag = event.target.checked;
    this.selectAll = this.copyToList.every(i => i.flag);

  }

  showScope() {
    if (this.checkScope) {
      this.checkScope = false;
    } else {
      this.checkScope = true;
    }
    this.setScopeValidators();
  }

  setScopeValidators(){
    if(this.checkScope){
      this.ContractForm.controls['WorkScope'].setValidators([Validators.required]);
    } else{
      this.ContractForm.get('WorkScope')?.clearValidators();
      this.ContractForm.get('WorkScope')?.setErrors(null);
      this.ContractForm.get('WorkScope')?.updateValueAndValidity();
    }
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


  showInsurance() {
    if (this.checkInsurance) {
      this.checkInsurance = false;
    } else {
      this.checkInsurance = true;
    }
    // this.setScopeValidators();
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

  showSpecsWorkGroup() {
    if (this.checkSpecsWorkGroup) {
      this.checkSpecsWorkGroup = false;
    } else {
      this.checkSpecsWorkGroup = true;
    }
    this.setSpecsValidators();
  }

  showSpecsImplServ() {
    if (this.checkSpecsImplServ) {
      this.checkSpecsImplServ = false;
    } else {
      this.checkSpecsImplServ = true;
    }
    this.setSpecsValidators();
  }

  setSpecsValidators() {
    if (this.checkSpecs && this.checkSpecsTeam && this.ContractForm.controls['showSpecsTeam'].value && this.contractType != 'F' && this.contractType != 'P') {
      this.ContractForm.get('SpecsTeam')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsTeam')?.clearValidators();
      this.ContractForm.get('SpecsTeam')?.setErrors(null);
      this.ContractForm.get('SpecsTeam')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsMat && this.ContractForm.controls['showSpecsMat'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'F' && this.contractType != 'G' && this.contractType != 'P' && this.contractType != 'D') {
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

    if (this.checkSpecs && this.checkSpecsSafety && this.ContractForm.controls['showSpecsSafety'].value && this.contractType == 'P') {
      this.ContractForm.get('SpecsSafety')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsSafety')?.clearValidators();
      this.ContractForm.get('SpecsSafety')?.setErrors(null);
      this.ContractForm.get('SpecsSafety')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsWorkGroup && this.ContractForm.controls['showSpecsWorkGroup'].value && this.contractType == 'P') {
      this.ContractForm.get('SpecsWorkGroup')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsWorkGroup')?.clearValidators();
      this.ContractForm.get('SpecsWorkGroup')?.setErrors(null);
      this.ContractForm.get('SpecsWorkGroup')?.updateValueAndValidity();
    }

    if (this.checkSpecs && this.checkSpecsImplServ && this.ContractForm.controls['showSpecsImplServ'].value && this.contractType == 'P') {
      this.ContractForm.get('SpecsImplServ')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('SpecsImplServ')?.clearValidators();
      this.ContractForm.get('SpecsImplServ')?.setErrors(null);
      this.ContractForm.get('SpecsImplServ')?.updateValueAndValidity();
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
    if (this.checkContent && this.checkContentMand && this.ContractForm.controls['showContentMand'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'D' && this.contractType != 'E' && this.contractType != 'F') {
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

    if (this.checkTerms && this.checkTermsFollow && this.ContractForm.controls['showTermsFollow'].value && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'R' && this.contractType != 'M') {
      this.ContractForm.get('TermsFollow')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsFollow')?.clearValidators();
      this.ContractForm.get('TermsFollow')?.setErrors(null);
      this.ContractForm.get('TermsFollow')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsInsp && this.ContractForm.controls['showTermsInsp'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D' && this.contractType != 'E' && this.contractType != 'R') {
      this.ContractForm.get('TermsInsp')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsInsp')?.clearValidators();
      this.ContractForm.get('TermsInsp')?.setErrors(null);
      this.ContractForm.get('TermsInsp')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsChart && this.ContractForm.controls['showTermsChart'].value && this.contractType != 'C' && this.contractType != 'T' && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'P' && this.contractType != 'D' && this.contractType != 'E' && this.contractType != 'M') {
      this.ContractForm.get('TermsChart')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsChart')?.clearValidators();
      this.ContractForm.get('TermsChart')?.setErrors(null);
      this.ContractForm.get('TermsChart')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsTrain && this.ContractForm.controls['showTermsTrain'].value && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'M') {
      this.ContractForm.get('TermsTrain')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsTrain')?.clearValidators();
      this.ContractForm.get('TermsTrain')?.setErrors(null);
      this.ContractForm.get('TermsTrain')?.updateValueAndValidity();
    }

    if (this.checkTerms && this.checkTermsReport && this.ContractForm.controls['showTermsReport'].value && this.contractType != 'G' && this.contractType != 'F' && this.contractType != 'M' && this.contractType != 'T') {
      this.ContractForm.get('TermsReport')?.setValidators([Validators.required]);
    } else {
      this.ContractForm.get('TermsReport')?.clearValidators();
      this.ContractForm.get('TermsReport')?.setErrors(null);
      this.ContractForm.get('TermsReport')?.updateValueAndValidity();
    }
  }

  // showAppendix() {
  //   if (this.checkAppendix) {
  //     this.checkAppendix = false;
  //   } else {
  //     this.checkAppendix = true;
  //   }
  //   // this.setAppendixValidators();
  // }

  // setAppendixValidators() {
  //   if (this.checkAppendix && this.contractType != 'M' && this.contractType != 'C' && this.contractType != 'P' && this.contractType != 'T' && this.contractType != 'F' && this.contractType != 'R') {
  //     this.ContractForm.get('Accessories')?.setValidators([Validators.required]);
  //   } else {
  //     this.ContractForm.get('Accessories')?.clearValidators();
  //     this.ContractForm.get('Accessories')?.setErrors(null);
  //     this.ContractForm.get('Accessories')?.updateValueAndValidity();
  //   }
  // }


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




  // get payment schedule API call
  getContractPayment(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
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
  // payment schedule mapping function
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
          Percentage: new FormControl(item.Percentage, [Validators.required]),
          PayAmount: new FormControl({ value: ((Number(item.Percentage) / 100) * totalAmount).toFixed(2), disabled: true }, Validators.required),
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

  // check for payment schedule not more than 100%
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

  // add payment schedule function
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
  // delete payment schedule function
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
  // reset payment schedule function
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
  get ContPayment() {
    return this.ContractForm.get('ContPayment') as FormArray;
  }

  // save payment schedule function
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
    this.listOfContPaymentData.forEach((per: any) => {
      totalPercent += Number(per.Percentage)
    });
    this.totalPercentage = totalPercent;
    if (totalPercent > 100) {
      this.showPayError = true;
      this.isPayPercentValid = true;
    } else {
      this.showPayError = false;
      this.isPayPercentValid = false;
    }


  }

  // submit payment schedule API call
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

  downloadPDF(flag: any) {
    this.apiService.downloadPDF(flag, this.award_number, this.contractType);
  }



  backToDashboard() {
    if (this.rmiStatus) {
      this.router.navigateByUrl('contract/officerDashboard/rmi')
    } else {
      this.router.navigateByUrl('contract/officerDashboard/ContCrt')
    }
  }

  BgValiDateCalChange() {
    this.ContractForm.get('ValidTill')?.setValue('');
    this.ContractForm.get('DateOfIssue')?.setValue('');
  }

  // Submit contract to legal unit head
  submit(status: any) {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;

    let PrintableAwardDate: any;
    let PrintableAwardDt = this.ContractForm.controls['PrintAwardDate'].value;
    PrintableAwardDate = this.ContractForm.controls['PrintAwardDate'].invalid ? '' : (PrintableAwardDt.year + "-" + PrintableAwardDt.month + "-" + PrintableAwardDt.day);

    let bankGuarDate: any;
    if (this.ContractForm.controls['BgValidDateCal'].value == 'H') {
      let bankGuarDt = this.ContractForm.controls['DateOfIssue'].value;
      bankGuarDate = this.ContractForm.controls['DateOfIssue'].invalid ? '' : (bankGuarDt.year + "-" + bankGuarDt.month + "-" + bankGuarDt.day);
    } else {
      bankGuarDate = this.ContractForm.controls['DateOfIssue'].value;
    }

    let bankValidDate: any;
    if (this.ContractForm.controls['BgValidDateCal'].value == 'H') {
      let bankValidDt = this.ContractForm.controls['ValidTill'].value;
      bankValidDate = this.ContractForm.controls['ValidTill'].invalid ? '' : (bankValidDt.year + "-" + bankValidDt.month + "-" + bankValidDt.day);
    } else {
      bankValidDate = this.ContractForm.controls['ValidTill'].value;
    }

    let authDate = this.ContractForm.controls['authLetterDate'].value;

    let contDate = this.ContractForm.controls['conDate'].value;
    let signDate = this.ContractForm.controls['conSignDate'].value;
    let powerAttDate = this.ContractForm.controls['powerDate'].value;
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

    if (status == 'submit' || status == 'RFP') {
      if (this.contractType == 'G') {
        this.ContractForm.get('ProcessDescription')?.clearValidators();
        this.ContractForm.get('ProcessDescription')?.setErrors(null);
        this.ContractForm.get('ProcessDescription')?.updateValueAndValidity();
      }
      this.approvePayload.Comments = "";
      this.setValidators();
      this.initialValidators();

      Object.keys(this.ContractForm.controls).forEach(field => {
        const control = this.ContractForm.get(field);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });

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
      if (status == 'submit') {
        this.approvePayload.Flag = 'ASG';
      } else if (status == 'RFP') {
        this.approvePayload.Flag = 'IRV';
      }
      // this.approvePayload.ContreqStatus = 'LMP1';
      this.approvePayload.Comments = '';
    }
    if (status == 'save') {
      this.approvePayload.Flag = 'DRF';
      this.approvePayload.Comments = this.ContractForm.controls['Comment'].value;
    }

    //Country code assignment
    let CommNationality = '';
    this.detailedCountryList.forEach((country: any) => {
      if (this.ContractForm.controls['CommNation'].value == country.Natx50En || this.ContractForm.controls['CommNation'].value == country.Natx50AR) {
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

    switch (this.contractType) {
      case 'I':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineThird'].value) ? this.ContractForm.controls['FineThird'].value : '';
        this.approvePayload.PenalltyTxtBox = (!this.checkPenalties && this.ContractForm.controls['FineText'].value) ? this.ContractForm.controls['FineText'].value : '';
        break;
      case 'M':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineThird'].value) ? this.ContractForm.controls['FineThird'].value : '';
        this.approvePayload.PenalltyTxtBox = (!this.checkPenalties && this.ContractForm.controls['FineText'].value) ? this.ContractForm.controls['FineText'].value : '';
        break;
      case 'C':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineSecond'].value) ? this.ContractForm.controls['FineSecond'].value : '';
        this.approvePayload.PenalltyTxtBox = (!this.checkPenalties && this.ContractForm.controls['FineText'].value) ? this.ContractForm.controls['FineText'].value : '';
        break;
      case 'P':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenalltyTxtBox = (this.checkPenalties && this.ContractForm.controls['FineSecond'].value) ? this.ContractForm.controls['FineSecond'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineFourth'].value) ? this.ContractForm.controls['FineFourth'].value : '';
        this.approvePayload.PenalltyTxtBox = (!this.checkPenalties && this.ContractForm.controls['FineText'].value) ? this.ContractForm.controls['FineText'].value : '';
        break;
      case 'E':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineSecond'].value) ? this.ContractForm.controls['FineSecond'].value : '';
        break;
      case 'D':
        this.approvePayload.TextFineSection = this.ContractForm.controls['FineFirst'].value ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = this.ContractForm.controls['FineSecond'].value ? this.ContractForm.controls['FineSecond'].value : '';
        break;
      case 'R':
        this.approvePayload.TextFineSection = (this.checkPenalties && this.ContractForm.controls['FineFirst'].value) ? this.ContractForm.controls['FineFirst'].value : '';
        this.approvePayload.PenaltyThird = (this.checkPenalties && this.ContractForm.controls['FineThird'].value) ? this.ContractForm.controls['FineThird'].value : '';
        break;
      case 'T':
        this.approvePayload.TextFineSection = this.ContractForm.controls['FineFirst'].value ? this.ContractForm.controls['FineFirst'].value : '';
        break;
      case 'G':
        this.approvePayload.TextFineSection = this.ContractForm.controls['FineText'].value ? this.ContractForm.controls['FineText'].value : '';
        break;
      default:
        break;
    }

    // this.approvePayload.Assignee = this.approvePayload.ContUo;
    let contStartDate = this.ContractForm.controls['ContractStartDate'].value;
    this.approvePayload.ContStartDate = (!this.ContractForm.controls['ContractStartToggle'].value && contStartDate) ? (moment(contStartDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.DateTextBox = (this.ContractForm.controls['ContractStartToggle'].value && this.ContractForm.controls['ContractStartText'].value) ? this.ContractForm.controls['ContractStartText'].value : '',
      this.approvePayload.DateTextFlag = this.ContractForm.controls['ContractStartToggle'].value ? 'X' : ''
    this.approvePayload.BriefDescr = this.ContractForm.controls['ProcessDescription'].value;
    // this.approvePayload.DurationContr = this.ContractForm.controls['ProjectDuration'].value.toString();
    this.approvePayload.CommRegNum = this.ContractForm.controls['RegNumber'].value.toString();
    this.approvePayload.VNDRREGTYPE = this.ContractForm.controls['RegType'].value;

    this.approvePayload.AwardLetter = this.ContractForm.controls['PrintAwardLetter'].value ? this.ContractForm.controls['PrintAwardLetter'].value : '';
    this.approvePayload.AwardDatePrint = PrintableAwardDate ? (moment(PrintableAwardDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '';


    // this.approvePayload.BankGuarantee = this.ContractForm.get('BankGuarantee')?.value ? 'X' : '';
    this.approvePayload.BgNum = this.ContractForm.controls['GuranteeNumber']?.value ? this.ContractForm.controls['GuranteeNumber']?.value.toString() : '';
    this.approvePayload.BgPercentage = this.ContractForm.controls['GuranteePercent']?.value ? this.ContractForm.controls['GuranteePercent']?.value.toString() : '';
    this.approvePayload.BgAmount = this.ContractForm.controls['GuranteeAmount']?.value ? this.cs.removeCommas(this.ContractForm.controls['GuranteeAmount']?.value).toString() : '';
    this.approvePayload.BgCurrency = this.ContractForm.controls['GuranteeCurrency']?.value ? this.ContractForm.controls['GuranteeCurrency']?.value : '';
    this.approvePayload.BgIssuedBy = this.ContractForm.controls['GuranteeIssuedBy']?.value;
    console.log(this.ContractForm.controls['GuranteeIssuedBy']?.value);
    
    this.approvePayload.BgDate = bankGuarDate ? (moment(bankGuarDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '';
    this.approvePayload.BgValidDate = bankValidDate ? (moment(bankValidDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.BgDateCalender = this.ContractForm.controls['BgDateCalender']?.value;
    this.approvePayload.BgValidDateCal = this.ContractForm.controls['BgValidDateCal']?.value;
    this.approvePayload.DelegateName = this.ContractForm.controls['DeligateName'].value,
      this.approvePayload.ComNationality = CommNationality,
      this.approvePayload.IdType = this.ContractForm.controls['proofId'].value,
      this.approvePayload.IdNatId = this.ContractForm.controls['proofId'].value == 'N' ? this.ContractForm.controls['NationalId'].value.toString() : '',
      this.approvePayload.IdResiNumber = this.ContractForm.controls['proofId'].value == 'R' ? this.ContractForm.controls['ResidenceNumber'].value.toString() : '',
      this.approvePayload.IdPpNum = this.ContractForm.controls['proofId'].value == 'P' ? this.ContractForm.controls['PassportNumber'].value : '',
      this.approvePayload.SignAuth = this.ContractForm.controls['signAuth'].value,
      this.approvePayload.AuthSelect = this.ContractForm.controls['signAuth'].value == 'D' ? authorization : '',
      this.approvePayload.AuthLetterNum = (authorization == 'C' && this.ContractForm.controls['authLetterNumber'].value) ? this.ContractForm.controls['authLetterNumber'].value.toString() : '',
      this.approvePayload.AuthLetterDate = (authorization == 'C' && authDate) ? (moment(authDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.PwrAtrnyNum = (authorization == 'A' && this.ContractForm.controls['powerNumber'].value) ? this.ContractForm.controls['powerNumber'].value.toString() : '',
      this.approvePayload.PwrAtrnyDate = (authorization == 'A' && powerAttDate) ? (moment(powerAttDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.PermContrAdd = this.ContractForm.controls['conAddress'].value,
      this.approvePayload.ContrCity = this.ContractForm.controls['conCity'].value,
      this.approvePayload.ContrSignCity = this.ContractForm.controls['signCity'].value,
      this.approvePayload.FinalApproval = this.ContractForm.controls['FinalApproval'].value,
      this.approvePayload.VendCompanyInst = this.ContractForm.controls['company'].value,
      this.approvePayload.VendCompInstOther = (this.ContractForm.controls['company'].value == 'O') ? this.ContractForm.controls['otherEntity'].value : '';
      this.approvePayload.ContrCountry = ContractCountry,
      this.approvePayload.ContrPhone = this.ContractForm.controls['conPhone'].value ? this.ContractForm.controls['conPhone'].value.toString() : '',
      this.approvePayload.ContrMailBox = this.ContractForm.controls['mailBox'].value ? this.ContractForm.controls['mailBox'].value.toString() : '',
      this.approvePayload.ContrPostalCode = this.ContractForm.controls['postalCode'].value ? this.ContractForm.controls['postalCode'].value.toString() : '',
      this.approvePayload.ContrEmail = this.ContractForm.controls['eMail'].value,
      this.approvePayload.BidNumSubVend = this.ContractForm.controls['conBidNumber'].value ? this.ContractForm.controls['conBidNumber'].value.toString() : '',
      this.approvePayload.BidNumSubVendDt = contDate ? (moment(contDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.DaySignContr = this.ContractForm.controls['conSignDay'].value,
      this.approvePayload.DateSignContr = signDate ? (moment(signDate, 'YYYY-MM-DD').format('DD.MM.YYYY')).toString() : '',
      this.approvePayload.DurationText = this.isTextDurationChecked ? this.ContractForm.controls['durationWork'].value : '',
      this.approvePayload.PowFirst = this.ContractForm.controls['proFirst'].value,
      this.approvePayload.PowSecond = this.ContractForm.controls['proSecond'].value,
      this.approvePayload.DaysForAction = this.ContractForm.controls['DaysForAction'].value ? this.ContractForm.controls['DaysForAction'].value.toString() : '',
      this.approvePayload.EvaluationPeriod = this.checkEvaluation ? this.ContractForm.controls['EvaluationPeriod'].value : '',
      this.approvePayload.CntPerfEval = (this.checkPerfEval && this.ContractForm.controls['PerfEval'].value) ? this.ContractForm.controls['PerfEval'].value : '',

      this.approvePayload.Downpayment = this.ContractForm.controls['Downpayment'].value ? 'X' : '',
      // DurCompWrk: this.ContractForm.controls['DurCompWrk'].value ? 'X' : '',
      this.approvePayload.DownpayRate = this.ContractForm.controls['downRate'].value ? this.ContractForm.controls['downRate'].value.toString() : '',
      this.approvePayload.AdvancePercentage = this.ContractForm.controls['downPercent'].value ? this.ContractForm.controls['downPercent'].value.toString() : '',
      this.approvePayload.DownpayAmt = this.ContractForm.controls['downAmount'].value ? this.cs.removeCommas(this.ContractForm.controls['downAmount'].value.toString()) : '',


      this.approvePayload.RecRetPeriod = this.ContractForm.controls['RetentionPeriod'].value ? this.ContractForm.controls['RetentionPeriod'].value : '',
      this.approvePayload.MaxDaysRenLic = this.ContractForm.controls['RenewalDays'].value ? this.ContractForm.controls['RenewalDays'].value : '',
      this.approvePayload.FirstArbitration = (this.checkFirstArb && this.ContractForm.controls['showFirstArb'].value && this.ContractForm.controls['FirstArb'].value) ? this.ContractForm.controls['FirstArb'].value : '',
      this.approvePayload.SecondArbitration = (this.checkSecondArb && this.ContractForm.controls['showSecondArb'].value && this.ContractForm.controls['SecondArb'].value) ? this.ContractForm.controls['SecondArb'].value : '',
      this.approvePayload.ThirdArbitration = (this.checkThirdArb && this.ContractForm.controls['showThirdArb'].value && this.ContractForm.controls['ThirdArb'].value) ? this.ContractForm.controls['ThirdArb'].value : '',
      this.approvePayload.ResponsePeriod = this.ContractForm.controls['ResponsePeriod'].value ? this.ContractForm.controls['ResponsePeriod'].value : '',
      this.approvePayload.RespTmCntPr = this.ContractForm.controls['PurResponseTime'].value + '' ? this.ContractForm.controls['PurResponseTime'].value + '' : '',
      this.approvePayload.AgrPeriod = this.ContractForm.controls['AgreePeriod'].value ? this.ContractForm.controls['AgreePeriod'].value : '',
      this.approvePayload.NoOfParties = this.ContractForm.controls['NumberOfParties'].value ? this.ContractForm.controls['NumberOfParties'].value : '',
      this.approvePayload.PrdContRplRep = this.ContractForm.controls['ReplacePeriod'].value ? this.ContractForm.controls['ReplacePeriod'].value : '',
      this.approvePayload.TrmsAgrFirst = (this.checkFirstAgree && this.ContractForm.controls['showFirstAgree'] && this.ContractForm.controls['FirstAgree'].value) ? this.ContractForm.controls['FirstAgree'].value : '',
      this.approvePayload.TrmsAgrSecond = (this.checkSecondAgree && this.ContractForm.controls['showSecondAgree'] && this.ContractForm.controls['SecondAgree'].value) ? this.ContractForm.controls['SecondAgree'].value : '',
      this.approvePayload.TrmsAgrThird = (this.checkThirdAgree && this.ContractForm.controls['showThirdAgree'] && this.ContractForm.controls['ThirdAgree'].value) ? this.ContractForm.controls['ThirdAgree'].value : '',

      this.approvePayload.FirstSubSec = (this.checkFirstBusiness && this.ContractForm.controls['showFirstBusiness'].value && this.ContractForm.controls['FirstBusiness'].value) ? this.ContractForm.controls['FirstBusiness'].value : '',
      this.approvePayload.SecondSubSec = (this.checkSecondBusiness && this.ContractForm.controls['showSecondBusiness'].value && this.ContractForm.controls['SecondBusiness'].value) ? this.ContractForm.controls['SecondBusiness'].value : '',
      this.approvePayload.ThirdSubSec = (this.checkThirdBusiness && this.ContractForm.controls['showThirdBusiness'].value && this.ContractForm.controls['ThirdBusiness'].value) ? this.ContractForm.controls['ThirdBusiness'].value : '',
      this.approvePayload.WrkPgmFirst = (this.ContractForm.controls['FirstWorkPro'].value) ? this.ContractForm.controls['FirstWorkPro'].value : '',
      this.approvePayload.WrkPgmSecond = (this.ContractForm.controls['SecondWorkPro'].value) ? this.ContractForm.controls['SecondWorkPro'].value : '',
      this.approvePayload.WrkPgmThird = (this.ContractForm.controls['ThirdWorkPro'].value) ? this.ContractForm.controls['ThirdWorkPro'].value : '',
      this.approvePayload.WrkPgmFourth = (this.ContractForm.controls['FourthWorkPro'].value) ? this.ContractForm.controls['FourthWorkPro'].value : '',
      this.approvePayload.TeschDisReslDys = this.ContractForm.controls['DisputeResolutionDays'].value ? this.ContractForm.controls['DisputeResolutionDays'].value : '',
      this.approvePayload.RespPrdCnt = this.ContractForm.controls['ContRespPeriod'].value ? this.ContractForm.controls['ContRespPeriod'].value : '',
      this.approvePayload.InabtyToImp = this.ContractForm.controls['PriorNotifPerson'].value ? this.ContractForm.controls['PriorNotifPerson'].value : '',
      this.approvePayload.InvoiceFirst = (this.checkFirstInvoice && this.ContractForm.controls['showFirstInvoice'].value && this.ContractForm.controls['FirstInvoice'].value) ? this.ContractForm.controls['FirstInvoice'].value : '',
      this.approvePayload.InvoiceSecond = (this.checkSecondInvoice && this.ContractForm.controls['showSecondInvoice'].value && this.ContractForm.controls['SecondInvoice'].value) ? this.ContractForm.controls['SecondInvoice'].value : '',
      this.approvePayload.InvoiceThird = (this.checkThirdInvoice && this.ContractForm.controls['showThirdInvoice'].value && this.ContractForm.controls['ThirdInvoice'].value) ? this.ContractForm.controls['ThirdInvoice'].value : '',
      this.approvePayload.RefToPrices = (this.checkFirstPrices && this.ContractForm.controls['showFirstPrices'].value && this.ContractForm.controls['FirstPrices'].value) ? this.ContractForm.controls['FirstPrices'].value : '',
      this.approvePayload.Insurance = (this.checkInsurance && this.ContractForm.controls['showDynamicInsurance'].value) ? this.ContractForm.controls['Insurance'].value : '',

      // this.approvePayload.PenalltyTxtBox = (!this.checkPenalties && this.contractType != 'G' && this.contractType != 'P' && this.contractType != 'T' && this.contractType != 'D' && this.contractType != 'R' && this.contractType != 'F' && this.contractType != 'E') || (this.checkPenalties && (this.contractType == 'C' || this.contractType == 'P' || this.contractType == 'D' || this.contractType == 'E')) ? this.ContractForm.controls['FineText'].value : '',
      // this.approvePayload.TextFineSection = this.checkPenalties ? this.ContractForm.controls['FineFirst'].value : '',
      // PenaltyPercentage: this.checkPenalties ? this.ContractForm.controls['FinePercent'].value.toString() : '',
      this.approvePayload.PenaltyPercentage = this.ContractForm.controls['FinePercent'].value ? this.ContractForm.controls['FinePercent'].value.toString() : '',
      // this.approvePayload.WeeklyPnltyPerctg = this.ContractForm.controls['WeeklyPnltyPerctg'].value ? this.ContractForm.controls['WeeklyPnltyPerctg'].value.toString() : '',
      // this.approvePayload.MaximumPnltyPerctg = this.ContractForm.controls['MaximumPnltyPerctg'].value ? this.ContractForm.controls['MaximumPnltyPerctg'].value.toString() : '',
      this.approvePayload.MtdCalcFines = this.ContractForm.controls['MtdCalcFines'].value ? this.ContractForm.controls['MtdCalcFines'].value : '',
      // this.approvePayload.PenaltyThird = this.checkPenalties ? this.ContractForm.controls['FineThird'].value : '',




      this.approvePayload.TextExtractSection = this.checkExtracts ? this.ContractForm.controls['ExtractFirst'].value : '',
      this.approvePayload.ExtractsSecond = this.checkExtracts ? this.ContractForm.controls['ExtractSecond'].value : '',
      this.approvePayload.ExtractsThird = this.checkExtracts ? this.ContractForm.controls['ExtractThird'].value : '',
      this.approvePayload.TableOfQunatPrice = this.checkTableQuant ? this.ContractForm.controls['TableQP'].value : '',
      this.approvePayload.TextPlaceExeWork = this.checkPlace ? this.ContractForm.controls['ExePlace'].value : '',
      this.approvePayload.Beneficiary = (this.checkFirstBenef && this.ContractForm.controls['showFirstBenef'].value && this.ContractForm.controls['FirstBenef'].value) ? this.ContractForm.controls['FirstBenef'].value : '',

      this.approvePayload.ScopeOfWrk = this.checkScope ? this.ContractForm.controls['WorkScope'].value : '';
    this.approvePayload.Location = (this.checkLocation && this.ContractForm.controls['showDynamicLocation'].value) ? this.ContractForm.controls['Location'].value : '';
    this.approvePayload.WorkSite = (this.checkWorkSite && this.ContractForm.controls['showDynamicWorkSite'].value) ? this.ContractForm.controls['WorkSite'].value : '';
    this.approvePayload.PsText = this.ContractForm.controls['PaySchedule'].value;
    this.approvePayload.TeamsSpec = (this.checkSpecs && this.checkSpecsTeam && this.ContractForm.controls['showSpecsTeam'].value) ? this.ContractForm.controls['SpecsTeam'].value : '';
    this.approvePayload.MaterialSpec = (this.checkSpecs && this.checkSpecsMat && this.ContractForm.controls['showSpecsMat'].value) ? this.ContractForm.controls['SpecsMat'].value : '';
    this.approvePayload.EquipSpec = (this.checkSpecs && this.checkSpecsEqui && this.ContractForm.controls['showSpecsEqui'].value) ? this.ContractForm.controls['SpecsEqui'].value : '';
    this.approvePayload.WorkCarryoutMethod = (this.checkSpecs && this.checkSpecsWork && this.ContractForm.controls['showSpecsWork'].value) ? this.ContractForm.controls['SpecsWork'].value : '';
    this.approvePayload.QualitySpec = (this.checkSpecs && this.checkSpecsQual && this.ContractForm.controls['showSpecsQual'].value) ? this.ContractForm.controls['SpecsQual'].value : '';
    this.approvePayload.SafetySpec = (this.checkSpecs && this.checkSpecsSafety && this.ContractForm.controls['showSpecsSafety'].value) ? this.ContractForm.controls['SpecsSafety'].value : '';
    this.approvePayload.WorkingGroup = (this.checkSpecs && this.checkSpecsWorkGroup && this.ContractForm.controls['showSpecsWorkGroup'].value) ? this.ContractForm.controls['SpecsWorkGroup'].value : '';
    this.approvePayload.MethodImpServ = (this.checkSpecs && this.checkSpecsImplServ && this.ContractForm.controls['showSpecsImplServ'].value) ? this.ContractForm.controls['SpecsImplServ'].value : '';
    this.approvePayload.Mandterms = (this.checkContent && this.checkContentMand && this.ContractForm.controls['showContentMand'].value) ? this.ContractForm.controls['ContentMand'].value : '';
    this.approvePayload.LocalContRatio = (this.checkContent && this.checkContentRatio && this.ContractForm.controls['showContentRatio'].value) ? this.ContractForm.controls['ContentRatio'].value : '';
    this.approvePayload.NatProdShare = (this.checkContent && this.checkContentShare && this.ContractForm.controls['showContentShare'].value) ? this.ContractForm.controls['ContentShare'].value : '';
    this.approvePayload.InsuranceRqts = (this.checkTerms && this.checkTermsInsur && this.ContractForm.controls['showTermsInsur'].value) ? this.ContractForm.controls['TermsInsur'].value : '';
    this.approvePayload.SpeclCond = (this.checkTerms && this.checkNatureSepclCond && this.ContractForm.controls['showNatureSepclCond'].value) ? this.ContractForm.controls['NatureSepclCond'].value : '';
    this.approvePayload.SupportServices = (this.checkTerms && this.checkWorkSuppServ && this.ContractForm.controls['showWorkSuppServ'].value) ? this.ContractForm.controls['WorkSuppServ'].value : '';
    this.approvePayload.ServiceProgRep = (this.checkTerms && this.checkServProgRep && this.ContractForm.controls['showServProgRep'].value) ? this.ContractForm.controls['ServProgRep'].value : '';
    this.approvePayload.RulesPrinciples = (this.checkTerms && this.checkProfRules && this.ContractForm.controls['showProfRules'].value) ? this.ContractForm.controls['ProfRules'].value : '';
    this.approvePayload.WarrantPeriod = (this.checkTerms && this.checkWarrantPeriod && this.ContractForm.controls['showWarrantPeriod'].value) ? this.ContractForm.controls['WarrantPeriod'].value : '';
    this.approvePayload.MdrnSkillsMthds = (this.checkTerms && this.checkModernSkills && this.ContractForm.controls['showModernSkills'].value) ? this.ContractForm.controls['ModernSkills'].value : '';
    this.approvePayload.WorkHrs = (this.checkTerms && this.checkTermsHours && this.ContractForm.controls['showTermsHours'].value) ? this.ContractForm.controls['TermsHours'].value : '';
    this.approvePayload.Followup = (this.checkTerms && this.checkTermsFollow && this.ContractForm.controls['showTermsFollow'].value) ? this.ContractForm.controls['TermsFollow'].value : '';
    this.approvePayload.Inspection = (this.checkTerms && this.checkTermsInsp && this.ContractForm.controls['showTermsInsp'].value) ? this.ContractForm.controls['TermsInsp'].value : '';
    this.approvePayload.SaveCharts = (this.checkTerms && this.checkTermsChart && this.ContractForm.controls['showTermsChart'].value) ? this.ContractForm.controls['TermsChart'].value : '';
    this.approvePayload.SauTraining = (this.checkTerms && this.checkTermsTrain && this.ContractForm.controls['showTermsTrain'].value) ? this.ContractForm.controls['TermsTrain'].value : '';
    this.approvePayload.WrkProgRep = (this.checkTerms && this.checkTermsReport && this.ContractForm.controls['showTermsReport'].value) ? this.ContractForm.controls['TermsReport'].value : '';
    this.approvePayload.Appendix = this.ContractForm.controls['Accessories'].value ? this.ContractForm.controls['Accessories'].value : '';

    // this.approvePayload.Comments = this.ContractForm.controls['Comment'].value;

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
        this.sendDeptCopyTo();
        this.submitManPower();
        this.submitContEvaluation();
        this.submitPaySchedule();
        this.addTextInPDF();
        this.addDynTextInPDF();
        this.spinner.hide();
        if (status == 'submit') {
          this.addComment(conStatus);
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract Approved Successfully')
          } else {
            this.message.create('success', "تم اعتماد العقد بنجاح")
          }
          this.router.navigateByUrl('contract/officerDashboard/rmi');
        } else if (status == 'save') {
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', 'Contract Saved as draft')
          } else {
            this.message.create('success', "تم حفظ العقد كمسودة")
          }
        } else if (status == "RFP") {
          this.addComment(conStatus);
          if (this.cs.userLanguage == 'en') {
            this.message.create('success', "Contract assigned to Requestor's Manager successfully")
          } else {
            this.message.create('success', 'تم تعيين العقد لمدير الطالب بنجاح')
          }
        }
        this.router.navigateByUrl('contract/officerDashboard/ContCrt')
      }
    });
  }

  //  submit RMI contract to legal unit officer
  submitRmi() {
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
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Submitted Successfully')
        } else {
          this.message.create('success', "تم إرسال العقد بنجاح")
        }
        this.router.navigateByUrl('contract/officerDashboard/rmi')
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
        "Role": "Contract Unit Officer",
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



  // * Attachment section starts
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

  // attchment section ends

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

  // validation pop-up form data population
  getFormErrors() {
    let mandatory = '';
    if (this.cs.userLanguage == 'en') {
      mandatory = 'is mandatory'
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
    if (this.fileNetList.length == 0) {
      this.errorList.push(this.getStandardFormName('Attachment') + " " + mandatory);
    }
    // copy of contract
    let arr = this.copyToList.filter(x => x.flag === true);
    if (arr.length == 0) {
      this.errorList.push(this.getStandardFormName('CopyofContract') + " " + mandatory);
    }

    if(this.checkEvaluationPeriod && this.checkEvaluation && this.ContractForm.get('EvaluationPeriod')?.value != 'F'){
      if(this.ContEvaluation.getRawValue().length == 0 || !this.ContEvaluation.valid){
        this.errorList.push(this.getStandardFormName('EvaluationDate') + " " + mandatory);
      } else if(this.ContEvaluation.getRawValue().length > this.listOfContEvaluationData.length || this.listOfContEvaluationData.includes(undefined)){
        this.errorList.push(this.getStandardFormName('saveEvaluationDate'));
      }
    }
  }

  get checkEvaluationPeriod(): boolean {
    return this.contractType !== 'T' && this.contractType !== 'R' && this.contractType !== 'F' && this.contractType !== 'G';
  }

  // mapping function for standard validation message
  getStandardFormName(name: string) {
    switch (name) {
      // case 'ProjectDuration':
      //   if (this.cs.userLanguage == 'en') {
      //     return 'Project Duration';
      //   } else {
      //     return 'مدة المشروع';
      //   }
      case 'ContractStartDate':
        if (this.cs.userLanguage == 'en') {
          return 'Contract Start Date';
        } else {
          return "تاريخ بدء العقد";
        }
      case 'ContractStartText':
        if (this.cs.userLanguage == 'en') {
          return 'Contract Start Text';
        } else {
          return "نص بداية العقد";
        }
      case 'CopyofContract':
        if (this.cs.userLanguage == 'en') {
          return 'Copy Of Contract';
        } else {
          return 'نسخة من العقد';
        }
      case 'RegType':
        if (this.cs.userLanguage == 'en') {
          return 'Registration Type';
        } else {
          return 'نوع التسجيل';
        }
      case 'PrintAwardLetter':
        if (this.cs.userLanguage == 'en') {
          return 'Award Letter(Printable)';
        } else {
          return 'خطاب الترسية ( يظهر في العقد )';
        }
      case 'PrintAwardDate':
        if (this.cs.userLanguage == 'en') {
          return 'Award Date (Printable)';
        } else {
          return 'تاريخ الترسية ( يظهر في العقد ) ';
        }
      case 'RegNumber':
        if (this.cs.userLanguage == 'en' && this.ContractForm.get('RegType')?.value == 'C') {
          return 'Commercial Registration Number';
        } else if (this.cs.userLanguage == 'ar' && this.ContractForm.get('RegType')?.value == 'C') {
          return "رقم السجل التجاري";
        } else if (this.cs.userLanguage == 'en' && this.ContractForm.get('RegType')?.value == 'T') {
          return "Trade License Number";
        } else {
          return "رقم الرخصة التجارية";
        }
      case 'ProcessDescription':
        if (this.cs.userLanguage == 'en') {
          return 'Brief Description of the process';
        } else {
          return 'وصف موجز للعملية';
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
      case 'BgDateCalender':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Date of Issue';
        } else {
          return 'تاريخ إصدار الضمان البنكي';
        }
      case 'BgValidDateCal':
        if (this.cs.userLanguage == 'en') {
          return 'Valid Till';
        } else {
          return 'صالح لغاية';
        }
      case 'BgDateHijri':
        if (this.cs.userLanguage == 'en') {
          return 'Bank guarantee date(Hijri)';
        } else {
          return 'تاريخ الضمان البنكي (هجري)';
        }
      case 'GuranteeIssuedBy':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Issued By';
        } else {
          return 'ضمان بنكي صادر عن';
        }
      case 'GuranteeAmount':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Amount';
        } else {
          return 'مبلغ الضمان البنكي';
        }
      case 'GuranteeCurrency':
        if (this.cs.userLanguage == 'en') {
          return 'Bank Guarantee Currency';
        } else {
          return 'عملة الضمان المصرفي';
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
          return 'إذن التوقيع';
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
          return "العنوان الدائم للمتعاقد";
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
      case 'otherEntity':
        if (this.cs.userLanguage == 'en') {
          return 'Other Entity';
        } else {
          return "كيان آخر";
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
          return 'نسبة السلفة القصوى';
        }
      case 'EvaluationPeriod':
        if (this.cs.userLanguage == 'en') {
          return 'Evaluation Period';
        } else {
          return "فترة التقييم";
        }

      case 'FinePercent':
        if (this.cs.userLanguage == 'en') {
          return 'Penalty Percentage';
        } else {
          return "نسبة العقوبة";
        }

      // case 'WeeklyPnltyPerctg':
      //   return this.cs.userLanguage === 'en' ? 'Weekly Penalty Percentage' : 'غرامة التأخير الاسبوعية'

      // case 'MaximumPnltyPerctg':
      //   return this.cs.userLanguage === 'en' ? 'Maximum Penalty Percentage' : 'الحد الأقصي لغرامة التأخير'

      case 'FineFirst':
        if (this.cs.userLanguage == 'en') {
          return 'First section of penalty';
        } else {
          return 'القسم الأول من العقوبة';
        }
      case 'FineSecond':
        if (this.cs.userLanguage == 'en') {
          return 'Second section of penalty';
        } else {
          return 'القسم الثاني من العقوبة';
        }
      case 'FineThird':
        if (this.cs.userLanguage == 'en') {
          return 'Third section of penalty';
        } else {
          return 'القسم الثالث من العقوبة';
        }
      case 'FineFourth':
        if (this.cs.userLanguage == 'en') {
          return 'Fourth section of penalty';
        } else {
          return "القسم الرابع من العقوبة";
        }
      case 'FineText':
        if (this.cs.userLanguage == 'en') {
          return 'Penalty Text'
        } else {
          return 'نص الجزاء'
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
      case 'WorkScope':
        if (this.cs.userLanguage == 'en') {
          return 'Scope of work'
        } else {
          return "نطاق العمل"
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
      case 'SpecsWorkGroup':
        if (this.cs.userLanguage == 'en') {
          return 'Working Group'
        } else {
          return "Working group"
        }
      case 'SpecsImplServ':
        if (this.cs.userLanguage == 'en') {
          return 'Method of Implementationof Services'
        } else {
          return "Method of Implementationof Services"
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

      case 'Attachment':
        if (this.cs.userLanguage == 'en') {
          return 'Attachments'
        } else {
          return "المرفقات"
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
          return "المتابعة والإشراف"
        }
      case 'TermsInsp':
        if (this.cs.userLanguage == 'en') {
          return 'Inspection'
        } else {
          return "فحص"
        }
      case 'TermsChart':
        if (this.cs.userLanguage == 'en') {
          return 'Save Charts'
        } else {
          return "حفظ المخططات"
        }
      case 'TermsTrain':
        if (this.cs.userLanguage == 'en') {
          return 'Saudi Training'
        } else {
          return "تدريب وتوظيف السعوديين"
        }
      case 'TermsReport':
        if (this.cs.userLanguage == 'en') {
          return 'Work Progress Report'
        } else {
          return "تقرير تقدم العمل"
        }
      case 'EvaluationDate':
        if (this.cs.userLanguage == 'en') {
          return 'Evaluation date'
        } else {
          return "تاريخ التقييم"
        }
      case 'saveEvaluationDate':
        if (this.cs.userLanguage == 'en') {
          return 'Save the Evaluation date'
        } else {
          return "احفظ تاريخ التقييم"
        }
      // case 'ContentReq':
      //   if (this.cs.userLanguage == 'en') {
      //     return 'Local Content Requirement'
      //   } else {
      //     return "متطلبات المحتوى المحلي"
      //   }
      // case 'DetailedTerm':
      //   if (this.cs.userLanguage == 'en') {
      //     return 'Detailed Terms'
      //   } else {
      //     return "الشروط التفصيلية"
      //   }
      case 'PaySchedule':
        if (this.cs.userLanguage == 'en') {
          return 'Payment notes'
        } else {
          return 'ملاحظات الدفع'
        }
      // case 'Accessories':
      //   if (this.cs.userLanguage == 'en') {
      //     return 'Appendix'
      //   } else {
      //     return "الملحق"
      //   }
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
          return "القوى العاملة"
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

  formatCurrency = (value: number): string => this.cs.numberWithCommas(value);
  parserToNumber = (value: string): string => this.cs.removeCommas(value);

}
