import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { caseStatus } from 'src/app/shared/shared';

// Component to assign contract unit officer
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailsComponent implements OnInit {

  ProxyUserId = 'TSUDHA';

  award_number: number = 0;
  currentDate = new Date();

  contractDetails: any = [];

  officerList: any = [];
  officerListEn: any = [];
  officerListAr: any = [];
  selectedOfficer = '';
  assignPayload: any = [];
  list: any[] = [];
  projectTypeList: any[] = caseStatus;


  isVisible = false;
  isOkLoading = false;
  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: false }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    LoA: new FormControl(0)
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public cs: CommonService,
    private message: NzMessageService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService
  ) {
    this.ContractForm.get('ProjectType')?.valueChanges.subscribe((type) => {
      if (this.assignPayload && this.assignPayload.ProjType && this.assignPayload.ProjType !== type) {
        this.assignPayload.ProjType = type;
      }
    })
  }

  ngOnInit(): void {
    this.spinner.show();
    this.ContractForm.get('ProjectType')?.setValue(history.state.project_type);
    this.award_number = history.state.award_number;
    this.getDetails(this.award_number);
    this.getOfficerList();
  }

  ngDoCheck() {
    if (this.cs.userLanguage == 'en') {
      this.officerList = this.officerListEn;
    } else {
      this.officerList = this.officerListAr;
    }
  }

  // * get details API call
  getDetails(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    //api call for detail of contract
    if (this.award_number) {
      this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
      this.api.post("getDetails", { ...AwardNum, userName: this.ProxyUserId }).subscribe(
        (res) => {
          this.assignPayload = res.d;
          console.log(this.assignPayload);
          this.contractDetails = this.apiService.mappingDetails(res.d);
          //contract form
          this.ContractForm.get('ProjectName')?.setValue(this.contractDetails.ProjectName);
          this.ContractForm.get('ProjectType')?.setValue(this.assignPayload.ProjType);
          this.ContractForm.get('AwardNumber')?.setValue(this.contractDetails.AwardNumber);
          this.ContractForm.get('AwardDate')?.setValue(this.contractDetails.AwardDate);
          this.ContractForm.get('VendorName')?.setValue(this.contractDetails.VendorName);
          this.ContractForm.get('LoA')?.setValue(this.contractDetails.LoADays)
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.router.navigateByUrl('contract/dashboard/prep')
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', 'You have been redirected to contract list')
      } else {
        this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
      }
    }
  }

  backToDashboard() {
    this.router.navigateByUrl('contract/dashboard/prep')
  }

  // get call for list of Contract unit officer to be assigned
  getOfficerList() {
    let officer = {
      "officer": 'CO'
    }
    this.api.post("getOfficerList", officer).subscribe(
      (res) => {
        this.list = res.d.results;
        this.list.forEach((off: any) => {
          this.officerListEn.push(off.EmpName);
          this.officerListAr.push(off.EmpName2)
        })
        if (this.cs.userLanguage == 'en') {
          this.officerList = this.officerListEn;
        } else {
          this.officerList = this.officerListAr;
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  // Post API call for Contract officer assignment
  asignOfficer() {
    if (this.ContractForm.get('LoA')?.value >= 5) {
      this.isVisible = true;
    } else {
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', '5 days are not yet complete after letter of award')
      } else if (this.cs.userLanguage == 'ar') {
        this.message.create('error', 'لم تكتمل خمسة أيام بعد خطاب الترسية');
      }
    }

  }

  handleOk(): void {
    this.isOkLoading = true;
    this.assignPayload.Flag = "ASG";
    this.assignPayload.ContUo = this.selectedOfficer;
    this.assignPayload.ProjType = this.ContractForm.get('ProjectType')?.value;
    // comparison of officer name to push user ID
    this.list.forEach((off: any) => {
      if (off.EmpName == this.selectedOfficer || off.EmpName2 == this.selectedOfficer) {
        this.assignPayload.ContUoUsrId = off.UserId;
      }
    })

    let data = this.assignPayload;
    let AwardNum = this.assignPayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.isVisible = false;
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Responsible officer appointed')
        } else {
          this.message.create('success', 'تم تعيين الموظف المسؤول');
        }
        this.router.navigateByUrl('contract/dashboard/prep')
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
