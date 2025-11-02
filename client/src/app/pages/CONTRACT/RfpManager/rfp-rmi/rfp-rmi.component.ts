import { Manpower } from './../../../../shared/shared';
import { Component, DoCheck, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import * as _l from 'lodash';
import * as moment from 'moment';

interface DocParamsLevels {
  firstLevelId: string,
  firstLevelName: string,
  secondLevelId: string,
  secondLevelName: string,
  thirdLevelId: string,
  operation: string,
}

@Component({
  selector: 'app-rfp-rmi',
  templateUrl: './rfp-rmi.component.html',
  styleUrls: ['./rfp-rmi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RfpRmiComponent implements OnInit {
  ProxyUserId = 'TSUDHA';
  constructor(
    private router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
  ) { }

  approvePayload: any = [];
  award_number: number = 0;
  project_name = '';
  checkedGuarantee: boolean = false;
  checkDown: boolean = false;
  selected = '';
  auth = '';
  fileList: NzUploadFile[] = [];
  uploading = false;
  isVisible = false;
  isOkLoading = false;
  contractDetails: any = [];

  commentsArray: any;
  showComments: boolean = false;

  selectAll = false;
  copyToList: any[] = [];

  //checked text areas
  checkPenalties = true;
  checkExtracts = true;
  checkTableQuant = true;
  checkScope = true;
  checkPlace = true;
  checkSpecs = true;
  checkContent = true;
  checkTerms = true;
  checkAppendix = true;

  showHideComments(comments?: any) {
    this.commentsArray = comments;
    this.showComments = !this.showComments;
  }

  countryList: any = [];

  listOfPayData: any = [];

  idList: any = ["National ID Number", "Residence Number", "Passport Number of Delegate"];
  delegateList: any = [];
  authList: any = ["Authorization letter certified by chamber of commerce and Industry", "The power of attorney issued by a notary public"]

  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    ProjectDuration: new FormControl({ value: '', disabled: true }),
    ContractStartDate: new FormControl({ value: '', disabled: true }),
    RegNumber: new FormControl({ value: '', disabled: true }),
    ProcessDescription: new FormControl({ value: '', disabled: true }),
    Amount: new FormControl({ value: '', disabled: true }),
    AmountInWords: new FormControl({ value: '', disabled: true }),
    BidNumber: new FormControl({ value: '', disabled: true }),
    DateOfBid: new FormControl({ value: '', disabled: true }),

    GuranteeNumber: new FormControl({ value: '', disabled: true }),
    GuranteeAmount: new FormControl({ value: '', disabled: true }),
    GuranteeIssuedBy: new FormControl({ value: '', disabled: true }),
    DateOfIssue: new FormControl({ value: '', disabled: true }),

    DeligateName: new FormControl({ value: '', disabled: true }),
    CommNation: new FormControl({ value: '', disabled: true }),
    proofId: new FormControl({ value: '', disabled: true }),
    NationalId: new FormControl({ value: '', disabled: true }),
    ResidenceNumber: new FormControl(''),
    PassportNumber: new FormControl({ value: '', disabled: true }),
    delegateStatus: new FormControl({ value: 'Select the delegate status', disabled: true }),

    authLetter: new FormControl({ value: '', disabled: true }),
    authLetterNumber: new FormControl({ value: '', disabled: true }),
    authLetterDate: new FormControl({ value: '', disabled: true }),
    powerNumber: new FormControl({ value: '', disabled: true }),
    powerDate: new FormControl({ value: '', disabled: true }),

    conAddress: new FormControl({ value: '', disabled: true }),
    conCity: new FormControl({ value: '', disabled: true }),
    conCountry: new FormControl({ value: '', disabled: true }),
    conPhone: new FormControl({ value: '', disabled: true }),
    mailBox: new FormControl({ value: '', disabled: true }),
    postalCode: new FormControl({ value: '', disabled: true }),
    eMail: new FormControl({ value: '', disabled: true }),
    conBidNumber: new FormControl({ value: '', disabled: true }),
    conDate: new FormControl({ value: '', disabled: true }),
    conSignDate: new FormControl({ value: '', disabled: true }),
    conSignDay: new FormControl({ value: '', disabled: true }),

    durationWork: new FormControl({ value: '', disabled: true }),
    proFirst: new FormControl({ value: '', disabled: true },),
    proSecond: new FormControl({ value: '', disabled: true },),

    downRate: new FormControl({ value: '', disabled: true }),
    downAmount: new FormControl({ value: '', disabled: true }),

    FineFirst: new FormControl({ value: '', disabled: true }),
    FineThird: new FormControl({ value: '', disabled: true }),
    ExtractFirst: new FormControl({ value: '', disabled: true }),
    ExtractSecond: new FormControl({ value: '', disabled: true }),
    ExtractThird: new FormControl({ value: '', disabled: true }),
    TableQP: new FormControl({ value: '', disabled: true }),
    WorkScope: new FormControl({ value: '', disabled: true }),
    ExePlace: new FormControl({ value: '', disabled: true }),
    Specs: new FormControl({ value: '', disabled: true }),
    ContentReq: new FormControl({ value: '', disabled: true }),
    DetailedTerm: new FormControl({ value: '', disabled: true }),
    PaySchedule: new FormControl({ value: '', disabled: true }),
    Accessories: new FormControl({ value: '', disabled: true }),
    Comment: new FormControl('Comment', [Validators.required]),
    ManPower: new FormArray([]),
    ContPayment: new FormArray([])
  });

  selectedNation = "";
  listOfManPowerData: any[] = [];
  listOfContPaymentData: any[] = [];
  jobTitle = '';
  qualification = '';
  experience = '';

  ngOnInit(): void {
    this.spinner.show();
    // this.award_number = history.state.award_number;
    // this.project_name = history.state.project_name;
    this.award_number = 4700001101;
    this.project_name = 'YestYourref';
    this.getDetails(this.award_number);
    this.getDeptList();
    this.getManPower(this.award_number);
    this.getCountryList();
    this.getContractPayment(this.award_number);
    this.getComments(this.award_number);
    this.getCopyOfContract(this.award_number);
  }

  getCopyOfContract(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getCopyOfContract", AwardNum).subscribe(
      (res) => {
        this.checkPenalties = (res.d.Penalties == 'X') ? true : false;
        this.checkExtracts = (res.d.Extracts == 'X') ? true : false;
        this.checkTableQuant = (res.d.QuantDPrice == 'X') ? true : false;
        this.checkScope = (res.d.ScopeOfWork == 'X') ? true : false;
        this.checkPlace = (res.d.ExecutionOfWork == 'X') ? true : false;
        this.checkSpecs = (res.d.ScopeOfWork == 'X') ? true : false;
        this.checkContent = (res.d.ContentReq == 'X') ? true : false;
        this.checkTerms = (res.d.DetailedTerms == 'X') ? true : false;
        this.checkAppendix = (res.d.Appendix == 'X') ? true : false;
      });
  }

  getDetails(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    //api call for detail of contract
    if (this.award_number) {
      this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
      this.api.post("getDetails", { ...AwardNum, userName: this.ProxyUserId }).subscribe(
        (res) => {
          this.approvePayload = res.d;
          this.spinner.hide();
          this.contractDetails = this.apiService.mappingDetails(res.d);
          this.mapObjectToForm(this.contractDetails);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.spinner.hide();
      this.router.navigateByUrl('contract/RfpManagerDashboard/Rmi')
      this.message.create('error', 'you have been redirected to contract list')

    }
  }
  mapObjectToForm(obj: any) {
    if (obj.BankGuarantee == 'Yes') {
      this.checkedGuarantee = true;
    } else if (obj.BankGuarantee == 'No') {
      this.checkedGuarantee = false;
    }


    //contract form
    this.ContractForm.get('ProjectName')?.setValue(obj.ProjectName);
    this.ContractForm.get('ProjectType')?.setValue(obj.ProjectType);
    this.ContractForm.get('AwardNumber')?.setValue(obj.AwardNumber);
    this.ContractForm.get('AwardDate')?.setValue(obj.AwardDate);
    this.ContractForm.get('VendorName')?.setValue(obj.VendorName);
    this.ContractForm.get('ProjectDuration')?.setValue(obj.ProjectDuration);
    this.ContractForm.get('ContractStartDate')?.setValue(obj.ContractStartDate);
    this.ContractForm.get('RegNumber')?.setValue(obj.RegNumber);
    this.ContractForm.get('ProcessDescription')?.setValue(obj.ProcessDescription);
    this.ContractForm.get('Amount')?.setValue(obj.Amount);
    // this.ContractForm.get('AmountInWords')?.setValue(converter.toWords(obj.Amount));
    this.ContractForm.get('BidNumber')?.setValue(obj.BidNumber)
    this.ContractForm.get('DateOfBid')?.setValue(obj.DateOfBid);
    this.ContractForm.get('conAddress')?.setValue(obj.conAddress);
    this.ContractForm.get('conCity')?.setValue(obj.conCity);
    this.ContractForm.get('conCountry')?.setValue(obj.conCountry);
    this.ContractForm.get('conPhone')?.setValue(obj.conPhone);
    this.ContractForm.get('mailBox')?.setValue(obj.mailBox);
    this.ContractForm.get('postalCode')?.setValue(obj.postalCode);
    this.ContractForm.get('eMail')?.setValue(obj.eMail);
    this.ContractForm.get('conBidNumber')?.setValue(obj.conBidNumber);
    this.ContractForm.get('conDate')?.setValue(obj.conDate);
    this.ContractForm.get('conSignDate')?.setValue(obj.conSignDate);
    this.ContractForm.get('conSignDay')?.setValue('');
    this.ContractForm.get('GuranteeNumber')?.setValue(obj.BgNum);
    this.ContractForm.get('GuranteeAmount')?.setValue(obj.BgAmount);
    this.ContractForm.get('GuranteeIssuedBy')?.setValue(obj.BgIssuedBy);
    this.ContractForm.get('DateOfIssue')?.setValue(obj.BgDate);
    this.ContractForm.get('DeligateName')?.setValue(obj.DelName);
    this.ContractForm.get('CommNation')?.setValue(obj.Nation);
    this.ContractForm.get('NationalId')?.setValue(obj.NationalId);
    this.ContractForm.get('ResidenceNumber')?.setValue(obj.ResidenceId);
    this.ContractForm.get('PassportNumber')?.setValue(obj.PassportId);
    this.ContractForm.get('authLetterNumber')?.setValue(obj.AuthLetterNum);
    this.ContractForm.get('authLetterDate')?.setValue(obj.AuthLetterDate);
    this.ContractForm.get('proFirst')?.setValue(obj.ProFirst);
    this.ContractForm.get('proSecond')?.setValue(obj.ProSecond);
    this.ContractForm.get('downRate')?.setValue(obj.DownRate);
    this.ContractForm.get('downAmount')?.setValue(obj.DownAmount);
    this.ContractForm.get('FineFirst')?.setValue(obj.PenaltyFirst);
    this.ContractForm.get('FineThird')?.setValue(obj.PenaltyThird);
    this.ContractForm.get('ExtractFirst')?.setValue(obj.ExtractFirst);
    this.ContractForm.get('ExtractSecond')?.setValue(obj.ExtractSecond);
    this.ContractForm.get('ExtractThird')?.setValue(obj.ExtractThird);
    this.ContractForm.get('TableQP')?.setValue(obj.QuantPrice);
    this.ContractForm.get('WorkScope')?.setValue(obj.WorkScope);
    this.ContractForm.get('ExePlace')?.setValue(obj.ExePlace);
    this.ContractForm.get('Specs')?.setValue(obj.Specs);
    this.ContractForm.get('ContentReq')?.setValue(obj.Content);
    this.ContractForm.get('DetailedTerm')?.setValue(obj.Terms);
    this.ContractForm.get('Accessories')?.setValue(obj.Appendix);





    this.selectedNation = obj.Nation;
    if (obj.NationalId != "") {
      this.selected = "National ID Number";
      this.ContractForm.get('proofId')?.setValue(this.selected);
    } else if (obj.ResidenceId != "") {
      this.selected = "Residence Number";
      this.ContractForm.get('proofId')?.setValue(this.selected);
    } else if (obj.PassportId != "") {
      this.selected = "Passport Number of Delegate";
      this.ContractForm.get('proofId')?.setValue(this.selected);
    }

    if (obj.AuthLetterNum != 0) {
      this.auth = "Authorization letter certified by chamber of commerce and Industry";
      this.ContractForm.get('authLetter')?.setValue(this.auth)
    }

    if (obj.DownPay == 'Y') {
      this.checkDown = true;
    } else {
      this.checkDown = false;
    }
  }

  getDeptList() {
    this.api.post("getDeptList", this.award_number).subscribe(
      (res) => {
        let list = res.d.results;
        list.forEach((l: any) => {
          let item = {
            "value": l.department,
            "isSelected": false
          }
          this.copyToList.push(item);
        })
      }
    )
  }

  getCountryList() {
    this.api.post("getCountryList", this.award_number).subscribe(
      (res) => {
        let list = res.d.results;
        list.forEach((l: any) => {
          this.countryList.push(l.Landx50);
        })
        this.countryList.sort();
        this.countryList[0] = 'Saudi Arabia';
      }
    )
  }

  getManPower(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }

    this.api.post("getManPower", AwardNum).subscribe(
      (res) => {
        this.listOfManPowerData = res.d.results;
        this.mapObjectToFormManPower(this.listOfManPowerData);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  mapObjectToFormManPower(data: any) {
    const ManPower = this.ContractForm.get('ManPower') as FormArray;
    this.listOfManPowerData = [];
    this.Manpower.clear();
    data.forEach((item: any) => {
      ManPower.push(
        new FormGroup({
          Amount: new FormControl(item.Amount),
          ExpBasicHr: new FormControl(item.ExpBasicHr),
          ExpOvertime: new FormControl(item.ExpOvertime),
          ItemNo: new FormControl(item.ItemNo, Validators.required),
          JobTitle: new FormControl(item.JobTitle, Validators.required),
          RfpNo: new FormControl(item.RfpNo),
          RfpVersion: new FormControl(item.RfpVersion),
          SpeDuties: new FormControl(item.SpeDuties),
          SpeExp: new FormControl(item.SpeExp, Validators.required),
          SpeQualf: new FormControl(item.SpeQualf, Validators.required)
        })
      )
    });
    // console.log(this.ContractForm.controls['ManPower'].value);
  }

  getContractPayment(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getContractPayment", AwardNum).subscribe(
      (res) => {
        console.log(res);
        this.listOfContPaymentData = res.d.results;
        this.mapObjectToFormContPayment(this.listOfContPaymentData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getComments(award_number: any) {
    let AwardNum = {
      "award_number": award_number
    }
    this.api.post("getComments", AwardNum).subscribe(
      (res) => {
        this.commentsArray = res.d.results;
      },
      (err) => {
        console.log(err);
      });
  }
  mapObjectToFormContPayment(data: any) {
    const ContPayment = this.ContractForm.get('ContPayment') as FormArray;
    data.forEach((item: any) => {
      ContPayment.push(
        new FormGroup({
          Amount: new FormControl(parseFloat(item.Amount)),
          ContractNo: new FormControl(item.ContractNo),
          Descr: new FormControl(item.Descr),
          ItemNo: new FormControl(item.ItemNo),
          Percentage: new FormControl(item.Percentage),
          PhaseName: new FormControl(item.PhaseName),
        })
      )
    });
  }

  backToDashboard() {
    this.router.navigateByUrl('contract/RfpManagerDashboard/Rmi')
  }

  submit() { }

  addComment() {
    let dataComment = {
      data: {
        AwardNum: this.approvePayload.AwardNum,
        Status: this.approvePayload.ContreqStatus,
        Commenter: "Legal Unit Officer",
        Role: "",
        // Comments: this.ContractForm.controls['Comment'].value
      },
      AwardNum: this.approvePayload.AwardNum,
      Status: this.approvePayload.ContreqStatus
    }
    this.api.post('addComment', dataComment).subscribe((res) => {
      if (res == 204) {
        console.log("Comment added successfully")
      }
    })
  }

  get Manpower() {
    return this.ContractForm.get('ManPower') as FormArray;
  }
  get ContPayment() {
    return this.ContractForm.get('ContPayment') as FormArray;
  }

  @Output()
  paramsForDocHandle = new EventEmitter();

  onFileUpload(_event: any, _doc: any) {
    console.log(_event, _doc);
  }
  get getFormGroup(): FormGroup {
    return new FormGroup({
      AttachGuid: new FormControl(''),
      documentsList: new FormArray([]),
      docParams: new FormGroup({
        control: new FormControl(''),
        doDocsGet: new FormControl(''),
        multipleFiles: new FormControl(''),
        srcType: new FormControl(''),
        displayMode: new FormControl(''),
        docParams: new FormGroup({
          Origin: new FormControl(''),
          ProfileId: new FormControl(''),
          UserId: new FormControl(''),
          HeaderKey: new FormControl(''),
          ItemKey: new FormControl(''),
          ItemSecKey: new FormControl(''),
          EntityId: new FormControl(''),
          EntityName: new FormControl(''),
          RelatedEntityId: new FormControl(''),
          RelatedEntityName: new FormControl(''),
          DefId: new FormControl(''),
          DocId: new FormControl(''),
          DocName: new FormControl(''),
          operationType: new FormControl(''),
        }),
      }),
    });
  }

  get createFGParams(): DocParamsLevels {
    return {
      firstLevelName: 'P2PContract',
      firstLevelId: this.award_number.toString(),
      secondLevelName: 'P2PContractAward',
      secondLevelId: this.award_number.toString(),
      thirdLevelId: this.award_number.toString(),
      operation: "C"
    }
  }
  returnDocParamsFromTypeIds(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //table
      displayMode: 'edit', //view
      docParams: {
        HeaderKey: "P2PCommitte",
        ItemKey: "VendorEval",
        EntityId: _l.get(_paramsForUpdate, 'firstLevelId', ''),
        EntityName: _l.get(_paramsForUpdate, 'firstLevelName', ''),
        RelatedEntityName: _l.get(_paramsForUpdate, 'secondLevelName', ''),
        RelatedEntityId: _l.get(_paramsForUpdate, 'secondLevelId', ''),
        DefId: _l.get(_paramsForUpdate, 'thirdLevelId', ''),
        DocName: "",
        FileNetId: "",
        Origin: "P2P",
        UploadedBy: "",
        UploadedOn: "",
        MimeDocType: "text/xml",
        Operation: _l.get(_paramsForUpdate, 'operation', ''),
        GuiId: "",
        ContentSize: 0
      },
    };
    return docParams;
  }
  getAttachFormGroup(_params: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeIds(_params);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    return attachFG;
  }

}
