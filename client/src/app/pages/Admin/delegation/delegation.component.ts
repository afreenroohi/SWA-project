import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import { TranslateService } from '@ngx-translate/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.scss'],
  providers: [DatePipe],
})

export class DelegationComponent implements OnInit {

  private readonly destroy$ = new Subject<void>();

  showFormModal = false;
  delegationForm: FormGroup;

  delegationList: any;
  usersList: any;
  toUsersList: any;

  disabledDate = (current: Date): boolean => current < new Date(new Date().setDate(new Date().getDate() - 1));
  disabledTodDate = (current: Date): boolean => current < new Date(new Date().setDate(new Date(this.delegationForm.get('fromDate')?.value).getDate() - 1));

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public cs: CommonService,
    public translate: TranslateService,
  ) {

    // * Main Delegation Form 
    this.delegationForm = this.fb.group({
      selectedFromUser: ['', Validators.required],
      selectedRole: ['', Validators.required],
      selectedToUser: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      isActive: [true, Validators.required]
    });

    this.delegationForm.get('selectedFromUser')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.delegationForm.get('selectedRole')?.reset();
      this.delegationForm.get('selectedToUser')?.reset();
      this.getToUsersList();
    });

    this.delegationForm.get('selectedRole')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.delegationForm.get('selectedToUser')?.reset();
      this.getToUsersList();
    })
  }

  ngOnInit(): void {
    this.getInitialData();
  }

  /**
   * Get the list of Delegations
   */
  getDelegationList(): void {
    this.spinner.show();
    this.api.get("ZMM_CMT_PRCS_SRV").pipe(takeUntil(this.destroy$)).subscribe((delegationListRes) => {
      this.spinner.hide();
      if (delegationListRes?.d?.results?.length) {
        this.delegationList = delegationListRes?.d?.results;
      }
    }, (error) => {
      this.cs.createMessage('error', error.statusText);
      this.spinner.hide();
    });
  }

  /**
   * Get the Delegation list and User data
   */
  getInitialData(): void {
    this.spinner.show();
    const delegationList = this.api.get("ZMM_CMT_PRCS_SRV");
    const userData = this.api.get("ZMM_CMT_PRCS_SRV_ROLES_LIST");
    forkJoin([delegationList, userData]).pipe(takeUntil(this.destroy$)).subscribe(([delegationListRes, usersWithRoleRes]) => {
      this.spinner.hide();
      if (delegationListRes?.d?.results?.length) {
        this.delegationList = delegationListRes?.d?.results;
      }
      if (usersWithRoleRes?.d?.results?.length > 0) {
        this.usersList = usersWithRoleRes?.d?.results;
      }
    }, (error) => {
      this.cs.createMessage('error', error.statusText);
      this.spinner.hide();
    });
  }

  /**
   * Submit Form Data - Delegation Post call
   */
  submitForm() {
    const fromUserDetails = this.delegationForm.value.selectedFromUser;
    const toUserDetails = this.delegationForm.value.selectedToUser;
    const startDate = this.datePipe.transform(this.delegationForm.get('fromDate')?.value, "yyyy-MM-dd'T'HH:mm:ss")?.toString();
    const endDate = this.datePipe.transform(this.delegationForm.get('toDate')?.value, "yyyy-MM-dd'T'HH:mm:ss")?.toString();

    const payload = {
      "CommitteeID": fromUserDetails.CommitteeId,
      "CommitteeRole": this.delegationForm.get('selectedRole')?.value?.CommitteeRole,
      "CommitteeUser": fromUserDetails.UserID,
      "SubstituteUser": toUserDetails.UserID,
      "CommitteeUserNameEN": fromUserDetails.CommitteeUserName,
      "CommitteeUserNameAR": fromUserDetails.CommitteeUserName_AR,
      "SubstituteUserNameEN": toUserDetails.CommitteeUserName,
      "SubstituteUserNameAR": toUserDetails.CommitteeUserName_AR,
      "UIRoleDescEN": "",
      "UIRoleDescAR": "",
      "SAPRole": "",
      "StartDate": startDate,//this.delegationForm.get('fromDate')?.value,
      "EndDate": endDate,//this.delegationForm.get('toDate')?.value,
      "CreatedBy": "",
      "CreatedAt": startDate,
      "ChangedBy": "",
      "ChangedAt": null,
      "LgdInUsr": localStorage.getItem('LogdInUsrID') ?? '',
      "IsActive": this.delegationForm.get('isActive')?.value
    }

    this.spinner.show();
    this.api.post("ZMM_CMT_PRCS_SRV", payload).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.showFormModal = false;
        this.getDelegationList();
      },
      (error) => {
        this.cs.createMessage('error', error.statusText);
        this.spinner.hide();
      }
    );

  }

  /**
   * Format and Return the date
   * @param ephoDate 
   */
  formatDate(ephoDate: any) {
    const date = ephoDate.replace(/\D/g, '').trim();
    const formattedDate = new Date(parseInt(date));
    const conversionDate = `${formattedDate.getFullYear()}/${formattedDate.getMonth() + 1}/${formattedDate.getDate()}`;
    return conversionDate;
  }

  /**
   * Opens the Add Delegation Modal
   */
  openAddDelegationModal() {
    this.delegationForm.reset();
    this.delegationForm.get('isActive')?.setValue(true);
    this.showFormModal = !this.showFormModal;
  }

  /**
   * Opens the Edit Delegation Modal
   * @param userDetails 
   */
  editDelegationModal(userDetails: any) {
    const fromUserDetails = this.findUserDetails(userDetails.CommitteeUser, userDetails.CommitteeID);
    const roleDetails = this.findUserRoleDetails(fromUserDetails, userDetails.CommitteeRole);
    const toUserDetails = this.findUserDetails(userDetails.SubstituteUser, userDetails.CommitteeID);

    this.delegationForm.get('selectedFromUser')?.patchValue(fromUserDetails, { emitEvent: false });
    this.delegationForm.get('selectedRole')?.patchValue(roleDetails);
    this.delegationForm.get('selectedToUser')?.patchValue(toUserDetails);
    this.delegationForm.get('fromDate')?.patchValue(this.formatDate(userDetails.StartDate));
    this.delegationForm.get('toDate')?.patchValue(this.formatDate(userDetails.EndDate));
    this.delegationForm.get('isActive')?.patchValue(userDetails.IsActive);

    this.showFormModal = !this.showFormModal;
  }

  /**
   * Retruns the user details object
   * @param userId 
   * @param committeeId 
   * @returns 
   */
  findUserDetails(userId: string, committeeId: string) {
    return this.usersList.find((user: any) => {
      return user.UserID === userId && user.CommitteeId === committeeId;
    })
  }

  findUserRoleDetails(fromUserDetails: any, role: string) {
    const userRole = fromUserDetails?.to_UsrRoleDts?.results.find((roleDetail: any) => {
      return roleDetail.CommitteeRole === role;
    });
    return userRole;
  }

  getToUsersList() {
    this.toUsersList = [];
    const fromUserDetails = this.delegationForm.get('selectedFromUser')?.value;

    // * If the selected from user have backup member 
    if (fromUserDetails?.BckupUserID) {
      const toUserList = this.usersList.find((user:any) => {
        return user.UserID === fromUserDetails?.BckupUserID;
      });
      this.toUsersList.push(toUserList);
    } else {
      // * If the selected from user don't have backup member
      const selectedRoleDetails = this.delegationForm.get('selectedRole')?.value;
      if (selectedRoleDetails) {
        const toUserList = this.usersList.filter((user: any) => {
          const userRoleDetails = user?.to_UsrRoleDts?.results;
          const rolefound = userRoleDetails.find((roleDetail: any) => {
            return roleDetail.UserID !== selectedRoleDetails.UserID &&
              roleDetail.CmtDeptId === selectedRoleDetails.CmtDeptId &&
              roleDetail.CommitteeId === selectedRoleDetails.CommitteeId &&
              roleDetail.CommitteeRole === selectedRoleDetails.CommitteeRole;
          });
          if (rolefound) {
            return true;
          } else { return false }
        });
        this.toUsersList = toUserList;
      }
    }
  }

  // **** Getter Methos */
  get getRolesOfSelectedUser() {
    const fromUserDetails = this.delegationForm.get('selectedFromUser')?.value;
    return fromUserDetails?.to_UsrRoleDts?.results;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
