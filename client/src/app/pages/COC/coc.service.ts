import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";
import { dropDown } from "../COMMITTEE/committee.model";
import {cocFormDownload, userList} from "../COC/coc.model"

@Injectable({
    providedIn: 'root',
})

export class COCService {
  baseurl = environment.apiUrl;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }
    httpOptions = new HttpHeaders().set("Authorization", `Basic ${environment.token}`)
    

    /**
     * Returns the list with Serial Number
     * @param dataList 
     * @returns 
     */
    addSerialNumber(dataList: any) {
        return dataList.map((data: any, index: number) => {
            return {
                SiNo: index + 1,
                ...data
            }
        })
    }

    /**
     * GoTo List page
     */
    gotoListPage(): void {
        this.router.navigate(['coc/OwnerDashboard']);
    }

    getCOCFormList(): Observable<dropDown[]>{
        return  this.http.get<dropDown[]>(this.baseurl + 'api/coc-form-list',  {
            headers: new HttpHeaders().set("Authorization", `Basic ${environment.token}`)
          })
    }
    getCOCUserList():Observable<userList[]>{
        return this.http.get<userList[]>(this.baseurl + 'api/coc-user-list',{
            headers: new HttpHeaders().set("Authorization", `Basic ${environment.token}`)
        })
    }
    getCOCFilteredUserList():Observable<userList[]>{
        return this.http.get<userList[]>(this.baseurl + 'api/coc-filtered-user-list',{
            headers: new HttpHeaders().set("Authorization", `Basic ${environment.token}`)
        })
    }

    downloadCOCForm(cocNumber: string, formType: string) {
        let enpoint: string
        if(formType === cocFormDownload.ETIMADFORM ){
            enpoint = 'CocEtimadFormSet'
        }else if(formType === cocFormDownload.FINALSETTELMENT){
            enpoint = 'CocFinalSettlementFormSet'
        }
        else if(formType === cocFormDownload.INTERNALFORM){
            enpoint = 'CocInternalFormSet'
        }else {
            throw new Error('Invalid formType provided'); // Handle unexpected formType
          }

        const params = new HttpParams().set('id', cocNumber).set('formtype', enpoint);// Set cocNumber as a query parameter
        return this.http.get(this.baseurl + 'api/coc-form-download', {
          headers: new HttpHeaders().set("Authorization", `Basic ${environment.token}`),
          params: params, // Add params to the request
        });
      }
    


}