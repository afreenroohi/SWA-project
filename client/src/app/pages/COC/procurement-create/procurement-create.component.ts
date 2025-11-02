import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-procurement-create',
  templateUrl: './procurement-create.component.html',
  styleUrls: ['./procurement-create.component.scss']
})
export class ProcurementCreateComponent implements OnInit {

  CocForm!: FormGroup;
  CocDetails: any;
  uploading = false;
  fileList: NzUploadFile[] = [];
  uploadedfiles : any[] = []
  dateFormat = 'yyyy/MM/dd';
  nonEdit = false;

  RetnAmt: any;
  cocINtAmt: any;

  PoIssueDate: any;
  InvIssueDate: any;
  PrjStartDate: any;

  Role: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public cs: CommonService,
    private api: ApiService,
    private i18n: NzI18nService,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private currenyPipe: CommaSeparatePipe
  ) {

    this.Role = window.history.state.Role,
    this.CocForm = this.fb.group({
      ProjectName: new FormControl('', [Validators.required]),
      CocNumber: new FormControl('', [Validators.required]),
      ProjectNumber: new FormControl('', [Validators.required]),
      PrjStartDate: new FormControl(new Date(), [Validators.required]),
      PercentCompletion: new FormControl('', [Validators.required]),
      VendorName: new FormControl('', [Validators.required]),
      PoNumber: new FormControl('', [Validators.required]),
      PoItemNo: new FormControl('', [Validators.required]),
      PoIssueDate: new FormControl(new Date(), [Validators.required]),
      PhaseName: new FormControl('', [Validators.required]),
      InvNumber: new FormControl('', ),
      InvIssueDate: new FormControl(new Date(), ),
      InvAmount: new FormControl('', ),
      Penalties: new FormControl(''),
      CocAmount: new FormControl('', [Validators.required]),
      SesAmount: new FormControl('', [Validators.required]),
      RetentionField: new FormControl('', [Validators.required]),
      ContractAmount: new FormControl('', [Validators.required]),
      DisbursedAmount: new FormControl('', [Validators.required]),
      ContractRemAmount: new FormControl('', [Validators.required]),
      Comments: new FormControl(''),
      ProcurComments: new FormControl(''),
      Attachments: this.fb.array([]),
    });
  }

  submit(status: any) { 
    if(parseInt(this.CocForm.controls['CocAmount'].value) < 0){
      this.cs.createMessage("error",this.translate.instant("COC.CocAmtNegError"))
    }
    else if(parseInt(this.CocForm.controls['SesAmount'].value) < 0){
      this.cs.createMessage("error",this.translate.instant("COC.SesAmtNegError"))
    }
    else{
    let data = {
      CocNumber: this.CocDetails.CocNumber,
      CocStatus: '',
      ProjectName: this.CocForm.getRawValue().ProjectName.toString(),
      ProjectNumber: this.CocForm.getRawValue().ProjectNumber.toString(),
      RfpNumber: this.CocDetails.RfpNumber,
      ContractNo: this.CocDetails.ContractNo,
      CocCreatedBy: this.cs.getUserData().userid,
      CocCreationDate: '',
      CocCreationTime: '',
      PrjStartDate: this.PrjStartDate? this.cs.getCurrentDateInApiFormat(this.PrjStartDate): '',
      PercentCompletion: this.CocForm.getRawValue().PercentCompletion.toString(),
      VendorName: this.CocForm.getRawValue().VendorName.toString(),
      PoNumber: this.CocForm.getRawValue().PoNumber.toString(),
      PoItemNo: this.CocForm.getRawValue().PoItemNo.toString(),
      PoIssueDate: this.PoIssueDate? this.cs.getCurrentDateInApiFormat(this.PoIssueDate): '',
      PhaseName: this.CocForm.getRawValue().PhaseName.toString(),
      InvNumber: this.CocForm.getRawValue().InvNumber.toString(),
      InvIssueDate: this.InvIssueDate? this.cs.getCurrentDateInApiFormat(this.InvIssueDate): '',
      InvAmount: this.cs.removeCommas(this.CocForm.getRawValue().InvAmount.toString()),
      Penalties: this.cs.removeCommas(this.CocForm.getRawValue().Penalties.toString()),
      CocAmount: this.cs.removeCommas(this.CocForm.getRawValue().CocAmount.toString()),
      SesAmount: this.CocForm.getRawValue().SesAmount.toString() ? this.cs.removeCommas(this.CocForm.getRawValue().SesAmount.toString()): "0",
      RetentionField: this.CocForm.getRawValue().RetentionField.toString()? this.CocForm.getRawValue().RetentionField.toString() : "0",
      ContractAmount: this.cs.removeCommas(this.CocForm.getRawValue().ContractAmount.toString()),
      DisbursedAmount: this.cs.removeCommas(this.CocForm.getRawValue().DisbursedAmount.toString()),
      ContractRemAmount: this.cs.removeCommas(this.CocForm.getRawValue().ContractRemAmount.toString()),
      Comments: this.CocForm.getRawValue().Comments.toString(),
      ProcurComments: this.CocForm.getRawValue().ProcurComments.toString(),
      UserId: this.cs.getUserData().userid,
      Flag: '',
      CocFormToAttachNav: this.CocForm.getRawValue().Attachments.toString()
        ? this.CocForm.getRawValue().Attachments.toString()
        : [],
    };
    if (status == 'Save') {
        (data.CocStatus = 'S'), (data.Flag = 'P');
    } 
    else if (status == 'Draft') {
    
      (data.CocStatus = 'D'), (data.Flag = 'D');
      } 
    if(data){
      this.api.post("CocFormSet",data).pipe(takeUntil(this.destroy$)).subscribe((res)=>{
        if(res.d.MessageId === 'S'){
          this.cs.createMessage('success', this.cs.userLanguage === "en" ?    res.d.MessageEn : res.d.MessageAr);
          this.router.navigate(['coc/procurement'])
        }else if(res.d.MessageId === 'E'){
          this.cs.createMessage('error', this.cs.userLanguage === "en" ?  res.d.MessageEn : res.d.MessageAr);
        }
      } ,(error) => {
        this.cs.createMessage("error",error.statusText)
        this.spinner.hide()
      })
    }
  
  }
}

  ngOnInit(): void {
   // this.i18n.setLocale(en_US);
  
      this.CocForm.disable();
        // this.CocForm.controls['CocNumber'].disable();
      // this.CocForm.controls['InvNumber'].enable();
      // this.CocForm.controls['InvIssueDate'].enable();
      // this.CocForm.controls['InvAmount'].enable();
      this.CocForm.controls['Penalties'].enable();
      this.CocForm.controls['ProcurComments'].enable();
      this.getData('Procurement');
   
  }

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });

    this.uploading = true;
    this.api.docUpload(formData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.uploading = false;
        this.fileList = [];
        // this.msg.success('upload successfully.');
      },
      (error) => {
        this.uploading = false;
        // this.msg.error('upload failed.');
      }
    );
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  downloadFile(value:any){
    window.open(environment.downloadUrl+value.AttchId)
  }
  getData(value?: any) {
    let data = {};
    data = {
      CocNumber: window.history.state.CocNumber,
      PoNumber: window.history.state.PoNumber,
      PoItemNo: window.history.state.PoItemNo,
      ContractNo: window.history.state.ContractNo,
    };
    this.spinner.show();
    this.api.post('CocFormDet', data).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.spinner.hide();
        this.CocDetails = res.d;
        this.CocForm.patchValue(this.CocDetails);

     
        this.CocForm.controls['PoItemNo'].setValue(parseInt(this.CocDetails.PoItemNo).toString());
        this.CocForm.controls['PoItemNo'].updateValueAndValidity();
        
        this.CocForm.controls['Penalties'].setValue(parseInt(this.CocDetails.Penalties).toString());
        this.CocForm.controls['Penalties'].updateValueAndValidity();

        this.CocForm.controls['RetentionField'].setValue(parseInt(this.CocDetails.RetentionField).toString());
        this.CocForm.controls['RetentionField'].updateValueAndValidity();

        
        this.CocForm.controls['InvAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.InvAmount)));
        this.CocForm.controls['InvAmount'].updateValueAndValidity();

        this.CocForm.controls['InvAmount'].setValue(parseFloat(this.CocDetails.InvAmount).toString());
        this.CocForm.controls['InvAmount'].updateValueAndValidity();

        this.CocForm.controls['SesAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.SesAmount).toString()));
        this.CocForm.controls['SesAmount'].updateValueAndValidity();

        this.CocForm.controls['CocAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.CocAmount).toString()));
        this.CocForm.controls['CocAmount'].updateValueAndValidity();


        this.CocForm.controls['ContractAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.ContractAmount).toString()));
        this.CocForm.controls['ContractAmount'].updateValueAndValidity();

        this.CocForm.controls['DisbursedAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.DisbursedAmount).toString()));
        this.CocForm.controls['DisbursedAmount'].updateValueAndValidity();

        this.CocForm.controls['ContractRemAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.ContractRemAmount).toString()));
        this.CocForm.controls['ContractRemAmount'].updateValueAndValidity();

        this.CocForm.controls['Penalties'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.Penalties).toString()));
        this.CocForm.controls['Penalties'].updateValueAndValidity();




        
        this.PoIssueDate = this.cs.getDa(this.CocDetails.PoIssueDate)
        this.InvIssueDate = this.cs.getDa(this.CocDetails.InvIssueDate)
        this.PrjStartDate = this.cs.getDa(this.CocDetails.PrjStartDate)
        if(this.CocDetails.CocFormToAttachNav.results){
         
          this.uploadedfiles = this.CocDetails.CocFormToAttachNav.results;
          }
        
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }


 
  setInvSes(value:any) {

    let penval =  value.target.value;
   let invVal = parseFloat(this.cs.removeCommas(this.CocForm.getRawValue().InvAmount))
  let   PenVal = penval

  this.CocForm.controls['Penalties'].setValue(this.currenyPipe.transform(PenVal.toString()));
  this.CocForm.controls['Penalties'].updateValueAndValidity();
    
    //check if inv amount is available
    if(invVal &&   invVal > 0){
        if(PenVal  < 0){
          this.CocForm.controls['Penalties'].setValue(0)
          this.CocForm.controls['Penalties'].updateValueAndValidity()
        }
        this.cocINtAmt = 0;
        if (this.CocForm.getRawValue().RetentionField) {
          this.RetnAmt = 0;
          this.RetnAmt =
            (parseFloat(this.CocForm.getRawValue().RetentionField) *
              invVal) /
            100;
        }
        this.cocINtAmt = invVal  - parseFloat(this.RetnAmt) - PenVal
        //set COC amount
        this.CocForm.controls['CocAmount'].setValue(this.cocINtAmt.toFixed(2));
        this.CocForm.controls['CocAmount'].updateValueAndValidity();

    }

    else if(!invVal || invVal < 0){
      if(this.CocForm.controls['PercentCompletion'].value > 0){
 
        this.cocINtAmt = parseFloat(this.cs.removeCommas(this.CocForm.getRawValue().SesAmount)) - PenVal

        this.CocForm.controls['CocAmount'].setValue(this.cocINtAmt.toFixed(2));
        this.CocForm.controls['CocAmount'].updateValueAndValidity();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
