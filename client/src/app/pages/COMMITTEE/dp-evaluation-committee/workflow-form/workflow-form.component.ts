import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
// import { cs } from 'src/app/service/common.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import {
  CheckList,
  COMMITTEE_ROLE,
  LegalRest,
  tendertypes,
  UserActionCode,
  DocParamsLevels,
} from 'src/app/shared/shared';
import { BidEvaluationCommitteeComponent } from '../../BIDOPEN/bid-evaluation/bid-evaluation-committee/bid-evaluation-committee.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { ApiService } from 'src/app/service/RFP/api.service';
import { takeUntil } from 'rxjs/operators';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import * as moment from 'moment';
import {
  actionButtonDetails,
  ActionMap,
  DPActionMap,
  CommitteeMembers,
  CommitteeMembersFromAPI,
  Country,
  docParams,
  doumentDownload,
  highLevelDocParams,
  dropDown,
  TechnicalRequirementStauts,
} from '../../committee.model';

import * as _l from 'lodash';
import {
  EnvType,
  PurchaseType,
  REGEX,
  VendorPayload,
} from 'src/app/shared/shared';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { differenceInCalendarDays } from 'date-fns';
import { CommitteeService } from '../../committee.service';
import { IconList } from 'src/app/components/icon/icon.component';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements OnInit {
  evaluationData: any[] = [];
  DPEvaluationForm!: FormGroup;
  DPEvaluationData: any;
  dateFormat = 'yyyy/MM/dd';
  isDisableNoofVendors: boolean = false;
  membersList: any[] = [];
  countryList: Country[] = [];
  vendorDetails: any[] = [];
  postVendorDetails: any[] = [];
  isCEO: boolean = false;
  CommitteeID = this.cs.getUserData().CommitteeId;
  role: string = 'CHBO';
  public readonly COMMITTEE_ROLE = COMMITTEE_ROLE;
  private readonly destroy$ = new Subject<void>();
  initailDPData: any;
  sl = 1;
  isDisabledDate: boolean = false;
  isChaiman: boolean = false;
  isDisableSubmitQuotationDate: boolean = false;
  committeeUsers: any[] = [];
  to_RqstMbrs: CommitteeMembers[] = [];
  committeeMembersList: CommitteeMembers[] = [];

  vendorlistname: any = [];
  vendorList?: FormArray;
  checklistCheckerArray: { [vendorKey: string]: { [key: string]: boolean }[] } =
    {};
  Status: any;
  selectedStatus: any = [];
  to_VndrChkLst = CheckList;
  selectedVendors: string[] = [];
  IsFileUploaded: boolean = false;
  actionButtons!: actionButtonDetails[];
  buttonActionKeysthatRequiresOTP: string[] = [];
  LogdInUsrID: any = '';
  isDisabledPrice: boolean = false;
  fileNetList: any[] = [];
  otherCommitteeAttachments: any[] = [];
  committeeUserName: any = [];
  committeeBackupUserName: any = [];
  committeAction: string = '';
  showAddComments: boolean = false;
  showAddCommentsT: boolean = false;
  Vcmt: any;
  getOTPModel: boolean = false;
  otp: any;
  confirmModal?: NzModalRef; // For testing by now
  processedData: any;
  estimatedAmount = 0.00;
  MOMTypesList: dropDown[] = [];
  initialVendorSelectionList: boolean[] = [];
  showBo: boolean = false;
  QntySum: number = 0;
  boqArray: any[] = [];
  showCommentsT: boolean = false;
  Tcmt: any;
  IconList = IconList;
  today = new Date();
  showChecklists: boolean = false;
  selectedVendorGUID: string = '';
  seletedVenCom: string = ''
  TypeOfPurchase = PurchaseType;
  Tenderingresult = EnvType;

  F4_TechReqStatus: TechnicalRequirementStauts[] = [];
  groupedBoq: { [year: string]: BoqItem[] } = {}; 
  expandIconPosition: 'left' | 'right' = 'right';
  estPrice: number = 0;
  estPriceWithoutVAT: number =0;
  rfpNo: string | null = null;


  disabledFutureDate = (current: Date): boolean =>
      // Can not select days before today and today
      differenceInCalendarDays(
        this.DPEvaluationForm.controls['OpeningDate'].value,
        current
      ) < 0;

  public disablePastDays = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;


  @Output()
  paramsForDocHandle = new EventEmitter();

  constructor(
    public cs: CommonService,
    private fb: FormBuilder,
    private filterPipe: FilterPipe,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private formDataService: PassFormDataService,
    private modal: NzModalService,
    public translate: TranslateService,
    private router: Router,
    private committeeService: CommitteeService
    

  ) {
    this.initailDPData = this.formDataService.getData();
  }

  ngOnInit(): void {
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID');
    this.CommitteeID = localStorage.getItem('CMTID');
    if (this.CommitteeID) {
      this.role = this.cs.getUserRoleBasedOnCmtID(this.CommitteeID);
    }
    this.committeAction = this.initailDPData.WFCmtMnuAction;
    this.getDPTenderDetails();
    this.initDPForm();
    this.getF4CheckListType();
    this.currentRoleAndMenuChecker();
    this.loadDropdownData()
  }

  private initDPForm() {
    this.DPEvaluationForm = this.fb.group({
      // membercheck: new FormControl(false),
      // backupmembercheck: new FormControl(false),
      TenderName: new FormControl({
        value: this.initailDPData?.TndrName,
        disabled: true,
      }),
      CommitteeHead: new FormControl({ value: '', disabled: true }),
      // ChairmanCmnts: new FormControl({ value: '', disabled: true }),
      // committeeHeadMembers: new FormControl(''),
      OpeningDate: new FormControl({
        value: '',
        disabled: true,
      }, [Validators.required]),
      // FinanceOfferOpeningDate: new FormControl({
      //   value: '',
      //   disabled: this.isDisabledDate,
      // }),
      ReferenceNumber: new FormControl({
        value: this.initailDPData.PurReqNo,
        disabled: true,
      }),
      // Comments: new FormControl(
      //   '',
      //   this.isChaiman ? Validators.required : null
      // ),
      TypeofPurchase: new FormControl({
        value: this.initailDPData.PurTypID,
        disabled: true,
      }),
      TypeofTendering: new FormControl({
        value: this.initailDPData.TndrTypeID,
        disabled: true,
      }),
      EtimadNumber: new FormControl({
        value: this.initailDPData.EtimadNo,
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
      // listOfVendors: new FormControl([]),
      Department: new FormControl({
        value: this.initailDPData.DepText,
        disabled: true,
      }),
      QuotationSubmissionDate: new FormControl({
        value: '',
        disabled: this.isDisableSubmitQuotationDate,
      }, [Validators.required]),
      momtype: new FormControl({
        value: '',
        disabled: false
      }, [Validators.required]),
      FinalOfferPrice: new FormControl({
        value: '',
        disabled: false,
      }, [Validators.required]),
      NoofVendors: new FormControl({ value: '', disabled: true }, [Validators.required]),
      CmtFrmNumber: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      CmtFrmDate: new FormControl(
        { value: this.initailDPData?.CmtFrmtnOrdrDate, disabled: true },
        Validators.required
      ),
      addVender: this.fb.array([this.createVender()]),
      Attachments: this.fb.array([]),
    });

    this.vendorList = this.DPEvaluationForm.get('addVender') as FormArray;
    this.enableAndDisableFieldBasedOnTheRole();
  }

  get isVendorDetailsRequired(): boolean {
    return this.isOFWithBOPN;
  }

  loadInitDpFormData() {

    this.estimatedAmount = parseFloat(this.DPEvaluationData.EstPrice);

    this.getF4Members();

    this.getStatusList(false);

    this.DPEvaluationForm.patchValue({
      TenderName: this.DPEvaluationData.TndrName,
      OpeningDate: this.DPEvaluationData.BidOpngDate && 
                    this.DPEvaluationData.BidOpngDate !== '00000000' ? 
                    this.cs.getDa(this.DPEvaluationData.BidOpngDate) : null,
      CmtFrmNumber: this.DPEvaluationData.CmtFrmtnOrderNodp,
      CmtFrmDate: this.DPEvaluationData.CmtFrmtnOrdrDatedp && 
                      this.DPEvaluationData.CmtFrmtnOrdrDatedp !== '00000000' ? 
                      this.cs.getDa(this.DPEvaluationData.CmtFrmtnOrdrDate) : null,
      EtmdSubDate: this.DPEvaluationData.EtmdSubDate && 
                     this.DPEvaluationData.EtmdSubDate !== '00000000' ? 
                     this.cs.getDa(this.DPEvaluationData.EtmdSubDate) : null,
      QuotationSubmissionDate: this.DPEvaluationData.SubmissionDate && 
                               this.DPEvaluationData.SubmissionDate !== '00000000' ? 
                               this.cs.getDa(this.DPEvaluationData.SubmissionDate) : null,
      NoofVendors: this.DPEvaluationData.NoOfVndrs !== '00' ? this.DPEvaluationData.NoOfVndrs : '',
      ReferenceNumber: this.DPEvaluationData.PurReqNo,
      CmtFrmtnOrdrNo: this.DPEvaluationData.CmtFrmtnOrdrNo,
      momtype: this.DPEvaluationData.MomType,
      
      FinalOfferPrice: this.DPEvaluationData.FinalOfferPrice
      
    });
     if (parseFloat(this.DPEvaluationData.FinalOfferPrice) === 0) {
      console.log(this.DPEvaluationData.FinalOfferPrice)
      const vendorWithCriteria = this.DPEvaluationData.to_RqstVndrs.results.find(
        (vendor: any) => vendor.IsCriteriaApplicable === '01' && vendor.Price
      );

      if (vendorWithCriteria) {
        this.DPEvaluationForm.get('FinalOfferPrice')?.setValue(vendorWithCriteria.Price);
      }
    }

    //* action btn init
    this.setActionsinActionButtons(this.DPEvaluationData.to_Button.results);

    this.DPEvaluationForm.get('momtype')?.valueChanges.subscribe((momType) => {
      if (momType === 'CANCEL_TEN') {
        this.DPEvaluationForm.get('FinalOfferPrice')?.removeValidators(Validators.required)
        this.DPEvaluationForm.get('FinalOfferPrice')?.disable();
        this.DPEvaluationForm.get('FinalOfferPrice')?.setValue('');
        this.initialVendorSelectionList = []
        this.vendorDetails.forEach((vendor: any, index: number) => {
            this.DPEvaluationData.to_RqstVndrs.results[index].IsVendorSelected = 'N'
            this.vendorDetails[index].IsVendorSelected = 'N'
            this.initialVendorSelectionList.push(false)
        })

      }else{
        this.DPEvaluationForm.get('FinalOfferPrice')?.setValidators(Validators.required)
        this.DPEvaluationForm.get('FinalOfferPrice')?.enable();
        this.DPEvaluationForm.get('FinalOfferPrice')?.setValue('');
        this.initialVendorSelectionList = []
        this.vendorDetails.forEach((vendor: any) => {
          if(vendor.IsVendorSelected === 'Y'){
            this.initialVendorSelectionList.push(true)
          }else{
            this.initialVendorSelectionList.push(false)
          }
        })

      }
    })

    //* attachments init
    if (this.DPEvaluationData.to_Attach) {
      const { committeeFiles, notCommitteeFiles } =
        this.DPEvaluationData.to_Attach.results.reduce(
          (acc: any, node: any) => {
            // if (node.FilenetID && node.FileName) {
            //   if (this.CommitteeID === node.CommitteeId) {
            //     acc.committeeFiles.push(node);
            //   } else {
            //     acc.notCommitteeFiles.push(node);
            //   }
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
      this.fileNetList = [...committeeFiles];
      this.otherCommitteeAttachments = [...notCommitteeFiles];
    }
    //* checklist validation helper init
    let selectedvendors = this.DPEvaluationData.to_RqstVndrs.results;
    this.vendorDetails = this.DPEvaluationData.to_RqstVndrs.results;
    let highestTechScore = 0;
    this.vendorDetails.forEach((vendor: any) => {
      if (parseFloat(vendor.VndrTechevalwgtge) > highestTechScore) {
        highestTechScore = parseFloat(vendor.VndrTechevalwgtge)
      }
    })
    if (this.DPEvaluationData.MomType === 'CANCEL_TEN') {
      this.DPEvaluationForm.get('FinalOfferPrice')?.removeValidators(Validators.required)
      this.DPEvaluationForm.get('FinalOfferPrice')?.disable();
      this.DPEvaluationForm.get('FinalOfferPrice')?.setValue('');
    }
    this.vendorDetails.forEach((vendor: any) => {
      if (vendor.IsVendorSelected !== '') {
        if (vendor.IsVendorSelected === 'Y') {
          this.initialVendorSelectionList.push(true)
        } else {
          this.initialVendorSelectionList.push(false)
        }
      }
      else {
        if (vendor.IsCriteriaApplicable === '01') {
          this.initialVendorSelectionList.push(true);
          vendor.IsVendorSelected = 'Y';  
        }
        else {
          this.initialVendorSelectionList.push(false);
           vendor.IsVendorSelected = 'N'; 
        }
      }
    })
    if (selectedvendors.length > 0) {
      this.vendorList?.removeAt(0)
    }
    for (
      let index = 0;
      index < selectedvendors.length;
      index++
    ) {
      this.vendorList?.push(this.createVender(true));
    }
    if (selectedvendors.length > 0) {
      this.vendorlistname = selectedvendors;
      this.DPEvaluationForm.controls['addVender'].patchValue(selectedvendors);
      if (!this.isVendorDetailsRequired) {
        this.DPEvaluationForm.controls['addVender'].disable();
      } else {
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
      this.populateCheckListData(this.to_VndrChkLst, 0);
    }
    this.initializeChecklistChecker(selectedvendors);
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
    if (this.disableVendorSelection()) {
      this.DPEvaluationForm.get('FinalOfferPrice')?.disable()
    }
  }

  selectVendor(value: any, selectedVendorId: any) {
    const i = this.DPEvaluationData.to_RqstVndrs.results.findIndex(
      (vendor: any) => vendor.VendorId === selectedVendorId
    );

    this.initialVendorSelectionList[i] = value
    if (value == true) {
      this.DPEvaluationData.to_RqstVndrs.results[i].IsVendorSelected = 'Y';
    } else {
      this.DPEvaluationData.to_RqstVndrs.results[i].IsVendorSelected = 'N';
    }
  }

  get isOnlyVendorSelected(): boolean {
    console.log(this.DPEvaluationData.to_RqstVndrs.results)
    return this.DPEvaluationData.to_RqstVndrs.results.filter(
      (vendor: any) => vendor.IsVendorSelected === 'Y'
    ).length > 1 || this.DPEvaluationData.to_RqstVndrs.results.filter(
      (vendor: any) => vendor.IsVendorSelected === 'Y'
    ).length === 0;
  }

  disableVendorSelection(): boolean{
    if (
      this.DPEvaluationForm.getRawValue().momtype !== 'CANCEL_TEN' &&
      (( 
        this.role === 'OF' && 
        (this.committeAction === 'BAPR' || this.committeAction === 'BEMR')
      ) || 
      ( 
        this.role === 'CH' && 
        (this.committeAction === 'BAPR' || this.committeAction === 'BEMR')
      ))
    ) {
      return false
    }
    return true
  }

  // code before DP new workflow was implemenetd
  // getF4Members() {
  //   let cmtid = {
  //     Id: this.isEstimatedLess ? '06' : '04',
  //     TndrId: this.initailDPData.TndrID,
  //   };
  //   this.api
  //     .post('/F4_MEMBERS', cmtid)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((membersList) => {
  //       let tempMembersList = membersList.d.results.filter((el: any) => {
  //         if (this.isEstimatedLess) {
  //           if (el.CommitteeRole === 'TM') {
  //             return el;
  //           }
  //         } else {
  //           if (el.CommitteeRole === 'CH') {
  //             this.DPEvaluationForm.controls['CommitteeHead'].patchValue(
  //               this.cs.userLanguage === 'en' ? el.CommitteeUserName : el.CommitteeUserName_AR)
  //           }
  //           if (el.CommitteeRole === 'MR') {
  //             return el;
  //           }
  //         }
  //       });
  //       this.committeeMembersList = this.transformMembers(tempMembersList);
  //       this.to_RqstMbrs = this.committeeMembersList;
  //     });
  // }

getF4Members() {
  let cmtid = {
    Id: this.initailDPData.WFCmtMnuAction === ('BEMR') || this.initailDPData.WFCmtMnuAction === ( 'BAPR') ? '04' : '06',
    TndrId: this.initailDPData.TndrID,
  };

  this.api
    .post('/F4_MEMBERS', cmtid)
    .pipe(takeUntil(this.destroy$))
    .subscribe((membersList) => {
      let tempMembersList = membersList.d.results.filter((el: any) => {
        if (this.initailDPData.WFCmtMnuAction === 'BEMR' || this.initailDPData.WFCmtMnuAction === 'BAPR') {
          // New logic for BEMR
          if (el.CommitteeRole === 'CH') {
            this.DPEvaluationForm.controls['CommitteeHead'].patchValue(
              this.cs.userLanguage === 'en' ? el.CommitteeUserName : el.CommitteeUserName_AR
            );
          }
          if (el.CommitteeRole === 'MR') {
            return el;
          }
        } else {
          // Old logic when NOT BEMR
          if (this.isEstimatedLess) {
            if (el.CommitteeRole === 'TM') {
              return el;
            }
          } else {
            if (el.CommitteeRole === 'CH') {
              this.DPEvaluationForm.controls['CommitteeHead'].patchValue(
                this.cs.userLanguage === 'en' ? el.CommitteeUserName : el.CommitteeUserName_AR
              );
            }
            if (el.CommitteeRole === 'MR') {
              return el;
            }
          }
          // Default fallback: return TM if nothing matched
        if (el.CommitteeRole === 'TM') {
          return el;
        }
        }
      });
      this.committeeMembersList = this.transformMembers(tempMembersList);
      this.to_RqstMbrs = this.committeeMembersList;
    });
}

  getF4CheckListType() {
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
  }

  loadDropdownData() {
    forkJoin({
      momTypes: this.committeeService.getMOMtypes(),
      country: this.api.post("getCountryList", {})
    }).subscribe({
      next: ({ momTypes, country }) => {
        this.MOMTypesList = momTypes;
        this.countryList = country.d.results;
      },
      error: (err) => {
        console.error('Error loading dropdown data:', err);
      },
    });
  }

  getDPTenderDetails() {
    let payLoad = { TenderId: this.initailDPData.TndrID };

    // * Tender details based on tenderID for OF, MR, bidstobeapproved role
    // this.spinner.show();
    this.api
      .post('/OCOM_TENDER_DETAILS', payLoad)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tendDetails) => {
        this.DPEvaluationData = tendDetails?.d?.results[0];
        this.loadInitDpFormData();
      });
  }

  enableAndDisableFieldBasedOnTheRole() {
    const roleBasedFields: { [key: string]: string[] } = {
      OF: ['OpeningDate', 'NoofVendors'],
      ADMIN: ['field1', 'field2', 'field3', 'field4'],
      USER: ['field3'],
    };

    const fieldsToEnable = roleBasedFields[this.role] || [];

    fieldsToEnable.forEach((field) => {
      if (this.DPEvaluationForm.controls[field]) {
        this.DPEvaluationForm.controls[field].enable();
      }
    });
  }

  convertToDate(dateString: string) {
    return dateString && dateString !== '00000000' ? 
      moment(dateString, 'yyyy/MM/dd').toDate() : null;
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

  get VendorFormGroup() {
    return this.DPEvaluationForm.get('addVender') as FormArray;
  }

  // create vendor method
  createVender(val?: boolean): any {
    if (!val) {
      this.spinner.show();
      this.api.get('getvendorGUID').subscribe(
        (res) => {
          this.spinner.hide();
          // return this.createNewVendor(res.d.results[0].GUID);
          let control: any = this.DPEvaluationForm.get('addVender');
          if (control) {
            if (control.controls[control.controls.length - 1].controls[
              'VendorGUID'
            ].value === '') {
              control.controls[control.controls.length - 1].controls[
                'VendorGUID'
              ].patchValue(res.d.results[0].GUID);
            }
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
    return this.fb.group({
      VendorName: [{ value: '', disabled: false }],
      VendorId: [{ value: itno.toString(), disabled: true }],
      VendorCommercialNo: [{ value: '', disabled: false }],
      Price: [{ value: '', disabled: false }],
      CheckList: this.fb.array([]),
      Comments: [{ value: '', disabled: false }],
      MOMDts: [{ value: '', disabled: false }],
      ContentOffer: [{ value: '', disabled: false }],
      FinancialOfferCmnts: [{ value: '', disabled: false }],
      AttachmentCmnts: [{ value: '', disabled: false }],
      InitialGuranteeValue: [{ value: '', disabled: false }],
      VendorGUID: [
        {
          value: vendorID ? vendorID.toString() : '',
          disabled: false,
        },
      ],
      Street: new FormControl(''),
      BuildingNo: new FormControl(''),
      ZipCode: this.isVendorDetailsRequired
        ? new FormControl('', [Validators.required, Validators.minLength(5)])
        : new FormControl(''),
      City: this.isVendorDetailsRequired
        ? new FormControl('', [Validators.required])
        : new FormControl(''),
      CountryId: this.isVendorDetailsRequired
        ? new FormControl('', [Validators.required])
        : new FormControl(''),
      PhoneNo: this.isVendorDetailsRequired
        ? new FormControl('', [Validators.required, Validators.minLength(10)])
        : new FormControl(''),
      Email: this.isVendorDetailsRequired
        ? new FormControl('', [Validators.required, Validators.email])
        : new FormControl(''),
    });
  }

  changeFinalOfferPrice() {}

  memberSelected(event: Event, type: string, index: number) {}
  addVendor(i: number) {
    let vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
    let index = vendorDetails.length - 1;

    this.sl = parseInt(vendorDetails[index].VendorId) + 1;
    this.vendorList?.push(this.createVender());
    this.populateCheckListData(
      this.to_VndrChkLst,
      Number(this.vendorList?.length) - 1
    );
    this.initializeChecklistChecker(this.vendorList?.value);
    this.selectedVendors[i] = this.vendorList?.value[i].VendorName;
  }

  populateCheckListData(data: any[], i: number) {
    console.log(data)
    data.forEach((ele) => {
      let controls = this.VendorFormGroup.controls[i].get(
        'CheckList'
      ) as FormArray;
      controls.push(this.fb.group(ele));
      (<FormArray>(
        this.VendorFormGroup.controls[i].get('CheckList')
      )).controls.forEach((ele: any) => {
        if (ele.get('ChecklistType').value === '') {
          ele.get('ChecklistType').patchValue(this.Status[0].ChklstTypeID);
        }
        let checkListId = ele.get('ChecklistId').value;
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
        if (this.role === 'OF') {
          control.enable();
          return;
        }

        // * Default all disabled
        control.disable();
      });
    });
  }
  initializeChecklistChecker(vendors: any[]) {
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
  }

  updateChecklistChecker(
    vendorIndex: number,
    checklistIndex: number,
    value: boolean
  ): void {
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

      } else {
        console.error('Invalid checklist index provided.');
      }
    } else {
      console.error('Invalid vendor index provided.');
    }

  }
  checkListFormGroups(i: number) {
    return this.VendorFormGroup.controls[i].get('CheckList') as FormArray;
  }

  madateAttachmentChecklistIndicator(checklistId: string): boolean {
    if (this.DPEvaluationData.TndrTypeID === '01') {
      if (checklistId === '002') {
        return true;
      }
    }
    return false;
  }
  changeStatus(venId: any, checkListID: any, status: any) {
    let vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
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

  isAttachmentPresent(vendorID: string, CheckListID: string) {

    let params: highLevelDocParams = this.testFnParams(vendorID, CheckListID);
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
        }
      },
      error: (err) => console.log(err),
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
    const currTenderId = _l.get(this.initailDPData, 'TndrID', '');
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
    return objToReturn;
  }

  SelectedvendorId: any;
  SelectedcheckListId: any;
  IsAttachmentModel: any = false;
  showChkAttachModal(vdId: any, checkId: any) {
    this.SelectedvendorId = vdId;
    this.SelectedcheckListId = checkId;
    let vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
    this.cs.successMsg$.pipe(takeUntil(this.destroy$)).subscribe((msg: any) => {
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
    if (_event && _event.hasOwnProperty('checkListID')) {

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

  getIsApplicableorNot(statusID: string): string {
    const currentStatus = this.F4_TechReqStatus.find(status => status.TechReqStatusID === statusID)
    if (this.cs.userLanguage === 'en') {
      return currentStatus?.TechReqStatusDescEN ?? '-';
    } else {
      return currentStatus?.TechReqStatusDescAR ?? '-';
    }
  }

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    this.actionButtons = actionButtonsList;
    const actionMap = {
      // Secretary
      BOPN_OF_SUB: this.onDPFormsubmit.bind(this, UserActionCode.submit),
      BOPN_OF_DFT:this.onDPFormsubmit.bind(this, UserActionCode.draft),
      BOPN_OF_ATM: this.onDPFormsubmit.bind(this, UserActionCode.assignToTechnicalMember),
      BEMR_OF_SUB: this.onDPFormsubmit.bind(this, UserActionCode.submit),
      BFAP_OF_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),
      BAPR_OF_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),
      BOPN_OF_ABT: this.onDPFormsubmit.bind(this, UserActionCode.assignToTechCommittee),

      //Chairman
      BOPN_CH_RTS: this.onDPFormsubmit.bind(this, UserActionCode.returnToSecretary),
      BOPN_CH_ABT: this.onDPFormsubmit.bind(this, UserActionCode.assignToTechCommittee),
      BEMR_CH_SUB: this.onDPFormsubmit.bind(this, UserActionCode.submit),
      BEMR_CH_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),
      BAPR_CH_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),
      BAPR_CH_RET: this.onDPFormsubmit.bind(this, UserActionCode.return),

      // Member
      BEMR_MR_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),
      BEMR_MR_RTS: this.onDPFormsubmit.bind(this, UserActionCode.returnToSecretary),
      BEMR_OF_APR: this.onDPFormsubmit.bind(this, UserActionCode.approve),

      // CEO
      BFAP_CO_CAP: this.onDPFormsubmit.bind(this, UserActionCode.ceoApproval),

      // Purchasing Manager
      BFAP_PR_APR: this.onDPFormsubmit.bind(this, UserActionCode.purchasingManagerApproval),
      BFAP_PR_RET: this.onDPFormsubmit.bind(this, UserActionCode.purchasingManagerReturn),

      // Purchasing Unit Head
      BFAP_PU_APR: this.onDPFormsubmit.bind(this, UserActionCode.purchasingUnitHeadApproval),
    };
    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID } = button;

      // Define action mapping

      // Construct the key to look up in the actionMap
      const actionKey =
        `${CmtMenu}_${CmtRole}_${Button_ID}` as keyof DPActionMap;

      // Assign the action if it exists in the actionMap
      if (button.OTP_Required === 'X') {
        this.buttonActionKeysthatRequiresOTP.push(actionKey);
      }

      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
      }
    });
  }

  onDPFormsubmit(userAction: UserActionCode) {
    if(
      userAction !==  UserActionCode.draft && 
      userAction !== UserActionCode.returnToSecretary &&
      userAction !== UserActionCode.return
    ){
      if (!this.OFSubmissionValidation()) {
        return;
      }
      
      if (this.isVendorSelection && !this.disableVendorSelection() && this.isOnlyVendorSelected ) {
        const message = this.cs.userLanguage === 'en' 
          ? `Only one vendor needs to be selected` 
          : `يجب اختيار مورد واحد فقط`;
      
        this.cs.createMessage("error", message);
        return;
      }

      if(this.isVendorSelection && !this.disableVendorSelection()){
        if(Number(this.DPEvaluationForm.getRawValue().FinalOfferPrice) <= 0){
          const message = this.cs.userLanguage === 'en' 
      ? `Final offer price should be greater than zero` 
      : `يجب أن يكون السعر النهائي للعرض أكبر من الصفر`;
      
        this.cs.createMessage("error", message);
        return;
        }
      }

      
      
    }
    let DPFormData = {
      TndrID: this.DPEvaluationData.TndrID,
      TndrName: this.DPEvaluationData.TndrName,
      BidOpngDate: this.DPEvaluationForm.getRawValue().OpeningDate ? 
        this.cs.getCurrentDateInApiFormat(this.DPEvaluationForm.getRawValue().OpeningDate) : '',
      FinanceOfferOpeningDate: this.DPEvaluationData.FinanceOfferOpeningDate,
      RFPNumber: this.DPEvaluationData.RFPNumber,
      PurReqNo: this.DPEvaluationData.PurReqNo,
      PurTypID: this.DPEvaluationData.PurTypID,
      PurTypeDesc: this.DPEvaluationData.PurTypeDesc,
      EstPrice: this.DPEvaluationData.EstPrice,
      TechPassingPercentage: this.DPEvaluationData.TechPassingPercentage,
      TndrTypeID: this.DPEvaluationData.TndrTypeID,
      TndrTypeDesc: this.DPEvaluationData.TndrTypeDesc,
      EtimadNo: this.DPEvaluationData.EtimadNo,
      TndrStatus: this.DPEvaluationData.TndrStatus,
      CommitteeID: this.DPEvaluationData.CommitteeID,
      CommitteeName: this.DPEvaluationData.CommitteeName,
      AsgnOpngCmtOfficerID: this.DPEvaluationData.AsgnOpngCmtOfficerID,
      AsgnOpngCmtOfficerName: this.DPEvaluationData.AsgnOpngCmtOfficerName,
      AsgnOpngCmtOfficerName_AR: this.DPEvaluationData.AsgnOpngCmtOfficerName_AR,
      AsgnEvalCmtOfficerID: this.DPEvaluationData.AsgnEvalCmtOfficerID,
      AsgnEvalCmtOfficerName: this.DPEvaluationData.AsgnEvalCmtOfficerName,
      AsgnEvalCmtOfficerName_AR: this.DPEvaluationData.AsgnEvalCmtOfficerName_AR,
      AsgnDPEvalCmtOfficerID: this.DPEvaluationData.AsgnDPEvalCmtOfficerID,
      AsgnDPEvalCmtOfficerName: this.DPEvaluationData.AsgnDPEvalCmtOfficerName,
      AsgnDPEvalCmtOfficerName_AR: this.DPEvaluationData.AsgnDPEvalCmtOfficerName_AR,
      AsgnQualCmtOfficerID: this.DPEvaluationData.AsgnQualCmtOfficerID,
      AsgnQualCmtOfficerName: this.DPEvaluationData.AsgnQualCmtOfficerName,
      AsgnQualCmtOfficerName_AR: this.DPEvaluationData.AsgnQualCmtOfficerName_AR,
      TchnclEvltnMmbrID: this.DPEvaluationData.TchnclEvltnMmbrID,
      IsSingleTender: this.DPEvaluationData.IsSingleTender,
      IsTenderCancelled: this.DPEvaluationData.IsTenderCancelled,
      IsTenderUrgent: this.DPEvaluationData.IsTenderUrgent,
      IsGeneralTender: this.DPEvaluationData.IsGeneralTender,
      IsDirectPurchase: this.DPEvaluationData.IsDirectPurchase,
      ChairmanCmnts: '',
      CommitteeTxtArea: this.DPEvaluationData.CommitteeTxtArea,
      CommitteeAtchArea: this.DPEvaluationData.CommitteeAtchArea,
      CommitteeCmntsArea: this.DPEvaluationData.CommitteeCmntsArea,
      VndrCnt: this.DPEvaluationData.VndrCnt,
      SubmissionDate: this.DPEvaluationForm.getRawValue().QuotationSubmissionDate ? 
      this.cs.getCurrentDateInApiFormat(this.DPEvaluationForm.getRawValue().QuotationSubmissionDate) : '',
      CompetitionTypeID: this.DPEvaluationData.CompetitionTypeID,
      CmtFrmtnOrdrNo: this.DPEvaluationData.CmtFrmtnOrdrNo,
      CmtFrmtnOrdrDate: this.DPEvaluationData.CmtFrmtnOrdrDate,
      CmtFrmtnOrdrNobec: this.DPEvaluationData.CmtFrmtnOrdrNobec,
      CmtFrmtnOrdrDatebec: this.DPEvaluationData.CmtFrmtnOrdrDatebec,
      CmtFrmtnOrdrNobqc: this.DPEvaluationData.CmtFrmtnOrdrNobqc,
      CmtFrmtnOrdrDatebqc: this.DPEvaluationData.CmtFrmtnOrdrDatebqc,
      CmtFrmtnOrderNodp: this.DPEvaluationData.CmtFrmtnOrderNodp,
      CmtFrmtnOrdrDatedp: this.DPEvaluationData.CmtFrmtnOrdrDatedp,
      EtmdSubDate: this.DPEvaluationData.EtmdSubDate,
      FinancialOffer: this.DPEvaluationData.FinancialOffer,
      LglFullAccess: this.DPEvaluationData.LglFullAccess,
      CreatedBy: this.DPEvaluationData.CreatedBy,
      CreatedOn: this.DPEvaluationData.CreatedOn,
      CreatedAt: this.DPEvaluationData.CreatedAt,
      NoOfVndrs: this.DPEvaluationForm.getRawValue().NoofVendors.toString(),
      NoOfByres: this.DPEvaluationData.NoOfByres,
      NoOfQualificationInvitation: this.DPEvaluationData.NoOfQualificationInvitation,
      InvitationPublishDate: this.DPEvaluationData.InvitationPublishDate,
      QualDocReceivingDate: this.DPEvaluationData.QualDocReceivingDate,
      QualDocInspectionDate: this.DPEvaluationData.QualDocInspectionDate,
      NoOfVndrsInvolvedInQual: this.DPEvaluationData.NoOfVndrsInvolvedInQual,
      PassingRate: this.DPEvaluationData.PassingRate,
      MomType: this.DPEvaluationForm.getRawValue().momtype,
      FinalApproval: this.DPEvaluationData.FinalApproval,
      LocalContent: this.DPEvaluationData.LocalContent,
      FinalOfferPrice: this.DPEvaluationForm.getRawValue().FinalOfferPrice === '' ? 
      '0.000' : this.DPEvaluationForm.getRawValue().FinalOfferPrice,
      QualFnWgtgCnst: this.DPEvaluationData.QualFnWgtgCnst,
      QualTnWgtgCnst: this.DPEvaluationData.QualTnWgtgCnst,
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: this.CommitteeID,
      LgdInUsrCmtRole: this.role,
      LgdInUsrAction: userAction,
      Returnuser: "",
      MsgType: '',
      MsgVar1: '',
      MsgVar2: '',
      to_Attach: this.combineOtherAttachmentsWithUpdated(),  
      to_RqstMbrs: this.prepareCommitteeMembersDataForPost(this.to_RqstMbrs),
      to_RqstVndrs: this.processVendorDetails(
        this.DPEvaluationForm,
        this.vendorList,
        this.DPEvaluationData,
        this.initailDPData,
        this.CommitteeID,
        this.isDisabledPrice
      ),
      to_LmtdVndrs: this.getLimitedVendorsData(),
    }
    this.processedData = DPFormData

    this.showConfirm(DPFormData, userAction);
  }

  postTenderData(DPFormData: any){
    this.spinner.show();
    this.api
      .post('OCOM_CRT_UPD', DPFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res.d.MsgType === 'S') {
            if (this.isVendorDetailsRequired) {
              const vendorRequests = this.postVendorDetails.map((vendor: any) => {
                return this.api.post('vendor-details', vendor).toPromise()
              });
              Promise.all(vendorRequests).then(
                  () => {
                    this.spinner.hide();
                    this.cs.createMessage(
                      'succes',
                      this.cs.userLanguage === 'en' ?
                      'Success' : 'نجاح'
                    )
                    this.cs.createMessage(
                      'success',
                      this.cs.userLanguage === 'en'
                        ? res.d.MsgVar1
                        : res.d.MsgVar2
                    );
                    if (this.isBOPN) {
                      this.cs.activeMenu = `bidstobeopen`;
                      this.router.navigate(['committee/dp-evaluation/bids-to-be-opened'], {
                        state: { ActiveTab: 'bidstobeopen' },
                      });
                    }
                    if (this.isBEMR) {
                      this.cs.activeMenu = `bidstobeeval`;
                      this.router.navigate(['committee/dp-evaluation/bids-to-be-evaluated'], {
                        state: { ActiveTab: 'bidstobeeval' },
                      });
                    }
                    if (this.isBFAP) {
                      this.cs.activeMenu = `finalapproval`;
                      this.router.navigate(['committee/dp-evaluation/final-approval'], {
                        state: { ActiveTab: 'finalapproval' },
                      });
                    }
                    if (this.isBAPR) {
                      this.cs.activeMenu = `bidstobeapproved`;
                      this.router.navigate(['committee/dp-evaluation/bids-to-be-approved'], {
                        state: { ActiveTab: 'bidstobeapproved' },
                      });
                    }
                  },
                  () => {
                    this.spinner.hide();
                    this.cs.createMessage(
                      'error',
                      this.cs.userLanguage === 'en' ?
                      'Internal Server Error' : 'خطأ في الخادم الداخلي'
                    );
                  }
              ).catch((err) => {
                this.spinner.hide();
                this.cs.createMessage(
                  'error',
                  err.statusText
                );
              })
            } else {
              this.spinner.hide();
              this.cs.createMessage(
                'success',
                this.cs.userLanguage === 'en'
                  ? res.d.MsgVar1
                  : res.d.MsgVar2
              );
              if (this.isBOPN) {
                this.cs.activeMenu = `bidstobeopen`;
                this.router.navigate(['committee/dp-evaluation/bids-to-be-opened'], {
                  state: { ActiveTab: 'bidstobeopen' },
                });
              }
              if (this.isBEMR) {
                this.cs.activeMenu = `bidstobeeval`;
                this.router.navigate(['committee/dp-evaluation/bids-to-be-evaluated'], {
                  state: { ActiveTab: 'bidstobeeval' },
                });
              }
              if (this.isBFAP) {
                this.cs.activeMenu = `finalapproval`;
                this.router.navigate(['committee/dp-evaluation/final-approval'], {
                  state: { ActiveTab: 'finalapproval' },
                });
              }
              if (this.isBAPR) {
                this.cs.activeMenu = `bidstobeapproved`;
                this.router.navigate(['committee/dp-evaluation/bids-to-be-approved'], {
                  state: { ActiveTab: 'bidstobeapproved' },
                });
              }
            }
          } else {
            this.spinner.hide();
            this.cs.createMessage('error', res.d.MessageEn);
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
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
  

      let isReturn: boolean | undefined = undefined;
      let returnConfig;
      
      if (action === UserActionCode.return) {
        isReturn = data.LgdInUsrCmtRole !== 'PR' ? true : false;
        returnConfig = {
          label: this.translate.instant("COM.Select Role"),
          placeholder: this.translate.instant('COM.Select Role'),
          listofUsers: this.committeeMembersList.map((member: CommitteeMembers) => ({...member, CommitteeUserID: member.CommitteeUser}))
        }
      }
      
  
      const modalRef = this.modal.create({
        nzContent: ConfirmComponent,
        nzComponentParams: { config, isReturn, returnConfig },
        nzWidth: 600,
        nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
        nzFooter: null,
      });
  
      modalRef.afterClose.subscribe((result) => {
        if (result) {
          if (isReturn) {
            this.processedData.Returnuser = result ?? '';
            data.Returnuser = result ?? '';
          }
          if (this.actionCheckerForOTP(action)) {
            this.getOTP();
          } else {
            if (data) {
              this.postTenderData(data);
            }
          }
        }
      });
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
      
        this.postTenderData(this.processedData);
      } else if (data !== this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  updateOTP(value: any) {
    this.getOTPModel = value;

    if (value) {
      if (value === this.otp) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        this.showConfirm(this.processedData, UserActionCode.submit);
      } else if (value !== this.otp) {
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
              this.cs.otpToast(res.d.results[0]);
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

  getLimitedVendorsData() {
    const limitedVendors: any = [];
    if (this.DPEvaluationForm?.get('CompetitionTypeID')?.value === '01') {
      const limitedVendorsControl = this.DPEvaluationForm.get(
        'vendorInvitationsSent'
      ) as FormArray;

      limitedVendorsControl.controls.forEach((formGroup: any) => {
        const formData = formGroup.getRawValue();
        if (formData.LmtdVendorName) {
          limitedVendors.push({
            TenderId: this.initailDPData.TndrID,
            LmtdVendorId: formData.LmtdVendorId || '',
            LmtdVendorName: formData.LmtdVendorName,
          });
        }
      });
      return limitedVendors;
    }
    return [];
  }

  combineOtherAttachmentsWithUpdated() {
    let list = [...this.fileNetList];
    list.forEach((node: any) => {
      delete node.hideDeleteButton;
      delete node.downloading;
    });
    const allAttachments = [
      ...this.otherCommitteeAttachments,
      ...this.DPEvaluationForm.getRawValue().Attachments,
      ...list,
    ];

    return allAttachments;
  }
  prepareCommitteeMembersDataForPost(
    members: CommitteeMembers[]
  ): Omit<CommitteeMembers, 'isChecked'>[] {
    return members.map(({ isChecked, ...rest }) => rest);
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
        this.postVendorDetails = [];
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
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.to_VndrFnclEvl || [];
        element.to_VndrTchnlEvl =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.to_VndrTchnlEvl || [];
        element.to_LeglEval =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.to_LeglEval || [];
        element.to_TechEval =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.to_TechEval || [];
        element.VndrTnclActualTotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclActualTotal || '0.0000';
        element.VndrFnclWgtgeTotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrFnclWgtgeTotal || '0.00';
        element.VndrFnclActualTotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrFnclActualTotal || '0.0000';
        element.VndrTnclWgtgeTotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclWgtgeTotal || '0.00';
        element.VndrTnclEvalScore =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrTnclEvalScore || '';

        // Add missing fields from the first object
        element.EvalCMTVndrtnclactualtotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.EvalCMTVndrtnclactualtotal || '0.0000';
        element.EvalCMTVndrtnclwgtgetotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.EvalCMTVndrtnclwgtgetotal || '0.0000';
        element.FinalPriceOffer =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.FinalPriceOffer || '0.00';
        element.IsCriteriaApplicable =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.IsCriteriaApplicable || '';
        element.IsSME =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]?.IsSME || '';
        element.IsVendorSelected =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.IsVendorSelected || '';
        element.LglDisqltnReason =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.LglDisqltnReason || '';
        element.PricePreference =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.PricePreference || '0.00';
        element.QftnLvlDescAR =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.QftnLvlDescAR || '';
        element.QftnLvlDescEN =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.QftnLvlDescEN || '';
        element.QualCmtVndractualtotal =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.QualCmtVndractualtotal || '0.0000';
        element.QualftnLvlID =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.QualftnLvlID || '';
        element.Ranking =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]?.Ranking ||
          '00';
        element.TchnclMbrCmnt =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.TchnclMbrCmnt || '';
        element.TechnicalOfferCmnts =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.TechnicalOfferCmnts || '';
        element.VndrFinevalwgtge =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrFinevalwgtge || '0.00';
        element.VndrLegalResult =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrLegalResult || '';
        element.VndrTechevalwgtge =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrTechevalwgtge || '0.00';
        element.VndrTechnicalResult =
          this.DPEvaluationData.to_RqstVndrs.results[vendorIndex]
            ?.VndrTechnicalResult || '';

        // Remove unnecessary properties
        delete element.CheckList;
        delete element.Comments;

        this.postVendorDetails.push({
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
          to_bnkdt: [],
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

  removeVendor(index: number, vendor: any) {
    const VendorId = vendor.controls.VendorId.value;
        let data = {
          CommitteeId: this.CommitteeID,
          TenderId: this.DPEvaluationData.TndrID,
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
                  // above code block reset the serial number of vendor after deleting a vendor.
                } else {
                  this.cs.createMessage('error', res.d.MessageEn);
                }
              },
              (error) => {
                console.log(error);
                this.cs.createMessage('error', error.statusText);
                this.spinner.hide();
              }
            );
        }
  }
  showVendorComments(index: number, vendor: any) {

    const TenderId = this.DPEvaluationData.TndrID;

    // Find list of all vendors for that tender.
    
      // find the vendor id from the list of all saved vendors whom comments has to be shown.
      this.selectedVendor = vendor.controls.VendorId.value;
      this.getComments();

  }
  addVendorComments(index: number, vendor: any) {
    this.vendorIdToAddComment = vendor.controls.VendorId.value;
    const vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
    if (!vendorDetails.every((vendor: any) => vendor.VendorName.trim())) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Fill vendor name to add a comment'
          : `املأ اسم البائع لإضافة تعليق`
      );
      this.showAddComments = false;
      return;
    }

    this.Vcmt = '';
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
  
    if (this.selectedVendor === '') {
      this.selectedVendor = `00${index + 1}`;
    }
    this.showAddComments = !this.showAddComments;
  }
  
  showChecklist(_data: any) {
    this.to_VndrChkLst = _data.to_VndrChkLst.results;
    this.selectedVendorGUID = _data.VendorGUID;
    this.seletedVenCom = _data.VendorCommercialNo;
    if (!this.showChecklists) this.showChecklists = true;
  }

  hideChecklists() {
    if (this.showChecklists) this.showChecklists = false;
  }

  getVendorForms(index: any) {
    return {
      firstLevelName: 'P2PCommitteTender',
      firstLevelId: this.DPEvaluationData.TndrID,
      secondLevelName: 'P2PCommitteVendor',
      secondLevelId: this.seletedVenCom,
      thirdLevelId: index.ChecklistId,
      VendorGUID: this.selectedVendorGUID,
      operation: 'C',
    };
  }

  showAttachments(vendor: any) {}
  

  get isTenderDP(): boolean {
    // return this.evaluationData?.PurTypID === 'D';
    return false;
  }
  get DP_SPECIAL_SCENARIO(): boolean {
    // return this.evaluationData.DPFlowException === `X`;
    return false;
  }

  public filterVendors(vendors: any[]): any[] {
    if (this.CommitteeID !== '02') {
      return vendors;
    }

    if (this.isEligibleForDPFilter()) {
      return this.applyDPFilter(vendors, this.DP_SPECIAL_SCENARIO);
    }

    return vendors;
  }

  private isEligibleForDPFilter(): boolean {
    return (
      [
        COMMITTEE_ROLE.VICE_PRESIDENT,
        COMMITTEE_ROLE.DIRECTOR,
        COMMITTEE_ROLE.CEO,
      ].includes(this.role) && this.isTenderDP
    );
  }

  private applyDPFilter(vendors: any[], isSpecialScenario: boolean): any[] {
    const filterArray = [{ key: 'IsVendorSelected', value: 'Y' }];

    if (isSpecialScenario) {
      filterArray.push(
        { key: 'IsVndrtechQualified', value: 'X' },
        { key: 'IsVndrfnclQualified', value: 'X' }
      );
    }

    return this.filterPipe.transform(vendors, filterArray);
  }
  handleAttachModalCancel() {
    this.IsAttachmentModel = false;
  }

  //* form validations
  lengthCommercialNumberList: any = [];
  invalidCommercialNumberList: any = [];
  invalidChecklist: any = [];
  duplicateVendorName: any = [];
  duplicateItems: any = [];
  duplicateVendorItems: any = [];
  invalidVendorNameList: any = [];
  invalidPriceList: any = [];
  invalidInitialGuranteeValue: any = [];
  invalidContentOfferList: any = [];
  invalidAttachmentsList: any = [];
  invalidFinancialComments: any = [];
  invalidZipCodeList: any = [];
  invalidCityList: any = [];
  invalidCountryList: any = [];
  invalidPhoneNoList: any = [];
  invalidEmailList: any = [];
  getInvalidFormControls() {
    const invalid = [];
    const controls = this.DPEvaluationForm.controls;

    this.lengthCommercialNumberList = [];
    this.invalidCommercialNumberList = [];
    this.invalidChecklist = [];
    this.duplicateVendorName = [];
    this.duplicateItems = [];

    if (
      this.role === 'CH' &&
      this.DPEvaluationForm.get('ChairmanCmnts')?.value === ''
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

    if (this.isOFWithBOPN) {
    let vendorList: any[] = this.vendorList?.getRawValue() || [];

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
          (this.initailDPData.TndrTypeID === '01' ||
            this.DPEvaluationData.FinancialOffer === 'X')
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
      if (item.length == 0 || (this.role === 'OF' && parseFloat(item) <= 0)) {
        this.invalidPriceList.push(index + 1);
      }
    });

    if (this.invalidPriceList.length != 0) {
      invalid.push('InvalidPrice');
    }

    this.invalidInitialGuranteeValue = [];

    if (this.isEstimatedThan100k) {
      initialguranteeValue.forEach((item: any, index: any) => {
        if (item.toString().length == 0) {
          this.invalidInitialGuranteeValue.push(index + 1);
        }
      });
      if (
        this.invalidInitialGuranteeValue.length != 0
      ) {
        invalid.push('InitialGuranteeValue');
      }
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
      this.initailDPData.TndrTypeID !== '02' &&
      this.invalidFinancialComments.length != 0
    ) {
      invalid.push('InvalidFinanicalOfferComments');
    }

    if (this.isVendorDetailsRequired) {
      this.invalidZipCodeList = [];
      zipCodeList.forEach((zipCode: string, index: number) => {
        if (zipCode.length === 0) {
          this.invalidZipCodeList.push(index + 1);
        }
      });

      if (this.invalidZipCodeList.length != 0) {
        invalid.push('InvalidZipCode');
      }

      this.invalidCityList = [];
      cityList.forEach((city: string, index: number) => {
        if (city.length === 0) {
          this.invalidCityList.push(index + 1);
        }
      });

      if (this.invalidCityList.length != 0) {
        invalid.push('InvalidCity');
      }

      this.invalidCountryList = [];
      countryList.forEach((country: string, index: number) => {
        if (country.length === 0) {
          this.invalidCountryList.push(index + 1);
        }
      });

      if (this.invalidCountryList.length != 0) {
        invalid.push('InvalidCountry');
      }

      this.invalidPhoneNoList = [];
      phoneNoList.forEach((phoneno: string, index: number) => {
        if (phoneno.length === 0) {
          this.invalidPhoneNoList.push(index + 1);
        }
      });

      if (this.invalidPhoneNoList.length != 0) {
        invalid.push('InvalidPhoneNo');
      }

      this.invalidEmailList = [];
      emailList.forEach((email: string, index: number) => {
        if (email.length === 0) {
          this.invalidEmailList.push(index + 1);
        }
      });

      if (this.invalidEmailList.length != 0) {
        invalid.push('InvalidEmail');
      }
    }

    // * Invalid commercial Number Pattern validaiton
    const isCommercialNumberValid = vendorList.every((data: any) => {
      return REGEX.COMMERCIAL_NUMBER.test(data.VendorCommercialNo);
    });

    if (!isCommercialNumberValid) {
      //*  Validate only for Officer in One envelope or required in Two envelope if it is financial offer
      if (
        (this.role === 'OF' || this.role === 'CH') &&
        (this.initailDPData.TndrTypeID === '01' ||
          this.DPEvaluationData.FinancialOffer === 'X')
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

      const vendorKey = Object.keys(this.checklistCheckerArray)[index];
      let checkListCheckerItem = this.checklistCheckerArray[vendorKey];
      for (let i = 0; i < data?.CheckList.length; i++) {

        if (
          data?.CheckList[i].IsAttachmentValid === true &&
          checkListCheckerItem[i][`checklist${i + 1}`] === false
        ) {
          invalid.push('checkListAttachment');
          this.invalidChecklist.push(index + 1);
        }
      }

      if (this.DPEvaluationData.TndrTypeID === '01') {
        for (let i = 0; i < data?.CheckList.length; i++) {
          if (data?.CheckList[i]?.ChecklistId === '002') {
            if (data?.CheckList[i].IsAttachmentValid === false) {
              invalid.push('checkListAttachment');
              this.invalidChecklist.push(index + 1);
              break;
            }
          }
        }
      }
    });
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

  OFSubmissionValidation() {
    // * Invalid Vendor Name Validation
    if (this.getInvalidFormControls().includes('InvalidVendorName')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Vendor Name is missing for serial number ' +
              this.invalidVendorNameList.join(', ')
          : this.invalidVendorNameList.join(', ') +
              'اسم الشركة مفقود لرقم التسلسل'
      );
      return false;
    }

    if (this.initailDPData.TndrTypeID === '01') {
      if (this.getInvalidFormControls().includes('InitialGuranteeValue')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Please Fill Initial Gurantee Value for serial number ' +
                this.invalidInitialGuranteeValue.join(', ')
            : this.invalidInitialGuranteeValue.join(', ') +
                'يرجى ملء قيمة الضمان الابتدا'
        );
        return false;
      }
    }

    // * Duplicate Vendor Name Validation
    if (this.getInvalidFormControls().includes('vendorName')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Duplicated vendor name  -' + this.duplicateVendorItems.join(', ')
          : this.duplicateVendorItems.join(', ') + 'اسم البائع مكرر'
      );
      return false;
    }

    // * CR Number length invalid validation
    if (this.getInvalidFormControls().includes('invalidCommercialNoLength')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Commercial Number should be 10 digits for serial number ' +
              this.lengthCommercialNumberList.join(', ')
          : this.lengthCommercialNumberList.join(', ') +
              'يجب أن يكون رقم التجاري مؤلفًا من 10 أرقام لرقم التسلسل'
      );
      return false;
    }

    if (
      this.getInvalidFormControls().includes('invalidCommercialNo') ||
      this.getInvalidFormControls().includes('invalidCrRequired')
    ) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Please enter valid commercial number for serial number  ' +
              this.invalidCommercialNumberList.join(', ')
          : this.invalidCommercialNumberList.join(', ') +
              `يرجى إدخال رقم تجاري صالح لرقم التسلسل`
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('duplicateCommercialNo')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Duplicated commercial number for serial number ' +
              this.duplicateItems.join(', ')
          : this.duplicateItems.join(', ') + 'رقم تجاري مكرر لرقم التسلسل'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('InvalidPrice')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Price is invalid for serial number ' +
              this.invalidPriceList.join(', ')
          : this.invalidPriceList.join(', ') + 'السعر رقم تسلسلي غير صالح'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('InvalidContentOffer')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Content of Offer is missing for serial number ' +
              this.invalidContentOfferList.join(', ')
          : this.invalidContentOfferList.join(', ') +
              'محتوى العرض مفقود لرقم التسلسل'
      );
      return false;
    }

    if (this.isVendorDetailsRequired) {
      if (this.getInvalidFormControls().includes('InvalidZipCode')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Zip code is missing for serial number ' +
                this.invalidZipCodeList.join(', ')
            : this.invalidZipCodeList.join(', ') +
                'الرمز البريدي مفقود للبند رقم'
        );
        return false;
      }

      if (this.getInvalidFormControls().includes('InvalidCity')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'City is missing for serial number ' +
                this.invalidCityList.join(', ')
            : this.invalidCityList.join(', ') + 'المدينة مفقودة للبند رقم'
        );
        return false;
      }

      if (this.getInvalidFormControls().includes('InvalidCountry')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Country is missing for serial number ' +
                this.invalidCountryList.join(', ')
            : this.invalidCountryList.join(', ') + 'البلد مفقودة للبند رقم'
        );
        return false;
      }

      if (this.getInvalidFormControls().includes('InvalidPhoneNo')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Phone Number is missing for serial number ' +
                this.invalidPhoneNoList.join(', ')
            : this.invalidPhoneNoList.join(', ') + 'رقم الهاتف مفقود للبند رقم'
        );
        return false;
      }

      if (this.getInvalidFormControls().includes('InvalidEmail')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Email is missing for serial number ' +
                this.invalidEmailList.join(', ')
            : this.invalidEmailList.join(', ') + 'الايميل مفقود للبند رقم'
        );
        return false;
      }
    }

    if (this.getInvalidFormControls().includes('InvalidAttachments')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Attachments Comments is missing for serial number ' +
              this.invalidAttachmentsList.join(', ')
          : this.invalidAttachmentsList.join(', ') +
              'تعليقات المرفقات مفقودة لرقم التسلسل'
      );
      return false;
    }

    if (this.isEqual(this.committeeUserName, this.committeeBackupUserName)) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Do not select same user as main and backup member.'
          : 'لا يجب ان يكون العضو الأساسي نفس العضو الاحتياطي'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('checkListAttachment')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Checklist attachment not found for serial number ' +
              this.invalidChecklist.join(', ')
          : this.invalidChecklist.join(', ') +
              'مرفق قائمة الفحص غير موجود لرقم التسلسل'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('CompetitionTypeID')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Type of competition is required'
          : 'نوع المنافسة مطلوب'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('OpeningDate')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Bid Opening date is required'
          : 'تاريخ فتح العطاء مطلوب'
      );
      return false;
    }

    if (this.getInvalidFormControls().includes('QuotationSubmissionDate')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Submission date is required'
          : 'تاريخ التقديم مطلوب'
      );
      return false;
    }
    if (this.getInvalidFormControls().includes('NoofVendors')) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Number of vendors cannot be zero'
          : 'تاريخ التقديم مطلوب'
      );
      return false;
    }

    if (!this.isBOPN && this.isOfficer) {
      console.log(this.getInvalidFormControls())
      if (this.getInvalidFormControls().includes('momtype')) {
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Please Fill the MOM Type'
            : 'يرجى ملء ' + this.translate.instant(`COM.MOM Type`))
        return false;
      }
    }
    
    return true;
  }

  currentRoleAndMenuChecker() {
    this.isOFWithBOPN;
  }

  get isOFWithBOPN(): boolean {
    return this.role === 'OF' && this.committeAction === 'BOPN';
  }

  get isBOPN(): boolean {
    return this.committeAction === 'BOPN';
  }

  get isBEMR(): boolean {
    return this.committeAction === 'BEMR';
  }

  get isBFAP(): boolean {
    return this.committeAction === 'BFAP';
  }

  get isBAPR(): boolean {
    return this.committeAction === 'BAPR';
  }

  get isOfficer(): boolean {
    return this.role === 'OF';
  }

  get isChairman(): boolean {
    return this.role === 'CH';
  }

  get isVendorSelection(): boolean {
    return this.committeAction === 'BAPR' || this.committeAction === 'BFAP' || this.committeAction === 'BEMR'
  }

  get isEstimatedLess(): boolean {
    return this.estimatedAmount <= 30000;
  }

  get isEstimatedThan100k(): boolean {
    return this.estimatedAmount > 100000;
  }

  get isBoqVisible(): boolean {
    return (!this.isEstimatedLess && !this.isBOPN && (this.isOfficer || this.isChairman)) || this.isVendorSelection
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      CommitteeId: this.CommitteeID,
      CommitteeRole: this.role,
      CommitteeUser: this.LogdInUsrID,
      TenderId: this.DPEvaluationData.TndrID,
    });

    this.fileNetList = [...this.fileNetList];
  }


  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter(
      (file: any) => evt.FilenetID !== file.FilenetID
    );
  }

  downloadMoM(data: any) {
    
    const payload: doumentDownload = {
      CommitteeID: data.CommitteeId ?? '',
      TndrID: data.TenderId ?? '',
      Role: this.role,
      Identifier: data.Identifier ?? ''
    };

    this.cs.downloadMOM(payload, data.TenderId ?? '' + '_' + data.MomDecEn)

  }

  showHideCommentsT() {
    this.getCommentsT();
    this.showCommentsT = true;
  }

  getCommentsT() {
    this.spinner.show();
    let dt = {
      TenderId: this.DPEvaluationData.TndrID,
      VendorId: '0',
      CommitteeId: this.CommitteeID,
    };
    this.api
      .post('/GET_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.commentsArray = res.d.results;
        // this.showComments = !this.showComments;
        this.spinner.hide();
      });
  }

  showHideAddCommentsT() {
    this.Tcmt = '';
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  addCommentsT(comments: any) {
    if (comments != '') {
      this.spinner.show();
      let cmtData = {
        CommitteeId: this.CommitteeID,
        CommitteeRole: this.role,
        TenderId: this.DPEvaluationData.TndrID,
        VendorId: '',
        CmntdMember: this.LogdInUsrID,
        Comments: comments,
      };
      if (cmtData) {
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
                this.cs.createMessage('error', res.d.MessageEn);
              }
            },
            (error) => {
              this.cs.createMessage('error', error.statusText);
              this.spinner.hide();
            }
          );
      }
    } else {
      console.log('no comments', comments);
    }
    this.showAddCommentsT = !this.showAddCommentsT;
  }

  showBoq() {
    if (this.showBo) {
      this.showBo = false;
      console.log(this.showBo)
    } else {
      console.log(this.showBo)
      console.log(this.DPEvaluationData.RFPNumber);
      this.getBoq(this.DPEvaluationData.RFPNumber);
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
          // this.rfpEstimationPrice = Number(res.d.results[0].EstPrice);
          this.rfpNo = res.d.results[0].RfpNo;
          this.estPrice = Number(res.d.results[0].EstPrice);
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
              UnitPrice: item.UnitPrice,
              ItemName: item.ItemName,
              QntySum: total
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

  showHideCommentsclose() {
    this.showCommentsT = false;
    this.showComments = false;
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

  showHideAddCommentsclose() {
    this.showAddComments = false;
    this.showAddCommentsT = false;
  }
  VendorRequiredField: any = [];
  private vendorIdToAddComment = ``;
  savedVendor: boolean = false;
  selectedVendor: any;
  showComments: boolean = false;

  showVendorComment(index: any, vendor: any) {
    if (index !== '') {
      // find the vendor id from the list of all saved vendors whom comments has to be shown.
      this.selectedVendor = vendor.VendorId;
      this.getComments();
    } else {
      this.showComments = false;
    }
  }

  showHideComments(index: any, VendorFormGroup: any) {
    const TenderId = this.initailDPData.TndrID;

    // Find list of all vendors for that tender.
    if (index !== '') {
      // find the vendor id from the list of all saved vendors whom comments has to be shown.
      this.selectedVendor = VendorFormGroup.controls.VendorId.value;
      this.getComments();
    } else {
      this.showComments = false;
    }
  }
  commentsArray: any = [];

  getComments() {
    this.spinner.show();
    let dt = {
      TenderId: this.initailDPData.TndrID,
      // "MemberId":this.userDetails.ID,
      VendorId: this.selectedVendor?.toString(),
      //  "role":this.role,
    };
    this.api
      .post('/GET_CMTS', dt)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.commentsArray = res.d.results;
          this.showComments = true;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  showAddVendorComment(index: number, vendor: any) {
    this.vendorIdToAddComment = vendor.VendorId;
    this.Vcmt = '';
    
      this.selectedVendor = vendor.VendorId;
      this.savedVendor = true;
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
    
    if (this.selectedVendor === '') {
      this.selectedVendor = `00${index + 1}`;
    }
    this.showAddComments = !this.showAddComments;
  }

  showHideAddComments(index: any, details: any) {
    this.vendorIdToAddComment = details.controls.VendorId.value;
    const vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
    if (!vendorDetails.every((vendor: any) => vendor.VendorName.trim())) {
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Fill vendor name to add a comment'
          : `املأ اسم البائع لإضافة تعليق`
      );
      this.showAddComments = false;
      return;
    }

    this.Vcmt = '';
    
      this.selectedVendor = details.controls.VendorId.value;
      this.savedVendor = true;
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
    
    if (this.selectedVendor === '') {
      this.selectedVendor = `00${index + 1}`;
    }
    this.showAddComments = !this.showAddComments;
  }

  addComments(comments: any, selectedVenderStatus: any, vnID: any) {
    this.VendorRequiredField = [];

    if (this.DPEvaluationForm.getRawValue().addVender.length > 0) {
      let vendorDetails = this.DPEvaluationForm.getRawValue().addVender;
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
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? 'Vendor Name,Commercial Number are required fields, Commercial Number must be 10 digit only'
            : 'اسم البائع ، الرقم التجاري هي حقول مطلوبة ، يجب أن يتكون الرقم التجاري من 10 أرقام فقط'
        );
        this.showAddComments = !this.showAddComments;
      } else {
        if (selectedVenderStatus) {
          let cmtData = {
            CommitteeId: this.CommitteeID,
            CommitteeRole: this.role,
            TenderId: this.initailDPData.TndrID,
            VendorId: this.vendorIdToAddComment,
            CmntdMember: this.LogdInUsrID,
            Comments: comments,
          };
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
                  } else {
                    this.cs.createMessage('error', res.d.MessageEn);
                  }
                },
                (error) => {
                  this.cs.createMessage('error', error.statusText);
                  this.spinner.hide();
                }
              );
          }
        } else {
          let cmtData = {
            CommitteeId: this.CommitteeID,
            TenderId: this.initailDPData.TndrID,
            VendorId: '',
            CmntdMember: this.LogdInUsrID,
            Comments: comments,
            CommitteeRole: this.role,
          };
          let vendorDetails =
            this.DPEvaluationForm.getRawValue().addVender;
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
              list.TenderId = this.initailDPData.TndrID;
              list.VendorId = element.VendorId;
              list.CommitteeId = this.CommitteeID;
              // list.to_VndrChkAtt = [
              // ];
            });
            element.CommitteeId = this.CommitteeID;
            element.TenderId = this.initailDPData.TndrID;
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
            TndrID: this.initailDPData.TndrID,
            TndrName: this.initailDPData.TndrName,
            RFPNumber: this.initailDPData.RFPNumber,
            PurReqNo: this.initailDPData.PurReqNo,
            PurTypID: this.initailDPData.PurTypID,
            PurTypeDesc: this.initailDPData.PurTypeDesc,
            TndrTypeID: this.initailDPData.TndrTypeID,
            TndrTypeDesc: this.initailDPData.TndrTypeDesc,
            EtimadNo: this.initailDPData.EtimadNo,
            TndrStatus: this.initailDPData.TndrStatus,
            CommitteeID: this.CommitteeID,
      CommitteeName: localStorage.getItem('CommitteeName'),
            CmtFrmtnOrderNodp: this.DPEvaluationData.CmtFrmtnOrderNodp,
            CmtFrmtnOrdrDate: this.DPEvaluationData.CmtFrmtnOrdrDate,
            CmtFrmtnOrdrDatebec: this.DPEvaluationData.CmtFrmtnOrdrDatebec,
            CmtFrmtnOrdrDatebqc: this.DPEvaluationData.CmtFrmtnOrdrDatebqc,
            CmtFrmtnOrdrDatedp: this.DPEvaluationData.CmtFrmtnOrdrDatedp,
            CmtFrmtnOrdrNo: this.DPEvaluationData.CmtFrmtnOrdrNo,
            CmtFrmtnOrdrNobec: this.DPEvaluationData.CmtFrmtnOrdrNobec,
            CmtFrmtnOrdrNobqc: this.DPEvaluationData.CmtFrmtnOrdrNobqc,
            AsgnOpngCmtOfficerID: this.initailDPData.AsgnOpngCmtOfficerID,
            AsgnOpngCmtOfficerName: this.initailDPData.AsgnOpngCmtOfficerName,
            AsgnQualCmtOfficerID: '',
            AsgnQualCmtOfficerName: '',
            AsgnEvalCmtOfficerID: '',
            AsgnEvalCmtOfficerName: '',
            TchnclEvltnMmbrID: '',
            TchnclEvltnMmbrName: '',
            CurrentDate: this.cs.getCurrentDateInApiFormat(
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

          if (this.DPEvaluationForm?.get('openingDate')?.value) {
            data.BidOpngDate = moment(
              this.DPEvaluationForm?.get('openingDate')?.value
            ).format('YYYYMMDD');
          }

          if (this.DPEvaluationForm?.get('CompetitionTypeID')?.value) {
            data.CompetitionTypeID =
              this.DPEvaluationForm?.get('CompetitionTypeID')?.value;
          }

          if (this.DPEvaluationForm?.get('SubmissionDate')?.value) {
            data.SubmissionDate = moment(
              this.DPEvaluationForm?.get('SubmissionDate')?.value
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
                    res.d.to_RqstVndrs.results.forEach((element: any) => {
                      if (element.VendorCommercialNo === vnID) {
                        cmtData.VendorId = element.VendorId;
                      } else if (element.VendorId === vnID) {
                        cmtData.VendorId = element.VendorId;
                      }
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
                              this.cs.createMessage(
                                'error',
                                res.d.MessageEn
                              );
                            }
                          },
                          (error) => {
                            this.cs.createMessage(
                              'error',
                              error.statusText
                            );
                            this.spinner.hide();
                          }
                        );
                    }
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
            this.showAddComments = !this.showAddComments;
          }
        }
      }
    }
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
  
  
  
  
  showvendorComments(venodorDetail: any){}
}

interface BoqItem {
  Quantity: number;
  Uom: string;
  UnitPrice: number;
  QntySum: number;
  ItemName: string;
}