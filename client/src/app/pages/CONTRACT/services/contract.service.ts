import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContractCreationDetails, PRList } from '../contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  baseurl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getPRList(): Observable<PRList[]> {
    return this.http.get<PRList[]>(this.baseurl + 'api/contract-PR-list', {
      headers: new HttpHeaders().set(
        'Authorization',
        `Basic ${environment.token}`
      ),
    });
  }

  detailsForContractCreation(PRNumber: string) {
    return this.http.get<ContractCreationDetails>(`${this.baseurl}api/details-for-contract-creation`, {
      params: { PRNumber }, // Passing PRNumber as a query parameter
      headers: new HttpHeaders().set(
        'Authorization',
        `Basic ${environment.token}`
      ),
    });
  }

  createContract(contractDetails: any){
    return this.http.post(`${this.baseurl}api/create-contract`,contractDetails)
  }
  
}
