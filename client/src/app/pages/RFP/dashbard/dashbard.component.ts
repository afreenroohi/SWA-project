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
import { listOfColumnRFPMG } from 'src/app/shared/shared';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashbard',
  templateUrl: './dashbard.component.html',
  styleUrls: ['./dashbard.component.scss']
})
export class DashbardComponent implements OnInit, OnDestroy {

  listArray: any;
  rfpList: any;
  departmentList: any[] = [];
  pendingDepartmentList: any[] = [];
  listOfColumnList = listOfColumnRFPMG;
  size: NzButtonSize = 'large';
  repForm: FormGroup;

  // Dashboard Stats
  totalProjects = 0;
  approvedProjects = 0;
  draftProjects = 0;
  cancelledProjects = 0;
  submittedProjects = 0;

  // Chart Data
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Procurement', 'Finance', 'Quality Control', 'HR', 'Legal'],
    datasets: [{ 
      data: [8, 5, 12, 3, 7], 
      label: 'Pending Department', 
      backgroundColor: ['#005c99', '#005c99', '#005c99', '#005c99', '#005c99'],
      borderRadius: 8,
      barThickness: 40
    }]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: { 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // Doughnut Chart for Pending Users
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#005c99', '#0077c2', '#004a7a', '#003d66', '#faad14'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: { padding: 15, font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    }
  };

  private readonly destroy$ = new Subject<void>();

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
      pendingDept: new FormControl('')
    });
  }

  ngOnInit(): void {
  this.rfp.setIsSearchRFPMenuActive(true);
  this.getDepartment();
  this.getData();

  this.repForm.controls['dep'].valueChanges.subscribe((value: any) => {
    if (value) {
      this.repForm.controls['rfpNo'].setValue('');
      this.rfpList = [];
    }
  });

  this.repForm.controls['pendingDept'].valueChanges.subscribe((value: any) => {
    if (value) {
      this.repForm.controls['rfpNo'].setValue('');
      this.rfpList = [];
    }
  });

  // 💡 DUMMY DATA (for testing)
   

  this.listArray = [
  { RfpName: 'Water Treatment Expansion', RfpNo: 'RFP-2025-001', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1001', CreatedOn: '2025101000', SlaEndDate: '2025101500', SlaEndTime: '202510151030', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Mohammed Ali', WfPendUsrAr: 'محمد علي', RfpStatus: 'A', SlaInd: 'Y', Sla: '5 Days', SlaAr: '٥ أيام' },
  { RfpName: 'Desalination Plant', RfpNo: 'RFP-2025-002', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1002', CreatedOn: '2025092500', SlaEndDate: '2025092800', SlaEndTime: '202509281145', DeptText: 'Engineering Department', WfPendingDpt: 'Finance', WfPendingDptAr: 'المالية', WfPendUsrEn: 'Fatima Noor', WfPendUsrAr: 'فاطمة نور', RfpStatus: 'D', SlaInd: 'N', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Pipeline Inspection', RfpNo: 'RFP-2025-003', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1003', CreatedOn: '2025083000', SlaEndDate: '2025090100', SlaEndTime: '202509011600', DeptText:'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'John Smith', WfPendUsrAr: 'جون سميث', RfpStatus: 'C', SlaInd: 'Y', Sla: '2 Days', SlaAr: '٢ أيام' },
  { RfpName: 'IT Infrastructure', RfpNo: 'RFP-2025-004', RfpVersion: '3', PurchaseReqNo: 'PR-2025-1004', CreatedOn: '2025091000', SlaEndDate: '2025091400', SlaEndTime: '202509141200', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Aisha Karim', WfPendUsrAr: 'عائشة كريم', RfpStatus: 'R', SlaInd: 'N', Sla: '4 Days', SlaAr: '٤ أيام' },
  { RfpName: 'Smart Meter', RfpNo: 'RFP-2025-005', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1005', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Khalid Hassan', WfPendUsrAr: 'خالد حسن', RfpStatus: 'S', SlaInd: 'Y', Sla: '1 Day', SlaAr: 'يوم واحد' },
  { RfpName: 'Network Security', RfpNo: 'RFP-2025-006', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1006', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Sara Ahmed', WfPendUsrAr: 'سارة أحمد', RfpStatus: 'A', SlaInd: 'Y', Sla: '2 Days', SlaAr: 'يومان' },
  { RfpName: 'Cloud Migration', RfpNo: 'RFP-2025-007', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1007', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Ali Hassan', WfPendUsrAr: 'علي حسن', RfpStatus: 'D', SlaInd: 'N', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Data Center', RfpNo: 'RFP-2025-008', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1008', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Omar Khalid', WfPendUsrAr: 'عمر خالد', RfpStatus: 'S', SlaInd: 'Y', Sla: '4 Days', SlaAr: '٤ أيام' },
  { RfpName: 'Software Licensing', RfpNo: 'RFP-2025-009', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1009', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Legal', WfPendingDptAr: 'القانونية', WfPendUsrEn: 'Noor Ali', WfPendUsrAr: 'نور علي', RfpStatus: 'A', SlaInd: 'Y', Sla: '2 Days', SlaAr: 'يومان' },
  { RfpName: 'Hardware Procurement', RfpNo: 'RFP-2025-010', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1010', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Layla Ahmed', WfPendUsrAr: 'ليلى أحمد', RfpStatus: 'D', SlaInd: 'N', Sla: '5 Days', SlaAr: '٥ أيام' },
  { RfpName: 'Training Services', RfpNo: 'RFP-2025-011', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1011', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'HR', WfPendingDptAr: 'الموارد البشرية', WfPendUsrEn: 'Zain Malik', WfPendUsrAr: 'زين مالك', RfpStatus: 'S', SlaInd: 'Y', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Consulting Services', RfpNo: 'RFP-2025-012', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1012', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Finance', WfPendingDptAr: 'المالية', WfPendUsrEn: 'Huda Youssef', WfPendUsrAr: 'هدى يوسف', RfpStatus: 'A', SlaInd: 'Y', Sla: '6 Days', SlaAr: '٦ أيام' },
  { RfpName: 'Facility Management', RfpNo: 'RFP-2025-013', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1013', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Tariq Nasser', WfPendUsrAr: 'طارق ناصر', RfpStatus: 'D', SlaInd: 'N', Sla: '4 Days', SlaAr: '٤ أيام' },
  { RfpName: 'Equipment Maintenance', RfpNo: 'RFP-2025-014', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1014', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Reem Saleh', WfPendUsrAr: 'ريم صالح', RfpStatus: 'S', SlaInd: 'Y', Sla: '2 Days', SlaAr: 'يومان' },
  { RfpName: 'Vehicle Fleet', RfpNo: 'RFP-2025-015', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1015', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Yara Ibrahim', WfPendUsrAr: 'يارا إبراهيم', RfpStatus: 'A', SlaInd: 'Y', Sla: '7 Days', SlaAr: '٧ أيام' },
  { RfpName: 'Office Supplies', RfpNo: 'RFP-2025-016', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1016', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Karim Faisal', WfPendUsrAr: 'كريم فيصل', RfpStatus: 'D', SlaInd: 'N', Sla: '1 Day', SlaAr: 'يوم واحد' },
  { RfpName: 'Marketing Campaign', RfpNo: 'RFP-2025-017', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1017', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Finance', WfPendingDptAr: 'المالية', WfPendUsrEn: 'Dina Rashid', WfPendUsrAr: 'دينا راشد', RfpStatus: 'S', SlaInd: 'Y', Sla: '5 Days', SlaAr: '٥ أيام' },
  { RfpName: 'Legal Advisory', RfpNo: 'RFP-2025-018', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1018', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Legal', WfPendingDptAr: 'القانونية', WfPendUsrEn: 'Sami Adel', WfPendUsrAr: 'سامي عادل', RfpStatus: 'A', SlaInd: 'Y', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Insurance Services', RfpNo: 'RFP-2025-019', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1019', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Finance', WfPendingDptAr: 'المالية', WfPendUsrEn: 'Mona Samir', WfPendUsrAr: 'منى سمير', RfpStatus: 'D', SlaInd: 'N', Sla: '4 Days', SlaAr: '٤ أيام' },
  { RfpName: 'Audit Services', RfpNo: 'RFP-2025-020', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1020', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Amr Tamer', WfPendUsrAr: 'عمرو تامر', RfpStatus: 'S', SlaInd: 'Y', Sla: '6 Days', SlaAr: '٦ أيام' },
  { RfpName: 'Recruitment Services', RfpNo: 'RFP-2025-021', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1021', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'HR', WfPendingDptAr: 'الموارد البشرية', WfPendUsrEn: 'Jana Walid', WfPendUsrAr: 'جنى وليد', RfpStatus: 'A', SlaInd: 'Y', Sla: '2 Days', SlaAr: 'يومان' },
  { RfpName: 'Payroll System', RfpNo: 'RFP-2025-022', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1022', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'HR', WfPendingDptAr: 'الموارد البشرية', WfPendUsrEn: 'Basem Fouad', WfPendUsrAr: 'باسم فؤاد', RfpStatus: 'D', SlaInd: 'N', Sla: '5 Days', SlaAr: '٥ أيام' },
  { RfpName: 'Security Services', RfpNo: 'RFP-2025-023', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1023', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Lina Majed', WfPendUsrAr: 'لينا ماجد', RfpStatus: 'S', SlaInd: 'Y', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Cleaning Services', RfpNo: 'RFP-2025-024', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1024', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Procurement', WfPendingDptAr: 'المشتريات', WfPendUsrEn: 'Fadi Nabil', WfPendUsrAr: 'فادي نبيل', RfpStatus: 'A', SlaInd: 'Y', Sla: '4 Days', SlaAr: '٤ أيام' },
  { RfpName: 'Catering Services', RfpNo: 'RFP-2025-025', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1025', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Rana Hisham', WfPendUsrAr: 'رنا هشام', RfpStatus: 'D', SlaInd: 'N', Sla: '2 Days', SlaAr: 'يومان' },
  { RfpName: 'Transportation', RfpNo: 'RFP-2025-026', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1026', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Nabil Sherif', WfPendUsrAr: 'نبيل شريف', RfpStatus: 'S', SlaInd: 'Y', Sla: '7 Days', SlaAr: '٧ أيام' },
  { RfpName: 'Printing Services', RfpNo: 'RFP-2025-027', RfpVersion: '2', PurchaseReqNo: 'PR-2025-1027', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Salma Essam', WfPendUsrAr: 'سلمى عصام', RfpStatus: 'A', SlaInd: 'Y', Sla: '1 Day', SlaAr: 'يوم واحد' },
  { RfpName: 'Event Management', RfpNo: 'RFP-2025-028', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1028', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Legal', WfPendingDptAr: 'القانونية', WfPendUsrEn: 'Marwan Gamal', WfPendUsrAr: 'مروان جمال', RfpStatus: 'D', SlaInd: 'N', Sla: '5 Days', SlaAr: '٥ أيام' },
  { RfpName: 'Waste Management', RfpNo: 'RFP-2025-029', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1029', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Quality Control', WfPendingDptAr: 'مراقبة الجودة', WfPendUsrEn: 'Ghada Tarek', WfPendUsrAr: 'غادة طارق', RfpStatus: 'S', SlaInd: 'Y', Sla: '3 Days', SlaAr: '٣ أيام' },
  { RfpName: 'Energy Management', RfpNo: 'RFP-2025-030', RfpVersion: '1', PurchaseReqNo: 'PR-2025-1030', CreatedOn: '2025071500', SlaEndDate: '2025071600', SlaEndTime: '202507160930', DeptText: 'Engineering Department', WfPendingDpt: 'Legal', WfPendingDptAr: 'القانونية', WfPendUsrEn: 'Hazem Ashraf', WfPendUsrAr: 'حازم أشرف', RfpStatus: 'A', SlaInd: 'Y', Sla: '6 Days', SlaAr: '٦ أيام' }
];



this.rfpList = this.listArray;
// this.listOfDisplayData = this.listArray; // ensures table renders dummy rows

  this.calculateStats();
  this.calculatePendingUsers();
  console.log(this.rfpList,'listtttttttttttttttttt')
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

  getDepartment() {
    this.spinner.show();
    forkJoin([
      this.api.get(`rfp-department-list?userid=${this.cs.getUserData().userid.toUpperCase()}`),
      this.api.get('rfp-pending-departments')
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([departments, pendingwithDepartments]) => {
          this.departmentList = departments;
          this.pendingDepartmentList = pendingwithDepartments;
        },
        ([departmentError, pendingwithDepartmentError]) => {
          if (departmentError) {
            this.cs.createMessage('error', departmentError.statusText);
          }
          if (pendingwithDepartmentError) {
            this.cs.createMessage('error', pendingwithDepartmentError.statusText);
          }
        }
      );
  }

  getData(value?: any) {
    // 🧪 DUMMY DATA SECTION (for UI testing)
    const dummyData = [
      {
        RfpNo: 'RFP-001',
        RfpTitle: 'IT Infrastructure Upgrade',
        Department: 'Information Technology',
        RfpStatus: 'Open',
        EstimatedCost: '250000',
        WfPendUsrEn: 'John Doe',
        Sla: '10 days'
      },
      {
        RfpNo: 'RFP-002',
        RfpTitle: 'Office Renovation',
        Department: 'Facilities',
        RfpStatus: 'Closed',
        EstimatedCost: '150000',
        WfPendUsrEn: 'Sara Ali',
        Sla: 'Completed'
      },
      {
        RfpNo: 'RFP-003',
        RfpTitle: 'Security System Upgrade',
        Department: 'Administration',
        RfpStatus: 'Pending Approval',
        EstimatedCost: '180000',
        WfPendUsrEn: 'Mohammed Ahmed',
        Sla: '5 days'
      }
    ];

    /* 🟡 Commented Original API Call — DO NOT REMOVE */
    /*
    if (value) {
      this.spinner.show();
      this.api.post('RfpSearch', value).pipe(takeUntil(this.destroy$)).subscribe(
        res => {
          this.listArray = res.d.results;
          this.rfpList = res.d.results;
          this.listArray = this.listArray.map((listItem: any) => {
            if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
              listItem.Sla = listItem.SlaAr = '';
              listItem.WfPendUsrEn = listItem.WfPendUsrAr = '';
            }
            return listItem;
          });
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
    } else {
      let data = {
        userid: '',
        rfpno: '',
        proj: '',
        Ind: '8',
        dep: 'ALL',
        CwfDept: ''
      };
      this.spinner.show();
      this.api.post('RfpSearch', data).pipe(takeUntil(this.destroy$)).subscribe(
        res => {
          this.listArray = res.d.results;
          this.rfpList = res.d.results;
          this.listArray = this.listArray.map((listItem: any) => {
            if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
              listItem.Sla = listItem.SlaAr = '';
              listItem.WfPendUsrEn = listItem.WfPendUsrAr = '';
            }
            return listItem;
          });
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
    }
    */

    // ✅ DUMMY DATA ASSIGNMENT
    this.spinner.show();
    setTimeout(() => {
      this.listArray = dummyData;
      this.rfpList = dummyData;
      this.spinner.hide();
    }, 1000);
  }

  calculateStats() {
    this.totalProjects = this.listArray?.length || 0;
    this.approvedProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'A').length || 0;
    this.draftProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'D').length || 0;
    this.cancelledProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'C').length || 0;
    this.submittedProjects = this.listArray?.filter((item: any) => item.RfpStatus === 'S').length || 0;
  }

  calculatePendingUsers() {
    const userCounts: { [key: string]: number } = {};
    let testUser = [
      {"WfPendUsrEn":"Afreen"},
      {"WfPendUsrEn":"Dina Rashid"},
      {"WfPendUsrEn":"Dina Rashid"},
      {"WfPendUsrEn":"Mona Samir"},
      {"WfPendUsrEn":"Jana Walid"},
      {"WfPendUsrEn":"Jana Walid"},
      {"WfPendUsrEn":"Afreen"},
      {"WfPendUsrEn":"Afreen"},
      // {"WfPendUsrEn":"Rana Hisham"},
      // {"WfPendUsrEn":"Nabil Sherif"},
      // {"WfPendUsrEn":"Salma Essam"},
      // {"WfPendUsrEn":"Marwan Gamal"},
      // {"WfPendUsrEn":"Ghada Tarek"},
      // {"WfPendUsrEn":"Hazem Ashraf"}

    ]
    testUser?.forEach((item: any) => {
      if (item.WfPendUsrEn) {
        userCounts[item.WfPendUsrEn] = (userCounts[item.WfPendUsrEn] || 0) + 1;
      }
    });
    const colors = ['#005c99', '#0077c2', '#004a7a', '#003d66', '#faad14'];
    this.doughnutChartData.labels = Object.keys(userCounts);
    this.doughnutChartData.datasets[0].data = Object.values(userCounts);
    this.doughnutChartData.datasets[0].backgroundColor = colors.slice(0, Object.keys(userCounts).length);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}













// OLD CODE //

// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';
// import { NzButtonSize } from 'ng-zorro-antd/button';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Subject, forkJoin } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { CommonService } from 'src/app/service/common.service';
// import { ApiService } from 'src/app/service/RFP/api.service';
// import { RFPService } from 'src/app/service/RFP/rfp.service';
// import { listOfColumnRFPMG } from 'src/app/shared/shared';

// @Component({
//   selector: 'app-dashbard',
//   templateUrl: './dashbard.component.html',
//   styleUrls: ['./dashbard.component.scss']
// })
// export class DashbardComponent implements OnInit {


//   listArray: any;
 
//   rfpList: any;

//   departmentList: any[] = [];
//   pendingDepartmentList: any[] = [];


//   listOfColumnList = listOfColumnRFPMG


//   size: NzButtonSize = 'large';

//   repForm: FormGroup;

//   private readonly destroy$ = new Subject<void>();

//   constructor(private api: ApiService,
//     readonly cs: CommonService,
//     private fb: FormBuilder,
//     private spinner: NgxSpinnerService,
//     private rfp: RFPService,
//     public translate: TranslateService,) {
//     this.repForm = this.fb.group({
//       rfpNo: new FormControl(' '),
//       dep: new FormControl(''),
//       pendingDept: new FormControl('')
//     })

//   }


//   ngOnInit(): void {
//     this.rfp.setIsSearchRFPMenuActive(true)

//     this.getDepartment(); // * To get list of department
//     this.getData();
//     this.repForm.controls['dep'].valueChanges.subscribe((value: any) => {
//       if (value) {
//         this.repForm.controls['rfpNo'].setValue('');
//         this.rfpList = [];
//       }
//     })
//     this.repForm.controls['pendingDept'].valueChanges.subscribe((value: any) => {
//       if (value) {
//         this.repForm.controls['rfpNo'].setValue('');
//         this.rfpList = [];
//       }
//     })
//   }

//   filterSearch() {
//     this.listArray = [];
//     let data = {
//       userid: ' ',
//       dep: this.repForm.get('dep')?.value ? this.repForm.get('dep')?.value : 'ALL',
//       CwfDept: this.repForm.get('pendingDept')?.value ? this.repForm.get('pendingDept')?.value : ' ',
//       rfpno: this.repForm.controls['rfpNo'].value ? this.repForm.controls['rfpNo'].value : ' ',
//       proj: ' ',
//       Ind: "8"
//     }
//     this.getData(data)
//   }

//   getDepartment() {
//     this.spinner.show();
//     forkJoin([this.api.get(`rfp-department-list?userid=${this.cs.getUserData().userid.toUpperCase()}`),
//       this.api.get('rfp-pending-departments')
//     ]).pipe(takeUntil(this.destroy$))
//     .subscribe(([departments, pendingwithDepartments]) => {
//       this.departmentList = departments;
//       this.pendingDepartmentList = pendingwithDepartments;
//     }, ([departmentError, pendingwithDepartmentError]) => {
//       if (departmentError) {
//         this.cs.createMessage("error", departmentError.statusText)
//       }
//       if (pendingwithDepartmentError) {
//         this.cs.createMessage("error", pendingwithDepartmentError.statusText)
//       }

//     })
//   }

//   getData(value?: any) {
//     if (value) {
//       this.spinner.show()
//       this.api.post('RfpSearch', value).pipe(takeUntil(this.destroy$)).subscribe(res => {
//         this.listArray = res.d.results;
//         this.rfpList = res.d.results;
//         this.listArray = this.listArray.map((listItem: any) => {
//           if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
//             listItem.Sla = listItem.SlaAr = ''
//             listItem.WfPendUsrEn = listItem.WfPendUsrAr = ''
//             // listItem.WfPendUsrEn =  listItem.WfPendUsrEn = ''
//           }
//           return listItem;
//         });
//         this.spinner.hide()
//       }, (error) => {

//         this.spinner.hide()
//         this.cs.createMessage("error", error.statusText)

//       })
//     }
//     else {
//       let data = {
//         userid: ' ',
//         rfpno: ' ',
//         proj: ' ',
//         Ind: '8',
//         dep: 'ALL',
//         CwfDept: ' ',
//       }
//       this.spinner.show()
//       this.api.post('RfpSearch', data).pipe(takeUntil(this.destroy$)).subscribe(res => {
//         this.listArray = res.d.results
//         this.rfpList = res.d.results;
//         this.listArray = this.listArray.map((listItem: any) => {
//           if (listItem.RfpStatus === 'D' || listItem.RfpStatus === 'A' || listItem.RfpStatus === 'C') {
//             listItem.Sla = listItem.SlaAr = ''
//             listItem.WfPendUsrEn = listItem.WfPendUsrAr = ''
//             // listItem.WfPendUsrEn =  listItem.WfPendUsrEn = ''
//           }
//           return listItem;
//         });

//         this.spinner.hide()
//       }, (error) => {

//         this.spinner.hide()
//         this.cs.createMessage("error", error.statusText)

//       })
//     }

//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

// }
