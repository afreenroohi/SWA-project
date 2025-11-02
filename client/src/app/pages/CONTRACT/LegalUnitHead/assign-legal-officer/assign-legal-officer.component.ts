import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';
import { ApiServiceService } from 'src/app/service/Contract/api-service.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import * as _l from 'lodash';

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
  selector: 'app-assign-legal-officer',
  templateUrl: './assign-legal-officer.component.html',
  styleUrls: ['./assign-legal-officer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignLegalOfficerComponent implements OnInit {
  ProxyUserId = 'TSUDHA';

  ContractForm: FormGroup = new FormGroup({
    ProjectName: new FormControl({ value: '', disabled: true }),
    ProjectType: new FormControl({ value: '', disabled: true }),
    AwardNumber: new FormControl({ value: '', disabled: true }),
    PRnumber: new FormControl({ value: '', disabled: true }),
    AwardDate: new FormControl({ value: '', disabled: true }),
    VendorName: new FormControl({ value: '', disabled: true }),
    ProjectDuration: new FormControl({ value: '', disabled: true }),
    ContractStartDate: new FormControl({ value: '', disabled: true }),
    RegNumber: new FormControl({ value: '', disabled: true }),
    ProcessDescription: new FormControl({ value: '', disabled: true }),
    Amount: new FormControl({ value: '', disabled: true }),
    AmountInWords: new FormControl({ value: '', disabled: true }),
    Comment: new FormControl('', [Validators.required])
  });


  constructor(
    private router: Router,
    public cs: CommonService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private apiService: ApiServiceService,
    private message: NzMessageService,
  ) {
    this.cs.getCurrentUserLanguage().subscribe((lang: string) => {
      if (lang == 'ar') {
        this.ContractForm.get('AmountInWords')?.setValue(
          this.contractDetails.AmountInAr
        );
      } else {
        this.ContractForm.get('AmountInWords')?.setValue(
          this.contractDetails.AmountInEn
        );
      }
    });
  }

  user_name: any;
  award_number: number = 0;
  contractDetails: any = [];
  commentsArray: any;
  showComments: boolean = false;
  project_name: any;
  isCommNum: boolean = true;

  isVisible = false;
  isOkLoading = false;

  list: any[] = [];
  officerListEn: any = [];
  officerListAr: any = [];
  officerList: any = [];
  selectedOfficer = '';
  assignPayload: any = [];
  contractType = '';

  log(event: any) {
    console.log(this.selectedOfficer);
  }

  showHideComments(comments?: any) {
    this.commentsArray = comments;
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


  ngOnInit(): void {
    this.user_name = localStorage.getItem('ID')
    this.user_name = atob(this.user_name)
    this.spinner.show();
    this.award_number = history.state.award_number;
    this.project_name = history.state.project_name;
    this.getDetails(this.award_number);
    this.getComments(this.award_number);
    this.getOfficerList();
  }

  ngDoCheck() {
    if (this.cs.userLanguage == 'en') {
      this.officerList = this.officerListEn;
    } else {
      this.officerList = this.officerListAr;
    }

    // if (this.cs.userLanguage == 'ar') {
    //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInAr);
    // } else {
    //   this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInEn);
    // }
  }

  getOfficerList() {
    let officer = {
      "officer": 'LO'
    }
    this.api.post("getOfficerList", officer).subscribe(
      (res) => {
        this.list = res.d.results;
        this.list.forEach((off: any) => {
          this.officerListEn.push(off.EmpName);
          this.officerListAr.push(off.EmpName2)
        })
        if (this.cs.userLanguage == 'en') {
          this.officerList = this.officerListEn;
        } else {
          this.officerList = this.officerListAr;
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
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
          this.assignPayload = res.d;
          this.contractDetails = this.apiService.mappingDetails(res.d);
          //contract form
          this.ContractForm.get('ProjectName')?.setValue(this.contractDetails.ProjectName);
          this.ContractForm.get('ProjectType')?.setValue(this.contractDetails.ProjectType);
          this.ContractForm.get('AwardNumber')?.setValue(this.contractDetails.AwardNumber);
          this.ContractForm.get('AwardDate')?.setValue(this.contractDetails.AwardDate);
          this.ContractForm.get('PRnumber')?.setValue(this.contractDetails.PRnumber);
          this.ContractForm.get('VendorName')?.setValue(this.contractDetails.VendorName);
          this.ContractForm.get('ProjectDuration')?.setValue(this.contractDetails.ProjectDuration);
          this.ContractForm.get('ContractStartDate')?.setValue(this.contractDetails.ContractStartDate);
          this.ContractForm.get('RegNumber')?.setValue(this.contractDetails.RegNumber);
          this.ContractForm.get('ProcessDescription')?.setValue(this.contractDetails.ProcessDescription);
          this.ContractForm.get('Amount')?.setValue(this.contractDetails.Amount);
          // this.ContractForm.get('Comment')?.setValue(this.contractDetails.Comment);

          this.contractType = this.contractDetails.ContractType;
          this.isCommNum = this.contractDetails.RegType == 'C' ? true : false;
          if (this.cs.userLanguage == 'ar') {
            this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInAr);
          } else {
            this.ContractForm.get('AmountInWords')?.setValue(this.contractDetails.AmountInEn);
          }
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.router.navigateByUrl('contract/legalHeadDashboard/assign')
      if (this.cs.userLanguage == 'en') {
        this.message.create('error', 'You have been redirected to contract list')
      } else {
        this.message.create('error', "تمت إعادة توجيهك إلى قائمة العقود")
      }
    }
  }

  asignOfficer() {
    this.isVisible = true;
  }

  handleOk(): void {
    let conStatus = this.assignPayload.ContreqStatus;
    this.isOkLoading = true;
    this.assignPayload.Flag = "ASSIGN";
    this.assignPayload.LglOffcier = this.selectedOfficer;
    this.list.forEach((off: any) => {
      if (off.EmpName == this.selectedOfficer || off.EmpName2 == this.selectedOfficer) {
        this.assignPayload.LglOffcierUsrId = off.UserId;
      }
    })
    let data = this.assignPayload;
    let AwardNum = this.assignPayload.AwardNum;
    delete data.__metadata
    this.ProxyUserId = atob(localStorage.getItem('ID') ?? '');
    let dataPay = {
      data: data,
      AwardNum: AwardNum,
      userName: this.ProxyUserId,
    };
    this.api.post('assignOfficer', dataPay).subscribe((res) => {
      if (res == 204) {
        this.addComment(conStatus);
        this.isVisible = false;
        if (this.cs.userLanguage == 'en') {
          this.message.create('success', 'Legal Unit Officer assigned successfully')
        } else {
          this.message.create('success', 'تم تعيين موظف الوحدة القانونية بنجاح')
        }
        this.router.navigateByUrl('contract/legalHeadDashboard/assign')
      }
    });
  }

  addComment(status: any) {
    let dataComment = {
      data: {
        "Flag": "SUBMIT",
        "comment_id": "",
        "AwardNum": this.assignPayload.AwardNum,
        "Status": status,
        "Comment_by": this.user_name,
        "Role": "Legal Unit Head",
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

  handleCancel(): void {
    this.isVisible = false;
  }

  backToDashboard() {
    this.router.navigateByUrl('contract/legalHeadDashboard/assign')
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

}
