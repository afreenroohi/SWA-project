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

@Component({
  selector: 'app-prequal-dash',
  templateUrl: './prequal-dash.component.html',
  styleUrls: ['./prequal-dash.component.scss']
})
export class PrequalDashComponent implements OnInit {
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
    public translate: TranslateService
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
      { RequestID: 'REQ-001', QualificationCallName: 'Water Infrastructure Qualification', TechnicalEntity: 'Engineering Division', QualificationCommittee: 'Technical Committee A', Region: 'Central', Activity: 'Water Treatment', RfpStatus: 'A' },
      { RequestID: 'REQ-002', QualificationCallName: 'IT Systems Qualification', TechnicalEntity: 'IT Department', QualificationCommittee: 'Technical Committee B', Region: 'Eastern', Activity: 'IT Services', RfpStatus: 'S' },
      { RequestID: 'REQ-003', QualificationCallName: 'Construction Qualification', TechnicalEntity: 'Construction Division', QualificationCommittee: 'Technical Committee C', Region: 'Western', Activity: 'Building Construction', RfpStatus: 'D' },
      { RequestID: 'REQ-004', QualificationCallName: 'Maintenance Services Qualification', TechnicalEntity: 'Operations Department', QualificationCommittee: 'Technical Committee A', Region: 'Northern', Activity: 'Facility Maintenance', RfpStatus: 'A' },
      { RequestID: 'REQ-005', QualificationCallName: 'Security Systems Qualification', TechnicalEntity: 'Security Division', QualificationCommittee: 'Technical Committee D', Region: 'Central', Activity: 'Security Services', RfpStatus: 'S' }
    ];
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
  
}
