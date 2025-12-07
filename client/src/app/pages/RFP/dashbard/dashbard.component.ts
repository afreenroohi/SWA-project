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
  isProcurementDashboard = false;
  currentDashboard = 'my';

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
  this.updateColumnList();
  
  this.listArray = [
  { RfpName: 'Water Treatment Expansion', PurchaseReqNo: 'PR-2025-1001', DeptText: 'Engineering Department', CompetitionType: 'General Competition', Activity: 'Water Infrastructure', CoordinatorContact: '+966-50-123-4567', AssignedTo: 'Mohammed Ali', RfpStatus: 'A', CreatedOn: '20250110', RfpNo: 'RFP-001', RfpVersion: '1' },
  { RfpName: 'Desalination Plant', PurchaseReqNo: 'PR-2025-1002', DeptText: 'Operations Department', CompetitionType: 'Limited Competition', Activity: 'Desalination Services', CoordinatorContact: '+966-50-234-5678', AssignedTo: 'Fatima Noor', RfpStatus: 'D', CreatedOn: '20250109', RfpNo: 'RFP-002', RfpVersion: '1' },
  { RfpName: 'Pipeline Inspection', PurchaseReqNo: 'PR-2025-1003', DeptText: 'Maintenance Department', CompetitionType: 'Direct Purchase', Activity: 'Pipeline Maintenance', CoordinatorContact: '+966-50-345-6789', AssignedTo: 'John Smith', RfpStatus: 'C', CreatedOn: '20250108', RfpNo: 'RFP-003', RfpVersion: '1' },
  { RfpName: 'IT Infrastructure Upgrade', PurchaseReqNo: 'PR-2025-1004', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'IT Services', CoordinatorContact: '+966-50-456-7890', AssignedTo: 'Aisha Karim', RfpStatus: 'R', CreatedOn: '20250107', RfpNo: 'RFP-004', RfpVersion: '1' },
  { RfpName: 'Smart Meter Installation', PurchaseReqNo: 'PR-2025-1005', DeptText: 'Engineering Department', CompetitionType: 'General Competition', Activity: 'Metering Systems', CoordinatorContact: '+966-50-567-8901', AssignedTo: 'Khalid Hassan', RfpStatus: 'S', CreatedOn: '20250106', RfpNo: 'RFP-005', RfpVersion: '1' },
  { RfpName: 'Network Security Enhancement', PurchaseReqNo: 'PR-2025-1006', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Cybersecurity', CoordinatorContact: '+966-50-678-9012', AssignedTo: 'Sara Ahmed', RfpStatus: 'A', CreatedOn: '20250105', RfpNo: 'RFP-006', RfpVersion: '1' },
  { RfpName: 'Cloud Migration Project', PurchaseReqNo: 'PR-2025-1007', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Cloud Services', CoordinatorContact: '+966-50-789-0123', AssignedTo: 'Ali Hassan', RfpStatus: 'D', CreatedOn: '20250104', RfpNo: 'RFP-007', RfpVersion: '1' },
  { RfpName: 'Data Center Modernization', PurchaseReqNo: 'PR-2025-1008', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'Infrastructure', CoordinatorContact: '+966-50-890-1234', AssignedTo: 'Omar Khalid', RfpStatus: 'S', CreatedOn: '20250103', RfpNo: 'RFP-008', RfpVersion: '1' },
  { RfpName: 'Software Licensing Agreement', PurchaseReqNo: 'PR-2025-1009', DeptText: 'IT Department', CompetitionType: 'Direct Purchase', Activity: 'Software Procurement', CoordinatorContact: '+966-50-901-2345', AssignedTo: 'Noor Ali', RfpStatus: 'A', CreatedOn: '20250102', RfpNo: 'RFP-009', RfpVersion: '1' },
  { RfpName: 'Hardware Procurement', PurchaseReqNo: 'PR-2025-1010', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Equipment Purchase', CoordinatorContact: '+966-50-012-3456', AssignedTo: 'Layla Ahmed', RfpStatus: 'D', CreatedOn: '20250101', RfpNo: 'RFP-010', RfpVersion: '1' },
  { RfpName: 'Employee Training Services', PurchaseReqNo: 'PR-2025-1011', DeptText: 'HR Department', CompetitionType: 'Limited Competition', Activity: 'Training & Development', CoordinatorContact: '+966-50-123-4568', AssignedTo: 'Zain Malik', RfpStatus: 'S', CreatedOn: '20241230', RfpNo: 'RFP-011', RfpVersion: '1' },
  { RfpName: 'Consulting Services', PurchaseReqNo: 'PR-2025-1012', DeptText: 'Finance Department', CompetitionType: 'Framework Agreement', Activity: 'Financial Consulting', CoordinatorContact: '+966-50-234-5679', AssignedTo: 'Huda Youssef', RfpStatus: 'A', CreatedOn: '20241229', RfpNo: 'RFP-012', RfpVersion: '1' },
  { RfpName: 'Facility Management Services', PurchaseReqNo: 'PR-2025-1013', DeptText: 'Operations Department', CompetitionType: 'General Competition', Activity: 'Facility Services', CoordinatorContact: '+966-50-345-6780', AssignedTo: 'Tariq Nasser', RfpStatus: 'D', CreatedOn: '20241228', RfpNo: 'RFP-013', RfpVersion: '1' },
  { RfpName: 'Equipment Maintenance Contract', PurchaseReqNo: 'PR-2025-1014', DeptText: 'Maintenance Department', CompetitionType: 'Limited Competition', Activity: 'Maintenance Services', CoordinatorContact: '+966-50-456-7891', AssignedTo: 'Reem Saleh', RfpStatus: 'S', CreatedOn: '20241227', RfpNo: 'RFP-014', RfpVersion: '1' },
  { RfpName: 'Vehicle Fleet Management', PurchaseReqNo: 'PR-2025-1015', DeptText: 'Operations Department', CompetitionType: 'General Competition', Activity: 'Fleet Services', CoordinatorContact: '+966-50-567-8902', AssignedTo: 'Yara Ibrahim', RfpStatus: 'A', CreatedOn: '20241226', RfpNo: 'RFP-015', RfpVersion: '1' },
  { RfpName: 'Office Supplies Procurement', PurchaseReqNo: 'PR-2025-1016', DeptText: 'Administration Department', CompetitionType: 'Direct Purchase', Activity: 'Office Supplies', CoordinatorContact: '+966-50-678-9013', AssignedTo: 'Karim Faisal', RfpStatus: 'D', CreatedOn: '20241225', RfpNo: 'RFP-016', RfpVersion: '1' },
  { RfpName: 'Marketing Campaign Services', PurchaseReqNo: 'PR-2025-1017', DeptText: 'Marketing Department', CompetitionType: 'Limited Competition', Activity: 'Marketing Services', CoordinatorContact: '+966-50-789-0124', AssignedTo: 'Dina Rashid', RfpStatus: 'S', CreatedOn: '20241224', RfpNo: 'RFP-017', RfpVersion: '1' },
  { RfpName: 'Legal Advisory Services', PurchaseReqNo: 'PR-2025-1018', DeptText: 'Legal Department', CompetitionType: 'Framework Agreement', Activity: 'Legal Services', CoordinatorContact: '+966-50-890-1235', AssignedTo: 'Sami Adel', RfpStatus: 'A', CreatedOn: '20241223', RfpNo: 'RFP-018', RfpVersion: '1' },
  { RfpName: 'Insurance Services Contract', PurchaseReqNo: 'PR-2025-1019', DeptText: 'Finance Department', CompetitionType: 'General Competition', Activity: 'Insurance', CoordinatorContact: '+966-50-901-2346', AssignedTo: 'Mona Samir', RfpStatus: 'D', CreatedOn: '20241222', RfpNo: 'RFP-019', RfpVersion: '1' },
  { RfpName: 'Audit Services Agreement', PurchaseReqNo: 'PR-2025-1020', DeptText: 'Finance Department', CompetitionType: 'Limited Competition', Activity: 'Audit & Compliance', CoordinatorContact: '+966-50-012-3457', AssignedTo: 'Amr Tamer', RfpStatus: 'S', CreatedOn: '20241221', RfpNo: 'RFP-020', RfpVersion: '1' },
  { RfpName: 'Recruitment Services', PurchaseReqNo: 'PR-2025-1021', DeptText: 'HR Department', CompetitionType: 'Direct Purchase', Activity: 'Recruitment', CoordinatorContact: '+966-50-123-4569', AssignedTo: 'Jana Walid', RfpStatus: 'A', CreatedOn: '20241220', RfpNo: 'RFP-021', RfpVersion: '1' },
  { RfpName: 'Payroll System Implementation', PurchaseReqNo: 'PR-2025-1022', DeptText: 'HR Department', CompetitionType: 'General Competition', Activity: 'HR Systems', CoordinatorContact: '+966-50-234-5680', AssignedTo: 'Basem Fouad', RfpStatus: 'D', CreatedOn: '20241219', RfpNo: 'RFP-022', RfpVersion: '1' },
  { RfpName: 'Security Services Contract', PurchaseReqNo: 'PR-2025-1023', DeptText: 'Security Department', CompetitionType: 'Framework Agreement', Activity: 'Security Services', CoordinatorContact: '+966-50-345-6781', AssignedTo: 'Lina Majed', RfpStatus: 'S', CreatedOn: '20241218', RfpNo: 'RFP-023', RfpVersion: '1' },
  { RfpName: 'Cleaning Services Agreement', PurchaseReqNo: 'PR-2025-1024', DeptText: 'Operations Department', CompetitionType: 'Limited Competition', Activity: 'Cleaning Services', CoordinatorContact: '+966-50-456-7892', AssignedTo: 'Fadi Nabil', RfpStatus: 'A', CreatedOn: '20241217', RfpNo: 'RFP-024', RfpVersion: '1' },
  { RfpName: 'Catering Services Contract', PurchaseReqNo: 'PR-2025-1025', DeptText: 'Administration Department', CompetitionType: 'General Competition', Activity: 'Catering Services', CoordinatorContact: '+966-50-567-8903', AssignedTo: 'Rana Hisham', RfpStatus: 'D', CreatedOn: '20241216', RfpNo: 'RFP-025', RfpVersion: '1' },
  { RfpName: 'Transportation Services', PurchaseReqNo: 'PR-2025-1026', DeptText: 'Operations Department', CompetitionType: 'Framework Agreement', Activity: 'Transportation', CoordinatorContact: '+966-50-678-9014', AssignedTo: 'Nabil Sherif', RfpStatus: 'S', CreatedOn: '20241215', RfpNo: 'RFP-026', RfpVersion: '1' },
  { RfpName: 'Printing Services Contract', PurchaseReqNo: 'PR-2025-1027', DeptText: 'Administration Department', CompetitionType: 'Direct Purchase', Activity: 'Printing Services', CoordinatorContact: '+966-50-789-0125', AssignedTo: 'Salma Essam', RfpStatus: 'A', CreatedOn: '20241214', RfpNo: 'RFP-027', RfpVersion: '1' },
  { RfpName: 'Event Management Services', PurchaseReqNo: 'PR-2025-1028', DeptText: 'Marketing Department', CompetitionType: 'Limited Competition', Activity: 'Event Management', CoordinatorContact: '+966-50-890-1236', AssignedTo: 'Marwan Gamal', RfpStatus: 'D', CreatedOn: '20241213', RfpNo: 'RFP-028', RfpVersion: '1' },
  { RfpName: 'Waste Management Services', PurchaseReqNo: 'PR-2025-1029', DeptText: 'Operations Department', CompetitionType: 'General Competition', Activity: 'Waste Management', CoordinatorContact: '+966-50-901-2347', AssignedTo: 'Ghada Tarek', RfpStatus: 'S', CreatedOn: '20241212', RfpNo: 'RFP-029', RfpVersion: '1' },
  { RfpName: 'Energy Management System', PurchaseReqNo: 'PR-2025-1030', DeptText: 'Engineering Department', CompetitionType: 'Framework Agreement', Activity: 'Energy Services', CoordinatorContact: '+966-50-012-3458', AssignedTo: 'Hazem Ashraf', RfpStatus: 'A', CreatedOn: '20241211', RfpNo: 'RFP-030', RfpVersion: '1' }
];



this.rfpList = this.listArray;
  this.calculateStats();
  this.calculatePendingUsers();
  
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
    this.departmentList = [];
    this.pendingDepartmentList = [];
  }

  getData(value?: any) {
    // Data is already set in ngOnInit, no need to reassign
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

  toggleDashboard(): void {
    this.currentDashboard = this.isProcurementDashboard ? 'procurement' : 'my';
    this.updateColumnList();
  }

  updateColumnList(): void {
    if (this.currentDashboard === 'procurement') {
      this.listOfColumnList = [
        { id: 1, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 2, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 3, title: 'Project Dept', titleAr: 'قسم المشروع' },
        { id: 4, title: 'Type of Competition', titleAr: 'نوع المنافسة' },
        { id: 5, title: 'Activity', titleAr: 'النشاط' },
        { id: 6, title: 'Coordinator Contact', titleAr: 'جهة اتصال المنسق' },
        { id: 7, title: 'Assigned To', titleAr: 'مسند إلى' },
        { id: 8, title: 'Status', titleAr: 'الحالة' },
        { id: 9, title: 'View', titleAr: 'عرض' }
      ];
    } else {
      this.listOfColumnList = [
        { id: 1, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 2, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 3, title: 'Project Dept', titleAr: 'قسم المشروع' },
        { id: 4, title: 'Type of Competition', titleAr: 'نوع المنافسة' },
        { id: 5, title: 'Activity', titleAr: 'النشاط' },
        { id: 6, title: 'Coordinator Contact', titleAr: 'جهة اتصال المنسق' },
        { id: 8, title: 'Status', titleAr: 'الحالة' },
        { id: 9, title: 'View', titleAr: 'عرض' },
        { id: 10, title: 'Actions', titleAr: 'الإجراءات' }
      ];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}













// OLD CODE // ///

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
