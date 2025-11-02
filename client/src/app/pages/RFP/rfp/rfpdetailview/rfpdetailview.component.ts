import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { BoqItem, PayItem, TechMemberDetail, Work, dtypes, durationTypes } from 'src/app/shared/shared';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { IconList } from 'src/app/components/icon/icon.component';
import { QualificationListFullResponse, WorkflowPayload, KPIDetails, splitedBudget, PlannedBudget, BudgetServiceLineItemToPost } from '../rfp.model';
import {CommitmentItem, InternalOrder, RFPUserRoleInfo} from 'src/app/pages/RFP/rfp/rfp.model'
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { isEqual,sortBy } from 'lodash';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
// import sortBy from 'lodash/sortBy';




@Component({
  selector: 'app-rfpdetailview',
  templateUrl: './rfpdetailview.component.html',
  styleUrls: ['./rfpdetailview.component.scss'],
})
export class RfpdetailviewComponent implements OnInit {
  @Input() detArray: any;

  @Input() Action: any;

  @Input() Actiondet: ActionDetail | undefined;

  isQualFin = true;
  IconList = IconList;

  ReqToBoqNavg: any[] = [];

  

  ReqToQualfNavg: PayItem[] = [];

  ReqToFinNavg: any[] = [];

  ReqToAttchNavg: PayItem[] = [];

  ReqToTechNavg: any[] = [];

  ReqToTreqNavg: PayItem[] = [];

  ReqToMpwrNavg: any[] = [];

  ReqToWorkNavg: Work[] = [];

  ReqToTmbrNavg: TechMemberDetail[] = [];

  reqComments: any;
  assignToComments: any = '';

  selectUser: any;

  durationTypes = durationTypes;

  userList: any;
  ApprvComments: any;

  fileNetList: any[] = [];

  slQualFinCriteria = 1;

  ApprForm: FormGroup;
  
  
  assignToUser: any;
  assignTouserList: any = [];
  showComments: boolean = false;
  showAssignTo: boolean = false;
  approvedConfirmation: boolean= false;
  submitConfirmationFailure: boolean= false;
  rejectConfirmation: boolean = false;
  rejectFailure: boolean = false;
  responseMessage : any;
  commentsArray: any = [];
  procurmentForm:FormGroup;

  commitmentItems: CommitmentItem[] = [];
  commitmentItem: string = '';
  
  isSaveChanges: boolean = false;

  internalOrders: InternalOrder[] = [];
  internalOrder: string = '';

  qualificationList: QualificationListFullResponse = {
    d: {
      results: []
    }
  };

  procurementDetailsForm!: FormGroup;
  isSearchRFPActive: boolean = false

  isApproveClick = false;
  isAssignClick = false;
  isReturnClick = false;
  isAssignBack = false;
  isReject = false;
  groupBOQItemsBasedonBudgetingYears:any[] = []
  masterInternalOrder  : InternalOrder[] = []
  internalOrderItems: InternalOrder[][] = []


  expandIconPosition: 'left' | 'right' = 'right';

  departmentType = localStorage.getItem('DepTxt');
  errWarnings: WarningMessage[] = [];

  private readonly destroy$ = new Subject<void>();
  isBudgetPlannerVisible: boolean  = false
  splitedBudget: splitedBudget[] = [];
  isBudgetDetailsPresent: boolean = false

  //* fin officer boq internal order and commitment item form
  budgetPlannerForm = this.fb.group({
    budgetingGroups: this.fb.array([]),
  });
  applyCommitmentItemAndInternalOrderToAllYearsForm = this.fb.group({
    applyForAllBudgetYears: [false],
    commitmentItem: ['', Validators.required],
    internalOrder: [''],
  });
  rfpUserDetails!: RFPUserRoleInfo
  isCommitmentAndInternalOrderChanged: boolean = false
  private subscribedIndices = new Set<number>();

  VATAmount!: number 
  availableBudget: { [year: string]: any } = {};
  isAssign: boolean = false;
  isBudgetDetailsPresentPerYear: boolean = false;
  rfpRoles: any;
  

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private api: ApiService,
    public cs: CommonService,
    private location: Location,
    public fb: FormBuilder,
    private translate: TranslateService,
    private currenyPipe: CommaSeparatePipe,
    private rfp: RFPService
  ) {
    this.ApprForm = this.fb.group({
      UserInfo: new FormControl('', Validators.required),
    });
   

    this.procurmentForm = this.fb.group({});
  }

  back() {
    this.location.back();
  }

  toNumber(value: string) {
    return parseInt(value);
  }

  ngOnInit(): void {
    this.spinner.show();
    if (
      window.history.state.Action === 'approve' ||
      window.history.state.Action === 'review' || window.history.state.Action === 'edit' 
    ) {
      this.Actiondet = {
        RfpNo: window.history.state.RfpNo,
        RfpVersion: window.history.state.RfpVersion,
        RfpDeptId: window.history.state.DeptId,
        WfFlowType: window.history.state.WfFlowType,
        CwfDept: window.history.state.CwfDept,
        CwfApprvLevel: window.history.state.CwfApprvLevel,
        CwfApprvRole: window.history.state.CwfApprvRole,
        NwfApprvDept: window.history.state.NwfApprvDept,
        NwfApprvLevel: window.history.state.NwfApprvLevel,
        NwfApprvRole: window.history.state.NwfApprvRole,
        NwfApprvId: window.history.state.NwfApprvId,
        NwfDept: window.history.state.NwfDept,
        Action: window.history.state.Action,
        WfReqComment: window.history.state.WfReqComment,
        IsRfpRddApproved: window.history.state.IsRfpRddApproved,
      } as ActionDetail;
    } 

    console.log(this.Actiondet?.CwfApprvRole, 'CwfApprvRole')

    if (window.history.state.RfpNo === undefined) {
      this.router.navigate(['rfp/myrfp']);
    }
    this.applyCommitmentItemAndInternalOrderToAllYearsForm.get('commitmentItem')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // Clear internalOrder field
        this.applyCommitmentItemAndInternalOrderToAllYearsForm.get('internalOrder')?.setValue(null);
         this.spinner.show();
        this.rfp.getInternalOrders(value).subscribe({
          next: (res) => {
            this.masterInternalOrder = res;
            this.spinner.hide();
          },
          error: (err) => {
            console.error('Failed to fetch internal orders', err);
            this.masterInternalOrder = [];
            this.spinner.hide();
          }
        });
      });

    this.checkIsSearchRFActive()
    
    
    this.getMatgp();
    
    this.getITCheckList();
    this.getQualificationList();
    this.getRFPUserDetails();
    this.getLoginUserDetails();
    // this.getBudgetdeatilsIfCreated()
    
  }


  checkIsSearchRFActive(){
    this.rfp.isSearchRFPMenuActive$.pipe(takeUntil(this.destroy$)).subscribe({
      next: isActive => this.isSearchRFPActive = isActive,
      error: err => console.error(err)
    })
  }

getBudgetdeatilsIfCreated(){
  this.rfp.canGetBudgetDetailsstate$.pipe(takeUntil(this.destroy$)).subscribe({
    next:(isCreated)=>{
      if(isCreated){
        this.getBudgetDetails( this.detArray.RfpNo, this.detArray.RfpVersion)
      }

    }
  })
}
getBudgetDetails(rfpNo:string, rfpVersion: string) {

  this.rfp.getCreatedRFPBudgetDetails(rfpNo, rfpVersion)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {      
        console.log(res);

        if (
          res?.results?.length &&
          res.results.every((item:any) =>
            (item.CommItm === '' || item.CommItm === '0000000000') &&
             (item.IntOrd === '' || (item.IntOrd === '0000000000' )
))
        ) {
          this.isBudgetDetailsPresent = false;
        } else {
          this.isBudgetDetailsPresent = true;
        }
        this.groupBoqItemsByYear()

        
      },
      error: (err) => {
        console.error('Error fetching budget details:', err);
      }
    });
}

getRFPUserDetails(){
  this.rfp.RFPUserDetails$.pipe(takeUntil(this.destroy$)).subscribe({
    next:(userDetails) => {
      this.rfpUserDetails = userDetails
    },
  })
}

  getLoginUserDetails() {
    const userObj = {
      UserName: this.rfpUserDetails.UserId
    };
    this.api
      .post('F4DeptSet', userObj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.d?.results) {
          this.rfpRoles = response.d.results.map((r: any) => r.RoleIdf);
        }
      });
  }

  
  getCommitmentItems() {
    this.spinner.show();
    this.api.get('get-commitment-items').pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.commitmentItems = res.d.results;
        this.getInitialDetails();
      },
      (err) => {
        this.spinner.hide();
        this.cs.createMessage('error', err.statusText);
      }
    );
  }

  getCommitmentName(commitmentItem: string) {
    const commitItem = this.commitmentItems.find((commitment) => commitment.Commitmentitem === commitmentItem);
    if(commitItem) {
      return `${commitItem.Commitmentitem} - ${commitItem.Description}`;
    }else {
      return '-';
    }
  }


  getQualificationList() {
    this.api.get('qualification-list').pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.qualificationList = res;
      
    }, (err) => {
      
    })
  }

  getQualification(qualificationID: string) {
    const qualification = this.qualificationList.d.results.find((qualification) => qualification.QualtypeID === qualificationID)
    return this.cs.userLanguage === "en" ? qualification?.QualtypeDesc : qualification?.QualtypeDescAR
  }

  setProcurementDetailsForm() {
    this.procurementDetailsForm = this.fb.group({
      DocTypeId: [this.detArray.DocTypeId ?? '', Validators.required],
      ExproAggrement: [this.detArray.ExproAgrmnt==='Y' ? true : false, Validators.required],
      UrgentRfp: [this.detArray.UrgntRfp==='Y' ? true : false, Validators.required],
      UrgentRfpJustification: [this.detArray.UrgntRfpJustf ?? '', Validators.maxLength(300)]
    })
  }


  ITCheckList: any = {};
   getITCheckList() {
    const req = {
      checklist_type: '01'
    }

    this.api.post('getChecklist', req).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.ITCheckList = {
          parentCheckList: res.d.results.filter((node: any) => node.parent_checklist_id === '000'),
          childCheckList: res.d.results.filter((node: any) => node.parent_checklist_id !== '000')
        }
        this.getCommitmentItems();
        
        
      },
      (error) => {

      }
    );
  }

  procurementCheckListData: any = [];
  getProcCheckList() {
    const req = {
      checklist_type: '02'
    }
    let role: any = this.cs.getRolefromLocal();
    this.api.post('getChecklist', req).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.procurementCheckListData = res.d.results.filter((data: any) => {
        if ((data.checklist_applicapable == this.cs.getUserData().DeptId || data.checklist_applicapable == '') && data.checklist_access == 'P') {
          return true;
        }
        return false;
      });
      
      
      this.procurementCheckListData.forEach((list: any) => {
        
        if (list.to_ChkLstDts.results.length > 1) {
          this.procurmentForm.addControl('procu' + list.checklist_id, this.fb.control('', [Validators.required]));
          this.procurmentForm.addControl('procu' + list.checklist_id + 'Comment', this.fb.control(''));
        } else if (list.to_ChkLstDts.results.length == 1 && !list.to_ChkLstDts.results[0].checklist_val_en) {
          this.procurmentForm.addControl('procu' + list.checklist_id, this.fb.control(''));
        } else if (list.to_ChkLstDts.results.length == 1 && list.to_ChkLstDts.results[0].checklist_val_en) {
          this.procurmentForm.addControl('procu' + list.checklist_id, this.fb.control(false));
        }

        // if (list.to_ChkLstDts.results.length > 1 && list.to_ChkLstDts.results[0].is_comments_required) {
          
        // }
      });

      setTimeout(() => {
        this.setProcChecklistData();
      }, 1000)
    }, err => {

    });
  }


  setProcChecklistData() {
    if (this.detArray) {
      let procuList = this.detArray.ReqToPMChklstNavg.results;
      let parentGroup = this.procurmentForm as FormGroup;

      this.procurementCheckListData.forEach((list: any, i: any) => {
        if (list.to_ChkLstDts.results.length == 1) {
          procuList.forEach((result:any, index:any) => {
            if (list.checklist_id == result.ChecklistId)
            parentGroup.get('procu' + list.checklist_id)?.patchValue(result.TextValue);
            parentGroup.get('procu' + list.checklist_id)?.updateValueAndValidity();
          });
          
        }
        else {
          list.to_ChkLstDts.results.forEach((node: any) => {
            procuList.forEach((result:any, index:any) => {
              if (node.checklist_id == result.ChecklistId && node.checklist_val_id == result.ChecklistValId) {
                parentGroup.get('procu' + list.checklist_id)?.patchValue(node.checklist_val_id + node.checklist_val_en);
                parentGroup.get('procu' + list.checklist_id)?.updateValueAndValidity();
              }
            });         
          });
          procuList.forEach((result:any, index:any) => {
            if (list.checklist_id == result.ChecklistId) {
              parentGroup.get('procu' + list.checklist_id + 'Comment')?.patchValue(result.ChecklistCmnts);
              parentGroup.get('procu' + list.checklist_id + 'Comment')?.updateValueAndValidity();
            }
          });
        }
      });
    }

  }


  checkProcRadio(evt: any, procList: any) {
    
    // if (evt.toLowerCase().indexOf('yes') > -1) {
    //   this.procurmentForm.get('procu' + procList.checklist_id + 'Comment')?.addValidators([Validators.required]);
    //   this.procurmentForm.get('procu' + procList.checklist_id + 'Comment')?.updateValueAndValidity();
    // } else {
    //   this.procurmentForm.get('procu' + procList.checklist_id + 'Comment')?.removeValidators([Validators.required]);
    //   this.procurmentForm.get('procu' + procList.checklist_id + 'Comment')?.updateValueAndValidity();
    // }
  }

  getProclistMapped(data: any) {
    
    if (this.checkProcurementIsRequired) {
      this.procurementCheckListData.forEach((procList: any) => {
        if (procList.to_ChkLstDts.results.length > 1) {
          data['ReqToPMChklstNavg'].push({
            "RfpNo": this.detArray.RfpNo,
            "RfpVersion": this.detArray.RfpVersion,
            "ChecklistId": procList.checklist_id,
            "ChecklistValId": this.procurmentForm.value['procu' + procList.checklist_id].substr(0, 3),
            "TextValue": "",
            "ChecklistCmnts": this.procurmentForm.value['procu' + procList.checklist_id + 'Comment'],
            "CreatedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedBy : '',
            "CreatedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedAt : '',
            "ChangedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedBy : '',
            "ChangedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedAt : '',
          })
        } else if (procList.to_ChkLstDts.results.length == 1 && !procList.to_ChkLstDts.results[0].checklist_val_en) {
          data['ReqToPMChklstNavg'].push({
            "RfpNo": this.detArray.RfpNo,
            "RfpVersion": this.detArray.RfpVersion,
            "ChecklistId": procList.checklist_id,
            "ChecklistValId": '',
            "TextValue": this.procurmentForm.value['procu' + procList.checklist_id],
            "ChecklistCmnts": '',
            "CreatedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedBy : '',
            "CreatedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedAt : '',
            "ChangedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedBy : '',
            "ChangedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedAt : '',
          })
        } else if (procList.to_ChkLstDts.results.length == 1 && procList.to_ChkLstDts.results[0].checklist_val_en && this.procurmentForm.value['procu' + procList.checklist_id]){
          data['ReqToPMChklstNavg'].push({
            "RfpNo": this.detArray.RfpNo,
            "RfpVersion": this.detArray.RfpVersion,
            "ChecklistId": procList.checklist_id,
            "ChecklistValId": procList.to_ChkLstDts.results[0].checklist_val_id,
            "TextValue": '',
            "ChecklistCmnts": '',
            "CreatedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedBy : '',
            "CreatedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].CreatedAt : '',
            "ChangedBy": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedBy : '',
            "ChangedAt": this.detArray.ReqToPMChklstNavg.results && this.detArray.ReqToPMChklstNavg.results[0] ? this.detArray.ReqToPMChklstNavg.results[0].ChangedAt : '',
          })
        }
      });
    }

    return data;
  }

  getInitialDetails(): void {
    const payload: DetailsPayload = {
      rfpno: window.history.state.RfpNo,
      RfpVersion: window.history.state.RfpVersion,
    };

    const getDetail = this.api.post('RfpDet', payload);
    

    forkJoin([getDetail]).pipe(takeUntil(this.destroy$)).subscribe(
      ([detail]) => {
        if (detail) {
          this.detArray = detail.d.results[0]
          this.VATAmount = this.currenyPipe.transform((this.detArray.EstPrice - this.detArray.EstmPriceWithoutVat).toFixed(2)) 
          this.getBudgetDetails( this.detArray.RfpNo, this.detArray.RfpVersion)
          this.rfp.getRfpUserDetails(this.detArray.RfpNo, this.detArray.RfpVersion,this.rfpUserDetails.UserId).pipe(takeUntil(this.destroy$)).subscribe({
            next: userDetails => {
              console.log(userDetails)
              const RFPuserDetails = userDetails.results[0]
              if (!this.Actiondet ) {
                this.Actiondet = {
                  RfpNo: '',           // or fetch default from state
                  RfpVersion: '',
                  RfpDeptId: '',
                  WfFlowType: '',
                  CwfDept: '',
                  CwfApprvLevel: '',
                  CwfApprvRole: '',
                  NwfApprvDept: '',
                  NwfApprvLevel: '',
                  NwfApprvRole: '',
                  NwfApprvId: '',
                  NwfDept: '',
                  Action: '',
                  WfReqComment: '',
                  IsRfpRddApproved: ''
                };
              }
              
              // Now safe to assign
              if(this.isSearchRFPActive){
                this.Actiondet.CwfDept = RFPuserDetails?.DeptText ?? '';
                this.Actiondet.CwfApprvRole = RFPuserDetails?.Role ?? '';
              }


            },
            error: err => console.error(err)
          })
          this.setDetails();
          this.getCostcenter();
          if(this.detArray.ReqToBudsrNavg.results){
            this.updateFormGroupsFromBoqItems()
          }
          this.rfp.setUserRoleAndDept(this.isQualificationFinTeam  )

        }
        
        this.getProcCheckList();
        // this.getBudgetDetails(this.detArray.RfpNo, this.detArray.RfpVersion)

      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    );
  }

  get budgetDetails(){
    let bugetDetails: KPIDetails = {
      kpiHeading: this.detArray.EstPrice,
      kpiDescription:this.translate.instant('RFP.RfpEstmPrice VAT')
    }

    return bugetDetails
  }

   

  durationType: any;
  setDetails() {
    if (this.detArray) {
      
      this.commitmentItem = this.detArray.CommitmentItem;
      this.getInternalOrders();
      this.internalOrder = this.detArray.InternalOrder;
      this.ReqToBoqNavg = this.rfp.transformToBoqTableList(this.detArray.ReqToBudsrNavg.results,this.detArray.ReqToBoqNavg?.results );
      console.log(this.ReqToBoqNavg)

      // this.ReqToBoqNavg.forEach((nav:any) => {
      //   nav['checkList'] = [];
        
      //     this.ITCheckList.parentCheckList.forEach((elem:any) => {
      //       nav['checkList'].push({
      //         list: nav.BoqToITChkLstNavg.results.filter((childList:any) => childList.ParentChecklistId == elem.checklist_id),
      //         groupName: elem.checklist_name_en
      //       })
      //     });
          
      // });

      
      
      this.ReqToQualfNavg = this.detArray?.ReqToQualfNavg?.results;
      this.ReqToFinNavg = this.detArray?.ReqToFinNavg?.results;
      this.ReqToAttchNavg = this.detArray?.ReqToAttchNavg?.results;
      this.fileNetList = this.detArray?.ReqToAttchNavg?.results;
      this.ReqToMpwrNavg = this.detArray?.ReqToMpwrNavg?.results;
      this.ReqToWorkNavg = this.detArray?.ReqToWorkNavg?.results;
      this.ReqToTechNavg = this.detArray?.ReqToTechNavg?.results.map(({ItemNo, Descr, Percentage,Headline, TechToTechSub}: any) => {
        return {
          ItemNo,
          Descr,
          Percentage,
          Headline,
          TechToTechSub: TechToTechSub.results.map(({SubItemNo, Descr, Percentage, ...rest}: any) => {
            return {SubItemNo, Descr, Percentage}
          }),
          expand: TechToTechSub.results.length ? true : false
        }
      });
      this.ReqToTreqNavg = this.detArray?.ReqToTreqNavg?.results;
      this.ReqToTmbrNavg = this.detArray?.ReqToTmbrNavg?.results ?? [];
      
      // if ((this.detArray.PurchaseType === 'R' || this.detArray.PurchaseType === 'D') && this.detArray.EstPrice > 100000) {
      // }
      // this.detArray.ReqToPMChklstNavg.results.sort((a:any, b:any) => a.ChecklistId.localeCompare(b.ChecklistId));
      this.ApprvComments = window.history.state.WfReqComment;
      this.durationType = durationTypes.find((du: any) => du.id == this.detArray.DurationMeasure);

      // if (this.Actiondet && this.Actiondet.CwfApprvRole != 'APRT1' && this.Actiondet.CwfApprvRole !== 'APED1' && this.Actiondet.CwfDept !== 'FR1' && this.Actiondet.CwfDept !== 'FR2') {
        
      // }
      this.getUserList();

     

      if(this.isProcurementTeam) {
        this.setProcurementDetailsForm();
        this.procurementDetailsForm.valueChanges.subscribe((values) => {
          this.isSaveChanges = true;
        })
      }

      this.spinner.hide();
    }
  }

  groupBoqItemsByYear() {
    this.groupBOQItemsBasedonBudgetingYears = this.ReqToBoqNavg.reduce((acc:any, item:any) => {
      const year = item.budgetYear;
      if (!acc[year]) acc[year] = [];
      const matchedItem = this.commitmentItems.find(
        (commitmentItem: CommitmentItem) => commitmentItem.Commitmentitem === item.CommItm?.replace(/^0+/, '')

      );
      
      const commitmentItemWithDescription = matchedItem 
        ? `${matchedItem.Commitmentitem} - ${matchedItem.Description}` 
        : '';
      item.CommItm = commitmentItemWithDescription
      item.IntOrd = item.IntOrd.replace(/^0+/, '') 

      acc[year].push(item);
      return acc;
    }, {} as { [year: number]: any[] });

    if(this.isBudgetDetailsPresent){
      this.getInternalOrderLists(true)
    }else{
      Object.keys(this.groupBOQItemsBasedonBudgetingYears).forEach((year)=>{
        this.budgetingGroups.push(
          this.fb.group({
            commitmentItem: ['', Validators.required],
            internalOrder: [''],
          })
        );
      })
    }
    this.getUpdatedInternalOrder()
    console.log(this.budgetingGroups)
  }


  getInternalOrderLists(isInitialLoad: boolean) {
    this.internalOrderItems = [];
    // this.budgetingGroups = [];
  
    const isBudgetDetailsPresent = this.isBudgetDetailsPresent;
    const formValue = this.applyCommitmentItemAndInternalOrderToAllYearsForm.value;
  
    const internalOrderObservables: Observable<InternalOrder[]>[] = [];
    const itemsPerYear: any[] = [];
  
    Object.keys(this.groupBOQItemsBasedonBudgetingYears).forEach((year) => {
      const items = (this.groupBOQItemsBasedonBudgetingYears as any)[year];
      const firstItem = items[0];
  
      if (firstItem) {
        const commitmentNumber = isBudgetDetailsPresent
          ? firstItem.CommItm.match(/^\d+/)?.[0]
          : formValue.commitmentItem;
  
        internalOrderObservables.push(this.rfp.getInternalOrders(commitmentNumber));
        itemsPerYear.push(firstItem);
      }
    });
    
    forkJoin(internalOrderObservables)
      .pipe(takeUntil(this.destroy$))
      .subscribe((allInternalOrders: InternalOrder[][]) => {
        allInternalOrders.forEach((orders, index) => {
          const item = itemsPerYear[index];
          this.internalOrderItems.push(orders);
  
          console.log("Orders:", orders);
          console.log("Item:", item.CommItm, item.IntOrd);
  
          if (isBudgetDetailsPresent && isInitialLoad) {
            this.budgetingGroups.push(
              this.fb.group({
                commitmentItem: [item.CommItm?.split('-')[0].trim(), Validators.required],
                internalOrder: [item.IntOrd],
              })
            );
          }
        });
  
        this.getUpdatedInternalOrder();
        this.checkIsInternalOrderAndCommitmentItemChanged();
      });
  }
  

  getUpdatedInternalOrder() {
    this.budgetingGroups.controls.forEach((group: AbstractControl, index: number) => {
      if (!this.subscribedIndices.has(index)) {
        this.subscribedIndices.add(index);
        const year = Object.keys(this.groupBOQItemsBasedonBudgetingYears)[index];
  
        // Subscribe to commitmentItem changes
        group.get('commitmentItem')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: string) => {
            console.log(value)
            const commitmentNumber = value.match(/^\d+/)?.[0];
            if (commitmentNumber) {
              this.rfp.getInternalOrders(commitmentNumber)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (orders: InternalOrder[]) => {
                    this.internalOrderItems[index] = orders;
                    group.get('internalOrder')?.setValue(null);
                    this.onCommitmentOrInternalOrderChange(index,year)
                  },
                  error: (err) => {
                    console.error(`Failed to fetch internal orders for ${commitmentNumber}`, err);
                  }
                });
            } else {
              this.internalOrderItems[index] = [];
              group.get('internalOrder')?.setValue(null);
            }
          });
  
        // Subscribe to internalOrder changes
        group.get('internalOrder')?.valueChanges
  .pipe(takeUntil(this.destroy$))
  .subscribe(() => {
    Promise.resolve().then(() => {
      this.checkIsInternalOrderAndCommitmentItemChanged();
      this.onCommitmentOrInternalOrderChange(index,year)
    });
  });

      }
    });
  }
  
  
  checkIsInternalOrderAndCommitmentItemChanged() {
    let currentCommitmentItemAndInternalOrder: any[] = [];
  
    Object.keys(this.groupBOQItemsBasedonBudgetingYears).forEach((item: any) => {
      const entryArray = this.groupBOQItemsBasedonBudgetingYears[item];
      if (entryArray && entryArray.length > 0) {
        const entry = entryArray[0]; 
        currentCommitmentItemAndInternalOrder.push({
          commitmentItem: entry.CommItm?.split('-')[0].trim(),
          internalOrder: entry.IntOrd
        });
      }
    });
  
    // Optional: sort arrays to avoid mismatch due to order
    const sortedCurrent = sortBy(currentCommitmentItemAndInternalOrder, ['commitmentItem', 'internalOrder']);
    const sortedOriginal = sortBy(this.budgetingGroups.value, ['commitmentItem', 'internalOrder']);
  
    this.isCommitmentAndInternalOrderChanged = !isEqual(sortedCurrent, sortedOriginal);
  }
  
  

  getInternalOrders(): void {
    if (this.commitmentItem) {
      this.spinner.show();
      this.api.get(`get-internal-orders?commitment_id=${this.commitmentItem}`)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.spinner.hide();
          this.internalOrders = res.d.results;
        },
        (err) => {
          this.spinner.hide();
          this.cs.createMessage('error', err.statusText);
        }
      );
    }
  }

  onCommitmentOrInternalOrderChange(i: number, year: string) {
    const group = this.budgetingGroups.at(i);
    const commitmentItem = group.get('commitmentItem')?.value;
    const internalOrder = group.get('internalOrder')?.value;

    if (commitmentItem) {
      this.getAvailableBudget(commitmentItem, internalOrder, year);
    }
  }

  getAvailableBudget(commitmentItem: string, internalOrder: string | null, year: string): void {
  console.log("called");

  // Remove leading zeros
  const cleanedCommitmentItem = (commitmentItem || '').replace(/^0+/, '');
  const cleanedInternalOrder = (internalOrder || '').replace(/^0+/, '');

  if (cleanedCommitmentItem) {
    this.spinner.show();
    this.api
      .get(
        `get-available-budget?commitment_id=${encodeURIComponent(cleanedCommitmentItem)}&internal_order=${encodeURIComponent(cleanedInternalOrder)}&year=${encodeURIComponent(year || '')}`
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          this.availableBudget[year] = res.d.AvaiableBudget;
        },
        (err) => {
          this.spinner.hide();
          this.cs.createMessage('error', err.statusText);
        }
      );
  }
}

  refreshBudget(): void {
    this.updateFormGroupsFromBoqItems()
  }

// check budget against each year while its greater than grand total
checkBudgetPerYear(): boolean {
  if (!this.availableBudget || Object.keys(this.availableBudget).length === 0) {
    return false;
  }
  return Object.keys(this.availableBudget).every((year) => {
    const budgetNum = this.availableBudget[year] != null ? Number((this.availableBudget[year] + '').trim()) : 0;

    let yearItems: any[] = [];

    if (Array.isArray(this.groupBOQItemsBasedonBudgetingYears)) {
      const idx = Number(year);
      if (!isNaN(idx)) {
        yearItems = this.groupBOQItemsBasedonBudgetingYears[idx] || [];
      }
    } else if (typeof this.groupBOQItemsBasedonBudgetingYears === 'object' && this.groupBOQItemsBasedonBudgetingYears !== null) {
      yearItems = (this.groupBOQItemsBasedonBudgetingYears as Record<string, any[]>)[year] || [];
    }

    const grandTotalWithVat = this.getGrandTotalWithVat(yearItems);
    return budgetNum > grandTotalWithVat;
  });
}

  getInternalOrderItem(orderID: string): string {
    const internalOrder = this.internalOrders.find((order) => order.InternalOrder === orderID);
    if (internalOrder) {
      return internalOrder.InternalOrder;
    } else {
      return '-';
    }
  }

  Assign() {
    if (this.Actiondet?.CwfApprvRole == 'FRASGN1' && (this.Actiondet?.CwfDept == 'FR1' || this.Actiondet?.CwfDept == 'FR2' || this.Actiondet?.CwfDept == 'FR3')) {
      if (this.procurmentForm.invalid) {
        this.cs.createMessage(
          'error',
          this.translate.instant('RFP.FillMandate') +
          ' ' +
          this.translate.instant('RFP.Procurement Checklist')
        );
        this.isAssignClick = false;
        
        return;
      }
      
    }
    this.spinner.show();
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: this.assignBack ? 'ASGBCK' : 'ASSGN',
      NwfApprvDept: this.selectUser?.NwfApprvDept
        ? this.selectUser.NwfApprvDept
        : '',
      NwfApprvLevel: this.selectUser?.NwfApprvLevel
        ? this.selectUser.NwfApprvLevel
        : '',
      NwfApprvRole: this.selectUser?.NwfApprvRole
        ? this.selectUser.NwfApprvRole
        : '',
      NwfApprvId: this.selectUser?.NwfApprvId ? this.selectUser.NwfApprvId : '',
      NwfDept: this.selectUser?.NwfDept ? this.selectUser.NwfDept : '',
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };
  

    forkJoin([
      this.api.post('WfAction', data),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([res]) => {
          console.log('Response 1:', res);
          
          if (res) {
            // Log MessageId to ensure the correct path
            
            
            // Hide spinner and show success message
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? "Successfully assigned" : "تم التعيين بنجاح"
            );
            this.router.navigate(['rfp/myinbox']);
          } else {
            // Handle case where one of the responses is missing or invalid
            this.spinner.hide();
            this.cs.createMessage(
              'Error',
              'Please try again later'
            );
          }
        },
        ([error]) => {
          // Log errors for debugging
          console.error('Error 1:', error);
          
          // Hide spinner and show error message
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );

    }

  // approveRequest() {
  //   this.spinner.show();

  //   // ? If the user is Qualification Committee Finance team then save the data and apporve
  //   // ? For other users its only Apporve
  //   // Todo : Change the user role from 'ASAP1' to New user role. This is for testing
  //   this.approveRequestPost(); 

  // }

  // Commenting this code since it requires a single button for approve and assign of CEO
  // approveRequestPost() {
  //    this.spinner.show();
  //   const payloadData = this.constructPayloadData('APRVD');

  //  forkJoin(this.api.post('WfAction', payloadData)).pipe(takeUntil(this.destroy$)).subscribe(
  //     (res: any) => {
  //       if (res[0].d.MessageId === 'S') {
  //         this.spinner.hide();
  //         // this.cs.createMessage(
  //         //   'Success',
  //         //   this.cs.userLanguage === 'en' ? res[0].d.MessageEn : res[0].d.MessageAr
  //         // );
  //         this.approvedConfirmation = true;
  //         this.responseMessage =  this.cs.userLanguage === 'en' ? res[0].d.MessageEn : res[0].d.MessageAr 
       
         
  //       } else {
  //         this.spinner.hide();
  //         this.submitConfirmationFailure = true;
  //         this.responseMessage =  this.cs.userLanguage === 'en' ? res[0].d.MessageEn : res[0].d.MessageAr 
  //         // this.cs.createMessage(
  //         //   'Success',
  //         //   this.cs.userLanguage === 'en' ? res[0].d.MessageEn : res[0].d.MessageAr
  //         // );
  //       }
  //     },
  //     (error) => {
  //       this.submitConfirmationFailure = true;
  //       this.responseMessage = error.statusText
  //       this.spinner.hide();
  //       //this.cs.createMessage('error', error.statusText);
  //     }
  //   );
  // }

  //   assignRFP() {
  //   this.spinner.show();
  //   const payload = {
  //     RfpNo: this.detArray.RfpNo,
  //     RfpVersion: this.detArray.RfpVersion,
  //     DeptId: this.detArray.DeptId,
  //     WfResComment: this.reqComments,
  //     WfApprvAction: 'ASSGN', 
  //     NwfApprvDept: '',
  //     NwfApprvLevel: '',
  //     NwfApprvRole: '',
  //     NwfApprvId: '',
  //     NwfDept: '',
  //     CreatedBy: this.detArray.CreatedBy,
  //     LogonUsr: this.cs.getUserData().userid

  //   };
  //   console.log(payload)
  //   this.api.post('WfAction', payload).subscribe(
  //     (res: any) => {
  //       this.spinner.hide();
  //       if (res.d.MessageId === 'S') {
  //          this.cs.createMessage(
  //             'Success',
  //             this.cs.userLanguage === 'en' ? "Successfully assigned" : "تم التعيين بنجاح"
  //           );
  //           this.closeAssignModal();
  //           this.router.navigate(['rfp/myinbox']);
  //       } else {
  //          this.cs.createMessage(
  //             'Error',
  //             'Please try again later'
  //           );
  //           this.closeAssignModal();
  //       }
  //     },
  //     (err: any) => {
  //       this.spinner.hide();
  //         this.cs.createMessage('error', err.statusText);
  //     }
  //   );
  // }

approveRequestPost(): void {
  this.spinner.show();

  let payloadData :any;

  if (this.isCEO) {
    // check all years budget only if CEO
    const allYearsHaveBudget = this.checkBudgetPerYear();

    payloadData = allYearsHaveBudget
      ? this.constructPayloadData('APRVD')
      : this.constructPayloadData('ASSGN');  // If budget is not available for all the years, assign to another member or approve it. 
  } else {
    // for all other users, always approve
    payloadData = this.constructPayloadData('APRVD');
  }

  this.api.post('WfAction', payloadData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.spinner.hide();
        const message =
          this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr;

        if (res.d.MessageId === 'S') {
          if (this.isCEO && payloadData.WfApprvAction === 'ASSGN') {
            // assigned
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en'
                ? 'Successfully assigned'
                : 'تم التعيين بنجاح'
            );
            this.closeAssignModal();
            this.router.navigate(['rfp/myinbox']);
          } else {
            // approved
            this.approvedConfirmation = true;
            this.responseMessage = message;
          }
        } else {
          this.submitConfirmationFailure = true;
          this.responseMessage = message;
          this.closeAssignModal();
        }
      },
      (error) => {
        this.spinner.hide();
        this.submitConfirmationFailure = true;
        this.responseMessage = error.statusText;
      }
    );
}


  rejectRFP() {
    this.spinner.show();
    const payload = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'RJCT', 
      NwfApprvDept: '',
      NwfApprvLevel: '',
      NwfApprvRole: '',
      NwfApprvId: '',
      NwfDept: '',
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };
    this.api.post('WfAction', payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.d.MessageId === 'S') {
          this.rejectConfirmation = true;
          this.responseMessage =  this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr;
        } else {
          this.rejectFailure = true;
          this.responseMessage =  this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr;
        }
      },
      (err: any) => {
        this.rejectFailure = true;
        this.responseMessage = err.statusText;
        this.spinner.hide();
      }
    );
  }


  closeAssignModal(){
    this.isAssign = false;
  }

  getProcurementData(data:any) {
    data.ReqToAttchNavg = data.ReqToAttchNavg.results;
    data.ReqToBoqNavg = data.ReqToBoqNavg.results;
    data.ReqToFinNavg = data.ReqToFinNavg.results;
    data.ReqToMpwrNavg = data.ReqToMpwrNavg.results;
    data.ReqToPMChklstNavg = data.ReqToPMChklstNavg.results;
    
    data.ReqToQualfNavg = data.ReqToQualfNavg.results;
    data.ReqToTechNavg = data.ReqToTechNavg.results;
    data.ReqToTreqNavg = data.ReqToTreqNavg.results;
    data.ReqToWorkNavg = data.ReqToWorkNavg.results;

    data.ReqToBoqNavg.forEach((element:any, index:any) => {
      element.BoqToITChkLstNavg = element.BoqToITChkLstNavg.results;
      delete element.checkList;
    });

    delete data.__metadata;


    return data;
  }

  saveDataPost() {
    
    
    const commitmentPayload = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      CommitmentItem: this.commitmentItem,
      InternalOrder: this.internalOrder ?? ''
    };
    const setCommitmentItem = this.api.post('set-commitment-item', commitmentPayload); 
    forkJoin([ setCommitmentItem]).pipe(takeUntil(this.destroy$)).subscribe(
      ([ commitmentRes]) => {
        if ( commitmentRes.d.message_id === 'S') {
          this.isAssignClick = true;
        } else {
          this.spinner.hide();
          this.cs.createMessage('error' , this.cs.userLanguage === 'En' ? 
            commitmentRes.d.message_en : commitmentRes.d.message_ar);
        }
      },
      (error) => {
        this.cs.createMessage('error', error.statusText);
        this.spinner.hide();
      }
    )
  }

  Return() {
    this.spinner.show();
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'RETND',
      NwfApprvDept: this.Actiondet?.NwfApprvDept,
      NwfApprvLevel: this.Actiondet?.NwfApprvLevel,
      NwfApprvRole: this.Actiondet?.NwfApprvRole,
      NwfApprvId: this.Actiondet?.NwfApprvId,
      NwfDept: this.Actiondet?.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };

    this.api
      .post('WfAction', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d.MessageId === 'S') {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
            this.router.navigate(['rfp/myinbox']);
          } else {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
          }
        },
        (error) => {
          this.spinner.hide();

          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  Review() {
    this.spinner.show();
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.reqComments,
      WfApprvAction: 'REVWD',
      NwfApprvDept: this.selectUser.NwfApprvDept,
      NwfApprvLevel: this.selectUser.NwfApprvLevel,
      NwfApprvRole: this.selectUser.NwfApprvRole,
      NwfApprvId: this.selectUser.NwfApprvId,
      NwfDept: this.selectUser.NwfDept,
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };

    this.api
      .post('WfAction', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d.MessageId === 'S') {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
            this.router.navigate(['rfp/myinbox']);
          } else {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
          }
        },
        (error) => {
          this.spinner.hide();

          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  edit(rfpno: any, RfpVersion: any, role: any, dept: string) {
    this.cs.editFromDetail = true;
    this.router.navigate(['rfp/change'], {
      state: { RfpNo: rfpno, RfpVersion: RfpVersion, CwfApprvRole: role, NwfApprvDept: dept },
    });
  }

  getUserList() {
    this.spinner.show();
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      RfpDeptId: this.detArray.DeptId,
      WfFlowType: this.Actiondet?.WfFlowType,
      CwfDept: this.Actiondet?.CwfDept,
      CwfApprvLevel: this.Actiondet?.CwfApprvLevel,
      CwfApprvRole: this.Actiondet?.CwfApprvRole
    };
    this.api
      .post('RfpWfUsrlstSet', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d?.results[0]?.MessageId !== 'E') {
            this.spinner.hide();
            this.userList = res.d.results;
          } else {
            this.spinner.hide();
            // this.cs.createMessage(
            //   'error',
            //   this.cs.userLanguage === 'en'
            //     ? res.d.results[0].MessageEn
            //     : res.d.results[0].MessageAr
            // );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  getAssgnUser(value: any) {
    this.selectUser = value;
  }

  downloadFile(value: any) {
    window.open(environment.downloadUrl + value.AttchId);
  }

  getComments() {

    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
    };
    this.api
      .post('/RfpCmts', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d.results[0].MessageId === 'E') {
            this.cs.createMessage(
              'error',
              this.cs.userLanguage === 'en'
                ? res.d.results[0].MessageEn
                : res.d.results[0].MessageAr
            );
          } else {
            this.commentsArray = res.d.results;
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }
  showHideApprove(){
    this.approvedConfirmation = false;
    this.router.navigate(['rfp/myinbox']);
  }


  showHideComments(showModel: boolean) {
    if (showModel) {
      this.getComments();
    }
    this.showComments = showModel;
  }

  assignToHeading = '';
  showHideAssignTo(showModel: boolean, val?: string) {
    if (showModel) {
      this.assignToHeading = val == 'LGD' ? 'Assign to Legal' : 'Assign to Qualification Finance';
      this.getAssignList(val);
    } else {
      this.assignToComments = '';
      this.assignToUser = null;
    }
    this.showAssignTo = showModel;
  }

  getAssignList(value?: string) {
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      RfpDeptId: this.detArray.DeptId,
      WfFlowType: this.Actiondet?.WfFlowType,
      CwfDept: this.Actiondet?.CwfDept,
      CwfApprvLevel: this.Actiondet?.CwfApprvLevel,
      CwfApprvRole: this.Actiondet?.CwfApprvRole,
      assignToType: value
    };
    this.api
      .post('/RfpWfUsrlist', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.assignTouserList = res.d.results;
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
        }
      ).add(() => {
        this.spinner.hide();
      });
  }


  showAssignBack() {
    this.isAssignBack = true
  }

  assignBackToOfficer() {
    const data: WorkflowPayload = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfApprvAction: 'ASGBCK',
      NwfApprvDept: '',
      NwfApprvLevel: '',
      NwfApprvRole: '',
      NwfApprvId: '',
      NwfDept: '',
      CreatedBy: this.detArray.CreatedBy,
      WfResComment: this.reqComments,
      LogonUsr: this.cs.getUserData().userid

    }
    this.workflowAction(data);
    this.isAssignBack = false;
  }

  workflowAction(payload: WorkflowPayload) {
    this.spinner.show();
    this.api.post('WfAction', payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.spinner.hide();
      if (res.d.MessageId === 'S') {
        this.cs.createMessage(
          'Success',
          this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
        );
        this.router.navigate(['rfp/myinbox']);
      } else {
        this.cs.createMessage(
          'Success',
          this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
        );
      }
    }, (err) => {
      this.spinner.hide();
      this.cs.createMessage('error', err.statusText);
    })
  }

  

  assignTo() {
    console.log(this.assignToUser)
    this.spinner.show();
    let data = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DeptId: this.detArray.DeptId,
      WfResComment: this.assignToComments,
      WfApprvAction: 'ASSGN',
      NwfApprvDept: this.assignToUser?.NwfApprvDept
        ? this.assignToUser.NwfApprvDept
        : '',
      NwfApprvLevel: this.assignToUser?.NwfApprvLevel
        ? this.assignToUser.NwfApprvLevel
        : '',
      NwfApprvRole: this.assignToUser?.NwfApprvRole
        ? this.assignToUser.NwfApprvRole
        : '',
      NwfApprvId: this.assignToUser?.NwfApprvId ? this.assignToUser.NwfApprvId : '',
      NwfDept: this.assignToUser?.NwfDept ? this.assignToUser.NwfDept : '',
      CreatedBy: this.detArray.CreatedBy,
      LogonUsr: this.cs.getUserData().userid

    };
    this.api
      .post('WfAction', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.d.MessageId === 'S') {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
            this.router.navigate(['rfp/myinbox']);
          } else {
            this.spinner.hide();
            this.cs.createMessage(
              'Success',
              this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }
  

  constructPayloadData(action: string): ApprovePayaload | undefined {
    let payload: any | undefined;
    if (this.Actiondet) {
      payload = {
        RfpNo: this.detArray.RfpNo,
        RfpVersion: this.detArray.RfpVersion,
        DeptId: this.detArray.DeptId,
        WfResComment: this.reqComments,
        WfApprvAction: action, // * Dynamic action binded
        NwfApprvDept: this.Actiondet.NwfApprvDept,
        NwfApprvLevel: this.Actiondet.NwfApprvLevel,
        NwfApprvRole: this.Actiondet.NwfApprvRole,
        NwfApprvId: this.Actiondet.NwfApprvId,
        NwfDept: this.Actiondet.NwfDept,
        CreatedBy: this.detArray.CreatedBy,
        LogonUsr: this.cs.getUserData().userid

      };
    }
    return payload;
  }

  // * Creates Qualification Financial Form Groups
  createQualFinCriForm(criteria: any) {
      const itnoq = this.slQualFinCriteria++;
    return this.fb.group({
      RfpNo: [this.detArray.RfpNo],
      RfpVersion: [this.detArray.RfpVersion],
      ItemNo: [{ value: criteria.ItemNo ? criteria.ItemNo : itnoq.toString(), disabled: true }],
      Descrar: [{ value: criteria.Descrar ? criteria.Descrar : criteria.FevalAr, disabled: true }],
      Descren: [{ value: criteria.Descren ? criteria.Descren : criteria.FevalEn, disabled: true }],
      Range: [criteria.Range ? criteria.Range : '', Validators.required],
      Percentage: [criteria.Percentage ? Number(criteria.Percentage) : '', Validators.required],
      LogonUsr: [this.cs.getUserData().userid]
    });
  }

  allMatGroups:any;
  getMatgp() {
      let data = {
        DocTypeId: '',
      };
      this.api
        .post('F4MatGrpSet', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.allMatGroups = res.d.results;
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);
          }
        );
  }

  costctr: any;
  getCostcenter() {
    this.api
      .post('F4CostCntrSet', this.cs.getUserData())
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.costctr = res.d.results;
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  get costCenterTenderLevel(): string {
    const cc = this.costctr.find((costCenter:any) => costCenter.CostCenter === this.detArray.CostCenter);
    return cc ? cc.CostCenter + "-" + cc.CostCenterTxt : '-';
  }

  assignBack = false;
  warnings: string[] = [];

  checkEmployeeSelected() {
    this.checkIsInternalOrderAndCommitmentItemChanged()
    this.warnings = [];
     Object.keys(this.availableBudget).forEach((year, idx) => {
    const budget = this.availableBudget[year];
    const normalizedBudget =
      budget != null ? Number((budget + '').trim()) : null;

    // Get the commitmentItem from the corresponding form group
    const formGroup = this.budgetingGroups.at(idx);
    const commitmentItem = formGroup?.get('commitmentItem')?.value || '-';

      // Get the corresponding year items
      let yearItems: any[] = [];
      if (Array.isArray(this.groupBOQItemsBasedonBudgetingYears)) {
        const idxNum = Number(year);
        if (!isNaN(idxNum)) {
          yearItems = this.groupBOQItemsBasedonBudgetingYears[idxNum] || [];
        }
      } else if (
        typeof this.groupBOQItemsBasedonBudgetingYears === 'object' &&
        this.groupBOQItemsBasedonBudgetingYears !== null
      ) {
        yearItems =
          (this.groupBOQItemsBasedonBudgetingYears as Record<string, any[]>)[year] || [];
      }

      // Calculate grand total with VAT for this year
      const grandTotalWithVat = this.getGrandTotalWithVat(yearItems);

       if (normalizedBudget !== null && normalizedBudget < grandTotalWithVat) { 
      this.warnings.push(
        this.cs.userLanguage === 'en'
          ? `Attention: Budget is not available for the commitment item (${commitmentItem}) in the current year (${year})`
          : `انتبه : لا توجد ميزانية متاحة لهذا البند  (${commitmentItem}) في سنة (${year})`
      );
    }
  });
    if(this.isBudgetDetailsPresent && !this.isCommitmentAndInternalOrderChanged){
      this.isAssignClick = true;
    }else{
      if(this.isCommitmentAndInternalOrderChanged){
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
            ? "Please save the changes before proceeding"
            : "يرجى حفظ التغييرات قبل المتابعة"
        );
      }else{
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'en'
          ? "Please fill the Commitment Item and Internal Order to proceed"
          : "يرجى تعبئة عنصر الالتزام وأمر الصرف للمتابعة"
              )
      }
    }
  }


  setProcurementDetails() {
    this.spinner.show();
    const payload = {
      RfpNo: this.detArray.RfpNo,
      RfpVersion: this.detArray.RfpVersion,
      DocTypeId: this.procurementDetailsForm.get('DocTypeId')?.value,
      ExproAggrement: this.procurementDetailsForm.get('ExproAggrement')?.value ? 'Y' : 'N',
      UrgentRfp: this.procurementDetailsForm.get('UrgentRfp')?.value ? 'Y' : 'N',
      UrgentRfpJustification: this.procurementDetailsForm.get('UrgentRfpJustification')?.value
    };
    this.api.post('set-procurement-details', payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.spinner.hide();
      if(res.d.MessageId === 'S') {
        this.spinner.hide();
        this.cs.createMessage('success', this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr);
        this.isSaveChanges = false;
      }else {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr);
      }
    }, (err) => {
      this.cs.createMessage('error', err.statusText);
    })
  }

  dtypes = dtypes;
  getProcurementType(type:any) {
    if (this.dtypes) {
      const data = this.dtypes.find((node:any) => node.id == type);
      if (data) {
        return this.cs.userLanguage === 'en' ? data.value : data.valueAr;
      } else {
        return '';
      }
    }
    return '';
  }

  getMaterialGroup(type:any) {
    if (this.allMatGroups) {
      const data = this.allMatGroups.find((node:any) => node.MatGrpId == type);
      if (data) {
        if(this.cs.userLanguage === 'en') {
          return `${data.MatGrpId}-${data.MatGrpText}`;
        } else {
          return `${data.Data1}-${data.MatGrpId}`;
        }
      } else {
        return '';
      } 
    }
    return '';
  }

  //*********** Getter methods starts ***********/



  get isQualificationFinTeam(): boolean {
    const QualificationFinDepartment = 'QFN';
    const QualificationFinRole = 'ASRT1';

    if (
      this.Actiondet?.CwfDept === QualificationFinDepartment &&
      this.Actiondet?.CwfApprvRole === QualificationFinRole
    ) {
      return true;
    } else {
      return false;
    }
  }

  get isFinanceTeam(): boolean {
    const department = 'QFN';
    
    if(this.Actiondet?.CwfDept === department) {
      return true;
    }else {
      return false;
    }
  }

  get isPMOTeam(): boolean {
    const department = 'PMO';

    if(this.Actiondet?.CwfDept === department) {
      return true;
    }else {
      return false;
    }

  }
  get isFinanceOfficer(): boolean{
    const role = 'ASRT1'
    return (this.Actiondet?.CwfApprvRole === role && this.isFinanceTeam)  ? true : false
  }
  get isFinanceManager(): boolean{
    const role = 'APRT1'
    return (this.Actiondet?.CwfApprvRole === role && this.isFinanceTeam) ? true : false
  }

  get isProcurementTeam(): boolean {
    const department = 'PUD';

    if(this.Actiondet?.CwfDept === department) {
      return true;
    }else {
      return false;
    }

  }

  get isProcurementOfficer(): boolean{
    const role = 'ASRTED1'
    return (this.Actiondet?.CwfApprvRole === role && this.isProcurementTeam) ? true : false
  }

  get isProcurementManager(): boolean{
    const role = 'ASABRT1'
    return (this.Actiondet?.CwfApprvRole === role && this.isProcurementTeam) ? true : false
  }

  get isProcurementDirector(): boolean{
    const role ='APAB1'
    return (this.Actiondet?.CwfApprvRole === role && this.isProcurementTeam) ? true : false
  }

  get checkProcurementIsRequired(): boolean {
    const Department = ['FR1', 'FR2', 'FR3'];
    const QualificationFinRole = 'FRASGN1';

    if (
      Department.find((da:any) => da == this.Actiondet?.CwfDept) &&
      this.Actiondet?.CwfApprvRole === QualificationFinRole
    ) {
      return true;
    } else {
      return false;
    }
  }

  get isCEO(): boolean{
    const role = 'APABRJAS1'
    if(this.Actiondet?.CwfApprvRole === role){
      return true
    }else{
      return false
    }
  }
  get newFORole(): boolean{
    const role = 'AP'
     if(this.Actiondet?.CwfApprvRole === role){
      return true
    }else{
      return false
    }
  }
  get isRFPRequestorTeam(): boolean{
    const department = 'DPT';
    return this.Actiondet?.CwfDept === department
  }

  get isRFPRequestorManage(): boolean{
    const role = 'APRT1'
    return (this.Actiondet?.CwfApprvRole === role && this.isRFPRequestorTeam) ? true : false
  }
  get isRFPRequestor(){
    const role = 'Requestor'
    return (this.rfpUserDetails.RoleIdf === role && this.Actiondet?.CwfDept === "") ? true : false
  }

  get isDashboardAccess() {
    const role = 'Manager';
    return this.rfpRoles?.some((r: string) => r === role) ?? false;
  }

  //* show fin details to procurment officer and manager if RFP is approved
  get isRFPApprovedToShowFinDetails(){
    return (this.isProcurementTeam && this.detArray.RfpStatus === 'A') || (this.isProcurementTeam && this.detArray.RfpStatus === 'A')
  }

  get visibleFinancialDetails(){
    return this.isFinanceTeam || this.isProcurementDirector || this.isCEO || this.isRFPRequestorManage || this.isRFPRequestor || this.isRFPApprovedToShowFinDetails || this.rfpUserDetails?.DeptId === '00005014' || this.isProcurementManager;
  }

  get visibleCommitmentItemAndInternalOrder(){
    return this.isFinanceTeam || this.isProcurementDirector || this.isCEO || this.isRFPApprovedToShowFinDetails || this.rfpUserDetails?.DeptId === '00005014' || this.newFORole || this.isProcurementManager || this.isDashboardAccess;

  }

  
  // commitmentChange(commitmentItem: string) {
  //   this.rfp.getInternalOrders(commitmentItem);
  //   this.rfp.internalOrder$.pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (internalOrderList) => {
  //       this.internalOrderItems = internalOrderList;
  //     },
  //   });
  // }
  get budgetingGroups(): FormArray {
    return this.budgetPlannerForm.get('budgetingGroups') as FormArray;
  }

  //************ Getter methods ends ***********/

  onBugetPlanClicked(){
    this.isBudgetPlannerVisible = !this.isBudgetPlannerVisible
  }
  onBugetPlanClosed(){
    this.isBudgetPlannerVisible = !this.isBudgetPlannerVisible
  }

applyCommitmentItemAndInternalOrderToAllYears() {
  this.getInternalOrderLists(false);

  const { commitmentItem, internalOrder } = this.applyCommitmentItemAndInternalOrderToAllYearsForm.value;

  Object.keys(this.groupBOQItemsBasedonBudgetingYears).forEach((year, index) => {
    const group = this.budgetingGroups.at(index);

    group.patchValue({
      commitmentItem,
      internalOrder: '' 
    }, { emitEvent: false });
    if (commitmentItem) {
      const commitmentNumber = commitmentItem.match(/^\d+/)?.[0];
      this.rfp.getInternalOrders(commitmentNumber)
        .pipe(takeUntil(this.destroy$))
        .subscribe((orders: InternalOrder[]) => {
          this.internalOrderItems[index] = orders;
          group.get('internalOrder')?.setValue(internalOrder || '');
        });
    } else {
      this.internalOrderItems[index] = [];
    }

    if (commitmentItem) {
      this.getAvailableBudget(commitmentItem, internalOrder, year);
    }
  });
}

clearCommitmentItemAndInternalOrderToAllYears() {
  this.isBudgetDetailsPresent = false;
  this.applyCommitmentItemAndInternalOrderToAllYearsForm.patchValue({
    commitmentItem: '',
    internalOrder: '',
  });
  this.checkBudgetPerYear();
  this.availableBudget = {};
  this.budgetingGroups.controls.forEach(group => {
    group.patchValue({
      commitmentItem: '',
      internalOrder: '',
    });
    group.markAsPristine();
    group.markAsUntouched();
  });
}

// saveCommitmentItemAndInternalOrderToAllYears(){
//   const BoqItemWithInternalItemAndCommitmentItem= this.detArray.ReqToBudsrNavg.results.map((boqItem:any, index:number) => {
//     const formGroupValue = this.budgetingGroups.at(index)?.value;
  
//     return {
//       ...boqItem,
//       CommItm: formGroupValue?.commitmentItem || '',
//       IntOrd: formGroupValue?.internalOrder || ''
//     };
//   });

  
//   const updatedBOQ = {
//     RfpNo: this.detArray.ReqToBudsrNavg.results[0].RfpNo,
//     RfpVersion: this.detArray.ReqToBudsrNavg.results[0].RfpVersion,
//     Rfp_budg_srv_itm_fin: BoqItemWithInternalItemAndCommitmentItem
//   }
  
//   this.postBudgetServiceLineItem(updatedBOQ)

// }


saveCommitmentItemAndInternalOrderToAllYears() {
  // Step 1: Sort the items by Year
  const sortedBoqItems = [...this.detArray.ReqToBudsrNavg.results]
  .sort((a: any, b: any) => +a.BudYear - +b.BudYear); // Notice the '+' to convert to number


  // Step 2: Find unique years in order
  const uniqueYears = [...new Set(sortedBoqItems.map((item: any) => item.BudYear))];

  // Step 3: Map Year → FormGroup index
  const yearToFormGroupValueMap = new Map<number, any>();
  uniqueYears.forEach((year, idx) => {
    const formGroupValue = this.budgetingGroups.at(idx)?.value;
    if (formGroupValue) {
      yearToFormGroupValueMap.set(year, formGroupValue);
    }
  });

  // Step 4: Now map each BOQ item to its corresponding formGroup based on its Year
  const updatedBoqItems = this.detArray.ReqToBudsrNavg.results.map((boqItem: any) => {
    const formGroupValue = yearToFormGroupValueMap.get(boqItem.BudYear);

    if (formGroupValue) {
      return {
        ...boqItem,
        CommItm: formGroupValue.commitmentItem || '',
        IntOrd: formGroupValue.internalOrder || ''
      };
    } else {
      return boqItem; // No matching formGroup, leave as is
    }
  });
    const updatedBOQ = {
    RfpNo: this.detArray.ReqToBudsrNavg.results[0].RfpNo,
    RfpVersion: this.detArray.ReqToBudsrNavg.results[0].RfpVersion,
    Rfp_budg_srv_itm_fin: updatedBoqItems
  }
    this.postBudgetServiceLineItem(updatedBOQ)
    this.generateWarnings()
}

updateFormGroupsFromBoqItems() {
  // Step 1: Sort BOQ items by Year ascending
  const sortedBoqItems = [...this.detArray.ReqToBudsrNavg.results]
    .sort((a: any, b: any) => +a.BudYear - +b.BudYear);

  // Step 2: Find unique years in order
  const uniqueYears = [...new Set(sortedBoqItems.map((item: any) => +item.BudYear))];

  let completed = 0;

  // Step 3: Map Year → FormGroup Index
  uniqueYears.forEach((year, idx) => {
    const matchingBoqItem = sortedBoqItems.find((item: any) => +item.BudYear === year);
    const formGroup = this.budgetingGroups.at(idx);

    if (matchingBoqItem && formGroup) {
      formGroup.patchValue(
        {
          commitmentItem: (matchingBoqItem.CommItm || '').replace(/^0+/, ''),
          internalOrder: (matchingBoqItem.IntOrd || '').replace(/^0+/, '')
        },
        { emitEvent: false }
      );
    }
    this.getAvailableBudget(matchingBoqItem.CommItm, matchingBoqItem.IntOrd, matchingBoqItem.BudYear);
    // Hook into completion: patch subscribe here
    this.api
      .get(
        `get-available-budget?commitment_id=${encodeURIComponent((matchingBoqItem?.CommItm || '').replace(/^0+/, ''))}&internal_order=${encodeURIComponent((matchingBoqItem?.IntOrd || '').replace(/^0+/, ''))}&year=${encodeURIComponent(matchingBoqItem?.BudYear || '')}`
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(

        (res: any) => {
          this.availableBudget[matchingBoqItem.BudYear] = res.d.AvaiableBudget;

          completed++;
          if (completed === uniqueYears.length) {
            this.checkBudgetPerYear(); 
            this.generateWarnings();
          }
        },
        (err) => {
          completed++;
          if (completed === uniqueYears.length) {
            this.checkBudgetPerYear();
            this.generateWarnings();
          }
          this.cs.createMessage('error', err.statusText);
        }
      );
  });
}


generateWarnings(): void {
  // this.errWarnings = []; // reset

  // Object.keys(this.availableBudget).forEach((year, idx) => {
  //   const budget = this.availableBudget[year];
  //   const normalizedBudget =
  //     budget != null ? Number((budget + '').trim()) : null;

  //   const formGroup = this.budgetingGroups.at(idx);
  //   if (normalizedBudget === null || normalizedBudget <= 0) {
  //     this.errWarnings.push({
  //       en: `Attention: Budget is not available in the current year (${year})`,
  //       ar: `انتبه : لا توجد ميزانية متاحة في سنة (${year})`
  //     });
  //   }
  // });

    this.warnings = [];
     Object.keys(this.availableBudget).forEach((year, idx) => {
    const budget = this.availableBudget[year];
    const normalizedBudget =
      budget != null ? Number((budget + '').trim()) : null;

    // Get the commitmentItem from the corresponding form group
    const formGroup = this.budgetingGroups.at(idx);
    const commitmentItem = formGroup?.get('commitmentItem')?.value || '-';

      // Get the corresponding year items
      let yearItems: any[] = [];
      if (Array.isArray(this.groupBOQItemsBasedonBudgetingYears)) {
        const idxNum = Number(year);
        if (!isNaN(idxNum)) {
          yearItems = this.groupBOQItemsBasedonBudgetingYears[idxNum] || [];
        }
      } else if (
        typeof this.groupBOQItemsBasedonBudgetingYears === 'object' &&
        this.groupBOQItemsBasedonBudgetingYears !== null
      ) {
        yearItems =
          (this.groupBOQItemsBasedonBudgetingYears as Record<string, any[]>)[year] || [];
      }

      // Calculate grand total with VAT for this year
      const grandTotalWithVat = this.getGrandTotalWithVat(yearItems);

       if (normalizedBudget !== null && normalizedBudget < grandTotalWithVat) { 
      this.warnings.push(
        this.cs.userLanguage === 'en'
          ? `Attention: Budget is not available for the commitment item (${commitmentItem}) in the current year (${year})`
          : `انتبه : لا توجد ميزانية متاحة لهذا البند  (${commitmentItem}) في سنة (${year})`
      );
    }
  });
}

approveClick(){
  this.isApproveClick = true;
  if(this.newFORole){
    this.generateWarnings();
  }
}

postBudgetServiceLineItem(boqDetails: BudgetServiceLineItemToPost) {
  this.spinner.show();
  this.rfp
    .PostRFPBudget(
      boqDetails
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.isBudgetDetailsPresent = true
        this.spinner.hide();
        this.cs.createMessage(
          'success',
          this.cs.userLanguage === 'En'
            ? 'RFP Budget was saved successfully'
            : 'تم حفظ ميزانية طلب تقديم العروض بنجاح'
        );
        this.getUpdatedCommitmentItemAndInternalOrderAfterSaving()
      },
      error: (err) => {
        this.isBudgetDetailsPresent = false
        this.spinner.hide();
        this.cs.createMessage(
          'error',
          this.cs.userLanguage === 'En'
            ? 'Something went wrong'
            : 'حدث خطأ ما'
        );
      },
    });
  // console.log(this.transformToServiceLineItems(this.splitedBudget));
}

getUpdatedCommitmentItemAndInternalOrderAfterSaving(){
  const payload: DetailsPayload = {
    rfpno: window.history.state.RfpNo,
    RfpVersion: window.history.state.RfpVersion,
  };

  const getDetail = this.api.post('RfpDet', payload);

  forkJoin([getDetail])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([detail]) => {
      if (detail) {
        const responseData = detail.d.results[0];
        const reqToBudsrNavg = responseData.ReqToBudsrNavg?.results || [];
        const reqToBoqNavg = responseData.ReqToBoqNavg?.results || [];
        const transformedBoqList = this.rfp.transformToBoqTableList(reqToBudsrNavg, reqToBoqNavg);
        this.groupBOQItemsBasedonBudgetingYears = transformedBoqList.reduce((acc:any, item:any) => {
          const year = item.budgetYear;
          if (!acc[year]) acc[year] = [];
          const matchedItem = this.commitmentItems.find(
            (commitmentItem: CommitmentItem) => commitmentItem.Commitmentitem === item.CommItm?.replace(/^0+/, '')
    
          );
          
          const commitmentItemWithDescription = matchedItem 
            ? `${matchedItem.Commitmentitem} - ${matchedItem.Description}` 
            : '';
          item.CommItm = commitmentItemWithDescription
          item.IntOrd = item.IntOrd.replace(/^0+/, '') 
    
          acc[year].push(item);
          return acc;
        }, {} as { [year: number]: any[] });
      }});
      console.log(this.groupBOQItemsBasedonBudgetingYears)
      this.checkIsInternalOrderAndCommitmentItemChanged()

}

getTotalPriceRow(item: any): number {
  const qty = parseFloat(item.Quantity) || 0;
  const price = parseFloat(item.Price) || 0;
  return qty * price;
}

getVatAmountRow(item: any): number {
  const total = this.getTotalPriceRow(item);
  const vatRate = 0.15; // 15% VAT (adjust if needed)
  return total * vatRate;
}

getTotalWithVatRow(item: any): number {
  return this.getTotalPriceRow(item) + this.getVatAmountRow(item);
}

getGrandTotalWithVat(data: readonly any[]): number {
  return data.reduce((sum, item) => sum + this.getTotalWithVatRow(item), 0);
}
getGrandTotalPrice(data: readonly any[]): number {
  return data.reduce((sum, item) => sum + this.getTotalPriceRow(item), 0);
}

getGrandVatAmount(data: readonly any[]): number {
  return data.reduce((sum, item) => sum + this.getVatAmountRow(item), 0);
}




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

interface ActionDetail {
  RfpNo: string,
  RfpVersion: string,
  RfpDeptId: string,
  WfFlowType: string,
  CwfDept: string,
  CwfApprvLevel: string,
  CwfApprvRole: string,
  NwfApprvDept: string,
  NwfApprvLevel: string,
  NwfApprvRole: string,
  NwfApprvId: string,
  NwfDept: string,
  Action: string,
  WfReqComment: string,
  IsRfpRddApproved?: string
}

interface QualificationFinancePost {
  RfpNo: string,
  RfpVersion: string,
  ItemNo: string,
  Descrar: string,
  Descren: string,
  Range: string,
  Percentage: string,
  LogonUsr: string
}

interface ApprovePayaload {
  RfpNo: string,
  RfpVersion: string,
  DeptId: string,
  WfResComment: string,
  WfApprvAction: string,
  NwfApprvDept: string,
  NwfApprvLevel: string,
  NwfApprvRole: string,
  NwfApprvId: string,
  NwfDept: string,
  CreatedBy: string
}

interface DetailsPayload {
  rfpno: string,
  RfpVersion: string
}

interface WarningMessage {
  en: string;
  ar: string;
}
