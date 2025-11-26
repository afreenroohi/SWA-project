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
    labels: ['Total', 'Approved', 'Draft', 'Cancelled', 'Submitted'],
    datasets: [{ 
      data: [0, 0, 0, 0, 0], 
      label: 'Projects', 
      backgroundColor: ['#005c99', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'],
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
  {
    RfpName: 'Water Treatment Expansion',
    RfpNo: 'RFP-2025-001',
    RfpVersion: '1',
    PurchaseReqNo: 'PR-2025-1001',
    CreatedOn: '2025101000',
    SlaEndDate: '2025101500',   // 15 Oct 2025
    SlaEndTime: '202510151030', // 10:30 AM
    DeptText: 'Engineering Department',
    WfPendingDpt: 'Procurement',
    WfPendingDptAr: 'المشتريات',
    WfPendUsrEn: 'Mohammed Ali',
    WfPendUsrAr: 'محمد علي',
    RfpStatus: 'A',
    SlaInd: 'Y',
    Sla: '5 Days',
    SlaAr: '٥ أيام'
  },
  {
    RfpName: 'Desalination Plant Maintenance',
    RfpNo: 'RFP-2025-002',
    RfpVersion: '2',
    PurchaseReqNo: 'PR-2025-1002',
    CreatedOn: '2025092500',
    SlaEndDate: '2025092800',
    SlaEndTime: '202509281145',
    DeptText: 'Engineering Department', // 'Operations',
    WfPendingDpt: 'Finance',
    WfPendingDptAr: 'المالية',
    WfPendUsrEn: 'Fatima Noor',
    WfPendUsrAr: 'فاطمة نور',
    RfpStatus: 'D',
    SlaInd: 'N',
    Sla: '3 Days',
    SlaAr: '٣ أيام'
  },
  {
    RfpName: 'Pipeline Inspection Drones',
    RfpNo: 'RFP-2025-003',
    RfpVersion: '1',
    PurchaseReqNo: 'PR-2025-1003',
    CreatedOn: '2025083000',
    SlaEndDate: '2025090100',
    SlaEndTime: '202509011600',
    DeptText:'Engineering Department', // 'Technology',
    WfPendingDpt: 'Quality Control',
    WfPendingDptAr: 'مراقبة الجودة',
    WfPendUsrEn: 'John Smith',
    WfPendUsrAr: 'جون سميث',
    RfpStatus: 'C',
    SlaInd: 'Y',
    Sla: '2 Days',
    SlaAr: '٢ أيام'
  },
  {
    RfpName: 'IT Infrastructure Upgrade',
    RfpNo: 'RFP-2025-004',
    RfpVersion: '3',
    PurchaseReqNo: 'PR-2025-1004',
    CreatedOn: '2025091000',
    SlaEndDate: '2025091400',
    SlaEndTime: '202509141200',
    DeptText: 'Engineering Department', //'IT Department',
    WfPendingDpt: 'HR',
    WfPendingDptAr: 'الموارد البشرية',
    WfPendUsrEn: 'Aisha Karim',
    WfPendUsrAr: 'عائشة كريم',
    RfpStatus: 'R',
    SlaInd: 'N',
    Sla: '4 Days',
    SlaAr: '٤ أيام'
  },
  {
    RfpName: 'Smart Meter Installation',
    RfpNo: 'RFP-2025-005',
    RfpVersion: '1',
    PurchaseReqNo: 'PR-2025-1005',
    CreatedOn: '2025071500',
    SlaEndDate: '2025071600',
    SlaEndTime: '202507160930',
    DeptText: 'Engineering Department', //'Customer Services',
    WfPendingDpt: 'Legal',
    WfPendingDptAr: 'القانونية',
    WfPendUsrEn: 'Khalid Hassan',
    WfPendUsrAr: 'خالد حسن',
    RfpStatus: 'S',
    SlaInd: 'Y',
    Sla: '1 Day',
    SlaAr: 'يوم واحد'
  }
];



this.rfpList = this.listArray;
// this.listOfDisplayData = this.listArray; // ensures table renders dummy rows

  this.calculateStats();
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
    this.barChartData.datasets[0].data = [this.totalProjects, this.approvedProjects, this.draftProjects, this.cancelledProjects, this.submittedProjects];
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
