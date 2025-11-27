import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PROCESS_TYPES, SLA_OPTIONS, UserActionCode, ptypes } from '../shared/shared';
import * as _l from 'lodash';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ApiService } from './RFP/api.service';
import { ApiServiceService } from './Contract/api-service.service';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Loader } from './loader';
import { Department, MemberList, doumentDownload } from '../pages/COMMITTEE/committee.model';
import * as saveAs from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class CommonService extends Loader {
  userLanguage = 'en';

  dtypes = ptypes;

  roleAs: any;
  UserIdAs: any;
  DepIdAs: any;
  activeMenu = 'create';
  editFromDetail = false;
  selectedRFP: any = null;
  selectedDepartment: any;
  //bidsToBeApproved: any =  0;

  private refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _currentUserLanguage: BehaviorSubject<string> = new BehaviorSubject<string>(this.userLanguage);
  private bidsCountDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private readonly destroy$ = new Subject<void>();

  private SLAOptions: {
    "key": string,
    "type": string,
    "typeAr": string
  }[] = [];

  constructor(
    private translate: TranslateService,
    private msg: NzMessageService,
    private api: ApiService,
    private contApi: ApiServiceService,
    private spinner: NgxSpinnerService,
  ) {
    super();
  }

  private _successMsgSource = new Subject<boolean>();
  successMsg$ = this._successMsgSource.asObservable();

  /**
   * Send success message for File Uploader
   * @param message `boolean`
   */
  sendSuccessMsg(message: boolean) {
    this._successMsgSource.next(message);
  }

  /**
   * Select the User Language
   * @param lang Selected Language
   */
  setUserLanguage(lang: string) {
    this.userLanguage = lang;
    this.translate.use(lang);
  }

  /**
   * Create Popup message
   * @param type Message Type
   * @param mssg Message Content
   */
  createMessage(type: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, mssg: string): void {
    this.msg.create(type, mssg);
  }

  getScoreFieldValidation(array:any[],key:string):boolean{
    if(array.length){
      let containsEmptyValue:boolean =  array.some(ele=>(ele[key]=="" || ele[key].toString().startsWith(".00")))
      console.log(containsEmptyValue?'Fill all fields':'Success')
      return containsEmptyValue
    }
    else{
      return false
    }

  }

  /**
   * Returns date in API Format
   * @param date
   * @returns Formated Date
   */
  getCurrentDateInApiFormat(date: any) {
    if (date == null) {
      const dt = new Date()
      const month = ('0' + (dt.getMonth() + 1)).slice(-2);
      const day = ('0' + dt.getDate()).slice(-2);
      return [dt.getFullYear(), month, day].join('');
    }

    else if (date.length == 8) {
      return date;
    }
    else if (date == "") {
      let dt = new Date()
      const month = ('0' + (dt.getMonth() + 1)).slice(-2);
      const day = ('0' + dt.getDate()).slice(-2);
      return [dt.getFullYear(), month, day].join('');
    }
    else if (date || date.getMonth()) {
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return [date.getFullYear(), month, day].join('');
    }
    else {
      let dt1 = new Date()
      const month = ('0' + (dt1.getMonth() + 1)).slice(-2);
      const day = ('0' + dt1.getDate()).slice(-2);
      return [dt1.getFullYear(), month, day].join('');
    }
  }

  /**
   * Get Arabic Only Error
   * @param formField
   * @returns Error message
   */
  getErrorOnlyArabic(formField: any) {
    if (formField.hasError('required')) {
      return this.translate.instant('RFP.FieldIsRequired');
    }
    if (formField.hasError('pattern')) {
      return this.translate.instant('RFP.ArabicFields');
    }
    return '';
  }

  /**
   * Get Document Type based on Document Type Id
   * @param docId Document Id
   * @returns Document Type
   */
  getDocType(docId: string): string {
    let documentType: any;
    this.dtypes.forEach((element: any) => {
      if (element.id == docId) {
        stop;
        documentType = this.userLanguage === 'en' ? element.value : element.valueAr;
        return documentType;
      }
    });
    return documentType;
  }

  /**
   * Get Date Method
   * @param dateString Date String
   * @returns Date
   */
  getDate(dateString: any) {
    if (!dateString) {
      return new Date();
    }
    const newDate = new Date();
    newDate.setDate(dateString.slice(6, 10));
    newDate.setMonth(+dateString.slice(3, 5 - 1));
    newDate.setFullYear(dateString.slice(0, 4));
    return newDate;
  }

  getDateNew(value: any) {
    if (!value) {
      return new Date();
    }
    let da = new Date();
    da.setDate(value.slice(6, 10));
    da.setMonth(+value.slice(4, 6) - 1);
    da.setFullYear(value.slice(0, 4));
    return da;
  }

  /**
   * Get Hijri Date
   * @param date Date String
   * @returns Date
   */
  getHijriDateObj(date: any) {
    const dateObj = {
      year: parseInt(date.slice(0, 4)),
      month: parseInt(date.slice(3, 5 - 1)),
      day: parseInt(date.slice(6, 10))
    };
    return dateObj;
  }

  /**
   * Get Date Method - Duplicate
   * @param dateString
   * @returns Date
   */
  getDa(dateString: any) {
    if (dateString != '00000000') {
      const year = +dateString.substring(0, 4);
      const month = +dateString.substring(4, 6);
      const day = +dateString.substring(6, 8);
      const date = new Date(year, month - 1, day);

      return date
    }
    else {
      return "";
    }

  }

  /**
   * Get Date wil Slash
   * @param value
   * @returns
   */
  getslashDate(value: any) {
    return value.split('/')[2] + value.split('/')[1] + value.split('/')[0];
  }

  /**
   * Get Hypen Date
   * @param value
   * @returns
   */
  getHypenDate(value: any) {
    if (value) {
      return value.split('-')[0] + value.split('-')[1] + value.split('-')[2];
    } else {
      return '';
    }
  }

  /**
   *
   * @param dateString Date String `(YYYYMMDD)` or Date object
   * @returns Date String `(DD/MM/YYYY)`
   */
  returnDate(dateString: string | Date | any) {
    if (!dateString) return '';
    if (dateString instanceof Date) {
      const day = ('0' + dateString.getDate()).slice(-2);
      const month = ('0' + (dateString.getMonth() + 1)).slice(-2);
      const year = dateString.getFullYear();
      return `${day}/${month}/${year}`;
    }
    if (typeof dateString === 'string') {
      return dateString.replace(/(\d{4})(\d{2})(\d{2})/g, '$3/$2/$1');
    }
    return '';
  }

  /**
   * Return the Current loggedIn User Details
   * @returns Object `{ userid: string , DeptId : stirng }`
   */
  getUserData() {
    this.UserIdAs = localStorage.getItem('ID');
    this.DepIdAs = localStorage.getItem('Dep');
    const data = {
      userid: atob(this.UserIdAs).toUpperCase(),
      DeptId: atob(this.DepIdAs),
      CommitteeId: localStorage.getItem('CMTID')
    };
    return data;
  }

  /**
   * Return the Current Logged in User Role
   * @returns Role
   */
  getRolefromLocal() {
    this.roleAs = localStorage.getItem('ROLERFP');
    return atob(this.roleAs);
  }

  /**
   * Return Status Text based on the Status Code
   * @param statusCode
   * @returns
   */
  returnStatus(statusCode: string) {

    switch (statusCode) {
      case "D":
        return this.translate.instant("RFP.Draft");

      case "R":
        return this.translate.instant("RFP.Returned");

      case "":
      case " ":
      case "0":
      case "S":
        return this.translate.instant("RFP.Submitted");

      case "1":
      case "A":
        return this.translate.instant("RFP.Approved");

      case "C":
        return this.translate.instant("COM.Completed");

      case 'Cancel':
        return this.translate.instant("RFP.Cancelled");

      case "N":
        return this.translate.instant("COM.New");

      case "2":
        return this.translate.instant("RFP.Rejected");

      case "3":
        return this.translate.instant("RFP.Pending");

      case "4":
        return this.translate.instant("RFP.Cancelled");

      default:
        return "";
    }
  }

  /**
   * Return Amount Type
   * @param projectType Project Type
   * @returns Project Type Description
   */
  returnAmtType(projectType: string) {
    if (projectType === "Opex") {
      return this.translate.instant("RFP.Opex");
    }
    if (projectType === "Capex") {
      return this.translate.instant("RFP.Capex");
    }
    if (projectType === "Supply") {
      return this.translate.instant("RFP.Supply");
    }
  }

  /**
   * Return the Number with commas
   * @param num Nummber
   * @returns Formated value
   */
  numberWithCommas(num: any) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Remove the Number with commas
   * @param num Number
   * @returns Formated value
   */
  removeCommas(num: any) {
    return num.toString().replace(/\,/g, '')
  }

  /**
   * Returns the Translated value for the Evaluation.
   *
   * @param value `Pass` | `Fail`
   * @returns Translated Value of Pass and Fail
   */
  returnResultStat(value: string): string {
    if (value === 'Pass') {
      return this.translate.instant('COM.Pass');
    } else if (value === 'Fail') {
      return this.translate.instant('COM.Fail');
    }
    else {
      return value;
    }
  }

  /**
   * Returns the Translated value for Technical Evaluation
   * @param value 'Pass' | 'Fail'
   * @returns Translated value
   */
  getTechScoreResult(value: 'Pass' | 'Fail') {
    if (value === 'Pass') {
      return this.translate.instant('COM.TechScorePass');
    }
    if (value === 'Fail') {
      return this.translate.instant('COM.TechScoreFail');
    }
    return value;
  }

  /**
   * Return Committe Status
   * @param tenderStatusCode
   * @returns
   */
  returnStatusComt(tenderStatusCode: string) {
    switch (tenderStatusCode) {
      case 'D':
        return this.translate.instant("RFP.Draft");

      case 'R':
        return this.translate.instant("COM.Rejected");

      case 'S':
        return this.translate.instant("RFP.Submitted");

      case 'A':
        return this.translate.instant("RFP.Approved");

      case 'C':
        return this.translate.instant("COM.Completed");

      case 'N':
      case '':
        return this.translate.instant("COM.InProgress");

      default:
        return '';
    }
  }

  /**
   * Return the Type of Envlope
   * @param tenderTypeId Tender Type Id
   * @returns Envlope Type
   */
  returnTypeOfEnvlope(tenderTypeId: string) {
    if (tenderTypeId === '01') {
      return this.translate.instant('COM.OneEnv');
    }
    if (tenderTypeId === '02') {
      return this.translate.instant('COM.TwoEnv');
    }
    return '';
  }

  /**
   * Return MOM Identifier
   * @param TendorTypeId Tendor Type Id
   * @param type Type
   * @returns Identifier
   */
  returnMomIdentifier(TendorTypeId: string, type: string) {
    if (type === 'TER') {
      return 'TER';
    }
    if (TendorTypeId === '01') {
      return '1E';
    }
    if (TendorTypeId === '02') {
      if (type === 'F') {
        return '2EF';
      }
      if (type === 'T') {
        return '2ET';
      }
    }
    return '';
  }

  /**
   * Return Purchase Type
   * @param PurchaseTypeId
   * @returns
   */
  returnPurchaseType(PurchaseTypeId: string) {
    if (PurchaseTypeId == 'D') {
      return this.translate.instant('COM.DirectPurchase');
    } else {
      return this.translate.instant('COM.RFPForTendering');
    }
  }

  /**
   * Return Department based on the Role
   * @param role Committee Role
   * @returns Department
   */
  returnDepartment(role: string) {

    switch (role) {
      case 'LM':
        return this.translate.instant('COM.LegMem');

      case 'TM':
        return this.translate.instant('COM.TechMem');

      case 'PM':
        return this.translate.instant('COM.ProcureMem');

      case 'FM':
        return this.translate.instant('COM.FinancialMem');

      case 'MR':
        return this.translate.instant('COM.MR');

      case 'MM':
        return this.translate.instant('COM.MM');

      default:
        return null
    }
  }

  getIndexZero(i: any) {
    if (i.length === 2) {
    }
  }

  /**
   * Download MOM Method
   * @param payload Document Download details
   * @param tenderName_commonName Document Name (Tender Name _ Common Name)
   */
  async downloadMOM(payload: doumentDownload, tenderName_commonName: string) {
    if (payload) {
      payload.LoggedInID = payload.LoggedInID ?? atob(localStorage.getItem("ID")!) ?? '';
      payload.LoggedCmt = payload.LoggedCmt ?? localStorage.getItem('CMTID') ?? '';
      payload.Role = payload.Role ?? localStorage.getItem("ROLEMG") ?? '';
    }
    this.spinner.show();
    await this.api.downloadPDF('downloadMOM', payload).subscribe(
      (res: any) => {
      this.spinner.hide()
      if (res) {
        const fileName = `${tenderName_commonName}_${this.getFormattedTime()}.pdf`;
        saveAs(new Blob([res]), fileName);
      }
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }

  downloadRfpEstmPricePdf(RfpNo:string,RfpVersion:string){
    let data = {
      RfpNo: RfpNo,
      RfpVersion: RfpVersion,
    };
    this.api
      .post('/RfpEstmPriceSet', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          let data = res.d.FileBase64
          this.saveBase64AsPdf(data, 'EstmPrice.pdf');
        },
        (error)=>{
          console.log(error)
        }
      )
  }

  private saveBase64AsPdf(base64: string, fileName: string) {
    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  showEsmPriceBtn(CwfDept:string, IsRfpRddApproved:string):boolean{
    if(CwfDept=='RDD'){
      return false
    }
    else{
      if(IsRfpRddApproved==''){
        return true
      }
      else{
        return false
      }
    }
  }

  getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return y + '-' + m + '-' + d;
    //return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
  }

  handleSuccessResponse(
    res = {},
    resTypeCode = 'MessType',
    resTypeEn = 'MessText',
    resTypeAr = 'MessTextAr'
  ) {
    let textToShow = '';
    if (
      _l.get(res, resTypeCode, null) === 'S' &&
      (_l.get(res, resTypeEn, '') || _l.get(res, resTypeAr, ''))
    ) {
      textToShow =
        this.userLanguage === 'ar' && _l.get(res, resTypeAr, '')
          ? _l.get(res, resTypeAr, '')
          : _l.get(res, resTypeEn, '');
    } else {
      textToShow = '';
    }
    if (textToShow) this.createMessage('success', textToShow);
  }

  truncate(num: any, places: any) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

  handleErrorResponse(
    res = {},
    resTypeCode = 'MessType',
    resTypeEn = 'MessText',
    resTypeAr = 'MessTextAr',
    showSnackbar = true
  ) {
    let textToShow = '';
    if (
      _l.get(res, resTypeCode, null) === 'E' &&
      (_l.get(res, resTypeEn, '') || _l.get(res, resTypeAr, ''))
    ) {
      textToShow =
        this.userLanguage === 'ar' && _l.get(res, resTypeAr, '')
          ? _l.get(res, resTypeAr, '')
          : _l.get(res, resTypeEn, '');
    } else if (
      _l.get(res, '[0].MessType', null) === 'E' &&
      (_l.get(res, '[0].MessText', '') || _l.get(res, '[0].MessTextAr', ''))
    ) {
      textToShow =
        this.userLanguage === 'ar' && _l.get(res, resTypeAr, '')
          ? _l.get(res, resTypeAr, '')
          : _l.get(res, resTypeEn, '');
    } else {
      textToShow = this.translate.instant('COMMON.SomethingWentWrong');
      console.warn('Smtng_WR', res);
    }
    showSnackbar ? this.createMessage('error', textToShow) : '';
  }

  transform(value: any): number {
    if (value) {
      let fval = value.toString().replace(/\s/g, '')

      value = fval.replaceAll(' ', '').replaceAll(',', '');
      return this.localeString(value).trim();
    }
    else {
      return 0;
    }
  }
  localeString(value: any) {
    if (value === '') return '';
    var parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  getCurrentUserLanguage(): Observable<string> {
    return this._currentUserLanguage.asObservable();
  }

  setCurrentUserLanguage(value: string) {
    return this._currentUserLanguage.next(value);
  }
  loadContractF4Data() {
    this.contApi.getContractF4Data();
  }

  searchFilter(list: any, searchData: any) {
    let filteredList = list.filter((item: any) =>
      (searchData?.ProjectName ? item.ProjectName.toLowerCase().indexOf(searchData?.ProjectName.toLowerCase()) !== -1 : true)
      && (searchData?.AwardNumber ? item.AwardNumber.toString().indexOf(searchData?.AwardNumber) !== -1 : true)
      && (searchData?.ProjectTypeId ? (item.ProjectTypeId == searchData?.ProjectTypeId) : true)
      && (searchData?.VendorName ? item.VendorName.toLowerCase().indexOf(searchData?.VendorName.toLowerCase()) !== -1 : true)
      && (searchData?.LegalHead ? item.LegalHead.toLowerCase().indexOf(searchData?.LegalHead.toLowerCase()) !== -1 : true)
      && (searchData?.LegalOfficer ? item.LegalOfficer.toLowerCase().indexOf(searchData?.LegalOfficer.toLowerCase()) !== -1 : true)
      && (searchData?.LoaDays ? (item.LoADays.toString().indexOf(searchData?.LoaDays) !== -1) : true)
      && (searchData?.Officer ? item.ConOfficer.toLowerCase().indexOf(searchData?.Officer.toLowerCase()) !== -1 : true)
      && (searchData?.StatusId ? (item.ContStatusId == searchData?.StatusId) : true)
      && (searchData?.PendingWithId ? (item.PendingWithId == searchData?.PendingWithId) : true)
      && (searchData?.dateFrom ? (searchData?.dateFrom <= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
      && (searchData?.dateTo ? (searchData?.dateTo >= new Date(moment(item.AwardDate, 'DD/MM/YYYY').format('YYYY-MM-DD')).getTime()) : true)
    );
    return filteredList;
  }

  calcValueFromPercentAndTotal(percentage: number, totalValue: number) {
    let perValue = ((percentage / 100) * totalValue);
    if((perValue % 1) != 0){
      perValue = this.truncateToPointTwo(perValue);
    }
    return perValue;
  }

  truncateToPointTwo(fractional: number) {
    let fractionIndex = fractional.toString().indexOf('.');
    let beforeDecimalStr = fractional.toString().slice(0, fractionIndex);
    let afterDecimalStr = fractional.toString().slice(fractionIndex, fractionIndex + 3);
    return Number(beforeDecimalStr + afterDecimalStr);
  }
  getBidsCount(): Observable<any> {
    return this.bidsCountDetails.asObservable();
  }

  setBidsCount(value: any): void {
    this.bidsCountDetails.next(value);
  }

  // * ***********   Converts the Property value from Number to String   *********** * //
  // * *********** Pass the Array contains the property and property name *********** * //
  // * *********** or array of property name which needs to be converted *********** * //
  convertNumberToString(array: any[], keys: string | string[]): any[] {

    if (typeof keys === 'string') {
      array.forEach((item) => {
        if (item[keys]) {
          item[keys] = item[keys].toString();
        }
      });
      return array;
    }

    if (typeof keys === 'object') {
      array.forEach((item) => {
        keys.forEach((key) => {
          if (item[key]) {
            item[key] = item[key].toString();
          }
        });
      });
      return array;
    }

    return array;
  }

  /**
* Checks whether the member in provided department is selected or not.
*
*
* @param memberList - List of Members
* @param department - Required Department
* @returns Based on the condition returns - true | false
*/
  isRequiredMemberChecked(memberList: MemberList[], department: Department[]): boolean {
    let uniqueMemberDepartments: any[] = [];
    memberList.forEach((member, index) => {
      if (index === memberList.findIndex(element => member.CommitteeRole == element.CommitteeRole)) {
        uniqueMemberDepartments.push(memberList[index].CommitteeRole)
      }
    });
    const missedDepartments = department.filter((dep) => {
      return !uniqueMemberDepartments.includes(dep)
    })
    if (missedDepartments.includes(Department['Legal Member'])) {
      this.createMessage("error", this.translate.instant("COM.legalError"));
      return false;
    }
    if (missedDepartments.includes(Department['Procurement Member'])) {
      this.createMessage("error", this.translate.instant("COM.ProcurementMemberRequired"));
      return false;
    }
    if (missedDepartments.includes(Department['Technical Member'])) {
      this.createMessage("error", this.translate.instant("COM.TechMemError"));
      return false;
    }
    if (missedDepartments.includes(Department['Finance Member'])) {
      this.createMessage("error", this.translate.instant("COM.FinanceMemberRequired"));
      return false;
    }
    return true;
  }

  /**
 * Get the Confirmation Message based on the User action
 * @param code - UserActionCode - Enum
 * @returns Translated Message
 */
  getConfimationMessage(code: UserActionCode | null): any {
    switch (code) {
      case UserActionCode.assign:
      case UserActionCode.assignToTechnicalMember:
      case UserActionCode.assignToBidQualificaiton:
      case UserActionCode.assignToBidOpening:
      case UserActionCode.assignToDirectPurchase:
      case UserActionCode.assignToBidOpeningCommittee:
      case UserActionCode.assignToBidEvalCommittee:
      case UserActionCode.asignBacktoMember:
      case UserActionCode.assignToTechCommittee:
      case UserActionCode.assignFinancemember:
        return this.translate.instant("COM.Do you want to Assign?");

      case UserActionCode.submit:
      case UserActionCode.submitToTechnicalMember:
      case UserActionCode.submitToProcurementMember:
      case UserActionCode.submitForFinalProcess:
      case UserActionCode.submitToLegalMember:
      case UserActionCode.submitToChairman:
        return this.translate.instant('COM.Do you want to Submit?');

      case UserActionCode.draft:
        return this.translate.instant('COM.Do you want to Save as Draft?');

      case UserActionCode.return:
      case UserActionCode.returnToProcurementMember:
      case UserActionCode.returnToLegal:
      case UserActionCode.returnToFinance:
      case UserActionCode.retrunToTechnical:
      case UserActionCode.returnToSecretary:
      case UserActionCode.reject:
        return this.translate.instant('COM.Do you want to Return?');

      case UserActionCode.approve:
      case UserActionCode.approveForExternal:
        return this.translate.instant('COM.Do you want to Approve?');

        case UserActionCode.cancelTender:
          return this.translate.instant('COM.Do you want to Cancel?');

      default:
        return this.translate.instant('COM.Do you want to Submit?');
    }
  }

  /**
 * Get the Modal Title based on the User action
 * @param code - UserActionCode - Enum
 * @returns Translated Modal Title
 */
  getConfimationModalTitle(code: UserActionCode | null): any {
    switch (code) {
      case UserActionCode.assign:
      case UserActionCode.assignToTechnicalMember:
      case UserActionCode.assignToBidQualificaiton:
      case UserActionCode.assignToBidOpening:
      case UserActionCode.assignToDirectPurchase:
      case UserActionCode.assignToBidOpeningCommittee:
      case UserActionCode.assignToBidEvalCommittee:
      case UserActionCode.asignBacktoMember:
      case UserActionCode.assignToTechCommittee:
      case UserActionCode.assignFinancemember:
        return this.translate.instant("assignConfirmation");

      case UserActionCode.submit:
      case UserActionCode.submitToTechnicalMember:
      case UserActionCode.submitToProcurementMember:
      case UserActionCode.submitForFinalProcess:
      case UserActionCode.submitToLegalMember:
      case UserActionCode.submitToChairman:
        return this.translate.instant("submitConfirmation");

      case UserActionCode.draft:
        return this.translate.instant("saveConfirmation");

      case UserActionCode.return:
      case UserActionCode.returnToProcurementMember:
      case UserActionCode.returnToLegal:
      case UserActionCode.returnToFinance:
      case UserActionCode.retrunToTechnical:
      case UserActionCode.returnToSecretary:
      case UserActionCode.reject:
        return this.translate.instant("returnConfirmation");

      case UserActionCode.approve:
      case UserActionCode.approveForExternal:
        return this.translate.instant('COM.confirmationApproval');

      case UserActionCode.cancelTender:
        return this.translate.instant('COM.cancelTender');

      default:
        return this.translate.instant('COM.Do you want to Submit?');
    }
  }

    /*
  // Example usage:
  const inputString = "144243";
  const { hours, minutes, seconds } = extractTimeFromString(inputString);

  console.log(`Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`);
  */
  extractTimeFromString(timeString: string): { hours: number; minutes: number; seconds: number } {
    const hours = parseInt(timeString.substring(0, 2));
    const minutes = parseInt(timeString.substring(2, 4));
    const seconds = parseInt(timeString.substring(4, 6));

    return { hours, minutes, seconds };
  }

  /**
   * Transforms date and time properties in a list of objects.
   * @param {any[]} list - The list of objects to transform.
   * @param {{ dateKeys: string[], timeKeys: string[] }} props - Configuration object with keys specifying date and time properties.
   * @returns {any[]} - A new list with transformed date and time properties.
   */
  transformDate(list: any[], props: { dateKeys: string[], timeKeys: string[] }) {
    let transformedList = [];

    transformedList = list.map(listItem => {
      const { dateKeys, timeKeys } = props;
      for (const timeKey of timeKeys) {
        listItem[timeKey] = this.extractTimeFromString(listItem[timeKey]);
      }

      for (const dateKey of dateKeys) {
        listItem[dateKey] = this.getDateNew(listItem[dateKey]);
        for (const timeKey of timeKeys) {
          const { hours, minutes, seconds } = listItem[timeKey];
          listItem[dateKey].setHours(hours, minutes, seconds);
        }
      }
    });

    return transformedList;
  }

  // Example usage:
  // console.log(isAlphanumeric("abc123")); // true
  // console.log(isAlphanumeric("abc!123")); // false
  public isAlphanumeric(str: string) {
    return /^[a-z0-9]+$/i.test(str);
  }

  /**
   * Update the SLA Options
   * @param processKey 
   */
  updateSLAOption(processKey: PROCESS_TYPES | PROCESS_TYPES[]): void {
    if (typeof processKey === 'object') {
      SLA_OPTIONS.forEach((option) => {
        if (processKey.includes(option.key)) {
          this.SLAOptions.push(option);
        }
      });
    }
    if (typeof processKey === 'string') {
      const object = SLA_OPTIONS.find((option) => option.key === processKey);
      if (object)
        this.SLAOptions.push(object);
    }
  }

  /**
   * Returns the SLA Option
   * @returns 
   */
  getSLAOption() {
    return this.SLAOptions;
  }

  /**
   * 
   * @param cmtID Logged in user's Committee ID
   * @returns Logged in user's Role based on Committee
   */
  getUserRoleBasedOnCmtID(cmtID: string): string {
    if (cmtID === '01') {
      return localStorage.getItem('ROLEOP') ?? '';
    }else if (cmtID === '02') {
      return localStorage.getItem('ROLEEV') ?? '';
    } else if (cmtID === '03') {
      return localStorage.getItem('ROLEQP') ?? '';
    } else if (cmtID === '04') {
      return localStorage.getItem('ROLEDP') ?? '';
    } else if (cmtID === '05') {
      return localStorage.getItem('ROLEMG') ?? '';
    } else if (cmtID === '06') {
      return localStorage.getItem('ROLETE') ?? '';
    } else {
      return ''
    }
  }

  otpToast(otpValue: any): void {
    if (environment.production) {
      this.createMessage(
        'success',
        this.userLanguage === 'en'
          ? otpValue.MessageEn
          : otpValue.MessageAr
      );
    } else {
      this.createMessage(
        'success',
        otpValue.OtpNo
      );
    }
  }

  
 
}
