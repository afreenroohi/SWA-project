import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
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
  selector: 'app-cordinator-update',
  templateUrl: './cordinator-update.component.html',
  styleUrls: ['./cordinator-update.component.scss'],
})
export class CordinatorUpdateComponent implements OnInit {
  CocForm!: FormGroup;
  CocDetails: any;
  uploading = false;
  fileList: NzUploadFile[] = [];
  uploadedfiles : any[] = []

  
  dateFormat = 'yyyy/MM/dd';
  nonEdit = false;

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
    private currenyPipe: CommaSeparatePipe,
  ) {
    (this.Role = window.history.state.Role),
      (this.CocForm = this.fb.group({
        ProjectName: new FormControl('', [Validators.required]),
        ProjectNumber: new FormControl('', [Validators.required]),
        CocNumber: new FormControl('', [Validators.required]),
        PrjStartDate: new FormControl(new Date(), [Validators.required]),
        PercentCompletion: new FormControl('', [Validators.required]),
        VendorName: new FormControl('', [Validators.required]),
        PoNumber: new FormControl('', [Validators.required]),
        PoItemNo: new FormControl('', [Validators.required]),
        PoIssueDate: new FormControl(new Date(), [Validators.required]),
        PhaseName: new FormControl('', [Validators.required]),
        InvNumber: new FormControl(''),
        InvIssueDate: new FormControl(new Date()),
        InvAmount: new FormControl(''),
        Penalties: new FormControl(''),
        CocAmount: new FormControl('', [Validators.required]),
        SesAmount: new FormControl('',Validators.required),
        RetentionField:  new FormControl('',Validators.required),
        ContractAmount: new FormControl('', [Validators.required]),
        DisbursedAmount: new FormControl('', [Validators.required]),
        ContractRemAmount: new FormControl('', [Validators.required]),
        Comments: new FormControl('', [Validators.required]),
        ProcurComments: new FormControl(''),
        ProjCordComments: new FormControl(''),
        Attachments: this.fb.array([]),
      }));
  }

  submit(status: any) {

    this.spinner.show()
   // this.Role == "Owner"
    let data = {
      CocNumber: this.CocDetails.CocNumber,
      CocStatus: '',
      ProjectName: this.CocForm.getRawValue().ProjectName,
      ProjectNumber: this.CocForm.getRawValue().ProjectNumber,
      RfpNumber: this.CocDetails.RfpNumber,
      ContractNo: this.CocDetails.ContractNo,
      CocCreatedBy: this.CocDetails.CocCreatedBy,
      CocCreationDate: '',
      CocCreationTime: '',
      PrjStartDate: this.PrjStartDate? this.cs.getCurrentDateInApiFormat(this.PrjStartDate): '',
      PercentCompletion:
      this.CocForm.getRawValue().PercentCompletion.toString(),
      VendorName: this.CocForm.getRawValue().VendorName,
      PoNumber: this.CocForm.getRawValue().PoNumber,
      PoItemNo: this.CocForm.getRawValue().PoItemNo,
      PoIssueDate: this.PoIssueDate
      ? this.cs.getCurrentDateInApiFormat(this.PoIssueDate)
      : '',
      PhaseName: this.CocForm.getRawValue().PhaseName,
      InvNumber: this.CocForm.getRawValue().InvNumber.toString(),
      InvIssueDate: this.InvIssueDate? this.cs.getCurrentDateInApiFormat(this.InvIssueDate): '',
      InvAmount: this.cs.removeCommas(this.CocForm.getRawValue().InvAmount.toString()),
      Penalties: this.cs.removeCommas(this.CocForm.getRawValue().Penalties.toString()),
      SesAmount: this.CocForm.getRawValue().SesAmount
        ? this.cs.removeCommas(this.CocForm.getRawValue().SesAmount.toString())
        : '0',
      CocAmount: this.cs.removeCommas(this.CocForm.getRawValue().CocAmount),
      RetentionField: this.CocForm.getRawValue().RetentionField
        ? this.CocForm.getRawValue().RetentionField.toString()
        : '0',
      ContractAmount: this.cs.removeCommas(this.CocForm.getRawValue().ContractAmount.toString()),
      DisbursedAmount:
        this.cs.removeCommas(this.CocForm.getRawValue().DisbursedAmount.toString()),
      ContractRemAmount:
        this.cs.removeCommas(this.CocForm.getRawValue().ContractRemAmount.toString()),
      Comments: this.CocForm.getRawValue().Comments,
      ProcurComments: this.CocForm.getRawValue().ProcurComments.toString(),
      ProjCordComments: this.CocForm.getRawValue().ProjCordComments.toString(),
      UserId: this.cs.getUserData().userid,
      Flag: '',
      CocFormToAttachNav: this.CocForm.controls['Attachments'].value
        ? this.CocForm.controls['Attachments'].value
        : [],
    };
    if (status == 'Save') {
      (data.CocStatus = 'P'), (data.Flag = ' ');
    } else if (status == 'Assign') {
      (data.CocStatus = 'D'), (data.Flag = 'B');
    }

    if (data) {
  
      this.api.post('CocFormSet', data).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if(res.d.MessageId === 'S'){
          this.spinner.hide()
          this.cs.createMessage('success', this.cs.userLanguage === "en" ?    res.d.MessageEn : res.d.MessageAr);
          this.router.navigate(['coc/coordinator'])
        }else if(res.d.MessageId === 'E'){
          this.spinner.hide()
          this.cs.createMessage('error', this.cs.userLanguage === "en" ?  res.d.MessageEn : res.d.MessageAr);
        }
      },(error) => {
        this.spinner.hide()
        this.cs.createMessage("error",error.statusText)
      });
    }
  }
  ngOnInit(): void {
  //  this.i18n.setLocale(en_US);

    this.CocForm.disable();
    this.CocForm.controls['ProjCordComments'].enable();
    this.getData('Coordinator');
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

      if(data){
      
      }
    
    this.spinner.show();
    this.api.post('CocFormDet', data).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
      
        this.spinner.hide();
        this.CocDetails = res.d;
        this.CocForm.patchValue(this.CocDetails);

        this.CocForm.controls['PoItemNo'].setValue(parseInt(this.CocDetails.PoItemNo).toString());
        this.CocForm.controls['PoItemNo'].updateValueAndValidity();
        
        if(this.CocForm.controls['Penalties'].value  === ""){
          this.CocForm.controls['Penalties'].setValue(0);
          this.CocForm.controls['Penalties'].updateValueAndValidity();
        }
        else {
          this.CocForm.controls['Penalties'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.Penalties).toString()));
          this.CocForm.controls['Penalties'].updateValueAndValidity();
  
        }

        this.CocForm.controls['RetentionField'].setValue(parseInt(this.CocDetails.RetentionField).toString());
        this.CocForm.controls['RetentionField'].updateValueAndValidity();

        this.CocForm.controls['InvAmount'].setValue(this.currenyPipe.transform(parseFloat(this.CocDetails.InvAmount)));
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


        

        this.PoIssueDate = this.cs.getDa(this.CocDetails.PoIssueDate);
        this.InvIssueDate = this.cs.getDa(this.CocDetails.InvIssueDate);
        this.PrjStartDate = this.cs.getDa(this.CocDetails.PrjStartDate);

        if(this.CocDetails.CocFormToAttachNav.results){
         
          this.uploadedfiles = this.CocDetails.CocFormToAttachNav.results;
          }
      }
      ,(error) => {
        this.cs.createMessage("error",error.statusText)
        this.spinner.hide()
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
