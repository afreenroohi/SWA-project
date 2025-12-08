import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FileDeleteReq, FileDownloadReq } from 'src/app/components/filenet/filenet.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseurl = environment.apiUrl;
  roleAs: any;

  noRole: Subject<boolean> = new Subject<boolean>();


  constructor(private http: HttpClient) { }

  httpOptions = new HttpHeaders().set("Authorization", `Basic ${environment.token}`)


  // RFP FLOW
  
  getLoginUserDetails(userId: string) {
    // KAAR-758
    console.log(userId, '=====userId')
    const headers = new HttpHeaders({    //btoa = browser to ascii (encoding base64)
      'Authorization': 'Basic ' + btoa('KAAR-2792:Copyright@123456789')
    });
    return this.http.get(this.baseurl + `api/LoginUserDetails/${userId}`, { headers });
  }

  get(action: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('KAAR-2792:Copyright@123456789')
    });
    return this.http.get(this.baseurl + 'api/' + action, { headers });
  }
  post(action: any, data: any): Observable<any> {
    return this.http.post(this.baseurl + 'api/' + action, data)
  }

  patch(action: any, data: any): Observable<any> {
    return this.http.put(this.baseurl + 'api/' + action, data)
  }

  // END 

  // Documnet APIS
  docUpload(data: any): Observable<any> {
    return this.http.post(this.baseurl + 'api/F4ProjIdSet', data)
  }

  getDoc(data: any): Observable<any> {
    return this.http.post(this.baseurl + 'api/F4ProjIdSet', data)
  }

  delDoc(data: any): Observable<any> {
    return this.http.post(this.baseurl + 'api/F4ProjIdSet', data)
  }

  // RFP APIS


  downloadFromFilenet(req: any): Observable<any> {
    // * Filenet Download URL
    // return this.http.post(this.baseurl + 'api/filenetdownloadfile', req)
    // * SAP Download URL
    return this.http.get(this.baseurl + `api/sap-file?fileid=${req.fileid}`)
  }

  deleteFromFilenet(req: any): Observable<any> {
    // * Filenet Delete URL
    // return this.http.post(this.baseurl + 'api/filenetdeletefile', req)
    // * SAP Delete URL
    return this.http.delete(this.baseurl + `api/sap-file?fileid=${req.fileid}`)
  }

  uploadToFilenet(req: any): Observable<any> {
    // * Filenet Upload URL
    // return this.http.post(this.baseurl + 'api/filenetuploadfile', req)
    // * SAP File upload URL
    return this.http.post(this.baseurl + 'api/sap-file', req);
  }

  downloadPDF(action: any, data: any): Observable<any> {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/pdf');
    return this.http.post(this.baseurl + 'api/' + action, data, {
      headers: headers,
      responseType: 'arraybuffer'
    });
  }
  getQualificationList() {
    return this.http.get(this.baseurl + 'api/qualification-list')
  }

}
