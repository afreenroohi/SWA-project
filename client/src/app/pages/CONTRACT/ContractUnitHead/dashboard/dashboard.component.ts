import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  ConOfficer: string;
  ConOfficerAr: string;
  LoADays: number;
  SLAEN: string;
  SLAAR: string;
  SLAIndicator: string;
}

// dashboard for contract unit head
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})

export class DashboardComponent implements OnInit {
  @Input() optionSelected: string = '';

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

  readonly IconList = IconList;
  showFilter = false;
  searchValueProjectName = '';
  searchValueProjectType = '';
  searchValueAwardNumber = '';
  searchValueAwardAmount = '';
  searchValueVendorName = '';
  searchValueDatefrom = '';
  searchValueDateTo = '';
  searchValueLOAdays = '';
  searchValueContOff = '';
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
      title: 'Number of days from LoA',
      compare: (a: DataItem, b: DataItem) => a.LoADays - b.LoADays,
      priority: false
    },
    {
      title: 'Contract Officer Name',
      compare: (a: DataItem, b: DataItem) => this.cs.userLanguage == 'en' ? a.ConOfficer.localeCompare(b.ConOfficer) : a.ConOfficerAr.localeCompare(b.ConOfficerAr),
      priority: false
    }
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
        CuoList: this.api.get('CUOList')
      }).subscribe(({ ProjType, CuoList }) => {
        // if (doShowLoad) this.spinner.hide();
        let f4MapObj = {
          projectTypeList: ProjType,
          CuoList: CuoList
        }
        this.LookupData = f4MapObj;
      });
      this.showFilter = true;
    }
  }

  // reset function
  reset(): void {
    this.searchValueProjectName = '';
    this.searchValueProjectType = '';
    this.searchValueAwardNumber = '';
    this.searchValueAwardAmount = '';
    this.searchValueVendorName = '';
    this.searchValueDatefrom = '';
    this.searchValueDateTo = '';
    this.searchValueLOAdays = '',
      this.searchValueContOff = '';
    this.search();
  }

  // search function
  search(): void {
    this.visible = false;
    let dateFrom = this.searchValueDatefrom ? new Date(this.searchValueDatefrom).getTime() : 0;
    let dateTo = this.searchValueDateTo ? new Date(this.searchValueDateTo).getTime() : 0;
    // this.listOfDisplayData = this.listOfData.filter((item: DataItem) => 
    // (item.ProjectName.toLowerCase().indexOf(this.searchValueProjectName.toLowerCase()) !== -1) && 
    // (item.AwardNumber.toString().indexOf(this.searchValueAwardNumber) !== -1) && 
    // (item.ProjectType.toLowerCase().indexOf(this.searchValueProjectType.toLowerCase()) !== -1)
    //   && (item.VendorName.toLowerCase().indexOf(this.searchValueVendorName.toLowerCase()) !== -1) && 
    //   (item.ConOfficer.toLowerCase().indexOf(this.searchValueOfficerName.toLowerCase()) !== -1) && 
    //   (item.LoADays.toString().indexOf(this.searchValueLOAdays) !== -1)
    //   && (dateFrom ? (dateFrom <= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    //   && (dateTo ? (dateTo >= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    // );
    let searchData = {
      ProjectName: this.searchValueProjectName,
      AwardNumber: this.searchValueAwardNumber,
      ProjectTypeId: this.searchValueProjectType,
      AwardAmount: this.searchValueAwardAmount,
      VendorName: this.searchValueVendorName,
      Officer: this.searchValueContOff,
      LoaDays: this.searchValueLOAdays,
      dateFrom: dateFrom,
      dateTo: dateTo
    }
    this.listOfDisplayData = this.cs.searchFilter(this.listOfData, searchData)
  }

  // get list API
  getContractList() {
    let contractStatus = '';
    if (this.optionSelected == "Approve") {
      contractStatus = "PCHA"
    } else if (this.optionSelected == "Preparation") {
      contractStatus = "PCHP"
    }

    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let status = {
      status: contractStatus
    };
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
            ConOfficer: data.ConOfficer,
            ConOfficerAr: data.ConOfficerAr,
            LoADays: data.LoADays,
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



  // redirect to details API
  showDetails(award_number: any, unit_officer: any, project_type: any) {
    if (unit_officer) {
      // this.router.navigate(['contract/approveContractCUH'], {
      //   state: {
      //     award_number: award_number,
      //     project_type: project_type,
      //     unit_officer: unit_officer
      //   }
      // });
      this.router.navigate(['contract/RfpManagerRmi'], {
        state: {
          award_number: award_number,
          role: "Contract Unit Head"
        }
      });
    } else {
      this.router.navigate(['contract/details'], {
        state: {
          award_number: award_number,
          project_type: project_type
        }
      });
    }
  }

}
