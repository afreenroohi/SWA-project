import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';

interface DataItem {
  ProjectName: string;
  ProjectType: string;
  ProjectTypeId: string;
  AwardNumber: number;
  AwardDate: string;
  AwardAmount: number;
  VendorName: string;
  SLAEN: string;
  SLAAR: string;
  SLAIndicator: string;
}

@Component({
  selector: 'app-legal-officer-dashboard',
  templateUrl: './legal-officer-dashboard.component.html',
  styleUrls: ['./legal-officer-dashboard.component.scss'],
  providers: [DatePipe]
})
export class LegalOfficerDashboardComponent implements OnInit {
  @Input() optionSelected: string = '';
  ProxyUserId = 'TSUDHA';
  constructor(
    private router: Router,
    public cs: CommonService,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private apiService: ApiServiceService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  id: any;
  showFilter = false;
  searchValueProjectName = '';
  searchValueProjectType = '';
  searchValueAwardNumber = '';
  searchValueAwardAmount = '';
  searchValueVendorName = '';
  searchValueDatefrom = '';
  searchValueDateTo = '';
  visible = false;
  listOfData: DataItem[] = [];
  listOfDisplayData: DataItem[] = [];
  LookupData: any;

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
    }
  ]


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.LookupData = this.apiService.ContractF4Data;
    console.log(this.id);
    this.spinner.show();
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
    this.search();
  }

  search(): void {
    this.visible = false;
    let dateFrom = this.searchValueDatefrom ? new Date(this.searchValueDatefrom).getTime() : 0;
    let dateTo = this.searchValueDateTo ? new Date(this.searchValueDateTo).getTime() : 0;
    // console.log(this.searchValueProjectType);
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) =>
      (item.ProjectName.toLowerCase().indexOf(this.searchValueProjectName.toLowerCase()) !== -1) &&
      (item.AwardNumber.toString().indexOf(this.searchValueAwardNumber) !== -1) &&
      (this.searchValueProjectType? (item.ProjectTypeId == this.searchValueProjectType) : true)
      && (item.VendorName.toString().indexOf(this.searchValueVendorName) !== -1)
      && (dateFrom ? (dateFrom <= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
      && (dateTo ? (dateTo >= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    );
  }

  ngOnChanges() {
    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    console.log(this.id);
  }

  getContractList() {
    let status;
    if (this.optionSelected == 'ContPrep') {
      status = {
        "status": "LOP1"
      }
    } else if (this.optionSelected == 'RetFrAppr') {
      status = {
        "status": "LOAR"
      }
    } else if (this.optionSelected == 'RetFrRmi') {
      status = {
        "status": "LRMI"
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
      }
    );
  }

  showDetails(award_number: any, project_name: any) {
    this.router.navigate(['contract/contractPrepForm/' + project_name + '/' + award_number], {
      state: {
        award_number: award_number,
        project_name: project_name
      }
    });
  }

  checkDropdownData() {
    console.log(this.apiService.ContractF4Data, this.showFilter)
    if (this.apiService.ContractF4Data && (this.showFilter == false)) {
      this.showFilter = true;
    } else if (this.showFilter == true) {
      this.showFilter = false;
    } else {
      let showLoader = true;
      this.apiService.getContractF4Data(showLoader);
      this.showFilter = true;
    }
  }

  // getProjectTextwithId(id:string): string{
  //   let item = this.LookupData.projectTypeList.filter((item:any) => item.PrjTypeID == id)
  //   if(item.length == 0) return '';
  //   if(this.cs.userLanguage === 'en') return item[0].PrjTypeDescEN
  //   return item[0].PrjTypeDescAR
  // }
}
