import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { listOfColumnRFPMG, listOfColumnPRQUALUSER } from 'src/app/shared/shared';
import { ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myprequal',
  templateUrl: './myprequal.component.html',
  styleUrls: ['./myprequal.component.scss']
})
export class MyprequalComponent implements OnInit {
  listArray: any;
  rfpList: any;
  totalProjects = 0;
  approvedProjects = 0;
  draftProjects = 0;
  cancelledProjects = 0;
  submittedProjects = 0;
  departmentList: any[] = [];
  repForm: FormGroup;
  listOfColumnList = listOfColumnRFPMG;
  currentDashboard = 'my';
  isEndUser = false;
  isPRQualUser = true;


  constructor(
    private api: ApiService,
    readonly cs: CommonService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private rfp: RFPService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.repForm = this.fb.group({
      rfpNo: new FormControl(''),
      dep: new FormControl(''),
      pendingDept: new FormControl(''),
      rfpNumber: new FormControl(''),
      pendingUser: new FormControl(''),
      competition: new FormControl(''),
      status: new FormControl('')
    });
  }


  ngOnInit(): void {
    this.listArray = [
      { RequestID: 'REQ-001', QualificationCallName: 'Water Infrastructure Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee A', Region: 'Central', Activity: 'Water Treatment', PrequalificationNumber: '123456789012', RfpStatus: 'A' },
      { RequestID: 'REQ-002', QualificationCallName: 'IT Systems Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee B', Region: 'Eastern', Activity: 'IT Services', PrequalificationNumber: '234567890123', RfpStatus: 'S' },
      { RequestID: 'REQ-003', QualificationCallName: 'Construction Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee C', Region: 'Western', Activity: 'Building Construction', PrequalificationNumber: '345678901234', RfpStatus: 'D' },
      { RequestID: 'REQ-004', QualificationCallName: 'Maintenance Services Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee A', Region: 'Northern', Activity: 'Facility Maintenance', PrequalificationNumber: '456789012345', RfpStatus: 'A' },
      { RequestID: 'REQ-005', QualificationCallName: 'Security Systems Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee D', Region: 'Central', Activity: 'Security Services', PrequalificationNumber: '567890123456', RfpStatus: 'S' }
    ];

    const callNameMap: { [key: string]: string } = {
      'Water Infrastructure Qualification': 'تأهيل البنية التحتية للمياه',
      'IT Systems Qualification': 'تأهيل أنظمة تقنية المعلومات',
      'Construction Qualification': 'تأهيل الإنشاءات',
      'Maintenance Services Qualification': 'تأهيل خدمات الصيانة',
      'Security Systems Qualification': 'تأهيل الأنظمة الأمنية'
    };

    const entityMap: { [key: string]: string } = {
      'Engineering Division': 'القسم الفني',
      'IT Department': 'قسم تقنية المعلومات',
      'Construction Division': 'قسم الإنشاءات',
      'Operations Department': 'قسم العمليات',
      'Security Division': 'القسم الأمني'
    };

    const committeeMap: { [key: string]: string } = {
      'Technical Committee A': 'اللجنة الفنية أ',
      'Technical Committee B': 'اللجنة الفنية ب',
      'Technical Committee C': 'اللجنة الفنية ج',
      'Technical Committee D': 'اللجنة الفنية د'
    };

    const regionMap: { [key: string]: string } = {
      'Central': 'الوسطى',
      'Eastern': 'الشرقية',
      'Western': 'الغربية',
      'Northern': 'الشمالية'
    };

    const activityMap: { [key: string]: string } = {
      'Water Treatment': 'معالجة المياه',
      'IT Services': 'خدمات تقنية المعلومات',
      'Building Construction': 'تشييد المباني',
      'Facility Maintenance': 'صيانة المرافق',
      'Security Services': 'الخدمات الأمنية'
    };

    this.listArray = this.listArray.map((item: any) => ({
      ...item,
      QualificationCallNameAr: callNameMap[item.QualificationCallName] || item.QualificationCallName,
      TechnicalEntityAr: entityMap[item.TechnicalEntity] || item.TechnicalEntity,
      QualificationCommitteeAr: committeeMap[item.QualificationCommittee] || item.QualificationCommittee,
      RegionAr: regionMap[item.Region] || item.Region,
      ActivityAr: activityMap[item.Activity] || item.Activity
    }));
    this.rfpList = this.listArray;
    this.calculateStats();
    this.getData();
    this.updateColumnList();
  }
  calculateStats() {
    this.totalProjects = this.listArray?.length || 0;
    this.approvedProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'A').length || 0;
    this.draftProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'D').length || 0;
    this.cancelledProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'C').length || 0;
    this.submittedProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'S').length || 0;

    //this.barChartData.datasets[0].data = [this.approvedProjects, this.submittedProjects, this.draftProjects];
  }
  getDepartment() {
    this.departmentList = this.listArray;
    //this.pendingDepartmentList = [];
  }
  filterSearch() {
    this.listArray = [];
    const data = {
      userid: '',
      dep: this.repForm.get('dep')?.value ? this.repForm.get('dep')?.value : 'ALL',
      CwfDept: this.repForm.get('pendingDept')?.value ? this.repForm.get('pendingDept')?.value : '',
      rfpno: this.repForm.controls['rfpNo'].value ? this.repForm.controls['rfpNo'].value : '',
      proj: '',
      Ind: '8'
    };
    this.getData(data);
  }
  getData(value?: any) {
    // Data is already set in ngOnInit, no need to reassign
  }
  updateColumnList(): void {
    if (this.isPRQualUser) {
      this.listOfColumnList = listOfColumnPRQUALUSER;
    } else if (this.isEndUser) {
      this.listOfColumnList = [
        { id: 1, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 2, title: 'RFP Number', titleAr: 'رقم RFP' },
        { id: 3, title: 'RFP Version', titleAr: 'إصدار RFP' },
        { id: 4, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 5, title: 'Created On', titleAr: 'تاريخ الإنشاء' },
        { id: 6, title: 'Req. Dept', titleAr: 'قسم الطلب' },
        { id: 7, title: 'Pending Dept', titleAr: 'القسم المعلق' },
        { id: 8, title: 'Pending User', titleAr: 'المستخدم المعلق' },
        { id: 9, title: 'Status', titleAr: 'الحالة' },
        { id: 10, title: 'View', titleAr: 'عرض' },
        { id: 11, title: 'Actions', titleAr: 'الإجراءات' }
      ];
    } else if (this.currentDashboard === 'procurement') {
      this.listOfColumnList = [
        { id: 1, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 2, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 3, title: 'Project Dept', titleAr: 'قسم المشروع' },
        { id: 4, title: 'Type of Competition', titleAr: 'نوع المنافسة' },
        { id: 5, title: 'Activity / Subactivity', titleAr: 'النشاط / النشاط الفرعي' },
        { id: 6, title: 'Coordinator Name', titleAr: 'اسم المنسق' },
        { id: 7, title: 'Coordinator Contact', titleAr: 'جهة اتصال المنسق' },
        { id: 8, title: 'Assigned To', titleAr: 'مسند إلى' },
        { id: 9, title: 'Status', titleAr: 'الحالة' },
        { id: 10, title: 'View', titleAr: 'عرض' }
      ];
    } else {
      this.listOfColumnList = [
        { id: 1, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 2, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 3, title: 'Project Dept', titleAr: 'قسم المشروع' },
        { id: 4, title: 'Type of Competition', titleAr: 'نوع المنافسة' },
        { id: 5, title: 'Activity / Subactivity', titleAr: 'النشاط / النشاط الفرعي' },
        { id: 6, title: 'Coordinator Name', titleAr: 'اسم المنسق' },
        { id: 7, title: 'Coordinator Contact', titleAr: 'جهة اتصال المنسق' },
        { id: 8, title: 'Status', titleAr: 'الحالة' },
        { id: 9, title: 'View', titleAr: 'عرض' },
        { id: 10, title: 'Actions', titleAr: 'الإجراءات' }
      ];
    }
  }

  goBack() {
    this.router.navigate(['/rfp/prequalification']);
  }

}
