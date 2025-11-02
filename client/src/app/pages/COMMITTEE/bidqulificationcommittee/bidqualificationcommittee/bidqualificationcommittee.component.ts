import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { CommonService } from './../../../../service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Location, formatDate } from '@angular/common';
import * as _l from 'lodash';
import { parseInt } from 'lodash';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';
import { COMMITTEE_ROLE, UserActionCode } from 'src/app/shared/shared';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { actionButtonDetails, BqcActionMap } from '../../committee.model';

@Component({
  selector: 'app-bidqualificationcommittee',
  templateUrl: './bidqualificationcommittee.component.html',
  styleUrls: ['./bidqualificationcommittee.component.scss'],
})
export class BidqualificationcommitteeComponent implements OnInit {
  bidqualificationCommitteeForm: FormGroup;
  confirmModal?: NzModalRef;
  name = 'Vendor';
  IsChairman: boolean = false;
  Isofficer: boolean = false;
  IsTechnicalMember: boolean = false;
  IsFinancialMember: boolean = false;
  IsMember:boolean = false
  IsFinalToChairman: boolean = false;
  showComments: boolean = false;
  isCommentsLoading: boolean = false;
  tech_total_value:number=0
  tech_qual_total_value:number=0
  fin_total_value:number=0
  final_fin_total_value :number=0
  cashRatio_range = "";
  cashRatio_weight = "";
  cashRatio_actual = "";
  quickRatio_range = "";
  quickRatio_weight = "";
  quickRatio_actual = "";
  financialEval_total = "";
  final_financialEval = "";
  qulification_percentage = "";
  financial_percentage = "";
  openMdl = false;
  selectedSecretary: any;
  fin_percentage = "";
  qual_percentage = "";
  return_officer = {
    "id": "",
    "name": ""
  };

  selectedVendor: any;
  showAddComments: boolean = false;

  otpApprovalType: any;

  expandIconPosition: 'left' | 'right' = 'right';

  LogdInUsrID: any;
  showCommentsT: boolean = false;
  showAddCommentsT: boolean = false;
  Tcmt: any;

  otp: any
  getOTPModel: boolean = false;

  textAreaMaxLength = 100;
  actionButtons!: actionButtonDetails[]


  @Output()
  paramsForDocHandle = new EventEmitter();

  // FormGroups
  otherDocsFormGroup!: FormGroup;


  showChecklists: boolean = false;

  seletedVenCom = ''

  to_VndrChkLst: any[] = []

  //QualificationEvaluationcriteriaData: TechnicalEvaluation[] =[]
  QualEvaluationcriteriaData: QualTecCr[]=[]
  //QualificationStmtData: FinancialStatement[] | undefined;
  //FinancialEvaluationcriteriaData: FinanicalEvaluationCriteria[] | undefined;
  committeeRole: any;
  status: any;
  bidEvalutaionObj: any;
  private _committeeMemberDetails: MemberDetails[] = [];
  private committeeMemberDetailsBackup : MemberDetails[] = [];

  public get committeeMemberDetails () : MemberDetails[] {
    return this._committeeMemberDetails;
  }
  public set committeeMemberDetails(v : MemberDetails[]) {
    this._committeeMemberDetails = v;
    this.committeeMemberDetailsBackup = JSON.parse(JSON.stringify(v));
  }
  
  id: any;
  formData: any;
  committeeHeadDetails: any;
  vendorDetails: any;
  OptionSelected: any;
  Officer: any;
  committeeId: any;
  commentsArray: any;
  PmCommitteeMemberDetails: any;
  FmCommitteeMemberDetails: any;
  QualificationEvaluationcriteriaDataDisplay: any;
  QualificationEvaluationcriteriaFmDataDispaly: any;
  QualFinancialStatementData: any;
  VendorPassed = "Yes";
  isBidList: boolean = false;
  to_RqstMbrs: any = [];
  selectedMember: any;
  newMemberList: any;
  disableFinancial: boolean = false;

  fileList: NzUploadFile[] = [];
  fileNetList: any[] = [];
  uploadedfiles: any[] = [];
  prevuploadedfiles: any[] = [];
  attList?: FormArray;
  itnatt: any;
  uploading = false;
  otherCommitteeAttachments: any[] = [];

  IsAttachmentModel: any = false;
  selectedBovalue: any;

  private readonly destroy$ = new Subject<void>();

  dateFormat = 'dd/MM/yyyy';
  competitionTypes: any[] = [];
  passingRates:any[]=[]

  scoreInvalid:boolean=true
  weightageInvalid:boolean=true

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private modal: NzModalService,
    private router: Router,
    private api: ApiService,
    public cs: CommonService,
    private formDataSrv: PassFormDataService,
    private location: Location,
    public commonService: CommonService,
  ) {
    let cr = localStorage.getItem("ROLEQP")
    this.bidqualificationCommitteeForm = this.fb.group({
      TenderName: new FormControl({ value: '', disabled: true }),
      CommitteeHead: new FormControl({ value: '', disabled: true }),
      committeeMembers: new FormControl({}, [Validators.required]),
      openingDate: new FormControl({ value: '', disabled: true }),
      FinanceOfferOpeningDate: new FormControl({ value: '', disabled: true }),
      ReferenceNumber: new FormControl({ value: '', disabled: true }),
      typeOfPurchase: new FormControl({ value: '', disabled: true }),
      typeOfTendering: new FormControl({ value: '', disabled: true }),
      Etimadnumber: new FormControl({ value: '', disabled: true }),
      CmtFrmNumber: new FormControl({value: '', disabled: true}),
      CmtFrmDate: new FormControl({value: '', disabled: true}),
      QualificationPercentage: new FormControl('', [Validators.required]),
      FiniancicalPercentage: new FormControl('', [Validators.required]),
      // Comments: new FormControl('', [Validators.required]),
      // QualificationMOM: new FormControl('', [Validators.required]),
      Vendorpassed: new FormControl('', [Validators.required]),

      NoOfQualificationInvitation: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required,Validators.maxLength(40)]),
      InvitationPublishDate: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required]),
      QualDocReceivingDate: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required]),
      QualDocInspectionDate: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required]),
      NoOfVndrsInvolvedInQual: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required]),
      PassingRate: new FormControl({value: '', disabled: cr=='OF'?false:true},[Validators.required]),

      QualificationEvaluationcriteria: new FormControl('', [
        Validators.required,
      ]),
      QualificationfinancialEvaluationcriteria: new FormControl('', [
        Validators.required,
      ]),
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
    });

    this.attList = this.bidqualificationCommitteeForm.get(
      'Attachments'
    ) as FormArray;
  }

  public readonly panels : IPanels[] = [
    {name: `tenderDetails`, active: true},
    {name: `CommitteeMembers`, active: false},
    {name: `Vendors`, active: false},
    {name: `qec`, active: false},
    {name: `qfes`, active: false},
    {name: `qfec`, active: false},
    {name: `qecv`, active: false},
    {name: `qfecv`, active: false},
    {name: `Attachments`, active: false},
    {name: `VendorPassed`, active: true},
  ];

  public readonly COMMITTEE_ROLE = COMMITTEE_ROLE;

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  ngOnInit(): void {
    this.committeeRole = localStorage.getItem("ROLEQP");
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID');
    this.formData = this.formDataSrv.getData();
    this.OptionSelected = this.formDataSrv.getStatus();
    if (this.OptionSelected === "BidToEval") {
      this.status = "IN";
    }
    if (this.OptionSelected === "QualCom") {
      this.status = "FN";
    }
    if (!this.formData) { 
      this.location.back();
    }

    this.id = this.formData?.TndrID;
    this.committeeId = "03";
    if (this.committeeRole === "CH" && this.status === "IN") {
      this.IsChairman = true;
    }
    if (this.committeeRole === "OF") {
      this.Officershow();
    }
    if (this.committeeRole === "PM") {
      //this.membershow();
    }
    if (this.committeeRole === "MR") {
      this.membershow();
    }
    if (this.committeeRole === "FM") {
      this.Financialmembershow();
    }
    if (this.committeeRole === "CH" && this.status === "FN") {
      this.finalTochairman();
    }
    if (this.OptionSelected !== "BidList") {
      this.getTenderDetails();
    } else {
      this.isBidList = true;
      this.getTenderDetails();
      // this.getTenderDetailsDisplay();
    }


    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: LangChangeEvent) => {
      this.bidqualificationCommitteeForm.controls['typeOfPurchase']?.setValue(this.cs.returnPurchaseType(this.bidEvalutaionObj.PurTypID));
      this.bidqualificationCommitteeForm.controls['typeOfPurchase'].updateValueAndValidity();

      this.bidqualificationCommitteeForm.controls['typeOfTendering']?.setValue(this.cs.returnTypeOfEnvlope(this.bidEvalutaionObj.TndrTypeID));
      this.bidqualificationCommitteeForm.controls['typeOfTendering'].updateValueAndValidity();
    });
    this.getPassingRate()
    this.getCompetitionTypes();
  }

  disableCmtMembrs(){
    if(this.committeeRole=="CH"){
      if(this.status=='FN'){
        return true
      }
      else{
        return false
      }
    }
    else if(this.committeeRole=="OF"){
      return false
    }
    else{
      return true
    }
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

  disableEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  getPassingRate(){
    this.api
      .post('PASSING_RATE', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.d.results.length > 0) {
          this.passingRates = res.d.results;
        }
      });
  }

  getQualChklst(){
      this.api.post('QUAL_CHKLST', {}).pipe(takeUntil(this.destroy$))
      .subscribe((res) => {

        if(!this.bidEvalutaionObj.to_QualTecCr.results.length){
          let result = res.d.results.map((val:EvaluationData)=>{
            let data = {
              TenderId:this.id,
              VendorId:this.vendorDetails[0].VendorId,
              ChecklistId:val.ChecklistId,
              TechnicalCap:'',
              Weightage:0,
              Actual:0,
              ChecklistNameEn:val.ChecklistNameEn,
              ChecklistNameAr:val.ChecklistNameAr
            }
            return data
          })

          result.sort((a:any, b:any) => {
            return a.ChecklistId.localeCompare(b.ChecklistId, 'en', { numeric: true });
          });

          this.QualEvaluationcriteriaData=result
          this.bidEvalutaionObj.to_QualTecCr.results=result 
        }
        else{ 
          let totalFncl= Number(this.vendorDetails[0].VndrFnclActualTotal)
          this.fin_total_value = (totalFncl * 100)/this.bidEvalutaionObj.QualFnWgtgCnst

          this.QualEvaluationcriteriaData=this.bidEvalutaionObj.to_QualTecCr.results
          .map((val:any)=>{
            val.Actual=Number(parseFloat(val.Actual).toFixed(2));
            val.Weightage=Number(parseFloat(val.Weightage).toFixed(2));
            return val
          })
          this.calculateTechEvaluationData(null)
        }
      });
  }

  
  weightage_sum:number= 0
  weightage_one:number= 0
  weightage_two:number= 0
  weightage_three:number= 0 

  getSum(index:number){
    if(index==0 ||index==4||index==7){
      return this.weightage_sum
    }
    else if(index==1){
      return this.weightage_one
    }
    else if(index==5){
      return this.weightage_two
    }
    else if(index==8){
      return this.weightage_three
    }
    else{
      return 0
    }
  }

  openingDataBasedonTenderType(): boolean {
    return this.bidEvalutaionObj.TndrTypeID === '01';
  }

  calculateTechEvaluationData(inputType:number|null){
    let data:QualTecCr[] = this.QualEvaluationcriteriaData

    data?.map(val=>{
      if(!val.Actual){val.Actual=0}else{val.Actual=Number(val.Actual)}
      if(!val.Weightage){val.Weightage=0}else{val.Weightage=Number(val.Weightage)}
    })

    if (data){
      let sum_one = data[1].Actual+data[2].Actual+data[3].Actual
      let sum_two = data[5].Actual+data[6].Actual
      let sum_three = data[8].Actual+data[9].Actual

      data[0].Actual = this.per(sum_one, data[0].Weightage)
      data[4].Actual = this.per(sum_two, data[4].Weightage)
      data[7].Actual = this.per(sum_three, data[7].Weightage)

      if(data[0].Actual==0 || data[4].Actual==0 || data[7].Actual==0){this.scoreInvalid=true}
      else{this.scoreInvalid=false}

      this.weightage_sum= data[0].Weightage+data[4].Weightage+data[7].Weightage
      this.weightage_one= data[1].Weightage+data[2].Weightage+data[3].Weightage
      this.weightage_two= data[5].Weightage+data[6].Weightage
      this.weightage_three= data[8].Weightage+data[9].Weightage

      if (this.weightage_sum == 100 && this.weightage_one == 100 && this.weightage_two == 100 && this.weightage_three == 100) 
      {this.weightageInvalid = false;} 
      else {this.weightageInvalid = true;} 

    if(inputType!==null){
      if(this.weightage_sum>100 && (inputType==0 || inputType==4 || inputType==7)){
        this.cs.createMessage("error", `Sum of criterias should be 100, Sum of weightage entered is ${this.weightage_sum}`)
      }
      if(this.weightage_one>100 && (inputType==1 || inputType==2 || inputType==3)){
        this.cs.createMessage("error", `Sum of sub-criterias should be 100, Sum of weightage entered is ${this.weightage_one}`)
      }
      if(this.weightage_two>100 && (inputType==5 || inputType==6)){
        this.cs.createMessage("error", `Sum of sub-criterias should be 100, Sum of weightage entered is ${this.weightage_two}`)
      }
      if(this.weightage_three>100 && (inputType==8 || inputType==9)){
        this.cs.createMessage("error", `Sum of sub-criterias should be 100, Sum of weightage entered is ${this.weightage_three}`)
      }
    }

      this.tech_total_value = +(data[0].Actual + data[4].Actual + data[7].Actual).toFixed(2);
      this.tech_qual_total_value = +this.per(this.tech_total_value, this.bidEvalutaionObj.QualTnWgtgCnst).toFixed(2);
    }

    this.final_fin_total_value = this.per(this.fin_total_value, this.bidEvalutaionObj.QualFnWgtgCnst)

    this.QualEvaluationcriteriaData=data
    this.bidEvalutaionObj.to_QualTecCr.results=this.QualEvaluationcriteriaData
  }

  per(value:number, percentage:number){
    return value*percentage/100;
  }

  getTenderDetails() {
    this.spinner.show();
    const TenderId = {
      "TenderId": this.id
    };
    const RfpNo = {
      "RfpNo": this.formData.RFPNumber
    }

    const QCOM_TENDER_DETAILS = this.api.post("QCOM_TENDER_DETAILS", TenderId);
    const F4_QUALCRIT = this.api.post("F4_QUALCRIT", RfpNo);
    const ZC_P2P_CMT_F4_FINSTMNT_CRT = this.api.get('ZC_P2P_CMT_F4_FINSTMNT_CRT');
    const ZC_P2P_CMT_F4_FINEVAL_CRT = this.api.post('F4_FINEVAL_CRIT', RfpNo);


    // * Tendor details get call 
    QCOM_TENDER_DETAILS.pipe(takeUntil(this.destroy$)).subscribe(
      (TenderDetails) => {
        if (TenderDetails) {
          this.spinner.hide();
          const data = TenderDetails.d.results[0];

          this.setActionsinActionButtons(data.to_Button.results)

          this.bidqualificationCommitteeForm.controls['openingDate'].setValue(this.getDate(data.BidOpngDate));
          this.bidqualificationCommitteeForm.controls['FinanceOfferOpeningDate'].setValue(this.getDate(data.FinanceOfferOpeningDate));
          this.bidEvalutaionObj = data;

          if (this.bidEvalutaionObj) {
            this.bidqualificationCommitteeForm.controls['typeOfPurchase']?.setValue(this.cs.returnPurchaseType(this.bidEvalutaionObj.PurTypID));
            this.bidqualificationCommitteeForm.controls['typeOfPurchase'].updateValueAndValidity();

            this.bidqualificationCommitteeForm.controls['typeOfTendering']?.setValue(this.cs.returnTypeOfEnvlope(this.bidEvalutaionObj.TndrTypeID));
            this.bidqualificationCommitteeForm.controls['typeOfTendering'].updateValueAndValidity();

            // * Committtee Formation Number and Date
            this.bidqualificationCommitteeForm.controls['CmtFrmNumber']?.setValue(this.bidEvalutaionObj.CmtFrmtnOrdrNobqc);
            this.bidqualificationCommitteeForm.controls['CmtFrmNumber']?.updateValueAndValidity();
            this.bidqualificationCommitteeForm.controls['CmtFrmDate']?.setValue(this.cs.getDate(this.bidEvalutaionObj.CmtFrmtnOrdrDatebqc));
            this.bidqualificationCommitteeForm.controls['CmtFrmDate']?.updateValueAndValidity();
          }

          // * Vendor details
          // this.vendorDetails = data.to_RqstVndrs.results;
          this.vendorDetails = data.to_RqstVndrs.results.filter((item: any) => item.IsVendorSelected === 'Y');

          if(this.vendorDetails.length){
          if(
              this.bidEvalutaionObj.to_RqstVndrs.results[0].IsVndrfnclQualified == "X" &&
              this.bidEvalutaionObj.to_RqstVndrs.results[0].IsVndrtechQualified == "X" )
            {
              this.VendorPassed="Yes"
            }
            else if(
              this.bidEvalutaionObj.to_RqstVndrs.results[0].IsVndrfnclQualified == "" ||
              this.bidEvalutaionObj.to_RqstVndrs.results[0].IsVndrtechQualified == "" )
            {
              this.VendorPassed='Yes'
            }
            else{
              this.VendorPassed="No"
            }
          }


          // * Ends

          // * Set competetion type value
          if (
            this.bidEvalutaionObj.CompetitionTypeID &&
            this.bidEvalutaionObj.CompetitionTypeID !== '00'
          ) {
            this.bidqualificationCommitteeForm
              .get('CompetitionTypeID')
              ?.setValue(this.bidEvalutaionObj.CompetitionTypeID);
          }

          if (
            this.bidEvalutaionObj.PassingRate &&
            this.bidEvalutaionObj.PassingRate !== '00'
          ) {
            this.bidqualificationCommitteeForm
              .get('PassingRate')
              ?.setValue(this.bidEvalutaionObj.PassingRate);
          }

          // * Set quotation submission date
          if (this.bidEvalutaionObj.SubmissionDate) {
            this.bidqualificationCommitteeForm
              .get('SubmissionDate')?.setValue(
                moment(
                  this.bidEvalutaionObj.SubmissionDate,
                  'YYYYMMDD'
                ).toISOString()
              );
          }

            // * Set Invitation Publish Date
            if (this.bidEvalutaionObj.InvitationPublishDate) {
              this.bidqualificationCommitteeForm
                .get('InvitationPublishDate')?.setValue(
                  moment(
                    this.bidEvalutaionObj.InvitationPublishDate,
                    'YYYYMMDD'
                  ).toISOString()
                );
            }

            // * Set Qualification Document Inspection Date
            if (this.bidEvalutaionObj.QualDocInspectionDate) {
              this.bidqualificationCommitteeForm
                .get('QualDocInspectionDate')?.setValue(
                  moment(
                    this.bidEvalutaionObj.QualDocInspectionDate,
                    'YYYYMMDD'
                  ).toISOString()
                );
            }

           // * Set Qualification Document Receiving Date
            if (this.bidEvalutaionObj.QualDocReceivingDate) {
              this.bidqualificationCommitteeForm
                .get('QualDocReceivingDate')?.setValue(
                  moment(
                    this.bidEvalutaionObj.QualDocReceivingDate,
                    'YYYYMMDD'
                  ).toISOString()
                );
            }

          if (
            this.bidEvalutaionObj.to_LmtdVndrs &&
            this.bidEvalutaionObj.to_LmtdVndrs.results &&
            this.bidEvalutaionObj.to_LmtdVndrs.results.length > 0
          ) {
            const limitedVendorsControl =
              this.bidqualificationCommitteeForm.get(
                'vendorInvitationsSent'
              ) as FormArray;

            this.bidEvalutaionObj.to_LmtdVndrs.results.forEach(
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

          if (this.bidEvalutaionObj.to_Attach) {
            const { committeeFiles, notCommitteeFiles } = this.bidEvalutaionObj.to_Attach.results.reduce(
              (acc: any, node: any) => {
                if ( node.FilenetID && node.FileName) {
                    if (node.CommitteeId === '03') {
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

          // * Get member details
          this.getMemberDetails(data.to_RqstMbrs.results);
          this.getQualChklst()
        }
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      });
  }

  submitFromOfficer() {this.submitCase('SUB')}

  saveAsDraft(){this.submitCase('DFT')}

  assignToSecretary(){this.submitCase('AQM')}

  assign_Back_to_Eval_Cmt(){this.submitCase('ABE')}

  return_to_Secretary(){this.submitCase('RTS')}

  assignToBEC(){this.submitCase('ABC')}

  approve(){this.getOTP('APR') }

  submit(action:any,otpReq:any){
      this.submitCase(action,otpReq)
    
  }

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    this.actionButtons = actionButtonsList;
    //! need to change the logic of the action mapping as in evaluation committee

    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID, OTP_Required } = button;

    const actionMap = {
        // Secretary Actions
        BTEV_OF_SUB: this.submit.bind(this,Button_ID,OTP_Required),
        BTEV_OF_DFT: this.submit.bind(this,Button_ID,OTP_Required),
  
        // Chairman Actions
        BTEV_CH_AQM: this.submit.bind(this,Button_ID,OTP_Required),
        BTEV_CH_ABE: this.submit.bind(this,Button_ID,OTP_Required),
        BTEV_CH_RTS: this.submit.bind(this,Button_ID,OTP_Required),
  
        QAPR_CH_ABC: this.submit.bind(this,Button_ID,OTP_Required),
        QAPR_CH_RTS: this.submit.bind(this,Button_ID,OTP_Required),
        QAPR_CH_ADP:this.submit.bind(this,Button_ID,OTP_Required),
  
        // Opening Members Actions
        QAPR_MR_APR: this.submit.bind(this,Button_ID,OTP_Required),

    };
      // Construct the key to look up in the actionMap
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}` as keyof BqcActionMap;

      // Assign the action if it exists in the actionMap
      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
      }
    });
  }

  /**
   * Checks for Array Empty or Not
   * @param array Array containing Values
   * @returns boolean
   */
  isArrayNotEmpty(array: any): boolean {
    if (array && array.length > 0) {
      return true;
    }
    return false;
  }

  get VendorInvitationsSent() {
    return this.bidqualificationCommitteeForm.get(
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
    const control = this.bidqualificationCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
    control.push(this.vendorInvitationItem());
  }


  getMemberDetails(tenderMemberList: MemberDetails[]) {
    const ReqMem = {
      "Id": "03",
      TndrId: this.bidEvalutaionObj.TndrID
    }
    this.spinner.show();
    this.api.post("F4_MEMBERS", ReqMem).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        const data = res.d.results as MasterMemberDetails[];
        const transformedData = data.map(data => this.toTenderMember(data));
        
        const dataInTenderDetails=tenderMemberList.filter(val=>val.CommitteeId=='03'&&val.CommitteeRole=='MR')
        this.committeeMemberDetails=transformedData.filter(val=>val.CommitteeId=='03'&&val.CommitteeRole=='MR')

        if(dataInTenderDetails.length){
          this.committeeMemberDetails.map(val=>{
            val.IsMemberSelected=""
          })

          dataInTenderDetails.forEach(val=>{
            const index = this.committeeMemberDetails.findIndex(obj => obj.CommitteeUser === val.CommitteeUser);
          
            if (index !== -1) {
              if(val.SelectedMbr=='M'){
                this.committeeMemberDetails[index].IsMemberSelected= 'X';
              }
            }
          })
        }
        
        this.committeeMemberDetails.map(val=>val.IsMemberSelected==='X'?val.SelectedMbr='M':'')

        // * Committee Head Details
        this.committeeHeadDetails = transformedData.filter((item: any) => item.CommitteeRole === "CH");
        this.committeeHeadDetails = this.committeeHeadDetails[0];
        // * Ends

        // * Committee officer Details
        this.Officer = transformedData.filter((item: any) => item.CommitteeRole === "OF");
        this.selectedSecretary = this.Officer[0];
        // * Ends

      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  // * Update the Members already selected
  updateSelectedMember(masterMember: MemberDetails[], tenderMember: MemberDetails[]): MemberDetails[] {
    masterMember.forEach((member, index) => {
      const selectedMember = tenderMember.find((tenderMem) => member.CommitteeUser === tenderMem.CommitteeUser);
      if (selectedMember) {
        masterMember[index].Identifier = selectedMember.Identifier;
        masterMember[index].Inactive = selectedMember.Inactive;
        masterMember[index].SelectedMbr = selectedMember.SelectedMbr;
      }
    });
    return masterMember;
  }

  /**
   * Retruns the selected Member list
   */
  get selectedMemberList(): MemberDetails[] {
    // * Remove the existing members of Qualification committee
    let selectedMembers: MemberDetails[] = this.bidEvalutaionObj.to_RqstMbrs.results.filter((member:MemberDetails)=> member.CommitteeId !== '03');
    if(this.disableFinancial){
      this.committeeMemberDetails = this.committeeMemberDetails.filter((member)=> member.CommitteeId === '03' && member.CommitteeRole !== 'FM');
    }
    if(selectedMembers) {
      selectedMembers.push(...this.committeeMemberDetails.filter((member)=> member.SelectedMbr !== ''));
      return selectedMembers;
    }
    return this.committeeMemberDetails;
  }

  getMemberDetailsDisplay() {
    const ReqMem = {
      "Id": "03",
      TndrId: this.bidEvalutaionObj.TndrID
    }
    this.spinner.show();
    this.api.post("F4_MEMBERS", ReqMem).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        const data = res.d.results;

        // * Committee Head Details
        this.committeeHeadDetails = data.filter((item: any) => item.CommitteeRole === "CH");
        this.committeeHeadDetails = this.committeeHeadDetails[0];
        // * Ends

        // * Committee officer Details
        this.Officer = data.filter((item: any) => item.CommitteeRole === "OF");
        this.selectedSecretary = this.Officer[0];
        // * Ends
      },
      (error) => {
        this.spinner.hide();

        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  calculateSum(value1:string,value2:string) {
    return Number(value1) + Number(value2);
  }

  onmemberChange(event: any, data: any, index: any) {
    if (this.committeeMemberDetails.length && !this.committeeMemberDetails.some(item => item)) {
      this.committeeHeadDetails = JSON.parse(JSON.stringify(this.committeeMemberDetailsBackup));
    }
    if (this.committeeMemberDetails) {
      if (data === 'fixed') {
        this.committeeMemberDetails[index].IsMemberSelected = this.committeeMemberDetails[index].IsMemberSelected ==='X'?'':'X';
        this.committeeMemberDetails[index].SelectedMbr = this.committeeMemberDetails[index].SelectedMbr ==='M'?'':'M';

        this.committeeMemberDetails[index].CommitteeUser ? this.committeeMemberDetails[index].CommitteeUser
          : (this.committeeMemberDetails[index].CommitteeUser =
            this.committeeMemberDetails[index].CommitteeUser);
      
      }
    }
  }

  getDate(date: String) {
    return this.cs.getDa(date);
  }

  toDecimalPlaces(value: any): any {
    if (value) {
      return parseFloat(value).toFixed(2);
    }
    else {
      return ""
    }
  }



  calc_main_total(weightage: any, actual: any): any {
    return (actual * weightage) / 100;
    //  return (parseFloat(actual) * (parseFloat(weightage) / 100));
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

  getComments() {
    this.spinner.show();
    let dt = {
      "TenderId": this.bidEvalutaionObj.TndrID,
      "VendorId": this.selectedVendor,
    }
    this.api.post("/GET_CMTS", dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.commentsArray = res.d.results;
      this.showComments = !this.showComments;
      this.spinner.hide()
    }, () => {
      this.spinner.hide();
    })
  }

  showConfirm(otpRequired?: string, actionCode?: any): void {
    const config = {
      // titleText: this.translate.instant(`submitConfirmation`),
      // bodyText: this.translate.instant(`COM.Do you want to Submit?`)

      titleText: this.cs.getConfimationModalTitle(actionCode ?? null),
      bodyText: this.cs.getConfimationMessage(actionCode ?? null),
    };

    const modalRef = this.modal.create({
      nzContent: ConfirmComponent,
      nzComponentParams: { config },
      nzWidth: 600,
      nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
      nzFooter: null
    });

    modalRef.afterClose
      .subscribe(result => {
        if (result) {
          if(otpRequired === 'X'){
            this.getOTP(actionCode)
          }else{
            this.postTendor();
          }
        }
      });
  }

  OpenRoleModal() {
    if (this.openMdl) {
      this.openMdl = false;
    }
    else {
      this.openMdl = true;
    }
  }

  currentActionCode:'SUB' | 'DFT' | 'AQM' | 'ABE' | 'RTS' | 'ABC' |'APR' | null =null

  getOTP(ActionCode:any) {
    const data = {
      UserId: this.cs.getUserData().userid
    }
    this.spinner.show();
    this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.spinner.hide();
      if (res.d.results[0].MessageId === "S") {
        this.otp = res.d.results[0].OtpNo
        this.currentActionCode=ActionCode
        this.cs.otpToast(res.d.results[0]);
        this.getOTPModel = !this.getOTPModel;
        this.spinner.hide()
      }

      else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.spinner.hide()
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      }
      else {
        this.spinner.hide()
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
      }
      else if (value !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }
  // otp approval
  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.spinner.show();
        this.postTendor()
        this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.spinner.hide();
            this.cs.createMessage("success", this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
            this.cs.activeMenu = `bidlist`;
            this.router.navigate(["/committee/BidList"]);
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
      }
      else if (data !== this.otp) {
        this.spinner.hide()
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  /**
   * Chairman's Post call method
   */
  postAssignOfficer(): void {

    this.spinner.show();

    // * Payload data update - Login user details
    const userName = atob(localStorage.getItem("ID")!);
    this.bidEvalutaionObj.LgdInUsr = userName;
    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    this.bidEvalutaionObj.LgdInUsrAction = "ASG";
    this.bidEvalutaionObj.to_RqstMbrs.results = this.selectedMemberList;

    // * Reseting the Vendor comments
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any) => {
      
    });

    // * Updating Attachments
    this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

    this.postTendor();
  }

  /**
   * Officers post call method
   * @param actionCode `SUB` | `DFT`
   * @returns `void`
   */

  submitCase(actionCode: 'SUB' | 'DFT' | 'AQM' | 'ABE' | 'RTS' | 'ABC' |'APR' | 'ADP' | null, otpRequired?: string): void {

    // * Payload data Update - Logged in Userdetails
    const userName = atob(localStorage.getItem("ID")!);
    this.bidEvalutaionObj.LgdInUsr = userName;
    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    this.bidEvalutaionObj.LgdInUsrAction = actionCode
    // this.bidEvalutaionObj.NoOfByres=''
    // this.bidEvalutaionObj.NoOfVndrs=''

    let QualDocInspectionDate=this.bidqualificationCommitteeForm.get('QualDocInspectionDate')?.value
    let QualDocReceivingDate=this.bidqualificationCommitteeForm.get('QualDocReceivingDate')?.value
    let InvitationPublishDate=this.bidqualificationCommitteeForm.get('InvitationPublishDate')?.value

    this.bidEvalutaionObj.PassingRate = this.bidqualificationCommitteeForm.get('PassingRate')?.value
    this.bidEvalutaionObj.NoOfVndrsInvolvedInQual=String(this.bidqualificationCommitteeForm.get('NoOfVndrsInvolvedInQual')?.value)
    this.bidEvalutaionObj.QualDocInspectionDate= QualDocInspectionDate? moment(QualDocInspectionDate).format('YYYYMMDD'):""
    this.bidEvalutaionObj.QualDocReceivingDate=QualDocReceivingDate?moment(QualDocReceivingDate).format('YYYYMMDD'):""
    this.bidEvalutaionObj.InvitationPublishDate=InvitationPublishDate?moment(InvitationPublishDate).format('YYYYMMDD'):""
    this.bidEvalutaionObj.NoOfQualificationInvitation=this.bidqualificationCommitteeForm.get('NoOfQualificationInvitation')?.value

    let selectedIndex = 0;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((item: any, index: any) => {
      
      if (item.IsVendorSelected === 'Y') {
        selectedIndex = index;
      }
    });

      this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

      let cmtMembers = this.committeeMemberDetails.map(member => {
        let clone = { ...member };
        delete clone['IsMemberSelected']
        return clone;
      });

      let selectedCmtMembers=cmtMembers.filter(val=>val.SelectedMbr=='M')

      this.bidEvalutaionObj.to_RqstMbrs.results = cmtMembers;

      // *Checking if three committee members are selected in the table.
      if(actionCode=='SUB'||actionCode=='AQM'||actionCode=='DFT'||actionCode=='ABC'){
        if (selectedCmtMembers.length!==3) {
          this.cs.createMessage('error', 'Three Committee members should be selected');
          return;
        }
      }

      if(actionCode=='SUB' || 'DFT'){
          this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
            if (element.IsVendorSelected == "Y") {
              this.bidEvalutaionObj.to_RqstVndrs.results[index].VndrFnclActualTotal = String(this.final_fin_total_value)
              this.bidEvalutaionObj.to_RqstVndrs.results[index].VndrTnclActualTotal = String(this.tech_qual_total_value)
            }
          });
      }

      if(actionCode=='SUB'){
        
          this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
            if (this.VendorPassed === "Yes") {
              if (element.IsVendorSelected == "Y") {
                this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrfnclQualified = "X";
                this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrtechQualified = "X";
              }
              else {
                this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrfnclQualified = "N";
                this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrtechQualified = "N";
              }
            }
            else{
              this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrfnclQualified = "N";
              this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrtechQualified = "N";
            }

          });
        
      }

      this.bidEvalutaionObj.to_QualTecCr.results=this.bidEvalutaionObj.to_QualTecCr.results.map((val:any)=>{
        val.Actual=String(val.Actual)
        val.Weightage=String(val.Weightage)

        return val
      })

      if(actionCode=='SUB'){

      const controls = this.bidqualificationCommitteeForm.controls;

      if(controls['PassingRate'].invalid||controls['NoOfVndrsInvolvedInQual'].invalid||controls['QualDocInspectionDate'].invalid
        ||controls['QualDocReceivingDate'].invalid||controls['InvitationPublishDate'].invalid||controls['NoOfQualificationInvitation'].invalid
      ){
        this.cs.createMessage('error', 'All fields are required to be filled');
        return
      }
  
      if(this.scoreInvalid){
        this.cs.createMessage('error', 'None of the score should be empty');
        return
      }
      if(!this.fin_total_value){
        this.cs.createMessage('error', 'Financial capabiliy is required');
        return
      }
  
      if(this.weightageInvalid){
        this.cs.createMessage('error', 'Weightages should sum to 100');
        return
      }
    }
        this.showConfirm(otpRequired,actionCode)
  }

  /**
   * Make a API call to post Tendor details
   */
  postTendor(): void {
    this.spinner.show();
    this.currentActionCode=null
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.location.back();
        this.cs.createMessage("success", this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );
    this.spinner.hide();
  }

  //retund to bid evaluted
  returnToBidEvaluvated() {
    this.returnTenderPost();
  }


  showConfirmReturn(): void {
    const modalRef = this.modal.create({
      nzContent: ConfirmComponent,
      nzComponentParams: { config: { titleText: this.translate.instant('COM.returnConfirmation'), bodyText: `COM.Do you want to Return?` } },
      nzWidth: 600,
      nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
      nzFooter: null
    });

    modalRef.afterClose
      .subscribe(result => {
        if (result) {
          this.returnTenderPost();
        }
      });
  }

  // * Qualification evaluation PM post call
  postQualificationCritriea() {

    const userName = atob(localStorage.getItem("ID")!);

    this.bidEvalutaionObj.LgdInUsr = userName;
    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    this.bidEvalutaionObj.LgdInUsrAction = "SUB";

    // const Comments = this.bidqualificationCommitteeForm.controls["Comments"].value.trim();
    const formatCurrentDate = formatDate(Date.now(), 'yyyyMMddhhmmss', 'en-US');

    // * Getting index of selected vendor
    let selectedIndex = 0;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((item: any, index: any) => {
      if (item.IsVendorSelected === 'Y') {
        selectedIndex = index;
      }
    });
    // if (Comments !== "") {
    //   const comments: Comments = {
    //     CommitteeId: "03",
    //     TenderId: this.vendorDetails[0]?.TenderId,
    //     VendorId: this.vendorDetails[0]?.VendorId,
    //     CmntdMember: userName,
    //     CmntdDate: formatCurrentDate,
    //     Comments: Comments
    //   }

    // }

    this.bidEvalutaionObj.to_Attach =
      this.combineOtherAttachmentsWithUpdated();

    //this.getOTP();
  }


  // * Financial evalution FM post call
  postFinancialCritriea() {
    // if (!this.checkAllValidForFinanceMember) {
    //   this.cs.createMessage('error', this.translate.instant("COM.EnterMandatory"));
    //   return;
    // };
    this.spinner.show();

    const userName = atob(localStorage.getItem("ID")!);
    this.bidEvalutaionObj.LgdInUsr = userName;
    // this.bidEvalutaionObj.LgdInUsr = "PMS2";

    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    // this.bidEvalutaionObj.LgdInUsrCmtRole = "FM";
    this.bidEvalutaionObj.LgdInUsrAction = "SUB";

    // * Getting index of selected vendor

    let selectedIndex = 0;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((item: any, index: any) => {
      
      if (item.IsVendorSelected === 'Y') {
        selectedIndex = index;
      }
    });


    // const FmComments = this.bidqualificationCommitteeForm.controls["Comments"].value;
    const formatCurrentDate = formatDate(Date.now(), 'yyyyMMddhhmmss', 'en-US');

    // if (FmComments.trim() !== "") {
    //   // * FM comments
    //   const comments = {
    //     "CommitteeId": "03",
    //     "TenderId": this.bidEvalutaionObj.TndrID,
    //     "VendorId": this.vendorDetails[0]?.VendorId,
    //     "CmntdMember": userName,
    //     "CmntdDate": formatCurrentDate,
    //     "Comments": FmComments
    //   }
    
    // }

    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any) => {
      
    });

    this.bidEvalutaionObj.to_Attach =
      this.combineOtherAttachmentsWithUpdated();

    //this.getOTP();
  }

  returnTenderPost(): void {

    const userName = atob(localStorage.getItem("ID")!);

    this.bidEvalutaionObj.LgdInUsr = userName;
    this.bidEvalutaionObj.LgdInUsrAction = "RET";
    
    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;

    // const Comments = this.bidqualificationCommitteeForm.controls["Comments"].value.trim();
    const formatCurrentDate = formatDate(Date.now(), 'yyyyMMddhhmmss', 'en-US');

    // * Getting index of selected vendor
    let selectedIndex = 0;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((item: any, index: any) => {
      if (item.IsVendorSelected === 'Y') {
        selectedIndex = index;
      }
    });

    this.bidEvalutaionObj.to_Attach =
      this.combineOtherAttachmentsWithUpdated();

      

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.location.back();
        this.cs.createMessage("success", this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  // getQualCrit() {
  //   this.spinner.show();
  //   const rfcNo = {
  //     "RfpNo": this.formData.RFPNumber
  //   }
  //   this.api.post("F4_QUALCRIT", rfcNo).pipe(takeUntil(this.destroy$)).subscribe(
  //     (res) => {
  //       this.QualificationEvaluationcriteriaData = res.d.results[0].to_RFPQualCrt.results;
  //       this.spinner.hide();
  //     },
  //     (error) => {
  //       this.spinner.hide();

  //       this.cs.createMessage('error', error.statusText);
  //     }
  //   );

  // }

  /**
   * Removes the comments from Payload to avoid duplication in comments
   */
  

  Officershow(): void {
    this.Isofficer = true;
    this.IsChairman = false;
  }

  membershow(): void {
    this.IsChairman = false;
    this.IsMember = true;
  }

  Financialmembershow(): void {
    this.IsChairman = false;
    this.IsFinancialMember = true;
    this.IsTechnicalMember = false;
  }

  Committeemembershow():void {
    
  }

  finalTochairman(): void {
    this.IsFinalToChairman = true;
    this.IsChairman = false;
    this.IsFinancialMember = false;
    this.IsTechnicalMember = false;
    this.Isofficer = false;
  }

  downloadMOM(name: string) {
    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    this.bidEvalutaionObj.LgdInUsrAction = "DFT";
    // this.bidEvalutaionObj.to_RqstVndrs.results[0].MOMDts = this.bidqualificationCommitteeForm.controls["QualificationMOM"].value;

    

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        const payload = {
          "CommitteeID": '03',
          "TndrID": this.id,
          "LoggedInID": atob(localStorage.getItem("ID")!),
          "Role": "03",
          "LoggedCmt": "03",
        }
        if (payload) {
          const fileName = this.bidEvalutaionObj.TndrName + '_' + name + '_';
          this.cs.downloadMOM(payload, fileName);
        }
      },
      (error) => {
        this.spinner.hide();

        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');

  selectedVendorGUID = '';
  showChecklistsModal(_data: any) {
    this.to_VndrChkLst = _data.to_VndrChkLst.results;
    this.selectedVendorGUID = _data.VendorGUID;
    this.seletedVenCom = _data.VendorCommercialNo;
    if (!this.showChecklists) {
      this.showChecklists = true;
    }
  }

  hideChecklists() {
    if (this.showChecklists) this.showChecklists = false;
  }

  // get checkAllValidForOfficer(): boolean {
  //   let isValid = true;
  //   if (this.QualificationEvaluationcriteriaData) {
  //     this.QualificationEvaluationcriteriaData.forEach((value, i) => {
  //       if ((value.TnclPltfmValue === "" || value.TnclScore === "") && i != 0 && i != 4 && i != 7) {
  //         isValid = false;
  //       } else {
  //         if (this.QualificationEvaluationcriteriaData) {
  //           this.QualificationEvaluationcriteriaData[i].TnclScore = value.TnclScore.toString();
  //         }
  //       }
  //     });
  //   };
  //   if (this.QualificationStmtData) {
  //     this.QualificationStmtData.forEach((value) => {
  //       if (value.FnclPltfmValue === '') {
  //         isValid = false;
  //       }
  //     });
  //   }
  //   if (this.FinancialEvaluationcriteriaData) {
  //     this.FinancialEvaluationcriteriaData.forEach((value, i) => {
  //       if (value.FnclPltfmValue === '' || value.FnclScore === '') {
  //         isValid = false;
  //       } else {
  //         if (this.FinancialEvaluationcriteriaData) {
  //           this.FinancialEvaluationcriteriaData[i].FnclScore = value.FnclScore.toString();
  //         }
  //       }
  //     });
  //   }
  //   return isValid;
  // }

  // get checkAllValidForFinanceMember(): boolean {
  //   let isValid = true;
  //   if (this.QualificationStmtData) {
  //     this.QualificationStmtData.forEach((value) => {
  //       if (value.FnclStmtsValue === '') {
  //         isValid = false;
  //       }
  //     });
  //   }
  //   if (this.FinancialEvaluationcriteriaData) {
  //     this.FinancialEvaluationcriteriaData.forEach((value, i) => {
  //       if (value.FnclListValue === '') {
  //         isValid = false;
  //       }
  //     });
  //   }
  //   return isValid;
  // }

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
      firstLevelId: this.bidEvalutaionObj.TndrID,
      secondLevelName: 'P2PCommitteVendor',
      secondLevelId: this.seletedVenCom,
      thirdLevelId: index.ChecklistId,
      operation: "C"
    }
  }

  ParseFloat(str: any, val: any) {
    str = str.toString();
    str = str.slice(0, (str.indexOf(".")) + val + 1);
    return Number(str);
  }

  finalChairmanSave() {
    // Todo: Post call to save chairman final
    const userName = atob(localStorage.getItem("ID")!);
    this.bidEvalutaionObj.LgdInUsr = userName;

    this.bidEvalutaionObj.LgdInUsrCmt = "03";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.committeeRole;
    this.bidEvalutaionObj.LgdInUsrAction = "SUB";
    
    // let chairmanComments = this.bidqualificationCommitteeForm.controls["Comments"].value;
    let currentDate = Date.now();
    let formatCurrentDate = formatDate(currentDate, 'yyyyMMddhhmmss', 'en-US');
    // * Getting index of selected vendor
    let selectedIndex = 0;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((item: any, index: any) => {
      if (item.IsVendorSelected === 'Y') {
        selectedIndex = index;
      }
    });
    // if (chairmanComments.trim() !== "") {
    //   // * Final Chairman comments
    //   var comments = {
    //     "CommitteeId": "03",
    //     "TenderId": this.vendorDetails[0]?.TenderId,
    //     "VendorId": this.vendorDetails[0]?.VendorId,
    //     "CmntdMember": userName,
    //     "CmntdDate": formatCurrentDate,
    //     "Comments": chairmanComments
    //   }
    
    // }
    // let chairmanMom = this.bidqualificationCommitteeForm.controls["QualificationMOM"].value;
    // if (chairmanMom.trim() !== "") {
      // this.bidEvalutaionObj.to_RqstVndrs.results[0].MOMDts = chairmanMom;
    // } else {
      // this.cs.createMessage('error', this.translate.instant("COM.EnterMandatory"));
      // return;
    // }
    // if (this.VendorPassed === "Yes") {
    //   this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
    //     if (element.IsVendorSelected == "Y") {
    //       this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrfnclQualified = "X";
    //       this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrtechQualified = "X";
    //       // this.bidEvalutaionObj.to_RqstVndrs.results[index].MOMDts = chairmanMom;
    //     }
    //     else {
    //       this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrfnclQualified = "N";
    //       this.bidEvalutaionObj.to_RqstVndrs.results[index].IsVndrtechQualified = "N";
    //     }

    //   });
    //   // Todo: Change payload to true
    // } else {

    // }
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any) => {
      
    });
    this.spinner.show();
    //this.getOTP()

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadFile(value: any) {
    window.open(environment.downloadUrl + value.Attachment);
  }

  deleteFile(value: any) {
    //console.log(value);
  }

  createAttachs(data: any): FormGroup {
    this.itnatt = this.itnatt + 1;
    return this.fb.group({
      CommitteeId: [this.committeeId],
      // CommitteeRole: [this.role],
      CommitteeUser: [this.commonService.getUserData().userid],
      Attachment: [data],
      TenderId: [this.bidEvalutaionObj.TndrID],
      CreatedAt: [null],
    });
  }

  createAttachswithvalues(data: any): FormGroup {
    return this.fb.group({
      CommitteeId: [data.CommitteeId],
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
    this.api.post("uploadfile", formData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
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
        this.uploading = false;
        this.cs.createMessage("error", this.translate.instant('RFP.UploadFailed'));
      }
    );
  }

  combineOtherAttachmentsWithUpdated() {
    let list = [...this.fileNetList];
    list.forEach((node:any) => {
      delete node.hideDeleteButton;
      delete node.downloading;
    });
    const allAttachments = [
      ...this.otherCommitteeAttachments,
      ...this.bidqualificationCommitteeForm.getRawValue().Attachments,
      ...list
    ];

    return allAttachments
  }

  filenetUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: this.committeeId,
      CommitteeRole: this.committeeRole,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalutaionObj.TndrID,
    });

    this.fileNetList = [...this.fileNetList];
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: this.committeeId,
      CommitteeRole: this.committeeRole,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalutaionObj.TndrID,
    });

    this.fileNetList = [...this.fileNetList];
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  commentDate(date: any) {
    
    return date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + ' ' + date.slice(8,10) + ':' + date.slice(10, 12) + ':' + date.slice(12, 14)
  

}

get IS_CEO_DIRECTOR_OR_VP(): boolean {
  return this.committeeRole === COMMITTEE_ROLE.CEO || this.committeeRole === COMMITTEE_ROLE.DIRECTOR || this.committeeRole === COMMITTEE_ROLE.VICE_PRESIDENT;
}


get isTenderDP(): boolean {
  return this.bidEvalutaionObj?.PurTypID === 'D';
}

get isTenderRFP(): boolean {
  return this.bidEvalutaionObj?.PurTypID === `R`;
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

  data:any=null

  showHideAddCommentsV(data:any) {
    this.showAddComments = true;
    this.data=data
  }


  Vcmnt:string=''

  addComments(comment:string,selectedVendor:any){
    let cmtData = {
      CommitteeId: '02',
      CommitteeRole: this.committeeRole,
      TenderId: this.bidEvalutaionObj.TndrID,
      VendorId: this.data.VendorId,
      CmntdMember: this.LogdInUsrID,
      Comments: this.Vcmnt,
    };

    if(!this.Vcmnt){
      this.commonService.createMessage('error', 'Please enter a comment');
      return
    }

    this.showAddComments = !this.showAddComments;

    if (cmtData) {
      this.spinner.show();
      // post comments api called for saved vendor
      this.api
        .post('POST_CMTS', cmtData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res) {
              this.commonService.createMessage('success', 'Vendor comment submitted');
            } else {
              this.commonService.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            this.commonService.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );
    }

  }

  showHideCommentsclose() {
    this.showCommentsT = false;
  }

  showHideAddCommentsclose() {
    this.showAddCommentsT = false;
    this.showAddComments = false;
  }

  showHideAddCommentsT() {
    this.Tcmt = ''
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  addCommentsT(comments: any) {
    if (comments != '') {
      this.spinner.show();
      let cmtData = {
        CommitteeId: "03",
        TenderId: this.bidEvalutaionObj.TndrID,
        CommitteeRole: this.committeeRole,
        VendorId: '0',
        CmntdMember: this.LogdInUsrID,
        Comments: comments,
      };
      if (cmtData) {
        this.spinner.show();
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
            this.commonService.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );
      }
    }
    else {
      //console.log("no comments", comments);
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
      CommitteeId: this.committeeId,
      TenderId: this.bidEvalutaionObj.TndrID,
      VendorId: '0',
    };
    this.api.post('/GET_CMTS', dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.commentsArray = res.d.results;
      // this.showComments = !this.showComments;
      this.spinner.hide();
    });
  }

  // * Return is the Index is Header row or not
  isHeaderRow(index: number): boolean {
    return index == 0 || index == 4 || index == 7;
  }


  // * Object Transform Methods - Starts
  toTechEval(input: TechnicalEvaluationRFPResponse): TechnicalEvaluation {
    return {
      CommitteeId: this.vendorDetails[0]?.CommitteeId,
      TenderId: this.vendorDetails[0]?.TenderId,
      VendorId: this.vendorDetails[0]?.VendorId,
      VendorQualCrtId: input.VendorQualCrtId_RFP,
      Category: input.Category,
      Subcategory: input.Subcategory,
      Range: input.Range,
      VendorTechCrtWgtge: input.VendorQualCrtWgtge_RFP,
      VendorTechCrtActual: '',
      TnclPltfmValue: '',
      TnclScore: '',
      ChangedBy: '',
      ChangedOn: '',
      CreatedAt: '',
      CreatedBy: '',
      CreatedOn: '',
    }
  }

  toFinancialStatment(input: FinancialStatementRFPResponse): FinancialStatement {
    return {
      CommitteeId: this.vendorDetails[0]?.CommitteeId,
      TenderId: this.vendorDetails[0]?.TenderId,
      VendorId: this.vendorDetails[0]?.VendorId,
      FnclPltfmValue: '',
      FnclStmtsValue: '',
      FnclStmntCrtID: input.FnclStmntCrtID,
      FnclStmntCrtDescEN: input.FnclStmntCrtDescEN,
      FnclStmntCrtDescAR: input.FnclStmntCrtDescAR,
      ChangedBy: '',
      ChangedOn: '',
      CreatedAt: '',
      CreatedBy: '',
      CreatedOn: '',
    }
  }

  toFinEval(input: FinancialEvaluationRFPResponse): FinanicalEvaluationCriteria {
    return {
      CommitteeId: this.vendorDetails[0]?.CommitteeId,
      TenderId: this.vendorDetails[0]?.TenderId,
      VendorId: this.vendorDetails[0]?.VendorId,
      VendorFnclCrtId: input.RFPFnclCrtId,
      VendorFnclCrtDescEN: input.RFPFnclCrtDescEN,
      VendorFnclCrtDescAR: input.RFPFnclCrtDescAR,
      Category: '',
      Subcategory: '',
      Range: input.Range,
      FnclPltfmValue: '',
      FnclListValue: '',
      FnclScore: '',
      VendorFnclCrtWgtge: input.Percentage,
      VendorFnclCrtActual: '',
      CreatedBy: '',
      CreatedOn: '',
      CreatedAt: '',
      ChangedBy: '',
      ChangedOn: ''
    }
  }

  toTenderMember(input: MasterMemberDetails): MemberDetails {
    return {
      CommitteeBckupUser: input.CommitteeBkpUserID,
      CommitteeBkpUserName: input.CommitteeBkpUserName,
      CommitteeBkpUserName_AR: input.CommitteeBkpUserName_AR,
      CommitteeId: input.CommitteeId,
      CommitteeRole: input.CommitteeRole,
      CommitteeRoleName: input.CommitteeRoleName,
      CommitteeUser: input.CommitteeUserID,
      CommitteeUserName: input.CommitteeUserName,
      CommitteeUserName_AR: input.CommitteeUserName_AR,
      IsMemberSelected: input.IsMemberSelected?input.IsMemberSelected:input.SelectedMbr,
      Identifier: '',
      Inactive: false,
      SelectedMbr: '',
      TenderId: input.TenderId
    }
  }
  // * Object Transform Methods - Ends
  
}

interface MasterMemberDetails {
  CommitteeBkpUserID: string,
  CommitteeBkpUserName: string,
  CommitteeBkpUserName_AR: string,
  CommitteeId: string,
  CommitteeRole: string,
  CommitteeRoleName: string,
  CommitteeUserID: string,
  CommitteeUserName: string,
  CommitteeUserName_AR: string,
  CommitteeYear: string,
  DataSource: string,
  IsMemberSelected?:string,
  SelectedMbr?:string
  SAPCmtRole: string,
  TenderId: string,
  ValidCmtBkpUsr: string,
  ValidCmtUsr: string
}

interface MemberDetails {
  CommitteeBckupUser: string,
  CommitteeBkpUserName: string,
  CommitteeBkpUserName_AR: string,
  CommitteeId: string,
  CommitteeRole: string,
  CommitteeRoleName: string,
  CommitteeUser: string,
  CommitteeUserName: string,
  CommitteeUserName_AR: string,
  IsMemberSelected?:string,
  SelectedMbr?:string
  Identifier: string,
  Inactive: boolean,
  TenderId: string
}

interface TechnicalEvaluationRFPResponse extends ChangeLog {
  Category: string,
  Subcategory: string,
  VendorQualCrtActual_RFP: string,
  VendorQualCrtId_RFP: string,
  VendorQualCrtWgtge_RFP: string,
  Range: string,
  RfpNo: string,
  RfpVersion: string
}

interface EvaluationData {
    ChecklistId: string,
    ChecklistNameEn: string,
    ChecklistNameAr: string
}

interface TechnicalEvaluation extends ChangeLog {
  CommitteeId: string,
  TenderId: string,
  VendorId: string,
  VendorQualCrtId: string,
  Category: string,
  Subcategory: string,
  Range: string,
  VendorTechCrtWgtge: string,
  VendorTechCrtActual: string,
  TnclPltfmValue: string,
  TnclScore: string
}

interface FinancialStatementRFPResponse {
  FnclStmntCrtDescAR: string,
  FnclStmntCrtDescEN: string,
  FnclStmntCrtID: string
}

interface FinancialStatement extends ChangeLog {
  CommitteeId: string,
  TenderId: string,
  VendorId: string,
  FnclPltfmValue: string,
  FnclStmtsValue: string,
  FnclStmntCrtID: string,
  FnclStmntCrtDescEN: string,
  FnclStmntCrtDescAR: string
}

interface QualTecCr   {
  TenderId: string,
  VendorId: string,
  ChecklistId: string,
  ChecklistNameEn:string,
  ChecklistNameAr:string,
  TechnicalCap: string,
  Weightage: number,
  Actual: number,            
  // Criteria:{
  //   ar:string,
  //   en:string
  // }
}

interface FinancialEvaluationRFPResponse extends ChangeLog {
  Percentage: string,
  RFPFnclCrtDescAR: string,
  RFPFnclCrtDescEN: string,
  RFPFnclCrtId: string,
  Range: string,
  RfpNo: string,
  RfpVersion: string
}

interface FinanicalEvaluationCriteria extends ChangeLog {
  CommitteeId: string,
  TenderId: string,
  VendorId: string,
  VendorFnclCrtId: string,
  VendorFnclCrtDescEN: string,
  VendorFnclCrtDescAR: string,
  Category: string,
  Subcategory: string,
  Range: string | number,
  FnclPltfmValue: string,
  FnclListValue: string,
  FnclScore: string | number,
  VendorFnclCrtWgtge: string | number,
  VendorFnclCrtActual: string
}
interface IPanels {
  name: string, active: boolean, panels?: any
}



interface ChangeLog {
  ChangedBy: string,
  ChangedOn: string,
  CreatedAt: string,
  CreatedBy: string,
  CreatedOn: string,
}