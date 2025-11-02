import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { CommonService } from 'src/app/service/common.service';
import { CardList, RfpDepartment, RfpUser, TableApiResponse, Vendor, VendorDetails, 
  Dropdown, ProjectType, StatusType, Role } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userData: {userid: string, DeptId: string, CommitteeId: string | null };

  constructor(private api: ApiService, private commonService: CommonService) {
    this.userData = this.commonService.getUserData();
   }

  getCardVisibility(selectedYear: string): Observable<any> {
    return this.api.get(`dashboard/card-list?userid=${this.userData.userid}&year=${selectedYear}`)
  }

  getCardQuery(cards: CardList): string {
    return Object.entries(cards)
    .filter(([key, value]) => value && key.includes('Card'))
    .map(([key]) => `${key} eq 'X'`)
    .join(' and ');
  }

  getCardsData(selectedYear: string, cards: CardList): Observable<any> {
    const cardQuery = this.getCardQuery(cards);
    return this.api.get(`dashboard/cards?userid=${this.userData.userid}&year=${selectedYear}&cards=${cardQuery}`)
  }

  getChartData(chartName: string, selectedYear: string, filter?: string): Observable<any> {
    if (!filter) {
      return this.api.get(`dashboard/${chartName}?userid=${this.userData.userid}&year=${selectedYear}`)
    } else {
      return this.api.get(`dashboard/${chartName}?userid=${this.userData.userid}&year=${selectedYear}&filter=${filter}`)
    }
  }

  getTableData(process: string, selectedYear: string, page?: number, count?: number, search?: string, filter?: string, sort?: string): Observable<TableApiResponse> {
    let url = `dashboard/${process}?userid=${this.userData.userid}&year=${selectedYear}`;
    if (search) {
      url += `&search=${search}`;
    }
    if (filter) {
      url += `&filter=${filter}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (page && count) {
      url += `&page=${page}&count=${count}`;
    }
    return this.api.get(url);
  }

  convertCardVisibilityToBoolean(cardList: any): CardList {
    Object.entries(cardList).forEach(([key, value]) => {
      cardList[key] = value === 'X'
    })
    return cardList;
  }

  getVendorList(): Observable<Vendor[]> {
    return this.api.get('dashboard/vendor-list');
  }

  getVendorDetails(vendorID: string, year: string): Observable<VendorDetails> {
    return this.api.get(`dashboard/vendor-details?vendorID=${vendorID}&year=${year}`)
  }

  getRfpCreatorList(): Observable<RfpUser[]> {
    return this.api.get(`rfp-creators`);
  }

  getRfpDepartmentList(): Observable<RfpDepartment[]> {
    return this.api.get(`rfp-pending-departments`);
  }

  getCommitteeList(): Observable<Dropdown[]> {
    return this.api.get('dashboard/committee-lookup');
  }

  getContractStatusList(): Observable<Dropdown[]> {
    return this.api.get('dashboard/contract-status-lookup');
  }

  getProjectTypeList(): Observable<ProjectType[]> {
    return this.api.get('F4ProjectType');
  }

  getStatusList(): Observable<StatusType[]> {
    return this.api.get('F4Status');
  }

  getRolesList(): Observable<Role[]> {
    return this.api.get('F4Roles');
  }

}
