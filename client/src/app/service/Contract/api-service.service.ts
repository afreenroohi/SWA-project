import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as saveAs from 'file-saver';
import { ApiService } from '../RFP/api.service';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) { }

  baseurl = environment.apiUrl;

  GMAIL_PATTERN = '^[\w.+\-]+@gmail\.com$';

  ContractF4Data: any;

  mappingCommonList(dataSet: any) {
    let data: any[] = [];
    if (dataSet?.length > 0) {
      dataSet?.forEach((res: any) => {
        const items = {
          ProjectName: res['ProjName'] ? res['ProjName'] : '',
          ProjectType: res['ProjType'] ? res['ProjType'] : '',
          ProjectTypeId: res['ProjType'] ? res['ProjType'] : '',
          ContractType: res['ProjType'] ? res['ProjType'] : '',
          AwardNumber: res['AwardNum'] ? res['AwardNum'] : '0',
          AwardDate: res['AwardDate'] ? moment(res['AwardDate'], 'YYYYMMDD').format('DD/MM/YYYY') : '',
          AwardAmount: res['TotalValue'] ? res['TotalValue'] : '0',
          VendorName: res['VendorName'] ? res['VendorName'] : '',
          ConOfficer: res['ContUo'] ? res['ContUo'] : '',
          ConOfficerAr: res['ContUoAr'] ? res['ContUoAr'] : '',
          LegalHead: res['LglUnitHead'] ? res['LglUnitHead'] : '',
          LegalOfficer: res['LglOffcier'] ? res['LglOffcier'] : '',
          LegalOfficerAr: res['LglOffcierAr'] ? res['LglOffcierAr'] : '',
          ConOffDate: res['ContUODate'] && moment(res['ContUODate'], 'YYYYMMDD').isValid() ? moment(res['ContUODate'], 'YYYYMMDD').format('DD/MM/YYYY') : '',
          LegOffDate: res['LglOffDate'] && moment(res['LglOffDate'], 'YYYYMMDD').isValid() ? moment(res['LglOffDate'], 'YYYYMMDD').format('DD/MM/YYYY') : '',
          ReqStatus: res['ContreqStatus'] ? res['ContreqStatus'] : '',
          ContStatus: res['ContStatus'] ? res['ContStatus'] : '',
          ContStatusId: res['ContStatus'] ? res['ContStatus'] : '',
          PendingWith: res['PendingWithUser'] ? res['PendingWithUser'] : '',
          PendingWithAR: res['PendingWithUser_AR'] ? res['PendingWithUser_AR'] : '',
          PendingWithId: res['PendingWith'] ? res['PendingWith'] : '',
          SLAAR: res['SLAAR'] ? res['SLAAR'] : '',
          SLAEN: res['SLAEN'] ? res['SLAEN'] : '',
          SLAIndicator: res['SLAIndicator'] ? res['SLAIndicator'] : ''
        }
        // if (items.ReqStatus == 'PCHA' || items.ReqStatus == 'PCHP') {
        //   items.PendingWith = 'Contract Unit Head';
        //   items.PendingWithId = 'CH';
        // } else if (items.ReqStatus == 'PCOP' || items.ReqStatus == 'RFAP' || items.ReqStatus == 'RRMI') {
        //   items.PendingWith = 'Contract Unit Officer';
        //   items.PendingWithId = 'CO';
        // } else if (items.ReqStatus == 'LMP1') {
        //   items.PendingWith = 'Legal Manager';
        //   items.PendingWithId = 'LM';
        // } else if ((items.ReqStatus == 'LUHP') || (items.ReqStatus == 'LOAP')) {
        //   items.PendingWith = 'Legal Unit Head';
        //   items.PendingWithId = 'LH';
        // } else if ((items.ReqStatus == 'LOP1') || (items.ReqStatus == 'LOAR') || (items.ReqStatus == 'LRMI')) {
        //   items.PendingWith = 'Legal Unit Officer';
        //   items.PendingWithId = 'LO';
        // } else if ((items.ReqStatus == 'RRMA') || (items.ReqStatus == 'RRMR')) {
        //   items.PendingWith = "Requestor's Manager";
        //   items.PendingWithId = 'RM';
        // } else if (items.ReqStatus == 'PCMA') {
        //   items.PendingWith = 'Contract Manager';
        //   items.PendingWithId = 'PM';
        // } else if (items.ReqStatus == 'PCDA') {
        //   items.PendingWith = 'Support Services Director';
        //   items.PendingWithId = 'SD';
        // } else if (items.ReqStatus == 'SSDA') {
        //   items.PendingWith = 'VP Corporate Director';
        //   items.PendingWithId = 'VP';
        // } else {
        //   items.PendingWith = this.translate.instant('N/A');
        //   items.PendingWithId = '';
        // }

        if (items.ContStatus == 'IN') {
          items.ContStatus = 'Initial'
        } else if (items.ContStatus == 'IP') {
          items.ContStatus = 'In Progress'
        } else if (items.ContStatus == 'CL') {
          items.ContStatus = 'Cancelled'
        } else if (items.ContStatus == 'CP' || items.ReqStatus == 'VPAP') {
          items.ContStatus = 'Completed'
        }else if (items.ContStatus == 'RJ') {
          items.ContStatus = 'Rejected'
        }

        if (items.ProjectType == 'G') {
          items.ProjectType = 'General Supply'
        } else if (items.ProjectType == 'P') {
          items.ProjectType = 'Public Services'
        } else if (items.ProjectType == 'I') {
          items.ProjectType = 'Information Technology'
        } else if (items.ProjectType == 'C') {
          items.ProjectType = 'Consulting Services'
        } else if (items.ProjectType == 'M') {
          items.ProjectType = 'Operating and Maintainance'
        } else if (items.ProjectType == 'E') {
          items.ProjectType = 'Engineering Services - Supervision'
        } else if (items.ProjectType == 'D') {
          items.ProjectType = 'Engineering Services - Design'
        } else if (items.ProjectType == 'F') {
          items.ProjectType = 'Framework Supply Agreement'
        } else if (items.ProjectType == 'T') {
          items.ProjectType = 'Framework Consulting Services Agreement Form'
        } else if (items.ProjectType == 'R') {
          items.ProjectType = 'Framework Service Agreement Form - General'
        } else {
          items.ProjectType = this.translate.instant('N/A');
        }

        data.push(items)
      });
    }
    return data;
  }

  mappingObjects(dataSet: any) {
    let data: any[] = [];
    if (dataSet?.length > 0) {
      dataSet?.forEach((res: any) => {
        const items = {
          ProjectName: res['ProjName'] ? res['ProjName'] : '',
          ProjectType: res['ProjType'] ? res['ProjType'] : '',
          ProjectTypeId: res['ProjType'] ? res['ProjType'] : '',
          AwardNumber: res['AwardNum'] ? res['AwardNum'] : '0',
          AwardDate: res['AwardDate'] ? moment(res['AwardDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
          AwardTime: res['AwardTime'] ? moment(res['AwardTime'], 'hhmmss').format('hh:mm A') : '',
          AwardAmount: res['TotalValue'] ? res['TotalValue'] : '0',
          VendorName: res['VendorName'] ? res['VendorName'] : '',
          LoADays: 0,
          ConOfficer: res['ContUo'] ? res['ContUo'] : '',
          ConOfficerAr: res['ContUoAr'] ? res['ContUoAr'] : '',
          LegalHead: res['LglUnitHead'] ? res['LglUnitHead'] : '',
          LegalOfficer: res['LglOffcier'] ? res['LglOffcier'] : '',
          LegalOfficerAr: res['LglOffcierAr'] ? res['LglOffcierAr'] : '',
          ConOffDate: res['ContUODate'] ? moment(res['ContUODate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
          LegOffDate: res['LglOffDate'] ? moment(res['LglOffDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
          ReqStatus: res['ContreqStatus'] ? res['ContreqStatus'] : '',
          SLAAR: res['SLAAR'] ? res['SLAAR'] : '',
          SLAEN: res['SLAEN'] ? res['SLAEN'] : '',
          SLAIndicator: res['SLAIndicator'] ? res['SLAIndicator'] : ''
        }

        if (items.ProjectType == 'G') {
          items.ProjectType = 'General Supply'
        } else if (items.ProjectType == 'P') {
          items.ProjectType = 'Public Services'
        } else if (items.ProjectType == 'I') {
          items.ProjectType = 'Information Technology'
        } else if (items.ProjectType == 'C') {
          items.ProjectType = 'Consulting Services'
        } else if (items.ProjectType == 'M') {
          items.ProjectType = 'Operating and Maintainance'
        } else if (items.ProjectType == 'E') {
          items.ProjectType = 'Engineering Services - Supervision'
        } else if (items.ProjectType == 'D') {
          items.ProjectType = 'Engineering Services - Design'
        } else if (items.ProjectType == 'F') {
          items.ProjectType = 'Framework Supply Agreement'
        } else if (items.ProjectType == 'T') {
          items.ProjectType = 'Framework Consulting Services Agreement Form'
        } else if (items.ProjectType == 'R') {
          items.ProjectType = 'Framework Service Agreement Form - General'
        } else {
          items.ProjectType = 'N/A'
        }

        let currentDate = new Date();
        let award_date = new Date(moment(res['AwardDate'], 'DD/MM/YYYY').format('MM-DD-YYYY'));
        items.LoADays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()) - Date.UTC(award_date.getFullYear(), award_date.getMonth() + 1, award_date.getDate())) / (1000 * 60 * 60 * 24));
        data.push(items);
      });
    }
    return data;
  }


  mappingDetails(res: any) {
    let data: { ProjectName: any; ProjectType: string; AwardNumber: any; AwardDate: string; AwardTime: string; VendorName: any; LoADays: number; AssignedOfficer: any; }[] = [];
    const items = {
      ContractStatus: res['ContreqStatus'] ? res['ContreqStatus'] : '',
      ProjectName: res['ProjName'] ? res['ProjName'] : '',
      ProjectType: res['ProjType'] ? res['ProjType'] : '',
      ContractType: res['ProjType'] ? res['ProjType'] : '',
      AwardNumber: res['AwardNum'] ? res['AwardNum'] : '',
      AwardDate: res['AwardDate'] != "00.00.0000" ? moment(res['AwardDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      AwardTime: res['AwardTime'] ? moment(res['AwardTime'], 'hhmmss').format('hh:mm A') : '',
      VendorName: res['VendorName'] ? res['VendorName'] : '',
      LoADays: 0,
      AssignedOfficer: res['ContUo'] ? res['ContUo'] : '',
      LegalOfficer: res['LglOffcier'] ? res['LglOffcier'] : '',
      ProjectDuration: res['DurationContr'] ? res['DurationContr'] : '',
      DurationTypeEN: res['DurationUnitEN'] ? res['DurationUnitEN'] : '',
      DurationTypeAR: res['DurationUnitAR'] ? res['DurationUnitAR'] : '',
      PRnumber: res['PurreqNum'] ? res['PurreqNum'] : '',
      ContractStartDate: res['ContStartDate'] != "00.00.0000" ? moment(res['ContStartDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      ContractStartText: res['DateTextBox'] ? res['DateTextBox'] : '',
      ContractStartToggle: res['DateTextFlag'] ? res['DateTextFlag'] : '',
      PrintAwardLetter: res['AwardLetter'] ? res['AwardLetter'] : '',
      PrintAwardDate: res['AwardDatePrint'] != "00.00.0000" ? moment(res['AwardDatePrint'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      RegType: res['VNDRREGTYPE'] ? res['VNDRREGTYPE'] : 'C',
      RegNumber: res['CommRegNum'] ? res['CommRegNum'] : '',
      ProcessDescription: res['BriefDescr'] ? res['BriefDescr'] : '',
      Amount: res['TotalValue'] ? res['TotalValue'] : '',
      AmountInEn: res['TotalAmtEn'] ? res['TotalAmtEn'] : '',
      AmountInAr: res['TotalAmtAr'] ? res['TotalAmtAr'] : '',
      BidNumber: res['RespBidNum'] ? res['RespBidNum'] : '',
      DateOfBid: res['RespBidNumDt'] != "00.00.0000" ? moment(res['RespBidNumDt'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      BankGuarantee: res['BankGuarantee'],
      BgNum: res['BgNum'] ? res['BgNum'] : 0,
      BgPercent: res['BgPercentage'] ? res['BgPercentage'] : '',
      BgAmount: res['BgAmount'] ? res['BgAmount'] : '',
      BgCurrency: res['BgCurrency'] ? res['BgCurrency'] : '',
      BgIssuedBy: res['BgIssuedBy'] ? res['BgIssuedBy'] : '',
      BgDate: res['BgDate'] != "00.00.0000" ? moment(res['BgDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      BgValid: res['BgValidDate'] != "00.00.0000" ? moment(res['BgValidDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      BgDateHijri: res['BgDateHijri'] != "00.00.0000" ? moment(res['BgDateHijri'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      BgDateCalender: res['BgDateCalender'] ? res['BgDateCalender'] : '',
      BgValidDateCal: res['BgValidDateCal'] ? res['BgValidDateCal'] : '',
      BgDateHijriWords: res['BgDateHijriWords'] ? res['BgDateHijriWords'] : '',
      DelName: res['DelegateName'] ? res['DelegateName'] : '',
      Nation: res['ComNationality'] ? res['ComNationality'] : '',
      IdType: res['IdType'] ? res['IdType'] : 'N',
      NationalId: res['IdNatId'] ? res['IdNatId'] : '',
      ResidenceId: res['IdResiNumber'] ? res['IdResiNumber'] : '',
      PassportId: res['IdPpNum'] ? res['IdPpNum'] : '',
      SignAuth: res['SignAuth'] ? res['SignAuth'] : '',
      AuthSelect: res['AuthSelect'] ? res['AuthSelect'] : '',
      AuthLetterNum: res['AuthLetterNum'] ? res['AuthLetterNum'] : '',
      AuthLetterDate: res['AuthLetterDate'] != "00.00.0000" ? moment(res['AuthLetterDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      PowerNum: res['PwrAtrnyNum'] ? res['PwrAtrnyNum'] : '',
      PowerDate: res['PwrAtrnyDate'] != "00.00.0000" ? moment(res['PwrAtrnyDate'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      conAddress: res['PermContrAdd'] ? res['PermContrAdd'] : '',
      conCity: res['ContrCity'] ? res['ContrCity'] : '',
      signCity: res['ContrSignCity'] ? res['ContrSignCity'] : '',
      FinalApproval: res['FinalApproval'] ? res['FinalApproval'] : '',
      company: res['VendCompanyInst'] ? res['VendCompanyInst'] : '',
      otherEntity: res['VendCompInstOther'] ? res['VendCompInstOther'] : '',
      conCountry: res['ContrCountry'] ? res['ContrCountry'] : '',
      conPhone: res['ContrPhone'] ? res['ContrPhone'] : '',
      mailBox: res['ContrMailBox'] ? res['ContrMailBox'] : '',
      postalCode: res['ContrPostalCode'] ? res['ContrPostalCode'] : '',
      eMail: res['ContrEmail'] ? res['ContrEmail'] : '',
      conBidNumber: res['BidNumSubVend'] ? res['BidNumSubVend'] : '',
      conDate: res['BidNumSubVendDt'] != "00.00.0000" ? moment(res['BidNumSubVendDt'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      conSignDate: res['DateSignContr'] != "00.00.0000" ? moment(res['DateSignContr'], 'DD.MM.YYYY').format('DD/MM/YYYY') : '',
      TextDuration: res['DurationText'] ? res['DurationText'] : '',
      PayText: res['PsText'] ? res['PsText'] : '',
      ProFirst: res['PowFirst'] ? res['PowFirst'] : '',
      ProSecond: res['PowSecond'] ? res['PowSecond'] : '',
      DownPay: res['Downpayment'] ? res['Downpayment'] : '',
      DurCompWrk: res['DurCompWrk'] ? res['DurCompWrk'] : '',
      DownRate: res['DownpayRate'] ? res['DownpayRate'] : 0,
      DownPercent: res['AdvancePercentage'] ? res['AdvancePercentage'] : 0,
      DownAmount: res['DownpayAmt'] ? res['DownpayAmt'] : '',
      EvalPeriod: res['EvaluationPeriod'] ? res['EvaluationPeriod'] : '',
      PenalltyTxtBox: res['PenalltyTxtBox'] ? res['PenalltyTxtBox'] : '',
      PenaltyFirst: res['TextFineSection'] ? res['TextFineSection'] : '',
      MtdCalcFines: res['MtdCalcFines'] ? res['MtdCalcFines'] : '',
      PenaltyPercent: res['PenaltyPercentage'] ? res['PenaltyPercentage'] : '',
      PenaltyThird: res['PenaltyThird'] ? res['PenaltyThird'] : '',
      ExtractFirst: res['TextExtractSection'] ? res['TextExtractSection'] : '',
      ExtractSecond: res['ExtractsSecond'] ? res['ExtractsSecond'] : '',
      ExtractThird: res['ExtractsThird'] ? res['ExtractsThird'] : '',
      QuantPrice: res['TableOfQunatPrice'] ? res['TableOfQunatPrice'] : '',
      Insurance: res['Insurance'] ? res['Insurance'] : '',
      WorkScope: res['ScopeOfWrk'] ? res['ScopeOfWrk'] : '',
      ExePlace: res['TextPlaceExeWork'] ? res['TextPlaceExeWork'] : '',
      SpecsTeam: res['TeamsSpec'] ? res['TeamsSpec'] : '',
      SpecsMat: res['MaterialSpec'] ? res['MaterialSpec'] : '',
      SpecsEqui: res['EquipSpec'] ? res['EquipSpec'] : '',
      SpecsWork: res['WorkCarryoutMethod'] ? res['WorkCarryoutMethod'] : '',
      SpecsQual: res['QualitySpec'] ? res['QualitySpec'] : '',
      SpecsSafety: res['SafetySpec'] ? res['SafetySpec'] : '',
      SpecsWorkGroup: res['WorkingGroup'] ? res['WorkingGroup'] : '',
      SpecsImplServ: res['MethodImpServ'] ? res['MethodImpServ'] : '',
      ContentMand: res['Mandterms'] ? res['Mandterms'] : '',
      ContentRatio: res['LocalContRatio'] ? res['LocalContRatio'] : '',
      ContentShare: res['NatProdShare'] ? res['NatProdShare'] : '',
      TermsInsur: res['InsuranceRqts'] ? res['InsuranceRqts'] : '',
      TermsHours: res['WorkHrs'] ? res['WorkHrs'] : '',
      TermsFollow: res['Followup'] ? res['Followup'] : '',
      TermsInsp: res['Inspection'] ? res['Inspection'] : '',
      TermsChart: res['SaveCharts'] ? res['SaveCharts'] : '',
      TermsTrain: res['SauTraining'] ? res['SauTraining'] : '',
      TermsReport: res['WrkProgRep'] ? res['WrkProgRep'] : '',

      Appendix: res['Appendix'] ? res['Appendix'] : '',
      Comment: res['Comments'] ? res['Comments'] : '',
      RetentionPeriod: res['RecRetPeriod'] ? res['RecRetPeriod'] : '',
      RenewalDays: res['MaxDaysRenLic'] ? res['MaxDaysRenLic'] : '',
      ArbitrationFirst: res['FirstArbitration'] ? res['FirstArbitration'] : '',
      ArbitrationSecond: res['SecondArbitration'] ? res['SecondArbitration'] : '',
      ArbitrationThird: res['ThirdArbitration'] ? res['ThirdArbitration'] : '',
      ResponsePeriod: res['ResponsePeriod'] ? res['ResponsePeriod'] : '',
      ResponseTime: res['RespTmCntPr'] ? res['RespTmCntPr'] : '',
      TermsAgrFirst: res['TrmsAgrFirst'] ? res['TrmsAgrFirst'] : '',
      TermsAgrSecond: res['TrmsAgrSecond'] ? res['TrmsAgrSecond'] : '',
      TermsAgrThird: res['TrmsAgrThird'] ? res['TrmsAgrThird'] : '',
      AgreePeriod: res['AgrPeriod'] ? res['AgrPeriod'] : '',
      NumberOfParties: res['NoOfParties'] ? res['NoOfParties'] : '',
      ReplacePeriod: res['PrdContRplRep'] ? res['PrdContRplRep'] : '',
      BusinessFirst: res['FirstSubSec'] ? res['FirstSubSec'] : '',
      BusinessSecond: res['SecondSubSec'] ? res['SecondSubSec'] : '',
      BusinessThird: res['ThirdSubSec'] ? res['ThirdSubSec'] : '',
      WorkProFirst: res['WrkPgmFirst'] ? res['WrkPgmFirst'] : '',
      WorkProSecond: res['WrkPgmSecond'] ? res['WrkPgmSecond'] : '',
      WorkProThird: res['WrkPgmThird'] ? res['WrkPgmThird'] : '',
      WorkProFourth: res['WrkPgmFourth'] ? res['WrkPgmFourth'] : '',
      ResolutionDays: res['TeschDisReslDys'] ? res['TeschDisReslDys'] : '',
      ContRespPeriod: res['RespPrdCnt'] ? res['RespPrdCnt'] : '',
      PriorNotifPerson: res['InabtyToImp'] ? res['InabtyToImp'] : '',
      InvoiceFirst: res['InvoiceFirst'] ? res['InvoiceFirst'] : '',
      InvoiceSecond: res['InvoiceSecond'] ? res['InvoiceSecond'] : '',
      InvoiceThird: res['InvoiceThird'] ? res['InvoiceThird'] : '',
      PricesFirst: res['RefToPrices'] ? res['RefToPrices'] : '',
      BenefFirst: res['Beneficiary'] ? res['Beneficiary'] : '',
      PerfEval: res['CntPerfEval'] ? res['CntPerfEval'] : '',
      DaysForAction: res['DaysForAction'] ? res['DaysForAction'] : '',
      Location: res['Location'] ? res['Location'] : '',
      WorkSite: res['WorkSite'] ? res['WorkSite'] : '',
      NatureSepclCond: res['SpeclCond'] ? res['SpeclCond'] : '',
      WorkSuppServ: res['SupportServices'] ? res['SupportServices'] : '',
      ServProgRep: res['ServiceProgRep'] ? res['ServiceProgRep'] : '',
      ProfRules: res['RulesPrinciples'] ? res['RulesPrinciples'] : '',
      WarrantPeriod: res['WarrantPeriod'] ? res['WarrantPeriod'] : '',
      ModernSkills: res['MdrnSkillsMthds'] ? res['MdrnSkillsMthds'] : '',
      PHtoRFP: res['PHtoRFP'] ? res['PHtoRFP'] : '',
      WeeklyPnltyPerctg: res['WeeklyPnltyPerctg'] ?? '',
      MaximumPnltyPerctg: res['MaximumPnltyPerctg'] ?? ''
    }

    if (items.ProjectType == 'G') {
      items.ProjectType = 'General Supply'
    } else if (items.ProjectType == 'P') {
      items.ProjectType = 'Public Services'
    } else if (items.ProjectType == 'I') {
      items.ProjectType = 'Information Technology'
    } else if (items.ProjectType == 'C') {
      items.ProjectType = 'Consulting Services'
    } else if (items.ProjectType == 'M') {
      items.ProjectType = 'Operating and Maintainance'
    } else if (items.ProjectType == 'E') {
      items.ProjectType = 'Engineering Services - Supervision'
    } else if (items.ProjectType == 'D') {
      items.ProjectType = 'Engineering Services - Design'
    } else if (items.ProjectType == 'F') {
      items.ProjectType = 'Framework Supply Agreement'
    } else if (items.ProjectType == 'T') {
      items.ProjectType = 'Framework Consulting Services Agreement Form'
    } else if (items.ProjectType == 'R') {
      items.ProjectType = 'Framework Service Agreement Form - General'
    } else {
      items.ProjectType = 'N/A'
    }

    let currentDate = new Date();
    let award_date = new Date(moment(res['AwardDate'], 'DD/MM/YYYY').format('MM-DD-YYYY'));
    items.LoADays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()) - Date.UTC(award_date.getFullYear(), award_date.getMonth() + 1, award_date.getDate())) / (1000 * 60 * 60 * 24));

    return items;
  }

  getContractF4Data(doShowLoad = false) {
    if (!this.ContractF4Data) {
      if (doShowLoad) this.spinner.show();
      forkJoin({
        ProjType: this.http.get(this.baseurl + 'api/F4ProjectType'),
        Status: this.http.get(this.baseurl + 'api/F4Status'),
        Role: this.http.get(this.baseurl + 'api/F4Roles')
      }).subscribe(({ ProjType, Status, Role }) => {
        if (doShowLoad) this.spinner.hide();
        let f4MapObj = {
          projectTypeList: ProjType,
          StatusList: Status,
          RoleList: Role
        }
        this.ContractF4Data = f4MapObj;
      });
    }
  }

  // download the contract pdf
  downloadPDF(flag: any, award_number: any, contract_type: any) {
    this.spinner.show();
    let data = {
      "AwardNum": award_number,
      "ContractType": contract_type
    }

    if (flag === 'download') {
      this.api.downloadPDF('/downloadPDF', data).subscribe((res: any) => {
        if (res) {
          this.spinner.hide();
          saveAs(new Blob([res]), award_number + '.pdf');
        }
      })
    } else {
      this.api.post('downloadPDFBase64', data).subscribe((res: any) => {
        if (res.d.FileBase64) {
          this.spinner.hide();
          var pdfResult = res.d.FileBase64;
          let pdfWindow = window.open("")
          pdfWindow?.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(pdfResult) + "'></iframe>");
        }
      });
    }
  }
}

