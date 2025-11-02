import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ActiveElement, ChartEvent, Chart } from 'chart.js';
import { ChartData, CardData, CardList, FilterSet, CardItem, CardTitle, TableTitle, TableColumn, 
  TableItem, MultiLang, PAGE_SIZE, TableApiResponse, Vendor, Dropdown, 
  SearchPlaceholder, TableFilterSort, TableFilter, TableSort,
  RfpUser,
  RfpDepartment,
  TableFilterSet,
  ProjectType,
  StatusType,
  Role
} from './dashboard.model';
import { IconList } from 'src/app/components/icon/icon.component';
import { DashboardService } from './dashboard.service';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, takeUntil, take, skip, catchError } from 'rxjs/operators';
import { forkJoin, Subject, of, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgModel } from '@angular/forms';
import { ExcelService } from 'src/app/service/excel.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VendorPopupComponent } from './components/vendor-popup/vendor-popup.component';
import { NzTableFilterList } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  readonly iconList = IconList;
  readonly cardTitles = CardTitle;
  readonly tableTitles = TableTitle;
  readonly searchPlaceholders = SearchPlaceholder;
  private readonly destroy$ = new Subject<void>();
  private readonly pageSize = PAGE_SIZE;

  @ViewChild('selectedYearModel') yearModel!: NgModel;
  selectedYear: string = '';
  years: string[] = [];

  loadedCards: boolean = true;
  loadedCharts: boolean = true;
  loadedFilters: boolean = true;

  cardList: CardList = {
    TotRfpPrCard: false,
    TotTndrCard: false,
    TotContCard: false,
    TotContPreAprCard: false,
    TotCocCard: false,
    TotRfpByDpt: false,
    TotRfpByMonth: false,
    TotTndrByMonth: false,
    TotTndrByCmt: false,
    TopVndrs: false,
    TotContByMonth: false,
    TotAmtByMonth: false
  }

  cardsData: CardData = {
    TotalRfpCount: '',
    TotalPrCount: '',
    TotalTndrCount: '',
    TotalContSapCount: '',
    TotalContP2pCount: '',
    TotalContaprP2pCount: '',
    TotalCocCount: ''
  };

  tenderByCommitteeApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  tenderByCommitteeChartData: ChartConfiguration<'pie'>['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "rgba(41, 182, 246, 1)", 
        "rgba(76, 175, 80, 1)", 
        "rgba(255, 183, 77, 1)", 
        "rgba(157, 196, 94, 1)",
        "rgba(193, 84, 105, 1)", 
        "rgba(149, 117, 205, 1)",
      ],
      borderColor: [
        "rgba(41, 182, 246, 1)", 
        "rgba(76, 175, 80, 1)", 
        "rgba(255, 183, 77, 1)", 
        "rgba(157, 196, 94, 1)",
        "rgba(193, 84, 105, 1)", 
        "rgba(149, 117, 205, 1)",
      ],
      hoverBackgroundColor: [
        "rgba(41, 182, 246, 1)", 
        "rgba(76, 175, 80, 1)", 
        "rgba(255, 183, 77, 1)", 
        "rgba(157, 196, 94, 1)",
        "rgba(193, 84, 105, 1)", 
        "rgba(149, 117, 205, 1)",
      ],
      hoverBorderColor: [
        "rgba(41, 182, 246, 1)", 
        "rgba(76, 175, 80, 1)", 
        "rgba(255, 183, 77, 1)", 
        "rgba(157, 196, 94, 1)",
        "rgba(193, 84, 105, 1)", 
        "rgba(149, 117, 205, 1)",
      ],
      borderWidth: 2.5
    }
  ]
};


  rfpByMonthsApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  rfpByMonthsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'RFPs',
        data: [],
        fill: true,
        pointBackgroundColor: 'rgba(25, 118, 210, 1)',
        borderColor: 'rgba(25, 118, 210, 1)',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        tension: 0.4
      }
    ]
  }

  tenderByMonthsApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  tenderByMonthsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Tenders',
        data: [],
        fill: true,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.4
      }
    ]
  }

  contractByMonthsApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  contractByMonthsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Contracts',
        data: [],
        fill: true,
        pointBackgroundColor: 'rgba(144, 108, 166, 1)',
        borderColor: 'rgba(144, 108, 166, 1)',
        backgroundColor: 'rgba(144, 108, 166, 0.2)',
        tension: 0.4
      }
    ]
  }

  spendAnalysisByMonthsApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  spendAnalysisByMonthsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Amount',
        data: [],
        fill: true,
        pointBackgroundColor: 'rgba(255, 183, 77, 1)',
        borderColor: 'rgba(255, 183, 77, 1)',
        backgroundColor: 'rgba(255, 183, 77, 0.2)',
        tension: 0.4
      }
    ]
  }

  rfpByOrgUnitApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  rfpByOrgUnitChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], 
    datasets: [
      {
        label: 'RFPs',
        data: [],
        indexAxis: 'y',
        borderWidth: 2.5,
        backgroundColor: 'rgba(76, 175, 80, 1)',
        borderColor: 'rgba(76, 175, 80, 1)',  
      }
    ]
  }

  topVendorsApiData: ChartData = {
    xAxis: {
      en: '',
      ar: ''
    },
    xValues: [],
    yAxis: {
      en: '',
      ar: ''
    },
    yValues: []
  };
  topVendorsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Amount',
        data: [],
        indexAxis: 'y',
        borderWidth:2.5,
        backgroundColor: 'rgba(76, 175, 80, 1)',
        borderColor: 'rgba(76, 175, 80, 1)',  
      }
    ]
  }
  topVendorsIds: string[] = [];

  topVendorsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
      if (!elements.length || elements[0].index === undefined) return;
      this.renderVendorPopup(this.topVendorsIds[elements[0].index] ?? '')
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom', 
      },
    },
  };

  top5Items: CardItem[] = [];

  purchaseTypes: Dropdown[] = [
    { value: 'R', label: { en: 'RFP Tendering', ar: 'مناقصة طلب عرض' }}, 
    { value: 'D', label: { en: 'Direct Purchase', ar: 'شراء مباشر' }}
  ];

  tenderTypes: Dropdown[] = [
    { value: '01', label: { en: 'One Envelope', ar: 'مظروف واحد' }}, 
    { value: '02', label: { en: 'Two Envelope', ar: 'مظروفين' }}
  ];

  rfpFilterSet: FilterSet[] = [
    { lableName:'Dashboard.Purchase Document Type', width: '10rem', dropDown:[
      { value: 'ZSR', label: { en: 'Service', ar: 'خدمة' }}, 
      { value: 'ZDD', label: { en: 'Direct Purchase', ar: 'شراء مباشر' }}
    ]},
    { lableName:'Dashboard.RFP Type', width: '10rem', dropDown:[
      { value: 'X', label: { en: 'Technical RFP', ar: 'طلب عرض فني' }}, 
      { value: 'N', label: { en: 'Non-Technical RFP', ar: 'طلب عرض غير فني' }}
    ]}
  ]

  rfpByDeptFilterSet: FilterSet[] = [
    ...this.rfpFilterSet,
    { lableName: 'Dashboard.Department', width: '15rem', dropDown: []}
  ]
  
  tenderFilterSet: FilterSet[] = [
    { lableName:'Dashboard.Purchase Type', width: '10rem', dropDown:[
      ...this.purchaseTypes
    ]},
    { lableName:'Dashboard.Tender Type', width: '10rem', dropDown:[
      ...this.tenderTypes
    ]},
    { lableName:'Dashboard.Purchase Method', width: '10rem', dropDown:[
      { value: '01', label: { en: 'Limited', ar: 'محدودة' }}, 
      { value: '02', label: { en: 'Public', ar: 'عامة' }}, 
      { value: '03', label: { en: 'Framework Agreement', ar: 'اتفاقية إطارية' }}
    ]}
  ]
  
  contractFilterSet: FilterSet[] = [
    { lableName:'Dashboard.Contract Status', width: '10rem', dropDown:[
      { value: '', label: { en: 'Agreement', ar: 'اتفاق' }}, 
      { value: 'C', label: { en: 'Created', ar: 'تم الإنشاء' }}, 
      { value: 'E', label: { en: 'Expired', ar: 'منتهي' }}
    ]}
  ]

  spendAnalysisFilterSet: FilterSet[] = [
    { lableName:'Dashboard.Vendor', width: '30rem', dropDown:[]}
  ]

  filterKeys: { [key: string]: string } = {
    'Dashboard.Purchase Document Type': 'DocTypeId',
    'Dashboard.RFP Type': 'TechRfp',
    'Dashboard.Purchase Type': 'PurTypId',
    'Dashboard.Tender Type': 'TndrTypeId',
    'Dashboard.Purchase Method': 'CompetitionTypeId',
    'Dashboard.Contract Status': 'ValidityYear',
    'Dashboard.Vendor': 'VendorId',
    'Dashboard.Department': 'DeptId',
    'createdBy': 'CreatedBy',
    'createdOn': 'CreatedOn',
    'pendingWithDept': 'CwfDept',
    'openingDate': 'OpeningDate',
    'targetValue': 'TargetVal',
    'valStartDate': 'ValidityStartDt',
    'valEndDate': 'ValidityEndDt',
    'typeofTender': 'PurchaseTypeId',
    'tenderType': 'TndrTypeId',
    'pendingWithCommittee': 'PendingWithCommittee',
    'contractAmount': 'TotalValue',
    'projectType': 'ProjType',
    'cocAmount': 'CocAmount',
    'status': 'Status',
    'pendingWithRole': 'PendingWithRole'
  }

  viewTableDetailsToggle: boolean = false;
  currentTableProcess: string = 'Rfp';
  tableTitle: string = this.tableTitles.rfp;
  tableColumns: TableColumn[] = [];
  tableData: TableItem[] = [];
  isLoading: boolean = false;
  totalItems: number = 0;
  searchPlaceholder: string = this.searchPlaceholders.rfp;
  pageIndex: number = 1;
  searchValue: string = '';
  filterValue: string = '';
  sortValue: string = '';
  rfpUsers: RfpUser[] = [];
  rfpDepartments: RfpDepartment[] = [];
  committeeList: Dropdown[] = [];
  contractStatusList: Dropdown[] = [];
  projectTypes: ProjectType[] = [];
  pendingWithRoles: Role[] = [];
  statusTypes: StatusType[] = [];
  

  rfpColumns: TableColumn[] = [
    { title: 'Dashboard.Project Name', compare: null, priority: 1, key: 'projectName', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.RFP Number', compare: null, priority: 2, key: 'rfpNumber', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.PR Number', compare: null, priority: 3, key: 'prNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Department', compare: null, priority: 6, key: 'department', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Created By', compare: null, priority: 4, key: 'createdBy', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Created On', compare: null, priority: 5, key: 'createdOn', type: 'date', width: '158px', sort: true },
    { title: 'Dashboard.Pending with User', compare: null, priority: 7, key: 'pendingWithUser', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with Department', compare: null, priority: 8, key: 'pendingWithDept', type: 'text', width: '158px', sort: false }
  ];

  tenderColumns: TableColumn[] = [
    { title: 'Dashboard.Project Name', compare: null, priority: 1, key: 'projectName', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.Tender ID', compare: null, priority: 2, key: 'tenderId', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.RFP Number', compare: null, priority: 3, key: 'rfpNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.PR Number', compare: null, priority: 4, key: 'prNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Purchase Type', compare: null, priority: 6, key: 'typeofTender', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Type of Tender', compare: null, priority: 10, key: 'tenderType', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Competition Type', compare: null, priority: 11, key: 'competitionType', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Opening Date', compare: null, priority: 5, key: 'openingDate', type: 'date', width: '158px', sort: true },
    { title: 'Dashboard.Status', compare: null, priority: 7, key: 'status', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with Committee', compare: null, priority: 8, key: 'pendingWithCommittee', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with User', compare: null, priority: 9, key: 'pendingWithUser', type: 'text', width: '158px', sort: false }
  ];

  contractColumns: TableColumn[] = [
    { title: 'Dashboard.Contract Name', compare: null, priority: 1, key: 'contractName', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.Contract Number', compare: null, priority: 2, key: 'contractNumber', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.PR Number', compare: null, priority: 3, key: 'prNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Contract Amount', compare: null, priority: 4, key: 'contractAmount', type: 'number', width: '158px', sort: true },
    { title: 'Dashboard.Vendor Name', compare: null, priority: 5, key: 'vendorName', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Project Type', compare: null, priority: 6, key: 'projectType', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with User', compare: null, priority: 7, key: 'pendingWithUser', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with Role', compare: null, priority: 8, key: 'pendingWithRole', type:  'text', width: '158px', sort: false },
    { title: 'Dashboard.Status', compare: null, priority: 9, key: 'status', type: 'text', width: '158px', sort: false }
  ];

  contractSAPColumns: TableColumn[] = [
    { title: 'Dashboard.Contract Number', compare: null, priority: 1, key: 'contractNumber', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.Vendor Name', compare: null, priority: 3, key: 'vendorName', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.PR Number', compare: null, priority: 4, key: 'prNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Target Value', compare: null, priority: 2, key: 'targetValue', type: 'number', width: '158px', sort: true },
    { title: 'Dashboard.Created On', compare: null, priority: 5, key: 'createdOn', type: 'date', width: '158px', sort: true },
    { title: 'Dashboard.Validity Start Date', compare: null, priority: 6, key: 'valStartDate', type: 'date', width: '158px', sort: true },
    { title: 'Dashboard.Validity End Date', compare: null, priority: 7, key: 'valEndDate', type: 'date', width: '158px', sort: true }
  ]

  cocColumns: TableColumn[] = [
    { title: 'Dashboard.Phase Name', compare: null, priority: 1, key: 'phaseName', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.COC Number', compare: null, priority: 2, key: 'cocNumber', type: 'text', width: '158px', fixed: true, sort: false },
    { title: 'Dashboard.PO Number', compare: null, priority: 3, key: 'poNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.SES Number', compare: null, priority: 4, key: 'sesNumber', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.COC Amount', compare: null, priority: 5, key: 'cocAmount', type: 'number', width: '158px', sort: true },
    { title: 'Dashboard.Created On', compare: null, priority: 6, key: 'createdOn', type: 'date', width: '158px', sort: true },
    { title: 'Dashboard.Status', compare: null, priority: 7, key: 'status', type: 'text', width: '158px', sort: false },
    { title: 'Dashboard.Pending with User', compare: null, priority: 8, key: 'pendingWithUser', type: 'text', width: '158px', sort: false }
  ];
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  constructor(
    private dashboardService: DashboardService, 
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private excel: ExcelService,
    private modal: NzModalService
  ) {
    this.populateYears();
  }

  ngOnInit(): void { 
    this.getCardVisibility();
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.setChartData();
      this.rfpColumns[4].filter = this.convertToTableFilterSet(this.rfpUsers);
      this.rfpColumns[7].filter = this.convertToTableFilterSet(this.rfpDepartments);
      this.tenderColumns[4].filter = this.convertToTableFilterSet(this.purchaseTypes);
      this.tenderColumns[5].filter = this.convertToTableFilterSet(this.tenderTypes);
      this.tenderColumns[9].filter = this.convertToTableFilterSet(this.committeeList);
      this.contractColumns[5].filter = this.convertToTableFilterSet(this.projectTypes);
      this.contractColumns[7].filter = this.convertToTableFilterSet(this.pendingWithRoles);
      this.contractColumns[8].filter = this.convertToTableFilterSet(this.statusTypes);
      this.cocColumns[6].filter = this.convertToTableFilterSet(this.contractStatusList);
    })
  }

  ngAfterViewInit(): void {
    this.yearModel.valueChanges?.pipe(skip(1),takeUntil(this.destroy$)).subscribe((year) => {
      this.selectedYear = year;
      if (this.loadedCards && this.loadedCharts && this.loadedFilters) {

        if (this.showCards) {
          this.loadCardsData();
        }
  
        if (this.showCharts) {
          this.loadChartsData();
        }

      }
    })
  }

  get showCards(): boolean {
    return this.cardList && Object.entries(this.cardList).some(
      ([key, value]) => key.includes('Card') && !!value
    );
  }

  get showCharts(): boolean {
    return this.cardList && Object.entries(this.cardList).some(
      ([key, value]) => !key.includes('Card') && !!value
    );
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 2021 + 1 }, (_, i) => (currentYear - i).toString());
    this.selectedYear = this.years[0];
  }

  buildFilterString(filter: { [key: string]: any }): string {
    return filter ? Object.entries(filter)
      .map(([key, value]) => `${this.filterKeys[key]} eq '${value}'`)
      .join(' and ') : '';
  }

  processChartData(apiData: ChartData): { labels: string[], data: number[], label: string } {
    const lang = this.commonService.userLanguage as keyof MultiLang;
    return {
      labels: apiData.xValues.map(val => val[lang]),
      data: apiData.yValues.map(val => Number(val[lang])),
      label: apiData.yAxis[lang],
    };
  }

  rfpByMonthFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter)
    this.spinner.show();
    this.dashboardService.getChartData('TotRfpByMonth', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.rfpByMonthsApiData = {...res};
      const processedData = this.processChartData(this.rfpByMonthsApiData)
      this.rfpByMonthsChartData = {
        ...this.rfpByMonthsChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.rfpByMonthsChartData.datasets[0].label = processedData.label;
      this.rfpByMonthsChartData.datasets[0].data = [...processedData.data];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  rfpByOrgUnitFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter);
    this.spinner.show();
    this.dashboardService.getChartData('TotRfpByDpt', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.rfpByOrgUnitApiData = {...res};
      const processedData = this.processChartData(this.rfpByOrgUnitApiData)
      this.rfpByOrgUnitChartData = {
        ...this.rfpByOrgUnitChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.rfpByOrgUnitChartData.datasets[0].label = processedData.label;
      this.rfpByOrgUnitChartData.datasets[0].data = [...processedData.data];
      this.rfpByDeptFilterSet[2].dropDown = [
        ...this.rfpByOrgUnitApiData.xValues.map((value: MultiLang, index: number): Dropdown => {
          return {
            value: this.rfpByOrgUnitApiData.xIds?.[index] ?? '',
            label: value
          }
        })
      ];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  tenderByMonthFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter)
    this.spinner.show();
    this.dashboardService.getChartData('TotTndrByMonth', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.tenderByMonthsApiData = {...res};
      const processedData = this.processChartData(this.tenderByMonthsApiData)
      this.tenderByMonthsChartData = {
        ...this.tenderByMonthsChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.tenderByMonthsChartData.datasets[0].label = processedData.label;
      this.tenderByMonthsChartData.datasets[0].data = [...processedData.data];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  tenderByCommitteeFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter)
    this.spinner.show();
    this.dashboardService.getChartData('TotTndrByCmt', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.tenderByCommitteeApiData = {...res};
      const processedData = this.processChartData(this.tenderByCommitteeApiData)
      this.tenderByCommitteeChartData = {
        ...this.tenderByCommitteeChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.tenderByCommitteeChartData.datasets[0].label = processedData.label;
      this.tenderByCommitteeChartData.datasets[0].data = [...processedData.data];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  contractByMonthFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter)
    this.spinner.show();
    this.dashboardService.getChartData('TotContByMonth', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.contractByMonthsApiData = {...res};
      const processedData = this.processChartData(this.contractByMonthsApiData)
      this.contractByMonthsChartData = {
        ...this.contractByMonthsChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.contractByMonthsChartData.datasets[0].label = processedData.label;
      this.contractByMonthsChartData.datasets[0].data = [...processedData.data];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  spendAnalysisFilter(filter: { [key: string]: any }) {
    const filterString = this.buildFilterString(filter)
    this.spinner.show();
    this.dashboardService.getChartData('TotAmtByMonth', this.selectedYear, filterString).subscribe((res: ChartData) => {
      this.spendAnalysisByMonthsApiData = {...res};
      const processedData = this.processChartData(this.spendAnalysisByMonthsApiData)
      this.spendAnalysisByMonthsChartData = {
        ...this.spendAnalysisByMonthsChartData,
        labels: [
          ...processedData.labels
        ],
      }
      this.spendAnalysisByMonthsChartData.datasets[0].label = processedData.label;
      this.spendAnalysisByMonthsChartData.datasets[0].data = [...processedData.data];
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText);
    })
  }

  checkAllLoaded(): void {
    if (this.loadedCharts && this.loadedCards && this.loadedFilters) {
      this.spinner.hide();
    }
  }

  renderVendorPopup(vendorID: string) {
    this.modal.create({
      nzContent: VendorPopupComponent,
      nzComponentParams: {
        vendorID: vendorID,
        year: this.selectedYear
      },
      nzFooter: null,
      nzWidth: 1000,
      nzBodyStyle: { minHeight: `610px` },
    });
  }

  convertToTableFilterSet(filterSet: TableFilterSet[]): NzTableFilterList {
    return filterSet.map((filter: TableFilterSet) => {
      if ('userName' in filter && 'userName_ar' in filter && 'uname' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.userName : filter.userName_ar,
          value: filter.uname
        }
      }
      if ('RfpWfDept' in filter && 'RfpWfDeptEn' in filter && 'RfpWfDeptAr' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.RfpWfDeptEn : filter.RfpWfDeptAr,
          value: filter.RfpWfDept
        }
      }
      if ('value' in filter && 'label' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.label.en : filter.label.ar,
          value: filter.value
        }
      }
      if ('PrjTypeID' in filter && 'PrjTypeDescEN' in filter && 'PrjTypeDescAR' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.PrjTypeDescEN : filter.PrjTypeDescAR,
          value: filter.PrjTypeID
        }
      }
      if ('StatusID' in filter && 'StatusDescEN' in filter && 'StatusDescAR' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.StatusDescEN : filter.StatusDescAR,
          value: filter.StatusID
        }
      }
      if ('RoleID' in filter && 'RoleDescEN' in filter && 'RoleDescAR' in filter) {
        return {
          text: this.commonService.userLanguage === 'en' ? filter.RoleDescEN : filter.RoleDescAR,
          value: filter.RoleID
        }
      }
      return {
        text: '',
        value: ''
      }
    })
  }

  getCardVisibility() {
    this.spinner.show();
    this.dashboardService.getCardVisibility(this.selectedYear).subscribe((res: any) => {
      this.spinner.hide();
      const { Lgdinusr, MessageId, MessageEn, MessageAr, Year, ...cardList } = res;
      this.cardList = this.dashboardService.convertCardVisibilityToBoolean(cardList);

      if (this.showCards) {
        this.loadCardsData();
      }

      if (this.showCharts) {
        this.loadChartsData();
      }

      if (!this.showCards && !this.showCharts) {
        this.spinner.hide();
      }

    }, (err: any) => {
      this.spinner.hide();
      this.commonService.createMessage('error', err.statusText)
    });
  }

  loadCardsData() {
    this.spinner.show();
    this.loadedCards = false;
    this.dashboardService.getCardsData(this.selectedYear, this.cardList).subscribe((res: CardData) => {
      this.cardsData = {...res};
      this.loadedCards = true;
      this.checkAllLoaded();
    }, (err: any) => {
      this.loadedCards = true;
      this.checkAllLoaded();
      this.commonService.createMessage('error', err.statusText)
    });
    this.getFilterSet();
  }

  getFilterSet() {
    this.spinner.show();
    const filterSetRequest: Observable<{ key: string, data: TableFilterSet[] }>[] = [];
    if (this.cardList.TotRfpPrCard) {
      const key = 'createdBy';
      filterSetRequest.push(
        this.dashboardService.getRfpCreatorList().pipe(
          take(1),
          map((res: RfpUser[]) => {
            return {
              key,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key}: ${err.statusText}`);
            return of({ key, data: [] });
          })
        )
      ); 
      const key2 = 'pendingWithDept';
      filterSetRequest.push(
        this.dashboardService.getRfpDepartmentList().pipe(
          take(1),
          map((res: RfpDepartment[]) => {
            return {
              key: key2,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key2}: ${err.statusText}`);
            return of({ key: key2, data: [] });
          })
        )
      )
    }

    if (this.cardList.TotTndrCard) {
      this.tenderColumns[4].filter = this.convertToTableFilterSet(this.purchaseTypes);
      this.tenderColumns[5].filter = this.convertToTableFilterSet(this.tenderTypes);
      const key = 'pendingWithCommittee';
      filterSetRequest.push(
        this.dashboardService.getCommitteeList().pipe(
          take(1),
          map((res: Dropdown[]) => {
            return {
              key,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key}: ${err.statusText}`);
            return of({ key, data: [] });
          })
        )
      ); 
    }

    if (this.cardList.TotContPreAprCard) {
      const key = 'projectType';
      filterSetRequest.push(
        this.dashboardService.getProjectTypeList().pipe(
          take(1),
          map((res: ProjectType[]) => {
            return {
              key,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key}: ${err.statusText}`);
            return of({ key, data: [] });
          })
        )
      );
      const key1 = 'pendingWithRole';
      filterSetRequest.push(
         this.dashboardService.getRolesList().pipe(
          take(1),
          map((res: Role[]) => {
            return {
              key: key1,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key1}: ${err.statusText}`);
            return of({ key: key1, data: [] });
          })
        )
      );
      const key2 = 'status';
      filterSetRequest.push(
        this.dashboardService.getStatusList().pipe(
          take(1),
          map((res: StatusType[]) => {
            return {
              key: key2,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key2}: ${err.statusText}`);
            return of({ key: key2, data: [] });
          })
        )
      )
    }

    if (this.cardList.TotCocCard) {
      const key = 'contractStatus';
      filterSetRequest.push(
        this.dashboardService.getContractStatusList().pipe(
          take(1),
          map((res: Dropdown[]) => {
            return {
              key,
              data: res
            }
          }),
          catchError((err: any) => {
            this.commonService.createMessage('error', `${key}: ${err.statusText}`);
            return of({ key, data: [] });
          })
        )
      );
    }

    if (filterSetRequest.length === 0) {
      this.checkAllLoaded();
      return;
    }
    this.loadedFilters = false;
    forkJoin(filterSetRequest).subscribe(
      (res: { key: string, data: TableFilterSet[] }[]) => {
        this.loadedFilters = true;
        this.checkAllLoaded();
        res.forEach((item: { key: string, data: TableFilterSet[] }) => {
          if (item.key === 'createdBy') {
            this.rfpUsers = [...item.data as RfpUser[]];
            this.rfpColumns[4].filter = this.convertToTableFilterSet(this.rfpUsers);
          }
          if (item.key === 'pendingWithDept') {
            this.rfpDepartments = [...item.data as RfpDepartment[]];
            this.rfpColumns[7].filter = this.convertToTableFilterSet(this.rfpDepartments);
          }
          if (item.key === 'pendingWithCommittee') {
            this.committeeList = [...item.data as Dropdown[]];
            this.tenderColumns[9].filter = this.convertToTableFilterSet(this.committeeList);
          }
          if (item.key === 'contractStatus') { 
            this.contractStatusList = [...item.data as Dropdown[]];
            this.cocColumns[6].filter = this.convertToTableFilterSet(this.contractStatusList);
          }
          if (item.key === 'projectType') {
            this.projectTypes = [...item.data as ProjectType[]];
            this.contractColumns[5].filter = this.convertToTableFilterSet(this.projectTypes);
          }
          if (item.key === 'pendingWithRole') {
            this.pendingWithRoles = [...item.data as Role[]];
            this.contractColumns[7].filter = this.convertToTableFilterSet(this.pendingWithRoles);
          }
          if (item.key === 'status') {
            this.statusTypes = [...item.data as StatusType[]];
            this.contractColumns[8].filter = this.convertToTableFilterSet(this.statusTypes);
          }
        });
      },
    );

  }

  setChartData() {

    // * RFP by Department
    this.rfpByOrgUnitChartData = {
      ...this.rfpByOrgUnitChartData,
      labels: [
        ...this.rfpByOrgUnitApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)
      ],
    }
    this.rfpByOrgUnitChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.rfpByOrgUnitApiData.yAxis.en : this.rfpByOrgUnitApiData.yAxis.ar;
    this.rfpByOrgUnitChartData.datasets[0].data = [...this.rfpByOrgUnitApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

    // * RFP by month
    this.rfpByMonthsChartData = {
      ...this.rfpByMonthsChartData,
      labels: [
        ...this.rfpByMonthsApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)
      ]
    }
    this.rfpByMonthsChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.rfpByMonthsApiData.yAxis.en : this.rfpByMonthsApiData.yAxis.ar;
    this.rfpByMonthsChartData.datasets[0].data = [...this.rfpByMonthsApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

    // * Tender by month
    this.tenderByMonthsChartData = {
      ...this.tenderByMonthsChartData,
      labels: [...this.tenderByMonthsApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)]
    };
    this.tenderByMonthsChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.tenderByMonthsApiData.yAxis.en : this.tenderByMonthsApiData.yAxis.ar;
    this.tenderByMonthsChartData.datasets[0].data = [...this.tenderByMonthsApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

    // * Tender by committee
    this.tenderByCommitteeChartData = {
      ...this.tenderByCommitteeChartData,
      labels: [...this.tenderByCommitteeApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)]
    };
    this.tenderByCommitteeChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.tenderByCommitteeApiData.yAxis.en : this.tenderByCommitteeApiData.yAxis.ar;
    this.tenderByCommitteeChartData.datasets[0].data = [...this.tenderByCommitteeApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

    // * Top Vendors  
    this.topVendorsChartData = {
      ...this.topVendorsChartData,
      labels: [...this.topVendorsApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)]
    };
    this.topVendorsChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.topVendorsApiData.yAxis.en : this.topVendorsApiData.yAxis.ar;
    this.topVendorsChartData.datasets[0].data = [...this.topVendorsApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];
    this.topVendorsIds = [...(this.topVendorsApiData.xIds ?? [])]

    // * Contract by month  
    this.contractByMonthsChartData = {
      ...this.contractByMonthsChartData,
      labels: [...this.contractByMonthsApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)]
    };
    this.contractByMonthsChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.contractByMonthsApiData.yAxis.en : this.contractByMonthsApiData.yAxis.ar;
    this.contractByMonthsChartData.datasets[0].data = [...this.contractByMonthsApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

    // * Spend Analysis  
    this.spendAnalysisByMonthsChartData = {
      ...this.spendAnalysisByMonthsChartData,
      labels: [...this.spendAnalysisByMonthsApiData.xValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? value.en : value.ar)]
    };
    this.spendAnalysisByMonthsChartData.datasets[0].label = this.commonService.userLanguage === 'en' ? 
    this.spendAnalysisByMonthsApiData.yAxis.en : this.spendAnalysisByMonthsApiData.yAxis.ar;
    this.spendAnalysisByMonthsChartData.datasets[0].data = [...this.spendAnalysisByMonthsApiData.yValues
      .map((value: MultiLang) => this.commonService.userLanguage === 'en' ? Number(value.en) : Number(value.ar))];

  }

  loadChartsData() {
    this.spinner.show();

    const chartRequests: Observable<{ key: string; data: ChartData | Vendor[] | null }>[] = Object.entries(this.cardList)
      .filter(([key, value]) => !key.includes('Card') && value)
      .map(([key]) =>
        this.dashboardService.getChartData(key, this.selectedYear).pipe(
          map((res: ChartData) => ({ key, data: res })),
          catchError((err) => {
            this.commonService.createMessage('error', `${key}: ${err.statusText}`)
            return of({key, data: null})
          })
        )
    );

    if (this.cardList.TotAmtByMonth) {
      const key = 'VendorList'
      chartRequests.push(this.dashboardService.getVendorList().pipe(
        map((res: Vendor[]) => ({ key, data: res })),
        catchError((err) => {
          this.commonService.createMessage('error', `${key}: ${err.statusText}`)
            return of({key, data: null})
        })
      ))
    }

    if (chartRequests.length === 0) {
      this.checkAllLoaded();
      return;
    }
    this.loadedCharts = false;
    forkJoin(chartRequests).subscribe({
      next: (results) => {
        this.loadedCharts = true;
        this.checkAllLoaded();
        results.forEach(({ key, data }) => {

          if (data) {
            switch (key) {
              case 'TotRfpByDpt':
                this.rfpByOrgUnitApiData = data as ChartData;
                this.rfpByDeptFilterSet[2].dropDown = [
                  ...this.rfpByOrgUnitApiData.xValues.map((value: MultiLang, index: number): Dropdown => {
                    return {
                      value: this.rfpByOrgUnitApiData.xIds?.[index] ?? '',
                      label: value
                    }
                  })
                ];
                break;
              case 'TotRfpByMonth':
                this.rfpByMonthsApiData = data as ChartData;
                break;
              case 'TotTndrByMonth':
                this.tenderByMonthsApiData = data as ChartData;
                break;
              case 'TotTndrByCmt':
                this.tenderByCommitteeApiData = data as ChartData;
                break;
              case 'TopVndrs':
                this.topVendorsApiData = data as ChartData;
                break;
              case 'TotContByMonth':
                this.contractByMonthsApiData = data as ChartData;
                break;
              case 'TotAmtByMonth':
                this.spendAnalysisByMonthsApiData = data as ChartData;
                break;
              case 'VendorList': 
                this.spendAnalysisFilterSet[0].dropDown = [
                  ...(data as Vendor[]).map((vendor: Vendor): Dropdown => {
                    return {
                      value: vendor.VendorId,
                      label: {
                        en: vendor.VendorName,
                        ar: vendor.VendorName
                      }
                    }
                  })
                ]
            }
          }

        });
        this.setChartData();
      }
    });
  }

  buildTableQuery(value: TableSort[] | TableFilter[]): string {
    return value.length ? value.map((item: TableSort | TableFilter) => {
      return `${this.filterKeys[item.key]} eq '${item.value}'`
    }).join(' and ') : '';
  }

  getTableData(page: number, search?: string, filter?: string, sort?: string) {
    this.isLoading = true;
    this.dashboardService.getTableData(this.currentTableProcess, this.selectedYear, page, this.pageSize, search, filter, sort)
    .pipe(take(1)).subscribe(
      (res: TableApiResponse) => {
        this.tableData = [...res.list];
        this.totalItems = res.count;
        this.isLoading = false;
      },
      (err) => {
        this.commonService.createMessage('error', err.statusText);
        this.isLoading = false;
      }
    )
  }

  pageChange(page: number) {
    this.pageIndex = page;
    this.getTableData(page, this.searchValue, this.filterValue, this.sortValue);
  }

  onSearch(search: string) {
    this.pageIndex = 1;
    this.searchValue = search;
    this.getTableData(this.pageIndex, search, this.filterValue, this.sortValue);
  }

  onSortAndFilter(value: TableFilterSort) {
    this.pageIndex = 1;
    const { filter, sort } = value;
    this.filterValue = this.buildTableQuery(filter);
    this.sortValue = this.buildTableQuery(sort);
    this.getTableData(this.pageIndex, this.searchValue, this.filterValue, this.sortValue);
  }

  handleTableVisibility(process: string) {
    const isSameProcess = this.currentTableProcess === process;
    this.viewTableDetailsToggle = isSameProcess ? !this.viewTableDetailsToggle : true;
    this.currentTableProcess = process;
    if (this.viewTableDetailsToggle) {
      this.tableTitle = this.tableTitles[process as keyof typeof TableTitle] || this.tableTitles.rfp;
      this.searchPlaceholder = this.searchPlaceholders[process as keyof typeof SearchPlaceholder] || this.searchPlaceholders.rfp;
      this.tableColumns = [...this[`${process}Columns` as keyof DashboardComponent] as TableColumn[]];
      this.pageIndex = 1;
      this.searchValue = '';
      this.filterValue = '';
      this.sortValue = '';
      this.getTableData(this.pageIndex);
      setTimeout(() => {
        document.getElementById('dashboardTable')?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }

  downloadExcel(isDownload: boolean) {
    if (isDownload) {
      this.spinner.show();
      this.dashboardService.getTableData(
        this.currentTableProcess, 
        this.selectedYear,
        undefined,
        undefined,
        this.searchValue,
        this.filterValue,
        this.sortValue
      ).pipe(take(1)).subscribe(
        (res: TableApiResponse) => {
          this.spinner.hide()
          this.excel.exportToExcel(
            res.list, 
            this[`${this.currentTableProcess}Columns` as keyof DashboardComponent] as TableColumn[],
            `${this.currentTableProcess.toUpperCase()}_Total`,
            this.currentTableProcess
          )
        }, 
        (err) => {
          this.spinner.hide()
          this.commonService.createMessage('error', err.statusText)
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollCards(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 300; 

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }
}
