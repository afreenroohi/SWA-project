import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/RFP/api.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _l from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

interface DocParamsLevels {
  firstLevelId: string,
  firstLevelName: string,
  secondLevelId: string,
  secondLevelName: string,
  thirdLevelId: string,
  operation: string,
  uploadedBy: string
}

@Component({
  selector: 'app-vp-cor-serv-details',
  templateUrl: './vp-cor-serv-details.component.html',
  styleUrls: ['./vp-cor-serv-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VpCorServDetailsComponent implements OnInit {
  ProxyUserId = 'TSUDHA';
  constructor(
    private router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
    private CDR: ChangeDetectorRef
  ) { }

  otp: any;
  getOTPModel: boolean = false;
  getOTPModelReject: boolean = false;

  user_name: any
  award_number: number = 0;
  contractDetails: any = [];
  commentsArray: any;
  showComments: boolean = false;
  project_name: any;
  approvePayload: any = [];
  contractType = '';

  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    Comment: new FormControl('', [Validators.required])
  });

  isVisible = false;
  isOkLoading = false;




  ngOnInit(): void {
    this.user_name = localStorage.getItem('ID')
    this.user_name = atob(this.user_name)
    this.spinner.show();
    this.award_number = history.state.award_number;
    this.project_name = history.state.project_name;
    this.getDetails(this.award_number);
    this.getComments(this.award_number);
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
          this.contractDetails = this.apiService.mappingDetails(res.d);
          //contract form
          this.ContractForm.get('ProjectName')?.setValue(this.contractDetails.ProjectName);
          this.ContractForm.get('ProjectType')?.setValue(this.contractDetails.ProjectType);
          this.ContractForm.get('AwardNumber')?.setValue(this.contractDetails.AwardNumber);
          this.ContractForm.get('AwardDate')?.setValue(this.contractDetails.AwardDate);
          this.ContractForm.get('VendorName')?.setValue(this.contractDetails.VendorName);
          this.contractType = this.contractDetails.ContractType;
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.router.navigateByUrl('contract/VpCorServDashboard')
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', 'You have been redirected to contract list')
      } else {
        this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
      }
    }
  }

  showHideComments(comments?: any) {
    // this.commentsArray = comments;
    this.showComments = !this.showComments;
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

  backToDashboard() {
    this.router.navigateByUrl('contract/VpCorServDashboard')
  }

  downloadPDF(flag: any) {
    this.apiService.downloadPDF(flag, this.award_number, this.contractType);
  }


  approve() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'APP';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus)
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Approved Successfully!')
        } else {
          this.message.create('success', "تم اعتماد العقد بنجاح!")
        }
        this.router.navigateByUrl('contract/VpCorServDashboard')
      }
    });
  }

  reject() {
    this.spinner.show();
    let conStatus = this.approvePayload.ContreqStatus;
    this.approvePayload.Flag = 'REJ';
    let data = this.approvePayload;
    let AwardNum = this.approvePayload.AwardNum;
    delete data.__metadata
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.spinner.hide();
        this.addComment(conStatus);
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Contract Rejected Successfully!')
        } else {
          this.message.create('success', 'تم رفض العقد بنجاح!')
        }
        this.router.navigateByUrl('contract/VpCorServDashboard')
      }
    });
  }

  addComment(status: any) {
    let dataComment = {
      data: {
        "Flag": "SUBMIT",
        "comment_id": "",
        "AwardNum": this.approvePayload.AwardNum,
        "Status": status,
        "Comment_by": this.user_name,
        "Role": "VP Corporate Services",
        // "Comments": "",
        "CommentsTxt": this.ContractForm.controls['Comment'].value
      },
      AwardNum: this.award_number
    }
    this.api.post('addComment', dataComment).subscribe((res) => {
      if (res == 201) {
        console.log("Comment added successfully")
      }
    })
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
          UploadedBy: new FormControl(''),
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
      operation: "C",
      uploadedBy: this.user_name
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
        UploadedBy: _l.get(_paramsForUpdate, 'uploadedBy', ''),
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

  returnDocParamsFromTypeView(_paramsForUpdate: any) {
    let docParams = {
      control: 'full',
      doDocsGet: true,
      multipleFiles: true,
      srcType: 'normal', //table
      displayMode: 'view', //view
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

  getAttachFormGroupView(_params: any): FormGroup {
    let attachFG = this.getFormGroup;
    let docParamsFromType = this.returnDocParamsFromTypeView(_params);
    attachFG.get('docParams')?.patchValue(docParamsFromType);
    return attachFG;
  }

  //*OTP Implementation starts
  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        // this.cs.createMessage("success", this.translate.instant("Contract.OTPvalidatedSucccessfully"))
        this.approve();
      }
      else if (data !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  SubmitOTPReject(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        // this.cs.createMessage("success", this.translate.instant("Contract.OTPvalidatedSucccessfully"))
        this.reject();
      }
      else if (data !== this.otp) {
        this.cs.createMessage("error", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }
  getOTP(flag: any) {
    let data = {
      UserId: this.cs.getUserData().userid
    }
    this.api.post("/OTP", data).subscribe((res: any) => {
      console.log(res.d.results.MessageId)
      if (res.d.results[0].MessageId === "S") {
        this.cs.otpToast(res.d.results[0])

        this.cs.createMessage('success', this.cs.userLanguage === 'en' ? res.d.results[0].OtpNo : res.d.results[0].OtpNo);
        this.message.success(this.translate.instant('COM.OTP') + ' : ' + res.d.results[0].OtpNo, {
          nzDuration: 10000
        });
        this.otp = res.d.results[0].OtpNo;
        if (flag == 'APP') {
          this.getOTPModel = !this.getOTPModel;
          this.CDR.detectChanges();
        } else if (flag == 'REJ') {
          this.getOTPModelReject = !this.getOTPModelReject;
          this.CDR.detectChanges();
        }

      }

      else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
        this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
      }
      else {
        this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
      }
    })

  }
  updateOTP(value: any) {
    console.log(value);
    this.getOTPModel = value;
    this.getOTPModelReject = value;


    if (value) {
      if (value === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
      }
      else if (value !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }
  //*OTP Implementation ends

}
