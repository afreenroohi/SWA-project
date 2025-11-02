import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { environment } from 'src/environments/environment';

interface DataItem {
  ProjectName: string;
  ProjectType: string;
  ContractType: string;
  AwardNumber: number;
  AwardDate: string;
  AwardAmount: number;
  VendorName: string;
  ContStatus: string;
  PendingWith: string;
  PendingWithAR: string;
  ConOfficer: string;
  ConOfficerAr: string;
  ConOffDate: string;
  LegalOfficer: string;
  LegalOfficerAr: string;
  LegOffDate: string;
  SLAEN: string;
  SLAAR: string;
  SLAIndicator: string;
}

// Component for common contract list
@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

  ProxyUserId = 'TSUDHA';

  constructor(
    public cs: CommonService,
    private router: Router,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private apiService: ApiServiceService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }


  showFilter = false;
  searchValueProjectName = '';
  searchValueProjectType = '';
  searchValueAwardNumber = '';
  searchValueAwardAmount = '';
  searchValueVendorName = '';
  searchValueDatefrom = '';
  searchValueDateTo = '';
  searchValueStatus = '';
  searchValuePending = '';
  searchValueContOff = '';
  // searchValueLegalOff = '';
  visible = false;
  listOfData: DataItem[] = [];
  listOfDisplayData: DataItem[] = [];
  listOfColumn = [
    {
      title: 'Project Name',
      compare: (a: DataItem, b: DataItem) => a.ProjectName.localeCompare(b.ProjectName),
      priority: false
    },
    {
      title: 'Type of Project',
      compare: (a: DataItem, b: DataItem) => a.ProjectType.localeCompare(b.ProjectType),
      priority: false
    },
    {
      title: 'Award Number',
      compare: (a: DataItem, b: DataItem) => a.AwardNumber - b.AwardNumber,
      priority: false
    },
    {
      title: 'Award Date',
      compare: (a: DataItem, b: DataItem) => new Date(moment(a.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime() - new Date(moment(b.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime(),
      priority: false
    },
    {
      title: 'Awarded Amount',
      compare: (a: DataItem, b: DataItem) => a.AwardAmount - b.AwardAmount,
      priority: false
    },
    {
      title: 'Vendor Name',
      compare: (a: DataItem, b: DataItem) => a.VendorName.localeCompare(b.VendorName),
      priority: false
    },
    {
      title: 'Status',
      compare: (a: DataItem, b: DataItem) => a.ContStatus.localeCompare(b.ContStatus),
      priority: false
    },
    {
      title: 'Pending with',
      compare: (a: DataItem, b: DataItem) => this.cs.userLanguage == 'en' ? a.PendingWith.localeCompare(b.PendingWith) : a.PendingWithAR.localeCompare(b.PendingWithAR),
      priority: false
    },
    {
      title: 'Contract Unit Officer',
      compare: (a: DataItem, b: DataItem) => this.cs.userLanguage == 'en' ? a.ConOfficer.localeCompare(b.ConOfficer) : a.ConOfficerAr.localeCompare(b.ConOfficerAr),
      priority: false
    },
    {
      title: 'Date of assignment to Contract unit officer',
      compare: (a: DataItem, b: DataItem) => new Date(moment(a.ConOffDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime() - new Date(moment(b.ConOffDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime(),
      priority: false
    },
    // {
    //   title: 'Legal Unit Officer',
    //   compare: (a: DataItem, b: DataItem) => this.cs.userLanguage == 'en' ? a.LegalOfficer.localeCompare(b.LegalOfficer) : a.LegalOfficerAr.localeCompare(b.LegalOfficerAr),
    //   priority: false
    // },
    // {
    //   title: 'Date of assigment to Legal officer',
    //   compare: (a: DataItem, b: DataItem) => new Date(moment(a.LegOffDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime() - new Date(moment(b.LegOffDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime(),
    //   priority: false
    // },
  ]
  LookupData: any;
  baseurl = environment.apiUrl;

  ngOnInit(): void {
    this.spinner.show();
    this.LookupData = this.apiService.ContractF4Data;
    this.getContractList();
  }

  checkDropdownData() {
    console.log(this.apiService.ContractF4Data, this.showFilter)
    if (this.apiService.ContractF4Data && (this.showFilter == false)) {
      this.showFilter = true;
    } else if (this.showFilter == true) {
      this.showFilter = false;
    } else {
      let showLoader = true;
      // this.apiService.getContractF4Data(showLoader);
      forkJoin({
        ProjType: this.api.get('F4ProjectType'),
        Status: this.api.get('F4Status'),
        Role: this.api.get('F4Roles'),
        CuoList: this.api.get('CUOList')
      }).subscribe(({ProjType, Status, Role, CuoList}) => {
        // if (doShowLoad) this.spinner.hide();
        let f4MapObj = {
          projectTypeList : ProjType,
          StatusList: Status,
          RoleList: Role.filter((_role:any) => _role.RoleID != ''),
          CuoList: CuoList
        }
        this.LookupData = f4MapObj;
      });
      this.showFilter = true;
    }
  }

  // reset filter button function
  reset(): void {
    this.searchValueProjectName = '';
    this.searchValueProjectType = '';
    this.searchValueAwardNumber = '';
    this.searchValueAwardAmount = '';
    this.searchValueVendorName = '';
    this.searchValueDatefrom = '';
    this.searchValueDateTo = '';
    this.searchValueStatus = '';
    this.searchValuePending = '';
    this.searchValueContOff = '';
    // this.searchValueLegalOff = '';
    this.search();
  }

  // search button function
  search(): void {
    this.visible = false;
    let dateFrom = this.searchValueDatefrom ? new Date(this.searchValueDatefrom).getTime() : 0;
    let dateTo = this.searchValueDateTo ? new Date(this.searchValueDateTo).getTime() : 0;
    let searchData = {
      ProjectName: this.searchValueProjectName,
      AwardNumber: this.searchValueAwardNumber,
      ProjectTypeId: this.searchValueProjectType,
      AwardAmount: this.searchValueAwardAmount,
      VendorName: this.searchValueVendorName,
      // LegalOfficer: this.searchValueLegalOff,
      Officer: this.searchValueContOff,
      StatusId: this.searchValueStatus,
      PendingWithId: this.searchValuePending,
      dateFrom: dateFrom,
      dateTo: dateTo
    }
    this.listOfDisplayData = this.cs.searchFilter(this.listOfData, searchData);
  }

  // get list of contract
  getContractList() {
    let contractStatus = '';
    let status = {
      "status": contractStatus
    }
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    this.api.post("getCommonListSet", { ...status, userName: this.ProxyUserId }).subscribe(
      (res) => {
        let list = this.apiService.mappingCommonList(res.d.results);
        list.forEach((data: any) => {
          const items = {
            ProjectName: data.ProjectName,
            ProjectType: data.ProjectType,
            ProjectTypeId: data.ProjectTypeId,
            AwardNumber: data.AwardNumber,
            AwardDate: data.AwardDate,
            AwardAmount: data.AwardAmount,
            VendorName: data.VendorName,
            ContStatus: data.ContStatus,
            ContStatusId: data.ContStatusId,
            PendingWith: data.PendingWith,
            PendingWithAR: data.PendingWithAR,
            PendingWithId: data.PendingWithId,
            ConOfficer: data.ConOfficer,
            ConOfficerAr: data.ConOfficerAr,
            ConOffDate: data.ConOffDate,
            LegalOfficer: data.LegalOfficer,
            LegalOfficerAr: data.LegalOfficerAr,
            LegOffDate: data.LegOffDate,
            SLAEN: data.SLAEN,
            SLAAR: data.SLAAR,
            SLAIndicator: data.SLAIndicator,
            ContractType: data.ContractType

          }
          this.listOfData.push(items);
        })
        this.listOfDisplayData = [...this.listOfData];

        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  downloadPDF(flag: any, award_number: any, contract_type: any) {
    this.apiService.downloadPDF(flag, award_number, contract_type);
  }


}
