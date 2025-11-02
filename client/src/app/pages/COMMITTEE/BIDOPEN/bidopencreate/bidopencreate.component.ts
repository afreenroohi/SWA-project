import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import { COMMITTEE_ROLE, EnvType } from 'src/app/shared/shared';
import { PurchaseType } from 'src/app/shared/shared';
import { Constant } from '../../committee.model';
@Component({
  selector: 'app-bidopencreate',
  templateUrl: './bidopencreate.component.html',
  styleUrls: ['./bidopencreate.component.scss'],
})
export class BidopencreateComponent implements OnInit {
  
  /* WIP US 73004
    The below block is temporary, please update or
    remove this block as per need during binding of
    invitation sent to vendors fields for submission.
 
    role : string | null = ``;
    COMMITTEE_ROLE = COMMITTEE_ROLE;
    bidsapproved = false;
    isFinancialoffer = false;
     public inviteVendorsList: string[] = [];
  */

  // * FormGroup
  bidopeningForm: FormGroup;

  // * Constant variables
  dateFormat = 'yyyy/MM/dd';

  PRNumber: any;

  // * Purchase Type For Translation
  TypeOfPurchase = PurchaseType;
  TypeOfTendering: any;

  // * Today's Date
  today = new Date();

  Tenderingresult: any;

  public pastDateDisable = (current: Date): boolean =>
    // * Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;



  public futureDateDisable = (current: Date): boolean =>
    // * Can not select days after today
    differenceInCalendarDays(this.today, current) < 0;

  LogdInUsrID: any;

  private readonly destroy$ = new Subject<void>();

  competitionTypes: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public cs: CommonService,
    private api: ApiService,
    private router: Router,
    public translate: TranslateService

  ) {
    this.bidopeningForm = this.constructBidOpeningForm();
  }

  /**
   * Constructs and retruns the Bid Opening Form Group
   * 
   * @returns Bid Opening FormGroup
   */
  constructBidOpeningForm(): FormGroup {
    return this.fb.group({
      RFPNumber: new FormControl(null, [Validators.required]),
      TenderName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      EtmdSubDate: new FormControl('', [Validators.required]),
      ReferenceNumber: new FormControl({ value: '', disabled: true }),
      typeOfPurchase: new FormControl({ value: '', disabled: false }),
      TemderTypeID: new FormControl('', [Validators.required]),
      Etimadnumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(12)
      ])),
      Projectname: new FormControl({ value: '', disabled: true }),
      Department: new FormControl({ value: '', disabled: true }),
      CompetitionTypeID: new FormControl({
        value: '',
        disabled: false,
      }),
      // VendorInvitationsSent: this.fb.array([]), WIP US 73004
    });
  }

  ngOnInit() {
    // * Type Of Tendering For Translation From Shared Service
    this.TypeOfTendering = EnvType;
    this.Tenderingresult = EnvType;
    this.LogdInUsrID = localStorage.getItem('LogdInUsrID')
    // this.role = COMMITTEE_ROLE.PROCUREMENT_MEMBER; // Todo to update/remove this statement during completion of US 73004
    // this.getTNDRTYPE();
    this.getInitialValues();
    this.getCompetitionTypes();
  }

  /**
   * Get the Initial Values for the Bid Opening Form
   */
  getInitialValues(): void {
    this.spinner.show();

    this.api.get('F4_RFP').pipe(takeUntil(this.destroy$)).subscribe(
      (RfpRes) => {

        if (RfpRes?.d?.results.length > 0) {
          this.PRNumber = RfpRes?.d?.results;
        }
        this.spinner.hide();
      },
      (error1) => {
        if (error1) {
          this.cs.createMessage('error', error1.statusText);
          this.spinner.hide();
        }
      });
  }


  /**
   * Make an API call to get the Competition Type
   */
  getCompetitionTypes(): void {
    this.spinner.show();
    this.api.post('F4_CMPTN_TYPE', {}).pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.spinner.hide();
        if (res.d.results.length > 0) {
          this.competitionTypes = res.d.results;
        }
      }, () => {
        this.spinner.hide();
      });
  }

  /**
   * Not used method remove it in future
   */
  getTNDRTYPE() {
    this.spinner.show();
    this.api.get('F4_TNDRTYPE').pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.TypeOfTendering = res?.d?.results;

        this.spinner.hide();
      },
      (error) => {

        this.cs.createMessage('error', error.statusText);
        this.spinner.hide();
      }
    );
  }

  /**
   * Triggered by changing the RFP Number in Dropdown.
   * Make an API call to Read the Selected RFP related data
   * @param value - Selected RFP Number
   */
  ChangeRFP(value: any) {
    this.spinner.show();
    const data = {
      RfpNo: value,
    };

    this.api.post('F4_RFPREAD', data).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        if (res?.d?.results.length > 0) {

          const result = res?.d?.results;

          this.bidopeningForm.controls['ReferenceNumber'].setValue(
            result[0].PurchaseReqNo
          );

          this.bidopeningForm.controls['TenderName'].setValue(
            res?.d?.results[0].RFPName
          );

          this.bidopeningForm.controls['Department'].setValue(
            res?.d?.results[0].DepText
          );

          if (result[0].PurchaseTypeID === 'D') {
            this.bidopeningForm.controls['typeOfPurchase'].disable();
            // ? Removed filtering based on Type of Purchase
            // this.Tenderingresult = this.TypeOfTendering.filter(
            //   (element: any) => {
            //     if (this.cs.userLanguage === 'en') {
            //       return element.type !== 'Two Envelope';
            //     } else {
            //       return element.typeAr !== 'مغلفان';
            //     }
            //   }
            // );
          } else {
            this.bidopeningForm.controls['typeOfPurchase'].enable();
            this.Tenderingresult = this.TypeOfTendering;
          }

          this.bidopeningForm.controls['typeOfPurchase'].setValue(
            result[0].PurchaseTypeID
          );

          this.spinner.hide();
        }
      },
      (error) => {
        this.cs.createMessage('error', error.statusText);
        this.spinner.hide();
      }
    );
  }

  /**
   * Change Purchase Type From RPF to DP and DP to RPF
   * @param value - Selected Purchase type value
   */
  ChangeTypePurchase(value: any) {
    if (value === 'D') {
      // ? Removed filtering based on Type of Purchase
      this.Tenderingresult = this.TypeOfTendering.filter((element: any) => {
        if (this.cs.userLanguage === 'en') {
          return element.type !== 'Two Envelope';
        } else {
          return element.typeAr !== 'مغلفان';
        }
      });
      this.bidopeningForm.controls['TemderTypeID'].setValue(
        this.Tenderingresult[0].id
      );
      this.bidopeningForm.controls['TemderTypeID'].disable();
      this.bidopeningForm.get('CompetitionTypeID')?.setErrors(null);
      this.bidopeningForm.updateValueAndValidity();
    } else {
      this.bidopeningForm.get('CompetitionTypeID')?.addValidators(Validators.required);
      this.Tenderingresult = this.TypeOfTendering;
    }
    this.bidopeningForm.updateValueAndValidity();
  }

  /**
   * Validates the Form and Submit the values
   * @returns Returns if the validations are failed.
   */
  validateAndSubmit() {

    this.bidopeningForm.markAllAsTouched();

    // * Etimad Number Validation
    if (
      this.bidopeningForm.controls['Etimadnumber'].value.toString().length < 10 || 
      this.bidopeningForm.controls['Etimadnumber'].value.toString().length > 12    ) {
      this.bidopeningForm.controls['Etimadnumber'].setValue('');
      this.cs.createMessage(
        'error',
        this.cs.userLanguage === 'en'
          ? 'Etimad number must be between 10 - 12 digit only'
          : 'يجب أن يتكون رقم اعتماد من 12 أرقام فقط'
      );
      return;
    }

    // * Bid Opening Form Validaton
    if (this.bidopeningForm.invalid){
      return;
    }

    // * Submit the Form data
    this.postbidopening();

  }

  /**
   * Make an API call to post the Bid Opening Form Data
   */
  postbidopening() : void {
    // WIP US 73004
    // const VendorInvitationsSentArray = this.bidopeningForm.get(`VendorInvitationsSent`);
    // const to_RqstVndrs: any = [];

    // * Prepare the Payload Data
    const payload = {
      RFPNumber: this.getFormControlValue('RFPNumber'),
      TndrName: this.getFormControlValue('TenderName'),
      PurReqNo: this.getFormControlValue('ReferenceNumber'),
      PurTypID: this.getFormControlValue('typeOfPurchase'),
      TndrTypeID: this.getFormControlValue('TemderTypeID'),
      EtimadNo: this.getFormControlValue('Etimadnumber'),
      EtmdSubDate:  this.cs.getCurrentDateInApiFormat(this.getFormControlValue('EtmdSubDate')),
      CmtFrmtnOrdrNo: '',
      CmtFrmtnOrdrDate: '',
      LgdInUsr: this.LogdInUsrID,
      LgdInUsrCmt: '01',
      LgdInUsrCmtRole: localStorage.getItem('ROLEOP'),
      LgdInUsrAction: 'SUB',
      to_RqstMbrs: [],
      // to_RqstVndrs, WIP US 73004
      CompetitionTypeID: this.getFormControlValue('CompetitionTypeID'),
    };

    if (payload) {

      this.spinner.show();
      // * API Call
      this.api.post('Cmt_create', payload).pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.d.MsgType === 'S') {

            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2
            );
            this.cs.activeMenu = `bidlist`;
            this.router.navigate(['committee/BidList'], {
              state: { ActiveTab: 'BidList' },
            });
          } else {
            this.cs.createMessage(
              'error',
              this.cs.userLanguage === 'en' ? res.d.MsgVar1 : res.d.MsgVar2
            );
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
    }
  }

  /**
   * Returns the Bid Opening Form Control Value dynamically
   * @param controlName - FormControl Name
   * @returns - FormControl Value
   */
  getFormControlValue(controlName: string): string | Date {
    if (this.bidopeningForm.get(controlName)?.value && typeof this.bidopeningForm.get(controlName)?.value === 'object') {
      return this.bidopeningForm.get(controlName)?.value;
    }
    if (this.bidopeningForm.get(controlName)?.value) {
      return this.bidopeningForm.get(controlName)?.value.toString();
    }
    return '';
  }
  
  /* WIP US 73004
  addNewInvitationSent() {
    const control = this.VendorInvitationsSent;
    control.push(this.vendorInvitationItem(true));
  }

  vendorInvitationItem(isRequired: boolean): FormGroup {
    let validators = [];
    isRequired ? validators.push(Validators.required) : null;
    return this.fb.group({
      TenderId: '',
      LmtdVendorId: '',
      LmtdVendorName: [{ value: '', disabled: this.role === 'MR' || this.bidsapproved || this.isFinancialoffer }, validators],
    });
  }

  /**
   * Adds an invite vendor to the list.
   * @param event The event object triggered by the user action.
   * @param index The index of the vendor in the list.
   *
  addInviteVendor(event: any, index: number) : void {
    if (this.inviteVendorsList[index]) {
      this.inviteVendorsList = this.inviteVendorsList.filter((item: any) => item != this.inviteVendorsList[index]);
    }

    this.inviteVendorsList.push(event.target.value);
  }

  /**
   * Deletes an invitation vendor at the specified index.
   * @param index The index of the vendor invitation to remove.
   *
  deleteInviationVendor(index: number) : void {
    const control = this.bidopeningForm.get(
      'VendorInvitationsSent'
    ) as FormArray;
    control.removeAt(index);
    if (this.inviteVendorsList[index]) {
      this.inviteVendorsList = this.inviteVendorsList.filter((item: any) => item != this.inviteVendorsList[index])
    }
  }  */

  // * Getter Methods
  get isTypeOfPurchaseRFP() {
    return this.bidopeningForm.get('typeOfPurchase')?.value == 'R';
  }

  /* WIP US 73004
  get VendorInvitationsSent() {
    return this.bidopeningForm.get(
      'VendorInvitationsSent'
    ) as FormArray;
  } */

  // * Ng Destroy Life cycle hook
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}