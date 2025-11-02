import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';

import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IconList } from 'src/app/components/icon/icon.component';

interface DataItem {
  ProjectName: string;
  ProjectType: string;
  AwardNumber: number;
  AwardDate: string;
  AwardAmount: number;
  VendorName: string;
  // LegalOfficer: string;
  // LegalOfficerAr: string;
  SLAEN: string;
  SLAAR: string;
  SLAIndicator: string;
}

@Component({
  selector: 'app-ss-director-dashboard',
  templateUrl: './ss-director-dashboard.component.html',
  styleUrls: ['./ss-director-dashboard.component.scss']
})
export class SsDirectorDashboardComponent implements OnInit {
  ProxyUserId = 'TSUDHA';
  constructor(
    private router: Router,
    public cs: CommonService,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private apiService: ApiServiceService,
    private http: HttpClient,
  ) { }

  readonly IconList = IconList;
  showFilter = false;
  searchValueProjectName = '';
  searchValueProjectType = '';
  searchValueAwardNumber = '';
  searchValueAwardAmount = '';
  searchValueVendorName = '';
  searchValueDatefrom = '';
  searchValueDateTo = '';
  // searchValueOfficerName = '';
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
    // {
    //   title: 'Assigned Legal Officer',
    //   compare: (a: DataItem, b: DataItem) => this.cs.userLanguage == 'en' ? a.LegalOfficer.localeCompare(b.LegalOfficer) : a.LegalOfficerAr.localeCompare(b.LegalOfficerAr),
    //   priority: false
    // }
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
        ProjType: this.api.get('F4ProjectType')
      }).subscribe(({ProjType}) => {
        // if (doShowLoad) this.spinner.hide();
        let f4MapObj = {
          projectTypeList : ProjType
        }
        this.LookupData = f4MapObj;
      });
      this.showFilter = true;
    }
  }

  reset(): void {
    this.searchValueProjectName = '';
    this.searchValueProjectType = '';
    this.searchValueAwardNumber = '';
    this.searchValueAwardAmount = '';
    this.searchValueVendorName = '';
    this.searchValueDatefrom = '';
    this.searchValueDateTo = '';
    // this.searchValueOfficerName = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    let dateFrom = this.searchValueDatefrom ? new Date(this.searchValueDatefrom).getTime() : 0;
    let dateTo = this.searchValueDateTo ? new Date(this.searchValueDateTo).getTime() : 0;
    // this.listOfDisplayData = this.listOfData.filter((item: DataItem) => 
    // (item.ProjectName.toLowerCase().indexOf(this.searchValueProjectName.toLowerCase()) !== -1) 
    // && (item.AwardNumber.toString().indexOf(this.searchValueAwardNumber) !== -1) 
    // && (item.ProjectType.toLowerCase().indexOf(this.searchValueProjectType.toLowerCase()) !== -1)
    //   && (item.VendorName.toLowerCase().indexOf(this.searchValueVendorName.toLowerCase()) !== -1) 
    //   && (item.LegalOfficer.toLowerCase().indexOf(this.searchValueOfficerName.toLowerCase()) !== -1)
    //   && (dateFrom ? (dateFrom <= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    //   && (dateTo ? (dateTo >= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    // );
    let searchData = {
      ProjectName: this.searchValueProjectName,
      AwardNumber: this.searchValueAwardNumber,
      ProjectTypeId: this.searchValueProjectType,
      AwardAmount: this.searchValueAwardAmount,
      VendorName: this.searchValueVendorName,
      // LegalOfficer: this.searchValueOfficerName,
      dateFrom: dateFrom,
      dateTo: dateTo
    }
    this.listOfDisplayData = this.cs.searchFilter(this.listOfData, searchData)
  }

  getContractList() {
    let contractStatus = 'PCDA';
    let status = {
      "status": contractStatus
    }
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    this.api.post("getListSet", { ...status, userName: this.ProxyUserId }).subscribe(
      (res) => {
        let list = this.apiService.mappingObjects(res.d.results);
        list.forEach((data: any) => {
          const items = {
            ProjectName: data.ProjectName,
            ProjectType: data.ProjectType,
            ProjectTypeId: data.ProjectTypeId,
            AwardNumber: data.AwardNumber,
            AwardDate: data.AwardDate,
            AwardAmount: data.AwardAmount,
            VendorName: data.VendorName,
            // LegalOfficer: data.LegalOfficer,
            // LegalOfficerAr: data.LegalOfficerAr,
            SLAEN: data.SLAEN,
            SLAAR: data.SLAAR,
            SLAIndicator: data.SLAIndicator
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

  showDetails(award_number: any, project_name: any) {
    // this.router.navigate(['contract/SsDirectorDetails'], {
    //   state: {
    //     award_number: award_number,
    //     project_name: project_name
    //   }
    // })
    this.router.navigate(['contract/RfpManagerRmi'], {
      state: {
        award_number: award_number,
        role: "Support Services Director"
      }
    });
  }

}
