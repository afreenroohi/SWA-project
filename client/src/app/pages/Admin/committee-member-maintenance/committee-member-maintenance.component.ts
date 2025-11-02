import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-committee-member-maintenance',
  templateUrl: './committee-member-maintenance.component.html',
  styleUrls: ['./committee-member-maintenance.component.scss']
})
export class CommitteeMemberMaintenanceComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  readonly translationPrefix = 'Admin.MemberMaintenance.'; // * Used as a prefix to translation

  action: 'create' | 'edit' | '' = '';

  maintainedMemberList: MaintainedMember[] = [];
  committeeTypeList: CommitteeType[] = [];
  committeeRoleList: CommitteeRole[] = [];
  committeeLookUpRoleList: CommitteeRole[] = [];
  committeeLookUpUserList: CommitteeUser[] = [];
  committeeUserList: CommitteeUser[] = [];
  committeeBkUserList: CommitteeUser[] = [];

  showFormModal = false;
  isF4DataLoading = false;
  currentCommitteeId = this.cs.getUserData().CommitteeId ?? '';

  maintainMemberForm: FormGroup = new FormGroup({});

  isFullAccess = false;

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    public cs: CommonService,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
  ) {
    this.constructInitialFormGroup();
  }

  ngOnInit(): void {
    this.activeRoute.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.isFullAccess = params.get('fullAccess') === 'false' ? false : true;
    });
    this.getMaintainedMemberList();
    this.getFormF4Details();
  }

  /**
   * Construct FormGroup
   */
  constructInitialFormGroup(): void {
    this.maintainMemberForm = new FormGroup({
      CommitteeId: new FormControl({ value: '' }, Validators.required),
      CommitteeRole: new FormControl({ value: '' }, Validators.required),
      CommitteeUser: new FormControl({ value: '' }, Validators.required),
      CommitteeBckupUser: new FormControl({ value: '' }),
      IsActive: new FormControl({ value: 'X', disabled: true }, Validators.required)
    });

    this.maintainMemberForm.get('CommitteeId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((committeeId) => {
      this.maintainMemberForm.get('CommitteeRole')?.setValue('', {emitEvent: false});
      this.maintainMemberForm.get('CommitteeUser')?.setValue('', { emitEvent: false });
      this.maintainMemberForm.get('CommitteeBckupUser')?.setValue('', { emitEvent: false });
      this.committeeRoleList = this.committeeLookUpRoleList.filter((committee) => committee.CommitteeID === committeeId);
      this.committeeBkUserList = [];
    });

    this.maintainMemberForm.get('CommitteeRole')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((role) => {
      const committeeId =this.maintainMemberForm.get('CommitteeId')?.value;
      this.maintainMemberForm.get('CommitteeUser')?.setValue('', { emitEvent: false });
      this.maintainMemberForm.get('CommitteeBckupUser')?.setValue('', { emitEvent: false });
      this.committeeUserList = this.committeeLookUpUserList.filter((user) => user.CommitteeRole === role && user.CommitteeId === committeeId);
      this.committeeBkUserList = [];
      });
      
      this.maintainMemberForm.get('CommitteeUser')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      const committeeId =this.maintainMemberForm.get('CommitteeId')?.value;
      const role = this.maintainMemberForm.get('CommitteeRole')?.value;
      this.maintainMemberForm.get('CommitteeBckupUser')?.setValue('');
      this.committeeBkUserList = this.committeeLookUpUserList.filter((user) => user.CommitteeRole === role && user.UserId !== userId && user.CommitteeId === committeeId);
    });
  }

  /**
   * Get the Maintained Member List
   */
  getMaintainedMemberList(): void {
    this.spinner.show();
    this.api.get('getCommitteeMemberList').pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.d.results) {
          this.maintainedMemberList = this.filterOnlyMember(response.d.results).map((member: MaintainedMember) => {
            member.IsActive = member.IsActive === 'X';
            return member;
          });
        }
      }, (error) => {
        this.spinner.hide();
        this.maintainedMemberList = [];
        this.cs.createMessage("error", error.statusText);
      });
  }

  /**
   * Filter the members based on the Role and committe ID
   * @param memberList 
   * @returns 
   */
  filterOnlyMember(memberList: MaintainedMember[]): MaintainedMember[] {
    if (this.isFullAccess) {
      return memberList;
    }
    return memberList.filter((member) => (member.CommitteeRole !== 'CH') && member.CommitteeId === this.currentCommitteeId && member.CommitteeId !== '05');
  }

  /**
   * Committee Members Maintanance model open and close logic
   * @param isOpen 
   * @param memberDetails
   */
  openModel(isOpen: boolean, memberDetails?: MaintainedMember): void {
    this.showFormModal = isOpen;
    if (isOpen) {
      if (memberDetails) {
        this.action = 'edit';
        this.maintainMemberForm.get('IsActive')?.enable();
        this.maintainMemberForm.get('CommitteeId')?.disable();
        this.maintainMemberForm.get('CommitteeRole')?.disable();
        this.maintainMemberForm.patchValue(memberDetails);
      } else { this.action = 'create' }
    } else {
      this.action = '';
      this.constructInitialFormGroup(); // * Reset the formgroup to initial
      this.committeeUserList = [];
      this.committeeBkUserList = [];
    }
    this.maintainMemberForm.updateValueAndValidity();
  }

  /**
   * Get F4 Details for the form
   */
  getFormF4Details(): void {
    const CommitteeType = this.api.get('getCommitteeTypeList');
    const CommitteeRole = this.api.get('getCommitteeRoleList');
    const CommitteeUser = this.api.get('getCommitteeUserList');
    this.isF4DataLoading = true;
    forkJoin([CommitteeType, CommitteeRole, CommitteeUser]).pipe(takeUntil(this.destroy$)).subscribe(
      ([CommitteeTypeRes, CommitteeRoleRes, CommitteeUserRes]) => {
        this.isF4DataLoading = false;
        if (CommitteeTypeRes.d.results) {
          this.committeeTypeList = this.isFullAccess ? CommitteeTypeRes.d.results : CommitteeTypeRes.d.results.filter((type: CommitteeType) => type.CommitteeID === this.currentCommitteeId);
        }
        if (CommitteeRoleRes.d.results) {
          this.committeeLookUpRoleList = this.isFullAccess ? CommitteeRoleRes.d.results : CommitteeRoleRes.d.results.filter((role: CommitteeRole) => role.CommitteeID === this.currentCommitteeId && role.CommitteeRole !== 'CH');
        }
        if (CommitteeUserRes.d.results) {
          this.committeeLookUpUserList = this.isFullAccess ? CommitteeUserRes.d.results : CommitteeUserRes.d.results.filter((user: CommitteeUser) => user.CommitteeId === this.currentCommitteeId);
        }
      },
      (error) => {
        this.isF4DataLoading = false;
        this.committeeTypeList = [];
        this.committeeLookUpRoleList = [];
        this.committeeLookUpUserList = [];
        this.cs.createMessage("error", error.statusText);
      });
  }

  filterOnlyInActiveMember(membersList: CommitteeUser[]): CommitteeUser[] {
    return membersList.filter((member) => member.IsPresent === '');
  }

  /**
   * Submit the maintenance
   * @returns 
   */
  submitForm(): void {
    if (this.maintainMemberForm.invalid) return;

    const payload: MaintainedMemberPost = { ...this.maintainMemberForm.getRawValue(), IsActive: this.maintainMemberForm.getRawValue().IsActive === true ? 'X' : '' };
    this.spinner.show();
    this.api.post('maintainCommitteeMember', payload).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.openModel(false);
        this.getMaintainedMemberList();
      },
      (error) => {
        this.spinner.hide();
        this.cs.createMessage("error", error.statusText);
      }
    );
  }

  // * Getter methods
  get isCurrentLangEng(): boolean {
    return this.cs.userLanguage === 'en';
  }
  get getCommitteeUser(): CommitteeUser[] {
    return this.action === 'create' ? this.filterOnlyInActiveMember(this.committeeUserList) : this.committeeUserList;
  }
  get getCommitteeBkUserList(): CommitteeUser[] {
    return this.action === 'edit' ? this.filterOnlyInActiveMember(this.committeeBkUserList) : this.committeeBkUserList;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

interface MaintainedMember {
  CmtDeptId: string,
  CommitteeBckupUser: string,
  CommitteeBkpUserNameAr: string,
  CommitteeBkpUserNameEn: string,
  CommitteeId: string,
  CommitteeIdDesc: string,
  CommitteeRole: string,
  CommitteeUser: string,
  CommitteeUserNameAr: string,
  CommitteeUserNameEn: string,
  CommitteeYear: string,
  IsActive: string | boolean,
  UIRoleDescAR: string,
  UIRoleDescEN: string
}

interface CommitteeType {
  CommitteeDesc: string,
  CommitteeID: string
}

interface CommitteeRole {
  CommitteeID: string,
  CommitteeRole: string,
  UIRoleDescAR: string,
  UIRoleDescEN: string
}

interface CommitteeUser {
  CommitteeId: string,
  CommitteeName: string,
  CommitteeRole: string,
  CommitteeRoleName: string,
  UIRoleDescAR: string,
  UIRoleDescEN: string,
  UserDeptDesc: string,
  UserDeptID: string,
  UserId: string,
  UserName: string,
  IsPresent: string
}

interface MaintainedMemberPost {
  CommitteeId: string,
  CommitteeRole: string,
  CommitteeUser: string,
  CommitteeBckupUser: string,
  IsActive: string
}