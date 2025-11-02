import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';

interface DataItem {
  ProjectName: string;
  ProjectType: string;
  AwardNumber: number;
  AwardDate: string;
  AwardAmount: number;
  VendorName: string;
  LegalHead: string;
  SLAEN: string;
  SLAAR: string;
  SLAIndicator: string;
}

@Component({
  selector: 'app-legal-manager-dashboard',
  templateUrl: './legal-manager-dashboard.component.html',
  styleUrls: ['./legal-manager-dashboard.component.scss']
})
export class LegalManagerDashboardComponent implements OnInit {
  @Input() optionSelected: string = '';
  ProxyUserId = 'TSUDHA';
  constructor(
    public cs: CommonService,
    private router: Router,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private apiService: ApiServiceService
  ) { }

  showFilter = false;
  searchValueProjectName = '';
  searchValueProjectType = '';
  searchValueAwardNumber = '';
  searchValueAwardAmount = '';
  searchValueVendorName = '';
  searchValueDatefrom = '';
  searchValueDateTo = '';
  searchValueOfficerName = '';
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
      title: 'Assigned Legal Head',
      compare: (a: DataItem, b: DataItem) => a.LegalHead.localeCompare(b.LegalHead),
      priority: false
    }
  ]
  LookupData: any;

  ngOnInit(): void {
    this.spinner.show();
    this.LookupData = this.apiService.ContractF4Data;
    this.getContractList();
  }


  reset(): void {
    this.searchValueProjectName = '';
    this.searchValueProjectType = '';
    this.searchValueAwardNumber = '';
    this.searchValueAwardAmount = '';
    this.searchValueVendorName = '';
    this.searchValueDatefrom = '';
    this.searchValueDateTo = '';
    this.searchValueOfficerName = '';
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
    //   && (item.LegalHead.toLowerCase().indexOf(this.searchValueOfficerName.toLowerCase()) !== -1)
    //   && (dateFrom ? (dateFrom <= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    //   && (dateTo ? (dateTo >= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    // );
    let searchData = {
      ProjectName: this.searchValueProjectName,
      AwardNumber: this.searchValueAwardNumber,
      ProjectTypeId: this.searchValueProjectType,
      AwardAmount: this.searchValueAwardAmount,
      VendorName: this.searchValueVendorName,
      LegalHead: this.searchValueOfficerName,
      dateFrom: dateFrom,
      dateTo: dateTo
    }
    this.listOfDisplayData = this.cs.searchFilter(this.listOfData, searchData)
  }

  getContractList() {
    let status;
    if (this.optionSelected == 'assign') {
      status = {
        "status": "LMP1"
      }
    } else if (this.optionSelected == 'approve') {
      status = {
        "status": ""
      }
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
            LegalHead: data.LegalHead,
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
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  showDetails(award_number: any, project_name: any, officer_name: any) {
    if (officer_name) {
      this.router.navigate(['contract/approveContractLM'], {
        state: {
          award_number: award_number,
          project_name: project_name
        }
      });
    } else {
      this.router.navigate(['contract/assignLegalHead'], {
        state: {
          award_number: award_number,
          project_name: project_name
        }
      });


    }
  }

}
