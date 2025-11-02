import { COCService } from './../coc.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, combineLatest, forkJoin } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { ApiService } from 'src/app/service/RFP/api.service';
import * as moment from 'moment';
import {
  COCActionButton,
  COCComments,
  COCFormPayload,
  COCHistory,
  CocFormField,
  CocFormToAttachNavItem,
  PODetailsList,
  SERVICE_PO_CODE,
  userList,
} from 'src/app/pages/COC/coc.model';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
import { DatePipe } from '@angular/common';
import {
  NgbCalendar,
  NgbCalendarIslamicUmalqura,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { IslamicI18n } from '../../CONTRACT/Common/hijri-datepicker/hijri-datepicker.component';
import { dropDown } from '../../COMMITTEE/committee.model';
import { cocFormDownload } from '../coc.model';
import { UserActionCode } from 'src/app/shared/shared';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AssignConfig } from 'src/app/components/common.model';
import { Observable } from 'rxjs';
import { differenceInCalendarDays, setHours } from 'date-fns';


@Component({
  selector: 'app-crete-coc',
  templateUrl: './crete-coc.component.html',
  styleUrls: ['./crete-coc.component.scss'],
  providers: [
    DatePipe,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura }, //year
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }, // month , week days
  ],
})
export class CreteCOCComponent implements OnInit {
  currentRole = localStorage.getItem('RoleCOC') ?? '';

  cocNumber = '';
  referenceCocNumber = '';
  viewMode = false;
  reOpen = false;
  allowCocCancel = false;

  CocForm: FormGroup = this.constructCocFormGroup();

  expandIconPosition: 'left' | 'right' = 'right';

  formatterPercent = (value: number): string => {
    return value ? `${value} %` : '';
  };
  parserPercent = (value: string): string => value.replace('0%', '');

  dateFormat = 'dd/MM/yyyy';
  fileNetList: any[] = [];
  poDetailsList: PODetailsList[] = [];
  isContractMethod = true;

  cocHistory: COCHistory[] = [];
  viewCocProcessHistoryModal = false;

  commentValue = '';
  commentList: COCComments[] = [];
  addCommentsModal = false;
  viewCommentHistoryModal = false;

  isOTPReqired = false;
  getOTPModel = false;
  otpValue = '';
  otpSubmitValue = {
    action: '',
    status: '',
    role: '',
  };

  actionButtons: COCActionButton[] = [];
  cocFormDownLoadDropdown: dropDown[] = [];
  isCOCFormDownloadLoading: boolean = false;
  COCUserList: userList[] = [];
  assignUser: AssignConfig = { label: '', placeholder: '', listOfUsers: [] };
  isAssignable: boolean = false;
  minEndDate: any;
  private readonly destroy$ = new Subject<void>();
  maxDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) > 0;
  minDate = (current: Date): boolean => differenceInCalendarDays(new Date(), current) > 0;
  minEnd = (current: Date): boolean => {
    const workStartDate = this.CocForm.get('WorkStartDt')?.value; // Replace 'OtherDateField' with actual control name
    return workStartDate ? current < new Date(workStartDate) : false;
  };
  minWorkEndDate: NgbDateStruct = {
    year: 0,
    month: 0,
    day: 0,
  };

  constructor(
    public cs: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private cocService: COCService,
    private currenyPipe: CommaSeparatePipe,
    private modal: NzModalService,
    private hjiriDate: NgbCalendar
  ) {
    this.cocNumber = window.history.state.CocNo;
    this.viewMode = window.history.state.viewMode;
    this.reOpen = window.history.state.reOpen;
    this.allowCocCancel = window.history.state.allowCancel;

    if (!this.cocNumber) {
      // * PO Details List
      const poDetails = this.router.getCurrentNavigation()?.extras
        .state as PODetailsList[];
      if (poDetails) this.poDetailsList = poDetails;

      // * Type of PO (Contract / PO without Contract)
      this.isContractMethod = this.poDetailsList.find((po) => po.ContractNumber)
        ? true
        : false;
    }

    // this.CocForm.get('Penalties')
    //   ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(100))
    //   .subscribe((value) => {
    //     this.CocForm.get('Penalties')?.setValue(
    //       this.currenyPipe.transform(value)
    //     );
    //   });
    // this.CocForm.get('AdvancePayment')
    //   ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(100))
    //   .subscribe((value) => {
    //     this.CocForm.get('AdvancePayment')?.setValue(
    //       this.currenyPipe.transform(value)
    //     );
    //   });
  }

  ngOnInit(): void {
    console.log(this.currentRole, 'currentRole');
    if (this.currentRole === 'FO') {
      this.getCOCUserList('FO');
      this.isAssignable = true;
    } else if (this.currentRole === 'MN') {
      this.getCOCUserList('MN');
      this.isAssignable = true;
    }

    if (this.cocNumber) {
      this.getCOCData();
    } else {
      this.getInitialData();
    }
    // this.attList = this.CocForm.get('Attachments') as FormArray;

    const InvoiceAmount$ = this.CocForm.controls.InvAmount.valueChanges;
    const PenalityAmount$ = this.CocForm.controls.Penalties.valueChanges;
    const RetentionField$ = this.CocForm.controls.RetentionField.valueChanges;
    const AdvancePayment$ = this.CocForm.controls.AdvancePayment.valueChanges;
    combineLatest([
      InvoiceAmount$,
      PenalityAmount$,
      RetentionField$,
      AdvancePayment$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          newInvoiceAmount,
          newPenaltiyAmount,
          newRetentionField,
          newAdvancePayment,
        ]) => {
          this.CocForm.get('CocAmount')?.setValue(
            this.calculateCocAmount(
              this.cs.removeCommas(newInvoiceAmount),
              this.cs.removeCommas(newPenaltiyAmount),
              this.cs.removeCommas(newRetentionField),
              this.cs.removeCommas(newAdvancePayment)
            )
          );
          this.CocForm.get('CocAmount')?.updateValueAndValidity();
        }
      );
    this.CocForm.get('Isfinalsettlement')?.valueChanges.subscribe((value) => {
      this.setisDiabledFormAction(value);
    });
  }

  /**
   * Construct and Return the COC Formgroup
   * @returns `FormGroup`
   */
  constructCocFormGroup(): FormGroup {
    return this.fb.group({
      AdvancePayment: new FormControl(0),
      ProjectName: new FormControl({ value: '', disabled: true }),
      CocNumber: new FormControl({ value: '', disabled: true }),
      DocumentEnable: new FormControl(''),
      ContractNo: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      ContractDate: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      PercentCompletion: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      VendorName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      PhaseName: new FormControl('', [Validators.required]),
      InvNumber: new FormControl('', Validators.required),
      InvIssueDate: new FormControl('', [Validators.required]),
      InvAmount: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      RetentionField: new FormControl(0),
      Penalties: new FormControl(0),
      EtmdRefNo: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.maxLength(12),
      ]),
      Bgvaliddatecal: new FormControl('G', [Validators.required]),
      WorkStartDt: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      WorkEndDt: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      Isfinalsettlement: new FormControl({ value: 'No', disabled: false }),
      CocAmount: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      ContractAmount: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      DisbursedAmount: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      ContractRemAmount: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      Attachments: this.fb.array([]),
    });
  }

  /**
   * Get the Save COC details
   */
  getCOCData(): void {
    this.spinner.show();
    const payload = {
      CocNumber: this.cocNumber,
    };

    // this.api
    //   .post('GetCOCFormDetails', payload)
    //   .pipe(takeUntil(this.destroy$),
    //   tap(() => this.getCOCFormDownloadList()),)
    //   .subscribe(
    //     (formDetails) => {
    //       let _formDetails: CocFormField = formDetails.d;
    //       _formDetails.PoDetailsList =
    //         formDetails?.d?.CocHeadtoItemNav?.results;

    //       this.isOTPReqired = _formDetails.OtpRequired === 'X';

    //       this.isContractMethod = _formDetails.ContractNo ? true : false;

    //       this.actionButtons = formDetails?.d?.CocFormToActItemNav?.results;

    //       this.fileNetList = formDetails?.d?.CocFormToAttachNav?.results?.map(
    //         (file: any, index: number) => {
    //           return {
    //             ItemNo: index + 1,
    //             FilenetID: file.FilenetId,
    //             FileName: file.FileName,
    //             UserId: file.CreatedBy,
    //           };
    //         }
    //       );

    //       if (!this.reOpen && (formDetails?.d?.Flag !== 'X' || this.viewMode))
    //         this.CocForm.disable();

    //       if (this.reOpen) {
    //         this.referenceCocNumber = this.cocNumber;
    //         this.cocNumber = '';
    //       }

    //       // _formDetails = this.addCurrencyFormatToAmountFields(_formDetails);
    //       this.patchFormValues(_formDetails);

    //       if (!this.viewMode && this.currentRole === 'PM') {
    //         this.enablePenalty();
    //       }
    //       if (this.currentRole != 'FO') {
    //         this.disableFields();
    //       }
    //       this.spinner.hide();
    //     },
    //     (error) => {
    //       this.cs.createMessage('error', error.statusText);
    //       this.spinner.hide();
    //     }
    //   );
      forkJoin({
        cocFormList: this.cocService.getCOCFormList(), // Ensure this returns an Observable
        formDetails: this.api.post('GetCOCFormDetails', payload)
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async ({ cocFormList, formDetails }) => {
            this.cocFormDownLoadDropdown = cocFormList; // Store the form list
      
            let _formDetails: CocFormField = formDetails.d;
          _formDetails.PoDetailsList =
            formDetails?.d?.CocHeadtoItemNav?.results;

          this.isOTPReqired = _formDetails.OtpRequired === 'X';

          this.isContractMethod = _formDetails.ContractNo ? true : false;

          this.actionButtons = formDetails?.d?.CocFormToActItemNav?.results;

          this.fileNetList = formDetails?.d?.CocFormToAttachNav?.results?.map(
            (file: any, index: number) => {
              return {
                ItemNo: index + 1,
                FilenetID: file.FilenetId,
                FileName: file.FileName,
                UserId: file.CreatedBy,
              };
            }
          );

          if (!this.reOpen && (formDetails?.d?.Flag !== 'X' || this.viewMode))
            this.CocForm.disable();

          if (this.reOpen) {
            this.referenceCocNumber = this.cocNumber;
            this.cocNumber = '';
          }

          // _formDetails = this.addCurrencyFormatToAmountFields(_formDetails);
          await this.patchFormValues(_formDetails);

          if (!this.viewMode && this.currentRole === 'PM') {
            this.enablePenalty();
          }
          if (this.currentRole != 'FO') {
            this.disableFields();
          }
          
            
            this.spinner.hide();
          },
          (error) => {
            this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
          }
        );


  }

  /**
   * Get the Initial Form data
   */
  getInitialData() {
    let docNumber; // * Used to store both Contract and PO number
    

    const isContractMethod = this.poDetailsList.find((po) => po.ContractNumber);
    if (isContractMethod) {
      docNumber = isContractMethod.ContractNumber;
    } else {
      docNumber = this.poDetailsList.find((po) => po.PoNo)?.PoNo;
    }

    const requestType: 'Contract' | 'Po' = isContractMethod ? 'Contract' : 'Po';
    let payload;
    if (isContractMethod) {
      payload = {
        RequestType: requestType,
        ContractNo: docNumber,
      };
    } else {
      payload = {
        RequestType: requestType,
        PoNumber: docNumber,
      };
    }

    this.spinner.show();

      forkJoin({
        cocFormList: this.cocService.getCOCFormList(), // Ensure this returns an Observable
        formDetails: this.api.post('GetCocFormSet', payload)
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async ({ cocFormList, formDetails }) => {
            this.cocFormDownLoadDropdown = cocFormList; // Store the form list
      
            const _formDetails: CocFormField = formDetails.d;
            await this.patchFormValues(_formDetails);
            
            this.spinner.hide();
          },
          (error) => {
            this.cs.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );

  }

  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Patch Form Values To COC form
   * @param value
   */
  async patchFormValues(value: CocFormField) {
    if (this.reOpen) {
      value.CocNumber = '';
    }
    // * Convert Contract Date
    value.ContractDate = this.cs.getDa(value.ContractDate);
    const isFinalSettlement = value.Isfinalsettlement === 'Y' ? 'Yes' : 'No';
    value.Isfinalsettlement = isFinalSettlement;
    
    if (value.Bgvaliddatecal) {
      this.CocForm.get('Bgvaliddatecal')?.setValue(value.Bgvaliddatecal)
    } else {
      value.Bgvaliddatecal = 'H'
      this.CocForm.get('Bgvaliddatecal')?.setValue(value.Bgvaliddatecal)
    }
    await this.delay(500)
    
    this.setisDiabledFormAction(isFinalSettlement);

    // * Convert Invoive Issue Date
    if (value.InvIssueDate) {
      const _InvIssueDate = new Date(
        this.cs.getDa(value.InvIssueDate)
      ).getTime();
      const _TodaysDate = new Date().getTime();
      if (_InvIssueDate > _TodaysDate) {
        value.InvIssueDate = '';
      } else {
        value.InvIssueDate = this.cs.getDa(value.InvIssueDate);
      }
    }

    // * Convert Work Start Date
    if (value.WorkStartDt) {
      if (value.WorkStartDt !== '') {
        if (value.Bgvaliddatecal === 'H') {
          value.WorkStartDt = this.convertToHijriDate(typeof(value.WorkStartDt) === 'string' ? value.WorkStartDt : '');
        } else {
          value.WorkStartDt = this.cs.getDa(value.WorkStartDt)
        }
      }
    }

    // * Convert Work End Date
    if (value.WorkEndDt) {
      if (value.WorkEndDt !== '') {
        this.minEndDate = value.WorkStartDt;
        if (value.Bgvaliddatecal === 'H') {
          value.WorkEndDt = this.convertToHijriDate(typeof(value.WorkEndDt) === 'string' ? value.WorkEndDt : '');
        } else {
          value.WorkEndDt = this.cs.getDa(value.WorkEndDt)
        }
      }
    }

    // * Get PO Details Array
    if (this.reOpen || (this.cocNumber && !this.poDetailsList.length)) {
      if (value.PoDetailsList) {
        this.poDetailsList = value.PoDetailsList.map((poDetails) => {
          return {
            ...poDetails,
            SesAmount: this.currenyPipe.transform(poDetails.SesAmount),
            SesRemainingAmt: this.currenyPipe.transform(
              poDetails.SesRemainingAmt
            ),
            PoAmount: this.currenyPipe.transform(poDetails.PoAmount),
            PoRemainingAmt: this.currenyPipe.transform(
              poDetails.PoRemainingAmt
            ),
            CocAmount: this.currenyPipe.transform(poDetails.CocAmount),
          };
        });
      } else {
        this.poDetailsList = [];
      }
    }

    // * Calculation of COC Amount and Invoice Amount
    if (!this.cocNumber) {
      value.Penalties = 0;
      value.AdvancePayment = 0;
    }
    if (
      (!value.CocAmount || parseInt(value.CocAmount.toString()) === 0) &&
      this.poDetailsList.length > 0
    ) {
      const totalCocAmount = this.poDetailsList
        ?.map((item) => parseFloat(this.cs.removeCommas(item.CocAmount)))
        .reduce((prev, next) => prev + next);
      value.InvAmount = totalCocAmount;
      value.CocAmount = this.calculateCocAmount(
        value.InvAmount,
        value.Penalties,
        value.RetentionField,
        value.AdvancePayment
      );
    }

    // * Calculate Percentage of Completion
    const _invoiceAmont = parseFloat(value.InvAmount.toString());
    const _disbursedAmount = parseFloat(value.DisbursedAmount.toString());
    const _conractAmount = parseFloat(value.ContractAmount.toString());

    if (_conractAmount > 0) {
      value.PercentCompletion =
        this.cs.truncate(
          ((_invoiceAmont + _disbursedAmount) / _conractAmount) * 100,
          2
        ) ?? 0;
    }

    value = this.addCurrencyFormatToAmountFields(value);
    console.log(value)
    this.CocForm.patchValue(value);
    this.CocForm.updateValueAndValidity();
    console.log(this.CocForm)
    
    if(this.currentRole === 'FO'){

        this.CocForm.get('WorkStartDt')?.valueChanges.subscribe((date) => {
        if (date) {
          this.minWorkEndDate = this.hjiriDate.getNext(date, 'd', 1)
          this.CocForm.get('WorkEndDt')?.reset();
        }
      })
    }

  }

  convertToHijriDate(date: string): any {
    return {
      year: parseInt(date.substring(0, 4), 10),
      month: parseInt(date.substring(4, 6), 10),
      day: parseInt(date.substring(6, 8), 10),
    };
  }

  convertHijriToString(date: any): string {
    if (!date || !date.year || !date.month || !date.day) {
      console.warn('Invalid Hijri date:', date);
      return ''; // Return an empty string if input is invalid
    }

    return moment(`${date.year}-${date.month}-${date.day}`, 'iYYYY-iM-iD') // Use Hijri format
      .format('YYYYMMDD'); // Convert to expected output format
  }

  /**
   * Calculate and Return COC Amount
   * @param invoiceAmount
   * @param penaltyAmount
   * @param retentionPercentage
   * @param advancePayment
   * @returns
   */
  calculateCocAmount(
    invoiceAmount: string | number,
    penaltyAmount: string | number,
    retentionPercentage: string | number,
    advancePaymentPercentage: string | number
  ): string | number {
    const advancePayment =
      (parseFloat(advancePaymentPercentage ? advancePaymentPercentage.toString() : '0') /
        100) *
      parseFloat(invoiceAmount ? invoiceAmount.toString() : '0');
    const _cocAmount = 
      parseFloat(invoiceAmount ? invoiceAmount.toString() : '0') -
      parseFloat(penaltyAmount ? penaltyAmount.toString() : '0') -
      advancePayment
      // parseFloat(advancePayment ? advancePayment.toString() : '0');
    return _cocAmount > 0
      ? this.currenyPipe.transform(_cocAmount.toString())
      : '0';
  }

  /**
   * Enable Penalty field
   */
  enablePenalty(): void {
    this.CocForm.get('Penalties')?.enable();
  }

  /**
   * Disable Form Fields
   */
  disableFields(): void {
    this.CocForm.get('EtmdRefNo')?.disable();
    this.CocForm.get('WorkStartDt')?.disable();
    this.CocForm.get('WorkEndDt')?.disable();
  }

  /**
   * Return false if its after today
   * @param current
   * @returns
   */
  disableFutureDate(current: any) {
    var startDate = moment().add(0, 'days'); //Today.
    // It will return false if its before today
    return startDate < current;
  }

  filenetUpload(evt: any) {
    let itnatt = this.fileNetList.length + 1;
    this.spinner.show();
    const payload: CocFormToAttachNavItem = {
      CocNo: this.cocNumber,
      FilenetId:
        evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace(
          '{',
          ''
        ).replace('}', ''),
      FileName:
        evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      CreatedBy: this.cs.getUserData().userid,
      CreatedOn: '',
      CreatedAt: '',
    };
    this.api
      .post('COCAttachmentPost', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.d?.CocNo) {
            this.fileNetList.push({
              ItemNo: itnatt,
              FilenetID:
                evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace(
                  '{',
                  ''
                ).replace('}', ''),
              FileName:
                evt.createDocWithContentResponse.fileNetCreatedDocument
                  .docTitle,
              UserId: response?.d?.CreatedBy,
            });
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  fileSapUpload(evt: any) {
    let itnatt = this.fileNetList.length + 1;
    this.spinner.show();
    const payload: CocFormToAttachNavItem = {
      CocNo: this.cocNumber,
      FilenetId: evt.Fileid,
      FileName: evt.Filename,
      CreatedBy: this.cs.getUserData().userid,
      CreatedOn: '',
      CreatedAt: '',
    };
    this.api
      .post('COCAttachmentPost', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.d?.CocNo) {
            this.fileNetList.push({
              ItemNo: itnatt,
              FilenetID: evt.Fileid,
              FileName: evt.Filename,
              UserId: response?.d?.CreatedBy,
            });
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  filenetDelete(evt: any) {
    this.spinner.show();
    const payload: CocFormToAttachNavItem = {
      CocNo: this.cocNumber,
      FilenetId: evt.FilenetID,
      FileName: '',
      CreatedBy: '',
      CreatedOn: '',
      CreatedAt: '',
      Operation: 'D',
    };
    this.api
      .post('COCAttachmentPost', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.d?.CocNo) {
            this.fileNetList = this.fileNetList.filter(
              (file: any) => evt.FilenetID !== file.FilenetID
            );
            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en'
                ? response.d.MessageEn
                : response.d.MessageAr
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  fileSapDelete(evt: any) {
    this.spinner.show();
    const payload: CocFormToAttachNavItem = {
      CocNo: this.cocNumber,
      FilenetId: evt.FilenetID,
      FileName: '',
      CreatedBy: '',
      CreatedOn: '',
      CreatedAt: '',
      Operation: 'D',
    };
    this.api
      .post('COCAttachmentPost', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.d?.CocNo) {
            this.fileNetList = this.fileNetList.filter(
              (file: any) => evt.FilenetID !== file.FilenetID
            );
            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en'
                ? response.d.MessageEn
                : response.d.MessageAr
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  /**
   * Submit Comment
   */
  submitComment(): void {
    this.spinner.show();
    const payload = {
      CocNo: this.cocNumber,
      CommentId: '',
      CommentText: this.commentValue,
      CommentBy: this.cs.getUserData().userid,
      CommentTime: '',
      CommentRole: this.currentRole,
    };
    this.api
      .post('COCPostComment', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response?.d?.CocNo) {
            this.spinner.hide();
            this.addCommentsModal = false;
            this.cs.createMessage(
              'success',
              this.translate.instant('COM.CommentAdded')
            );
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
  }

  /**
   * Make an API call to get the comment histroy
   */
  getComments(): void {
    this.commentList = [];
    this.spinner.show();
    const payload = {
      CocNo: this.cocNumber,
    };
    this.api
      .post('CocCommentsSet', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          const _response = response?.d?.results;
          if (_response.length) {
            this.commentList = _response.map((comment: any) => {
              delete comment.__metadata;
              return comment;
            });
            this.viewCommentHistoryModal = true;
          } else {
            this.cs.createMessage(
              'error',
              this.translate.instant('contract.Comment.NoComment')
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  /**
   * Return the Confirmation Model Title
   */
  getConfirmationModelTitle(actionCode: string): string {
    switch (actionCode) {
      case ActionCode.createCoc:
        return this.translate.instant('COC.Do you want to Create COC?');

      case ActionCode.AssignToProjectManager:
        this.isAssignable = true;
        return this.translate.instant(
          'COC.Do you want to Assign to Project Manager?'
        );

      case ActionCode.approveRequest:
        this.isAssignable = false;

        return this.translate.instant('COC.Do you want to Approve Request?');

      case ActionCode.rejectRequest:
        this.isAssignable = false;
        return this.translate.instant('COC.Do you want to Reject Request?');

      case ActionCode.addPenalty:
        this.isAssignable = false;
        return this.translate.instant('COC.Do you want to Add Penalty?');

      case ActionCode.noPenalty:
        this.isAssignable = false;
        return this.translate.instant(
          'COC.Do you want to submit without penalty? (Note: Penalty will be consider as 0)'
        );

      case ActionCode.cancelCoc:
        this.isAssignable = false;
        return this.translate.instant('COC.Do you want to cancel COC?');

      default:
        return '';
    }
  }

  getOtpConfirmation(action: string, status: string, role: string) {
    this.spinner.show();

    this.otpSubmitValue.action = action;
    this.otpSubmitValue.status = status;
    this.otpSubmitValue.role = role;

    const data = {
      UserId: this.cs.getUserData().userid,
    };
    this.api
      .post('/OTP', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res.d.results[0].MessageId === 'S') {
          this.cs.createMessage(
            'success',
            this.cs.userLanguage === 'en'
              ? res.d.results[0].OtpNo
              : res.d.results[0].OtpNo
          );
          this.otpValue = res.d.results[0].OtpNo;
          console.log(this.otpValue);
          this.getOTPModel = !this.getOTPModel;
        } else if (
          res.d.results[0].MessageId === '' ||
          res.d.results[0].MessageId === 'E'
        ) {
          this.cs.createMessage(
            'error',
            this.cs.userLanguage === 'en'
              ? res.d.results[0].MessageEn
              : res.d.results[0].MessageAr
          );
        } else {
          this.spinner.hide();
          this.cs.createMessage(
            'error',
            this.translate.instant('COM.OTPNotSent')
          );
        }
      });
  }

  updateModelVisiblity(visibility: boolean) {
    this.getOTPModel = visibility;
  }

  SubmitOTP(data: any) {
    if (data.length === 5) {
      if (data === this.otpValue) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.OTPvalidatedSucccessfully')
        );
        this.submit(
          this.otpSubmitValue.action,
          this.otpSubmitValue.status,
          this.otpSubmitValue.role
        );
      } else if (data !== this.otpValue) {
        this.cs.createMessage(
          'success',
          this.translate.instant('COM.InvalidOTP')
        );
      }
    }
  }

  /**
   * Submit method for Save as Draft / Save / Assign Back
   * @param actionCode - `enum ActionCode`
   */
  submit(
    actionCode: ActionCode | string,
    statusCode: StatusCode | string,
    role?: string,
    selectedUser?: string
  ) {
    console.log('Selected User:', selectedUser);

    if (this.CocForm.get('CocAmount')?.value.toString() === '0') {
      this.cs.createMessage(
        'error',
        this.translate.instant('COC.CocAmountreq')
      );
      return;
    }

    if (
      (this.actionButtons.length || actionCode === ActionCode.cancelCoc) &&
      actionCode !== ActionCode.createCoc &&
      actionCode !== ActionCode.AssignToProjectManager
    ) {
      this.spinner.show();
      let payload: COCActionButton = {
        UserId: this.cs.getUserData().userid,
        CocNumber: this.cocNumber,
        CocStatus: statusCode,
        CocRole: role ?? this.currentRole,
        CocAction: actionCode,
      };
      if (
        actionCode === ActionCode.addPenalty ||
        actionCode === ActionCode.approveRequest
      ) {
        payload.RetentionField =
          this.CocForm.get('RetentionField')?.value.toString() ?? '';
        payload.CocAmount =
          this.cs
            .removeCommas(this.CocForm.get('CocAmount')?.value)
            .toString() ?? '';
        payload.Penalties =
          this.cs
            .removeCommas(this.CocForm.get('Penalties')?.value)
            .toString() ?? '';
      }
      if (actionCode === ActionCode.noPenalty) {
        this.CocForm.get('Penalties')?.setValue(0);
        payload.CocAmount =
          this.cs
            .removeCommas(this.CocForm.get('CocAmount')?.value)
            .toString() ?? '';
        payload.RetentionField =
          this.CocForm.get('RetentionField')?.value.toString() ?? '';
      }

      this.api
        .post('COCActionPost', payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.spinner.hide();
            if (response?.d?.CocNumber) {
              this.cs.activeMenu = 'projectowner';
              this.cocService.gotoListPage();
              this.cs.createMessage(
                'success',
                this.cs.userLanguage === 'en'
                  ? response?.d?.MessageEn
                  : response?.d?.MessageAr
              );
            }
          },
          (error) => {
            this.cs.createMessage('error', error.statusText);
            this.spinner.hide();
          }
        );
      return;
    }

    const cocFormPayload: COCFormPayload = this.constructPayload(
      actionCode,
      statusCode,
      selectedUser
    );
    console.log(cocFormPayload);

    this.spinner.show();
    this.api
      .post('CocFormSet', cocFormPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response?.d?.CocNumber) {
            this.spinner.hide();
            this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'en'
                ? response?.d?.MessageEn
                : response?.d?.MessageAr
            );
            if (
              actionCode === ActionCode.AssignToProjectManager ||
              this.reOpen
            ) {
              this.cs.activeMenu = 'projectowner';
              this.cocService.gotoListPage();
              return;
            }
            this.cocNumber = response.d.CocNumber;
            this.CocForm.get('CocNumber')?.patchValue(response.d.CocNumber);
            this.CocForm.updateValueAndValidity();
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
  }

  /**
   * Constructs and Returns the payload
   * @returns `COCFormPayload`
   */
  constructPayload(
    actionCode: ActionCode | string,
    status: StatusCode | string,
    approverUserName?: string
  ): COCFormPayload {
    const formData = this.CocForm.getRawValue();
    return {
      UserId: this.cs.getUserData().userid,
      CocNumber: formData?.CocNumber ?? '',
      ProjectName: formData?.ProjectName,
      ReferenceCoc: this.reOpen ? this.referenceCocNumber : '',
      ContractNo: formData?.ContractNo,
      ContractDate: formData?.ContractDate
        ? this.cs.getCurrentDateInApiFormat(formData?.ContractDate)
        : '',
      PercentCompletion: formData?.PercentCompletion.toString(),
      VendorName: formData?.VendorName,
      PhaseName: formData?.PhaseName,
      InvNumber: formData?.InvNumber,
      Isfinalsettlement: formData?.Isfinalsettlement,
      InvIssueDate: this.cs.getCurrentDateInApiFormat(formData?.InvIssueDate),
      InvAmount: this.cs.removeCommas(formData?.InvAmount).toString(),
      RetentionField: formData?.RetentionField.toString(),
      AdvancePayment: formData?.AdvancePayment.toString(),
      Penalties: this.cs.removeCommas(formData?.Penalties).toString(),
      CocAmount: this.cs.removeCommas(formData?.CocAmount).toString(),
      ContractAmount: this.cs.removeCommas(formData?.ContractAmount).toString(),
      DisbursedAmount: this.cs
        .removeCommas(formData?.DisbursedAmount)
        .toString(),
      ContractRemAmount: this.cs
        .removeCommas(formData?.ContractRemAmount)
        .toString(),
      EtmdRefNo: formData?.EtmdRefNo.toString(),
      Bgvaliddatecal: formData?.Bgvaliddatecal,
      WorkStartDt: formData?.Bgvaliddatecal === 'G' ? this.cs.getCurrentDateInApiFormat(formData?.WorkStartDt) : 
                  this.convertHijriToString(formData?.WorkStartDt),
      WorkEndDt: formData?.Bgvaliddatecal === 'G' ? this.cs.getCurrentDateInApiFormat(formData?.WorkEndDt) : 
                 this.convertHijriToString(formData?.WorkEndDt),
      CocAction: actionCode,
      CocRole: this.currentRole,
      CocStatus: status,
      NextApprover: approverUserName ?? '',
      CocHeadtoItemNav: this.poDetailsList.map((po) => {
        return {
          CocNumber: '',
          PoNo: po.PoNo,
          PoItemNo: po.PoItemNo,
          PoIssueDate: po.PoIssueDate,
          PoAmount: this.cs.removeCommas(po.PoAmount),
          SesNo: po.SesNo,
          SesAmount: this.cs.removeCommas(po.SesAmount),
          CocAmount: this.cs.removeCommas(po.CocAmount),
        };
      }),
    };
  }

  /**
   * Download COC Document
   */
  downloadCocDocument(): void {
    this.spinner.show();
    const payload = {
      CocNumber: this.cocNumber,
    };
    this.api
      .post('getCOCDocument', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response?.d?.Base64) {
            this.spinner.hide();
            this.downloadDocument(
              response?.d?.Base64,
              'COCDocument(' + payload.CocNumber + ')'
            );
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
  }

  /**
   * Download SES Document
   * @param sesNo
   */
  downloadSESDocument(sesNo: string) {
    this.spinner.show();
    const payload = {
      SesNumber: sesNo,
    };
    this.api
      .post('getSESDocument', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response?.d?.Base64) {
            this.spinner.hide();
            this.downloadDocument(
              response?.d?.Base64,
              'SESDocument(' + payload.SesNumber + ')'
            );
          }
        },
        (error) => {
          this.cs.createMessage('error', error.statusText);
          this.spinner.hide();
        }
      );
  }

  /**
   * Download Document
   * @param base64
   */
  downloadDocument(base64: string, _fileName: string): void {
    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement('a');
    const fileName = _fileName + '.pdf';
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  /**
   * Returns the date formatted
   * @param date
   * @returns
   */
  getFormattedDate(date: string): string {
    return (
      date.slice(0, 4) +
      '/' +
      date.slice(4, 6) +
      '/' +
      date.slice(6, 8) +
      ' ' +
      date.slice(8, 10) +
      ':' +
      date.slice(10, 12) +
      ':' +
      date.slice(12, 14)
    );
  }

  /**
   * Format the Amount field
   * @param value
   * @returns
   */
  addCurrencyFormatToAmountFields(value: CocFormField): CocFormField {
    value.CocAmount = this.currenyPipe.transform(value.CocAmount);
    value.ContractAmount = this.currenyPipe.transform(value.ContractAmount);
    value.InvAmount = this.currenyPipe.transform(value.InvAmount);
    value.Penalties = this.currenyPipe.transform(value.Penalties);
    value.DisbursedAmount = this.currenyPipe.transform(value.DisbursedAmount);
    value.ContractRemAmount = this.currenyPipe.transform(
      value.ContractRemAmount
    );
    return value;
  }

  /**
   * Get the COC Histroy details
   */
  getHistroy(): void {
    const payload = { CocNumber: this.cocNumber };
    this.spinner.show();
    this.api
      .post('getCocHistory', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.d?.results) {
            this.viewCocProcessHistoryModal = true;
            this.cocHistory = this.cocService
              .addSerialNumber(response.d.results)
              .map((history: COCHistory) => {
                return {
                  SiNo: history.SiNo,
                  CreatedBy: history.CreatedBy,
                  CreatedByAr: history.CreatedByAr,
                  CocAction: history.CocAction,
                  CocActionAr: history.CocActionAr,
                  CocRole: history.CocRole,
                  CocRoleAr: history.CocRoleAr,
                  CreatedDate: history.CreatedDate,
                  CreatedTime: history.CreatedTime,
                };
              });
          } else {
            this.cs.createMessage(
              'error',
              this.translate.instant('contract.common.NoRecordFound')
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);
        }
      );
  }

  /**
   * TrackBy History list method
   * @param index
   * @param history
   * @returns Unique ID
   */
  historyIdIdentify(index: number, history: COCHistory) {
    return history.SiNo;
  }

  // * Getter methods
  get ActionCode() {
    return ActionCode;
  }
  get StatusCode() {
    return StatusCode;
  }
  get hasCOCNumber(): boolean {
    if (this.cocNumber) return true;
    return false;
  }
  get SERVICE_PO_CODE(): string {
    return SERVICE_PO_CODE;
  }
  get statusNotRejected(): boolean {
    return this.CocForm.get('DocumentEnable')?.value === 'X' ? true : false;
  }

  cocFormDownloadAction(action: string, fileName: string) {
    if (cocFormDownload.ETIMADFORM === action) {
      this.cocFormDownload(action, fileName);
    } else if (cocFormDownload.FINALSETTELMENT === action) {
      this.cocFormDownload(action, fileName);
    } else if (cocFormDownload.INTERNALFORM === action) {
      this.cocFormDownload(action, fileName);
    }
  }

  cocFormDownload(action: string, fileName: string) {
    this.isCOCFormDownloadLoading = true;
    this.cocService
      .downloadCOCForm(this.cocNumber, action)
      .subscribe((response: any) => {
        // Extract the Base64 string from the response
        const base64Data = response?.d?.Base64;
        console.log(base64Data);

        const dataUrl = `data:application/pdf;base64,${base64Data}`; // Create a Data URL
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${this.CocForm.get('CocNumber')?.value}_${fileName}`;
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.isCOCFormDownloadLoading = false;
      });
  }

  getCOCFormDownloadList() {
    this.cocService
      .getCOCFormList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((formList) => {
        this.cocFormDownLoadDropdown = formList;
        console.log(this.cocFormDownLoadDropdown)

        // this.setisDiabledFormAction('No');
      });
  }

  setisDiabledFormAction(value: string) {
    const isFinalSettlement = value === 'No';

    this.cocFormDownLoadDropdown.forEach((action: dropDown) => {
      action.isDisabled =
        action.domvalue_l === cocFormDownload.FINALSETTELMENT
          ? isFinalSettlement
          : false;
    });
    console.log(this.cocFormDownLoadDropdown);
    
  }
  getCOCUserList(userListType: string) {
    const userListMethods: Record<'FO' | 'MN', () => Observable<userList[]>> = {
      FO: () => this.cocService.getCOCUserList(),
      MN: () => this.cocService.getCOCFilteredUserList(),
    };

    if (userListType in userListMethods) {
      userListMethods[userListType as 'FO' | 'MN']() // Type assertion
        .pipe(takeUntil(this.destroy$))
        .subscribe((userList) => {
          console.log(userList)
          this.COCUserList = userList;
          this.COCUserList = userList.filter((user: userList) => 
            user.UserID !== this.cs.getUserData().userid
          );

          this.assignUser = {
            label: '',
            placeholder: 'Select user',
            listOfUsers: this.COCUserList,
          };
        });
    }
  }

  showConfirm(data: any, action: any): void {
    const config = {
      titleText: this.cs.getConfimationModalTitle(action ?? null),
      bodyText: this.cs.getConfimationMessage(action ?? null),
    };

    let isReturn: boolean | undefined = undefined;
    let returnConfig;

    if (action === UserActionCode.return) {
      isReturn = true;
      returnConfig = {
        label: this.translate.instant('COM.Select Role'),
        placeholder: this.translate.instant('COM.Select Role'),
        listofUsers: this.COCUserList,
      };
    }

    const modalRef = this.modal.create({
      nzContent: ConfirmComponent,
      nzComponentParams: { config, isReturn, returnConfig },
      nzWidth: 600,
      nzBodyStyle: { minHeight: `400px`, borderTop: `4px solid #005c99` },
      nzFooter: null,
    });

    // modalRef.afterClose
    //   .subscribe(result => {
    //     if (result) {
    //       if (isReturn) {
    //         this.bidEvalData.Returnuser = result ?? '';
    //         data.Returnuser = result ?? '';
    //       }
    //       if (this.actionCheckerForOTP(action)) {
    //         this.getOTP();
    //       } else {
    //         this.postTender(data);
    //       }
    //     }
    //   });
  }

  onWorkStartDateSelect(startDate: NgbDateStruct) {
    // Set minEndDate to the selected startDate + 1 day (so it can't be the same day)
    const nextdateToTheSelectedDate = { 
      year: startDate.year, 
      month: startDate.month, 
      day: startDate.day + 1 
    };
  
    this.minEndDate = nextdateToTheSelectedDate; // Set minimum allowed date for WorkEndDt
  
    const endDate = this.CocForm.get('WorkEndDt')?.value;
  
    // Reset WorkEndDt if it is before the new minEndDate
    if (endDate && this.compareDates(endDate, nextdateToTheSelectedDate) < 0) {
      this.CocForm.get('WorkEndDt')?.setValue(null);
    }
  }

  compareDates(date1: NgbDateStruct, date2: NgbDateStruct): number {
    const d1 = new Date(date1.year, date1.month - 1, date1.day);
    const d2 = new Date(date2.year, date2.month - 1, date2.day);
    return d1.getTime() - d2.getTime();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

enum ActionCode {
  createCoc = 'CRE',
  AssignToProjectManager = 'ASG',
  addPenalty = 'ADP',
  noPenalty = 'NOP',
  approveRequest = 'APP',
  rejectRequest = 'REJ',
  cancelCoc = 'CAN',
}

enum StatusCode {
  Finance_Officer_Pending = 'FOPP',
  Pending_with_Project_Manager = 'PMPP',
  Head_Unit_Pending = 'HUVP',
  Rejected = 'REJE',
}

//PMPP
