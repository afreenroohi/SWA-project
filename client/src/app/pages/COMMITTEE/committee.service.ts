import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
import { dropDown } from './committee.model';

@Injectable()
export class CommitteeService {

  baseurl = environment.apiUrl;
  
  constructor(
    private commonService : CommonService,
    private http : HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      "Authorization": `Basic ${environment.token}`,
      "Content-Type": "application/json" // Ensure you specify content type
    })
  };


  
  public setPricePreference (vendors: any) : any {

    if(vendors.find((vendor:any)=> vendor.IsSME === 'X')){
      vendors.map((vendor: any) => {
        vendor.PricePreference = (vendor.IsSME === 'X') ? '0' : this.commonService.truncate(Number(vendor.Price) * 1.1, 2).toString();
      });
    } else {
      vendors.map((vendor: any) => {
        vendor.PricePreference = '0';
      });
    }
  }

  getRFPEstimate(RfpNo: string): Promise<any>{
    let data = {
      "RfpNo": RfpNo
    }
    return this.http.post<{ estimate: string }>(this.baseurl + 'api/F4_BOQ', data, this.httpOptions)
    .toPromise()
  }

  getMOMtypes(): Observable<dropDown[]>{
    return this.http.get<dropDown[]>(this.baseurl + 'api/get-MOM-types', this.httpOptions)
  }

  getFinalApproversList():  Observable<dropDown[]>{
    return this.http.get<dropDown[]>(this.baseurl + 'api/getFinalApprovalList', this.httpOptions)
  }
  
  getLocalContentList():  Observable<dropDown[]>{
    return this.http.get<dropDown[]>(this.baseurl + 'api/getLocalContentList', this.httpOptions)
  }



}