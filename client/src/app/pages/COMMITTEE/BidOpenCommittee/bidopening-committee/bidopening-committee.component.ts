import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import {
  CheckList,
  EnvType,
  PurchaseType,
  REGEX,
  DocParamsLevels,
  VendorPayload,
} from 'src/app/shared/shared';
import * as _l from 'lodash';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import {
  actionButtonDetails,
  ActionMap,
  CommitteeMembers,
  CommitteeMembersFromAPI,
  Country,
  docParams,
  doumentDownload,
  highLevelDocParams,
} from '../../committee.model';
import { BidOpeningCommitteeService } from './bidopening-committee.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { UserActionCode } from 'src/app/shared/shared';
import { IconList } from 'src/app/components/icon/icon.component';


interface IPanels {
  name: string;
  active: boolean;
  panels?: any;
}

@Component({
  selector: 'app-bidopening-committee',
  templateUrl: './bidopening-committee.component.html',
  styleUrls: ['./bidopening-committee.component.scss'],
  providers: [BidOpeningCommitteeService],
})
export class BidopeningCommitteeComponent implements OnInit {
  private initialized = false;
  public readonly panels: IPanels[] = [
    { name: `tenderDetails`, active: true },
    { name: `committeeHeadComments`, active: false },
    { name: `committeeMembers`, active: false },
    {
      name: `addVendors`,
      active: false,
      panels: [
        { name: `checklist`, active: false },
        { name: `attchments`, active: false },
        { name: `contentOfOffer`, active: false },
        { name: `committeeComments`, active: false },
        { name: `committeeCommentsForFinancialOffer`, active: false },
        { name: 'address', active: false },
        { name: 'contact', active: false }
      ],
    },
    { name: `committeeComments`, active: false },
    { name: `attachment`, active: false },
  ];
  IsFileUploaded: boolean = false;
  textValue: string | null = null;
  confirmModal?: NzModalRef; // For testing by now
  IconList = IconList;
  bidopeningCommitteeForm: FormGroup;
  listOfmemberData: CommitteeMembersFromAPI[] = [];
  listOfOption: any;
  multipleValue = [];
  fixedmemberChecked = false;
  backupmemberChecked = false;
  isDisablebackdmember = false;
  isDisablefixedmember = false;
  duplicateItems: any = [];
  invalidPriceList: any = [];
  invalidInitialGuranteeValue: any = [];
  invalidFinancialComments: any = [];
  invalidContentOfferList: any = [];
  invalidCommentsList: any = [];
  invalidAttachmentsList: any = [];
  invalidZipCodeList: any[] = [];
  invalidCityList: any[] = [];
  invalidCountryList: any[] = [];
  invalidPhoneNoList: any[] = [];
  invalidEmailList: any[] = [];
  duplicateVendorItems: any = [];
  invalidVendorNameList: any = [];
  sl = 1;
  cmtHead: any;
  name = 'CheckList';
  VendorName = 'List of Vendors ';
  vendorlistname: any = [];
  vendorList?: FormArray;
  uploading = false;
  fileList: NzUploadFile[] = [];
  uploadedfiles: any[] = [];
  prevuploadedfiles: any[] = [];
  attList?: FormArray;
  itnatt: any;
  data: any;
  role: any;
  isChaiman: boolean = false;

  isChaimanReturn: boolean = false;
  isOfficer: boolean = false;
  isMember: boolean = false;
  Officer: any;
  officerId: any;
  openMdl = false;
  to_RqstMbrs: CommitteeMembers[] = [];
  committeeMembersList: CommitteeMembers[] = [];
  to_RqstVndrs: any = [];
  to_VndrChkLst = CheckList;
  TypeOfPurchase = PurchaseType;
  Tenderingresult = EnvType;
  ReadOCOM_to_RqstMbrs: any = [];
  Status: any;
  CommitteeID: any;
  CommitteeName: any;
  LogdInUsrID: any;
  bidsapproved: boolean = false;
  isMomdisabled: boolean = false;
  isCoodisabled: boolean = true;
  pendingreview: boolean = false;
  isMembercheck: boolean = false;
  isbackupmembercheck: boolean = false;
  isDisabledDate: boolean = true;
  isDisabledVendors: boolean = false;
  isDisabledPrice: boolean = false;
  isFinancialoffer: boolean = false;
  showComments: boolean = false;
  showAddComments: boolean = false;
  showCommentsT: boolean = false;
  showAddCommentsT: boolean = false;
  Vcmt: any;
  Tcmt: any;
  savedVendor: boolean = false;
  selectedStatus: any = [];
  commentsArray: any = [];
  selectedVendor: any;
  bidOpenData: any;
  userHead: string = '';
  committeeUserName: any = [];
  committeeBackupUserName: any = [];
  inviteVendorsList: any = [];
  approvedConfirmation: boolean = false
  actionButtons!: actionButtonDetails[];
  checklistCheckerArray: { [vendorKey: string]: { [key: string]: boolean }[] } =
    {};

  @Output()
  paramsForDocHandle = new EventEmitter();

  processedData: any;

  otp: any;
  getOTPModel: boolean = false;
  dateFormat = 'yyyy/MM/dd';
  today = new Date();
  public disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;

  public disabledDateBasedOnOpeningDate = (
    currentDate: Date | null
  ): boolean => {
    const openingDate = this.bidopeningCommitteeForm.get('openingDate')?.value;

    // Ensure openingDate exists and is a valid date
    if (!openingDate) {
      return false; // Allow all dates if no opening date is selected
    }

    const openingDateObj = new Date(openingDate); // Convert to Date object if necessary
    return currentDate
      ? currentDate.getTime() < openingDateObj.getTime()
      : false;
  };

  public futureDateDisable = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(this.today, current) < 0;

  public disabledFutureDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(
      current,
      new Date(this.bidopeningCommitteeForm.controls['openingDate'].value)
    ) > 0;
  result: any;

  isDisableSubmitQuotationDate = true;

  private readonly destroy$ = new Subject<void>();

  competitionTypes: any[] = [];
  otherCommitteeAttachments: any[] = [];
  fileNetList: any[] = [];
  onbehalfuser: any[] = [];
  cmtofficer: any = [];

  openSecretarySelectionFinancialOfferOpening: boolean = false;
  officerDetails: any[] = [];
  TenderStatus = '';
  showVendorstoChairman: boolean = false;
  buttonActionKeysthatRequiresOTP: string[] = [];

  countryList: Country[] = [];
  vendorDetails: VendorPayload[] = [];

  constructor(
    public cs: CommonService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private modal: NzModalService,
    private api: ApiService,
    public commonService: CommonService,
    private formDataService: PassFormDataService,
    private cd: ChangeDetectorRef,
    private bocs: BidOpeningCommitteeService
  ) {
    this.data = this.formDataService.getData();
    console.log(this.data, 'tender details');

    if (
      this.data &&
      this.data.TndrTypeDesc &&
      this.data.TndrTypeDesc === 'Two Envelope' &&
      this.data.WFCmtMnuAction !== 'BFNC'
    ) {
      this.isDisabledPrice = true;
    }
    this.CommitteeID = localStorage.getItem('CMTID');
    this.role = this.commonService.getUserRoleBasedOnCmtID(this.CommitteeID);
    // console.log('current user role', this.role, this.data.WFCmtMnuAction);
    if (this.role === 'OF') {
      this.isCoodisabled = false;
    }
    if (this.data && this.data.WFCmtMnuAction == 'BFNC') {
      this.isDisabledVendors = true;
      this.isFinancialoffer = true;
      // this.isMomdisabled = true;
      this.isDisabledPrice = false;
      this.isCoodisabled = this.role === `CH` || this.role === 'OF';
    }
    if (this.data && this.data.WFCmtMnuAction == 'BAPR') {
      this.bidsapproved = true;
      // this.isMomdisabled = false;
      this.isDisabledVendors = true;
      this.isDisabledPrice = true;
    }
    if (this.data && this.data.WFCmtMnuAction == 'BPRV') {
      this.pendingreview = true;
    }
    // this.bidsapproved =this.data.WFCmtMnuAction;
    if (
      this.data &&
      this.role === 'CH' &&
      this.data.WFCmtMnuAction !== 'BAPR' &&
      this.data.WFCmtMnuAction !== 'BFNC'
    ) {
      this.isDisabledVendors = true;
      this.isDisabledPrice = true;
      this.isChaiman = true;
    } else if (this.role === 'OF' || this.pendingreview == true) {
      this.isOfficer = true;

      if (this.data.WFCmtMnuAction !== 'BFNC') {
        this.isDisableSubmitQuotationDate = false;
        this.isDisabledDate = false;
        this.isMomdisabled = false;
      }
    } else if (this.role === 'MR') {
      this.isMember = true;
      this.isDisabledVendors = true;
      this.isDisabledPrice = true;
    } else if (this.role == 'CH' && this.data.WFCmtMnuAction == 'BAPR') {
      this.isChaimanReturn = true;
    }

    // console.log(this.data.EtmdSubDate, 'EtmdSubDate');
    this.bidopeningCommitteeForm = this.fb.group({
      membercheck: new FormControl(false),
      backupmembercheck: new FormControl(false),
      TenderName: new FormControl({
        value: this.data?.TndrName,
        disabled: true,
      }),
      CommitteeHead: new FormControl({ value: '', disabled: true }),
      ChairmanCmnts: new FormControl({ value: '', disabled: true }),
      committeeHeadMembers: new FormControl(''),
      openingDate: new FormControl({
        value: '',
        disabled: this.isDisabledDate,
      }),
      FinanceOfferOpeningDate: new FormControl({
        value: '',
        disabled: this.isDisabledDate,
      }),
      ReferenceNumber: new FormControl({
        value: this.data.PurReqNo,
        disabled: true,
      }),
      Comments: new FormControl(
        '',
        this.isChaiman ? Validators.required : null
      ),
      typeOfPurchase: new FormControl({
        value: this.data.PurTypID,
        disabled: true,
      }),
      typeOfTendering: new FormControl({
        value: this.data.TndrTypeID,
        disabled: true,
      }),
      Etimadnumber: new FormControl({
        value: this.data.EtimadNo,
        disabled: true,
      }),
      EtmdSubDate: new FormControl({
        value: '',
        disabled: true,
      }),
      noVenders: new FormControl({
        value: '',
        disabled: true,
      }),
      listOfVendors: new FormControl([]),
      Department: new FormControl({
        value: this.data.DepText,
        disabled: true,
      }),
      SubmissionDate: new FormControl({
        value: '',
        disabled: this.isDisableSubmitQuotationDate,
      }),
      NoOfVndrs: new FormControl({
        value: Number(this.data.Noofvndrs),
        disabled: false,
      }),
      NoOfByres: new FormControl({
        value: Number(this.data.Noofbyres),
        disabled: false,
      }),
      CompetitionTypeID: new FormControl({
        value: this.data.CompetitionTypeID,
        disabled: true,
      }),
      NumberofVenders: new FormControl({ value: '', disabled: true }),
      // * Formation Number and Date
      CmtFrmtnOrdrNo: new FormControl(
        { value: this.data?.CmtFrmtnOrdrNo, disabled: true },
        Validators.required
      ),
      CmtFrmtnOrdrDate: new FormControl(
        { value: this.data?.CmtFrmtnOrdrDate, disabled: true },
        Validators.required
      ),
      // Vender:new FormControl('', [Validators.required]),
      addVender: this.fb.array([this.createVender()]),
      vendorInvitationsSent: this.fb.array([]),
      Attachments: this.fb.array([])
    });

    this.attList = this.bidopeningCommitteeForm.get('Attachments') as FormArray;

    if (this.isOfficer) {
      this.bidopeningCommitteeForm
        .get('CompetitionTypeID')
        ?.addValidators([Validators.required]);
      this.bidopeningCommitteeForm
        .get('openingDate')
        ?.addValidators([Validators.required]);
      this.bidopeningCommitteeForm
        .get('SubmissionDate')
        ?.addValidators([Validators.required]);
      this.createVendorInvitationsSent(true);
    } else {
      this.createVendorInvitationsSent(false);
    }
  }
  private vendorIdToAddComment = ``;

  get isVendorDetailsRequired(): boolean {
    return this.isOfficer && !this.isDisabledPrice && this.isOneEnevlope
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  get isNotOneEnvelope() {
    return this.bidopeningCommitteeForm.get('typeOfTendering')?.value != '01';
  }

  public get isCommercialNumberRequired(): boolean {
    return (
      this.data.TndrTypeID === '01' ||
      (this.data.TndrTypeID === '02' && this.isFinancialoffer)
    );
  }

  public get isOneEnevlope(): boolean {
    return this.data.TndrTypeID === '01';
  }

  ngDoCheck() {
    this.userHead =
      this.commonService.userLanguage === 'en'
        ? this.cmtHead?.[0].CommitteeUserName
        : this.cmtHead[0].CommitteeUserName_AR;
    this.bidopeningCommitteeForm.controls['CommitteeHead'].setValue(
      this.userHead
    );
    this.bidopeningCommitteeForm.controls['CommitteeHead']
      .updateValueAndValidity;
  }

  ngOnInit() {
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID');
    let cmtid = {
      Id: this.CommitteeID,
      TndrId: this.data.TndrID,
    };
    this.vendorList = this.bidopeningCommitteeForm.get(
      'addVender'
    ) as FormArray;

    this.spinner.show();

    // * Call master data member list
    this.api
      .post('/F4_MEMBERS', cmtid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.spinner.hide();

          this.cmtHead = res.d.results.filter((el: any) => {
            if (el.CommitteeRole === 'CH') {
              return el;
            }
          });

          let memberList = res.d.results.filter((el: any) => {
            if (el.CommitteeRole === 'MR') {
              return el;
            }
          });

          this.cmtofficer = res.d.results.filter((el: any) => {
            if (el.CommitteeRole === 'OF') {
              return el;
            }
          });

          // * Taking member list as committee member for chairman
          if (
            this.role === 'CH' &&
            this.data.WFCmtMnuAction !== 'BFNC' &&
            this.data.WFCmtMnuAction !== 'BAPR'
          ) {
            this.listOfmemberData = memberList;
            console.log(this.listOfmemberData, 'this.listOfmemberData');
          }

          // * For bidsapprove, Officer, member, financial offer logic
          if (
            this.role === 'CH' ||
            this.bidsapproved == true ||
            this.role === 'OF' ||
            this.role === 'MR' ||
            this.pendingreview == true ||
            this.data.WFCmtMnuAction == 'BFNC'
          ) {
            let postData = { TenderId: this.data.TndrID };

            // * Tender details based on tenderID for OF, MR, bidstobeapproved role
            this.spinner.show();
            this.api
              .post('/OCOM_TENDER_DETAILS', postData)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (res) => {
                  this.spinner.hide();

                  let selectedvendors: any;
                  this.TenderStatus = res.d.results[0].TndrStatus;
                  // console.log(
                  //   'res.d.results[0].ChairmanCmnts',
                  //   res.d.results[0].ChairmanCmnts
                  // );
                  this.bidopeningCommitteeForm.controls[
                    'ChairmanCmnts'
                  ].setValue(res.d.results[0].ChairmanCmnts);
                  if (this.isChaiman) {
                    this.bidopeningCommitteeForm.controls[
                      'ChairmanCmnts'
                    ].enable();
                  } else {
                    this.bidopeningCommitteeForm.controls[
                      'ChairmanCmnts'
                    ].disable();
                  }

                  if (res.d.results[0].TndrStatus === `R`) {
                    this.bidopeningCommitteeForm
                      .get(`ChairmanCmnts`)
                      ?.patchValue(res.d.results[0].ChairmanCmnts);
                  }

                  // * Committee Formation Order Number and Date
                  this.bidopeningCommitteeForm.controls[
                    'CmtFrmtnOrdrNo'
                  ].setValue(res.d.results[0].CmtFrmtnOrdrNo);
                  this.bidopeningCommitteeForm.controls[
                    'CmtFrmtnOrdrDate'
                  ].setValue(
                    this.cs.getDate(res.d.results[0].CmtFrmtnOrdrDate)
                  );

                  if (res.d.results.length > 0) {
                    this.bidOpenData = res.d.results;
                    this.result = res.d.results;

                    this.setActionsinActionButtons(
                      res.d.results[0].to_Button.results
                    );

                    this.ReadOCOM_to_RqstMbrs =
                      this.result[0].to_RqstMbrs.results;

                    if (
                      this.isCrNumberDisabled &&
                      this.bidOpenData?.[0]?.FinancialOffer === 'X'
                    ) {
                      this.VendorFormGroup.controls.forEach((control) => {
                        control.get('VendorCommercialNo')?.disable();
                      });
                    }

                    this.committeeMembersList =
                      this.transformMembers(memberList);

                    if (this.ReadOCOM_to_RqstMbrs.length === 0) {
                      // * Committee member logic
                      // console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');
                      this.to_RqstMbrs = this.committeeMembersList.filter(
                        (member: CommitteeMembers) => member.isChecked === true
                      );
                    } else {
                      // console.log(this.to_RqstMbrs, 'this.to_RqstMbrs');
                      this.committeeMembersList.forEach((existingMember) => {
                        // Check if the current existing member's CommitteeUser exists in the incoming members
                        existingMember.isChecked =
                          this.ReadOCOM_to_RqstMbrs.some(
                            (incomingMember: CommitteeMembers) =>
                              incomingMember.CommitteeUser ===
                              existingMember.CommitteeUser
                          );
                      });
                      this.to_RqstMbrs = this.committeeMembersList.filter(
                        (member: CommitteeMembers) => member.isChecked === true
                      );
                    }

                    // * Vendor List
                    if (this.result[0].FinancialOffer === 'X') {
                      selectedvendors =
                        this.result[0].to_RqstVndrs.results.filter(
                          (vendor: any) => {
                            return vendor.VndrTnclEvalScore === 'Pass';
                          }
                        );
                    } else {
                      selectedvendors = this.result[0].to_RqstVndrs.results;
                    }

                    for (
                      let index = 1;
                      index < selectedvendors.length;
                      index++
                    ) {
                      this.vendorList?.push(this.createVender(true));
                      console.log(this.vendorList?.getRawValue());
                    }

                    selectedvendors = selectedvendors.map((vendor: any) => {
                      vendor.VendorCommercialNo =
                        parseInt(vendor.VendorCommercialNo) === 0
                          ? ''
                          : vendor.VendorCommercialNo;
                      return vendor;
                    });
                    console.log(selectedvendors, 'selectedvendors');
                    // * Set vendor array data
                    if (selectedvendors.length > 0) {
                      this.vendorlistname = selectedvendors;
                      this.bidopeningCommitteeForm.controls[
                        'addVender'
                      ].patchValue(selectedvendors);
                      this.bidopeningCommitteeForm.controls[
                        'noVenders'
                      ].setValue(selectedvendors.length.toString());
                      if (this.isVendorDetailsRequired) {
                        selectedvendors.forEach((vendor: any, index: number) => {
                          this.api.get(`vendor-details?crnumber=${vendor.VendorCommercialNo}`).subscribe(
                            (res) => {
                              console.log(this.vendorList?.controls)
                              this.vendorList?.controls[index].get('Street')?.patchValue(res[0].Street);
                              this.vendorList?.controls[index].get('BuildingNo')?.patchValue(res[0].BuildingNo);
                              this.vendorList?.controls[index].get('ZipCode')?.patchValue(res[0].ZipCode);
                              this.vendorList?.controls[index].get('City')?.patchValue(res[0].City);
                              this.vendorList?.controls[index].get('CountryId')?.patchValue(res[0].CountryId);
                              this.vendorList?.controls[index].get('PhoneNo')?.patchValue(res[0].PhoneNo);
                              this.vendorList?.controls[index].get('Email')?.patchValue(res[0].Email);
                            },
                            (err) => {
                              console.log(err);
                              this.cs.createMessage('error', err.statusText);
                            }
                          )
                        })
                      }
                    } else {
                      if (this.role === 'OF') {
                        this.populateCheckListData(this.to_VndrChkLst, 0);
                      }
                    }
                    this.initializeChecklistChecker(selectedvendors);
                    // * Set comments, mom, checklist
                    for (let i = 0; i < selectedvendors.length; i++) {
                      selectedvendors[i].to_VndrChkLst.results.forEach(
                        (element: any) => {
                          delete element.__metadata;
                          delete element.ChklstTypeDesc;
                        }
                      );
                      this.populateCheckListData(
                        selectedvendors[i].to_VndrChkLst.results,
                        i
                      );
                    }

                    // * If the API Financial Offer is true enable Financial Offer comments and disable Committee comments
                    if (this.bidOpenData[0].FinancialOffer === 'X') {
                      const addVenderArray = this.bidopeningCommitteeForm
                        .controls['addVender'] as FormArray;
                      addVenderArray.controls.forEach((control) => {
                        control.get('MOMDts')?.disable();
                        control.get('ContentOffer')?.disable();
                        control.get('AttachmentCmnts')?.disable();

                        // if (this.role === 'CH' || this.role === 'OF') {
                        //   control.get('FinancialOfferCmnts')?.enable();
                        // }
                      });
                    }

                    // * Set competetion type value
                    if (
                      this.result[0].CompetitionTypeID &&
                      this.result[0].CompetitionTypeID !== '00'
                    ) {
                      this.bidopeningCommitteeForm
                        .get('CompetitionTypeID')
                        ?.setValue(this.result[0].CompetitionTypeID);
                    }

                    // * Set bid opening date
                    if (this.result[0].BidOpngDate) {
                      this.bidopeningCommitteeForm
                        .get('openingDate')
                        ?.setValue(
                          moment(
                            this.result[0].BidOpngDate,
                            'YYYYMMDD'
                          ).toISOString()
                        );
                    }
                    if (this.result[0].FinanceOfferOpeningDate) {
                      this.bidopeningCommitteeForm
                        .get('FinanceOfferOpeningDate')
                        ?.setValue(
                          moment(
                            this.result[0].FinanceOfferOpeningDate,
                            'YYYYMMDD'
                          ).toISOString()
                        );
                    }

                    // * Set quotation submission date
                    if (this.result[0].SubmissionDate) {
                      this.bidopeningCommitteeForm
                        .get('SubmissionDate')
                        ?.setValue(
                          moment(
                            this.result[0].SubmissionDate,
                            'YYYYMMDD'
                          ).toISOString()
                        );
                    }
                    console.log(
                      moment(
                        this.result[0].EtmdSubDate,
                        'YYYYMMDD'
                      ).toISOString()
                    );
                    if (this.result[0].EtmdSubDate) {
                      this.bidopeningCommitteeForm
                        .get('EtmdSubDate')
                        ?.setValue(
                          moment(
                            this.result[0].EtmdSubDate,
                            'YYYYMMDD'
                          ).toISOString()
                        );
                    }

                    if (
                      this.result[0].to_LmtdVndrs &&
                      this.result[0].to_LmtdVndrs.results &&
                      this.result[0].to_LmtdVndrs.results.length > 0
                    ) {
                      const limitedVendorsControl =
                        this.bidopeningCommitteeForm.get(
                          'vendorInvitationsSent'
                        ) as FormArray;

                      this.result[0].to_LmtdVndrs.results.forEach(
                        (limitedVendor: any, key: number) => {
                          let form = limitedVendorsControl.at(key);
                          if (form === undefined) {
                            this.addNewInvitationSent();
                            form = limitedVendorsControl.at(key);
                          }
                          form
                            .get('LmtdVendorId')
                            ?.setValue(limitedVendor.LmtdVendorId);
                          form
                            .get('TenderId')
                            ?.setValue(limitedVendor.TenderId);
                          form
                            .get('LmtdVendorName')
                            ?.setValue(limitedVendor.LmtdVendorName);
                          this.inviteVendorsList.push(
                            limitedVendor.LmtdVendorName
                          );
                        }
                      );
                    }

                    if (this.result[0].to_Attach) {
                      const { committeeFiles, notCommitteeFiles } =
                        this.result[0].to_Attach.results.reduce(
                          (acc: any, node: any) => {
                            if (node.FilenetID && node.FileName) {
                              if (this.CommitteeID === node.CommitteeId) {
                                acc.committeeFiles.push(node);
                              } else {
                                acc.notCommitteeFiles.push(node);
                              }
                            }
                            return acc;
                          },
                          { committeeFiles: [], notCommitteeFiles: [] }
                        );
                      this.fileNetList = [...committeeFiles];
                      this.otherCommitteeAttachments = [...notCommitteeFiles];
                    }
                  }
                },
                () => {
                  this.spinner.hide();
                }
              );
          } else {
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );

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

    this.getCompetitionTypes();
    this.getAssignableSecretaries();
    this.getCountryList();

    // console.log('this.vendorList?.value', this.vendorList?.value);
  }

  getCountryList(): void {
    this.api.post("getCountryList", {}).subscribe(
      (res) => {
        this.countryList = res.d.results;
      },
      (err) => {
        this.cs.createMessage('error', err.statusText);
      }
    )
  }

  getAssignableSecretaries() {
    let cmtid = {
      Id: this.CommitteeID,
      TndrId: this.bidOpenData?.TndrID,
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

  getCompetitionTypes() {
    this.spinner.show();
    this.api
      .post('F4_CMPTN_TYPE', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.d.results.length > 0) {
            this.competitionTypes = res.d.results;
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  getTenderCmt() {
    // this.spinner.show();
    // let dt = {
    //   TenderId: this.data.TndrID,
    //   CommitteeId: "01",
    //   CommitteeRole: 'CH',
    //   VendorId: '',
    // };
    // this.api.post('/GET_TND_CMTS', dt).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    // //  console.log(res.d.results);
    //   this.bidopeningCommitteeForm.controls['CommitteeHeadComments'].setValue(
    //     res.d.results[0] ? res.d.results[0].Comments : ''
    //   );
    //   this.spinner.hide();
    // });
    // this.spinner.hide();
  }
  SelectedvendorId: any;
  SelectedcheckListId: any;
  IsAttachmentModel: any = false;

  getAttachFormGroup(testParams: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeIds(testParams);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    this.paramsForDocHandle.emit(docParamsFromType);
    return attachFG;
  }
  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //normal, table
      displayMode: _l.get(_paramsForUpdate, 'editable', '') ? 'edit' : 'view',
      forceRefreshDocParams: false,
      docParams: {
        HeaderKey: 'P2PCommitte',
        ItemKey: 'VendorEval',
        EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
        EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
        RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
        RelatedEntityId: _l.get(_paramsForUpdate, 'VendorGUID', ''),
        DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
        DocName: '',
        FileNetId: '',
        Origin: 'P2P',
        UploadedBy: '',
        UploadedOn: '',
        MimeDocType: 'text/xml',
        Operation: _l.get(_paramsForUpdate, 'operation', ''), // C or D
        GuiId: '',
        ContentSize: 0,
      },
    };
    return docParams;
  }

  onFileUpload(_event: any, _doc: any) {
    console.log(_event, _doc, 'Attachment upload res');
    if (_event && _event.hasOwnProperty('checkListID')) {
      console.log('checkListID found:', _event.checkListID);

      // Execute the function since checkListID exists
      let adjustCheckListID = Number(_event.checkListID - 1);
      setTimeout(() => {
        this.isAttachmentPresent(
          this.SelectedvendorId,
          String(adjustCheckListID)
        );
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

  testFnParams(test_vn: any, testParams: any) {
    let vendorComnumber =
      this.vendorList?.controls[test_vn].get('VendorCommercialNo')?.value;
    let vendorGUID =
      this.vendorList?.controls[test_vn].get('VendorGUID')?.value;
    const vendorChecklist = this.vendorList?.controls[test_vn].get(
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
    const currTenderId = _l.get(this.data, 'TndrID', '');
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

  stringToDate() {
    return this.commonService.getDa(this.data?.BidOpngDate);
  }

  get VendorFormGroup() {
    return this.bidopeningCommitteeForm.get('addVender') as FormArray;
  }
  //add vendors
  addveders(i: number) {
    let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    let index = vendorDetails.length - 1;

    this.sl = parseInt(vendorDetails[index].VendorId) + 1;
    this.vendorList?.push(this.createVender());
    //console.log('this.vendorList?.value', this.vendorList?.value);
    this.populateCheckListData(
      this.to_VndrChkLst,
      Number(this.vendorList?.length) - 1
    );
    this.initializeChecklistChecker(this.vendorList?.value);
    this.selectedVendors[i] = this.vendorList?.value[i].VendorName;
    console.log(this.selectedVendors);
  }

  get VendorInvitationsSent() {
    return this.bidopeningCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
  }

  vendorInvitationItem(isRequired: boolean): FormGroup {
    let validators = [];
    isRequired ? validators.push(Validators.required) : null;
    return this.fb.group({
      TenderId: '',
      LmtdVendorId: '',
      // WIP US 73004 LmtdVendorName: [{ value: '', disabled: true}, validators],
      LmtdVendorName: [
        {
          value: '',
          disabled:
            this.role === 'MR' || this.bidsapproved || this.isFinancialoffer || this.role === 'CH',
        },
        validators,
      ],
    });
  }

  createVendorInvitationsSent(isRequired: boolean): FormGroup {
    return this.vendorInvitationItem(isRequired);
  }

  addNewInvitationSent() {
    const control = this.bidopeningCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
    control.push(this.vendorInvitationItem(true));
  }

  vendorToRemove: { i: number; index: number } | null = null;
  deleteInviationVendor(index: number) {
    const i = this.VendorFormGroup.controls.findIndex(
      (obj) => obj.value.VendorName === this.inviteVendorsList[index]
    );
    if(i > -1){
      this.approvedConfirmation = true
      this.vendorToRemove = { i, index };

      // this.removeVendorDetailsOnvendorDeletedFromInviteList(i)
      // this.removeVendorNameOnvendorDeletedFromInviteList(index)
      return
    }
    this.removeVendorNameOnvendorDeletedFromInviteList(index)
    
  }
  onVendorDeleteConfirmation(){
    if (this.vendorToRemove) {
      const { i, index } = this.vendorToRemove;
      this.removeVendorDetailsOnvendorDeletedFromInviteList(i);
      this.removeVendorNameOnvendorDeletedFromInviteList(index);
    }
    this.approvedConfirmation = false;
    this.vendorToRemove = null;
  }
  showHideApprove(){
    this.approvedConfirmation = !this.approvedConfirmation
    this.vendorToRemove = null;
  }
  removeVendorNameOnvendorDeletedFromInviteList(vendorIndex: number) {
    const control = this.bidopeningCommitteeForm.get(
      'vendorInvitationsSent'
    ) as FormArray;
    control.removeAt(vendorIndex);
    if (this.inviteVendorsList[vendorIndex]) {
      this.inviteVendorsList = this.inviteVendorsList.filter(
        (item: any) => item != this.inviteVendorsList[vendorIndex]
      );
    }
  }

  removeVendorDetailsOnvendorDeletedFromInviteList(vendorIndex: number) {
    const vendorFormArray = this.VendorFormGroup;
  
    if (vendorFormArray.length === 1) {
      // Only one vendor group — reset the values
      const vendorGroup = vendorFormArray.at(vendorIndex) as FormGroup;
  
      // Reset all controls in vendorGroup except 'CheckList'
      Object.keys(vendorGroup.controls).forEach(key => {
        if (key !== 'CheckList') {
          vendorGroup.get(key)?.reset();
        }
      });
  
      // Update only specific keys inside each CheckList FormGroup
      const checklistArray = vendorGroup.get('CheckList') as FormArray;
  
      checklistArray.controls.forEach(ctrl => {
        const group = ctrl as FormGroup;
  
        group.get('ChecklistType')?.setValue(this.Status[0].ChklstTypeID);
        group.get('VendorId')?.setValue(null);
        group.get('TenderId')?.setValue(null);
        group.get('AttachmentFlag')?.setValue(false);
        group.get('IsAttachmentValid')?.setValue(false);
        // Leave all other fields as-is
      });
  
    } else {
      // More than one vendor group — remove the group
      vendorFormArray.removeAt(vendorIndex);
    }
  }
  

  // remove vendor from group
  removeVendor(index: any, vendor: any) {
    //  console.log(this.vendorList?.value[index].VendorCommercialNo);
    // let vnid = this.vendorlistname.filter((ele: any) => {
    //   if (
    //     ele.VendorCommercialNo ===
    //     this.vendorList?.value[index].VendorCommercialNo
    //   ) {
    //     return ele.VendorId;
    //   }
    // });
    // console.log('vnid', vnid);
    const VendorId = vendor.controls.VendorId.value;
    let data = {
      CommitteeId: this.CommitteeID,
      TenderId: this.data.TndrID,
      VendorId,
    };
    if (data) {
      this.spinner.show();
      this.api
        .post('deleteVendors', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            console.log(res);
            if (res === null) {
              this.sl--;
              this.vendorList?.removeAt(index);

              // below code block reset the serial number of vendor after deleting a vendor.
              if (this?.vendorList?.controls?.length) {
                for (
                  let counter = 0;
                  counter < this.vendorList.length;
                  counter++
                ) {
                  const control = this.vendorList.controls[counter];
                  if (control) {
                    control.get(`VendorId`)?.patchValue(`00${counter + 1}`);
                  }
                }
              }
              console.log('this.vendorList?.value', this.vendorList?.value);
              // above code block reset the serial number of vendor after deleting a vendor.
            } else {
              this.commonService.createMessage('error', res.d.MessageEn);
            }
          },
          (error) => {
            console.log(error);
            this.commonService.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );
    }
  }
  // checkList group method
  checkListFormGroups(i: number) {
    return this.VendorFormGroup.controls[i].get('CheckList') as FormArray;
  }
  //attachment group method
  attachmentFormGroupl() {}

  // create vendor method
  createVender(val?: boolean): any {
    if (!val) {
      this.spinner.show();
      this.api.get('getvendorGUID').subscribe(
        (res) => {
          this.spinner.hide();
          // return this.createNewVendor(res.d.results[0].GUID);
          let control: any = this.bidopeningCommitteeForm.get('addVender');
          if (control) {
            control.controls[control.controls.length - 1].controls[
              'VendorGUID'
            ].patchValue(res.d.results[0].GUID);
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
      return this.createNewVendor();
    } else {
      return this.createNewVendor();
    }
  }

  createNewVendor(vendorID?: any): FormGroup {
    let itno = this.sl++;
    console.log(this.isVendorDetailsRequired);
    return this.fb.group({
      VendorName: [{ value: '', disabled: this.isDisabledVendors }],
      VendorId: [{ value: itno.toString(), disabled: true }],
      VendorCommercialNo: [{ value: '', disabled: this.isCrNumberDisabled }],
      Price: [{ value: '', disabled: this.isDisabledPrice }],
      CheckList: this.fb.array([]),
      Comments: [{ value: '', disabled: this.isFinancialoffer }],
      MOMDts: [{ value: '', disabled: this.isMomdisabled }],
      ContentOffer: [{ value: '', disabled: this.isCoodisabled }],
      FinancialOfferCmnts: [{ value: '', disabled: false }],
      AttachmentCmnts: [{ value: '', disabled: this.isCoodisabled }],
      InitialGuranteeValue: [{ value: '', disabled: this.isDisabledPrice }],
      VendorGUID: [
        {
          value: vendorID ? vendorID.toString() : '',
          disabled: this.isCoodisabled,
        },
      ],
      Street: new FormControl(''),
      BuildingNo: new FormControl(''),
      ZipCode: this.isVendorDetailsRequired ? new FormControl('', [Validators.required, Validators.minLength(5)]) : 
        new FormControl(''),
      City:  this.isVendorDetailsRequired ? new FormControl('', [Validators.required]) : new FormControl(''),
      CountryId: this.isVendorDetailsRequired ? new FormControl('', [Validators.required]) : new FormControl(''),
      PhoneNo: this.isVendorDetailsRequired ? new FormControl('', [Validators.required, Validators.minLength(10)]) : 
        new FormControl(''),
      Email: this.isVendorDetailsRequired ? new FormControl('', [Validators.required, Validators.email]) : 
        new FormControl('')
    });
  }

  populateCheckListData(data: any[], i: number) {
    // console.log(data, i)
    data.forEach((ele) => {
      let controls = this.VendorFormGroup.controls[i].get(
        'CheckList'
      ) as FormArray;

      controls.push(this.fb.group(ele));
      (<FormArray>(
        this.VendorFormGroup.controls[i].get('CheckList')
      )).controls.forEach((ele: any) => {
        // console.log(ele, 'checklist ele')
        if (ele.get('ChecklistType').value === '') {
          ele.get('ChecklistType').patchValue(this.Status[0].ChklstTypeID);
        }
        let checkListId = ele.get('ChecklistId').value;
        // console.log(i, checkListId)
        if (ele.get('IsAttachmentValid').value === 'Y') {
          ele.get('IsAttachmentValid').patchValue(false);
          this.updateChecklistChecker(
            Number(i),
            Number(checkListId - 1),
            false
          );
        } else if (ele.get('IsAttachmentValid').value === 'N') {
          ele.get('IsAttachmentValid').patchValue(true);
          this.updateChecklistChecker(Number(i), Number(checkListId - 1), true);
        }
      });

      // * Check List Controls Array Iteration
      (<FormArray>(
        this.VendorFormGroup.controls[i].get('CheckList')
      )).controls.forEach((control) => {
        // * Disable if not Secretary
        if (this.role !== 'OF') {
          control.disable();
          return;
        }
        // * Selected Menu - Bids to be Opened
        if (
          this.data.WFCmtMnuAction === 'BOPN' ||
          this.data.WFCmtMnuAction === 'BFNC'
        ) {
          // * If Two Envelope And CheckList is Finanical Offer ( Check List Id is '1') and Financial Offer is not selected
          const isTwoEnvelope = Number(this.data.TndrTypeID) === 2;
          const isFinancialOfferNotSelected =
            this.bidOpenData?.[0]?.FinancialOffer === '';
          const checklistIdtodisableForTechnicalOfferBankGuarantee = [
            1, 4,
          ].includes(Number(control.value.ChecklistId));

          const checklistIdtodisableForFinancialOffer = [2].includes(
            Number(control.value.ChecklistId)
          );

          if (
            isTwoEnvelope &&
            checklistIdtodisableForTechnicalOfferBankGuarantee &&
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

        // // * Selected Menu - Bids for financial Offer
        // if (this.data.WFCmtMnuAction === 'BFNC') {
        //   // * If Two Envelope And CheckList all are enabled
        //   if (Number(this.data.TndrTypeID) === 2) {
        //     control.enable();
        //     return;
        //   }
        //   control.disable();
        //   return;
        // }

        // * Selected Menu - Bids to be approved
        if (this.data.WFCmtMnuAction === 'BPRV') {
          // * If Two Envelope
          if (Number(this.data.TndrTypeID) === 2) {
            // * If Not Financial Offer
            if (this.result[0]?.FinancialOffer !== 'X') {
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

  roleSubmit() {
    console.log('submitted');
  }
  showHideCommentsclose() {
    this.showComments = false;
    this.showCommentsT = false;
  }
  showHideAddCommentsclose() {
    this.showAddComments = false;
    this.showAddCommentsT = false;
  }
  showHideAddComments(index: any, details: any) {
    this.vendorIdToAddComment = details.controls.VendorId.value;
    const vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    if (!vendorDetails.every((vendor: any) => vendor.VendorName.trim())) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Fill vendor name to add a comment'
          : `املأ اسم البائع لإضافة تعليق`
      );
      this.showAddComments = false;
      return;
    }

    this.Vcmt = '';
    if (this.isFinancialoffer) {
      this.selectedVendor = details.controls.VendorId.value;
      this.savedVendor = true;
    } else if (index !== '') {
      let vnid;
      if (this.role === 'OF') {
        vnid = this.vendorlistname.filter((ele: any) => {
          if (
            ele.VendorCommercialNo &&
            ele.VendorCommercialNo ===
              this.vendorList?.value[index].VendorCommercialNo
          ) {
            return ele.VendorId;
          }
        });
      } else {
        vnid = this.vendorlistname.filter((ele: any, ind: number) => {
          if (ind === index) {
            return ele;
          }
        });
      }
      vnid.length > 0
        ? ((this.savedVendor = true), (this.selectedVendor = vnid[0].VendorId))
        : ((this.savedVendor = false),
          (this.selectedVendor =
            this.role === 'OF'
              ? this.vendorList?.value[index].VendorCommercialNo
                ? this.vendorList?.value[index].VendorCommercialNo.toString()
                : ''
              : this.vendorList?.value[index].VendorCommercialNo));
    }
    if (this.selectedVendor === '') {
      this.selectedVendor = `00${index + 1}`;
    }
    this.showAddComments = !this.showAddComments;
    console.log('this.vendorList?.value', this.vendorList?.value);
  }

  addComments(comments: any, selectedVenderStatus: any, vnID: any) {
    this.VendorRequiredField = [];

    if (this.bidopeningCommitteeForm.getRawValue().addVender.length > 0) {
      let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
      vendorDetails.forEach((element: any) => {
        if (
          element.VendorName === '' ||
          // element.VendorCommercialNo === '' ||
          // element.VendorCommercialNo.toString().length != 10 ||
          (Number(element.Price) <= 0 && this.isDisabledPrice != true)
        ) {
          this.VendorRequiredField.length === 0
            ? this.VendorRequiredField.push({ status: true })
            : '';
        }
      });
      // if (this.VendorRequiredField.length > 0 && this.isDisabledPrice != true) {
      //   this.commonService.createMessage(
      //     'error',
      //     this.commonService.userLanguage === 'en'
      //       ? 'Vendors Name , Commercial Number, price are required fields, Commercial Number must be 10 digit only'
      //       : 'اسم البائع ، الرقم التجاري ، السعر هي حقول مطلوبة ، يجب أن يتكون الرقم التجاري من 10 أرقام فقط'
      //   );
      //   this.showAddComments = !this.showAddComments;
      // } else
      if (this.VendorRequiredField.length > 0 && this.isDisabledPrice == true) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Vendor Name,Commercial Number are required fields, Commercial Number must be 10 digit only'
            : 'اسم البائع ، الرقم التجاري هي حقول مطلوبة ، يجب أن يتكون الرقم التجاري من 10 أرقام فقط'
        );
        this.showAddComments = !this.showAddComments;
      } else {
        if (selectedVenderStatus) {
          let cmtData = {
            CommitteeId: this.CommitteeID,
            CommitteeRole: this.role,
            TenderId: this.data.TndrID,
            VendorId: this.vendorIdToAddComment,
            CmntdMember: this.LogdInUsrID,
            Comments: comments,
          };
          this.showAddComments = !this.showAddComments;
          //  console.log('cmtData befor post comments for saved vendor', cmtData);
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
        } else {
          let cmtData = {
            CommitteeId: this.CommitteeID,
            TenderId: this.data.TndrID,
            VendorId: '',
            CmntdMember: this.LogdInUsrID,
            Comments: comments,
            CommitteeRole: this.role,
          };
          let vendorDetails =
            this.bidopeningCommitteeForm.getRawValue().addVender;
          // let vendorDetails = this.vendorList?.value;
          vendorDetails.forEach((element: any) => {
            //let checkListData = element.CheckList? element.CheckList: element.to_VndrChkLst
            element.CheckList.forEach((list: any, index: number) => {
              list.ChecklistId = (index + 1).toString();
              list.IsAttachmentValid =
                list.IsAttachmentValid === true ||
                list.IsAttachmentValid === 'N'
                  ? 'N'
                  : 'Y';
              list.AttachmentFlag =
                list.AttachmentFlag === true || list.AttachmentFlag === 'Y'
                  ? 'Y'
                  : 'N';
              list.TenderId = this.data.TndrID;
              list.VendorId = element.VendorId;
              list.CommitteeId = this.CommitteeID;
              // list.to_VndrChkAtt = [
              // ];
            });
            element.CommitteeId = this.CommitteeID;
            element.TenderId = this.data.TndrID;
            element.IsVndrfnclQualified = '';
            element.IsVndrtechQualified = '';
            element.MOMDts = element.MOMDts;
            element.ContentOffer = element.ContentOffer;
            element.AttachmentCmnts = element.AttachmentCmnts;
            element.VendorCommercialNo = element.VendorCommercialNo
              ? element.VendorCommercialNo.toString()
              : '';
            element.Price = element.Price.toString();
            element.to_VndrChkLst = element.CheckList;

            (element.to_VndrFnclEvl = []),
              (element.to_VndrTchnlEvl = []),
              (element.to_LeglEval = []),
              (element.to_TechEval = []);
            element.VndrTnclActualTotal = '';
            element.VndrFnclWgtgeTotal = '';
            element.VndrFnclActualTotal = '';
            element.VndrTnclWgtgeTotal = '';
            element.VndrTnclEvalScore = element.VndrTnclEvalScore
              ? element.VndrTnclEvalScore
              : '';

            delete element.CheckList;
            delete element.Comments;
          });

          let data: any = {
            TndrID: this.data.TndrID,
            TndrName: this.data.TndrName,
            RFPNumber: this.data.RFPNumber,
            PurReqNo: this.data.PurReqNo,
            PurTypID: this.data.PurTypID,
            PurTypeDesc: this.data.PurTypeDesc,
            TndrTypeID: this.data.TndrTypeID,
            TndrTypeDesc: this.data.TndrTypeDesc,
            EtimadNo: this.data.EtimadNo,
            TndrStatus: this.data.TndrStatus,
            CommitteeID: this.CommitteeID,
            CommitteeName: this.CommitteeName,
            CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
            CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
            CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
            CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
            CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
            CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
            CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
            CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
            AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
            AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
            AsgnQualCmtOfficerID: '',
            AsgnQualCmtOfficerName: '',
            AsgnEvalCmtOfficerID: '',
            AsgnEvalCmtOfficerName: '',
            TchnclEvltnMmbrID: '',
            TchnclEvltnMmbrName: '',
            CurrentDate: this.commonService.getCurrentDateInApiFormat(
              new Date()
            ),
            IsSingleTender: '',
            IsTenderCancelled: '',
            IsTenderUrgent: '',
            MsgType: '',
            MsgVar1: '',
            MsgVar2: '',
            LgdInUsr: this.LogdInUsrID,
            LgdInUsrCmt: this.CommitteeID,
            LgdInUsrCmtRole: this.role,
            LgdInUsrAction: 'DFT',
            to_RqstMbrs: this.prepareCommitteeMembersDataForPost(
              this.to_RqstMbrs
            ),
            to_RqstVndrs: vendorDetails,
            to_LmtdVndrs: this.getLimitedVendorsData(),
            to_Attach: this.combineOtherAttachmentsWithUpdated(),
          };

          if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
            data.BidOpngDate = moment(
              this.bidopeningCommitteeForm?.get('openingDate')?.value
            ).format('YYYYMMDD');
          }

          if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
            data.CompetitionTypeID =
              this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
          }

          if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
            data.SubmissionDate = moment(
              this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
            ).format('YYYYMMDD');
          }
          console.log(data, 'data to post while cmd');
          if (data) {
            this.spinner.show();
            this.api
              .post('Cmt_create', data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (res: any) => {
                  this.spinner.hide();
                  if (res.d.MsgType === 'S') {
                    res.d.to_RqstVndrs.results.forEach((element: any) => {
                      if (element.VendorCommercialNo === vnID) {
                        cmtData.VendorId = element.VendorId;
                      } else if (element.VendorId === vnID) {
                        cmtData.VendorId = element.VendorId;
                      }
                      // console.log(
                      //   'cmtData befor post comments for newly added vendor',
                      //   cmtData
                      // );
                    });
                    if (cmtData.VendorId) {
                      // post comments api called for newly added vendor
                      this.spinner.show();
                      this.api
                        .post('POST_CMTS', cmtData)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          (res: any) => {
                            if (res) {
                              this.spinner.hide();
                            } else {
                              this.spinner.hide();
                              this.commonService.createMessage(
                                'error',
                                res.d.MessageEn
                              );
                            }
                          },
                          (error) => {
                            // console.log(error);
                            this.commonService.createMessage(
                              'error',
                              error.statusText
                            );
                            this.spinner.hide();
                          }
                        );
                    }
                  } else {
                    this.spinner.hide();
                    this.commonService.createMessage('error', res.d.MessageEn);
                  }
                },
                (error) => {
                  // console.log(error);
                  this.commonService.createMessage('error', error.statusText);
                  this.spinner.hide();
                }
              );
            this.showAddComments = !this.showAddComments;
          }
        }
      }
    }
  }

  showHideAddCommentsT() {
    this.Tcmt = '';
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  addCommentsT(comments: any) {
    console.log(this.data);

    if (comments != '') {
      this.spinner.show();
      let cmtData = {
        CommitteeId: this.CommitteeID,
        CommitteeRole: this.data.WFCmtRole,
        TenderId: this.data.TndrID,
        VendorId: '0',
        CmntdMember: this.LogdInUsrID,
        Comments: comments,
      };
      //  console.log('cmtData befor post comments for saved vendor', cmtData);
      if (cmtData) {
        // this.spinner.show();
        // post comments api called for saved vendor
        this.spinner.show();
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

  showHideComments(index: any, VendorFormGroup: any) {
    const TenderId = this.data.TndrID;

    // Find list of all vendors for that tender.
    if (index !== '') {
      // find the vendor id from the list of all saved vendors whom comments has to be shown.
      this.selectedVendor = VendorFormGroup.controls.VendorId.value;
      this.getComments();
    } else {
      this.showComments = false;
    }
  }

  getComments() {
    this.spinner.show();
    let dt = {
      TenderId: this.data.TndrID,
      // "MemberId":this.userDetails.ID,
      VendorId: this.selectedVendor?.toString(),
      //  "role":this.role,
    };
    this.api
      .post('/GET_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          //  console.log(res.d.results);
          this.commentsArray = res.d.results;
          this.showComments = !this.showComments;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  showHideCommentsT() {
    this.getCommentsT();
    this.showCommentsT = true;
  }
  getCommentsT() {
    this.spinner.show();
    let dt = {
      CommitteeId: this.CommitteeID,
      TenderId: this.data.TndrID,
      VendorId: '0',
    };
    this.api
      .post('/GET_TND_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          //  console.log(res.d.results);
          this.commentsArray = res.d.results;
          // this.showComments = !this.showComments;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  changeStatus(venId: any, checkListID: any, status: any) {
    // console.log(venId)
    let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    console.log(status);
    if (
      (<FormArray>this.VendorFormGroup.controls[venId].get('CheckList'))
        .controls[checkListID].value.ChecklistType === '01' ||
      (<FormArray>this.VendorFormGroup.controls[venId].get('CheckList'))
        .controls[checkListID].value.ChecklistType === '02'
    ) {
      // ! Commented and setValue() used

      (<FormArray>(
        this.VendorFormGroup.controls[venId].get('CheckList')
      )).controls[checkListID]
        .get('IsAttachmentValid')
        ?.setValue(false);
    } else {
      (<FormArray>(
        this.VendorFormGroup.controls[venId].get('CheckList')
      )).controls[checkListID]
        .get('IsAttachmentValid')
        ?.setValue(true);
    }

    this.isAttachmentPresent(venId, checkListID);
  }

  showChkAttachModal(vdId: any, checkId: any) {
    this.SelectedvendorId = vdId;
    this.SelectedcheckListId = checkId;
    let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    this.commonService.successMsg$
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: any) => {
        this.IsFileUploaded = msg;
        this.updateChecklistChecker(vdId, Number(checkId - 1), true);

        (<FormArray>(
          this.VendorFormGroup.controls[vdId].get('CheckList')
        )).controls[checkId - 1]
          .get('AttachmentFlag')
          ?.setValue(msg);
      });
    this.IsAttachmentModel = true;
  }

  handleAttachModalCancel() {
    this.IsAttachmentModel = false;
  }
  VendorRequiredField: any = [];

  // * Assign to Bid Evaluation Committee
  assignToBidEvaluationCommittee(actionKey: UserActionCode) {
    const vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;

    vendorDetails.forEach((vendor: any) => {
      this.bidOpenData[0].to_RqstVndrs.results.forEach((payloadVendor: any) => {
        if (vendor.VendorId === payloadVendor.VendorId) {
          payloadVendor.FinancialOfferCmnts = vendor.FinancialOfferCmnts;
        }
      });
    });

    let data: any = {
      TndrID: this.data.TndrID,
      TndrName: this.data.TndrName,
      RFPNumber: this.data.RFPNumber,
      PurReqNo: this.data.PurReqNo,
      PurTypID: this.data.PurTypID,
      PurTypeDesc: this.data.PurTypeDesc,
      TndrTypeID: this.data.TndrTypeID,
      TndrTypeDesc: this.data.TndrTypeDesc,
      EtimadNo: this.data.EtimadNo,
      TndrStatus: this.data.TndrStatus,
      CommitteeID: this.CommitteeID,
      CommitteeName: this.CommitteeName,
      CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
      AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: '',
      AsgnQualCmtOfficerName: '',
      AsgnEvalCmtOfficerID: '',
      AsgnEvalCmtOfficerName: '',
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
      NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
      NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
      InvitationPublishDate: this.data.InvitationPublishDate,
      QualDocReceivingDate: this.data.QualDocReceivingDate,
      QualDocInspectionDate: this.data.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
      PassingRate: this.data.PassingRate,
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: 'ABC',
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.bidOpenData[0].to_RqstVndrs.results,
      to_LmtdVndrs: this.getLimitedVendorsData(),
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
      data.ChairmanCmnts =
        this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
      data.BidOpngDate = moment(
        this.bidopeningCommitteeForm?.get('openingDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
      data.FinanceOfferOpeningDate = moment(
        this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }
    console.log(data, 'data');

    this.showConfirm(data, actionKey);
  }

  /**
   *
   * @returns Invalid list
   */
  lengthCommercialNumberList: any = [];
  invalidCommercialNumberList: any = [];
  invalidChecklist: any = [];
  duplicateVendorName: any = [];

  getInvalidFormControls() {
    const invalid = [];
    const controls = this.bidopeningCommitteeForm.controls;

    this.lengthCommercialNumberList = [];
    this.invalidCommercialNumberList = [];
    this.invalidChecklist = [];
    this.duplicateVendorName = [];
    this.duplicateItems = [];

    if (!this.openingDataBasedonTenderType()) {
      const openingDate =
        this.bidopeningCommitteeForm.get('openingDate')?.value;
      const financialOfferDate = this.bidopeningCommitteeForm.get(
        'FinanceOfferOpeningDate'
      )?.value;
      const openingDateObj = new Date(openingDate);
      const financialOfferDateObj = new Date(financialOfferDate);

      console.log(financialOfferDate, 'financialOfferDateObj');

      if (financialOfferDate && openingDate) {
        if (financialOfferDateObj < openingDateObj) {
          invalid.push('openingDate');
        }
      }

      if (!financialOfferDate) {
        invalid.push('FinanceOfferOpeningDate');
      }
    }

    if (
      this.role === 'CH' &&
      this.bidopeningCommitteeForm.get('ChairmanCmnts')?.value === ''
    ) {
      invalid.push('ChairmanCmnts');
    }

    // * This is to check the duplication of commercial nos for vendor
    let crLengthInvalid = false;
    let invalidCrRequired = false;
    const CommercialNos: any = [];
    const priceList: any = [];
    const contentOfferList: any = [];
    const commentsList: any = [];
    const financialOfferCommentsList: any = [];
    const attachmentsList: any = [];
    const vendorNameList: any = [];
    let initialguranteeValue: any = [];
    const zipCodeList: any[] = [];
    const cityList: any[] = [];
    const countryList: any[] = [];
    const phoneNoList: any[] = [];
    const emailList: any[] = [];

    // console.log(this.vendorList?.getRawValue(), 'this.vendorList?.getRawValue()');
    let vendorList: any[] = this.vendorList?.getRawValue() || [];
    console.log('this.vendorList?.value', this.vendorList?.getRawValue());

    vendorList.forEach((data: any, index: number) => {
      // * Commercial Number required validation
      if (data.VendorCommercialNo) {
        if (
          data.VendorCommercialNo?.toString().length !== 10 ||
          parseInt(data.VendorCommercialNo) === 0
        ) {
          crLengthInvalid = true;
          this.lengthCommercialNumberList.push(index + 1);
        }
        CommercialNos.push(data.VendorCommercialNo?.toString());
      } else {
        // * Required for Officer in One envelope or required in Two envelope if it is financial offer
        if (
          this.role === 'OF' &&
          (this.data.TndrTypeID === '01' ||
            this.bidOpenData?.[0]?.FinancialOffer === 'X')
        ) {
          invalidCrRequired = true;
          this.invalidCommercialNumberList.push(index + 1);
        }
      }

      vendorNameList.push(data.VendorName?.toString() ?? '');
      priceList.push(data.Price?.toString() ?? '');
      initialguranteeValue.push(data.InitialGuranteeValue.toString() ?? '');
      contentOfferList.push(data.ContentOffer?.toString() ?? '');
      commentsList.push(data.MOMDts?.toString() ?? '');
      financialOfferCommentsList.push(
        data.FinancialOfferCmnts?.toString() ?? ''
      );
      attachmentsList.push(data.AttachmentCmnts?.toString() ?? '');
      zipCodeList.push(data.ZipCode?.toString() ?? '');
      cityList.push(data.City?.toString() ?? '');
      countryList.push(data.CountryId?.toString() ?? '');
      phoneNoList.push(data.PhoneNo?.toString() ?? '');
      emailList.push(data.Email?.toString() ?? '');
    });

    if (invalidCrRequired) {
      invalid.push('invalidCrRequired');
    }

    const uniqueElements = new Set();

    // * Commercial Number duplicate validations
    CommercialNos.forEach((item: any, index: any) => {
      if (uniqueElements.has(item)) {
        this.duplicateItems.push(index + 1);
      } else {
        uniqueElements.add(item.toString());
      }
    });

    if (this.duplicateItems.length != 0) {
      invalid.push('duplicateCommercialNo');
    }

    // * Vendor Name required validation
    const uniqueVendorElements = new Set();
    this.duplicateVendorItems = [];
    this.invalidVendorNameList = [];

    vendorNameList.forEach((item: any, index: any) => {
      if (item.toString().length == 0) {
        this.invalidVendorNameList.push(index + 1);
      }
      if (uniqueVendorElements.has(item)) {
        this.duplicateVendorItems.push(item);
      } else {
        uniqueVendorElements.add(item?.toString());
      }
    });

    if (this.invalidVendorNameList.length != 0) {
      invalid.push('InvalidVendorName');
    }
    if (this.duplicateVendorItems.length != 0) {
      invalid.push('vendorName');
    }

    // * Invalid Price validation
    this.invalidPriceList = [];
    priceList.forEach((item: string, index: any) => {
      if ( item.length == 0 || 
           (this.role === 'OF' && parseFloat(item) <= 0)
        ) {
        this.invalidPriceList.push(index + 1);
      }
    });

    if (this.invalidPriceList.length != 0) {
      invalid.push('InvalidPrice');
    }

    this.invalidInitialGuranteeValue = [];

    initialguranteeValue.forEach((item: any, index: any) => {
      if (item.toString().length == 0) {
        this.invalidInitialGuranteeValue.push(index + 1);
      }
    });
    if (this.bidOpenData?.[0]?.FinancialOffer === 'X' && this.role === 'OF' && 
      this.invalidInitialGuranteeValue.length != 0) {
      invalid.push('InitialGuranteeValue');
    }

    // * Invalid content of offer validation
    this.invalidContentOfferList = [];
    contentOfferList.forEach((item: any, index: any) => {
      if (item.toString().length == 0) {
        this.invalidContentOfferList.push(index + 1);
      }
    });

    if (this.invalidContentOfferList.length != 0) {
      invalid.push('InvalidContentOffer');
    }

    // * Invalid comments validation
    // this.invalidCommentsList = [];
    // commentsList.forEach((item: any, index: any) => {
    //   if (item.toString().length == 0) {
    //     this.invalidCommentsList.push(index + 1);
    //   }
    // });

    // if (this.invalidCommentsList.length != 0) {
    //   invalid.push('InvalidComments');
    // }

    // * Invalid Attachment comments validation
    this.invalidAttachmentsList = [];
    attachmentsList.forEach((item: any, index: any) => {
      if (item.toString().length == 0) {
        this.invalidAttachmentsList.push(index + 1);
      }
    });

    if (this.invalidAttachmentsList.length != 0) {
      invalid.push('InvalidAttachments');
    }

    // * Invalid Financial comments validation
    this.invalidFinancialComments = [];
    financialOfferCommentsList.forEach((item: any, index: any) => {
      if (item.toString().length == 0) {
        this.invalidFinancialComments.push(index + 1);
      }
    });

    if (
      this.role !== 'CH' &&
      this.data.TndrTypeID !== '02' &&
      this.invalidFinancialComments.length != 0
    ) {
      invalid.push('InvalidFinanicalOfferComments');
    }

    if (this.isVendorDetailsRequired) {
      this.invalidZipCodeList = [];
      zipCodeList.forEach((zipCode: string, index: number) => {
        if (zipCode.length === 0) {
          this.invalidZipCodeList.push(index+1);
        }
      })

      if (this.invalidZipCodeList.length != 0) {
        invalid.push('InvalidZipCode');
      }

      this.invalidCityList = [];
      cityList.forEach((city: string, index: number) => {
        if (city.length === 0) {
          this.invalidCityList.push(index+1);
        }
      })

      if (this.invalidCityList.length != 0) {
        invalid.push('InvalidCity');
      }

      this.invalidCountryList = [];
      countryList.forEach((country: string, index: number) => {
        if (country.length === 0) {
          this.invalidCountryList.push(index+1);
        }
      })

      if (this.invalidCountryList.length != 0) {
        invalid.push('InvalidCountry');
      }

      this.invalidPhoneNoList = [];
      phoneNoList.forEach((phoneno: string, index: number) => {
        if (phoneno.length === 0) {
          this.invalidPhoneNoList.push(index+1);
        }
      })

      if (this.invalidPhoneNoList.length != 0) {
        invalid.push('InvalidPhoneNo');
      }

      this.invalidEmailList = [];
      emailList.forEach((email: string, index: number) => {
        if (email.length === 0) {
          this.invalidEmailList.push(index+1);
        }
      })

      if (this.invalidEmailList.length != 0) {
        invalid.push('InvalidEmail')
      }

    }


    // * Invalid commercial Number Pattern validaiton
    const isCommercialNumberValid = vendorList.every((data: any) => {
      console.log(data.VendorCommercialNo);
      return REGEX.COMMERCIAL_NUMBER.test(data.VendorCommercialNo);
    });
    console.log(isCommercialNumberValid, 'isCommercialNumberValid');

    if (!isCommercialNumberValid) {
      //*  Validate only for Officer in One envelope or required in Two envelope if it is financial offer
      if (
        (this.role === 'OF' || this.role === 'CH') &&
        (this.data.TndrTypeID === '01' ||
          this.bidOpenData?.[0]?.FinancialOffer === 'X')
      ) {
        invalid.push('invalidCommercialNo');
      }
    }

    // * CR number length invalid validaiton
    if (crLengthInvalid) {
      invalid.push('invalidCommercialNoLength');
    }

    // * This is to check if there is at least one checklist attachment

    vendorList.forEach((data: any, index: number) => {
      console.log(this.checklistCheckerArray);

      const vendorKey = Object.keys(this.checklistCheckerArray)[index];
      let checkListCheckerItem = this.checklistCheckerArray[vendorKey];
      console.log(checkListCheckerItem);
      for (let i = 0; i < data?.CheckList.length; i++) {
        console.log(data?.CheckList[i].IsAttachmentValid);

        if (
          data?.CheckList[i].IsAttachmentValid === true &&
          checkListCheckerItem[i][`checklist${i + 1}`] === false
        ) {
          invalid.push('checkListAttachment');
          this.invalidChecklist.push(index + 1);
        }
      }

      if (this.bidOpenData?.[0]?.TndrTypeID === '01') {
        for (let i = 0; i < data?.CheckList.length; i++) {
          if (
            data?.CheckList[i]?.ChecklistId === '001' ||
            data?.CheckList[i]?.ChecklistId === '002'
          ) {
            if (data?.CheckList[i].IsAttachmentValid === false) {
              invalid.push('checkListAttachment');
              this.invalidChecklist.push(index + 1);
              break;
            }
          }
        }
      } else if (
        this.bidOpenData?.[0]?.TndrTypeID === '02' &&
        this.bidOpenData?.[0]?.FinancialOffer === ''
      ) {
        for (let i = 0; i < data?.CheckList.length; i++) {
          if (data?.CheckList[i]?.ChecklistId === '002') {
            if (data?.CheckList[i].IsAttachmentValid === false) {
              invalid.push('checkListAttachment');
              this.invalidChecklist.push(index + 1);
              break;
            }
          }
        }
      } else if (
        this.bidOpenData?.[0]?.TndrTypeID === '02' &&
        this.bidOpenData?.[0]?.FinancialOffer === 'X'
      ) {
        for (let i = 0; i < data?.CheckList.length; i++) {
          if (data?.CheckList[i]?.ChecklistId === '001') {
            if (data?.CheckList[i].IsAttachmentValid === false) {
              invalid.push('checkListAttachment');
              this.invalidChecklist.push(index + 1);
              break;
            }
          }
        }
      }
    });

    // if(this.bidOpenData?.[0]?.TndrTypeID === '01'){
    //   if(this.vendorList?.value[0]?.CheckList[0]?.IsAttachmentValid === false ||this.vendorList?.value[0]?.CheckList[1]?.IsAttachmentValid === false  ){
    //     invalid.push('checkListAttachment');
    //   }
    // }

    const NoOfVndrs = controls['NoOfVndrs'].value;

    if (NoOfVndrs === 0) {
      invalid.push('NoOfVndrs');
    }

    const NoOfByres = controls['NoOfByres'].value;

    if (NoOfByres === 0) {
      invalid.push('NoOfByres');
    }

    for (const name in controls) {
      if (name === `Comments` && this.isChaiman && controls[name].invalid) {
        invalid.push(name);
      } else if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  getLimitedVendorsData() {
    const limitedVendors: any = [];
    if (
      this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value === '01'
    ) {
      const limitedVendorsControl = this.bidopeningCommitteeForm.get(
        'vendorInvitationsSent'
      ) as FormArray;

      limitedVendorsControl.controls.forEach((formGroup: any) => {
        const formData = formGroup.getRawValue();
        if (formData.LmtdVendorName) {
          limitedVendors.push({
            TenderId: this.data.TndrID,
            LmtdVendorId: formData.LmtdVendorId || '',
            LmtdVendorName: formData.LmtdVendorName,
          });
        }
      });
      //console.log('limitedVendors ', limitedVendors);
      return limitedVendors;
    }
    return [];
  }

  //this.vendorList?.value
  selectedVendors: string[] = [];

  onVendorChange(selectedValue: any, index: number): void {
    if (this.initialized) {
      this.selectedVendors[index] = selectedValue;
    } else {
      this.selectedVendors = [];
    }
    console.log('Selected Vendor:', this.selectedVendors);
    this.initialized = true;
  }

  getVendorDropdownlist(): string[] {
    return this.inviteVendorsList.filter(
      (vendor: string) => !this.selectedVendors.includes(vendor)
    );
  }

  addInviteVendor(event: any, index: any) {
    if (this.inviteVendorsList[index]) {
      this.inviteVendorsList = this.inviteVendorsList.filter(
        (item: any) => item != this.inviteVendorsList[index]
      );
    }

    this.inviteVendorsList.push(event.target.value);
  }

  saveAsDraft(actionKey: UserActionCode) {
    let data: any = {
      TndrID: this.data.TndrID,
      TndrName: this.data.TndrName,
      RFPNumber: this.data.RFPNumber,
      PurReqNo: this.data.PurReqNo,
      PurTypID: this.data.PurTypID,
      PurTypeDesc: this.data.PurTypeDesc,
      TndrTypeID: this.data.TndrTypeID,
      TndrTypeDesc: this.data.TndrTypeDesc,
      EtimadNo: this.data.EtimadNo,
      TndrStatus: this.data.TndrStatus,
      CommitteeID: this.CommitteeID,
      CommitteeName: this.CommitteeName,
      CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
      AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: '',
      AsgnQualCmtOfficerName: '',
      AsgnEvalCmtOfficerID: '',
      AsgnEvalCmtOfficerName: '',
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
      NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
      NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
      InvitationPublishDate: this.data.InvitationPublishDate,
      QualDocReceivingDate: this.data.QualDocReceivingDate,
      QualDocInspectionDate: this.data.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
      PassingRate: this.data.PassingRate,
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: 'DFT',
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.processVendorDetails(
        this.bidopeningCommitteeForm,
        this.vendorList,
        this.bidOpenData,
        this.data,
        this.CommitteeID,
        this.isDisabledPrice
      ),
      to_LmtdVndrs: this.getLimitedVendorsData(),
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
      data.ChairmanCmnts =
        this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
      data.BidOpngDate = moment(
        this.bidopeningCommitteeForm?.get('openingDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
      data.FinanceOfferOpeningDate = moment(
        this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    console.log(data);
    this.showConfirm(data, actionKey);
  }

  submitFromMember(userAction: UserActionCode) {
    this.result[0].to_RqstVndrs.results.forEach((element: any) => {
      element.to_VndrChkLst.results.forEach((ele: any) => {
        ele.IsAttachmentValid =
          ele.IsAttachmentValid === true || ele.IsAttachmentValid === 'N'
            ? 'N'
            : 'Y';
      });
    });
    let data: any = {
      TndrID: this.data.TndrID,
      TndrName: this.data.TndrName,
      RFPNumber: this.data.RFPNumber,
      PurReqNo: this.data.PurReqNo,
      PurTypID: this.data.PurTypID,
      PurTypeDesc: this.data.PurTypeDesc,
      TndrTypeID: this.data.TndrTypeID,
      TndrTypeDesc: this.data.TndrTypeDesc,
      EtimadNo: this.data.EtimadNo,
      TndrStatus: this.data.TndrStatus,
      CommitteeID: this.CommitteeID,
      CommitteeName: this.CommitteeName,
      CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
      AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: '',
      AsgnQualCmtOfficerName: '',
      AsgnEvalCmtOfficerID: '',
      AsgnEvalCmtOfficerName: '',
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
      NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
      NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
      InvitationPublishDate: this.data.InvitationPublishDate,
      QualDocReceivingDate: this.data.QualDocReceivingDate,
      QualDocInspectionDate: this.data.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
      PassingRate: this.data.PassingRate,
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: userAction,
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.processVendorDetails(
        this.bidopeningCommitteeForm,
        this.vendorList,
        this.bidOpenData,
        this.data,
        this.CommitteeID,
        this.isDisabledPrice
      ),
      to_LmtdVndrs: this.getLimitedVendorsData(),
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
      data.ChairmanCmnts =
        this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
      data.BidOpngDate = moment(
        this.bidopeningCommitteeForm?.get('openingDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
      data.FinanceOfferOpeningDate = moment(
        this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    console.log(data);
    if (data) {
      // this.spinner.show();

      this.showConfirm(data, userAction);
    }
    //console.log(vendorDetails);
  }

  ReturnToOfficer(action: UserActionCode) {
    if (this.to_RqstMbrs.length === 0) {
      //alert('Please select committe member ');
      //this.error('Please select Committee members');
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Please select Committee members'
          : 'الرجاء اختيار أعضاء اللجنة'
      );
    } else {
      this.result[0].to_RqstVndrs.results.forEach((element: any) => {
        element.to_VndrChkLst.results.forEach((ele: any) => {
          ele.IsAttachmentValid =
            ele.IsAttachmentValid === true || ele.IsAttachmentValid === 'N'
              ? 'N'
              : 'Y';
        });
      });
      let data: any = {
        TndrID: this.data.TndrID,
        TndrName: this.data.TndrName,
        RFPNumber: this.data.RFPNumber,
        PurReqNo: this.data.PurReqNo,
        PurTypID: this.data.PurTypID,
        PurTypeDesc: this.data.PurTypeDesc,
        TndrTypeID: this.data.TndrTypeID,
        TndrTypeDesc: this.data.TndrTypeDesc,
        EtimadNo: this.data.EtimadNo,
        TndrStatus: this.data.TndrStatus,
        CommitteeID: this.CommitteeID,
        CommitteeName: this.CommitteeName,
        CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
        CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
        CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
        CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
        CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
        CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
        CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
        CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
        AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
        AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
        AsgnQualCmtOfficerID: '',
        AsgnQualCmtOfficerName: '',
        AsgnEvalCmtOfficerID: '',
        AsgnEvalCmtOfficerName: '',
        TchnclEvltnMmbrID: '',
        TchnclEvltnMmbrName: '',
        CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
        IsSingleTender: '',
        IsTenderCancelled: '',
        IsTenderUrgent: '',
        MsgType: '',
        MsgVar1: '',
        MsgVar2: '',
        NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
        NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
        NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
        InvitationPublishDate: this.data.InvitationPublishDate,
        QualDocReceivingDate: this.data.QualDocReceivingDate,
        QualDocInspectionDate: this.data.QualDocInspectionDate,
        NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
        PassingRate: this.data.PassingRate,
        LgdInUsr: this.LogdInUsrID,
        LgdInUsrCmt: this.CommitteeID,
        LgdInUsrCmtRole: this.role,
        LgdInUsrAction: action,
        to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
        to_RqstVndrs: this.result[0].to_RqstVndrs,
        to_LmtdVndrs: this.getLimitedVendorsData(),
        to_Attach: this.combineOtherAttachmentsWithUpdated(),
      };

      if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
        data.CompetitionTypeID =
          this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
      }
      if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
        data.ChairmanCmnts =
          this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
      }
      if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
        data.BidOpngDate = moment(
          this.bidopeningCommitteeForm?.get('openingDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
        data.FinanceOfferOpeningDate = moment(
          this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
        data.SubmissionDate = moment(
          this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
        ).format('YYYYMMDD');
      }

      //  console.log(data);
      this.showConfirm(data, action);
    }
  }

  /**
   * * Submit from officer post method
   * @returns
   */
  submitFromOfficer(actionKey: UserActionCode) {
    // console.log('triggering submit from officer');
    // console.log(this.vendorList?.getRawValue(), 'this.vendorList?.getRawValue()');
    this.VendorRequiredField = [];

    if (this.checkTechAndFinancialOfferOpeningDate()) {
      return; // Stop execution if validation fails
    }

    // * Invalid Vendor Name Validation
    if (this.getInvalidFormControls().includes('InvalidVendorName')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Vendor Name is missing for serial number ' +
              this.invalidVendorNameList.join(', ')
          : this.invalidVendorNameList.join(', ') +
              'اسم الشركة مفقود لرقم التسلسل'
      );
      return;
    }

    if (this.data.TndrTypeID === '01') {
      if (this.getInvalidFormControls().includes('InitialGuranteeValue')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Please Fill Initial Gurantee Value for serial number ' +
                this.invalidInitialGuranteeValue.join(', ')
            : this.invalidInitialGuranteeValue.join(', ') +
                'يرجى ملء قيمة الضمان الابتدا'
        );
        return;
      }
    }

    // * Duplicate Vendor Name Validation
    if (this.getInvalidFormControls().includes('vendorName')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Duplicated vendor name  -' + this.duplicateVendorItems.join(', ')
          : this.duplicateVendorItems.join(', ') + 'اسم البائع مكرر'
      );
      return;
    }

    // * CR Number length invalid validation
    if (this.getInvalidFormControls().includes('invalidCommercialNoLength')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Commercial Number should be 10 digits for serial number ' +
              this.lengthCommercialNumberList.join(', ')
          : this.lengthCommercialNumberList.join(', ') +
              'يجب أن يكون رقم التجاري مؤلفًا من 10 أرقام لرقم التسلسل'
      );
      return;
    }

    if (
      (this.getInvalidFormControls().includes('invalidCommercialNo') ||
        this.getInvalidFormControls().includes('invalidCrRequired')) &&
      this.isCommercialNumberRequired
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Please enter valid commercial number for serial number  ' +
              this.invalidCommercialNumberList.join(', ')
          : this.invalidCommercialNumberList.join(', ') +
              `يرجى إدخال رقم تجاري صالح لرقم التسلسل`
      );
      return;
    }

    if (
      this.getInvalidFormControls().includes('duplicateCommercialNo')
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Duplicated commercial number for serial number ' +
              this.duplicateItems.join(', ')
          : this.duplicateItems.join(', ') + 'رقم تجاري مكرر لرقم التسلسل'
      );
      return;
    }

    if (
      this.getInvalidFormControls().includes('InvalidPrice') &&
      this.isOneEnevlope
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
            ? 'Price is invalid for serial number ' +
                this.invalidPriceList.join(', ')
            : this.invalidPriceList.join(', ') + 'السعر رقم تسلسلي غير صالح'
      );
      return;
    }

    if (this.getInvalidFormControls().includes('InvalidContentOffer')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Content of Offer is missing for serial number ' +
              this.invalidContentOfferList.join(', ')
          : this.invalidContentOfferList.join(', ') +
              'محتوى العرض مفقود لرقم التسلسل'
      );
      return;
    }

    if (this.isVendorDetailsRequired) {

      if (this.getInvalidFormControls().includes('InvalidZipCode')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en' ?
          'Zip code is missing for serial number ' + this.invalidZipCodeList.join(', ') :
          this.invalidZipCodeList.join(', ') + 'الرمز البريدي مفقود للبند رقم'
        )
      }

      if (this.getInvalidFormControls().includes('InvalidCity')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en' ?
          'City is missing for serial number ' + this.invalidCityList.join(', ') :
          this.invalidCityList.join(', ') + 'المدينة مفقودة للبند رقم'
        )
      }

      if (this.getInvalidFormControls().includes('InvalidCountry')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en' ?
          'Country is missing for serial number ' + this.invalidCountryList.join(', ') :
          this.invalidCountryList.join(', ') + 'البلد مفقودة للبند رقم'
        )
      }

      if (this.getInvalidFormControls().includes('InvalidPhoneNo')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en' ?
          'Phone Number is missing for serial number ' + this.invalidPhoneNoList.join(', ') :
          this.invalidPhoneNoList.join(', ') + 'رقم الهاتف مفقود للبند رقم'
        )
      }

      if (this.getInvalidFormControls().includes('InvalidEmail')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en' ?
          'Email is missing for serial number ' + this.invalidEmailList.join(', ') :
          this.invalidEmailList.join(', ') + 'الايميل مفقود للبند رقم'
        )
      }

    }


    if (
      this.getInvalidFormControls().includes('InvalidAttachments') &&
      !this.isOneEnevlope
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Attachments Comments is missing for serial number ' +
              this.invalidAttachmentsList.join(', ')
          : this.invalidAttachmentsList.join(', ') +
              'تعليقات المرفقات مفقودة لرقم التسلسل'
      );
      return;
    }

    if (this.isEqual(this.committeeUserName, this.committeeBackupUserName)) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Do not select same user as main and backup member.'
          : 'لا يجب ان يكون العضو الأساسي نفس العضو الاحتياطي'
      );
      return;
    }

    if (this.getInvalidFormControls().includes('checkListAttachment')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Checklist attachment not found for serial number ' +
              this.invalidChecklist.join(', ')
          : this.invalidChecklist.join(', ') +
              'مرفق قائمة الفحص غير موجود لرقم التسلسل'
      );
      return;
    }

    if (this.getInvalidFormControls().includes('CompetitionTypeID')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Type of competition is required'
          : 'نوع المنافسة مطلوب'
      );
      return;
    }

    if (this.getInvalidFormControls().includes('openingDate')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Bid Opening date is required'
          : 'تاريخ فتح العطاء مطلوب'
      );
      return;
    }

    if (this.getInvalidFormControls().includes('SubmissionDate')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Submission date is required'
          : 'تاريخ التقديم مطلوب'
      );
      return;
    }
    if (this.getInvalidFormControls().includes('NoOfByres')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Number of Buyers cannot be zero'
          : 'تاريخ التقديم مطلوب'
      );
      return;
    }
    if (this.getInvalidFormControls().includes('NoOfVndrs')) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Number of vendors cannot be zero'
          : 'تاريخ التقديم مطلوب'
      );
      return;
    }

    if (
      this.bidopeningCommitteeForm.getRawValue().vendorInvitationsSent
        .length === 0 &&
      this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value === '01'
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Please enter the vendors to whom invitation is sent'
          : 'الرجاء إدخال البائعين الذين يتم إرسال الدعوة إليهم'
      );
      return;
    } else if (
      this.getInvalidFormControls().includes('vendorInvitationsSent') &&
      this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value === '01'
    ) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Vendor name is required'
          : 'اسم البائع مطلوب'
      );
      return;
    }

   

    const committeeMembersLength = this.CommitteeID === '01' ? 3 : 2;
    if (this.to_RqstMbrs.length !== committeeMembersLength) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? `Please select exactly ${committeeMembersLength} members`
          : `الرجاء اختيار ${committeeMembersLength} أعضاء بالضبط`
      );
      return;
    } else if (
      this.bidopeningCommitteeForm.getRawValue().addVender.length > 0
    ) {
      let data: any = {
        TndrID: this.data.TndrID,
        TndrName: this.data.TndrName,
        RFPNumber: this.data.RFPNumber,
        PurReqNo: this.data.PurReqNo,
        PurTypID: this.data.PurTypID,
        PurTypeDesc: this.data.PurTypeDesc,
        TndrTypeID: this.data.TndrTypeID,
        TndrTypeDesc: this.data.TndrTypeDesc,
        EtimadNo: this.data.EtimadNo,
        TndrStatus: this.data.TndrStatus,
        CommitteeID: this.CommitteeID,
        CommitteeName: this.CommitteeName,
        CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
        CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
        CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
        CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
        CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
        CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
        CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
        CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
        AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
        AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
        AsgnQualCmtOfficerID: '',
        AsgnQualCmtOfficerName: '',
        AsgnEvalCmtOfficerID: '',
        AsgnEvalCmtOfficerName: '',
        TchnclEvltnMmbrID: '',
        TchnclEvltnMmbrName: '',
        CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
        IsSingleTender: '',
        IsTenderCancelled: '',
        IsTenderUrgent: '',
        MsgType: '',
        MsgVar1: '',
        MsgVar2: '',
        NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
        NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
        NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
        InvitationPublishDate: this.data.InvitationPublishDate,
        QualDocReceivingDate: this.data.QualDocReceivingDate,
        QualDocInspectionDate: this.data.QualDocInspectionDate,
        NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
        PassingRate: this.data.PassingRate,
        LgdInUsr: this.LogdInUsrID,
        LgdInUsrCmt: this.CommitteeID,
        LgdInUsrCmtRole: this.role,
        LgdInUsrAction: 'SUB',
        to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
        to_RqstVndrs: this.processVendorDetails(
          this.bidopeningCommitteeForm,
          this.vendorList,
          this.bidOpenData,
          this.data,
          this.CommitteeID,
          this.isDisabledPrice
        ),
        to_LmtdVndrs: this.getLimitedVendorsData(),
        to_Attach: this.combineOtherAttachmentsWithUpdated(),
      };

      console.log(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value);
      console.log(this.bidopeningCommitteeForm.get('NoOfByres')?.value);

      if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
        data.CompetitionTypeID =
          this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
      }
      if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
        data.ChairmanCmnts =
          this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value || '';
      }
      if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
        data.BidOpngDate = moment(
          this.bidopeningCommitteeForm?.get('openingDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
        data.FinanceOfferOpeningDate = moment(
          this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
        data.SubmissionDate = moment(
          this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
        ).format('YYYYMMDD');
      }
      // console.log(data.to_RqstVndrs , 'data');
      if (data) {
        // console.log(data)
        // console.log(this.processVendorDetails(this.bidopeningCommitteeForm, this.vendorList, this.bidOpenData, this.data, this.CommitteeID, this.isDisabledPrice))
        this.showConfirm(data, actionKey);
      }

      // }
    }
    //console.log(vendorDetails);
  }

  assignOfficer() {
    const data: any = {
      TndrID: this.data.TndrID,
      TndrName: this.data.TndrName,
      RFPNumber: this.data.RFPNumber,
      PurReqNo: this.data.PurReqNo,
      PurTypID: this.data.PurTypID,
      PurTypeDesc: this.data.PurTypeDesc,
      TndrTypeID: this.data.TndrTypeID,
      TndrTypeDesc: this.data.TndrTypeDesc,
      EtimadNo: this.data.EtimadNo,
      TndrStatus: this.data.TndrStatus,
      CommitteeID: this.CommitteeID,
      CommitteeName: localStorage.getItem('CommitteeName'),
      CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
      AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: '',
      AsgnQualCmtOfficerName: '',
      AsgnEvalCmtOfficerID: '',
      AsgnEvalCmtOfficerName: '',
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      NoOfVndrs: String(this.bidopeningCommitteeForm.get('NoOfVndrs')?.value),
      NoOfByres: String(this.bidopeningCommitteeForm.get('NoOfByres')?.value),
      NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
      InvitationPublishDate: this.data.InvitationPublishDate,
      QualDocReceivingDate: this.data.QualDocReceivingDate,
      QualDocInspectionDate: this.data.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
      PassingRate: this.data.PassingRate,
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: 'ASG',
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.result[0].to_RqstVndrs.results,
      to_LmtdVndrs: this.getLimitedVendorsData(),
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
      console.log(this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value);
      data.ChairmanCmnts = this.bidopeningCommitteeForm
        .get('ChairmanCmnts')
        ?.value.toString();
    }
    if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
      data.BidOpngDate = moment(
        this.bidopeningCommitteeForm?.get('openingDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    // console.log(data, 'data');
    if (data) {
      this.spinner.show();
      this.api
        .post('Cmt_create', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.d.MsgType === 'S') {
              this.commonService.createMessage(
                'success',
                this.commonService.userLanguage === 'en'
                  ? res.d.MsgVar1
                  : res.d.MsgVar2
              );
              this.cs.activeMenu = `bidlist`;
              this.router.navigate(['committee/BidList'], {
                state: { ActiveTab: 'BidList' },
              });
            } else {
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

  isEqual(a: any, b: any) {
    if (a.length > 0 && b.length > 0) {
      if (a.length > b.length) {
        return a.filter((item: any) => b.includes(item)).length > 0;
      } else {
        return b.filter((item: any) => a.includes(item)).length > 0;
      }
    } else {
      return false;
    }
  }

  showConfirm(data: any, actionKey: UserActionCode) {
    const committeeMembersLength = this.CommitteeID === '01' ? 3 : 2;
    if (this.isEqual(this.committeeUserName, this.committeeBackupUserName)) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? 'Do not select same user as main and backup member.'
          : 'لا تحدد نفس السمتخدم كعضو رئيسي وعضو احتياطي'
      );
    } else if (this.to_RqstMbrs.length !== committeeMembersLength) {
      this.commonService.createMessage(
        'error',
        this.commonService.userLanguage === 'en'
          ? `Please select exactly ${committeeMembersLength} members`
          : `الرجاء اختيار ${committeeMembersLength} أعضاء بالضبط`
      );
      return;
    } else {
      this.openMdl = false;
      const modalRef = this.modal.create({
        nzContent: ConfirmComponent,
        nzComponentParams: {
          config: {
            titleText: this.cs.getConfimationModalTitle(actionKey ?? null),
            bodyText: this.cs.getConfimationMessage(actionKey ?? null),
          },
        },
        nzWidth: 600,
        nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
        nzFooter: null,
      });

      modalRef.afterClose.subscribe((result) => {
        if (result) {
          if (this.actionCheckerForOTP(actionKey)) {
            this.getOTP();
            this.processedData = data;
          } else {
            if (data) {
              this.postData(data);
            }
          }
        }
      });
    }
  }
  // error modal
  error(msg: any): void {
    this.modal.error({
      nzTitle: msg,
      //nzContent: 'some messages...some messages...'
    });
  }

  submitFromFinancialoffer(action: UserActionCode) {
    this.VendorRequiredField = [];
    if (this.bidopeningCommitteeForm.getRawValue().addVender.length > 0) {
      const committeeMembersLength = this.CommitteeID === '01' ? 3 : 2;
      if (this.to_RqstMbrs.length !== committeeMembersLength) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? `Please select exactly ${committeeMembersLength} members`
            : `الرجاء اختيار ${committeeMembersLength} أعضاء بالضبط`
        );
        return;
      }

      if (
        this.getInvalidFormControls().includes('invalidCommercialNoLength') &&
        this.isCommercialNumberRequired
      ) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Commercial Number should be 10 digits for serial number ' +
                this.lengthCommercialNumberList.join(', ')
            : this.lengthCommercialNumberList.join(', ') +
                'يجب أن يكون رقم التجاري مؤلفًا من 10 أرقام لرقم التسلسل'
        );
        return;
      }

      if (this.getInvalidFormControls().includes('checkListAttachment')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Checklist attachment not found for serial number ' +
                this.invalidChecklist.join(', ')
            : this.invalidChecklist.join(', ') +
                'مرفق قائمة الفحص غير موجود لرقم التسلسل'
        );
        return;
      }

      if (this.role === 'CH') {
        if (this.getInvalidFormControls().includes('ChairmanCmnts')) {
          this.commonService.createMessage(
            'error',
            this.commonService.userLanguage === 'en'
              ? 'please fill Chairman comments '
              : 'مرفق قائمة الفحص غير موجود لرقم التسلسل'
          );
          return;
        }
      }
      if (
        this.getInvalidFormControls().includes('invalidCommercialNo') ||
        this.getInvalidFormControls().includes('invalidCrRequired')
      ) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Please enter valid commercial number for serial number  ' +
                this.invalidCommercialNumberList.join(', ')
            : this.invalidCommercialNumberList.join(', ') +
                `يرجى إدخال رقم تجاري صالح لرقم التسلسل`
        );
        return;
      }

      if (this.getInvalidFormControls().includes('duplicateCommercialNo')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Duplicated commercial number for serial number' +
                this.duplicateItems.join(', ')
            : this.duplicateItems.join(', ') + 'رقم تجاري مكرر لرقم التسلسل'
        );
        return;
      }
      if (this.getInvalidFormControls().includes('InvalidPrice')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Price is invalid for serial number ' +
                this.invalidPriceList.join(', ')
            : this.invalidPriceList.join(', ') + 'السعر رقم تسلسلي غير صالح'
        );
        return;
      }

      if (
        this.getInvalidFormControls().includes('InvalidFinanicalOfferComments')
      ) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Financial Comments is missing for serial number ' +
                this.invalidFinancialComments.join(', ')
            : this.invalidFinancialComments.join(', ') +
                'التعليقات مالية مفقودة لرقم التسلسل'
        );
        return;
      }

      // * For Officer Committee Comments for Financial Offer is manditory.
      // if (committeCommentsIsInvalid) {
      //   this.commonService.createMessage(
      //     'error',
      //     this.translate.instant(
      //       'COM.Enter the Committee Comments for Financial offer for All Vendors'
      //     )
      //   );
      //   return;
      // }

      if (this.getInvalidFormControls().includes('duplicateCommercialNo')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Duplicated commercial number'
            : 'تكرار رقم تجاري'
        );
        return;
      }

      if (this.getInvalidFormControls().includes('invalidCommercialNoLength')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Commercial Number should be 10 digits for serial number'
            : 'يجب أن يكون رقم التجاري مؤلفًا من 10 أرقام لرقم التسلسل'
        );
        return;
      }

      if (
        this.getInvalidFormControls().includes('invalidCommercialNo') ||
        this.getInvalidFormControls().includes('invalidCrRequired')
      ) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Please enter valid commercial number'
            : `الرجاء إدخال رقم تجاري صالح`
        );
        return;
      }

      if (this.getInvalidFormControls().includes('InitialGuranteeValue')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Please Fill Initial Gurantee Value for serial number ' +
                this.invalidInitialGuranteeValue.join(', ')
            : this.invalidInitialGuranteeValue.join(', ') +
                'يرجى ملء قيمة الضمان الابتدا'
        );
        return;
      }

      // * Checks for member validity
      if (this.isOfficer && this.to_RqstMbrs.length <= 0) {
        this.cs.createMessage(
          'error',
          this.translate.instant('RFP.MemNameReq')
        );
        return;
      }

      let data: any = {};

      if (action) {
        data = {
          TndrID: this.data.TndrID,
          TndrName: this.data.TndrName,
          RFPNumber: this.data.RFPNumber,
          PurReqNo: this.data.PurReqNo,
          PurTypID: this.data.PurTypID,
          PurTypeDesc: this.data.PurTypeDesc,
          TndrTypeID: this.data.TndrTypeID,
          TndrTypeDesc: this.data.TndrTypeDesc,
          EtimadNo: this.data.EtimadNo,
          TndrStatus: this.data.TndrStatus,
          CommitteeID: this.CommitteeID,
          CommitteeName: this.CommitteeName,
          CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
          CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
          CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
          CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
          CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
          CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
          CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
          CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
          AsgnOpngCmtOfficerID: this.result[0].AsgnOpngCmtOfficerID,
          AsgnOpngCmtOfficerName: this.result[0].AsgnOpngCmtOfficerName,
          AsgnQualCmtOfficerID: this.result[0].AsgnQualCmtOfficerID,
          AsgnQualCmtOfficerName: this.result[0].AsgnQualCmtOfficerName,
          AsgnEvalCmtOfficerID: this.result[0].AsgnEvalCmtOfficerID,
          AsgnEvalCmtOfficerName: this.result[0].AsgnEvalCmtOfficerName,
          TchnclEvltnMmbrID: this.result[0].TchnclEvltnMmbrID,
          TchnclEvltnMmbrName: this.result[0].TchnclEvltnMmbrName,
          CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
          IsSingleTender: this.result[0].IsSingleTender,
          IsTenderCancelled: this.result[0].IsTenderCancelled,
          IsTenderUrgent: this.result[0].IsTenderUrgent,
          MsgType: '',
          MsgVar1: '',
          MsgVar2: '',
          NoOfVndrs: String(
            this.bidopeningCommitteeForm.get('NoOfVndrs')?.value
          ),
          NoOfByres: String(
            this.bidopeningCommitteeForm.get('NoOfByres')?.value
          ),
          NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
          InvitationPublishDate: this.data.InvitationPublishDate,
          QualDocReceivingDate: this.data.QualDocReceivingDate,
          QualDocInspectionDate: this.data.QualDocInspectionDate,
          NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
          PassingRate: this.data.PassingRate,
          LgdInUsr: this.LogdInUsrID,
          LgdInUsrCmt: this.CommitteeID,
          LgdInUsrCmtRole: this.role,
          LgdInUsrAction: action,
          to_RqstMbrs: this.prepareCommitteeMembersDataForPost(
            this.to_RqstMbrs
          ),
          to_RqstVndrs: this.processVendorDetails(
            this.bidopeningCommitteeForm,
            this.vendorList,
            this.bidOpenData,
            this.data,
            this.CommitteeID,
            this.isDisabledPrice
          ),
          to_LmtdVndrs: this.getLimitedVendorsData(),
          to_Attach: this.combineOtherAttachmentsWithUpdated(),
        };
      }

      if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
        data.CompetitionTypeID =
          this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
      }
      if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
        data.ChairmanCmnts =
          this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
      }
      if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
        data.BidOpngDate = moment(
          this.bidopeningCommitteeForm?.get('openingDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value) {
        data.FinanceOfferOpeningDate = moment(
          this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')?.value
        ).format('YYYYMMDD');
      }
      if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
        data.SubmissionDate = moment(
          this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
        ).format('YYYYMMDD');
      }
      // console.log(data, 'BFNC data');

      if (data) {
        // this.spinner.show();

        this.showConfirm(data, action);
      }
    }
  }

  saveAsDraftfromFinancialoffer(actionKey: UserActionCode) {
    this.VendorRequiredField = [];
    if (this.bidopeningCommitteeForm.getRawValue().addVender.length > 0) {
      let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
      /* vendorDetails.forEach((element: any) => {
        if (element.Price === '' || Number(element.Price) <= 0) {
          this.VendorRequiredField.length === 0
            ? this.VendorRequiredField.push({ status: true })
            : '';
        }
      }); */
      if (this.VendorRequiredField.length > 0) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Vendor Price is empty, negative, or zero. Please enter it.'
            : 'سعر البائع فارغ أو سالب أو صفر. الرجاء إدخاله.'
        );
      } else {
        this.bidOpenData[0].to_RqstVndrs.results.forEach((element: any) => {
          vendorDetails.forEach((data: any) => {
            if (data.VendorId === element.VendorId) {
              element.Price = data.Price.toString();
              (element.VendorCommercialNo = data.VendorCommercialNo.toString()),
                (element.MOMDts = data.MOMDts);
              element.ContentOffer = data.ContentOffer;
              element.AttachmentCmnts = data.AttachmentCmnts;
              element.FinancialOfferCmnts = data.FinancialOfferCmnts;
              element.to_VndrChkLst.results[0] = this.getIsAttachmentValid(
                data.CheckList[0]
              );
            }
          });
        });

        let MissingAttachmentChecklist: any = [];
        const vendorDetailValue = this.vendorList?.getRawValue();

        if (vendorDetails) {
          /* We can remove this commented code block once QAT is qualified. 
          vendorDetailValue.forEach((element: any, ind: number) => {
            element.CheckList.some((list: any, index: number) => {
              if (
                (list.ChecklistType === '03' || list.ChecklistType === '04') &&
                (list.AttachmentFlag === 'N' || list.AttachmentFlag === false)
              ) {
                if (MissingAttachmentChecklist.length === 0) {
                  MissingAttachmentChecklist.push(element.VendorName);
                } else {
                  const i = MissingAttachmentChecklist.findIndex(
                    (_element: any) => _element === element.VendorName
                  );
                  i === -1
                    ? MissingAttachmentChecklist.push(element.VendorName)
                    : '';
                }
              }
            });
            if (vendorDetailValue && vendorDetailValue.length - 1 === ind) {
              if (MissingAttachmentChecklist.length > 0) {
                this.commonService.createMessage(
                  'error',
                  MissingAttachmentChecklist.join(',') +
                  ' ' +
                  (this.commonService.userLanguage === 'en'
                    ? ' CheckList Attachments are missing'
                    : 'مرفقات قائمة التحقق مفقودة')
                );
              }
            }
          }); */

          if (MissingAttachmentChecklist.length === 0) {
            let data: any = {
              TndrID: this.data.TndrID,
              TndrName: this.data.TndrName,
              RFPNumber: this.data.RFPNumber,
              PurReqNo: this.data.PurReqNo,
              PurTypID: this.data.PurTypID,
              PurTypeDesc: this.data.PurTypeDesc,
              TndrTypeID: this.data.TndrTypeID,
              TndrTypeDesc: this.data.TndrTypeDesc,
              EtimadNo: this.data.EtimadNo,
              TndrStatus: this.data.TndrStatus,
              CommitteeID: this.CommitteeID,
              CommitteeName: localStorage.getItem('CommitteeName'),
              CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
              CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
              CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
              CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
              CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
              CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
              CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
              CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
              AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
              AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
              AsgnQualCmtOfficerID: this.result[0].AsgnQualCmtOfficerID,
              AsgnQualCmtOfficerName: this.result[0].AsgnQualCmtOfficerName,
              AsgnEvalCmtOfficerID: this.result[0].AsgnEvalCmtOfficerID,
              AsgnEvalCmtOfficerName: this.result[0].AsgnEvalCmtOfficerName,
              TchnclEvltnMmbrID: this.result[0].TchnclEvltnMmbrID,
              TchnclEvltnMmbrName: this.result[0].TchnclEvltnMmbrName,
              CurrentDate: this.commonService.getCurrentDateInApiFormat(
                new Date()
              ),
              IsSingleTender: this.result[0].IsSingleTender,
              IsTenderCancelled: this.result[0].IsTenderCancelled,
              IsTenderUrgent: this.result[0].IsTenderUrgent,
              MsgType: '',
              MsgVar1: '',
              MsgVar2: '',
              NoOfVndrs: String(
                this.bidopeningCommitteeForm.get('NoOfVndrs')?.value
              ),
              NoOfByres: String(
                this.bidopeningCommitteeForm.get('NoOfByres')?.value
              ),
              NoOfQualificationInvitation: this.data.NoOfQualificationInvitation,
              InvitationPublishDate: this.data.InvitationPublishDate,
              QualDocReceivingDate: this.data.QualDocReceivingDate,
              QualDocInspectionDate: this.data.QualDocInspectionDate,
              NoOfVndrsInvolvedInQual: this.data.NoOfVndrsInvolvedInQual,
              PassingRate: this.data.PassingRate,
              LgdInUsr: this.LogdInUsrID,
              LgdInUsrCmt: this.CommitteeID,
              LgdInUsrCmtRole: this.role,
              LgdInUsrAction: 'DFT',
              to_RqstMbrs: this.prepareCommitteeMembersDataForPost(
                this.to_RqstMbrs
              ),
              to_RqstVndrs: this.processVendorDetails(
                this.bidopeningCommitteeForm,
                this.vendorList,
                this.bidOpenData,
                this.data,
                this.CommitteeID,
                this.isDisabledPrice
              ),
              to_LmtdVndrs: this.getLimitedVendorsData(),
              to_Attach: this.combineOtherAttachmentsWithUpdated(),
            };

            if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
              data.CompetitionTypeID =
                this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
            }
            if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
              data.ChairmanCmnts =
                this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
            }
            if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
              data.BidOpngDate = moment(
                this.bidopeningCommitteeForm?.get('openingDate')?.value
              ).format('YYYYMMDD');
            }
            if (
              this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')
                ?.value
            ) {
              data.FinanceOfferOpeningDate = moment(
                this.bidopeningCommitteeForm?.get('FinanceOfferOpeningDate')
                  ?.value
              ).format('YYYYMMDD');
            }
            if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
              data.SubmissionDate = moment(
                this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
              ).format('YYYYMMDD');
            }

            // console.log(data)
            // console.log(this.processVendorDetails(this.bidopeningCommitteeForm, this.vendorList, this.bidOpenData, this.data, this.CommitteeID, this.isDisabledPrice))
            this.showConfirm(data, actionKey);
          }
        }
      }
    }
  }

  downloadMOMFinancial(type: string = '') {
    let postData = { TenderId: this.data.TndrID };
    this.spinner.show();
    this.api
      .post('/OCOM_TENDER_DETAILS', postData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (RR) => {
          this.spinner.hide();
          //  console.log(RR.d.results);
          let vendorDetails =
            this.bidopeningCommitteeForm.getRawValue().addVender;
          RR.d.results[0].to_RqstVndrs.results.forEach((element: any) => {
            vendorDetails.forEach((data: any) => {
              if (data.VendorId === element.VendorId) {
                element.Price = data.Price.toString();
                element.MOMDts = data.MOMDts;
                element.ContentOffer = data.ContentOffer;
                element.AttachmentCmnts = data.AttachmentCmnts;
              }
            });
          });

          let data: any = {
            TndrID: this.data.TndrID,
            TndrName: this.data.TndrName,
            RFPNumber: this.data.RFPNumber,
            PurReqNo: this.data.PurReqNo,
            PurTypID: this.data.PurTypID,
            PurTypeDesc: this.data.PurTypeDesc,
            TndrTypeID: this.data.TndrTypeID,
            TndrTypeDesc: this.data.TndrTypeDesc,
            EtimadNo: this.data.EtimadNo,
            TndrStatus: this.data.TndrStatus,
            CommitteeID: this.CommitteeID,
            CommitteeName: this.CommitteeName,
            CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
            CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
            CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
            CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
            CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
            CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
            CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
            CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
            AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
            AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
            AsgnQualCmtOfficerID: this.result[0].AsgnQualCmtOfficerID,
            AsgnQualCmtOfficerName: this.result[0].AsgnQualCmtOfficerName,
            AsgnEvalCmtOfficerID: this.result[0].AsgnEvalCmtOfficerID,
            AsgnEvalCmtOfficerName: this.result[0].AsgnEvalCmtOfficerName,
            TchnclEvltnMmbrID: this.result[0].TchnclEvltnMmbrID,
            TchnclEvltnMmbrName: this.result[0].TchnclEvltnMmbrName,
            CurrentDate: this.commonService.getCurrentDateInApiFormat(
              new Date()
            ),
            IsSingleTender: this.result[0].IsSingleTender,
            IsTenderCancelled: this.result[0].IsTenderCancelled,
            IsTenderUrgent: this.result[0].IsTenderUrgent,
            MsgType: '',
            MsgVar1: '',
            MsgVar2: '',
            LgdInUsr: this.LogdInUsrID,
            LgdInUsrCmt: this.CommitteeID,
            LgdInUsrCmtRole: this.role,
            LgdInUsrAction: 'DFT',
            to_RqstMbrs: this.prepareCommitteeMembersDataForPost(
              this.to_RqstMbrs
            ),
            to_RqstVndrs: RR.d.results[0].to_RqstVndrs,
            to_LmtdVndrs: this.getLimitedVendorsData(),
            to_Attach: this.combineOtherAttachmentsWithUpdated(),
          };

          if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
            data.CompetitionTypeID =
              this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
          }
          if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
            data.ChairmanCmnts =
              this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
          }
          if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
            data.BidOpngDate = moment(
              this.bidopeningCommitteeForm?.get('openingDate')?.value
            ).format('YYYYMMDD');
          }
          if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
            data.SubmissionDate = moment(
              this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
            ).format('YYYYMMDD');
          }

          if (data) {
            //  console.log(data);
            this.spinner.show();
            this.api
              .post('Cmt_create', data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (res: any) => {
                  this.spinner.hide();
                  if (res.d.MsgType === 'S') {
                    ///  console.log(res.d);
                    const payload = {
                      CommitteeID: this.CommitteeID,
                      TndrID: this.data.TndrID,
                      LoggedInID: atob(localStorage.getItem('ID')!),
                      Role: '01',
                      LoggedCmt: this.CommitteeID,
                      Identifier: this.commonService.returnMomIdentifier(
                        this.data.TndrTypeID,
                        type
                      ),
                    };
                    if (payload) {
                      const fileName =
                        this.data.TndrName + '_Financial_evaluation_';
                      this.cs.downloadMOM(payload, fileName);
                    }
                  } else {
                    this.commonService.createMessage('error', res.d.MessageEn);
                  }
                },
                (error) => {
                  this.spinner.hide();
                  // console.log(error);
                  this.commonService.createMessage('error', error.statusText);
                }
              );
          }
        },
        (error) => {
          this.spinner.hide();
          // console.log(error);
          // this.commonService.createMessage('error', error.statusText);
        }
      );
  }

  downloadMOM(type: string = '') {
    let vendorDetails = this.bidopeningCommitteeForm.getRawValue().addVender;
    vendorDetails.forEach((element: any) => {
      element.CheckList.forEach((list: any, index: number) => {
        list.ChecklistId = (index + 1).toString();
        list.IsAttachmentValid =
          list.IsAttachmentValid === true || list.IsAttachmentValid === 'N'
            ? 'N'
            : 'Y';
        list.AttachmentFlag =
          list.AttachmentFlag === true || list.AttachmentFlag === 'Y'
            ? 'Y'
            : 'N';
        list.TenderId = this.data.TndrID;
        list.VendorId = element.VendorId;
        list.CommitteeId = this.CommitteeID;
        // list.to_VndrChkAtt = [];
      });
      element.CommitteeId = this.CommitteeID;
      element.TenderId = this.data.TndrID;
      element.IsVndrfnclQualified = '';
      element.IsVndrtechQualified = '';
      element.MOMDts = element.MOMDts;
      element.ContentOffer = element.ContentOffer;
      element.AttachmentCmnts = element.AttachmentCmnts;
      element.VendorCommercialNo = element.VendorCommercialNo
        ? element.VendorCommercialNo.toString()
        : '';
      element.Price = this.commonService.removeCommas(element.Price.toString());
      element.to_VndrChkLst = element.CheckList;

      (element.to_VndrFnclEvl = []),
        (element.to_VndrTchnlEvl = []),
        (element.to_LeglEval = []),
        (element.to_TechEval = []);
      element.VndrTnclActualTotal = '';
      element.VndrFnclWgtgeTotal = '';
      element.VndrFnclActualTotal = '';
      element.VndrTnclWgtgeTotal = '';
      element.VndrTnclEvalScore = element.VndrTnclEvalScore
        ? element.VndrTnclEvalScore
        : '';

      delete element.CheckList;
      delete element.Comments;
    });
    let data: any = {
      TndrID: this.data.TndrID,
      TndrName: this.data.TndrName,
      RFPNumber: this.data.RFPNumber,
      PurReqNo: this.data.PurReqNo,
      PurTypID: this.data.PurTypID,
      PurTypeDesc: this.data.PurTypeDesc,
      TndrTypeID: this.data.TndrTypeID,
      TndrTypeDesc: this.data.TndrTypeDesc,
      EtimadNo: this.data.EtimadNo,
      TndrStatus: this.data.TndrStatus,
      CommitteeID: this.CommitteeID,
      CommitteeName: this.CommitteeName,
      CmtFrmtnOrderNodp: this.result[0].CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDate: this.result[0].CmtFrmtnOrdrDate,
      CmtFrmtnOrdrDatebec: this.result[0].CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrDatebqc: this.result[0].CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrdrDatedp: this.result[0].CmtFrmtnOrdrDatedp,
      CmtFrmtnOrdrNo: this.result[0].CmtFrmtnOrdrNo,
      CmtFrmtnOrdrNobec: this.result[0].CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrNobqc: this.result[0].CmtFrmtnOrdrNobqc,
      AsgnOpngCmtOfficerID: this.data.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.data.AsgnOpngCmtOfficerName,
      AsgnQualCmtOfficerID: '',
      AsgnQualCmtOfficerName: '',
      AsgnEvalCmtOfficerID: '',
      AsgnEvalCmtOfficerName: '',
      TchnclEvltnMmbrID: '',
      TchnclEvltnMmbrName: '',
      CurrentDate: this.commonService.getCurrentDateInApiFormat(new Date()),
      IsSingleTender: '',
      IsTenderCancelled: '',
      IsTenderUrgent: '',
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: 'DFT',
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: vendorDetails,
      to_LmtdVndrs: this.getLimitedVendorsData(),
      to_Attach: this.combineOtherAttachmentsWithUpdated(),
    };

    if (this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value) {
      data.CompetitionTypeID =
        this.bidopeningCommitteeForm?.get('CompetitionTypeID')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value) {
      data.ChairmanCmnts =
        this.bidopeningCommitteeForm?.get('ChairmanCmnts')?.value;
    }
    if (this.bidopeningCommitteeForm?.get('openingDate')?.value) {
      data.BidOpngDate = moment(
        this.bidopeningCommitteeForm?.get('openingDate')?.value
      ).format('YYYYMMDD');
    }
    if (this.bidopeningCommitteeForm?.get('SubmissionDate')?.value) {
      data.SubmissionDate = moment(
        this.bidopeningCommitteeForm?.get('SubmissionDate')?.value
      ).format('YYYYMMDD');
    }

    if (data) {
      this.spinner.show();
      this.api
        .post('Cmt_create', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.d.MsgType === 'S') {
              //  console.log(res.d);
              const payload = {
                CommitteeID: this.CommitteeID,
                TndrID: this.data.TndrID,
                LoggedInID: atob(localStorage.getItem('ID')!),
                Role: '01',
                LoggedCmt: this.CommitteeID,
                Identifier: this.commonService.returnMomIdentifier(
                  this.data.TndrTypeID,
                  type
                ),
              };
              if (payload) {
                const fileName = this.data.TndrName + '_Opening_Commitee_';
                this.cs.downloadMOM(payload, fileName);
              }
            } else {
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

  updateOTP(value: any) {
    // console.log(value);
    this.getOTPModel = value;

    if (value) {
      if (value === this.otp) {
        this.commonService.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        // this.showConfirm(this.bidEvalData);
      } else if (value !== this.otp) {
        this.commonService.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  // otp approval
  SubmitOTP(data: any) {
    if (data.length === 5) {
      //  console.log(data)
      if (data === this.otp) {
        console.log(data);
        this.commonService.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        this.postData(this.processedData);
      } else if (data !== this.otp) {
        this.commonService.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  getOTP() {
    let data = {
      UserId: this.commonService.getUserData().userid,
    };
    this.spinner.show();
    this.api
      .post('/OTP', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          //  console.log(res.d.results.MessageId)
          if (res.d.results[0].MessageId === 'S') {
            this.commonService.otpToast(res.d.results[0]);
            this.otp = res.d.results[0].OtpNo;
            // this.commonService.createMessage("success","Your OTP is "+this.otp)
            this.getOTPModel = !this.getOTPModel;
          } else if (
            res.d.results[0].MessageId === '' ||
            res.d.results[0].MessageId === 'E'
          ) {
            this.commonService.createMessage(
              'error',
              this.commonService.userLanguage === 'en'
                ? res.d.results[0].MessageEn
                : res.d.results[0].MessageAr
            );
          } else {
            this.commonService.createMessage(
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

  postData(data: any) {
    this.spinner.show();
    this.api
      .post('Cmt_create', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d.MsgType === 'S') {
            if (this.isVendorDetailsRequired) {
              const vendorRequests = this.vendorDetails.map((vendor) => {
                return this.api.post('vendor-details', vendor).toPromise()
              });
              Promise.all(vendorRequests).then(
                  () => {
                    this.spinner.hide();
                    this.commonService.createMessage(
                      'succes',
                      this.commonService.userLanguage === 'en' ?
                      'Success' : 'نجاح'
                    )
                    this.commonService.createMessage(
                      'success',
                      this.commonService.userLanguage === 'en'
                        ? res.d.MsgVar1
                        : res.d.MsgVar2
                    );
                    this.cs.activeMenu = `bidstobeopen`;
                    if (this.isOfficer && !this.isFinancialoffer) {
                      this.router.navigate(['committee/bo_officer_dashboard'], {
                        state: { ActiveTab: 'bidstobeopen' },
                      });
                    } else {
                      this.router.navigate(['committee/bo_member_dashboard'], {
                        state: { ActiveTab: 'bidstobeopen' },
                      });
                    }
                  },
                  () => {
                    this.spinner.hide();
                    this.commonService.createMessage(
                      'error',
                      this.commonService.userLanguage === 'en' ?
                      'Internal Server Error' : 'خطأ في الخادم الداخلي'
                    );
                  }
              ).catch((err) => {
                this.spinner.hide();
                this.commonService.createMessage(
                  'error',
                  err.statusText
                );
              })
            } else {
              this.spinner.hide();
              this.commonService.createMessage(
                'success',
                this.commonService.userLanguage === 'en'
                  ? res.d.MsgVar1
                  : res.d.MsgVar2
              );
              this.cs.activeMenu = `bidstobeopen`;
              if (this.isOfficer && !this.isFinancialoffer) {
                this.router.navigate(['committee/bo_officer_dashboard'], {
                  state: { ActiveTab: 'bidstobeopen' },
                });
              } else {
                this.router.navigate(['committee/bo_member_dashboard'], {
                  state: { ActiveTab: 'bidstobeopen' },
                });
              }
            }
          } else {
            this.spinner.hide();
            this.commonService.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.spinner.hide();
          this.commonService.createMessage('error', error.statusText);
        }
      );
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
      TenderId: [this.data.TndrID],
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
      ...this.bidopeningCommitteeForm.getRawValue().Attachments,
      ...list,
    ];

    return allAttachments;
  }

  getFormControlValue(controlName: string): string | Date {
    if (
      this.bidopeningCommitteeForm.get(controlName)?.value &&
      typeof this.bidopeningCommitteeForm.get(controlName)?.value === 'object'
    ) {
      return this.bidopeningCommitteeForm.get(controlName)?.value;
    }
    if (this.bidopeningCommitteeForm.get(controlName)?.value) {
      return this.bidopeningCommitteeForm.get(controlName)?.value.toString();
    }
    return '';
  }

  getValidCode(code: string | boolean): 'N' | 'Y' {
    if (code === true || code === 'N') {
      return 'N';
    }
    return 'Y';
  }

  getIsAttachmentValid(checkListObj: any) {
    checkListObj.IsAttachmentValid =
      checkListObj.IsAttachmentValid === true ||
      checkListObj.IsAttachmentValid === 'N'
        ? 'N'
        : 'Y';
    checkListObj.AttachmentFlag =
      checkListObj.AttachmentFlag === true ||
      checkListObj.AttachmentFlag === 'Y'
        ? 'Y'
        : 'N';
    return checkListObj;
  }

  // * Getter methods
  get isFormationFormEditable() {
    if (this.role === 'CH' && this.data.WFCmtMnuAction === 'BOPN') {
      return false;
    }
    return true;
  }

  get showFinancialOfferComments(): boolean {
    // * API Response holds the property Financial Offer
    const isFinancialOffer =
      this.bidOpenData?.[0]?.FinancialOffer === 'X' ? true : false;
    // * The Financial Offer comments should be visible only if above value is true
    if (isFinancialOffer) {
      return true;
    }

    return false;
  }

  get isCrNumberDisabled(): boolean {
    let _disabled = false;
    if (
      (this.role === 'CH' && this.data.WFCmtMnuAction !== 'BFNC') ||
      this.role === 'MR'
    ) {
      _disabled = true;
    }
    return _disabled;
  }

  restrictZero(event: any) {
    if (event.target.value.length === 0 && event.key <= '0') {
      event.preventDefault();
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

  filenetUpload(evt: any) {
    this.fileNetList.push({
      FilenetID:
        evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace(
          '{',
          ''
        ).replace('}', ''),
      FileName:
        evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CommitteeId: this.CommitteeID,
      CommitteeRole: this.role,
      CommitteeUser: this.LogdInUsrID,
      TenderId: this.data.TndrID,
    });

    this.fileNetList = [...this.fileNetList];
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: this.CommitteeID,
      CommitteeRole: this.role,
      CommitteeUser: this.LogdInUsrID,
      TenderId: this.data.TndrID,
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

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    this.actionButtons = actionButtonsList;

    const actionMap = {
      // Secretary Actions
      BOPN_OF_SUB: this.submitFromOfficer.bind(this, UserActionCode.submit),
      BOPN_OF_DFT: this.saveAsDraft.bind(this, UserActionCode.draft),
      BPRV_OF_SUB: this.submitFromOfficer.bind(this, UserActionCode.submit),
      BPRV_OF_DFT: this.saveAsDraft.bind(this, UserActionCode.draft),
      BFNC_OF_SUB: this.submitFromFinancialoffer.bind(
        this,
        UserActionCode.submit
      ),
      BFNC_OF_DFT: this.saveAsDraftfromFinancialoffer.bind(
        this,
        UserActionCode.draft
      ),

      // Chairman Actions
      BOPN_CH_ASG: this.submitFromFinancialoffer.bind(
        this,
        UserActionCode.assign
      ),
      BOPN_CH_RTS: this.ReturnToOfficer.bind(
        this,
        UserActionCode.returnToSecretary
      ),
      BFNC_CH_ASG: this.submitFromFinancialoffer.bind(
        this,
        UserActionCode.assign
      ),
      BFNC_CH_RTS: this.ReturnToOfficer.bind(
        this,
        UserActionCode.returnToSecretary
      ),

      // Opening Members Actions
      BOMR_MR_APR: this.submitFromMember.bind(this, UserActionCode.approve),
      BOMR_MR_RET: this.ReturnToOfficer.bind(this, UserActionCode.return),
      BFNC_MR_APR: this.submitFromFinancialoffer.bind(
        this,
        UserActionCode.approve
      ),
      BFNC_MR_RET: this.ReturnToOfficer.bind(this, UserActionCode.return),
      BOPN_MR_SUB: this.submitFromMember.bind(this, UserActionCode.submit),
      BOPN_MR_RET: this.ReturnToOfficer.bind(this, UserActionCode.return),

      // Chairman bids to be approved
      BAPR_CH_ABC: this.assignToBidEvaluationCommittee.bind(
        this,
        UserActionCode.assignToBidEvalCommittee
      ),
      BAPR_CH_RTS: this.ReturnToOfficer.bind(
        this,
        UserActionCode.returnToSecretary
      ),
    };

    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID } = button;

      // Define action mapping

      // Construct the key to look up in the actionMap
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}` as keyof ActionMap;

      // Assign the action if it exists in the actionMap
      if (button.OTP_Required === 'X') {
        this.buttonActionKeysthatRequiresOTP.push(actionKey);
      }

      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
      }
    });
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

  convertApiDateToDate(dateString: string): Date {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is 0-indexed in JS
    const day = parseInt(dateString.substring(6, 8), 10);

    return new Date(year, month, day);
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
        member.IsBackup === '' ? 'M' : member.IsBackup === 'X' ? 'B' : '', // Conditional logic for 'M' or 'B'
      TenderId: member.TenderId || '',
      isChecked: member.IsMemberSelected === 'X' ? true : false,
    }));
  }

  onmemberChange(event: Event, index: number) {
    const checkbox = event.target as HTMLInputElement;
    const member = this.committeeMembersList[index];

    // Update the SelectedMbr property

    if (checkbox.checked) {
      // Add member to selectedMembers if checked
      this.to_RqstMbrs.push(member);
    } else {
      // Remove member from to_RqstMbrs if unchecked
      this.to_RqstMbrs = this.to_RqstMbrs.filter(
        (selected) => selected.CommitteeUser !== member.CommitteeUser
      );
    }

    console.log('Selected Members:', this.to_RqstMbrs);
  }

  prepareCommitteeMembersDataForPost(
    members: CommitteeMembers[]
  ): Omit<CommitteeMembers, 'isChecked'>[] {
    return members.map(({ isChecked, ...rest }) => rest);
  }

  dynamicDownloadMoM(data: any) {
    const payload: doumentDownload = {
      CommitteeID: data.CommitteeId ?? '',
      TndrID: data.TenderId ?? '',
      Role: this.role,
      Identifier: data.Identifier ?? '',
    };

    this.cs.downloadMOM(payload, data.TenderId ?? '' + '_' + data.MomDecEn);
  }

  madateAttachmentChecklistIndicator(checklistId: string): boolean {
    if (this.bidOpenData?.[0]?.TndrTypeID === '01') {
      if (checklistId === '001' || checklistId === '002') {
        return true;
      }
    } else if (
      this.bidOpenData?.[0]?.TndrTypeID === '02' &&
      this.bidOpenData?.[0]?.FinancialOffer === 'X'
    ) {
      if (checklistId === '001') {
        return true;
      }
    } else if (
      this.bidOpenData?.[0]?.TndrTypeID === '02' &&
      this.bidOpenData?.[0]?.FinancialOffer === ''
    ) {
      if (checklistId === '002') {
        return true;
      }
    }
    return false;
  }
  disableNoBuyerAndVendor(): boolean {
    return this.isOfficer && this.data.WFCmtMnuAction === 'BOPN';
  }

  openingDataBasedonTenderType(): boolean {
    return this.bidOpenData?.[0]?.TndrTypeID === '01';
  }

  resetFinanceOfferOpeningDate() {
    console.log('resetFinanceOfferOpeningDate');
    this.bidopeningCommitteeForm.patchValue({
      FinanceOfferOpeningDate: '', // or '' for an empty string
    });
  }

  checkTechAndFinancialOfferOpeningDate(): boolean {
    //* Check tech opening date and finance opening date
    if (!this.openingDataBasedonTenderType()) {
      console.log('inside the 2 env');

      if (this.getInvalidFormControls().includes('openingDate')) {
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Technical offer opening date cannot be greater than Financial offer opening date' +
                this.invalidVendorNameList.join(', ')
            : this.invalidVendorNameList.join(', ') +
                'اسم الشركة مفقود لرقم التسلسل'
        );
        return true; // Validation failed
      }

      if (this.getInvalidFormControls().includes('FinanceOfferOpeningDate')) {
        console.log('inside the 2 env');
        this.commonService.createMessage(
          'error',
          this.commonService.userLanguage === 'en'
            ? 'Please fill the Technical offer opening date' +
                this.invalidVendorNameList.join(', ')
            : this.invalidVendorNameList.join(', ') +
                'اسم الشركة مفقود لرقم التسلسل'
        );
        return true; // Validation failed
      }
    }

    return false;
  }

  //   initializeChecklistChecker(vendorList: any){
  //     console.log(vendorList.length, 'no of vendors')
  //     this.checklistCheckerArray = [];
  //     for (let i = 1; i <= 8; i++) {
  //       this.checklistCheckerArray.push({ [`checklist${i}`]: false });
  //     }

  // }
  initializeChecklistChecker(vendors: any[]) {
    console.log(vendors, 'vendorListValues');
    if (vendors.length === 0) {
      vendors.push({}); // Push a placeholder object for one iteration
    }

    // Iterate over the new vendor list
    vendors.forEach((vendor: any, index: number) => {
      const vendorKey = `vendor${index + 1}`;

      // Check if the vendor key already exists
      if (!this.checklistCheckerArray[vendorKey]) {
        // If not, initialize the new vendor's checklist
        this.checklistCheckerArray[vendorKey] = [];

        for (let i = 1; i <= 10; i++) {
          this.checklistCheckerArray[vendorKey].push({
            [`checklist${i}`]: false,
          });
        }
      }
    });

    console.log(this.checklistCheckerArray, 'initiated checklistCheckerArray');
  }

  updateChecklistChecker(
    vendorIndex: number,
    checklistIndex: number,
    value: boolean
  ): void {
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
        console.error('Invalid checklist index provided.');
      }
    } else {
      console.error('Invalid vendor index provided.');
    }

    console.log(this.checklistCheckerArray, 'updated');
  }

  isAttachmentPresent(vendorID: string, CheckListID: string) {
    console.log(vendorID, CheckListID);

    let params: highLevelDocParams = this.testFnParams(vendorID, CheckListID);
    console.log(params);
    let audjestedCheckListId: number = Number(CheckListID) + 1;

    const docParams: docParams = {
      DefId: String(audjestedCheckListId),
      EntityId: params.firstLevelId,
      EntityName: params.firstLevelName,
      HeaderKey: 'P2PCommitte',
      ItemKey: 'VendorEval',
      ItemSecKey: '',
      RelatedEntityId: params.VendorGUID,
      RelatedEntityName: params.secondLevelName,
    };

    let docResult: any;
    this.api.post('documentDetailsGet', docParams).subscribe({
      next: (res) => {
        console.log(res), (docResult = res);

        if (docResult?.MessType === 'S') {
          // console.log(true)
          this.updateChecklistChecker(
            Number(vendorID),
            Number(CheckListID),
            true
          );
        } else {
          this.updateChecklistChecker(
            Number(vendorID),
            Number(CheckListID),
            false
          );
          // console.log(false)
        }
      },
      error: (err) => console.log(err),
    });

    // console.log(docParams)
    // console.log(this.checklistCheckerArray)
  }
  formatVendorNumber = (value: number | string): number => {
    if (!value) return 0;
    
    // Remove non-numeric characters and restrict to 10 digits
    const numericValue = value.toString().replace(/\D/g, '').slice(0, 10);
    
    return Number(numericValue);
  };
  
  parseVendorNumber = (value: string): string => {
    // Remove non-numeric characters before parsing input
    return value.replace(/\D/g, '').slice(0, 10);
  };
  
  onCommercialNoValueChange(value: number | string, index: number) {
    
    const maxLength = 10;
  
    // Ensure only numeric input and restrict to 10 digits
    const numericString = value.toString().replace(/\D/g, '').slice(0, maxLength);
  
    
  
    // Get the specific FormGroup at the given index
    const formGroup = this.VendorFormGroup.controls[index];
  
    // Avoid infinite loop by checking if the new value is different
    if (formGroup.get('VendorCommercialNo')?.value !== numericString) {
      formGroup.get('VendorCommercialNo')?.setValue(numericString, { emitEvent: false });
    }
  }
  processVendorDetails(
    form: any,
    vendorList: any,
    bidOpenData: any,
    data: any,
    CommitteeID: any,
    isDisabledPrice: any
  ) {
    let VendorRequiredField = [];
    let vendorDetails = form.getRawValue().addVender;

    // Validation for required fields and conditions in vendor details
    vendorDetails.forEach(
      (element: {
        VendorName: string;
        MOMDts: string;
        ContentOffer: string;
        AttachmentCmnts: string;
        Price: any;
      }) => {
        this.vendorDetails = [];
        if (
          element.VendorName === '' ||
          element.MOMDts === '' ||
          element.ContentOffer === '' ||
          (element.AttachmentCmnts === '' &&
            bidOpenData[0] &&
            bidOpenData[0].TndrTypeDesc == 'Two Envelope') ||
          (Number(element.Price) <= 0 && isDisabledPrice != true)
        ) {
          if (VendorRequiredField.length === 0) {
            VendorRequiredField.push({ status: true });
          }
        }
      }
    );

    // Check for missing attachments in checklist
    let MissingAttachmentChecklist: any[] = [];
    vendorDetails = vendorList?.getRawValue();

    vendorDetails.forEach((element: any) => {
      element.CheckList.some((list: any) => {
        if (
          (list.ChecklistType === '03' || list.ChecklistType === '04') &&
          (list.AttachmentFlag === 'N' || list.AttachmentFlag === false)
        ) {
          if (MissingAttachmentChecklist.length === 0) {
            MissingAttachmentChecklist.push(element.VendorName);
          } else {
            const i = MissingAttachmentChecklist.findIndex(
              (_element) => _element === element.VendorName
            );
            if (i === -1) MissingAttachmentChecklist.push(element.VendorName);
          }
        }
      });
    });

    // Count vendors with valid or no attachments
    let vndrCount = 0;
    vendorDetails.forEach((vnd: any) => {
      if (
        vnd &&
        (vnd.CheckList.find(
          (node: any) =>
            node.IsAttachmentValid &&
            (node.AttachmentFlag == 'Y' || node.AttachmentFlag == true)
        ) ||
          !vnd.CheckList.find((node: any) => node.IsAttachmentValid))
      ) {
        vndrCount++;
      }
    });

    // Process vendor details if all are valid
    if (vendorDetails.length === vndrCount) {
      vendorDetails.forEach((element: any, vendorIndex: number) => {

        console.log(this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]);
        element.CheckList.forEach((list: any, index: any) => {
          list.ChecklistId = (index + 1).toString();
          list.IsAttachmentValid =
            list.IsAttachmentValid === true || list.IsAttachmentValid === 'N'
              ? 'N'
              : 'Y';
          list.AttachmentFlag =
            list.AttachmentFlag === true || list.AttachmentFlag === 'Y'
              ? 'Y'
              : 'N';
          list.TenderId = data.TndrID;
          list.VendorId = element.VendorId;
          list.CommitteeId = CommitteeID;
        });

        // Assign additional properties to vendor element
        element.CommitteeId = CommitteeID;
        element.TenderId = data.TndrID;
        element.IsVndrfnclQualified = '';
        element.IsVndrtechQualified = '';
        element.VendorCommercialNo = element.VendorCommercialNo
          ? element.VendorCommercialNo.toString()
          : '';
        element.Price = element.Price ? element.Price.toString() : '';
        element.to_VndrChkLst = element.CheckList;
        element.to_VndrFnclEvl =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.to_VndrFnclEvl || [];
        element.to_VndrTchnlEvl =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.to_VndrTchnlEvl || [];
        element.to_LeglEval =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]?.to_LeglEval ||
          [];
        element.to_TechEval =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]?.to_TechEval ||
          [];
        element.VndrTnclActualTotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclActualTotal || '0.0000';
        element.VndrFnclWgtgeTotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrFnclWgtgeTotal || '0.00';
        element.VndrFnclActualTotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrFnclActualTotal || '0.0000';
        element.VndrTnclWgtgeTotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclWgtgeTotal || '0.00';
        element.VndrTnclEvalScore =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclEvalScore || '';

        // Add missing fields from the first object
        element.EvalCMTVndrtnclactualtotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.EvalCMTVndrtnclactualtotal || '0.0000';
        element.EvalCMTVndrtnclwgtgetotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.EvalCMTVndrtnclwgtgetotal || '0.0000';
        element.FinalPriceOffer =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.FinalPriceOffer || '0.00';
        element.IsCriteriaApplicable =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.IsCriteriaApplicable || '';
        element.IsSME =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]?.IsSME || '';
        element.IsVendorSelected =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.IsVendorSelected || '';
        element.LglDisqltnReason =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.LglDisqltnReason || '';
        element.PricePreference =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.PricePreference || '0.00';
        element.QftnLvlDescAR =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.QftnLvlDescAR || '';
        element.QftnLvlDescEN =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.QftnLvlDescEN || '';
        element.QualCmtVndractualtotal =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.QualCmtVndractualtotal || '0.0000';
        element.QualftnLvlID =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]?.QualftnLvlID ||
          '';
        element.Ranking =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]?.Ranking ||
          '00';
        element.TchnclMbrCmnt =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.TchnclMbrCmnt || '';
        element.TechnicalOfferCmnts =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.TechnicalOfferCmnts || '';
        element.VndrFinevalwgtge =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrFinevalwgtge || '0.00';
        element.VndrLegalResult =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrLegalResult || '';
        element.VndrTechevalwgtge =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrTechevalwgtge || '0.00';
        element.VndrTechnicalResult =
          this.bidOpenData[0].to_RqstVndrs.results[vendorIndex]
            ?.VndrTechnicalResult || '';

        // Remove unnecessary properties
        delete element.CheckList;
        delete element.Comments;

        this.vendorDetails.push({
          CrNumber: element.VendorCommercialNo ?? '',
          NameOrg: element.VendorName ?? '',
          BuildingNo: element.BuildingNo ?? '',
          Street: element.Street ?? '',
          ZipCode: element.ZipCode ?? '',
          City: element.City ?? '',
          CountryId: element.CountryId ?? '',
          PhoneNo: element.PhoneNo ?? '',
          Email: element.Email ?? '',
          ind: '',
          to_bnkdt: []
        });

        delete element.BuildingNo;
        delete element.Street;
        delete element.ZipCode;
        delete element.City;
        delete element.CountryId;
        delete element.PhoneNo;
        delete element.Email;
      });
    }

    return vendorDetails;
  }
}
