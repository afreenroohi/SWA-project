import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IconList } from 'src/app/components/icon/icon.component';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';

interface TaskList {
  RfpNo: string,
  RfpVersion: string,
  CurrApprover: string,
  UserName: string,
  UserNameAR: string,
  ApproverRoleDescEN: string,
  ApproverRoleDescAR: string,
  WFDeptDescEN: string
  WFDeptDescAR: string,
  EmpDept: string
}

interface User {
  UserId: string,
  NameEn: string,
  NameAr: string
}

@Component({
  selector: 'app-rfp-maintenance',
  templateUrl: './rfp-maintenance.component.html',
  styleUrls: ['./rfp-maintenance.component.scss']
})
export class RFPMaintenanceComponent implements OnInit, OnDestroy {
  public readonly IconList = IconList;

  public dataSource: TaskList[] = [];
  userList: User[] = [];
  isFullAccess = false;
  editingRFPNumber = '';
  editingRFPVersion = '';
  newApprover = '';

  private readonly _ngUnSubscribe = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private api: ApiService,
    public commonService: CommonService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParamMap.pipe(takeUntil(this._ngUnSubscribe)).subscribe((params) => {
      this.isFullAccess = params.get('fullAccess') === 'false' ? false : true;
    });

    this.fetchTableData();
  }

  /**
   * *Make API call to get the list of tasks
   */
  fetchTableData(): void {
    this.spinner.show();
    this.api.get('/getAdminTaskList').pipe(takeUntil(this._ngUnSubscribe)).subscribe((taskList) => {
      this.spinner.hide();
      const dataArray = taskList?.d?.results;
      if (dataArray)
        this.dataSource = dataArray.map((list: any) => {
          return {
            RfpNo: list.RfpNo,
            RfpVersion: list.RfpVersion,
            CurrApprover: list.CurrApprover,
            UserName: list.UserName,
            UserNameAR: list.UserNameAR,
            ApproverRoleDescAR: list.ApproverRoleDescAR,
            ApproverRoleDescEN: list.ApproverRoleDescEN,
            WFDeptDescAR: list.WFDeptDescAR,
            WFDeptDescEN: list.WFDeptDescEN,
            EmpDept: list.EmpDept
          }
        });
      if (!this.isFullAccess) {
        this.dataSource = this.dataSource.filter((data) => data.EmpDept === this.commonService.getUserData().DeptId);
      }
    }, (error) => {
      this.spinner.hide();
      this.commonService.createMessage('error', error.statusText);
    });
  }

  /**
   * Change the editing RFP Number
   * @param item 
   */
  editCurrentApprover(item?: TaskList): void {
    this.editingRFPNumber = item?.RfpNo ?? '';
    this.editingRFPVersion = item?.RfpVersion ?? '';
    this.resetData();
    if (item && this.editingRFPNumber !== '') {
      const payload = {
        RFP_Number: item.RfpNo,
        RFP_Version: item.RfpVersion
      }
      this.getUserList(payload, item.CurrApprover);
    }
  }

  /**
   * Get the User List - API
   * @param payload 
   */
  getUserList(payload: { RFP_Number: string, RFP_Version: string }, currentApprover: string): void {
    this.spinner.show();
    this.api.post('getAdminUserList', payload).pipe(takeUntil(this._ngUnSubscribe)).subscribe(
      (response) => {
        this.spinner.hide();
        const userlist = response?.d?.results;
        if (userlist) {
          this.userList = userlist.map((user: any): User => {
            return {
              UserId: user.Uname,
              NameEn: user.UserName,
              NameAr: user.UserNameAR,
            }
          });
          this.userList = this.userList.filter((user) => user.UserId !== currentApprover);
        }
      }, (error) => {
        this.spinner.hide();
        this.commonService.createMessage('error', error.statusText);
      });
  }

  saveNewApprover(): void {
    if (!this.newApprover) {
      return;
    }
    const payload = {
      RFP_Number: this.editingRFPNumber,
      RFP_Version: this.editingRFPVersion,
      Current_Approver: this.newApprover
    };
    this.spinner.show();
    this.api.post('postAdminUserList', payload).pipe(takeUntil(this._ngUnSubscribe)).subscribe(
      (response) => {
        this.spinner.hide();
        if (response?.d?.RfpNo) {
          this.resetData(true);
          this.commonService.createMessage('success', this.translate.instant('Admin.RFPMaintenance.User updated successfully'));
          this.getUpdatedTaskDetails(response?.d?.RfpNo, response?.d?.RfpVersion);
        }
      },
      (error) => {
        this.spinner.hide();
        this.commonService.createMessage('error', error.statusText);
      });
  }

  getUpdatedTaskDetails(rfpNo: string, rfpVersion: string): void {
    const payload = {
      RfpNo: rfpNo,
      RfpVersion: rfpVersion
    }
    this.spinner.show();
    this.api.post('getAdminTaskDetails', payload).pipe(takeUntil(this._ngUnSubscribe)).subscribe(
      (taskDetail) => {
        this.spinner.hide();
        const task = taskDetail?.d?.results[0];
        this.dataSource = this.dataSource.map((data) => {
          if (data.RfpNo === task.RfpNo && data.RfpVersion === task.RfpVersion) {
            return {
              RfpNo: task.RfpNo,
              RfpVersion: task.RfpVersion,
              CurrApprover: task.CurrApprover,
              UserName: task.UserName,
              UserNameAR: task.UserNameAR,
              ApproverRoleDescAR: task.ApproverRoleDescAR,
              ApproverRoleDescEN: task.ApproverRoleDescEN,
              WFDeptDescAR: task.WFDeptDescAR,
              WFDeptDescEN: task.WFDeptDescEN,
              EmpDept: task.EmpDept
            }
          }
          return data;
        })
      },
      (error) => {
        this.spinner.hide();
        this.commonService.createMessage('error', error.statusText);
      }
    );
  }

  resetData(clearAllData = false): void {
    this.userList = [];
    this.newApprover = '';
    if (clearAllData) {
      this.editingRFPNumber = '';
      this.editingRFPVersion = '';
    }
  }

  ngOnDestroy(): void {
    this._ngUnSubscribe.next(undefined);
    this._ngUnSubscribe.complete();
  }

}
