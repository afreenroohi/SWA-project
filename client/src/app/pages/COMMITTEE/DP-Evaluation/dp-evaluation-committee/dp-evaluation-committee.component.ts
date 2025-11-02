import { DocumentHandleService } from 'src/app/service/DocumentHandle/document-handle.service';
import { PassFormDataService } from '../../../../service/FormData/pass-form-data.service';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LegalRest, UserActionCode, tendertypes, REGEX, COMMITTEE_ROLE } from 'src/app/shared/shared';
import * as _l from 'lodash';
import { IconList } from 'src/app/components/icon/icon.component';


interface DocParamsLevels {
  firstLevelId: string,
  firstLevelName: string,
  secondLevelId: string,
  secondLevelName: string,
  thirdLevelId: string,
  operation: string,
}

@Component({
  selector: 'app-dp-evaluation-committee',
  templateUrl: './dp-evaluation-committee.component.html',
  styleUrls: ['./dp-evaluation-committee.component.scss']
})
export class DpEvaluationCommitteeComponent implements OnInit {
  id: string | null | undefined;
  confirmModal?: NzModalRef;
  committeeHeadDetails: any;
  committeeMemberDetails: any;
  bidEvaluationCommitteeForm: FormGroup;
  fileList: NzUploadFile[] = [];
  listOfDisplayData: any;
  checked: boolean = false;
  listOfOption: Array<{ label: string; value: string }> = [];
  bidEvalutaionObj: any;
  vendorHeader: string = "";
  value?: string;
  slv = 1;
  vendorList?: FormArray;
  role: any;
  OptionSelected: String | undefined;
  Officer: any;

  isChairmanInitial = false;
  isChairmanQaul = false;
  isChairmanFinal = false;
  isOfficer = false;
  isLegalMember = false;
  isTechnicalMember = false;

  MemFinal = false;
  ChFinal = false;
  to_RqstMbrs: any = [];

  chkvesele = 0;

  displayOnly = false;
  committeeId: any;
  username: any;
  selectedMember: any;
  newMemberList: any;
  vendorDetails: any;
  commentsArray: any;
  showComments: boolean = false;

  BidsapprovedRole: any;
  ChairmanFinalApp: any;
  BidsOpenCmt: any;
  ShowLegal: boolean = false;
  ShowEval: boolean = false;
  ShowhTecLegal: boolean = false;
  LegalCmt: any;
  VendName: any;
  disLegalsub: any;
  EvalList?: FormArray;
  LegalList?: FormArray;
  TechList?: FormArray;
  Techtotal = 0;
  TechCmt: any;
  TechdLen = 0;
  Evalarray: any = [];
  vendorResultOpts = LegalRest;
  disTechsub: any;
  fileNetList: any = [];
  CommitteeID: any;
  LogdInUsrID: any;
  data: any;

  SelectedIndex: any;
  Selectedvendor: any;

  attachFG: FormGroup | undefined;

  readonly IconList = IconList;
  expandIconPosition: 'left' | 'right' = 'right';

  selectedVendor: any;

  selectedBovalue: any;

  showlegalcomment = false;
  showtechcomment = false;

  tendertypes = tendertypes;
  UserActionCode = UserActionCode;

  GenFinal = false;

  singleVen = "N"
  urgentTen = "N"
  canTen = "N"

  otp: any
  getOTPModel: boolean = false;


  IsAttachmentModel: any = false;
  IsAttachmentModelup: any = false;
  chklegres = 0;
  chktecres = 0;
  finalaction: any;

  // enablemom: any = false;

  openSecretarySelectionInitial: boolean = false;
  openSecretarySelectionSubmitApproval: boolean = false;
  officerDetails: any;
  selectedSecretary: any;

  @Output()
  paramsForDocHandle = new EventEmitter();


  // @Output()
  // paramsForDocHandlev = new EventEmitter();


  // FormGroups
  otherDocsFormGroup!: FormGroup;


  showChecklists: boolean = false;

  to_VndrChkLst: any[] = []

  // singleVen = false
  // urgentTen = false;
  // canTen = false;

  public readonly COMMITTEE_ROLE = COMMITTEE_ROLE;

  dateFormat = 'dd/MM/yyyy'

  private readonly destroy$ = new Subject<void>();

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private modal: NzModalService,
    private api: ApiService,
    public common: CommonService,
    private formData: PassFormDataService,
    private location: Location,
    private docHandle: DocumentHandleService,
    public cs: CommonService
  ) {
    const data = this.formData.getData();
    if (!data) {
      this.location.back();
    } else {
      this.id = data.TndrID;
    }
    this.bidEvaluationCommitteeForm = this.fb.group({
      RFPNumber: new FormControl('', [Validators.required]),
      TenderName: new FormControl({value: '', disabled: true}, [Validators.required]),
      openingDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      ReferenceNumber: new FormControl({value: '', disabled: true}),
      typeOfPurchase: new FormControl({value: '', disabled: true}, [Validators.required]),
      typeOfTendering: new FormControl({value: '', disabled: true}, [Validators.required]),
      etimadNumber: new FormControl({value: '', disabled: true}, [Validators.required]),
      CmtFrmNumber: new FormControl({value: '', disabled: true}, [Validators.required]),
      CmtFrmDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      BeCmtFrmNumber: new FormControl({value: '', disabled: true}, [Validators.required]),
      BeCmtFrmDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      BqCmtFrmNumber: new FormControl({value: '', disabled: true}, [Validators.required]),
      BqCmtFrmDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      technicalEvaluationMember: new FormControl('', [Validators.required]),
      committeeHead: new FormControl('', [Validators.required]),
      committeeHeadMembers: new FormControl('', [Validators.required]),
      noOfVendors: new FormControl('', [Validators.required]),
      listOfVendors: new FormControl(this.listOfOption, [Validators.required]),
      technicalEvaluationCriteria: new FormControl('', [Validators.required]),
      cancelRFP: new FormControl(false),
      Vendor: this.fb.array([], [Validators.required]),
      legalEvaluation: new FormControl(''),
      price: new FormControl(''),
      Comments: new FormControl(''),
      evalComments: new FormControl(''),
      passFail: new FormControl(''),
      comments: new FormControl(''),
      finalResult: new FormControl(''),
      finalComments: new FormControl(''),
      singleVendor: new FormControl(''),
      urgentTender: new FormControl(''),
      cancelTender: new FormControl(''),
      vendorWeightage: new FormControl(''),
      value: new FormControl(''),
      mom: new FormControl({ value: '', disabled: true }),
      Attachments: this.fb.array([]),
      comment: new FormControl(''),
      to_TechEval: this.fb.array([]),
      to_LeglEval: this.fb.array([]),
      to_LeglTechEval: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // * Get role and status
    this.role = localStorage.getItem("ROLEDP");
    this.committeeId = "04";
    this.username = atob(localStorage.getItem("ID")!);

    // * Get menu selected
    this.OptionSelected = this.formData.getStatus();

    // * Creating form array for legal and technical
    this.EvalList = this.bidEvaluationCommitteeForm.get('to_TechEval') as FormArray;
    this.LegalList = this.bidEvaluationCommitteeForm.get('to_LeglEval') as FormArray;
    this.TechList = this.bidEvaluationCommitteeForm.get('to_LeglTechEval') as FormArray;

    // * Assigning role
    if (this.role === "CH" && this.OptionSelected === "BidsToOpen") {
      // * Chairman Initial
      this.isChairmanInitial = true;
    } else if (this.role === "CH" && this.OptionSelected === "FromEvalCommittee") {
      // * Chairman Final
      this.isChairmanFinal = true;
    } else if (this.role === "CH" && this.OptionSelected === "FromQualification") {
      // * Chairman Qualificaiton
      this.isChairmanQaul = true;
    } else if (this.role === "OF" && this.OptionSelected === "BidsToOpen" || this.OptionSelected === "BidList") {
      // * Officer
      this.isOfficer = true;
    } else if (this.role === "LM" && this.OptionSelected === "BidToEval") {
      // * Legal member
      this.isLegalMember = true;
    } else if (this.role === "TM" && this.OptionSelected === "BidToEval") {
      // * Technical member
      this.isTechnicalMember = true;
    }

    // else if (this.role === "OF" && this.OptionSelected === "BidToFinal") {
    //   // * Officer
    //   this.MemFinal = true;
    // }

    else if ((this.role === "TM" || this.role === "LM" || this.role === "FM" || this.role === "PM" || this.role === "OF") && (this.OptionSelected === "BidToFinal")) {
      this.GenFinal = true;

      this.displayOnly = true;
    }

    else if (this.role === "CH" && this.OptionSelected === "BidToFinalCH") {
      this.ChFinal = true;
      this.MemFinal = true;
      this.displayOnly = true;

    }
    else {
      this.displayOnly = true;
    }

    // * API call
    this.getTenderDetails();

    this.vendorList = this.bidEvaluationCommitteeForm.get('Vendor') as FormArray;
    this.vendorHeader = "List of Vendors";
    // if(this.vendorList.length === 0){
    //   this.vendorList?.push(this.createVendor());
    // }

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: LangChangeEvent) => {
      this.bidEvaluationCommitteeForm.controls["typeOfPurchase"].setValue(this.common.returnPurchaseType(this.bidEvalutaionObj.PurTypID));
      this.bidEvaluationCommitteeForm.controls['typeOfTendering']?.setValue(this.common.returnTypeOfEnvlope(this.bidEvalutaionObj.TndrTypeID));
    });
  }

  getTenderDetails() {
    const TenderId = {
      "TenderId": this.id
    }
    this.spinner.show();
    this.api.post("ECOM_TENDER_DETAILS", TenderId).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        var data = res.d.results[0];
        this.bidEvalutaionObj = data;

        if (this.bidEvalutaionObj) {

          this.bidEvaluationCommitteeForm.controls['mom'].setValue(this.bidEvalutaionObj.CommitteeCmntsArea);
          // this.bidEvaluationCommitteeForm.controls['mom'].disable();
          if (this.role === 'OF' && this.OptionSelected === "BidToFinal") {
            this.bidEvaluationCommitteeForm.controls['mom'].enable();
          }

          if (this.bidEvalutaionObj.IsTenderUrgent === 'Y') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(2);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }

          else if (this.bidEvalutaionObj.IsSingleTender === 'Y') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(1);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }

          else if (this.bidEvalutaionObj.IsTenderCancelled === 'Y') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(3);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }

          else if (this.bidEvalutaionObj.IsGeneralTender === 'Y') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(4);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }

          else if (this.bidEvalutaionObj.IsDirectPurchase === 'Y') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(5);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();

          }

          else if (this.bidEvalutaionObj.IsTenderCancelled === 'N' && this.bidEvalutaionObj.IsSingleTender === 'N' && this.bidEvalutaionObj.IsTenderUrgent === 'N') {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(4);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }

          else {
            this.bidEvaluationCommitteeForm.controls['urgentTender']?.setValue(4);
            this.bidEvaluationCommitteeForm.controls['urgentTender'].updateValueAndValidity();
          }
          // * Committee member details for LM and TM
          if (!this.isChairmanInitial && !this.isOfficer) {
            this.committeeMemberDetails = data.to_RqstMbrs.results.filter((vendor:any)=> vendor.CommitteeId === '04');
          }
          // * Ends

          // * Vendor details
          this.vendorDetails = data.to_RqstVndrs.results;
          if(this.vendorDetails.length === 0){
            this.vendorList?.push(this.createVendor());
          }
          else {
            this.patchVendorValue(this.vendorDetails);
          }
          // * Ends
          // let selectedvendors;
          // selectedvendors = this.vendorDetails.map((vendor: any) => {
          //   vendor.VendorCommercialNo = parseInt(vendor.VendorCommercialNo) === 0 ? '' : vendor.VendorCommercialNo;
          //   return vendor;
          // });
          // this.bidEvaluationCommitteeForm.get('Vendor')?.setValue(this.createVendor(this.vendorDetails));

          if (this.role === "OF") {
            this.selectedMember = data.to_RqstMbrs.results;
            this.to_RqstMbrs = data.to_RqstMbrs.results;
          }

          if (data?.to_Attach) {
            this.fileNetList = [...data.to_Attach.results.filter((node: any) => node.FilenetID && node.FileName && node.CommitteeId === '04')];
          }

          // * Mapping function
          this.mapData(this.bidEvalutaionObj);
          this.getMemberDetails();

          this.getAssignableSecretaries();
        }

      },
      (err) => {
        this.spinner.hide()
        this.common.createMessage('error', err.statusText);
      }
    );
  }

  getMemberDetails() {
    const ReqMem = {
      "Id": "04",
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
        this.bidEvaluationCommitteeForm.controls["committeeHead"].setValue(this.common.userLanguage === 'en' ? this.committeeHeadDetails.AsgnDPEvalCmtOfficerName : this.committeeHeadDetails.AsgnDPEvalCmtOfficerName);
        // * Ends

        // * Committee Head Details
        this.Officer = data.filter((item: any) => item.CommitteeRole === "OF");
        this.Officer = this.Officer[0];
        // * Ends

        // * Committee Member Details
        if ((this.role === "CH" || this.role === "OF") && (this.OptionSelected === "BidsToOpen")) {
          this.committeeMemberDetails = data.filter((item: any) => item.CommitteeRole !== "CH" && item.CommitteeRole !== "OF");
        }
        // * Ends
        this.getMemberList();

      },
      (error) => {
        this.spinner.hide();
        this.common.createMessage('error', error.statusText);
      }
    );
  }

  // * Committee member details for OF
  getMemberList() {
    if (this.role === "OF") {
      this.committeeMemberDetails.forEach((data: any, index1: any) => {
        this.selectedMember.forEach((item: any, index2: any) => {
          if (data.CommitteeUserID === item.CommitteeUser) {
            this.committeeMemberDetails[index1].SelectedMbr = this.selectedMember[index2].SelectedMbr;
          }
        });
      });
      this.newMemberList = this.committeeMemberDetails;
    }
  }

  onmemberChange(event: any, data: any, index: any) {
    if (data === 'fixed') {
      if (this.committeeMemberDetails[index].SelectedMbr === 'M') {
        delete this.committeeMemberDetails[index].SelectedMbr;
        this.to_RqstMbrs.forEach((element: any, ind: number) => {
          if (
            element.CommitteeUserName ===
            this.committeeMemberDetails[index].CommitteeUserName
          ) {
            this.to_RqstMbrs.splice(ind, 1);
          }
        });
      } else {
        this.committeeMemberDetails[index].SelectedMbr = 'M';
        this.committeeMemberDetails[index].CommitteeUser
          ? this.committeeMemberDetails[index].CommitteeUser
          : (this.committeeMemberDetails[index].CommitteeUser =
            this.committeeMemberDetails[index].CommitteeUserID);
        const i = this.to_RqstMbrs.findIndex(
          (_element: any) =>
            _element.CommitteeUserName ===
            this.committeeMemberDetails[index].CommitteeUserName
        );
        if (i > -1) this.to_RqstMbrs[i] = this.committeeMemberDetails[index]; // (2)
        else {
          // this.committeeMemberDetails[index].TenderId = this.bidEvalutaionObj.TndrID;
          this.to_RqstMbrs.push(this.committeeMemberDetails[index]);
        }
      }
    } else if (data === 'Backup') {
      if (this.committeeMemberDetails[index].SelectedMbr === 'B') {
        delete this.committeeMemberDetails[index].SelectedMbr;

        this.to_RqstMbrs.forEach((element: any, ind: number) => {
          if (
            element.CommitteeUserName ===
            this.committeeMemberDetails[index].CommitteeUserName
          ) {
            this.to_RqstMbrs.splice(ind, 1);
          }
        });
      } else {
        this.committeeMemberDetails[index].SelectedMbr = 'B';
        this.committeeMemberDetails[index].CommitteeUser ? this.committeeMemberDetails[index].CommitteeUser
          : (this.committeeMemberDetails[index].CommitteeUser =
            this.committeeMemberDetails[index].CommitteeUserID);
        const i = this.to_RqstMbrs.findIndex(
          (_element: any) =>
            _element.CommitteeUserName ===
            this.committeeMemberDetails[index].CommitteeUserName
        );
        if (i > -1) this.to_RqstMbrs[i] = this.committeeMemberDetails[index]; // (2)
        else {
          // this.committeeMemberDetails[index].CommitteeUser =
          //  this.committeeMemberDetails[index].CommitteeUserID;
          this.to_RqstMbrs.push(this.committeeMemberDetails[index]);
        }
      }
    }
  }

  mapData(data: any) {
    this.bidEvaluationCommitteeForm.controls["TenderName"].setValue(data.TndrName);
    this.bidEvaluationCommitteeForm.controls["openingDate"].setValue(this.getDate(data.BidOpngDate));
    this.bidEvaluationCommitteeForm.controls["ReferenceNumber"].setValue(data.PurReqNo);
    this.bidEvaluationCommitteeForm.controls["typeOfPurchase"].setValue(this.common.returnPurchaseType(data.PurTypID));
    this.bidEvaluationCommitteeForm.controls['typeOfTendering']?.setValue(this.common.returnTypeOfEnvlope(data.TndrTypeID));
    this.bidEvaluationCommitteeForm.controls['typeOfTendering'].updateValueAndValidity();
    this.bidEvaluationCommitteeForm.controls["etimadNumber"].setValue(data.EtimadNo);
    this.bidEvaluationCommitteeForm.controls["technicalEvaluationMember"].setValue(this.common.userLanguage === 'en' ? data.TchnclEvltnMmbrName : data.TchnclEvltnMmbrName_AR);
    // * Committee Formation Number and Date
    this.bidEvaluationCommitteeForm.controls["CmtFrmNumber"].setValue(data.CmtFrmtnOrdrNo);
    this.bidEvaluationCommitteeForm.controls["CmtFrmDate"].setValue(this.cs.getDate(data.CmtFrmtnOrdrDate));
    this.bidEvaluationCommitteeForm.controls["BeCmtFrmNumber"].setValue(data.CmtFrmtnOrdrNobec);
    this.bidEvaluationCommitteeForm.controls["BeCmtFrmDate"].setValue(this.cs.getDate(data.CmtFrmtnOrdrDatebec));
    this.bidEvaluationCommitteeForm.controls["BqCmtFrmNumber"].setValue(data.CmtFrmtnOrdrNobqc);
    this.bidEvaluationCommitteeForm.controls["BqCmtFrmDate"].setValue(this.cs.getDate(data.CmtFrmtnOrdrDatebqc));
    this.bidEvaluationCommitteeForm.updateValueAndValidity();
  }

  get Vendor() {
    return this.bidEvaluationCommitteeForm.get('Vendor') as FormArray;
  }
  getDate(date: string) {
    return this.common.returnDate(date);
  }

  updateChecked(): void {
    this.bidEvalutaionObj.isFixMemSelected = !this.bidEvalutaionObj.isFixMemSelected;
  }

  createVendor(): FormGroup {
    let itv = this.slv++;
    return this.fb.group({
      Vendor: ['', [Validators.required]],
      ItemNo: [
        { value: itv.toString(), disabled: true },
        [Validators.required],
      ],
      VendorCommNum: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Attachments: [''],
    });
  }

  patchVendorValue(vendorDetails: any) {
    this.vendorList?.reset();
    vendorDetails.forEach((vendor: any) => {
      this.slv++;
      this.vendorList?.push(
        this.fb.group({
          Vendor: [vendor.VendorName, [Validators.required]],
          ItemNo: [
            { value: parseInt(vendor.VendorId).toString(), disabled: true },
            [Validators.required],
          ],
          VendorCommNum: [vendor.VendorCommercialNo, [Validators.required]],
          Price: [vendor.Price, [Validators.required]],
          Attachments: [''],
        })
      );
    });
  }

  formatPrice(event: any): void {
  }

  async addVendor() {
    await this.vendorList?.push(this.createVendor());
  }

  // remove pay from group
  removeVendor(index: number) {
    if (index != 0) {
      this.slv--;
      this.vendorList?.removeAt(index);
      // this.getVendorDoc(index);
      // this.docHandle.deleteDocuments("", this.getVendorDoc(index))
    }
  }

  selectFiles(event: any): void {
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  // Chairman Model open
  confirmChairman() {
    this.openSecretarySelectionInitial = false;
    this.confirmModal = this.modal.confirm({
      nzDirection: this.common.userLanguage === 'en' ? 'ltr' : 'rtl',
      nzTitle: this.common.userLanguage === 'en' ? `Do you want assign it to secretary ?` : `هل تريد الإحالة سكرتير؟`,
      nzOnOk: () => {
        this.chairmanPostInital();
      }
    });
  }

  // * Post calls Starts - DP Evaluation
  // * Chairman initial post call
  chairmanPostInital() {
    this.spinner.show();
    // Mapping logged in user details
    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = UserActionCode.assign;
    this.bidEvalutaionObj.AsgnDPEvalCmtOfficerID =
      this.selectedSecretary.CommitteeUserID;
    this.bidEvalutaionObj.AsgnDPEvalCmtOfficerName =
      this.selectedSecretary.CommitteeUserName;

    let td = this.bidEvalutaionObj.TndrID
    // Mapping To request members
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
          "CommitteeId": item.CommitteeId,
          "TenderId": this.bidEvalutaionObj.TndrID,
          "CommitteeRole": item.CommitteeRole,
          "CommitteeUser": item.CommitteeUserID,
          "CommitteeBckupUser": item.CommitteeBkpUserID,
          "CommitteeUserName": item.CommitteeUserName,
          "CommitteeBkpUserName": item.CommitteeBkpUserName,
          "SelectedMbr": item.SelectedMbr
        }
        members.push(memberItem);
      });
      this.bidEvalutaionObj.to_RqstMbrs.results = members;
    }

    // Mapping Officer details
    // this.bidEvalutaionObj.AsgnDPEvalCmtOfficerID = this.Officer.CommitteeUserID;
    // this.bidEvalutaionObj.AsgnDPEvalCmtOfficerName = this.Officer.CommitteeUserName;

    

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.location.back();
        this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
      },
      (error) => {
        this.spinner.hide();
        this.common.createMessage('error', error.statusText);
      }
    );
  }

  // * Officer post call
  OfficerPost(value: UserActionCode) {
    let approve = false;
    let approvetech = false;
    let isInValidVendor = false;

    if (value !== UserActionCode.draft && this.isInVendorValid) { return; }

    this.spinner.show();

    // * Logged in user deatils
    const userName = atob(localStorage.getItem("ID")!);
    this.bidEvalutaionObj.LgdInUsr = userName;

    this.bidEvalutaionObj.LgdInUsrCmt = "04";
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = value;


    // * Mapping To request members
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
    let td = this.bidEvalutaionObj.TndrID
    this.to_RqstMbrs.forEach((item: any) => {
      let memberItem = {
        "CommitteeId": item.CommitteeId,
        "TenderId": td,
        "CommitteeRole": item.CommitteeRole,
        "CommitteeUser": item.CommitteeUserID ? item.CommitteeUserID : item.CommitteeUser,
        "CommitteeBckupUser": item.CommitteeBkpUserID ? item.CommitteeBkpUserID : item.CommitteeBckupUser,
        "CommitteeUserName": item.CommitteeUserName,
        "CommitteeBkpUserName": item.CommitteeBkpUserName,
        "SelectedMbr": item.SelectedMbr
      }
      members.push(memberItem);
    });



    this.bidEvalutaionObj.to_RqstMbrs = members;

    if (this.bidEvalutaionObj.to_RqstMbrs) {

      if(this.bidEvalutaionObj.to_RqstMbrs.filter((element:any) => element.CommitteeRole === "TM").length > 1) {
        this.common.createMessage("error", this.translate.instant("COM.TechmemSingle"));
        this.spinner.hide();
        return;
      }

      this.bidEvalutaionObj.to_RqstMbrs.forEach((element: any) => {
       
        if ((element.SelectedMbr === 'M' || element.SelectedMbr === 'B')) {
          approve = true;
        }
        if (element.CommitteeRole === 'TM' && (element.SelectedMbr === 'M' || element.SelectedMbr === 'B')) {
          approvetech = true;
        }
        else {
          //approve = false;
        }
      });

      if ((approve || approvetech || value === UserActionCode.draft)) {
        let newVendorList: {
          CommitteeId: any;
          TenderId: any;
          VendorName: any;
          VendorCommercialNo: any;
          Price: any;
          IsVndrfnclQualified: string;
          IsVndrtechQualified: string;
          to_VndrChkLst: never[];
          
          to_VndrFnclEvl: never[];
          to_VndrTchnlEvl: never[];
          to_LeglEval: never[];
          to_TechEval: never[];
        }[] = [];

        this.Vendor.value.forEach((data: any, index: any) => {
          let item = {
            "CommitteeId": this.bidEvalutaionObj.CommitteeID,
            "TenderId": this.bidEvalutaionObj.TndrID,
            "VendorName": data.Vendor,
            "VendorCommercialNo": data.VendorCommNum.toString(),
            "Price": this.common.removeCommas(data.Price),
            "IsVndrfnclQualified": "",
            "IsVndrtechQualified": "",
            "to_VndrChkLst": [],
            
            "to_VndrFnclEvl": [],
            "to_VndrTchnlEvl": [],
            "to_LeglEval": [],
            "to_TechEval": []
          }
          newVendorList?.push(item);
        });
        this.bidEvalutaionObj.to_RqstVndrs = newVendorList;
        this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

        
      
        this.spinner.show();
        this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.spinner.hide();
            this.location.back();
            this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
          },
          (error) => {
            this.spinner.hide();
            this.common.createMessage('error', error.statusText);
          }
        );
      }
      else if (!approvetech) {
        this.spinner.hide()
        this.common.createMessage("error", this.translate.instant("COM.TechMemError"))
      }
      else if (!approve) {
        this.spinner.hide()
        this.common.createMessage("error", this.translate.instant("COM.legalError"))
      }
    }
  }

  // * Technical post call
  technicalPost() {
    if (!this.bidEvalutaionObj.to_RqstVndrs.results.every((result: { VndrTechnicalResult: string }) => result.VndrTechnicalResult.trim())) {
      this.cs.createMessage(`error`, this.translate.instant(`COM.TechResultRequired`));
      return;
    }

    this.chktecres = 0;
    this.spinner.show();

    // Assign logged user details
    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = UserActionCode.submit;

    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any) => {
      if (element.VndrLegalResult === 'Pass' || element.VndrLegalResult === 'Fail') {
        this.chklegres = this.chklegres + 1;
      }

      if (this.role === 'TM' && element.EvalCMTVndrtnclactualtotal) {
        if (element.VndrTechnicalResult === 'Pass' || element.VndrTechnicalResult === 'Fail') {
          this.chktecres = this.chktecres + 1;
        }
        else {
          let v = parseInt(element.EvalCMTVndrtnclactualtotal)
          if (v >= 0) {
            this.chktecres = this.chktecres + 1;
          }
        }

      }
    });

    this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

    

    if (this.role === 'LM' && this.chklegres === this.bidEvalutaionObj.to_RqstVndrs.results.length) {
      this.spinner.show();
      this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.location.back();
          this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
        },
        (error) => {
          this.spinner.hide();
          this.common.createMessage('error', error.statusText);
        }
      );
    }
    else if (this.role === 'TM' && this.chktecres === this.bidEvalutaionObj.to_RqstVndrs.results.length) {
      this.spinner.show();
      this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.location.back();
          this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
        },
        (error) => {
          this.spinner.hide();
          this.common.createMessage('error', error.statusText);
        }
      );
    }
    else {
      this.spinner.hide();
      this.common.createMessage("error", this.translate.instant("COM.EvalCom"))
    }


  }
  // * Chairman final approval
  async SubmitForApproval({ LgdInUsrAction } = { LgdInUsrAction: `` }) {
    this.openSecretarySelectionSubmitApproval = false;

    this.chkvesele = 0;
    this.spinner.show();

    // Assign logged user details
    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = LgdInUsrAction ? LgdInUsrAction : UserActionCode.submitForFinalProcess;

    if (LgdInUsrAction !== UserActionCode.assignToBidQualificaiton) {
      this.bidEvalutaionObj.AsgnDPEvalCmtOfficerID = this.selectedSecretary.CommitteeUserID;
      this.bidEvalutaionObj.AsgnDPEvalCmtOfficerName = this.selectedSecretary.CommitteeUserName;

      if (this.noVendorQualified && this.DP_SPECIAL_SCENARIO) {
        this.spinner.hide();
        this.common.createMessage("error", this.translate.instant("COM.SelectedVendorNotQualified"))
        return;
      }
    }

    if (this.bidEvalutaionObj.IsSingleTender === "") {
      this.bidEvalutaionObj.IsSingleTender = "N"
    }

    if (this.bidEvalutaionObj.IsTenderCancelled === "") {
      this.bidEvalutaionObj.IsTenderCancelled = "N"

    }
    if (this.bidEvalutaionObj.IsTenderUrgent === "") {
      this.bidEvalutaionObj.IsTenderUrgent = "N"
    }


    let comments = this.bidEvaluationCommitteeForm.controls['comment'].value;
    let value = this.bidEvaluationCommitteeForm.controls['value'].value;
    let isRFPCancelled = this.bidEvaluationCommitteeForm.controls['cancelRFP'].value;

    if (isRFPCancelled) {
      this.bidEvalutaionObj.IsTenderCancelled = 'Y';
    } else {

    }

    this.bidEvalutaionObj.CommitteeCmntsArea = this.bidEvaluationCommitteeForm.controls['mom'].value.toString();

    await this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any) => {
      if (element.IsVendorSelected == "Y") {
        this.chkvesele = this.chkvesele + 1
      }
    });

    this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

    

    if (this.bidEvalutaionObj.to_RqstVndrs.results.length === 1) {
      if (this.chkvesele == 1) {
        this.spinner.show();
        this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.spinner.hide();
            this.location.back();
            this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
          },
          (error) => {
            this.spinner.hide();
            this.common.createMessage('error', error.statusText);
          }
        );
      }
      else {
        this.spinner.hide()
        this.common.createMessage("error", this.translate.instant("COM.SelectVendor"))
      }
    }
    else if (this.chkvesele == 1) {
      this.spinner.show();
      this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.location.back();
          this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
        },
        (error) => {
          this.spinner.hide();
          this.common.createMessage('error', error.statusText);
        }
      );
    }
    else if (this.chkvesele > 1) {
      this.spinner.hide()
      this.common.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }
    else {
      this.spinner.hide()
      this.common.createMessage("error", this.translate.instant("COM.SelectVendor"))
    }




  }

  // otp approval
  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.common.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.submitTender();
      }
      else if (data !== this.otp) {
        this.common.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  submitTender() {
    this.spinner.show();
    // Assign logged user details
    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = this.finalaction;

    this.bidEvalutaionObj.CommitteeCmntsArea = this.bidEvaluationCommitteeForm.controls['mom'].value.toString();

    

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.location.back();
        this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
      },
      (error) => {
        this.spinner.hide();
        this.common.createMessage('error', error.statusText);
      }
    );
  }

  updateOTP(value: any) {
    this.getOTPModel = value;
  }

  FinalSubmit({ LgdInUsrAction } = { LgdInUsrAction: `` }) {
    let data = {
      UserId: this.common.getUserData().userid
    }

    this.finalaction = LgdInUsrAction;
    if (LgdInUsrAction === UserActionCode.return) {
      this.submitTender();
      return;
    }
    // * Committee Recommendations have to be entered by Officer
    if (this.role === 'OF' && this.bidEvaluationCommitteeForm.controls['mom'].value.toString().trim() === '') {
      this.cs.createMessage('error', this.translate.instant('COM.Enter Committee Recommendations'));
      return;
    }

    this.spinner.show();
    this.api.post("/OTP", data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.spinner.hide();
      if (res.d.results[0].MessageId === "S") {
        this.common.otpToast(res.d.results[0])

        this.otp = res.d.results[0].OtpNo
        // this.common.createMessage("success","Your OTP is "+this.otp)
        this.getOTPModel = !this.getOTPModel;
      }
      else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.common.createMessage('error', this.common.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      }
      else {
        this.common.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    }, () => {
      this.spinner.hide();
    })


  }
  // * Chairman assign to Technical member
  SubmitForTechnical() {
    this.spinner.show();

    // * Assign logged user details
    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = UserActionCode.assignToTechnicalMember;


    // if(LgdInUsrAction === UserActionCode.assignToBidQualificaiton) {
    //   const committeeComments = this.bidEvaluationCommitteeForm.controls['mom'].value;
    //   const methodOfSubmission = this.bidEvaluationCommitteeForm.controls['urgentTender'].value;

    // }

    this.bidEvalutaionObj.to_Attach = this.combineOtherAttachmentsWithUpdated();

    

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.location.back();
        this.common.createMessage('success', this.common.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2);
      },
      (error) => {
        this.spinner.hide();

        this.common.createMessage('error', error.statusText);
      }
    );

  }
  // * Post calls Ends - DP Evaluation

  Close() { }

  Assign() { }

  openLegal(data: any, vname: any, i: any) {
    this.LegalCmt = "";
    this.VendName = vname.VendorName
    if (this.ShowLegal == true) {
      this.disLegalsub = false;
      this.removeLegal(0);
      if (data.length > 0) {
        this.addLegal();
      }
      else {
        this.removeLegal(0)
        this.addLegal(vname.VendorId, vname.TenderId, this.committeeId);
      }

    }
    else {
      this.disLegalsub = false;
      if (vname && vname.VndrLegalResult) {
        this.removeLegal(0)
        this.addLegal(vname.VendorId, vname.TenderId, this.committeeId, this.bidEvalutaionObj.to_RqstVndrs.results[i].VndrLegalResult);
        this.ShowLegal = true;
      }
      else if (data && data.length == 0) {
        this.removeLegal(0)
        this.addLegal(vname.VendorId, vname.TenderId, this.committeeId);
        this.ShowLegal = true;
      }

    }

  }

  addTechevalData(data?: any) {
    this.spinner.show()
    let dt = this.bidEvaluationCommitteeForm.getRawValue().to_LeglTechEval;

    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
      if (element.VendorId == dt[0].VendorId) {
        element.VndrTechnicalResult = dt[0].VndrTechnicalResult;

      }
    });
    this.disLegalsub = false;

    this.ShowhTecLegal = false;
    this.TechCmt = "";

    if (this.bidEvalutaionObj) {
      this.bidEvalutaionObj.LgdInUsrAction = 'DFT';

      this.bidEvalutaionObj.LgdInUsr = this.username;
      this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
      this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;

      

      this.spinner.show();
      this.api.post('OCOM_CRT_UPD', this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide()
          if (res.d.MsgType === 'S') {
            this.common.createMessage("success", this.translate.instant("COM.TechEvalSub"));

            this.getTenderDetails();
          }
          else {
            this.common.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.spinner.hide()
          this.common.createMessage('error', error.statusText);

        }
      )
    }
  }

  addLegData(data?: any) {
    let dt = this.bidEvaluationCommitteeForm.getRawValue().to_LeglEval

    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
      
      if (element.VendorId == dt[0].VendorId) {
        element.VndrLegalResult = dt[0].LegalResult;

      }
    });
    this.disLegalsub = false;

    this.ShowLegal = false;
    this.LegalCmt = "";

    if (this.bidEvalutaionObj) {
      this.bidEvalutaionObj.LgdInUsrAction = 'DFT';

      this.bidEvalutaionObj.LgdInUsr = this.username;
      this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
      this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;

      

      this.spinner.show();
      this.api.post('OCOM_CRT_UPD', this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          if (res.d.MsgType === 'S') {
            this.common.createMessage("success", this.translate.instant("COM.LegEvalSub"));

            this.getTenderDetails();
          }
          else {
            this.common.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.spinner.hide()
          this.common.createMessage('error', error.statusText);

        }
      )
    }




  }

  addTechData() {
    let dt = this.bidEvaluationCommitteeForm.getRawValue().to_TechEval
    if (dt.length > 0) {
      this.bidEvalutaionObj.to_RqstVndrs.results.forEach((element: any, index: any) => {
        // dt.forEach((elemet: any, i: any) => {
        if (element.VendorId == this.selectedVendor) {
          this.bidEvalutaionObj.to_RqstVndrs.results[index].to_TechEval = dt
          this.bidEvalutaionObj.to_RqstVndrs.results[index].EvalCMTVndrtnclactualtotal = this.Techtotal.toString();

        }
        // });
      });

      this.disTechsub = false;
      this.common.createMessage("success", this.translate.instant("COM.TechEvalSub"));
      this.ShowEval = false;
      this.TechCmt = "";
      for (let i = 0; i <= this.Evalarray.length; i++) {
        this.removeTech(0)
      }
      this.Evalarray = []

      

      if (this.bidEvalutaionObj) {
        this.bidEvalutaionObj.LgdInUsrAction = 'DFT';

        this.bidEvalutaionObj.LgdInUsr = this.username;
        this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
        this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;

        this.spinner.show();
        this.api.post('OCOM_CRT_UPD', this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.spinner.hide();
            if (res.d.MsgType === 'S') {
              this.common.createMessage("success", this.translate.instant("COM.TechEvalSub"));
              //this.ngOnInit()
              this.getTenderDetails();
            }
            else {
              this.common.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            this.spinner.hide();
            this.common.createMessage('error', error.statusText);

          }
        )
      }

    }
    else {
      this.common.createMessage("error", this.translate.instant("COM.NoCriteria"));
    }
  }

  removeTech(i: any) {
    this.EvalList?.removeAt(i)
  }

  openTechical(data: any, vname: any, i: any) {
    this.VendName = vname.VendorName;
    this.selectedVendor = vname.VendorId;
    this.Techtotal = parseFloat(vname.EvalCMTVndrtnclactualtotal)
    this.TechCmt = "";
    this.disTechsub = false;
    if (data && data.length > 0) {
      let len = data.length;
      this.TechdLen = data.length;
      for (let i = 0; i < len; i++) {
        this.addEval();
      }
      this.bidEvaluationCommitteeForm.controls['to_TechEval'].patchValue(data);
      this.bidEvaluationCommitteeForm.controls['to_TechEval'].updateValueAndValidity();
    }

    else {
      let arr: any[] = []
      let dat = {
        RfpNo: this.bidEvalutaionObj.RFPNumber
      }
      this.spinner.show();
      this.api.post('F4_TechCRIT', dat).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.spinner.hide();
        this.TechdLen = res.d.results[0].to_RFPTechCrt.results.length;
        if (res.d.results[0].PurchaseTypeID === 'R') {
          res.d.results[0].to_RFPTechCrt.results.forEach((element: any) => {

            let evaldata = {
              CommitteeId: this.committeeId,
              TenderId: this.bidEvalutaionObj.TndrID,
              VendorId: vname.VendorId,
              EvltnTechCriteriaId: element.EvltnTechCriteriaId_RFP,
              EvltnTechCriteriaDesc: element.EvltnTechCriteriaDesc_RFP,
              Weightage: element.Weightage,
              Actual: ""
            }
            this.addEval();
            this.Evalarray.push(evaldata)
            arr.push(evaldata)
            this.bidEvaluationCommitteeForm.controls['to_TechEval'].patchValue(arr);
            this.bidEvaluationCommitteeForm.controls['to_TechEval'].updateValueAndValidity();
            //  this.ShowhTecLegal = true;

            this.ShowEval = true;

          });
        }
        else if (res.d.results[0].PurchaseTypeID === 'D') {

          // this.dptype = true;
          this.removeLegalTec(0)
          this.addLegalTec(vname.VendorId, vname.TenderId, this.committeeId, this.bidEvalutaionObj.to_RqstVndrs.results[i].VndrTechnicalResult);
          this.ShowhTecLegal = true;



        }

      }, () => {
        this.spinner.hide();
      });

    }


  }

  selectVendor(value: any, i: any) {
    if (value == true) {
      this.bidEvalutaionObj.to_RqstVndrs.results[i].IsVendorSelected = "Y"
    }
    else if (value == false) {
      this.bidEvalutaionObj.to_RqstVndrs.results[i].IsVendorSelected = "N"
    }
    else {
      this.bidEvalutaionObj.to_RqstVndrs.results[i].IsVendorSelected = "N"
    }
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
    this.spinner.show()
    let dt = {
      "TenderId": this.bidEvalutaionObj.TndrID,
      // "MemberId":this.userDetails.ID,
      "VendorId": this.selectedVendor,
      //  "role":this.role,
    }
    this.api.post("/GET_CMTS", dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.commentsArray = res.d.results;
      this.showComments = !this.showComments;
      this.spinner.hide()
    })
  }

  getAttachFormGroup(_params: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeIds(_params);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    return attachFG;

  }

  showChkAttachModal(vdId: any, checkId: any) {
    // if (vdId !== null && checkId !== null) {
    //   let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    //   if (vendorDetails[vdId].VendorCommercialNo === '') {
    //     //this.error('Vendor Commercial number Required for Attachment');
    //     this.commonService.createMessage(
    //       'error',
    //       this.commonService.userLanguage === 'en'
    //         ? 'Vendor Commercial number Required for Attachment'
    //         : 'الرقم التجاري للبائع مطلوب للإرفاق'
    //     );
    //   } else {
    this.SelectedIndex = vdId;
    this.Selectedvendor = checkId;
    this.IsAttachmentModelup = true;
    //   }
    // }
  }
  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //normal
      displayMode: this.role === 'OF' || this.isChairmanFinal === true ? 'edit' : 'view', //view
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

  addEval() {
    this.EvalList?.push(this.createTechEval());
  }

  async addLegal(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any) {
    await this.LegalList?.push(this.createLegalEval(VendorId, TenderId, CommitteeId, LegalResult))
  }
  removeLegal(i: any) {
    this.LegalList?.removeAt(i)
  }

  async addLegalTec(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any) {
    await this.TechList?.push(this.createTechdpEval(VendorId, TenderId, CommitteeId, LegalResult))
  }
  removeLegalTec(i: any) {
    this.TechList?.removeAt(i)
  }

  // * Getter methods
  get DP_SPECIAL_SCENARIO(): boolean {
    return this.bidEvalutaionObj.DPFlowException === `X`;
  }

  get Eval() {
    return this.bidEvaluationCommitteeForm.get('to_TechEval') as FormArray;
  }
  get Legal() {
    return this.bidEvaluationCommitteeForm.get('to_LeglEval') as FormArray;
  }

  get Tech() {
    return this.bidEvaluationCommitteeForm.get('to_LeglTechEval') as FormArray;
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
  get createFGParams(): DocParamsLevels {
    return {
      firstLevelName: "P2PCommitteTender",
      firstLevelId: "1",
      secondLevelName: "P2PCommitteVendor",
      secondLevelId: "2532",
      thirdLevelId: "101",
      operation: "C"
    }
  }

  get isAllowedToQualification(): boolean {
    const isAnyVendorPassed = this.bidEvalutaionObj.to_RqstVndrs.results.find((vendor: any) => vendor.VndrTechnicalResult === 'Pass');
    if (isAnyVendorPassed && this.DP_SPECIAL_SCENARIO) {
      return true;
    }
    return false;
  }

  /**
   * Getter method to find no Vendor is qualifided from Qualification committee in special secnireo.
   */
  get noVendorQualified(): boolean {
    let _noVendorQualified = true;
    this.bidEvalutaionObj.to_RqstVndrs.results.forEach((vendor: any) => {
      if (vendor.IsVndrtechQualified === 'X' && vendor.IsVndrfnclQualified === 'X') {
        _noVendorQualified = false;
      }
    });
    return _noVendorQualified;
  }

  /**
   * Getter method to find the selected Vendor is Qulified.
   */
  get isSelectedVendorQualified(): boolean {
    const selectedVendor = this.bidEvalutaionObj?.to_RqstVndrs?.results.find((vendor:any) => vendor.IsVendorSelected === 'Y');
    if(selectedVendor.IsVndrtechQualified === 'X' && selectedVendor.IsVndrfnclQualified === 'X') {
      return true;
    }
    return false;
  }

  /**
   * Returns `true` if vendor list is invalid
   */
  get isInVendorValid(): boolean {

    let vendorisInValid = false;
    const vendorListValue = this.vendorList?.value;


    vendorListValue.every((vendor: any) => {
      if (vendor.Vendor?.toString().length == 0) {
        this.common.createMessage(
          'error',
          this.common.userLanguage === 'en'
            ? 'Invalid vendorName  '
            : 'رقم تجاري مكرر'
        );
        vendorisInValid = true;
        return false;
      }

      if (vendor.VendorCommNum?.toString().length !== 10 || parseInt(vendor.VendorCommNum) === 0) {
        this.common.createMessage(
          'error',
          this.common.userLanguage === 'en'
            ? 'Please enter valid commercial number for vendor list '
            : `الرجاء إدخال رقم تجاري صالح`
        );
        vendorisInValid = true;
        return false;
      }

      if (vendor.Price?.toString().length == 0 || parseFloat(vendor.Price) == 0) {
        this.common.createMessage(
          'error',
          this.common.userLanguage === 'en'
            ? 'Invalid Price  '
            : 'رقم تجاري مكرر'
        );
        vendorisInValid = true;
        return false;
      }

      return true;
    });

    if (vendorisInValid) return vendorisInValid;

    if (this.hasDuplicateVendorName) {
      this.common.createMessage(
        'error',
        this.common.userLanguage === 'en'
          ? 'Duplicated Vendor Name'
          : 'رقم تجاري مكرر'
      );
      vendorisInValid = true;
      return vendorisInValid;
    }

    if (this.hasDuplicateCommercialNo) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Duplicated commercial number'
          : 'الرقم التجاري مكرر'
      );
      vendorisInValid = true;
      return vendorisInValid;
    }


    return vendorisInValid;
  }

  get hasDuplicateVendorName(): boolean {
    const vendorListValue = this.vendorList?.value;

    const foundDuplicateName = vendorListValue.find((vendor: any, index: number) => {
      return vendorListValue.find((ven: any, ind: number) => ven.Vendor === vendor.Vendor && index !== ind)
    });

    if (foundDuplicateName) { return true; }
    return false;
  }

  get hasDuplicateCommercialNo(): boolean {
    const vendorListValue = this.vendorList?.value;

    const foundDuplicateCrNo = vendorListValue.find((vendor: any, index: number) => {
      return vendorListValue.find((ven: any, ind: number) => ven.VendorCommNum === vendor.VendorCommNum && index !== ind)
    });

    if (foundDuplicateCrNo) { return true; }
    return false;
  }

  getVendorFormsUpload(i: any, data: any) {
    return {
      firstLevelName: "P2PCommitteTender",
      firstLevelId: this.bidEvalutaionObj.TndrID,
      secondLevelName: "P2PCommitteVendor",
      secondLevelId: data.value.VendorCommNum.toString(),
      thirdLevelId: "101",
      operation: "C"
    }
  }
  getVendorForms(index: any) {
    return {
      firstLevelName: "P2PCommitteTender",
      firstLevelId: this.bidEvalutaionObj.TndrID,
      secondLevelName: "P2PCommitteVendor",
      secondLevelId: index.VendorCommercialNo,
      thirdLevelId: "101",
      operation: "C"
    }
  }
  createLegalEval(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any): FormGroup {
    return this.fb.group({
      CommitteeId: [CommitteeId],
      TenderId: [TenderId],
      VendorId: [VendorId],
      LegalResult: [LegalResult ? LegalResult : 'Fail'],
    });
  }
  createTechdpEval(VendorId?: any, TenderId?: any, CommitteeId?: any, LegalResult?: any): FormGroup {
    return this.fb.group({
      CommitteeId: [CommitteeId],
      TenderId: [TenderId],
      VendorId: [VendorId],
      VndrTechnicalResult: [LegalResult ? LegalResult : 'Fail'],
    });
  }

  createTechEval(): FormGroup {
    return this.fb.group({
      CommitteeId: ['',],
      TenderId: [],
      VendorId: [' '],
      EvltnTechCriteriaId: [' '],
      EvltnTechCriteriaDesc: [{ value: '', disabled: true }],
      Weightage: [''],
      Actual: [0],
    });
  }

  CalActual() {
    let cal: any;
    let acutals = this.bidEvaluationCommitteeForm.getRawValue().to_TechEval
    this.Techtotal = 0;
    acutals.forEach((element: any) => {
      if (element.Actual) {
        cal = (parseInt(element.Actual) * (parseInt(element.Weightage) / 100)).toFixed(2)
        // cal = cal.toFixed(2)
      }
      else {
        cal = 0
      }
      this.Techtotal += parseFloat(cal)
      this.Techtotal.toFixed(2)
    });
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

  addComments(comment: any) {
    let Cmtdata = {
      "CommitteeId": this.committeeId,
      "TenderId": this.bidEvalutaionObj.TndrID,
      "VendorId": this.selectedVendor,
      "CmntdMember": this.username,
      "CmntdDate": "",
      "Comments": comment,
      CommitteeRole: this.role,
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
            this.common.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.spinner.hide();
          this.common.createMessage('error', error.statusText);

        }
      );
    }

  }

  async downloadMOM() {

    this.bidEvalutaionObj.LgdInUsr = this.username;
    this.bidEvalutaionObj.LgdInUsrCmt = this.committeeId;
    this.bidEvalutaionObj.LgdInUsrCmtRole = this.role;
    this.bidEvalutaionObj.LgdInUsrAction = 'DFT';

    this.bidEvalutaionObj.CommitteeCmntsArea = this.bidEvaluationCommitteeForm.controls['mom'].value.toString();

    

    this.spinner.show();
    this.api.post("OCOM_CRT_UPD", this.bidEvalutaionObj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        let val = {
          "CommitteeID": '04',
          "TndrID": this.bidEvalutaionObj.TndrID,
          "LoggedInID": atob(localStorage.getItem("ID")!),
          "Role": "04",
          "LoggedCmt": "04",
        }
        if (val) {
          this.cs.downloadMOM(val, this.bidEvalutaionObj.TndrName +'_'+ "Direct_Purchase_Committee" + '_');
        }
      },
      (error) => {
        this.spinner.hide();
        this.common.createMessage('error', error.statusText);
      }
    );


  }

  transformComma(event: any, index: number) {
    const amountVal = event?.target?.value;
    (this.Vendor.at(index) as FormGroup)
      .get('Price')
      ?.patchValue(this.common.transform(amountVal.toString()));
  }


  showChecklistsModal(_data: any) {

    this.to_VndrChkLst = _data.to_VndrChkLst
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

  getChkbox(value: any) {

    if (value == 1) {
      this.bidEvalutaionObj.IsSingleTender = "Y"
      this.bidEvalutaionObj.IsTenderUrgent = "N"
      this.bidEvalutaionObj.IsTenderCancelled = "N"
      this.bidEvalutaionObj.IsGeneralTender = "N"
      this.bidEvalutaionObj.IsDirectPurchase = "N"
    }
    else if (value == 2) {
      this.bidEvalutaionObj.IsTenderUrgent = "Y"
      this.bidEvalutaionObj.IsTenderCancelled = "N"
      this.bidEvalutaionObj.IsSingleTender = "N"
      this.bidEvalutaionObj.IsGeneralTender = "N"
      this.bidEvalutaionObj.IsDirectPurchase = "N"
    }
    else if (value == 3) {
      this.bidEvalutaionObj.IsTenderUrgent = "N"
      this.bidEvalutaionObj.IsTenderCancelled = "Y"
      this.bidEvalutaionObj.IsSingleTender = "N"
      this.bidEvalutaionObj.IsGeneralTender = "N"
      this.bidEvalutaionObj.IsDirectPurchase = "N"
    }
    else if (value == 4) {
      this.bidEvalutaionObj.IsSingleTender = "N"
      this.bidEvalutaionObj.IsTenderUrgent = "N"
      this.bidEvalutaionObj.IsTenderCancelled = "N"
      this.bidEvalutaionObj.IsGeneralTender = "Y"
      this.bidEvalutaionObj.IsDirectPurchase = "N"
    }
    else if (value == 5) {
      this.bidEvalutaionObj.IsSingleTender = "N"
      this.bidEvalutaionObj.IsTenderUrgent = "N"
      this.bidEvalutaionObj.IsTenderCancelled = "N"
      this.bidEvalutaionObj.IsGeneralTender = "N"
      this.bidEvalutaionObj.IsDirectPurchase = "Y"
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  restrictZero(event: any) {


    if (event.target.value.length === 0 && event.key <= "0") {

      event.preventDefault();
    }

  }

  // filenetUpload(evt: any) {
  //   this.fileNetList.push({
  //     FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
  //     FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
  //     CommitteeId: this.CommitteeID,
  //     CommitteeRole: this.role,
  //     CommitteeUser: this.LogdInUsrID
  //     // TenderId: this.data.TndrID
  //   });

  //   this.fileNetList = [...this.fileNetList];
  // }
  
  filenetUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: '04',
      CommitteeRole: this.role,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalutaionObj.TndrID,
    })

    this.fileNetList = [...this.fileNetList];
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: '04',
      CommitteeRole: this.role,
      CommitteeUser: localStorage.getItem('LogdInUsrID'),
      TenderId: this.bidEvalutaionObj.TndrID,
    })

    this.fileNetList = [...this.fileNetList];
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }


  get IS_CEO_DIRECTOR_OR_VP(): boolean {
    return this.role === COMMITTEE_ROLE.CEO || this.role === COMMITTEE_ROLE.DIRECTOR || this.role === COMMITTEE_ROLE.VICE_PRESIDENT;
  }


  get isTenderDP(): boolean {
    return this.bidEvalutaionObj?.PurTypID === 'D';
  }

  get isTenderRFP(): boolean {
    return this.bidEvalutaionObj?.PurTypID === `R`;
  }


  getAssignableSecretaries() {
    let cmtid = {
      Id: this.committeeId,
      TndrId: this.bidEvalutaionObj.TndrID,
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

  commentDate(date: any) {
    
    return date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6, 8) + ' ' + date.slice(8,10) + ':' + date.slice(10, 12) + ':' + date.slice(12, 14)
  

}

  /**
 * Removes the comments from Payload to avoid duplication in comments
 */


  combineOtherAttachmentsWithUpdated() {
    let list = [...this.fileNetList];
    list.forEach((node: any) => {
      delete node.hideDeleteButton;
      delete node.downloading;
    });
    const allAttachments = [
      ...this.bidEvaluationCommitteeForm.getRawValue().Attachments,
      ...list
    ];

    return allAttachments
  }
}

