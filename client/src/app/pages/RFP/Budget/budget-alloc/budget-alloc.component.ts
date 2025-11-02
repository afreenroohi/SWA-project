import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { caseStatus, certs } from 'src/app/shared/shared';

@Component({
  selector: 'app-budget-alloc',
  templateUrl: './budget-alloc.component.html',
  styleUrls: ['./budget-alloc.component.scss']
})
export class BudgetAllocComponent implements OnInit {

  uploading = false;
  fileList: NzUploadFile[] = [];

  uploadedfiles: any[] = []

  slatt = 1;


  rfpForm: FormGroup;
  projects = caseStatus;
  Depts = caseStatus;
  ProjType = caseStatus;
  certs = certs;

  opex: any;
  capex: any;
  Supply: any;
  isUnplanned: boolean = false;

  fileNetList: any[] = [];
  expandIconPosition: 'left' | 'right' = 'right';

  attList?: FormArray;

  private readonly destroy$ = new Subject<void>();

  constructor(public cs: CommonService,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private currenyPipe: CommaSeparatePipe,
    private cd: ChangeDetectorRef) {

    this.rfpForm = this.fb.group({
      ProjectId: new FormControl('', [Validators.required]),
      TrfProjid: new FormControl('', [Validators.required]),
      AmtType: new FormControl('', [Validators.required]),
      Opex: ['', [Validators.required,Validators.min(1)]],
      Budamt: ['', [Validators.required,Validators.min(1)]],
      Capex: ['', [Validators.required,Validators.min(1)]],
      Supply: ['', [Validators.required,Validators.min(1)]],
      ProjJust: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      Unplanned: new FormControl(''),
      UpProjName: new FormControl(''),
      certt: new FormControl(''),

      Attachments: this.fb.array([])

    })
  }



  ngOnInit(): void {

    this.attList = this.rfpForm.get('Attachments') as FormArray;
    this.getProjs()
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };


  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.api.post("uploadfile", formData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {

        if (res.messageId == "S") {
          res.paths.forEach((res: any) => {
            this.uploadedfiles.push(res)
            this.attList?.push(this.createAttachs(res))
          })
          this.uploading = false;
          this.fileList = [];
          this.cs.createMessage("success", this.translate.instant('RFP.UploadSuccess'));
        }
      },
      (error) => {
        this.uploading = false;
        this.cs.createMessage("error", this.translate.instant('RFP.UploadFailed'));
      }
    );
  }

  get Attachments() {
    return (this.rfpForm.get('Attachments') as FormArray).controls;
  }


  handleProjTyChange(value: any) {
    this.capex = false;
    this.opex = false;
    this.Supply = false;

    this.rfpForm.controls['Capex'].removeValidators(Validators.required);
    this.rfpForm.controls['Capex'].updateValueAndValidity();
    this.rfpForm.controls['Opex'].removeValidators(Validators.required);
    this.rfpForm.controls['Opex'].updateValueAndValidity();
    this.rfpForm.controls['Supply'].removeValidators(Validators.required);
    this.rfpForm.controls['Supply'].updateValueAndValidity();



    if (value == 'C') {
      this.capex = true;
      this.rfpForm.controls['Capex'].setValidators([Validators.required,Validators.min(1)]);
      this.rfpForm.controls['Capex'].updateValueAndValidity();

    }
    else if (value == 'O') {
      this.opex = true;
      this.rfpForm.controls['Opex'].setValidators([Validators.required,Validators.min(1)]);
      this.rfpForm.controls['Opex'].updateValueAndValidity();
    }
    else if (value == 'S') {
      this.Supply = true;
      this.rfpForm.controls['Supply'].setValidators([Validators.required,Validators.min(1)]);
      this.rfpForm.controls['Supply'].updateValueAndValidity();
    }
  }
  submitCase() {
    this.rfpForm.markAllAsTouched();
    if (this.rfpForm.invalid) {
    }
    else {
      
      let data = {
        ProjId: this.rfpForm.controls['ProjectId'].value ? this.rfpForm.controls['ProjectId'].value : '',
        Justification: this.rfpForm.controls['ProjJust'].value ? this.rfpForm.controls['ProjJust'].value : '',
        ProjType: this.rfpForm.controls['AmtType'].value ? this.cs.removeCommas(this.rfpForm.controls['AmtType'].value.toString()) : '',
        ProjTypeAmt: "",
        TrfProjid: this.rfpForm.controls['TrfProjid'].value ? this.rfpForm.controls['TrfProjid'].value.toString() : '',
        TrfProjAmt: this.rfpForm.controls['Budamt'].value ? this.cs.removeCommas(this.rfpForm.controls['Budamt'].value.toString()) : '',
        Unplanned: this.rfpForm.controls['Unplanned'].value ? this.rfpForm.controls['Unplanned'].value === true ? 'X' : '' : '',
        UpProjName: this.rfpForm.controls['UpProjName'].value ? this.rfpForm.controls['UpProjName'].value.toString() : '',
        BaReqToBaNavg: this.fileNetList,
        CreatedBy: this.cs.getUserData().userid,
      }
      if (this.capex) {
        data.ProjTypeAmt = this.rfpForm.controls['Capex'].value ? this.cs.removeCommas(this.rfpForm.controls['Capex'].value.toString()) : '';
      }
      else if (this.opex) {
        data.ProjTypeAmt = this.rfpForm.controls['Opex'].value ? this.cs.removeCommas(this.rfpForm.controls['Opex'].value.toString()) : '';
      }
      else if (this.Supply) {
        data.ProjTypeAmt = this.rfpForm.controls['Supply'].value ? this.cs.removeCommas(this.rfpForm.controls['Supply'].value.toString()) : '';
      }
      if (data) {

        this.api.post('RfpBaHdr', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res.d.MessageId === 'S') {
            this.cs.createMessage('success', this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr)
            this.router.navigate(['rfp/budgetrequest']
              , {
                state: { ActiveTab: 'budget' }
              })
            this.cs.activeMenu = `budgetrequest`;
          }
          else {
            this.cs.createMessage('error', this.cs.userLanguage === "en" ? res.d.MessageEn : res.d.MessageAr)
          }
        }, (error) => {
          this.spinner.hide()
          this.cs.createMessage("error", error.statusText)

        })
      }


    }

  }


  handleManSwt(value: any) {
    if (value) {
      this.rfpForm.controls['TrfProjid'].removeValidators(Validators.required);
      this.rfpForm.controls['TrfProjid'].updateValueAndValidity()
    }
    else {
      this.rfpForm.controls['TrfProjid'].addValidators(Validators.required);
      this.rfpForm.controls['TrfProjid'].updateValueAndValidity()
    }
    this.isUnplanned = value;
  }


  createAttachs(data: any): FormGroup {
    let itnatt = this.slatt++;
    return this.fb.group({
      ProjId: this.rfpForm.controls['ProjectId'].value,
      TrfProjid: this.rfpForm.controls['TrfProjid'].value,
      ProjType: this.rfpForm.controls['AmtType'].value,
      AttchId: [data],
    });
  }

  transformComma(event: any, type: string) {
    const amountVal = event?.target?.value;
    this.rfpForm.controls[type].setValue(this.currenyPipe.transform(amountVal));
    this.rfpForm.controls[type].updateValueAndValidity();

  }


  async saveDocuments() {
    this.spinner.show()
    await this.uploadedfiles.forEach((res: any) => {
      this.attList?.push(this.createAttachs(res))
    })
    this.spinner.hide()
    this.cs.createMessage("success", "Uploaded Successfully")
  }

  removeDoc(i: number) {

    this.attList?.removeAt(i)
  }
  filenetUpload(evt: any) {
    this.fileNetList.push({
      ProjId: this.rfpForm.controls['ProjectId'].value,
      TrfProjid: this.rfpForm.controls['TrfProjid'].value,
      ProjType: this.rfpForm.controls['AmtType'].value,
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      // CommitteeId: this.CommitteeID,
      // CommitteeRole: this.role,
      // CommitteeUser: this.CommitteeName,
    })
  }

  fileSapUpload(evt: any) {
    this.fileNetList.push({
      ProjId: this.rfpForm.controls['ProjectId'].value,
      TrfProjid: this.rfpForm.controls['TrfProjid'].value,
      ProjType: this.rfpForm.controls['AmtType'].value,
      FilenetID: evt.Fileid,
      FileName: evt.Filename,
      // CommitteeId: this.CommitteeID,
      // CommitteeRole: this.role,
      // CommitteeUser: this.CommitteeName,
    })
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }

  restrictZero(event:any){
   

    if( event.target.value.length === 0 && event.key <= "0"){
     
      event.preventDefault();
    }

  }

  getProjs() {
    this.spinner.show()

    let data = {
      ProjId: '',
      CostCenter: localStorage.getItem("CC"),
      ControllingArea: localStorage.getItem("CA")
    }
    this.api.post('F4ProjIdSet', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.projects = res.d.results;

      this.spinner.hide()

    }, (error) => {
      this.spinner.hide()
      this.cs.createMessage("error", error.statusText)

    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
