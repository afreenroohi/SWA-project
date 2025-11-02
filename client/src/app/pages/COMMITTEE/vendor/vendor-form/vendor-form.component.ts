import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { actionButtonDetails, Country } from '../../committee.model';
import { CommonService } from 'src/app/service/common.service';
import { BankDetail, GlAccount, VendorPayload, BankPayload, UserActionCode } from 'src/app/shared/shared';
import { ApiService } from 'src/app/service/api.service';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { IconList } from 'src/app/components/icon/icon.component';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { FinalPopupComponent } from 'src/app/components/final-popup/final-popup.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageType } from 'src/app/components/common.model';


interface IPanels {
  name: string;
  active: boolean;
  panels?: any;
}

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {

  vendorForm : FormGroup;

  vendorDetails: VendorPayload = {
    CrNumber: '',
    NameOrg: '',
    BuildingNo: '',
    Street: '',
    City: '',
    ZipCode: '',
    CountryId: '',
    PhoneNo: '',
    Email: '',
    TaxNumber: '',
    ReconciliationAcct: ''
  };

  panels: IPanels[] = [
    {name: 'address', active: true},
    {name: 'contact', active: true},
    {name: 'bank', active: true},
    {name: 'commercial', active: true},
    {name: 'taxAccount', active: true}
  ]

  countryList: Country[] = [];

  bankList: BankDetail[] = [];

  glAccountList: GlAccount[] = [];

  iconList = IconList;

  otpKeys: string[] = [];

  otp: string = '';

  actionButtons!: actionButtonDetails[] ;
  
  getOTPModel: boolean = false;

  userAction: UserActionCode = UserActionCode.submit;

  tenderDetails: any = {};

  constructor(private fb: FormBuilder, public cs: CommonService, 
    private api: ApiService, private data: PassFormDataService, private translate: TranslateService,
    private spinner: NgxSpinnerService, private router: Router, private modal: NzModalService  ) { 
    this.vendorForm = fb.group({
      AddressGroup: this.fb.group({
        NameOrg: new FormControl({ value: '', disabled: true }),
        Street: new FormControl({ value: '', disabled: true }),
        BuildingNo: new FormControl({ value: '', disabled: true }),
        ZipCode: new FormControl({ value: '', disabled: true }),
        City: new FormControl({ value: '', disabled: true }),
        CountryId: new FormControl({ value: '', disabled: true }),
      }),
      ContactGroup: this.fb.group({
        PhoneNo: new FormControl({ value: '', disabled: true }),
        Email: new FormControl({ value: '', disabled: true })
      }),
      BankArray: this.fb.array([]),
      CommercialGroup: this.fb.group({
        CrNumber: new FormControl({ value: '', disabled: false  }, [Validators.required]),
        ValidFrom: new FormControl({ value: '', disabled: false }, [Validators.required]),
        ValidTo: new FormControl({ value: '', disabled: false }, [Validators.required])
      }),
      TaxAccountGroup: this.fb.group({
        TaxNumber: new FormControl({ value: '', disabled: false  }, [Validators.required]),
        ReconciliationAcct: new FormControl({ value: '', disabled: false  }, [Validators.required])
      })
    })
  }

  ngOnInit(): void {
    this.spinner.show();
    const tenderDetails = this.data.getData();
    const getTenderDetails =  this.api.post('OCOM_TENDER_DETAILS', {TenderId: tenderDetails.TndrID});
    const getGlAccounts = this.api.get('gl-accounts');
    const getBankList = this.api.get("get-bank-list");
    const getCountryList = this.api.post("getCountryList", {});
    forkJoin([
      getTenderDetails,
      getGlAccounts,
      getBankList,
      getCountryList
    ]).subscribe(
      ([tenderDetails, glAccounts, bankList, countryList]) => {
        this.spinner.hide();
        if (tenderDetails) {
          this.processTenderDetails(tenderDetails.d.results[0]);
        }
        if (glAccounts) {
          this.glAccountList = glAccounts;
        }
        if (bankList) {
          this.bankList = bankList;
        }
        if (countryList) {
          this.countryList = countryList.d.results;
        }
      },
      ([tenderDetailsError, glAccountsError, bankListError, countryListError]) => {
        this.spinner.hide();
        if (tenderDetailsError) {
          this.cs.createMessage('error', tenderDetailsError.statusText);
        }
        if (glAccountsError) {
          this.cs.createMessage('error', glAccountsError.statusText);
        }
        if (bankListError) {
          this.cs.createMessage('error', bankListError.statusText);
        }
        if (countryListError) {
          this.cs.createMessage('error', countryListError.statusText);
        }
      }
    );
  }

  get bankArray(): FormArray { 
    return this.vendorForm.get('BankArray') as FormArray;
  }
  
  processTenderDetails(details: any): void {
    this.tenderDetails = details;
    const vendor = details?.to_RqstVndrs?.results?.find((vendor: any) => {
      if (vendor.IsVendorSelected === 'Y' && 
        vendor.IsVndrfnclQualified === 'X' && 
        vendor.IsVndrtechQualified === 'X') {
          return vendor;
        }
      if (this.tenderDetails.PurTypID === 'D' && vendor.IsVendorSelected === 'Y') {
        return vendor
      }
    })
    if (vendor) {
      this.setActionsinActionButtons(details.to_Button.results)
      const crnumber = vendor.VendorCommercialNo;
      this.getVendorDetails(crnumber);
    } else {
      this.cs.createMessage('error', this.translate.instant('COM.Vendor not found'));
    }
  }

  getVendorDetails(crnumber: string): void {
    this.api.get(`vendor-details?crnumber=${crnumber}`).subscribe(
      (res) => {
        this.vendorDetails = res[0];
        this.setFormValues();
      },
      (err) => {
        console.log(err);
        this.cs.createMessage('error', err.statusText);
      }
    )
  }

  setFormValues(): void {
    this.vendorForm.patchValue({
      AddressGroup: {
        NameOrg: this.vendorDetails.NameOrg ?? '',
        Street: this.vendorDetails.Street ?? '',
        BuildingNo: this.vendorDetails.BuildingNo ?? '',
        ZipCode: this.vendorDetails.ZipCode ?? '',
        City: this.vendorDetails.City ?? '',
        CountryId: this.vendorDetails.CountryId ?? '',
      },
      ContactGroup: {
        PhoneNo: this.vendorDetails.PhoneNo ?? '',
        Email: this.vendorDetails.Email ?? ''
      },
      BankArray: [],
      CommercialGroup: {
        CrNumber: this.vendorDetails.CrNumber ?? '',
        ValidFrom: this.cs.getDa(this.vendorDetails.ValidFrom) ?? '',
        ValidTo: this.cs.getDa(this.vendorDetails.ValidTo) ?? ''
      },
      TaxAccountGroup: {
        TaxNumber: this.vendorDetails.TaxNumber ?? '',
        ReconciliationAcct: this.vendorDetails.ReconciliationAcct ?? ''
      }
    })
    this.addBank();
  }

  addBank(): void {
    const sno = this.bankArray.length + 1;
    this.bankArray.push(this.fb.group({
      Bank: new FormControl({ value: '', disabled: false }, [Validators.required]),
      AccountNo: new FormControl({ value: '', disabled: false  }, [Validators.required]),
      IBAN: new FormControl({ value: '', disabled: false  }, [Validators.required]),
      Country: new FormControl({ value: '', disabled: false }, [Validators.required])
    })); 
  }

  deleteBank(bankIndex: number) {
    console.log(bankIndex)
    const banks = this.bankArray.controls.filter((bank, index) => index != bankIndex);
    console.log(banks)
    this.bankArray.controls = banks;
  }

  setBankCountry(index: number): void {
    const bank = this.bankList.find((bank) => bank.Bankkeys === this.bankArray.controls[index].value.Bank)
    this.bankArray.controls[index].get('Country')?.setValue(bank?.BankCountryKeys ?? '')
  }
 
  getBankName(bankID: string): string {
    return this.bankList.find((bank) => bank.Bankkeys === bankID)?.NameOfBank ?? '-'
  }

  getCoutryName(countryId: string): string {
    const country = this.countryList.find((country) => country.Land1 === countryId);
    return this.cs.userLanguage === 'en' ? country?.Landx50En ?? '-' : country?.Landx50Ar ?? '-';
  }

  getBankDetails(crnumber: string, banks: any[]): BankPayload[] {
    return banks.map((bank) => {
      const payloadBank: BankPayload = {
        CrNumber: crnumber,
        BankCtry: bank.Country ?? '',
        BankKey: bank.Bank ?? '',
        BankAcct: bank.AccountNo ?? '',
        Iban: bank.IBAN ?? ''
      };
      return payloadBank;
    })
  }

  validationForButton () : boolean {
    return this.vendorForm.invalid;
  }

  setActionsinActionButtons(actionButtonsList: actionButtonDetails[]) {
    // Store the provided action buttons list
    this.actionButtons = actionButtonsList;
  
    // Define action mapping (with more flexible keys using Partial)
    const actionMap: Partial<Record<string, any>> = {
      // Financial Officer
      "VNDT_FO_SUB": this.showConfirm.bind(this, UserActionCode.submit)
    };

    const validationMap: Partial<Record<string, any>> = {
      // Financial Officer
      "VNDT_FO_SUB": this.validationForButton.bind(this)
    }
  
    // Iterate over the action buttons
    this.actionButtons.forEach((button) => {
      const { CmtMenu, CmtRole, Button_ID, OTP_Required } = button;
  
      // Construct the key dynamically
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;

      // Check if the action exists in the actionMap and assign it if it does
      if (actionMap[actionKey]) {
        button.action = actionMap[actionKey];
        if (OTP_Required === 'X') {
          this.otpKeys.push(actionKey)
        }
      }

      // Check if the action exists in the validationMap and assign it if it does
      if (validationMap[actionKey]) {
        button.validation = validationMap[actionKey]
      } else {
        button.validation = () => {return false};
      }
    });
  }

  actionCheckerForOTP(action?: UserActionCode): boolean {   
    const button = this.actionButtons.find(button => button.Button_ID === action);
    if (button) {
      const { CmtMenu, CmtRole, Button_ID } = button;      
      const actionKey = `${CmtMenu}_${CmtRole}_${Button_ID}`;    
      return this.otpKeys.includes(actionKey);       
    }else {
      return false;
    }
  } 

  getOTP() {
      let data = {
        UserId: this.cs.getUserData().userid
      }
      this.spinner.show();
      this.api.post("/OTP", data).subscribe((res: any) => {
        this.spinner.hide();
        if (res.d.results[0].MessageId === "S") {
          this.cs.otpToast(res.d.results[0]);
          this.otp = res.d.results[0].OtpNo
          this.getOTPModel = !this.getOTPModel;
        }
  
        else if (res.d.results[0].MessageId === "" || res.d.results[0].MessageId === "E") {
          this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.d.results[0].MessageEn : res.d.results[0].MessageAr);
        }
        else {
          this.cs.createMessage("error", this.translate.instant('COM.OTPNotSent'))
        }
      }, () => {
        this.spinner.hide();
      });
  
  }

  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.updateVendorDetails(this.userAction);
      }
      else if (data !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  updateOTP(value: any) {
    this.getOTPModel = value;

    if (value) {
      if (value === this.otp) {

        this.cs.createMessage("success", this.translate.instant("COM.OTPvalidatedSucccessfully"))
        this.showConfirm(this.userAction);
      }
      else if (value !== this.otp) {
        this.cs.createMessage("success", this.translate.instant("COM.InvalidOTP"))
      }
    }
  }

  showConfirm(action: UserActionCode): void {
      const config = {
        titleText: this.cs.getConfimationModalTitle(action ?? null),
        bodyText: this.cs.getConfimationMessage(action ?? null)
      };
  
      const modalRef = this.modal.create({
        nzContent: ConfirmComponent,
        nzComponentParams: { config },
        nzWidth: 600,
        nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
        nzFooter: null
      });
  
      modalRef.afterClose
        .subscribe(result => {
          if (result) {
            if (this.actionCheckerForOTP(action)) {
              this.userAction = action;
              this.getOTP();
            } else {
              this.updateVendorDetails(action);
            }
          }
        });
    }

  updateVendorDetails(userAction: UserActionCode) {
    const vendorData = this.vendorForm.getRawValue();
    const payload: VendorPayload = {
      CrNumber: vendorData.CommercialGroup.CrNumber ?? '',
      ValidFrom: this.cs.getCurrentDateInApiFormat(vendorData.CommercialGroup.ValidFrom) ?? '',
      ValidTo: this.cs.getCurrentDateInApiFormat(vendorData.CommercialGroup.ValidTo) ?? '',
      NameOrg: vendorData.AddressGroup.NameOrg ?? '',
      BuildingNo: vendorData.AddressGroup.BuildingNo ?? '',
      Street: vendorData.AddressGroup.Street ?? '',
      City: vendorData.AddressGroup.City ?? '',
      ZipCode: vendorData.AddressGroup.ZipCode ?? '',
      CountryId: vendorData.AddressGroup.CountryId ?? '',
      PhoneNo: vendorData.ContactGroup.PhoneNo ?? '',
      Email: vendorData.ContactGroup.Email ?? '',
      TaxNumber: vendorData.TaxAccountGroup.TaxNumber ?? '',
      ReconciliationAcct: vendorData.TaxAccountGroup.ReconciliationAcct ?? '',
      ind: 'S',
      to_bnkdt: vendorData.BankArray.length ? 
      this.getBankDetails(vendorData.CommercialGroup.CrNumber ?? '', vendorData.BankArray) : [],
    }
    this.tenderDetails.LgdInUsrAction = userAction;
    this.tenderDetails.LgdInUsr = localStorage.getItem("LogdInUsrID") ?? '';
    this.tenderDetails.LgdInUsrCmt = '05';
    this.tenderDetails.LgdInUsrCmtRole = localStorage.getItem(`ROLEMG`) ?? ``;
    this.spinner.show();
    this.api.post('vendor-details', payload).subscribe(
      (res) => {
        if (res.MsgType === 'S') {
          this.api.post('OCOM_CRT_UPD', this.tenderDetails).subscribe(
            (resp) => {
              this.spinner.hide();
              if (resp.d.MsgType === 'S') {
                this.cs.createMessage('success', this.cs.userLanguage === 'en' ? resp.d.MsgVar1 : resp.d.MsgVar2);
                const message = this.cs.userLanguage === 'en' ? res.MsgV1 : res.MsgV2;

                const modalRef = this.modal.create({
                  nzContent: FinalPopupComponent,
                  nzComponentParams: { message:message, messageType: MessageType.Success},
                  nzWidth: 600,
                  nzBodyStyle: { minHeight: '300px', borderTop: `4px solid #005c99` },
                  nzFooter: null
                });

                modalRef.afterClose.subscribe(
                  () => {
                    this.cs.activeMenu = `vendorlist`;
                    this.router.navigate(["/committee/vendor/vendor-list"]);
                  }
                );
              } else {
                this.cs.createMessage('success', this.cs.userLanguage === 'en' ? res.MsgV1 : res.MsgV2);
                this.cs.createMessage('error', this.cs.userLanguage === 'en' ? resp.d.MsgVar1 : resp.d.MsgVar2);
              }
            }, (error) => {
                  this.spinner.hide();
                  console.log(error);
                  this.cs.createMessage('error', error.statusText);
            }
          )
        } else {
          this.spinner.hide();
          this.cs.createMessage('error', this.cs.userLanguage === 'en' ? res.MsgV1 : res.MsgV2);
        }
      }, 
      (err) => {
        this.spinner.hide();
        console.log(err);
        this.cs.createMessage('error', err.statusText);
      }
    )
  }

}
