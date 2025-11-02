import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, DoCheck, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IconList } from 'src/app/components/icon/icon.component';
import { PROCESS_TYPES } from 'src/app/shared/shared';
@Component({
  selector: 'app-admin-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Default
})

export class SlaComponent implements OnInit, OnChanges, DoCheck {

  private readonly destroy$ = new Subject<void>();
  @Input() nzData: any = [];    //

  data: any = [];
  FilterList: any = [];

  openMdl = false;
  adminForm: FormGroup | undefined;
  usersList: any;
  toUsersList: any;
  rolesList: any;
  selectedFromUser: any;
  selectedToUser: any;
  selectedRole: any;
  fromDate: any;
  toDate: any;
  dateFormat = 'yyyy/MM/dd';
  currentDate: any;
  roles: any = [];
  fromUserInfo: any;
  toUserInfo: any;
  slaData: any = [];
  committeeData: any = [];
  contractData: any = [];

  cocSlaData: COC_SLA[] = [];
  isAddCOCModelVisible = false;
  roleLookUp: CocSlaRole[] = [];
  roleLookUpDisplay: CocSlaRole[] = [];
  unitLookUp: CocSlaUnit[] = [];
  cocLookupLoading = false;

  editRecord: boolean = false;
  editedFromUser: any;
  readonly IconList = IconList;
  selectedValue: any;

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public cs: CommonService,
    public translate: TranslateService,
  ) { }

  ngOnChanges(changes: any) {
    if (changes.nzData) {
      this.update();
    }
  }

  ngDoCheck() {
    if (this.data.length !== this.nzData.length) {
      this.update();
    }
  }

  update() {
    this.data = [...this.nzData];
  }

  search() {
    switch (this.selectedValue) {
      case PROCESS_TYPES.RFP:
        this.getRfpList();
        break;
      case PROCESS_TYPES.COMMITTEE:
        this.getCommitteeList();
        break;
      case PROCESS_TYPES.COC:
        this.getCOCList();
        break;
      case PROCESS_TYPES.CONTRACT:
        this.getContractList();
        break;
    }
  }

  ngOnInit(): void {
    this.FilterList = this.cs.getSLAOption();
  }

  getRfpList() {
    this.spinner.show();

    this.api.get("ZMM_P2P_ADMIN_SRV").pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        //  console.log(res.d.results);
        this.spinner.hide();
        //  console.log("response ",res)
        if (res.d.results.length > 0) {
          //  res.d.results.forEach((el: any) => {
          //  el.to_UsrRoleDts.results.forEach((item: any) => {
          this.slaData = res.d.results;
          this.committeeData = [];
          this.contractData = []
          //  });
          //  });
          console.log(this.slaData)


        }

      },
      (error) => {
        this.spinner.hide();

      }
    );
  }

  getCommitteeList() {
    this.spinner.show();

    this.api.get("ZMM_P2P_COMMITTEE_SRV").pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        //  console.log(res.d.results);
        this.spinner.hide();
        //  console.log("response ",res)
        if (res.d.results.length > 0) {
          //  res.d.results.forEach((el: any) => {
          //  el.to_UsrRoleDts.results.forEach((item: any) => {
          this.committeeData = res.d.results;
          this.slaData = [];
          this.contractData = []
          //  });
          //  });


        }

      },
      (error) => {
        this.spinner.hide();

      }
    );
  }

  getContractList() {
    this.spinner.show();

    this.api.get("ZMM_P2P_CONTRACT_SRV").pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        //  console.log(res.d.results);
        this.spinner.hide();
        //  console.log("response ",res)
        if (res.d.results.length > 0) {
          //  res.d.results.forEach((el: any) => {
          //  el.to_UsrRoleDts.results.forEach((item: any) => {
          this.contractData = res.d.results;
          this.committeeData = [];
          this.slaData = []
          //  });
          //  });


        }

      },
      (error) => {
        this.spinner.hide();

      }
    );
  }

  selectedRecord: any = -1;
  editSLA(index: number, sla: any) {
    console.log(index, sla);
    this.selectedRecord = index;
    this.newValue = sla.Sla;
  }

  newValue: any;
  slaChanged(evt: any) {
    console.log(evt);
    this.newValue = evt;
  }

  changeSLA(newSlaVal: any) {
    console.log(newSlaVal);
    const req = {
      "WfDept": newSlaVal.WfDept,
      "CurrLevel": newSlaVal.CurrLevel,
      "Description": newSlaVal.Description,
      "Sla": this.newValue
    }

    this.api.post('Rfp_sla_dts1Set', req).subscribe((res: any) => {
      this.getRfpList();
    }).add(() => {
      this.selectedRecord = -1;
    });
  }

  changecommitteeSLA(newSlaVal: any) {
    console.log(newSlaVal);
    const req = {
      "CommitteeId": newSlaVal.CommitteeId,
      "CommitteeRole": newSlaVal.CommitteeRole,
      "CommitteeLgdinusrAction": newSlaVal.CommitteeLgdinusrAction,
      "CommitteeApproverActionMenu": newSlaVal.CommitteeApproverActionMenu,
      "Sla": this.newValue
    }
    this.api.post('cmt_sla_dtsSet', req).subscribe((res: any) => {
      this.getCommitteeList();
    }).add(() => {
      this.selectedRecord = -1;
    });
  }

  changecontractSLA(newSlaVal: any) {
    console.log(newSlaVal);
    const req = {
      "ContractRole": newSlaVal.ContractRole,
      "ContractLgdinUsrAction": newSlaVal.ContractLgdinUsrAction,
      "Sla": this.newValue
    }
    this.api.post('cont_sla_dtsSet', req).subscribe((res: any) => {
      this.getContractList();
    }).add(() => {
      this.selectedRecord = -1;
    });
  }

  cancelSLA() {
    this.selectedRecord = -1;
  }

  // * COC Logic 

  /**
   * Get the COC SLA List
   */
  getCOCList(): void {
    this.spinner.show();
    this.api.get('CocSlaMaintenanceList').pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.d.results) {
          this.resetDataSet();
          this.cocSlaData = response.d.results;
        }
      },
      (error) => {
        this.spinner.hide();
      });
  }

  /**
   * Edit COC 
   */
  editCocData(cocDetails: COC_SLA): void {
    this.openCOCModel('edit');
    this.adminForm?.patchValue(cocDetails);
    this.updateFormRequirements();
  }
  
  /**
   * Update Form for the new  Requirement for edit
  */
 updateFormRequirements(): void {
   this.adminForm?.get('ContractRole')?.disable();
   this.adminForm?.updateValueAndValidity();
  }

  /**
   * Handles the open and close logic of COC Model 
   */
  openCOCModel(action?: 'create' | 'edit'): void {
    if (!this.isAddCOCModelVisible) {
      this.adminForm = this.fb.group({
        ContractRole: [{value:'', disbaled: action === 'edit'}, Validators.required],
        Sla: ['', Validators.required],
        SlaUnit: ['', Validators.required],
        Description: ['', Validators.required]
      });

      if (action) {
        if (!this.roleLookUp.length || !this.unitLookUp.length) {
          this.loadLookupData(action ?? 'create');
        } else {
          this.roleLookUpDisplay = this.filterRoleBasedOnAction(action);
        }
      }
    }

    this.isAddCOCModelVisible = !this.isAddCOCModelVisible;
  }

  /**
   * Load the Look up data for the dropdowns
   */
  loadLookupData(action: 'create' | 'edit'): void {

    this.cocLookupLoading = true;

    const rolesAPI = this.api.get('CocSlaRoleList');
    const unitsAPI = this.api.get('CocSlaUnitsList');

    forkJoin([rolesAPI, unitsAPI]).pipe(takeUntil(this.destroy$)).subscribe(
      ([rolesAPIREs, unitsAPIRes]) => {
        this.cocLookupLoading = false;

        this.roleLookUp = rolesAPIREs.d.results;
        this.unitLookUp = unitsAPIRes.d.results;

        this.roleLookUpDisplay = this.filterRoleBasedOnAction(action);

      }, (error) => {
        this.spinner.hide();
        this.cocLookupLoading = false;
        this.cs.createMessage('error', error.statusText);
      });
  }

  /**
   * Filter and Return the Roles array based on the Action
   * @param action `'create' | 'edit'`
   * @returns 
   */
  filterRoleBasedOnAction(action: 'create' | 'edit') {
    let roleList: string[] = [];
    this.cocSlaData.forEach((data) => {
      roleList.push(data.ContractRole);
    });
    if (action === 'create') {
      return this.roleLookUp.filter((role: CocSlaRole) => roleList.indexOf(role.CocRole) === -1);
    }
    if (action === 'edit') {
      return this.roleLookUp;
    }
    return [];
  }

  /**
   * Submit Add COC Form
   */
  submitAddCOC() {
    const payload = this.adminForm?.getRawValue();
    this.spinner.show();
    this.api.post('postCocSlaMaintenance', payload).pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        this.spinner.hide();
        this.openCOCModel();
        this.getCOCList();
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      }
    )
  }

  /**
   * Reset the complete data set.
   */
  resetDataSet(): void {
    this.slaData = [];
    this.committeeData = [];
    this.contractData = [];
    this.cocSlaData = [];
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface COC_SLA {
  ContractRole: string,
  RoleDescAr: string,
  RoleDescEn: string,
  SLAUnitDescAr: string,
  SLAUnitDescEn: string,
  Sla: string,
  SlaUnit: string,
  Description: string
}

interface CocSlaRole {
  CocRole: string,
  RoleDescEn: string,
  RoleDescAr: string
}

interface CocSlaUnit {
  SLAUnitID: string,
  SLAUnitDescEn: string,
  SLAUnitDescAr: string
}