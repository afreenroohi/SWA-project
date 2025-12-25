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
  isEndUser = false;
  isPRQualUser = false;
  username = '';

  // Dashboard Stats
  totalProjects = 0;
  approvedProjects = 0;
  draftProjects = 0;
  cancelledProjects = 0;
  submittedProjects = 0;

  // Chart Data
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Approved', 'Declined', 'Pending'],
    datasets: [{ 
      data: [0, 0, 0], 
      label: 'Total RFPs', 
      backgroundColor: ['#005c99', '#005c99', '#005c99'],
      borderRadius: 8,
      barThickness: 40
    }]
  };
  
  public departmentBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Procurement', 'Finance', 'Quality Control', 'HR', 'Legal'],
    datasets: [{ 
      data: [5, 3, 7, 2, 4], 
      label: 'Project Pending Department', 
      backgroundColor: ['#005c99', '#005c99', '#005c99', '#005c99', '#005c99'],
      borderRadius: 8,
      barThickness: 40
    }]
  };

  public regionBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Central', 'Eastern', 'Western', 'Northern'],
    datasets: [{ 
      data: [7, 3, 5, 2], 
      label: 'Qualifications by Region', 
      backgroundColor: ['#005c99', '#005c99', '#005c99', '#005c99'],
      borderRadius: 8,
      barThickness: 40
    }]
  };

  public committeeChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Technical Committee A', 'Technical Committee B', 'Technical Committee C', 'Technical Committee D'],
    datasets: [{
      data: [6, 4, 3, 4],
      backgroundColor: ['#005c99', '#0077c2', '#004a7a', '#003d66'],
      borderWidth: 2,
      borderColor: '#fff'
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
      pendingDept: new FormControl(''),
      rfpNumber: new FormControl(''),
      pendingUser: new FormControl(''),
      competition: new FormControl(''),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    const encodedUsername = localStorage.getItem('username');
    this.username = encodedUsername ? atob(encodedUsername) : '';
    console.log('Username:', this.username);
    
    this.isEndUser = this.username === 'ENDUSER' || this.username === 'SCMENDUSER';
    this.isPRQualUser = this.username === 'PRQUALUSER';
    
  this.rfp.setIsSearchRFPMenuActive(true);
  this.updateColumnList();
  
  if (this.isPRQualUser) {
    this.listArray = [
      { RequestID: 'REQ-001', QualificationCallName: 'Water Infrastructure Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee A', Region: 'Central', Activity: 'Water Treatment', RfpStatus: 'A' },
      { RequestID: 'REQ-002', QualificationCallName: 'IT Systems Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee B', Region: 'Eastern', Activity: 'IT Services', RfpStatus: 'S' },
      { RequestID: 'REQ-003', QualificationCallName: 'Construction Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee C', Region: 'Western', Activity: 'Building Construction', RfpStatus: 'D' },
      { RequestID: 'REQ-004', QualificationCallName: 'Maintenance Services Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee A', Region: 'Northern', Activity: 'Facility Maintenance', RfpStatus: 'A' },
      { RequestID: 'REQ-005', QualificationCallName: 'Security Systems Qualification', TechnicalEntity: 'Rehabilitation Department', QualificationCommittee: 'Technical Committee D', Region: 'Central', Activity: 'Security Services', RfpStatus: 'S' }
    ];
  }

  else {
    this.listArray = [
  { RfpName: 'Water Treatment Expansion', PurchaseReqNo: 'PR-2025-1001', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Water', SubActivity: 'Treatment', CoordinatorName: 'Ahmed Al-Rashid', CoordinatorContact: '+966-50-123-4567', AssignedTo: 'Mohammed Ali', RfpStatus: 'A', CreatedOn: '20250110', RfpNo: 'RFP-001', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Mohammed Ali' },
  { RfpName: 'Desalination Plant', PurchaseReqNo: 'PR-2025-1002', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Water', SubActivity: 'Desalination', CoordinatorName: 'Fatima Al-Zahrani', CoordinatorContact: '+966-50-234-5678', AssignedTo: 'Fatima Noor', RfpStatus: 'D', CreatedOn: '20250109', RfpNo: 'RFP-002', RfpVersion: '2', PendingDept: 'Finance', PendingUser: 'Fatima Noor' },
  { RfpName: 'Pipeline Inspection', PurchaseReqNo: 'PR-2025-1003', DeptText: 'IT Department', CompetitionType: 'Direct Purchase', Activity: 'Pipeline', SubActivity: 'Inspection', CoordinatorName: 'Khalid Al-Mutairi', CoordinatorContact: '+966-50-345-6789', AssignedTo: 'John Smith', RfpStatus: 'S', CreatedOn: '20250108', RfpNo: 'RFP-003', RfpVersion: '1', PendingDept: 'Quality Control', PendingUser: 'John Smith' },
  { RfpName: 'IT Infrastructure Upgrade', PurchaseReqNo: 'PR-2025-1004', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'IT Services', CoordinatorName: 'Omar Al-Qahtani', CoordinatorContact: '+966-50-456-7890', AssignedTo: 'Aisha Karim', RfpStatus: 'S', CreatedOn: '20250107', RfpNo: 'RFP-004', RfpVersion: '3', PendingDept: 'Quality Control', PendingUser: 'Aisha Karim' },
  { RfpName: 'Smart Meter Installation', PurchaseReqNo: 'PR-2025-1005', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Metering Systems', CoordinatorName: 'Sara Al-Dosari', CoordinatorContact: '+966-50-567-8901', AssignedTo: 'Khalid Hassan', RfpStatus: 'S', CreatedOn: '20250106', RfpNo: 'RFP-005', RfpVersion: '1', PendingDept: 'Quality Control', PendingUser: 'Khalid Hassan' },
  { RfpName: 'Network Security Enhancement', PurchaseReqNo: 'PR-2025-1006', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Cybersecurity', CoordinatorName: 'Abdullah Al-Harbi', CoordinatorContact: '+966-50-678-9012', AssignedTo: 'Sara Ahmed', RfpStatus: 'A', CreatedOn: '20250105', RfpNo: 'RFP-006', RfpVersion: '1', PendingDept: 'Quality Control', PendingUser: 'Sara Ahmed' },
  { RfpName: 'Cloud Migration Project', PurchaseReqNo: 'PR-2025-1007', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Cloud Services', CoordinatorName: 'Noura Al-Shammari', CoordinatorContact: '+966-50-789-0123', AssignedTo: 'Ali Hassan', RfpStatus: 'D', CreatedOn: '20250104', RfpNo: 'RFP-007', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Ali Hassan' },
  { RfpName: 'Data Center Modernization', PurchaseReqNo: 'PR-2025-1008', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'Infrastructure', CoordinatorName: 'Mansour Al-Ghamdi', CoordinatorContact: '+966-50-890-1234', AssignedTo: 'Omar Khalid', RfpStatus: 'S', CreatedOn: '20250103', RfpNo: 'RFP-008', RfpVersion: '2', PendingDept: 'Procurement', PendingUser: 'Omar Khalid' },
  { RfpName: 'Software Licensing Agreement', PurchaseReqNo: 'PR-2025-1009', DeptText: 'IT Department', CompetitionType: 'Direct Purchase', Activity: 'Software Procurement', CoordinatorName: 'Huda Al-Otaibi', CoordinatorContact: '+966-50-901-2345', AssignedTo: 'Noor Ali', RfpStatus: 'A', CreatedOn: '20250102', RfpNo: 'RFP-009', RfpVersion: '1', PendingDept: 'Legal', PendingUser: 'Noor Ali' },
  { RfpName: 'Hardware Procurement', PurchaseReqNo: 'PR-2025-1010', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Equipment Purchase', CoordinatorName: 'Tariq Al-Juhani', CoordinatorContact: '+966-50-012-3456', AssignedTo: 'Layla Ahmed', RfpStatus: 'A', CreatedOn: '20250101', RfpNo: 'RFP-010', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Layla Ahmed' },
  { RfpName: 'Employee Training Services', PurchaseReqNo: 'PR-2025-1011', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Training & Development', CoordinatorName: 'Reem Al-Malki', CoordinatorContact: '+966-50-123-4568', AssignedTo: 'Zain Malik', RfpStatus: 'A', CreatedOn: '20241230', RfpNo: 'RFP-011', RfpVersion: '1', PendingDept: 'HR', PendingUser: 'Zain Malik' },
  { RfpName: 'Consulting Services', PurchaseReqNo: 'PR-2025-1012', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'Financial Consulting', CoordinatorName: 'Faisal Al-Subaie', CoordinatorContact: '+966-50-234-5679', AssignedTo: 'Huda Youssef', RfpStatus: 'A', CreatedOn: '20241229', RfpNo: 'RFP-012', RfpVersion: '1', PendingDept: 'Finance', PendingUser: 'Huda Youssef' },
  { RfpName: 'Facility Management Services', PurchaseReqNo: 'PR-2025-1013', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Facility Services', CoordinatorName: 'Layla Al-Anazi', CoordinatorContact: '+966-50-345-6780', AssignedTo: 'Tariq Nasser', RfpStatus: 'A', CreatedOn: '20241228', RfpNo: 'RFP-013', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Tariq Nasser' },
  { RfpName: 'Equipment Maintenance Contract', PurchaseReqNo: 'PR-2025-1014', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Maintenance Services', CoordinatorName: 'Majed Al-Shahrani', CoordinatorContact: '+966-50-456-7891', AssignedTo: 'Reem Saleh', RfpStatus: 'A', CreatedOn: '20241227', RfpNo: 'RFP-014', RfpVersion: '1', PendingDept: 'Quality Control', PendingUser: 'Reem Saleh' },
  { RfpName: 'Vehicle Fleet Management', PurchaseReqNo: 'PR-2025-1015', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Fleet Services', CoordinatorName: 'Nasser Al-Balawi', CoordinatorContact: '+966-50-567-8902', AssignedTo: 'Yara Ibrahim', RfpStatus: 'A', CreatedOn: '20241226', RfpNo: 'RFP-015', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Yara Ibrahim' },
  { RfpName: 'Office Supplies Procurement', PurchaseReqNo: 'PR-2025-1016', DeptText: 'IT Department', CompetitionType: 'Direct Purchase', Activity: 'Office Supplies', CoordinatorName: 'Amal Al-Rasheed', CoordinatorContact: '+966-50-678-9013', AssignedTo: 'Karim Faisal', RfpStatus: 'D', CreatedOn: '20241225', RfpNo: 'RFP-016', RfpVersion: '1', PendingDept: 'Finance', PendingUser: 'Karim Faisal' },
  { RfpName: 'Marketing Campaign Services', PurchaseReqNo: 'PR-2025-1017', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Marketing Services', CoordinatorName: 'Yousef Al-Dossary', CoordinatorContact: '+966-50-789-0124', AssignedTo: 'Dina Rashid', RfpStatus: 'S', CreatedOn: '20241224', RfpNo: 'RFP-017', RfpVersion: '1', PendingDept: 'HR', PendingUser: 'Dina Rashid' },
  { RfpName: 'Legal Advisory Services', PurchaseReqNo: 'PR-2025-1018', DeptText: 'IT Department', CompetitionType: 'Framework Agreement', Activity: 'Legal Services', CoordinatorName: 'Maha Al-Saud', CoordinatorContact: '+966-50-890-1235', AssignedTo: 'Sami Adel', RfpStatus: 'A', CreatedOn: '20241223', RfpNo: 'RFP-018', RfpVersion: '1', PendingDept: 'Legal', PendingUser: 'Sami Adel' },
  { RfpName: 'Insurance Services Contract', PurchaseReqNo: 'PR-2025-1019', DeptText: 'IT Department', CompetitionType: 'General Competition', Activity: 'Insurance', CoordinatorName: 'Saleh Al-Tamimi', CoordinatorContact: '+966-50-901-2346', AssignedTo: 'Mona Samir', RfpStatus: 'D', CreatedOn: '20241222', RfpNo: 'RFP-019', RfpVersion: '1', PendingDept: 'Finance', PendingUser: 'Mona Samir' },
  { RfpName: 'Audit Services Agreement', PurchaseReqNo: 'PR-2025-1020', DeptText: 'IT Department', CompetitionType: 'Limited Competition', Activity: 'Audit & Compliance', CoordinatorName: 'Basma Al-Harthy', CoordinatorContact: '+966-50-012-3457', AssignedTo: 'Amr Tamer', RfpStatus: 'S', CreatedOn: '20241221', RfpNo: 'RFP-020', RfpVersion: '1', PendingDept: 'Finance', PendingUser: 'Amr Tamer' },
  { RfpName: 'Recruitment Services', PurchaseReqNo: 'PR-2025-1021', DeptText: 'IT Department', CompetitionType: 'Direct Purchase', Activity: 'Recruitment', CoordinatorName: 'Waleed Al-Zahrani', CoordinatorContact: '+966-50-123-4569', AssignedTo: 'Jana Walid', RfpStatus: 'A', CreatedOn: '20241220', RfpNo: 'RFP-021', RfpVersion: '1', PendingDept: 'HR', PendingUser: 'Jana Walid' },
  { RfpName: 'Payroll System Implementation', PurchaseReqNo: 'PR-2025-1022', DeptText: 'HR Department', CompetitionType: 'General Competition', Activity: 'HR Systems', CoordinatorName: 'Nadia Al-Mutlaq', CoordinatorContact: '+966-50-234-5680', AssignedTo: 'Basem Fouad', RfpStatus: 'D', CreatedOn: '20241219', RfpNo: 'RFP-022', RfpVersion: '1', PendingDept: 'HR', PendingUser: 'Basem Fouad' },
  { RfpName: 'Security Services Contract', PurchaseReqNo: 'PR-2025-1023', DeptText: 'PMO Department', CompetitionType: 'Framework Agreement', Activity: 'Security Services', CoordinatorName: 'Ibrahim Al-Shehri', CoordinatorContact: '+966-50-345-6781', AssignedTo: 'Lina Majed', RfpStatus: 'S', CreatedOn: '20241218', RfpNo: 'RFP-023', RfpVersion: '1', PendingDept: 'Legal', PendingUser: 'Lina Majed' },
  { RfpName: 'Cleaning Services Agreement', PurchaseReqNo: 'PR-2025-1024', DeptText: 'Operations Department', CompetitionType: 'Limited Competition', Activity: 'Cleaning Services', CoordinatorName: 'Jamal Al-Otaibi', CoordinatorContact: '+966-50-456-7892', AssignedTo: 'Fadi Nabil', RfpStatus: 'A', CreatedOn: '20241217', RfpNo: 'RFP-024', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Fadi Nabil' },
  { RfpName: 'Catering Services Contract', PurchaseReqNo: 'PR-2025-1025', DeptText: 'Administration Department', CompetitionType: 'General Competition', Activity: 'Catering Services', CoordinatorName: 'Samira Al-Qahtani', CoordinatorContact: '+966-50-567-8903', AssignedTo: 'Rana Hisham', RfpStatus: 'D', CreatedOn: '20241216', RfpNo: 'RFP-025', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Rana Hisham' },
  { RfpName: 'Transportation Services', PurchaseReqNo: 'PR-2025-1026', DeptText: 'Operations Department', CompetitionType: 'Framework Agreement', Activity: 'Transportation', CoordinatorName: 'Fahad Al-Harbi', CoordinatorContact: '+966-50-678-9014', AssignedTo: 'Nabil Sherif', RfpStatus: 'S', CreatedOn: '20241215', RfpNo: 'RFP-026', RfpVersion: '1', PendingDept: 'Legal', PendingUser: 'Nabil Sherif' },
  { RfpName: 'Printing Services Contract', PurchaseReqNo: 'PR-2025-1027', DeptText: 'Administration Department', CompetitionType: 'Direct Purchase', Activity: 'Printing Services', CoordinatorName: 'Lina Al-Dosari', CoordinatorContact: '+966-50-789-0125', AssignedTo: 'Salma Essam', RfpStatus: 'A', CreatedOn: '20241214', RfpNo: 'RFP-027', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Salma Essam' },
  { RfpName: 'Event Management Services', PurchaseReqNo: 'PR-2025-1028', DeptText: 'Marketing Department', CompetitionType: 'Limited Competition', Activity: 'Event Management', CoordinatorName: 'Adel Al-Ghamdi', CoordinatorContact: '+966-50-890-1236', AssignedTo: 'Marwan Gamal', RfpStatus: 'D', CreatedOn: '20241213', RfpNo: 'RFP-028', RfpVersion: '1', PendingDept: 'Finance', PendingUser: 'Marwan Gamal' },
  { RfpName: 'Waste Management Services', PurchaseReqNo: 'PR-2025-1029', DeptText: 'Operations Department', CompetitionType: 'General Competition', Activity: 'Waste Management', CoordinatorName: 'Rana Al-Shammari', CoordinatorContact: '+966-50-901-2347', AssignedTo: 'Ghada Tarek', RfpStatus: 'S', CreatedOn: '20241212', RfpNo: 'RFP-029', RfpVersion: '1', PendingDept: 'Quality Control', PendingUser: 'Ghada Tarek' },
  { RfpName: 'Energy Management System', PurchaseReqNo: 'PR-2025-1030', DeptText: 'Engineering Department', CompetitionType: 'Framework Agreement', Activity: 'Energy Services', CoordinatorName: 'Hassan Al-Juhani', CoordinatorContact: '+966-50-012-3458', AssignedTo: 'Hazem Ashraf', RfpStatus: 'A', CreatedOn: '20241211', RfpNo: 'RFP-030', RfpVersion: '1', PendingDept: 'Procurement', PendingUser: 'Hazem Ashraf' }
  ];

    // Populate Arabic fields
    const deptMap: { [key: string]: string } = {
      'IT Department': 'قسم تقنية المعلومات',
      'PMO Department': 'قسم مكتب إدارة المشاريع',
      'Engineering Department': 'القسم الهندسي',
      'HR Department': 'قسم الموارد البشرية',
      'Operations Department': 'قسم العمليات',
      'Administration Department': 'قسم الإدارة',
      'Marketing Department': 'قسم التسويق',
      'Finance Department': 'القسم المالي'
    };
    
    const pendingDeptMap: { [key: string]: string } = {
      'Procurement': 'المشتريات',
      'Finance': 'المالية',
      'Quality Control': 'مراقبة الجودة',
      'Legal': 'الإدارة القانونية',
      'HR': 'الموارد البشرية'
    };

    const projectNameMap: { [key: string]: string } = {
      'Water Treatment Expansion': 'توسعة معالجة المياه',
      'Desalination Plant': 'محطة تحلية المياه',
      'Pipeline Inspection': 'فحص خطوط الأنابيب',
      'IT Infrastructure Upgrade': 'ترقية البنية التحتية لتقنية المعلومات',
      'Smart Meter Installation': 'تركيب العدادات الذكية',
      'Network Security Enhancement': 'تعزيز أمان الشبكة',
      'Cloud Migration Project': 'مشروع الترحيل السحابي',
      'Data Center Modernization': 'تحديث مراكز البيانات',
      'Software Licensing Agreement': 'اتفاقية ترخيص البرمجيات',
      'Hardware Procurement': 'شراء الأجهزة',
      'Employee Training Services': 'خدمات تدريب الموظفين',
      'Consulting Services': 'خدمات استشارية',
      'Facility Management Services': 'خدمات إدارة المرافق',
      'Equipment Maintenance Contract': 'عقد صيانة المعدات',
      'Vehicle Fleet Management': 'إدارة أسطول المركبات',
      'Office Supplies Procurement': 'شراء اللوازم المكتبية',
      'Marketing Campaign Services': 'خدمات الحملات التسويقية',
      'Legal Advisory Services': 'الخدمات الاستشارية القانونية',
      'Insurance Services Contract': 'عقد خدمات التأمين',
      'Audit Services Agreement': 'اتفاقية خدمات التدقيق',
      'Recruitment Services': 'خدمات التوظيف',
      'Payroll System Implementation': 'تطبيق نظام الرواتب',
      'Security Services Contract': 'عقد الخدمات الأمنية',
      'Cleaning Services Agreement': 'اتفاقية خدمات التنظيف',
      'Catering Services Contract': 'عقد خدمات تقديم الطعام',
      'Transportation Services': 'خدمات النقل',
      'Printing Services Contract': 'عقد خدمات الطباعة',
      'Event Management Services': 'خدمات إدارة الفعاليات',
      'Waste Management Services': 'خدمات إدارة النفايات',
      'Energy Management System': 'نظام إدارة الطاقة'
    };

    const userMap: { [key: string]: string } = {
      'Mohammed Ali': 'محمد علي',
      'Fatima Noor': 'فاطمة نور',
      'John Smith': 'جون سميث',
      'Aisha Karim': 'عائشة كريم',
      'Khalid Hassan': 'خالد حسن',
      'Sara Ahmed': 'سارة أحمد',
      'Ali Hassan': 'علي حسن',
      'Omar Khalid': 'عمر خالد',
      'Noor Ali': 'نور علي',
      'Layla Ahmed': 'ليلى أحمد',
      'Zain Malik': 'زين مالك',
      'Huda Youssef': 'هدى يوسف',
      'Tariq Nasser': 'طارق ناصر',
      'Reem Saleh': 'ريم صالح',
      'Yara Ibrahim': 'يارا إبراهيم',
      'Karim Faisal': 'كريم فيصل',
      'Dina Rashid': 'دينا رشيد',
      'Sami Adel': 'سامي عادل',
      'Mona Samir': 'منى سمير',
      'Amr Tamer': 'عمرو تامر',
      'Jana Walid': 'جنا وليد',
      'Basem Fouad': 'باسم فؤاد',
      'Lina Majed': 'لينا ماجد',
      'Fadi Nabil': 'فادي نبيل',
      'Rana Hisham': 'رنا هشام',
      'Nabil Sherif': 'نبيل شريف',
      'Salma Essam': 'سلمى عصام',
      'Marwan Gamal': 'مروان جمال',
      'Ghada Tarek': 'غادة طارق',
      'Hazem Ashraf': 'حازم أشرف'
    };

    this.listArray = this.listArray.map((item: any) => ({
      ...item,
      DeptTextAr: deptMap[item.DeptText] || item.DeptText,
      PendingDeptAr: pendingDeptMap[item.PendingDept] || item.PendingDept,
      RfpNameAr: projectNameMap[item.RfpName] || item.RfpName,
      PendingUserAr: userMap[item.PendingUser] || item.PendingUser
    }));
  }

  // Sort listArray to prioritize IT Department
  // Sort listArray based on user priority
  console.log('Current Username:', this.username);
  let priorityDepartment = '';
  const cleanUsername = this.username ? this.username.trim() : '';
  
  if (cleanUsername === 'IT1') {
    priorityDepartment = 'IT Department';
  } else if (cleanUsername === 'PMO1') {
    priorityDepartment = 'PMO Department';
  }
  
  console.log('Priority Department:', priorityDepartment);

  if (priorityDepartment) {
    this.listArray.sort((a: any, b: any) => {
      const deptA = (a.DeptText || a.TechnicalEntity || '').trim();
      const deptB = (b.DeptText || b.TechnicalEntity || '').trim();
      
      if (deptA === priorityDepartment && deptB !== priorityDepartment) {
        return -1;
      }
      if (deptA !== priorityDepartment && deptB === priorityDepartment) {
        return 1;
      }
      return 0;
    });
    console.log('Sorted listArray:', this.listArray.map((i: any) => i.DeptText || i.TechnicalEntity));
  }



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
    this.departmentList = this.listArray;
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
    
    this.barChartData.datasets[0].data = [this.approvedProjects, this.submittedProjects, this.draftProjects];
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
    if (this.isPRQualUser) {
      this.listOfColumnList = listOfColumnPRQUALUSER;
    } else if (this.isEndUser) {
      this.listOfColumnList = [
        { id: 1, title: 'Project Name', titleAr: 'اسم المشروع' },
        { id: 2, title: 'RFP Number', titleAr: 'رقم RFP' },
        { id: 3, title: 'RFP Version', titleAr: 'إصدار RFP' },
        { id: 4, title: 'PR Number', titleAr: 'رقم طلب الشراء' },
        { id: 5, title: 'Created On', titleAr: 'تاريخ الإنشاء' },
        { id: 6, title: 'Req. Dept', titleAr: 'قسم الطلب', 
          filterMultiple: true,
          listOfFilter: [
            { text: 'IT Department', value: 'IT Department' },
            { text: 'PMO Department', value: 'PMO Department' }
          ],
          listOfFilterAr: [
            { text: 'قسم تقنية المعلومات', value: 'IT Department' },
            { text: 'قسم مكتب إدارة المشاريع', value: 'PMO Department' }
          ],
          filterFn: (list: string[], item: any) => list.some(name => item.DeptText.indexOf(name) !== -1)
        } as any,
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
