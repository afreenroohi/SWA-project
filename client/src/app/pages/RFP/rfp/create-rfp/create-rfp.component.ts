import {
  ElementRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { saveAs } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import { Attac } from 'src/app/shared/attach';
import { caseStatus, dtypes, ptypes, durationTypes, contractTypes, competitionTypes, classificationTypes, sopData } from 'src/app/shared/shared';
import { activities } from 'src/app/shared/activity';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, combineLatest, forkJoin } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { IconList } from 'src/app/components/icon/icon.component';
import * as moment from 'moment';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { QualificationListFullResponse } from '../rfp.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ErrorPopupComponent } from 'src/app/components/error-popup/error-popup.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';



type FormOption = {
  key: string;     // value used by the select
  label: string;   // shown to user
  path: string;    // path under assets/ or a full URL
  filename?: string; // optional download filename override
};

@Component({
  selector: 'app-create-rfp',
  templateUrl: './create-rfp.component.html',
  styleUrls: ['./create-rfp.component.scss'],
})
export class CreateRFPComponent implements OnInit {
  showEmergencyDocs: boolean = false;
  step:number=0;
  //showScope=false;
  directCompetitionId: any = null;
  limitedCompetitionId: any = null;
  showInvite: boolean = false;
  userName: string = ''
  uploading = false;
  showAttachments = false;
  showScope = false;
  attachmentsActive = false;
  
  // Collapse panel states
  basicInfoActive = true;
  scopeOfWorkActive = false;
  standardsActive = false;
  billOfQuantityActive = false;
  attachmentsCollapseActive = false;

  // Collapse panel visibility
  showBasicInfo = true;
  showScopeOfWork = false;
  showStandards = false;
  showBillOfQuantity = false;
  //showAttachments = false;
  fileList: NzUploadFile[] = [];
  uploadedfiles: any[] = [];
  tooltipVisible: boolean = false;
  value = '';
  title = 'Input a number';
  listOfColumnBOQ = ["RFP.slNo", "RFP.MatDes", "RFP.QTY", "RFP.Uom", "RFP.Price", "RFP.TotalPrice", "RFP.VATAmount", "RFP.TotalWithVAT", "RFP.Action"]
  listOfColumnEvalCriteria = ['RFP.slNo', 'RFP.Headline', "RFP.Weightage", "RFP.Action"]
  listOfSubCatColumnEvalCriteria = ['RFP.slNo', 'RFP.Des', "RFP.Weightage", "RFP.Action"]
  listOfColumnTechReq = ['RFP.slNo', 'RFP.Des', 'RFP.Action']
  listOfColumnPay = ['RFP.slNo', 'RFP.Payment Description', 'RFP.Percentage', 'RFP.Action']
  listOfColumnMan = ['RFP.slNo', 'RFP.JobTitle', 'RFP.QTY', 'RFP.Qualification', 'RFP.Specialization', 'RFP.ExperienceText', 'RFP.Action']
  listOfColumnConsult = ['RFP.slNo', 'RFP.Phase', 'RFP.ListOfDels', 'RFP.DelDate', 'RFP.Des', 'RFP.Action']
  private basicRequiredControls = ['competitionType', 'competitionName', 'estimatedCost', 'DurationType', 'ProjDur', 'workLocation', 'activity', 'subactivity'];
  directPurchaseOptions = [
    // { value: 'below100k', label: 'Less than 100k' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'GovernmentToG', label: 'Government Contract​' },
    { value: 'oneSupplier', label: 'One Supplier' },
    { value: 'sensitiveSecurity', label: 'Sensitive security project' }
  ];

  limitedOptions = [
    // { value: 'below500k', label: 'Less than 500k' },
    { value: 'urgent​', label: 'Urgent​' },
    { value: 'Except', label: 'Except' },
    { value: 'Consultative​', label: 'Consultative​' }
  ];

  // threshold constant
  DIRECT_COST_THRESHOLD = 1_000_00;
  DIRECT_COST_THRESHOLD2 = 500000;


  formOptions: Array<{ key: string; label: string; path: string; filename?: string }> = [

    {
      key: 'الشروط الخاصة المواد والمعدات',
      label: 'الشروط الخاصة المواد والمعدات.docx',
      path: 'assets/forms/الشروط الخاصة المواد والمعدات.docx',         // or rename and remove spaces
      filename: 'الشروط الخاصة المواد والمعدات.docx'
    },
    {
      key: 'نموذج اتفاقية إطارية',
      label: 'نموذج اتفاقية إطارية.docx',
      path: 'assets/forms/نموذج اتفاقية إطارية.docx',         // or rename and remove spaces
      filename: 'نموذج اتفاقية إطارية.docx'
    },
    {
      key: 'الشروط الخاصة بالعمالة',
      label: 'الشروط الخاصة بالعمالة.docx',
      path: 'assets/forms/الشروط الخاصة بالعمالة.docx',         // or rename and remove spaces
      filename: 'الشروط الخاصة بالعمالة.docx'
    },
    {
      key: 'الملحق الاسترشادي',
      label: 'الملحق الاسترشادي.docx',
      path: 'assets/forms/الملحق الاسترشادي.docx',         // or rename and remove spaces
      filename: 'الملحق الاسترشادي.docx'
    },
    {
      key: 'آلية تقديم العطاء وخطاب تقديم العروض',
      label: 'آلية تقديم العطاء وخطاب تقديم العروض.docx',
      path: 'assets/forms/آلية تقديم العطاء وخطاب تقديم العروض.docx',         // or rename and remove spaces
      filename: 'آلية تقديم العطاء وخطاب تقديم العروض.docx'
    },
    {
      key: 'شـهادة زيـارة الموقع 2024',
      label: 'شـهادة زيـارة الموقع 2024.docx',
      path: 'assets/forms/شـهادة زيـارة الموقع 2024.docx',         // or rename and remove spaces
      filename: 'شـهادة زيـارة الموقع 2024.docx'
    },
    {
      key: 'كيفية تنفيذ الأعمال والخدمات',
      label: 'كيفية تنفيذ الأعمال والخدمات.docx',
      path: 'assets/forms/كيفية تنفيذ الأعمال والخدمات.docx',         // or rename and remove spaces
      filename: 'كيفية تنفيذ الأعمال والخدمات.docx'
    },
    {
      key: 'معايير تقييم العروض الفنية _',
      label: 'معايير تقييم العروض الفنية _.docx',
      path: 'assets/forms/معايير تقييم العروض الفنية _.docx',         // or rename and remove spaces
      filename: 'معايير تقييم العروض الفنية _.docx'
    },
  ];

  selectedFormKey: string | null = null;

  readonly IconList = IconList;

  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  userList: any;
  managerList: any[] = [];
  dateFormat = 'yyyy/MM/dd';
  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');

  precision = 2;

  rfpForm!: FormGroup;

  arabicInputPattern = /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/;
  sl = 1;
  slp = 1;
  slq = 1;
  slel = 1;
  srNoTechReq = 1;
  slatt = 1;
  slman = 1;
  slcon = 1;

  expandIconPosition: 'left' | 'right' = 'right';

  evalEditIndex = 0;
  techReqEditIndex = 0;
  payEditIndex = 0;
  manEditIndex = 0;
  consultEditIndex = 0;

  showEditEval: boolean = false;
  showEditTechReq: boolean = false;
  showEditPay: boolean = false;
  showEditMan: boolean = false;
  showEditConsult: boolean = false;
  showDirectPurchaseField: boolean = false;
  showLimitedField: boolean = false;
  showErrorField: boolean = false;
  isPrivateSelected: boolean = false;
  selectedBundleIndex: number | null = null;
  selectedYears: number = 1;

  workforceRows: any[] = [{}];
  materialsRows: any[] = [{}];
  equipmentRows: any[] = [{}];
  serviceRows: any[] = [{}];

  boqListData: any;
  boqList?: FormArray;
  attList?: FormArray;

  QualList?: FormArray;
  EvalListData: any[] = [];
  TechReqListData: any[] = [];

  ManPowerListData: any[] = [];
  ConsultListData: any[] = [];

  matGp: any;
  purGp: any;
  uOM: any;
  Costctr: any;
  projTy: any;
  Depts: any;

  isEnglish = false;

  isConsult = true;
  isManPow = true;
  isTechRFP = false;
  isSingleVendor = false;

  dtypes = dtypes;
  durationTypes = durationTypes;
  contractTypes = contractTypes;
  competitionTypes = competitionTypes;
  classificationTypes = classificationTypes;
  activityList = activities;
  sopData = sopData;
  filteredSubactivities: any[] = [];

  responseMessage: any;
  submitConfirmation: boolean = false;
  submitConfirmationFailure: boolean = false;

  fileNetList: any[] = [];

  ptypes: any = [];
  step1 = false;

  step2 = true;

  step3 = true;

  step4 = true;
  progressPercent = 0;

  invalidFileSize = false;
  invalidFileType = false;
  certificatedet = false;



  expcriteria = false;
  concriteria = false;
  hrcriteria = false;
  isSubmitClick = false;

  attachArray: Attac[] = [];

  depid: any;
  now: any;
  reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

  allPurGrp: any;
  ITCheckList: any = {};
  childCheckList: any = [];
  procurementCheckListData: any = [];

  boqTabelList: any = [];
 

  managerSubId: string = '';

  costvalue: any;

  editTotTechEval: boolean = true;

  isSubCriteria: boolean = false;
  isSubCriteriaToggle: boolean = false

  isSubCriteriaEdit: boolean = false;
  listOfBudgetingYears: number[] = []
  groupBOQItemsBasedonBudgetingYears: any[] = []
  selectedBOQItemForLookUp: any


  subCriteriaForm: FormGroup = this.fb.group({
    subCriterias: this.fb.array([
      this.initialSubCriteria
    ])
  })

  qualificationList: QualificationListFullResponse = {
    d: {
      results: []  // Initialize results as an empty array
    }
  };

  private readonly destroy$ = new Subject<void>();



  get billOFQtyFA(): FormArray {
    return this.rfpForm?.get('billOFQty') as FormArray;
  }



  constructor(
    public cs: CommonService,
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private currenyPipe: CommaSeparatePipe,
    private rfpService: RFPService,
    private modal: NzModalService,
    private http: HttpClient
  ) {
    this.buildMainFormGroup();
    console.log(activities, 'activities====')
  }

  // Form validation getters
  get basicInfoValid(): boolean {
    if (!this.rfpForm) return false;
    
    // Base required fields
    const baseRequiredFields = ['competitionType', 'competitionName', 'estimatedCost', 'DurationType', 'ProjDur', 'workLocation', 'activity', 'subactivity', 'projectJustification'];
    
    // Check base fields
    const baseValid = baseRequiredFields.every(field => {
      const control = this.rfpForm.get(field);
      return control && control.valid && control.value;
    });
    
    if (!baseValid) return false;
    
    // Check conditional fields based on toggle states
    const requiresSiteVisit = this.rfpForm.get('requiresSiteVisit')?.value;
    if (requiresSiteVisit) {
      const siteVisitFields = ['userId', 'email', 'contactNumber'];
      const siteVisitValid = siteVisitFields.every(field => {
        const control = this.rfpForm.get(field);
        return control && control.valid && control.value;
      });
      if (!siteVisitValid) return false;
    }
    
    const prequalificationRequired = this.rfpForm.get('prequalificationRequired')?.value;
    if (prequalificationRequired) {
      const prequalControl = this.rfpForm.get('prequalificationDetails');
      if (!prequalControl || !prequalControl.valid || !prequalControl.value) {
        return false;
      }
    }
    
    const projectRelaunched = this.rfpForm.get('projectRelaunched')?.value;
    if (projectRelaunched) {
      const numberControl = this.rfpForm.get('number');
      if (!numberControl || !numberControl.valid || !numberControl.value) {
        return false;
      }
    }
    
    return true;
  }

  // Track if user has explicitly saved and continued from each step
  private basicInfoSaved = false;
  private scopeOfWorkSaved = false;
  private standardsSaved = false;
  private billOfQuantitySaved = false;

  get scopeOfWorkValid(): boolean {
    if (!this.rfpForm) return false;
    const requiredFields = ['definationCompetition', 'ProjJust', 'SOP', 'labor', 'materials', 'equipment', 'qualitySpecifications', 'safetySpecifications'];
    return requiredFields.every(field => {
      const control = this.rfpForm.get(field);
      return control && control.valid && control.value;
    });
  }

  get standardsValid(): boolean {
    return this.TechReqListData.length > 0 && this.evalCriteriaItems.length > 0;
  }

  get billOfQuantityValid(): boolean {
    return true; // Always valid to allow progression
  }

  // Navigation methods
  goto(stepIndex: number): void {
    if (!this.canNavigateToStep(stepIndex)) {
      this.showError();
      return;
    }
    this.step = stepIndex;
    this.showCorrectSection(stepIndex);
    this.activateCollapse(this.getCollapseSection(stepIndex));
  }

  private getCollapseSection(stepIndex: number): string {
    const sections = ['basicInfo', 'scopeOfWork', 'standards', 'billOfQuantity', 'attachments'];
    return sections[stepIndex] || 'basicInfo';
  }

  activateCollapse(section: string): void {
    this.basicInfoActive = section === 'basicInfo';
    this.scopeOfWorkActive = section === 'scopeOfWork';
    this.standardsActive = section === 'standards';
    this.billOfQuantityActive = section === 'billOfQuantity';
    this.attachmentsCollapseActive = section === 'attachments';
    
    // Scroll to the section after a brief delay to ensure DOM is updated
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  private showCorrectSection(stepIndex: number): void {
    // Reset all sections
    this.showBasicInfo = false;
    this.showScopeOfWork = false;
    this.showStandards = false;
    this.showBillOfQuantity = false;
    this.showAttachments = false;

    // Show the correct section based on step
    switch (stepIndex) {
      case 0:
        this.showBasicInfo = true;
        break;
      case 1:
        this.showScopeOfWork = true;
        break;
      case 2:
        this.showStandards = true;
        break;
      case 3:
        this.showBillOfQuantity = true;
        break;
      case 4:
        this.showAttachments = true;
        break;
    }
  }

  canNavigateToStep(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return true;
      case 1: return this.basicInfoValid && this.basicInfoSaved;
      case 2: return this.basicInfoValid && this.basicInfoSaved && this.scopeOfWorkValid && this.scopeOfWorkSaved;
      case 3: return this.basicInfoValid && this.basicInfoSaved && this.scopeOfWorkValid && this.scopeOfWorkSaved && this.standardsValid && this.standardsSaved;
      case 4: return this.basicInfoValid && this.basicInfoSaved && this.scopeOfWorkValid && this.scopeOfWorkSaved && this.standardsValid && this.standardsSaved && this.billOfQuantityValid && this.billOfQuantitySaved;
      default: return false;
    }
  }

  saveAsDraft(): void {
    console.log('Saving as draft...');
    // Add your draft save logic here
  }

  saveAndContinue(): void {
    if (this.basicInfoValid) {
      this.basicInfoSaved = true;
      this.step = 1;
      this.activateCollapse('scopeOfWork');
      this.showScopeOfWork = true;
      this.showBasicInfo = false;
    }
  }

  saveAndContinueScope(): void {
    if (this.scopeOfWorkValid) {
      this.scopeOfWorkSaved = true;
      this.step = 2;
      this.activateCollapse('standards');
      this.showStandards = true;
      this.showScopeOfWork = false;
    }
  }

  saveAndContinueStandards(): void {
    if (this.standardsValid) {
      this.standardsSaved = true;
      this.step = 3;
      this.activateCollapse('billOfQuantity');
      this.showBillOfQuantity = true;
       this.showStandards = false;
    }
  }

  saveAndContinueBOQ(): void {
    if (this.billOfQuantityValid) {
      this.billOfQuantitySaved = true;
      this.step = 4;
      this.activateCollapse('attachments');
      this.showAttachments = true;
      this.showBillOfQuantity = false;
    }
  }
//   get attachmentsValid(): boolean {
//   if (!this.rfpForm) {
//     return false;
//   }

//   const attachmentsGroup = this.rfpForm.get('attachments') as FormGroup;
//   if (!attachmentsGroup) {
//     return false;
//   }

//   return attachmentsGroup.valid;
// }
  // get basicInfoValid(): boolean {
  //   if (!this.rfpForm) {
  //     return false;
  //   }

  //   for (const name of this.basicRequiredControls) {
  //     const ctrl = this.rfpForm.get(name);
  //     if (!ctrl) {
  //       return false; // missing control -> invalid
  //     }
  //     if (ctrl.invalid) {
  //       return false; // invalid
  //     }
  //     const val = ctrl.value;
  //     if (
  //       val === null ||
  //       val === undefined ||
  //       (typeof val === 'string' && val.trim() === '') ||
  //       (Array.isArray(val) && val.length === 0)
  //     ) {
  //       return false; // empty
  //     }
  //   }
  //   return true;
  // }

  /** mark basic controls touched so validation messages show */
  private markBasicControlsTouched(): void {
    for (const name of this.basicRequiredControls) {
      const ctrl = this.rfpForm.get(name);
      if (ctrl) {
        ctrl.markAsTouched();
        ctrl.updateValueAndValidity();
      }
    }
  }
// goto(stepNumber: number): void {

//   // prevent skipping ahead without validation
//   if (stepNumber > this.step) {
//     if (!this.isCurrentStepValid()) {
//       this.cs.createMessage('error', "Please complete the required fields");
//       return;
//     }
//   }

//   // set the new step
//   this.step = stepNumber;

//   // open only correct collapse
//   this.openCollapse(this.step);
// }
// toggleTooltip(): void {
//   this.tooltipVisible = !this.tooltipVisible;
// }
// isCurrentStepValid(): boolean {
//   switch (this.step) {
//     case 0:
//       return this.basicInfoValid;

//     case 1:
//       return this.attachmentsValid;

//     case 2:
//       //return this.scopeValid;  // add your scope validation

//     case 3:
//       //return this.boqValid;    // add BOQ validation

//     default:
//       return true;
//   }
// }
  showError(): void {
    this.cs.createMessage('error','Please complete the previous steps before proceeding.');
  }
  /** Save & Continue: validate basic info and reveal attachments */

// openCollapse(step: number) {
//   //this.showBasic = (step === 0);
//   this.showAttachments = (step === 1);
//   this.showScope = (step === 2);
//   // continue for all remaining steps
// }

// openCollapse(step: number) {
//   // FIRST: RESET all collapses
//   //this.showBasic = false;
//   this.showAttachments = false;
//   this.showScope = false;
//   //this.showBoq = false;
//   //this.showTerms = false;

//   // THEN: Open based on step
//   switch (step) {
//     case 0:
//      // this.showBasic = true;
//       break;

//     case 1:
//       this.showAttachments = true;
//       break;

//     case 2:
//       this.showScope = true;
//       break;

//     case 3:
//       //this.showBoq = true;
//       break;

//     case 4:
//       //this.showTerms = true;
//       break;

//     default:
//       //this.showBasic = true;
//   }
// }



  get initialSubCriteria() {
    return this.fb.group({
      SubItemNo: new FormControl({ value: 1, disabled: true }, Validators.required),
      Percentage: new FormControl('', Validators.required),
      Descr: new FormControl('', [Validators.required, Validators.maxLength(600)])
    })
  }

  createSubCriteria(data: any) {
    return this.fb.group({
      SubItemNo: new FormControl({ value: data.SubItemNo, disabled: true }, Validators.required),
      Percentage: new FormControl(data.Percentage, Validators.required),
      Descr: new FormControl(data.Descr, [Validators.required, Validators.maxLength(600)])
    })
  }

  get subCriterias() {
    return this.subCriteriaForm.controls['subCriterias'] as FormArray;
  }

  // insertLaborText() {
  //   const data = this.sopData.find((item:any) => item.id === 'Labor');
  //   if (data) {
  //     this.rfpForm.get('labor')?.setValue(data.text);
  //   }
  // }

  insertLaborText() {
    const data = this.sopData.find((item: any) => item.id === 'Labor');
    if (data) {
      this.rfpForm.get('labor')?.setValue(data.text);
    }
  }

  private autoPopulateSopFields() {
    this.insertLaborText();
    this.insertMaterialsText();
    this.insertEquipmentText();
    this.insertQualityText();
    this.insertSafetyText();
  }

  insertMaterialsText() {
    const data = this.sopData.find((item: any) => item.id === 'Material');
    if (data) {
      this.rfpForm.get('materials')?.setValue(data.text);
    }
  }

  insertEquipmentText() {
    const data = this.sopData.find((item: any) => item.id === 'Equipment');
    if (data) {
      this.rfpForm.get('equipment')?.setValue(data.text);
    }
  }
  insertQualityText() {
    const data = this.sopData.find((item: any) => item.id === 'Quality');
    if (data) {
      this.rfpForm.get('qualitySpecifications')?.setValue(data.text);
    }
  }
  insertSafetyText() {
    const data = this.sopData.find((item: any) => item.id === 'Safety');
    if (data) {
      this.rfpForm.get('safetySpecifications')?.setValue(data.text);
    }
  }



  addSubCriteria() {
    const totalPercentage = this.checkEvalPer(true);
    if (totalPercentage <
      (this.isSubCriteria ?
        this.rfpForm.controls.EvalCriteria?.get('Percentage')?.value :
        this.rfpForm.controls.EvalCriteriaEdit?.get('Percentage')?.value)) {
      const subCriteria = this.fb.group({
        SubItemNo: new FormControl({ value: this.subCriterias.length + 1, disabled: true }, Validators.required),
        Percentage: new FormControl('', Validators.required),
        Descr: new FormControl('', [Validators.required, Validators.maxLength(600)])
      });
      this.subCriterias.push(subCriteria);
    } else {
      this.cs.createMessage(
        'error',
        this.translate.instant('RFP.SubCritriaEval2')
      );
    }
    console.log(this.subCriterias);
  }
deleteCriteria(index: number) {
  this.modal.confirm({
    nzTitle: 'Are you sure you want to delete this criteria?',
    nzOkText: 'Yes',
    nzOkType: 'primary',
    nzOnOk: () => {
      this.evalCriteriaItems.removeAt(index);
    },
    nzCancelText: 'No'
  });
}
  deleteSubCriteria(index: number) {
    this.subCriterias.removeAt(index);
    this.subCriterias.controls.slice(index).forEach((subCriteria, i) => {
      subCriteria.get('SubItemNo')?.setValue(index + i + 1)
    });
  }

  cancelSubCriteria() {
    this.subCriterias.clear();
    this.subCriterias.push(this.initialSubCriteria);
    this.isSubCriteria = false;
  }

  closeSubCriteria() {
    this.isSubCriteria = false;
    this.isSubCriteriaEdit = false;
  }

  onReannounceChange(value: string) {

  }
  onCompetitionChange(value: string) {
    console.log(value, 'afreen =========');

    // Reset both flags initially
    this.showDirectPurchaseField = false;
    this.showLimitedField = false;
    this.showErrorField = false;
    this.showInvite = false;
    // Clear previous validators
    this.rfpForm.get('directPurchaseType')?.clearValidators();
    this.rfpForm.get('limitedType')?.clearValidators();

    // Reset estimated cost to 0 when competition type changes
    this.rfpForm.get('estimatedCost')?.setValue(0);

    // Handle Limited Competition
    if (value === 'L') {
      console.log(this.showLimitedField)
      // this.showLimitedField = true;
      this.showInvite = true;
      this.isPrivateSelected = false;
      // this.rfpForm.get('limitedType')?.setValidators([Validators.required]);
      this.rfpForm.get('invite')?.setValue('');
    }

    // Handle Direct Purchase
    if (value === 'D') {
      // this.showDirectPurchaseField = true;
      this.showInvite = true;
      this.rfpForm.get('crNumber')?.reset();
      // this.rfpForm.get('directPurchaseType')?.setValidators([Validators.required]);
    }

    // Update validation state
    this.rfpForm.get('directPurchaseType')?.updateValueAndValidity();
    this.rfpForm.get('limitedType')?.updateValueAndValidity();
  }


  onInviteTypeChange(value: string) {
    // console.log(value,'afreen=========')
    this.isPrivateSelected = value === 'private';
    if (!this.isPrivateSelected) {
      this.rfpForm.get('crNumber')?.reset();
    }
  }

  onDirectPurchaseChange(value: string) {
    const estimatedCostControl = this.rfpForm.get('estimatedCost');

    if (value === 'below100k') {
      this.costvalue = 100
      estimatedCostControl?.setValidators([
        Validators.required,
        Validators.max(100)   // ⛔ max value 100
      ]);
    } else {
      estimatedCostControl?.clearValidators();
    }
    

    estimatedCostControl?.updateValueAndValidity();
  }

  onLimitedChange(value: string) {
    const estimatedCostControl = this.rfpForm.get('estimatedCost');

    if (value === 'below500k') {
      this.costvalue = 500
      estimatedCostControl?.setValidators([
        Validators.required,
        Validators.max(500)   // ⛔ max value 500
      ]);
    } else {
      estimatedCostControl?.clearValidators();
    }

    estimatedCostControl?.updateValueAndValidity();
  }
  async downloadSelectedForm(): Promise<void> {
    if (!this.selectedFormKey) {
      this.cs.createMessage('warning', 'Please select a form first.');
      return;
    }

    const form = this.formOptions.find(f => f.key === this.selectedFormKey);
    if (!form) {
      this.cs.createMessage('error', 'Selected form not found.');
      return;
    }

    const url = encodeURI(form.path); // handles spaces/special chars

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const filename =
          form.filename ||
          (form.path.split('/').pop() ?? 'download.pdf');

        saveAs(blob, filename);
        this.cs.createMessage('success', 'Downloaded successfully.');
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.cs.createMessage('error', 'Unable to download the selected form.');
      }
    });
  }
  // easy getter for the FormArray
  get crNumberArray(): FormArray {
    return this.rfpForm.get('crNumber') as FormArray;
  }

  // methods to add/remove
  addCrNumber() {
    this.crNumberArray.push(this.fb.group({
      crNumber: ['', Validators.required],
      companyName: ['', Validators.required]
    }));
  }

  removeCrNumber(index: number) {
    if (this.crNumberArray.length > 1) {
      this.crNumberArray.removeAt(index);
    }
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }
  isFacilityActivity = false;

  onPrequalificationChange(value: boolean) {
    console.log(value, 'valueeeeeeeeeeee')
    const detailsControl = this.rfpForm.get('prequalificationDetails');
    if (value) {
      detailsControl?.setValidators([Validators.required]);
    } else {
      detailsControl?.clearValidators();
      detailsControl?.setValue('');
    }
    detailsControl?.updateValueAndValidity();
  }

  test(value: boolean) {
    console.log(value, 'valueeeeeeeeeeee')
  }

  toggleTooltip(): void {
    this.tooltipVisible = !this.tooltipVisible;
  }
  get attachmentsValid(): boolean {
  if (!this.rfpForm) {
    return false;
  }
 
  const attachmentsGroup = this.rfpForm.get('attachments') as FormGroup;
  if (!attachmentsGroup) {
    return false;
  }
 
  return attachmentsGroup.valid;
}
  isCurrentStepValid(): boolean {
  switch (this.step) {
    case 0:
      return this.basicInfoValid;
 
    case 1:
      return this.attachmentsValid;
 
    case 2:
      //return this.scopeValid;  // add your scope validation
 
    case 3:
      //return this.boqValid;    // add BOQ validation
 
    default:
      return true;
  }
}

openCollapse(step: number) {
  // FIRST: RESET all collapses
  //this.showBasic = false;
  this.showAttachments = false;
  this.showScope = false;
  //this.showBoq = false;
  //this.showTerms = false;
 
  // THEN: Open based on step
  switch (step) {
    case 0:
     // this.showBasic = true;
      break;
 
    case 1:
      this.showAttachments = true;
      break;
 
    case 2:
      this.showScope = true;
      break;
  }
}
toggleExpand(index: number): void {
  if (!this.EvalListData || !this.EvalListData[index]) return;
  this.EvalListData[index].expand = !this.EvalListData[index].expand;
  // force change detection if needed:
  // this.EvalListData = [...this.EvalListData];
}

  onActivityChange(selectedActivityId: string): void {
    const selectedActivity = this.activityList.find(
      (act: any) => act.id === selectedActivityId || act.value === selectedActivityId
    );

    if (selectedActivityId === 'ACT_FAC') {
      console.log('yes===');
      this.isFacilityActivity = true;

      // Force toggle ON and make it read-only
      const prequalRequired = this.rfpForm.get('prequalificationRequired');
      prequalRequired?.setValue(true, { emitEvent: false });
      //prequalRequired?.disable({ emitEvent: false });

      // Make prequalificationDetails required
      const prequalDetails = this.rfpForm.get('prequalificationDetails');
      prequalDetails?.setValidators([Validators.required]);
      prequalDetails?.updateValueAndValidity();
    } else {
      this.isFacilityActivity = false;
      
      // Allow toggle again and clear required validator
      const prequalRequired = this.rfpForm.get('prequalificationRequired');
      prequalRequired?.enable({ emitEvent: false });
      prequalRequired?.setValue(false, { emitEvent: false });

      const prequalDetails = this.rfpForm.get('prequalificationDetails');
      prequalDetails?.clearValidators();
      prequalDetails?.updateValueAndValidity();
    }


    if (selectedActivity) {
      this.filteredSubactivities = selectedActivity.subactivities.map(
        (sub: any) => ({
          id: sub.id,
          name: sub.value,
          nameAr: sub.valueAr,
        })
      );
      // console.log(this.filteredSubactivities,'===========filteredSubactivities')
    } else {
      this.filteredSubactivities = [];
    }

    // Reset subactivity when activity changes
    this.rfpForm.patchValue({ subactivity: '' });
    
    // Update evaluation weights based on activity and estimated cost
    this.updateEvaluationWeights();
  }
  // Getter for easy access
  get members(): FormArray {
    return this.rfpForm.get('members') as FormArray;
  }

  get laborItems(): FormArray {
    return this.rfpForm.get('laborItems') as FormArray;
  }

  get materialItems(): FormArray {
    return this.rfpForm.get('materialItems') as FormArray;
  }

  get equipmentItems(): FormArray {
    return this.rfpForm.get('equipmentItems') as FormArray;
  }

  get evalCriteriaItems(): FormArray {
    return this.rfpForm.get('evalCriteriaItems') as FormArray;
  }

  get competitionFragmentationItems(): FormArray {
    return this.rfpForm.get('competitionFragmentationItems') as FormArray;
  }

  committeeMembers = [
    { role: 'Project Director', name: '', jobTitle: '', extension: '' },
    { role: 'Project Coordinator', name: '', jobTitle: '', extension: '' },
    { role: 'Committee Member', name: '', jobTitle: '', extension: '' },
  ];


  // Add new row Technical Committee Members
  addMember(index: number): void {
    if (this.members.length < 15) {
      this.members.insert(index + 1, this.createMemberRow(''));
    }
  }

  // Delete row
  deleteMember(index: number): void {
    if (index >= 3) {
      this.members.removeAt(index);
    }
  }

  // Labor Items
  addLaborItem(index: number): void {
    this.laborItems.insert(index + 1, this.createLaborRow());
  }

  deleteLaborItem(index: number): void {
    if (this.laborItems.length > 1) {
      this.laborItems.removeAt(index);
    }
  }

  createLaborRow(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      minQualification: ['', Validators.required],
      minExperience: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  // Material Items
  addMaterialItem(index: number): void {
    this.materialItems.insert(index + 1, this.createMaterialRow());
  }

  deleteMaterialItem(index: number): void {
    if (this.materialItems.length > 1) {
      this.materialItems.removeAt(index);
    }
  }

  createMaterialRow(): FormGroup {
    return this.fb.group({
      material: ['', Validators.required],
      specifications: ['', Validators.required],
      unit: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]]
    });
  }

  // Equipment Items
  addEquipmentItem(index: number): void {
    this.equipmentItems.insert(index + 1, this.createEquipmentRow());
  }

  deleteEquipmentItem(index: number): void {
    if (this.equipmentItems.length > 1) {
      this.equipmentItems.removeAt(index);
    }
  }

  createEquipmentRow(): FormGroup {
    return this.fb.group({
      machine: ['', Validators.required],
      specifications: ['', Validators.required],
      unit: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]]
    });
  }

  addEvalCriteriaItem(index: number): void {
    this.evalCriteriaItems.insert(index + 1, this.createEvalCriteriaRow());
  }

  deleteEvalCriteriaItem(index: number): void {
    if (this.evalCriteriaItems.length > 1) {
      this.evalCriteriaItems.removeAt(index);
    }
  }

  createEvalCriteriaRow(): FormGroup {
    return this.fb.group({
      Headline: ['', Validators.required],
      Percentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      SubCriFlg: ['y', Validators.required],
      Descr: ['', Validators.required],
      subCriteriaList: [[]],
      showSubCriteria: [true]
    });
  }

  createCompetitionFragmentationRow(): FormGroup {
    return this.fb.group({
      package: ['', Validators.required],
      description: ['', Validators.required],
      classificationField: ['', Validators.required]
    });
  }

  addCompetitionFragmentationItem(index: number): void {
    this.competitionFragmentationItems.insert(index + 1, this.createCompetitionFragmentationRow());
  }

  deleteCompetitionFragmentationItem(index: number): void {
    if (this.competitionFragmentationItems.length > 1) {
      this.competitionFragmentationItems.removeAt(index);
    }
  }

  onCompetitionFragmentationChange(value: boolean): void {
    const noOfYearsControl = this.rfpForm.get('noOfYears');
    if (value) {
      noOfYearsControl?.setValidators([Validators.required]);
      this.selectedBundleIndex = 0;
    } else {
      noOfYearsControl?.clearValidators();
      this.selectedBundleIndex = null;
      
      // Keep only 1 row when toggle is disabled
      while (this.competitionFragmentationItems.length > 1) {
        this.competitionFragmentationItems.removeAt(this.competitionFragmentationItems.length - 1);
      }
    }
    noOfYearsControl?.updateValueAndValidity();
  }

  onYearsChange(value: string): void {
    this.selectedYears = parseInt(value) || 1;
  }

  getYearsArray(): number[] {
    return Array.from({ length: this.selectedYears }, (_, i) => i + 1);
  }

  selectBundle(index: number): void {
    this.selectedBundleIndex = index;
  }

  addWorkforceRow(index: number): void {
    this.workforceRows.splice(index + 1, 0, {});
  }

  deleteWorkforceRow(index: number): void {
    if (this.workforceRows.length > 1) {
      this.workforceRows.splice(index, 1);
    }
  }

  addMaterialsRow(index: number): void {
    this.materialsRows.splice(index + 1, 0, {});
  }

  deleteMaterialsRow(index: number): void {
    if (this.materialsRows.length > 1) {
      this.materialsRows.splice(index, 1);
    }
  }

  addEquipmentRow(index: number): void {
    this.equipmentRows.splice(index + 1, 0, {});
  }

  deleteEquipmentRow(index: number): void {
    if (this.equipmentRows.length > 1) {
      this.equipmentRows.splice(index, 1);
    }
  }

  addServiceRow(index: number): void {
    this.serviceRows.splice(index + 1, 0, {});
  }

  deleteServiceRow(index: number): void {
    if (this.serviceRows.length > 1) {
      this.serviceRows.splice(index, 1);
    }
  }

  toggleSubCriteriaView(index: number) {
    const item = this.evalCriteriaItems.at(index);
    const currentValue = item.get('showSubCriteria')?.value;
    item.patchValue({ showSubCriteria: !currentValue });
  }

  // Create one row (form group)
  createMemberRow(role = ''): FormGroup {
    return this.fb.group({
      role: [role, Validators.required],
      name: ['', Validators.required],
      extension: ['', Validators.required],
      jobTitle: ['', Validators.required],
    });
  }

  /**
   * Builds the main for group for create RFP
   */


 // Updated buildMainFormGroup() with correct ItemNo reset after delete
buildMainFormGroup(): void {
  this.rfpForm = this.fb.group({
    limitedType: new FormControl(''),
    directPurchaseType: new FormControl(''),
    invite: new FormControl('', [Validators.required]),

    crNumber: this.fb.array([
      this.fb.group({
        crNumber: ['', Validators.required],
        companyName: ['', Validators.required]
      })
    ]),

      // contractType: new FormControl('', [Validators.required]),
      competitionType: new FormControl('', [Validators.required]),
      technicalDocs: this.fb.array([this.createTechnicalDocRow()]),

      prequalificationDetails: new FormControl('', [Validators.required]),
      coordinatorName: new FormControl(''),
      coordinatorNumber: new FormControl(''),
      coordinatorEmail: new FormControl(''),


    activity: [''],
    subactivity: [''],

    requiresSiteVisit: [false, [Validators.required]],
    email: new FormControl('', [Validators.email]),
    contactNumber: new FormControl(''),
    userId: new FormControl(''),
    projectRelaunched: [false, [Validators.required]],
    number: new FormControl('', [Validators.min(1)]),

    requestStatus: ['', [Validators.required]],
    estimatedCost: [0, [Validators.required, Validators.min(0)]],
    includeFrameworkItems: ['', [Validators.required]],
    prequalificationRequired: [false, [Validators.required]],
    qualificationReference: [''],
    qualificationLink: [''],
    competitionName: ['', [Validators.required, Validators.maxLength(200)]],
    dividedIntoLots: [false, [Validators.required]],
    contractDuration: ['', [Validators.required]],
    MatGrpId: ['', [Validators.required]],
    DeliveryDate: ['', [Validators.required]],
    ProjJust: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    ProjDur: new FormControl('', [Validators.required, Validators.min(1)]),
    DurationType: new FormControl('', [Validators.required]),
    workLocation: new FormControl([], [Validators.required]),
    workExecutionLocation: ['', [Validators.required]],
    reAnnounced: [false, [Validators.required]],
    cancellationReport: [''],
    projectJustification: ['', [Validators.required, Validators.maxLength(500)]],
    projectContinuous: [false, [Validators.required]],

    members: this.fb.array(
      this.committeeMembers.map((m) =>
        this.fb.group({
          role: [{ value: m.role, disabled: true }, Validators.required],
          name: ['', Validators.required],
          extension: ['', Validators.required],
          jobTitle: ['', Validators.required]
        })
      )
    ),

      laborItems: this.fb.array([this.createLaborRow()]),
      materialItems: this.fb.array([this.createMaterialRow()]),
      equipmentItems: this.fb.array([this.createEquipmentRow()]),
      evalCriteriaItems: this.fb.array([this.createEvalCriteriaRow()]),
      competitionFragmentation: [false],
      noOfYears: ['1'],
      competitionFragmentationItems: this.fb.array([this.createCompetitionFragmentationRow()]),

    // scope of work
    MemName: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(6)]),
    MemManagerName: new FormControl('', [Validators.required]),
    SOP: new FormControl('', [Validators.required]),
    labor: new FormControl(''),
    materials: new FormControl(''),
    equipment: new FormControl(''),
    qualitySpecifications: new FormControl(''),
    safetySpecifications: new FormControl(''),
    definationCompetition: new FormControl(''),

    EvalCriteria: this.fb.group({
      RfpNo: [''],
      ItemNo: [{ value: (this.slel).toString(), disabled: true }],
      Descr: ['', [Validators.maxLength(600)]],
      Percentage: ['0'],
      Headline: ['', Validators.required],
      SubCriFlg: ['', Validators.required]
    }),

    EvalCriteriaEdit: this.fb.group({
      RfpNo: [''],
      ItemNo: [{ value: '', disabled: true }],
      Descr: ['', [Validators.maxLength(600)]],
      Percentage: ['0'],
      Headline: [''],
      SubCriFlg: ['']
    }),

    TotTechEval: new FormControl(''),

    // Technical Requirements form groups
    TechReq: this.fb.group({
      RfpNo: [''],
      RfpVersion: [''],
      ItemNo: [{ value: this.srNoTechReq.toString(), disabled: true }],
      Descr: ['', [Validators.maxLength(600)]]
    }),

    TechReqEdit: this.fb.group({
      RfpNo: [''],
      RfpVersion: [''],
      ItemNo: [{ value: '', disabled: true }],
      Descr: ['', [Validators.maxLength(600)]]
    }),

    vendorEvaluationWeightage: this.fb.group({
      technicalEvaluationWeightage: [0, [Validators.required, Validators.min(1), Validators.max(99)]],
      financialEvaluationWeightage: [0, [Validators.required, Validators.min(1), Validators.max(99)]]
    })
  });

    this.rfpForm.get('TotTechEval')?.setValue(100);
    
    // this.rfpForm = this.fb.group({
    //   RfpName: new FormControl('', [Validators.required, Validators.pattern(/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/)]),
    //   CostCenter1: new FormControl(
    //     { value: localStorage.getItem('CC'), disabled: true }
    //     ,
    //     Validators.required
    //   ),

    //   Dept: new FormControl({ value: '', disabled: true }, [
    //     Validators.required,
    //   ]),
    //   MatGrpId: ['', [Validators.required]],
    //   DeliveryDate: ['', [Validators.required]],
    //   ProjJust: new FormControl('', [
    //     Validators.required,
    //     Validators.maxLength(300),
    //   ]),
    //   MemName: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(6)]),
    //   MemManagerName: new FormControl('', [Validators.required]),

    //   SOP: new FormControl('', [Validators.required]),
    //   PurGrpId: new FormControl('', [Validators.required]),
    //   billOFQty: this.fb.array([this.createBoQ()], [Validators.required]),
    //   estPrice: new FormControl({ value: '', disabled: true }, [
    //     Validators.required,
    //   ]),
    //   vatAmount: new FormControl({ value: '', disabled: true }),
    //   estPriceVAT: new FormControl({ value: '', disabled: true }, [
    //     Validators.required
    //   ]),
    //   DurationType: new FormControl('', [Validators.required]),
    //   // new flow afreen
    //   invite: new FormControl('', [Validators.required]),
    //   crNumber: new FormControl('', [Validators.required]),
    //   directPurchaseType: new FormControl('', [Validators.required]),
    //   contractType: new FormControl('', [Validators.required]),
    //   competitionType: new FormControl('', [Validators.required]),
    //   limitedType: new FormControl('', [Validators.required]),
    //   //


    //   ProjDur: new FormControl('', [Validators.required, Validators.min(1)]),

    //   Payment: this.fb.array([]),

    //   PayTermsEdit: this.fb.group({
    //     RfpNo: [''],
    //     ItemNo: [{ value: '', disabled: true }],
    //     Descr: [''],
    //     Percentage: ['0'],
    //   }),
    //   CC: new FormControl(''),



    //   TechRFP: new FormControl('N'),

    //   TotTechEval: new FormControl(''),

    //   // TechEval: new FormControl(''),
    //   vendorEvaluationWeightage: this.fb.group({
    //     technicalEvaluationWeightage: [0, [Validators.required, Validators.min(1), Validators.max(99), ]],
    //     financialEvaluationWeightage: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1), Validators.max(99)]]
    //   }),

    //   ProjManpower: new FormControl(this.isManPow),
    //   CancelRFP: new FormControl(''),
    //   Evalcrt: this.fb.array([]),
    //   EvalCriteria: this.fb.group({
    //     RfpNo: [''],
    //     ItemNo: [{ value: (this.slel).toString(), disabled: true }],
    //     Descr: ['', [Validators.maxLength(600)]],
    //     Percentage: ['0'],
    //     Headline:['', Validators.required],
    //     SubCriFlg:['',Validators.required ]

    //   }),
    //   EvalCriteriaEdit: this.fb.group({
    //     RfpNo: [''],
    //     ItemNo: [{ value: '', disabled: true }],
    //     Descr: ['', [Validators.maxLength(600)]],
    //     Percentage: ['0'],
    //     Headline:[''],
    //     SubCriFlg:['']
    //   }),
    //   RfpTreq: this.fb.array([]),
    //   TechReq: this.fb.group({
    //     RfpNo: [''],
    //     RfpVersion: [''],
    //     ItemNo: [{ value: (this.srNoTechReq).toString(), disabled: true }],
    //     Descr: ['', [Validators.maxLength(600)]]
    //   }),
    //   TechReqEdit: this.fb.group({
    //     RfpNo: [''],
    //     RfpVersion: [''],
    //     ItemNo: [{ value: '', disabled: true }],
    //     Descr: ['', [Validators.maxLength(600)]]
    //   }),


    //   Attachments: this.fb.array([]),
    //   ManPower: this.fb.array([]),
    //   ManPowerForm: this.fb.group({
    //     ItemNo: [{ value: this.slman.toString(), disabled: true }],
    //     JobTitle: [''],
    //     Amount: [''],
    //     SpeQualf:[''],
    //     Specilization:[''],
    //     SpeExp: ['', Validators.maxLength(300)],

    //   }),
    //   ManPowerFormEdit: this.fb.group({
    //     ItemNo: [{ value: '', disabled: true }],
    //     JobTitle: [''],
    //     Amount: [''],
    //     SpeQualf:[''],
    //     Specilization:[''],
    //     SpeExp: ['', Validators.maxLength(300)],

    //   }),
    //   ConsultWork: this.fb.array([]),
    //   procurementChecklist: this.fb.group({})
    // });
    // Direct purchase change listener
  this.rfpForm.get('directPurchaseType')?.valueChanges.subscribe(value => {
    this.showEmergencyDocs = value === 'Emergency';
  });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'xlsx', 'png', 'jpg'];
    const isAllowed = allowed.includes(ext);
    const isLt10M = (file.size || 0) / 1024 / 1024 <= 10;

    if (!isAllowed) {
      this.cs.createMessage('error', 'Allowed: pdf, doc, docx, xlsx, png, jpg.');
      return false;
    }
    if (!isLt10M) {
      this.cs.createMessage('error', 'File must be 10MB or smaller.');
      return false;
    }

    this.fileList = [...this.fileList, file]; // add to manual list
    return false; // stop auto upload
  };

  handleImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'xlsx', 'png', 'jpg'];
    const isAllowed = allowed.includes(ext);
    const isLt10M = file.size / 1024 / 1024 <= 10;

    if (!isAllowed) {
      this.cs.createMessage('error', 'Allowed: pdf, doc, docx, xlsx, png, jpg.');
      input.value = '';
      return;
    }
    if (!isLt10M) {
      this.cs.createMessage('error', 'File must be 10MB or smaller.');
      input.value = '';
      return;
    }

    const nzFile: NzUploadFile = {
      uid: Date.now().toString(),
      name: file.name,
      status: 'done',
      size: file.size,
      type: file.type,
      originFileObj: file as any
    };

    this.fileList = [...this.fileList, nzFile];
    this.cs.createMessage('success', `File "${file.name}" added successfully.`);
    input.value = '';
  }

  downloadTemplate(section: 'workforce' | 'materials' | 'equipment' | 'service'): void {
    const templates = {
      workforce: { path: 'assets/general-model/workforce.xlsx', filename: 'workforce.xlsx' },
      materials: { path: 'assets/general-model/material.xlsx', filename: 'material.xlsx' },
      equipment: { path: 'assets/general-model/equipment and devices.xlsx', filename: 'equipment and devices.xlsx' },
      service: { path: 'assets/general-model/services and outputs.xlsx', filename: 'services and outputs.xlsx' }
    };

    const template = templates[section];
    const url = encodeURI(template.path);

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        saveAs(blob, template.filename);
        this.cs.createMessage('success', 'Downloaded successfully.');
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.cs.createMessage('error', 'Unable to download the template.');
      }
    });
  }

  handleRemove = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
    return true;
  };
  
  removeFile(file: NzUploadFile): void {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
  }

   onDirectPurchaseEmergency(value: any) {
  // Example: show only when user selects "cancel"
  this.showEmergencyDocs = value === 'Emergency';  
}
 
get technicalDocs(): FormArray {
  return this.rfpForm.get('technicalDocs') as FormArray;
}
 
createTechnicalDocRow(): FormGroup {
  return this.fb.group({
    documentNumber: ['']
  });
}
 
addTechnicalDoc(index: number): void {
  this.technicalDocs.insert(index + 1, this.createTechnicalDocRow());
}
 
deleteTechnicalDoc(index: number): void {
  if (this.technicalDocs.length > 1) {
    this.technicalDocs.removeAt(index);
  }
}
 
get progressPx(): number {
  const segment = 890 / 4; // 222.5px per segment
  return this.step * segment;
}
 
 
 
get progressWidth(): number {
  return (this.step / 4) * 100;
}


  // beforeUpload = (file: NzUploadFile): boolean => {
  //   this.fileList = this.fileList.concat(file);
  //   return false;
  // };

  setManagerList() {  
    if (
      this.rfpForm.controls['MemName'].value.length > 0 &&
      (this.rfpForm.controls['MemName'].value.includes(this.rfpForm.controls['MemManagerName'].value)
      )) {
      this.cs.createMessage(
        'error',
        this.translate.instant('RFP.TechMemError')
      )
    }
    this.managerList = this.userList.filter((user: any) =>
      this.rfpForm.controls['MemName']?.value.includes(user.EmpUsrid))
    this.managerList = this.managerList.filter((user, index, self) => {
      return user.TmUserid !== ""
        && index === self.findIndex((u) => u.TmUserid === user.TmUserid)
    })
    if (this.managerList.length === 0 || this.managerList.findIndex((manager) => manager.TmUserid === this.rfpForm.controls['MemManagerName'].value) < 0) {
      this.rfpForm.controls['MemManagerName'].setValue('');
      this.rfpForm.controls['MemManagerName'].updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.activateCollapse('basicInfo');
    this.step1 = true;
    this.boqList = this.rfpForm.get('billOFQty') as FormArray;
    this.attList = this.rfpForm.get('Attachments') as FormArray;
    this.autoPopulateSopFields();
    const compCtrl = this.rfpForm.get('competitionType')!;
    const costCtrl = this.rfpForm.get('estimatedCost')!;
    this.rfpForm.get('directPurchaseType')?.valueChanges.subscribe(value => {
    this.showEmergencyDocs = value === 'Emergency';   // <-- check actual value!
  });

    compCtrl.valueChanges.pipe(startWith(compCtrl.value), takeUntil(this.destroy$))
      .subscribe(v => console.log('DBG competitionType emitted:', v));

    // If competitionTypes is an array like [{ id: 'direct', value: 'Direct Purchase', valueAr: '...' }, ...]
    if (Array.isArray(this.competitionTypes)) {
      const direct = this.competitionTypes.find(o =>
        (o.value && o.value.toString().toLowerCase().includes('direct')) ||
        (o.valueAr && o.valueAr.toString().toLowerCase().includes('direct')) ||
        (String(o.id).toLowerCase().includes('direct'))
      );
      const limited = this.competitionTypes.find(o =>
        (o.value && o.value.toString().toLowerCase().includes('limited')) ||
        (o.valueAr && o.valueAr.toString().toLowerCase().includes('limited')) ||
        (String(o.id).toLowerCase().includes('limited'))
      );

      this.directCompetitionId = direct ? direct.id : null;
      this.limitedCompetitionId = limited ? limited.id : null;

      // OPTIONAL debug to confirm what ids we detected:
      console.log('DBG: directCompetitionId=', this.directCompetitionId, 'limitedCompetitionId=', this.limitedCompetitionId);
    }



    // debug so you can see exactly what competitionType emits (remove later)
    compCtrl.valueChanges.pipe(startWith(compCtrl.value), takeUntil(this.destroy$))
      .subscribe(v => console.log('DBG competitionType emitted:', v));

    combineLatest([
      compCtrl.valueChanges.pipe(startWith(compCtrl.value)),
      costCtrl.valueChanges.pipe(startWith(costCtrl.value))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updatePurchaseVisibility();
      });

    // initial sync
    this.updatePurchaseVisibility();

    // Dynamically update validators based on switch
    this.rfpForm
      .get('requiresSiteVisit')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.toggleSiteVisitValidators(value);
      });

    // Initial validation sync
    this.toggleSiteVisitValidators(this.rfpForm.get('requiresSiteVisit')?.value);

    // Add conditional validation for project relaunched toggle
    this.rfpForm
      .get('projectRelaunched')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.toggleProjectRelaunchedValidators(value);
      });

    // Initial validation sync for project relaunched
    this.toggleProjectRelaunchedValidators(this.rfpForm.get('projectRelaunched')?.value);

    // Listen to estimated cost and activity changes to update evaluation weights
    this.rfpForm.get('estimatedCost')?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateEvaluationWeights());
    this.rfpForm.get('activity')?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateEvaluationWeights());

    let usernameBtoa = localStorage.getItem('ID');
    if (usernameBtoa) {
      this.userName = atob(usernameBtoa);
    }

    this.toggleDescrValidatorTechEval();

    combineLatest([
      this.rfpForm.get('ProjDur')!.valueChanges.pipe(startWith(this.rfpForm.get('ProjDur')!.value)),
      this.rfpForm.get('DurationType')!.valueChanges.pipe(startWith(this.rfpForm.get('DurationType')!.value))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetDeliveryDate();
      });

    this.listenDeliveryDateChange();
    this.rfpForm.get("SubCriFlg")?.setValue('X');

  }
  private isDirectCompetitionSelected(): boolean {
    const compVal = this.rfpForm.get('competitionType')?.value;
    if (compVal == null) return false;
    // `compVal` may be id or object — normalize:
    const val = (typeof compVal === 'object') ? (compVal.id ?? compVal) : compVal;
    return this.directCompetitionId != null && String(val) === String(this.directCompetitionId);
  }

  private isLimitedCompetitionSelected(): boolean {
    const compVal = this.rfpForm.get('competitionType')?.value;
    if (compVal == null) return false;
    const val = (typeof compVal === 'object') ? (compVal.id ?? compVal) : compVal;
    return this.limitedCompetitionId != null && String(val) === String(this.limitedCompetitionId);
  }



  private updatePurchaseVisibility(): void {
    const costVal = Number(this.rfpForm.get('estimatedCost')?.value) || 0;
    const directSelected = this.isDirectCompetitionSelected();
    const limitedSelected = this.isLimitedCompetitionSelected();

    this.showDirectPurchaseField = directSelected && costVal > this.DIRECT_COST_THRESHOLD;
    this.showLimitedField = limitedSelected && costVal > this.DIRECT_COST_THRESHOLD2;
    this.showErrorField= limitedSelected && costVal <= this.DIRECT_COST_THRESHOLD2;

    // Clear values when panels are hidden
    if (!this.showDirectPurchaseField) {
      const ctrl = this.rfpForm.get('directPurchaseType');
      if (ctrl?.value) { ctrl.setValue(null); }
    }
    if (!this.showLimitedField) {
      const ctrl = this.rfpForm.get('limitedType');
      if (ctrl?.value) { ctrl.setValue(null); }
    }
  }



  // async downloadSelectedForm(): Promise<void> { sampath commentted
  //   if (!this.selectedFormKey) {
  //     this.cs.createMessage('warning', 'Please select a form first.');
  //     return;
  //   }

  //   const form = this.formOptions.find(f => f.key === this.selectedFormKey);
  //   if (!form) {
  //     this.cs.createMessage('error', 'Selected form not found.');
  //     return;
  //   }

  //   const url = encodeURI(form.path); // handles spaces/special chars

  //   this.http.get(url, { responseType: 'blob' }).subscribe({
  //     next: (blob) => {
  //       const filename =
  //         form.filename ||
  //         (form.path.split('/').pop() ?? 'download.pdf');

  //       saveAs(blob, filename);
  //       this.cs.createMessage('success', 'Downloaded successfully.');
  //     },
  //     error: (err) => {
  //       console.error('Download failed:', err);
  //       this.cs.createMessage('error', 'Unable to download the selected form.');
  //     }
  //   });
  // }
  toggleSiteVisitValidators(requiresVisit: boolean): void {
    const emailControl = this.rfpForm.get('email');
    const contactControl = this.rfpForm.get('contactNumber');
    const userIdControl = this.rfpForm.get('userId');

    if (requiresVisit) {
      // When ON, make fields required
      emailControl?.setValidators([Validators.required, Validators.email]);
      contactControl?.setValidators([Validators.required]);
      userIdControl?.setValidators([Validators.required]);
    } else {
      // When OFF, clear values and remove validators
      emailControl?.setValue('');
      contactControl?.setValue('');
      userIdControl?.setValue('');
      emailControl?.clearValidators();
      contactControl?.clearValidators();
      userIdControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
    contactControl?.updateValueAndValidity();
    userIdControl?.updateValueAndValidity();
  }

  toggleProjectRelaunchedValidators(isRelaunched: boolean): void {
    const numberControl = this.rfpForm.get('number');

    if (isRelaunched) {
      // When ON, make previous project number required
      numberControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // When OFF, clear value and remove validators
      numberControl?.setValue('');
      numberControl?.clearValidators();
    }

    numberControl?.updateValueAndValidity();
  }

  listenDeliveryDateChange() {
    this.rfpForm.get('DeliveryDate')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.listOfBudgetingYears = this.getInvolvedYears(this.rfpForm.controls['DeliveryDate'].value, this.rfpForm.controls['ProjDur'].value, this.rfpForm.controls['DurationType'].value);
    });
  }

  /**
   * Loads and Handles all the Look Up data
   */
  loadLookUpData(): void {

    const costCenter = this.api.post('F4CostCntrSet', this.cs.getUserData());
    const usersList = this.api.post('F4UsrListSet', this.cs.getUserData());
    const purchaseGroup = this.api.post('F4PurGrpSet', { userName: this.cs.getUserData().userid });
    const unitOfMeasure = this.api.post('F4UomSet', { Uom: '' });
    const itCheckList = this.api.post('getChecklist', { checklist_type: '01' });
    const procurementCheckList = this.api.post('getChecklist', { checklist_type: '02' });
    const qualificationList = this.api.get('qualification-list')


    this.getDeps();

    this.spinner.show();

    forkJoin([costCenter, usersList, purchaseGroup, unitOfMeasure, itCheckList, procurementCheckList, qualificationList])
      .pipe(takeUntil(this.destroy$)).subscribe((
        [costCenterRes, usersListRes, purchaseGroupRes, unitOfMeasureRes, itCheckListRes,
          procurementCheckListRes, qualificationListRes]) => {
        this.spinner.hide();

        // * Cost Center List
        if (costCenterRes.d.results) {
          this.Costctr = costCenterRes.d.results;
        }

        // * Users List
        if (usersListRes.d.results) {
          this.userList = usersListRes.d.results;
          this.setManagerList()
        }

        // * Get the purchase group
        if (purchaseGroupRes.d.results) {
          this.allPurGrp = purchaseGroupRes.d.results
          this.purGp = purchaseGroupRes.d.results.filter((purchanseGroupItem: any) => purchanseGroupItem.PurGrpId.indexOf(localStorage.getItem('DepTxt')) > -1);
        }

        // * Get the Unit of Measure List
        if (unitOfMeasureRes.d.results) {
          this.uOM = unitOfMeasureRes.d.results;
        }

        // * Get IT Check List
        if (itCheckListRes.d.results) {
          this.ITCheckList = {
            parentCheckList: itCheckListRes.d.results.filter((checklistItem: any) => checklistItem.parent_checklist_id === '000'),
            childCheckList: itCheckListRes.d.results.filter((checklistItem: any) => checklistItem.parent_checklist_id !== '000')
          }
          // this.setITCheklist();
        }

        // * Get Procurement Check List
        if (procurementCheckListRes.d.results) {
          this.procurementCheckListData = procurementCheckListRes.d.results.filter((data: any) => {
            if ((data.checklist_applicapable == this.cs.getUserData().DeptId || data.checklist_applicapable == '') && data.checklist_access == 'R') {
              return true;
            }
            return false;
          });
          let parentGroup = this.rfpForm.get('procurementChecklist') as FormGroup;

          this.procurementCheckListData.forEach((list: any) => {
            if (list.to_ChkLstDts.results.length > 1) {
              parentGroup.addControl('procu' + list.checklist_id, this.fb.control(''));
              parentGroup.addControl('procu' + list.checklist_id + 'Comment', this.fb.control(''));
            } else {
              parentGroup.addControl('procu' + list.checklist_id, this.fb.control(''));
            }
          });
        }

        this.qualificationList = qualificationListRes



        console.log(this.qualificationList, 'this.qualificationList')


      }, (error) => {
        this.spinner.hide();
        this.cs.createMessage('error', error.statusText);
      });

  }

  /**
   * Prepare and sets the IT check list
   */
  setITCheklist() {
    this.childCheckList = [];
    let arrayControl = this.rfpForm.get('billOFQty') as FormArray;
    let parentGroup = arrayControl.at(0) as FormGroup;

    this.ITCheckList.parentCheckList.forEach((element: any) => {

      parentGroup.addControl(element.checklist_name_en, this.fb.control(false));
      const req: any = {};

      req[element.checklist_name_en + 'Group'] = [];
      req['groupName'] = element.checklist_name_en;


      this.ITCheckList.childCheckList.forEach((childList: any) => {
        if (element.checklist_id == childList.parent_checklist_id) {
          req[element.checklist_name_en + 'Group'].push(childList)
        }
      });
      this.childCheckList.push(req);


      parentGroup.addControl(element.checklist_name_en + 'Group', this.fb.group({}));

      this.ITCheckList.childCheckList.forEach((childList: any) => {
        if (element.checklist_id == childList.parent_checklist_id) {
          let newGroup = parentGroup.get(element.checklist_name_en + 'Group') as FormGroup;
          newGroup.addControl(element.checklist_name_en + childList.checklist_id, this.fb.control(''));
          newGroup.addControl(element.checklist_name_en + childList.checklist_id + 'Comment', this.fb.control(''));
          newGroup.addControl(element.checklist_name_en + childList.checklist_id + 'OtherComment', this.fb.control(''));
        }
      });

    });
  }


  checkProcRadio(evt: any, procList: any) {
    // let parentGroup = this.rfpForm.get('procurementChecklist') as FormGroup;
    // if (evt.toLowerCase().indexOf('yes') > -1) {
    //   parentGroup.get('procu' + procList.checklist_id + 'Comment')?.addValidators([Validators.required]);
    //   parentGroup.get('procu' + procList.checklist_id + 'Comment')?.updateValueAndValidity();
    // } else {
    //   parentGroup.get('procu' + procList.checklist_id + 'Comment')?.removeValidators([Validators.required]);
    //   parentGroup.get('procu' + procList.checklist_id + 'Comment')?.updateValueAndValidity();
    // }
  }

  getQualification(qualificationID: string) {
    const qualification = this.qualificationList.d.results.find((qualification) => qualification.QualtypeID === qualificationID)
    return this.cs.userLanguage === "en" ? qualification?.QualtypeDesc : qualification?.QualtypeDescAR
  }


  checkSelected(evt: any, checklist_name_en: any, index: any) {
    if (evt) {
      Object.keys((((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
        .get(checklist_name_en + 'Group') as FormGroup).controls).forEach((element: any) => {
          if (element.indexOf('Comment') == -1) {
            (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
              .get(checklist_name_en + 'Group') as FormGroup).controls[element].addValidators([Validators.required]);
            (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
              .get(checklist_name_en + 'Group') as FormGroup).controls[element].updateValueAndValidity();
          }
        });
    } else {
      Object.keys((((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
        .get(checklist_name_en + 'Group') as FormGroup).controls).forEach((element: any) => {
          (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
            .get(checklist_name_en + 'Group') as FormGroup).controls[element].removeValidators([Validators.required]);
          (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
            .get(checklist_name_en + 'Group') as FormGroup).controls[element].updateValueAndValidity();
        });
    }

  }


  changeRadioValue(evt: any, groupName: any, commentControl: any) {
    if (evt.indexOf('Other') > -1) {
      (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
        .get(groupName) as FormGroup).controls[commentControl].addValidators([Validators.required]);
    } else {
      (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
        .get(groupName) as FormGroup).controls[commentControl].removeValidators([Validators.required]);
    }
    (((this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup)
      .get(groupName) as FormGroup).controls[commentControl].updateValueAndValidity();
  }


  getChecklistMapped(data: any) {
    data.ReqToBoqNavg.forEach((element: any, index: any) => {
      element['BoqToITChkLstNavg'] = [];
      this.ITCheckList.parentCheckList.forEach((node: any) => {
        if (element[node.checklist_name_en]) {
          element['BoqToITChkLstNavg'].push({
            "RfpNo": "",
            "RfpVersion": "",
            "ItemNo": (index + 1).toString(),
            "ChecklistId": node.checklist_id,
            "ChecklistValId": '',
            "OtherTxt": "",
            "ChecklistCmnts": "",
            "CreatedBy": "",
            "CreatedAt": "",
            "ChangedBy": "",
            "ChangedAt": ""
          });

          let selectedList: any = [];
          this.childCheckList.forEach((childList: any) => {
            if (childList.groupName == node.checklist_name_en) {
              selectedList = childList[node.checklist_name_en + 'Group'];
            }
          });

          selectedList.forEach((childList: any) => {
            element['BoqToITChkLstNavg'].push({
              "RfpNo": "",
              "RfpVersion": "",
              "ItemNo": (index + 1).toString(),
              "ChecklistId": childList.checklist_id,
              "ChecklistValId": element[node.checklist_name_en + 'Group'][node.checklist_name_en + childList.checklist_id].substr(0, 3),
              "OtherTxt": element[node.checklist_name_en + 'Group'][node.checklist_name_en + childList.checklist_id + 'OtherComment'],
              "ChecklistCmnts": element[node.checklist_name_en + 'Group'][node.checklist_name_en + childList.checklist_id + 'Comment'],
              "CreatedBy": "",
              "CreatedAt": "",
              "ChangedBy": "",
              "ChangedAt": ""
            });
          });

        }
        element['ItemNo'] = (index + 1).toString();
        delete element[node.checklist_name_en];
        delete element[node.checklist_name_en + 'Group'];
      });
    });

    return data;
  }

  getProclistMapped(data: any) {
    data['ReqToPMChklstNavg'] = [];
    let parentGroup = this.rfpForm.get('procurementChecklist') as FormGroup;
    this.procurementCheckListData.forEach((procList: any) => {
      if (procList.to_ChkLstDts.results.length > 1) {
        data['ReqToPMChklstNavg'].push({
          "RfpNo": "",
          "RfpVersion": "",
          "ChecklistId": procList.checklist_id,
          "ChecklistValId": parentGroup.value['procu' + procList.checklist_id].substr(0, 3),
          "TextValue": "",
          "ChecklistCmnts": parentGroup.value['procu' + procList.checklist_id + 'Comment'],
          "CreatedBy": "",
          "CreatedAt": "",
          "ChangedBy": "",
          "ChangedAt": ""
        })
      } else {
        data['ReqToPMChklstNavg'].push({
          "RfpNo": "",
          "RfpVersion": "",
          "ChecklistId": procList.checklist_id,
          "ChecklistValId": '',
          "TextValue": parentGroup.value['procu' + procList.checklist_id],
          "ChecklistCmnts": '',
          "CreatedBy": "",
          "CreatedAt": "",
          "ChangedBy": "",
          "ChangedAt": ""
        })
      }
    });

    return data;
  }


  transformComma(event: any, index: number) {
    const amountVal = event?.target?.value;
    if (amountVal !== '') {
      (this.billOFQtyFA.at(index) as FormGroup)
        .get('Price')
        ?.patchValue(this.currenyPipe.transform(amountVal.toString()));
    }
  }

  priceFormatter = (value: number) => {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  };

  // Parser: Remove commas when storing the value internally
  priceParser = (value: string) => {
    return value ? value.replace(/,*/g, '') : '';
  };
  /**
   * Estimate the Budget and add the BOQ
   */
  estimateAndAddBoq() {

    this.calculateEstimatedPrice().then((value) => {
      this.getBudgetAPI(value);
    });
  }

  getBudgetAPI(priceDetails: {
    estimatedPrice: number,
    totalEstimatedPrice: number,
    totalEstimatedPriceVAT: number
  }): void {
    this.updateBOQTableList();
  }

  async calculateEstimatedPrice(): Promise<{
    estimatedPrice: number,
    totalEstimatedPrice: number,
    totalEstimatedPriceVAT: number
  }> {
    let estimatedPrice = parseFloat(this.cs.removeCommas(this.boqFormGroup?.getRawValue()[0].Price)) * parseFloat(this.boqFormGroup?.getRawValue()[0].Quantity);
    let totalEstimatedPrice: any;
    let totalEstimatedPriceVAT: number;
    if (this.boqTabelList.length) {
      totalEstimatedPrice = estimatedPrice;
      await this.boqTabelList.forEach((boqItem: any, index: number) => {
        //console.log(index + 1);
        if (this.selectedBOQIndex !== index) {
          //console.log(index + 1);
          totalEstimatedPrice += parseFloat(this.cs.removeCommas(boqItem.Price)) * parseFloat(boqItem.Quantity);
        }
      });
    } else {
      totalEstimatedPrice = estimatedPrice;
    }
    totalEstimatedPriceVAT = totalEstimatedPrice + (0.15 * totalEstimatedPrice);
    return { 'estimatedPrice': estimatedPrice, 'totalEstimatedPrice': totalEstimatedPrice, 'totalEstimatedPriceVAT': totalEstimatedPriceVAT };
  }

  /**
   * Update the Form Group based on the total estimated value.
   * @param totalEstimatedPrice
   */
  updateFormGroup(totalEstimatedPrice: number, totalEstimatedPriceVAT: number): void {
    //console.log("Total Estimated Price", totalEstimatedPrice);
    this.rfpForm.controls['estPrice'].setValue(this.currenyPipe.transform(totalEstimatedPrice.toFixed(2).toString()));
    this.rfpForm.controls['estPrice'].updateValueAndValidity();

    this.rfpForm.controls['estPriceVAT'].setValue(this.currenyPipe.transform(totalEstimatedPriceVAT.toFixed(2).toString()));
    this.rfpForm.controls['estPriceVAT'].updateValueAndValidity();

    this.rfpForm.controls['vatAmount'].setValue(this.currenyPipe.
      transform((totalEstimatedPriceVAT - totalEstimatedPrice).toFixed(2).toString()));
    this.rfpForm.controls['vatAmount'].updateValueAndValidity();

    // if (totalEstimatedPriceVAT === 0) {
    //   this.step2 = false;
    //   this.step3 = false;
    //   return;
    // }

    const msg =
      this.translate.instant('RFP.Estimated price is') + '  ' + totalEstimatedPriceVAT;
    this.cs.createMessage('success', msg);




    this.rfpForm.controls['TechRFP'].setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['TechRFP'].updateValueAndValidity();









    this.rfpForm.controls['TotTechEval'].setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['TotTechEval'].updateValueAndValidity();





    if (!this.TechReqListData.length) {
      this.rfpForm.controls['TechReq'].get('Descr')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['TechReq'].get('Descr')?.updateValueAndValidity();
    }
    if (!this.ManPowerListData?.length) {
      this.rfpForm.controls['ManPowerForm'].get('JobTitle')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('JobTitle')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerForm'].get('Amount')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('Amount')?.updateValueAndValidity();





      this.rfpForm.controls['ManPowerForm'].get('Specilization')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('Specilization')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerForm'].get('SpeExp')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('SpeExp')?.updateValueAndValidity();



      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.updateValueAndValidity();
    }

    if (!this.EvalListData.length) {
      this.rfpForm.controls['EvalCriteria'].get('Percentage')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Percentage')?.updateValueAndValidity();

      this.rfpForm.controls['EvalCriteria'].get('Descr')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Descr')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteria'].get('Headline')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Headline')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteria'].get('SubCriFlg')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('SubCriFlg')?.updateValueAndValidity();

      if (!this.QualList?.length) {
        this.addQual();
      }
    }
  }

  /**
 * Update the BOQ Table List
 *
 */
  selectedBOQIndex: any = null;

  updateBOQTableList() {
    const boqFormValue = this.boqList?.getRawValue()[0];
    const boqFormArray = this.rfpForm.get('billOFQty') as FormArray;

    if (this.selectedBOQItemForLookUp) {
      if (boqFormValue.applyForAllBudgetYears) {
        // Delete original item
        this.boqTabelList = this.boqTabelList.filter(
          (item: any) =>
            !(
              item.budgetYear === this.selectedBOQItemForLookUp.budgetYear &&
              item.ItemNo === this.selectedBOQItemForLookUp.ItemNo
            )
        );

        // Add updated copies for all years
        this.listOfBudgetingYears.forEach((year: number) => {
          const clonedItem = { ...boqFormValue, budgetYear: year };
          clonedItem.ItemNo = this.boqTabelList.length + 1;
          this.boqTabelList.push(clonedItem);
        });
      } else {
        // Update single item
        const flatIndex = this.boqTabelList.findIndex((item: any) =>
          item.budgetYear === this.selectedBOQItemForLookUp.budgetYear &&
          item.ItemNo === this.selectedBOQItemForLookUp.ItemNo
        );

        if (flatIndex !== -1) {
          this.boqTabelList[flatIndex] = boqFormValue;
        }
      }

      this.selectedBOQItemForLookUp = null;
    } else {
      // Add mode
      if (boqFormValue.applyForAllBudgetYears) {
        this.listOfBudgetingYears.forEach((year: number) => {
          const clonedItem = { ...boqFormValue, budgetYear: year };
          clonedItem.ItemNo = this.boqTabelList.length + 1;
          this.boqTabelList.push(clonedItem);
        });
      } else {
        this.boqTabelList.push(boqFormValue);
      }
    }

    // Refresh list and reset form
    this.boqTabelList = [...this.boqTabelList];
    const totalEstimatedPrice = this.boqTabelList.reduce(
      (sum: any, item: any) => sum + (parseFloat(item.Quantity) * parseFloat(item.Price)),
      0
    );

    const totalEstimatedPriceVAT = totalEstimatedPrice + (0.15 * totalEstimatedPrice);

    this.updateFormGroup(totalEstimatedPrice, totalEstimatedPriceVAT);
    this.groupBoqItemsByYear();

    boqFormArray.clear();
    boqFormArray.push(this.createBoQ());
  }


  groupBoqItemsByYear() {
    this.groupBOQItemsBasedonBudgetingYears = this.boqTabelList.reduce((acc: any, item: any) => {
      const year = item.budgetYear;
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {} as { [year: number]: any[] });
  }


  deleteBOQItem(budgetYear: number, index: number) {
    const itemToDelete = this.groupBOQItemsBasedonBudgetingYears[budgetYear][index];

    // Find index in flat list
    const flatIndex = this.boqTabelList.findIndex((item: any) =>
      item.budgetYear === itemToDelete.budgetYear &&
      item.ItemNo === itemToDelete.ItemNo
    );

    if (flatIndex !== -1) {
      this.boqTabelList.splice(flatIndex, 1);
      this.boqTabelList = [...this.boqTabelList]; // trigger change detection
      this.groupBoqItemsByYear(); // regroup after deletion
    }
    let totalEstimatedPrice = 0;
    let totalEstimatedPriceVAT = 0;
    if (this.boqTabelList.length) {
      this.boqTabelList.forEach((boqItem: any) => {
        totalEstimatedPrice += parseFloat(this.cs.removeCommas(boqItem.Price)) * parseFloat(boqItem.Quantity);
      });
    }
    if (totalEstimatedPrice != 0) {
      totalEstimatedPriceVAT = totalEstimatedPrice + (0.15 * totalEstimatedPrice)
    }
    this.updateFormGroup(totalEstimatedPrice, totalEstimatedPriceVAT);
    const BOQFormGroup = (this.rfpForm.get('billOFQty') as FormArray).at(0) as FormGroup;
    BOQFormGroup.patchValue({ ItemNo: this.boqTabelList.length })
  }


  editBOQItem(budgetYear: number, index: number) {
    const selectedBOQItem = this.groupBOQItemsBasedonBudgetingYears[budgetYear][index];
    console.log('Selected for edit:', selectedBOQItem);

    this.selectedBOQItemForLookUp = selectedBOQItem; // Save full item for lookup during update

    const parentGroup = (this.rfpForm.get('billOFQty') as FormArray).at(0) as FormGroup;

    parentGroup.patchValue({
      Quantity: selectedBOQItem.Quantity.toString(),
      Price: selectedBOQItem.Price.toString(),
      MaterialText: selectedBOQItem.MaterialText.toString(),
      ItemDescription: selectedBOQItem.ItemDescription || '',
      Uom: selectedBOQItem.Uom,
      budgetYear: selectedBOQItem.budgetYear,
      ItemNo: selectedBOQItem.ItemNo.toString(),
    });

    parentGroup.updateValueAndValidity();
  }


  // updateBOQTableList(): void {
  //   this.boqList = this.rfpForm.controls.billOFQty as FormArray;
  //   if (this.selectedBOQIndex != null) {
  //     this.boqTabelList[this.selectedBOQIndex] = this.boqList?.getRawValue()[0];
  //     this.selectedBOQIndex = null;
  //   } else {
  //     this.boqTabelList.push(this.boqList?.getRawValue()[0]);
  //   }
  //   this.boqTabelList = [...this.boqTabelList];
  //   this.sl = this.boqTabelList.length;

  //   this.rfpForm.controls.billOFQty = new FormArray([this.createBoQ()]);
  //   this.setITCheklist();
  // }

  // deleteBOQItem(i: any) {
  //   this.boqTabelList.splice(i, 1);
  //   this.boqTabelList = [...this.boqTabelList];

  //   let parentGroup = (this.rfpForm.get('billOFQty') as FormArray).at(0) as FormGroup;
  //   parentGroup.get('ItemNo')?.patchValue((this.boqTabelList.length + 1).toString());
  //   parentGroup.get('ItemNo')?.updateValueAndValidity();

  //   let totalEstimatedPrice = 0;
  //   let totalEstimatedPriceVAT = 0;
  //   if (this.boqTabelList.length) {
  //     this.boqTabelList.forEach((boqItem: any) => {
  //       totalEstimatedPrice += parseFloat(this.cs.removeCommas(boqItem.Price)) * parseFloat(boqItem.Quantity);
  //     });
  //   }
  //   if (totalEstimatedPrice != 0) {
  //     totalEstimatedPriceVAT = totalEstimatedPrice + (0.15 * totalEstimatedPrice)
  //   }
  //   this.updateFormGroup(totalEstimatedPrice, totalEstimatedPriceVAT);
  // }

  // selectedBOQIndex: any = null;
  // editBOQItem(i: any) {
  //   this.rfpForm.controls.billOFQty = new FormArray([this.createBoQ()]);
  //   this.setITCheklist();

  //   let selectedBOQItem = this.boqTabelList[i];
  //   this.selectedBOQIndex = i;
  //   let parentGroup = (this.rfpForm.get('billOFQty') as FormArray).at(0) as FormGroup;

  //   parentGroup.get('Quantity')?.patchValue(selectedBOQItem.Quantity.toString());
  //   parentGroup.get('Price')?.patchValue(selectedBOQItem.Price.toString());
  //   parentGroup.get('MaterialText')?.patchValue(selectedBOQItem.MaterialText.toString());
  //   parentGroup.get('ItemDescription')?.patchValue(selectedBOQItem.ItemDescription ? selectedBOQItem.ItemDescription.toString() : '');
  //   parentGroup.get('Uom')?.patchValue(selectedBOQItem.Uom);
  //   parentGroup.get('budgetYear')?.patchValue(selectedBOQItem.budgetYear);
  //   parentGroup.get('ItemNo')?.patchValue((this.selectedBOQIndex + 1).toString());

  //   this.ITCheckList.parentCheckList.forEach((list: any) => {
  //     parentGroup.get(list.checklist_name_en)?.patchValue(selectedBOQItem[list.checklist_name_en]);


  //     if (selectedBOQItem[list.checklist_name_en]) {
  //       this.ITCheckList.childCheckList.forEach((childList: any) => {
  //         if (list.checklist_id == childList.parent_checklist_id) {
  //           let checkListItem = selectedBOQItem[list.checklist_name_en + 'Group'];
  //           let childGroup = parentGroup.get(list.checklist_name_en + 'Group') as FormGroup;

  //           childGroup.get(list.checklist_name_en + childList.checklist_id)?.patchValue(checkListItem[list.checklist_name_en + childList.checklist_id]);
  //           childGroup.get(list.checklist_name_en + childList.checklist_id + 'Comment')?.patchValue(checkListItem[list.checklist_name_en + childList.checklist_id + 'Comment']);
  //           childGroup.get(list.checklist_name_en + childList.checklist_id + 'OtherComment')?.patchValue(checkListItem[list.checklist_name_en + childList.checklist_id + 'OtherComment']);
  //         }
  //       });
  //     }

  //   });
  //   parentGroup.updateValueAndValidity();
  // }

  // // add payment from group
  async addQual() {
    this.QualList?.push(this.createQual(
      this.translate.instant('RFP.Previousexperience'),
      'الخبرات السابقة'
    ));
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.NoYearsExp'),
        'عدد سنوات الخبرة في مجال طلب التأهيل'
      )
    );
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.NoOfProjects'),
        'عدد المشاريع المنفذة خلال الثلاث سنوات الأخيرة في مجال طلب التأهيل'
      )
    );
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.TotValProj'),
        'إجمالي قيمة المشاريع خلال الثلاث سنوات الأخيرة'
      )
    );
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.ConObj'),
        'الالتزامات التعاقدية القائمة'
      )
    );

    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.NoOfExtProjs'),
        'عدد المشاريع القائمة'
      )
    );
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.TalValExtProj'),
        'قيمة المشاريع القائمة'
      )
    );

    this.QualList?.push(
      this.createQual(this.translate.instant('RFP.HR'), 'الموارد البشرية ')
    );
    this.QualList?.push(
      this.createQual(this.translate.instant('RFP.NoOfEmp'), 'عدد الموظفين')
    );
    this.QualList?.push(
      this.createQual(
        this.translate.instant('RFP.PertOfSaudiEmp'),
        'نسبة الموظفين السعوديين'
      )
    );

    // this.checkQualPer();
  }
// ------------ RENUMBER & SYNC FUNCTION (MOST IMPORTANT) ------------ //

private renumberTechReq(): void {
  this.TechReqListData = this.TechReqListData.map((item, index) => ({
    ...item,
    ItemNo: (index + 1).toString()
  }));

  this.srNoTechReq = this.TechReqListData.length + 1;

  // update list control
  this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);

  // update the SL.No input at the top
  this.rfpForm.get('TechReq.ItemNo')?.setValue(this.srNoTechReq.toString());
}


// ------------ ADD ROW ------------ //

//  addTechReq(cond: 'add' | 'save' | any) {

//   // read the TechReq form group value (not the whole form)
//   const techReqGroup = this.rfpForm.get('TechReq') as FormGroup;
//   if (!techReqGroup) { return; }

//   if (techReqGroup.invalid) {
//     // mark touched so errors show if any
//     techReqGroup.markAllAsTouched();
//     return;
//   }

//   // clone to avoid reference problems
//   const data = {
//     RfpNo: techReqGroup.get('RfpNo')?.value || '',
//     RfpVersion: techReqGroup.get('RfpVersion')?.value || '',
//     ItemNo: techReqGroup.get('ItemNo')?.value?.toString() || (this.srNoTechReq).toString(),
//     Descr: techReqGroup.get('Descr')?.value || ''
//   };

//   // push new entry
//   this.TechReqListData.push(data);
//   // create a new array reference so change detection picks it up
//   this.TechReqListData = [...this.TechReqListData];

//   // update any other storage you use (avoid writing into rfpForm.value directly)
//   // for example set a property or call an API payload builder. If you must keep in form,
//   // keep it in a separate control RfpTreq:
//   if (this.rfpForm.get('RfpTreq')) {
//     this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);
//   }

//   if (cond === 'add') {
//     // increment serial and reset the input group for the next entry
//     this.srNoTechReq++;
//     techReqGroup.reset();
//     techReqGroup.patchValue({
//       RfpNo: '',
//       RfpVersion: '',
//       ItemNo: this.srNoTechReq.toString(),
//       Descr: ''
//     });
//   }
// }

// removeTechReq(index: number) {
//   // index is 1-based in your current calls, convert:
//   const idx = index - 1;
//   if (idx < 0 || idx >= this.TechReqListData.length) { return; }

//   this.TechReqListData.splice(idx, 1);
//   // renumber serials if you want to keep sequential
//   this.TechReqListData = this.TechReqListData.map((item, i) => ({
//     ...item,
//     ItemNo: (i + 1).toString()
//   }));
//   this.srNoTechReq = this.TechReqListData.length + 1;

//   if (this.rfpForm.get('RfpTreq')) {
//     this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);
//   }

//   // if the edit panel was open for a removed index, close it
//   if (this.techReqEditIndex === idx) {
//     this.showEditTechReq = false;
//   }
// }

// editTechReq(index: number) {
//   // index is 0-based in table loop (your template uses index as i)
//   const data = this.TechReqListData[index];
//   if (!data) { return; }

//   this.techReqEditIndex = index;
//   this.showEditTechReq = true;

//   // populate the edit group
//   const editG = this.rfpForm.get('TechReqEdit') as FormGroup;
//   editG.reset();
//   editG.patchValue({
//     RfpNo: data.RfpNo || '',
//     RfpVersion: data.RfpVersion || '',
//     ItemNo: (index + 1).toString(),
//     Descr: data.Descr || ''
//   });

//   // ensure required validator is applied for edit description while editing
//   editG.get('Descr')?.setValidators([Validators.required, Validators.maxLength(600)]);
//   editG.get('Descr')?.updateValueAndValidity();
// }

// saveEditTechReq() {
//   const editG = this.rfpForm.get('TechReqEdit') as FormGroup;
//   if (!editG || editG.invalid) {
//     editG?.markAllAsTouched();
//     return;
//   }

//   const data = {
//     RfpNo: editG.get('RfpNo')?.value || '',
//     RfpVersion: editG.get('RfpVersion')?.value || '',
//     ItemNo: editG.get('ItemNo')?.value?.toString() || (this.techReqEditIndex + 1).toString(),
//     Descr: editG.get('Descr')?.value || ''
//   };

//   // replace in the array
//   this.TechReqListData[this.techReqEditIndex] = data;
//   this.TechReqListData = [...this.TechReqListData];

//   // reflect in the full list control if you have one
//   if (this.rfpForm.get('RfpTreq')) {
//     this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);
//   }

//   // hide edit panel and clear the edit group
//   this.showEditTechReq = false;
//   editG.reset();
//   editG.get('Descr')?.clearValidators();
//   editG.get('Descr')?.updateValueAndValidity();
// }



  // add teachnical evaluation criteria from group
  addEval(cond: any) {
    if (cond === 'sub') {
      const totalEval = this.checkEvalPer(true);
      const percentage = this.rfpForm.controls.EvalCriteria.get('Percentage')?.value;
      
      if (totalEval != percentage) {
        this.cs.createMessage(
          'error',
          totalEval + this.translate.instant('RFP.SubCritriaEval')
        );
        return;
      }
      
      const subCriteriaData = this.subCriterias.value.map((subCriteria: any, index: number) => {
        return {
          SubItemNo: (index + 1).toString(),
          Percentage: subCriteria.Percentage.toString(),
          Descr: subCriteria.Descr
        };
      });
      
      const item = this.evalCriteriaItems.at(this.evalEditIndex);
      item.patchValue({
        subCriteriaList: subCriteriaData
      });
      
      this.isSubCriteria = false;
      this.subCriterias.clear();
      this.subCriterias.push(this.initialSubCriteria);
      return;
    }
   
    const data = this.rfpForm.getRawValue().EvalCriteria;
    data.Percentage = data.Percentage.toString();
    if (cond === 'sub') {
      const totalEval = this.checkEvalPer(true);
      if (totalEval != data.Percentage) {
        this.cs.createMessage(
          'error',
          totalEval + this.translate.instant('RFP.SubCritriaEval')
        );
        return;
      } else {
        data.expand = true;
        data.TechToTechSub = this.subCriterias.value.map((subCriteria: any, index: number) => {
          return {
            ...subCriteria,
            Percentage: subCriteria.Percentage.toString(),
            ItemNo: data.ItemNo,
            SubItemNo: (index + 1).toString(),
           
          };
          
        })
      }
    }
    if (cond === 'add') {
      data.expand = false;
      data.TechToTechSub = []
    }
    if (this.EvalListData.length == this.slel) {
      this.EvalListData[this.EvalListData.length - 1] = data;
    } else {
      this.EvalListData.push(data);
    }
    this.EvalListData = [...this.EvalListData];
    this.rfpForm.value.Evalcrt.value = this.EvalListData;
    const totalEval = this.checkEvalPer(false);

    if ((cond == 'add' || cond == 'sub') && totalEval <= 100) {
      this.slel++;
      this.rfpForm.controls.EvalCriteria.reset();
      this.rfpForm.controls.EvalCriteria.setValue({
        RfpNo: '',
        ItemNo: this.slel.toString(),
        Descr: '',
        Percentage: '0',
        Headline: '',
        SubCriFlg: 'X'
      });
      this.isSubCriteria = false;
    } else {
      this.EvalListData.pop()
    }
  }
  // private renumberTechReq(): void {
  // this.TechReqListData = this.TechReqListData.map((item, index) => ({
  //   ...item,
  //   ItemNo: (index + 1).toString()
  // }));

  
 
//   this.srNoTechReq = this.TechReqListData.length + 1;
 
//   // update list control
//   this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);
 
//   // update the SL.No input at the top
//   this.rfpForm.get('TechReq.ItemNo')?.setValue(this.srNoTechReq.toString());
// }
 
 
// ------------ ADD ROW ------------ //
 
addTechReq(cond: 'add' | 'save' | any) {
  const techReqGroup = this.rfpForm.get('TechReq') as FormGroup;
  if (techReqGroup.invalid) {
    techReqGroup.markAllAsTouched();
    return;
  }
 
  const row = {
    ItemNo: this.srNoTechReq.toString(),
    Descr: techReqGroup.get('Descr')?.value || '',
    RfpNo: techReqGroup.get('RfpNo')?.value || '',
    RfpVersion: techReqGroup.get('RfpVersion')?.value || ''
  };
 
  this.TechReqListData.push(row);
 
  this.renumberTechReq();
 
  if (cond === 'add') {
    techReqGroup.reset();
    techReqGroup.patchValue({
      ItemNo: this.srNoTechReq.toString()
    });
  }
}
 
 
// ------------ DELETE ROW ------------ //
 
removeTechReq(index: number) {
  const idx = index - 1;
  if (idx < 0 || idx >= this.TechReqListData.length) return;
 
  this.TechReqListData.splice(idx, 1);
 
  this.renumberTechReq();
 
  if (this.techReqEditIndex === idx) {
    this.showEditTechReq = false;
  }
}
 
 
// ------------ EDIT ROW ------------ //
 
editTechReq(index: number) {
  const row = this.TechReqListData[index];
  if (!row) return;
 
  this.techReqEditIndex = index;
  this.showEditTechReq = true;
 
  const editGroup = this.rfpForm.get('TechReqEdit') as FormGroup;
 
  editGroup.reset({
    ItemNo: row.ItemNo,
    Descr: row.Descr,
    RfpNo: row.RfpNo,
    RfpVersion: row.RfpVersion
  });
 
  editGroup.get('Descr')?.setValidators([Validators.required, Validators.maxLength(600)]);
  editGroup.get('Descr')?.updateValueAndValidity();
}
 
 
// ------------ SAVE EDIT ------------ //
 
saveEditTechReq() {
  const editGroup = this.rfpForm.get('TechReqEdit') as FormGroup;
  if (editGroup.invalid) {
    editGroup.markAllAsTouched();
    return;
  }
 
  const updated = {
    ItemNo: (this.techReqEditIndex + 1).toString(),
    Descr: editGroup.value.Descr,
    RfpNo: editGroup.value.RfpNo,
    RfpVersion: editGroup.value.RfpVersion
  };
 
  this.TechReqListData[this.techReqEditIndex] = updated;
 
  this.TechReqListData = [...this.TechReqListData];
 
  this.rfpForm.get('RfpTreq')?.setValue(this.TechReqListData);
 
  this.showEditTechReq = false;
  editGroup.reset();
}
 

  // remove evaluation criteria from group
  removeEval(index: number) {
    this.EvalListData = this.EvalListData.filter((item, i) => i !== index - 1);
    this.EvalListData = [...this.EvalListData];
    this.rfpForm.value.Evalcrt.value = this.EvalListData;
    this.checkEvalPer(false);

    if (index != this.slel) {
      this.slel--;
      this.rfpForm.controls.EvalCriteria.patchValue({
        ItemNo: this.slel.toString(),
      })
    } else {
      this.rfpForm.controls.EvalCriteria.reset();
      this.rfpForm.controls.EvalCriteria.setValue({
        RfpNo: '',
        ItemNo: this.slel.toString(),
        Descr: '',
        Percentage: '0',
        Headline: '',
        SubCriFlg: 'X'
      });
    }
  }

  addNewCriteria() {
    this.slel++;
    this.rfpForm.controls.EvalCriteria.reset();
    this.rfpForm.controls.EvalCriteria.setValue({
      RfpNo: '',
      ItemNo: this.slel.toString(),
      Descr: '',
      Percentage: '0',
      Headline: '',
      SubCriFlg: 'y'
    });
  }

  openSubCriteria(index: number, subCriFlg: string) {
    if (subCriFlg === 'X') {
      this.isSubCriteriaEdit = true;
      this.editEval(index);
    }
  }
getTotalWeightage(): number {
  return this.evalCriteriaItems.controls
    .map(ctrl => Number(ctrl.get('Percentage')?.value || 0))
    .reduce((acc, v) => acc + v, 0);
}
openSubCriteriaForRow(index: number) {
  const total = this.getTotalWeightage();

  // If total > 100 -> block and show message
  if (total > 100) {
    this.cs.createMessage('error', `Total Weightage exceeds 100 (current: ${total}). Please adjust values.`);
    this.isSubCriteria = false;
    this.subCriterias.clear();
    return;
  }

  const item = this.evalCriteriaItems.at(index);
  const subCriFlg = "X"; // your existing logic

  if (subCriFlg === 'X') {
    this.evalEditIndex = index;
    const percentage = Number(item.get('Percentage')?.value || 0);

    this.rfpForm.controls.EvalCriteria.patchValue({
      Percentage: percentage,
      ItemNo: (index + 1).toString()
    });

    this.subCriterias.clear();
    this.subCriterias.push(this.initialSubCriteria);
    this.isSubCriteria = true;
  } else {
    this.cs.createMessage('warning', 'Please select "Yes" for Sub Criteria');
  }
}
  // edit evaluation criteria from group
  editEval(index: number) {
    this.evalEditIndex = index;
    this.showEditEval = true;
    const data = this.EvalListData[index];
    this.rfpForm.controls.EvalCriteriaEdit.reset();
    this.rfpForm.controls.EvalCriteriaEdit.setValue({
      RfpNo: '',
      ItemNo: (index + 1).toString(),
      Descr: data.Descr,
      Percentage: data.Percentage.toString(),
      Headline: data.Headline,
      SubCriFlg: data.SubCriFlg
    });
    if (data.TechToTechSub.length > 0) {
      this.subCriterias.removeAt(0);

      data.TechToTechSub.forEach(({ ItemNo, ...rest }: any) =>
        this.subCriterias.push(this.createSubCriteria(rest)))
    } else {
      this.subCriterias.setValue([this.initialSubCriteria])
    }
    this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.updateValueAndValidity();

    this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.updateValueAndValidity();
    this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.updateValueAndValidity();
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.updateValueAndValidity();
  }


  // * Cancel Edit Technical Criteria
  cancelEditEval() {
    this.showEditEval = false;
    this.rfpForm.controls.EvalCriteriaEdit.reset();
    this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.updateValueAndValidity();

    this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.updateValueAndValidity();
    this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.updateValueAndValidity();
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.updateValueAndValidity();
  }

  // save edit part evaluation criteria from group
  saveEditEval(cond: string) {
    const data = this.rfpForm.getRawValue().EvalCriteriaEdit;
    data.Percentage = data.Percentage.toString();
    if (cond === 'sub') {
      const totalEval = this.checkEvalPer(true);
      if (totalEval != data.Percentage) {
        this.cs.createMessage(
          'error',
          totalEval + this.translate.instant('RFP.SubCritriaEval')
        );
        return;
      } else {
        data.expand = true;
        data.TechToTechSub = this.subCriterias.value.map((subCriteria: any, index: number) => {
          return {
            ...subCriteria,
            Percentage: subCriteria.Percentage.toString(),
            ItemNo: data.ItemNo,
            SubItemNo: (index + 1).toString()
          };
        });
      }
    }
    this.EvalListData[this.evalEditIndex] = data;
    if (this.slel == this.evalEditIndex + 1) {

      this.rfpForm.controls.EvalCriteria.patchValue({
        Descr: data.Descr,
        Percentage: data.Percentage.toString(),
      })
    }
    this.rfpForm.value.Evalcrt.value = this.EvalListData;
    this.EvalListData = [...this.EvalListData];
    this.EvalListData.forEach(item => {
      if (!item.TechToTechSub) {
        item.TechToTechSub = [];
      }
    });
    const totalEval = this.checkEvalPer(false);

    if (totalEval <= 100) {
      this.showEditEval = false;
      this.rfpForm.controls.EvalCriteriaEdit.reset();
      this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.setValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteriaEdit'].get('Percentage')?.updateValueAndValidity();

      this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteriaEdit'].get('Descr')?.updateValueAndValidity();
    }
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')?.updateValueAndValidity();
    this.isSubCriteriaEdit = false;

  }

  // add manpower from group
  addMan(cond: any) {
    const data = this.rfpForm.getRawValue().ManPowerForm;
    data.Amount = data.Amount.toString();


    if (this.ManPowerListData.length == this.slman) {
      this.ManPowerListData[this.ManPowerListData.length - 1] = data;
    } else {
      this.ManPowerListData.push(data);
    }
    this.ManPowerListData = [...this.ManPowerListData];
    this.rfpForm.value.ManPower.value = this.ManPowerListData;

    if (cond == 'add') {
      this.slman++;
      this.rfpForm.controls.ManPowerForm.reset();
      this.rfpForm.controls.ManPowerForm.setValue({
        ItemNo: this.slman.toString(),
        JobTitle: '',
        Amount: '',
        SpeQualf: '',
        Specilization: '',
        SpeExp: '',

      });
    }
  }

  removeMan(index: number) {
    this.ManPowerListData = this.ManPowerListData.filter((item, i) => i !== index - 1);
    this.ManPowerListData = [...this.ManPowerListData];
    this.rfpForm.value.ManPower.value = this.ManPowerListData;

    if (index != this.slman) {
      this.slman--;
      this.rfpForm.controls.ManPowerForm.patchValue({
        ItemNo: this.slman.toString(),
      })
    } else {
      this.rfpForm.controls.ManPowerForm.reset();
      this.rfpForm.controls.ManPowerForm.setValue({
        ItemNo: this.slman.toString(),
        JobTitle: '',
        Amount: '',
        SpeQualf: '',
        Specilization: '',
        SpeExp: '',

      });
    }
  }

  editMan(index: any) {
    this.manEditIndex = index;
    this.showEditMan = true;
    const data = this.ManPowerListData[index];
    this.rfpForm.controls.ManPowerFormEdit.reset();
    this.rfpForm.controls.ManPowerFormEdit.setValue({
      ItemNo: (index + 1).toString(),
      JobTitle: data.JobTitle,
      Amount: data.Amount,
      SpeQualf: data.SpeQualf,
      Specilization: data.Specilization,
      SpeExp: data.SpeExp,

    });
    this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.updateValueAndValidity();

    this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.updateValueAndValidity();





    this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.updateValueAndValidity();
    this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.updateValueAndValidity();
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.setValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.updateValueAndValidity();




  }

  saveEditMan() {
    const data = this.rfpForm.getRawValue().ManPowerFormEdit;
    data.Amount = data.Amount.toString();


    this.ManPowerListData[this.manEditIndex] = data;
    if (this.slman == this.manEditIndex + 1) {

      this.rfpForm.controls.ManPowerForm.patchValue({
        JobTitle: data.JobTitle,
        Amount: data.Amount,


        SpeExp: data.SpeExp,

      })
    }
    this.ManPowerListData = [...this.ManPowerListData];
    this.rfpForm.value.ManPower.value = this.ManPowerListData;
    this.showEditMan = false;
    this.rfpForm.controls.ManPowerFormEdit.reset();
    this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.updateValueAndValidity();

    this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.updateValueAndValidity();





    this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.updateValueAndValidity();
    this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.updateValueAndValidity();
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.removeValidators([
      Validators.required,
    ]);
    this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.updateValueAndValidity();




  }







  // remove pay from group
  removeQual(index: number) {
    if (index != 0) {
      this.slq--;
      this.QualList?.removeAt(index);
    } else {
    }
  }

  get boqFormGroup() {
    return this.rfpForm.get('billOFQty') as FormArray;
  }
 get Attachments(): boolean {
  const fg = this.rfpForm.get('attachments') as FormGroup;
  return fg ? fg.valid : false;
}


  get Evalcrt() {
    return this.rfpForm.get('Evalcrt') as FormArray;
  }


  get Payment() {
    return this.rfpForm.get('Payment') as FormArray;
  }

  get ManPower() {
    return this.rfpForm.get('ManPower') as FormArray;
  }

  get ConsultWork() {
    return this.rfpForm.get('ConsultWork') as FormArray;
  }


  handleManagerChange() {
    this.managerSubId = this.managerList.find((manager) => manager.TmUserid === this.rfpForm.controls['MemManagerName'].value)?.EmpUsrid
    if (
      this.rfpForm.controls['MemManagerName'].value &&
      (this.rfpForm.controls['MemName'].value.includes(this.rfpForm.controls['MemManagerName'].value)
      )) {
      this.cs.createMessage(
        'error',
        this.translate.instant('RFP.TechMemError')
      )
    }
  }


  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      // this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      // this.msg.error(`${file.name} file upload failed.`);
    }
  }

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.api.post('uploadfile', formData).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        if (res.messageId == 'S') {
          res.paths.forEach((res: any) => {
            this.uploadedfiles.push(res);
            this.attList?.push(this.createAttachs(res));
          });
          this.uploading = false;
          this.fileList = [];
          this.cs.createMessage(
            'success',
            this.translate.instant('RFP.UploadSuccess')
          );
        }
      },
      (error) => {
        this.uploading = false;
        this.cs.createMessage("error", error)
        this.cs.createMessage(
          'error',
          this.translate.instant('RFP.UploadFailed')
        );
      }
    );
  }

  createBoQ(): FormGroup {
    let itno = this.sl++;
    return this.fb.group({
      RfpNo: [''],
      ItemNo: [
        { value: this.boqTabelList.length + 1, disabled: true },
        [Validators.required],
      ],
      MaterialText: ['', [Validators.required, Validators.maxLength(40)]],
      ItemDescription: [''],
      CostCenter: [''],
      Quantity: ['', [Validators.required, Validators.min(1)]],
      Uom: ['', [Validators.required]],
      Price: ['', [Validators.required, Validators.min(0.1)]],
      budgetYear: ['', [Validators.required]],
      applyForAllBudgetYears: [false]
    });
  }

  onChange(value: string): void {
    this.updateValue(value);
  }

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.value = value;
    }
  }

  createPay(): FormGroup {
    let itnop = this.slp++;
    return this.fb.group({
      RfpNo: [''],
      ItemNo: [
        { value: itnop.toString(), disabled: true },
        [Validators.required],
      ],
      Descr: ['', [Validators.required]],
      Percentage: ['0', [Validators.required]],
    });
  }

  createQual(valueAr: string, value?: string): FormGroup {
    let itnoq = this.slq++;
    return this.fb.group({
      RfpNo: [''],
      ItemNo: [
        { value: itnoq.toString(), disabled: true },
        [Validators.required],
      ],
      Category: [{ value: value, disabled: true }, [Validators.required]],
      Subcategory: [{ value: valueAr, disabled: true }, [Validators.required]],
      Range: [''],
      Percentage: ['', [Validators.required]],
    });
  }

  // Range: ['',Validators.pattern('^[0-9 \-]+$')],

  createEval(): FormGroup {
    let itnoel = this.slel++;
    return this.fb.group({
      RfpNo: [''],
      ItemNo: [{ value: itnoel.toString(), disabled: true }, [Validators.required]],
      Descr: ['', [Validators.required, Validators.maxLength(600)]],
      Percentage: ['0', [Validators.required]]
    });
  }

  createCon(): FormGroup {
    let itcon = this.slcon++;
    return this.fb.group({
      ItemNo: [
        { value: itcon.toString(), disabled: true },
        [Validators.required],
      ],
      Phase: ['', [Validators.required]],
      NameDelv: ['', [Validators.required]],
      DeliveryDate: [new Date()],
      Descr: ['', [Validators.required]],
    });
  }

  createMan(): FormGroup {
    let itman = this.slman++;
    return this.fb.group({
      ItemNo: [
        { value: itman.toString(), disabled: true },
        [Validators.required],
      ],
      JobTitle: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      SpeQualf: ['', [Validators.required]],
      Specilization: ['', [Validators.required]],
      SpeExp: ['', Validators.maxLength(300)],

    });
  }

  createAttachs(data: any): FormGroup {
    let itnatt = this.slatt++;
    return this.fb.group({
      RfpNo: [''],
      ItemNo: [{ value: itnatt.toString(), disabled: true }],
      AttchId: [data],
      Ind: [''],
    });
  }

  removeDoc(i: number) {
    this.attList?.removeAt(i);
  }

  checkPayPer(): number {
    let totPayPer: number = 0;
    const data = this.rfpForm.value.Payment.value;
    for (let i = 0; i < data?.length; i++) {
      totPayPer += parseFloat(data[i].Percentage);
    }
    if (totPayPer > 100) {
      this.cs.createMessage(
        'error',

        totPayPer + this.translate.instant('RFP.PaymentVal')
      );
      return totPayPer;
    }
    return totPayPer;
  }

  checkEvalPer(subCriteria: boolean): number {
    let totEvalPer: number = 0;
    const data = subCriteria ? this.subCriterias.value : this.EvalListData;
    for (let i = 0; i < data?.length; i++) {
      totEvalPer += parseFloat(data[i].Percentage);
    }
    if (totEvalPer > (subCriteria ? this.isSubCriteria ?
      this.rfpForm.controls.EvalCriteria?.get('Percentage')?.value :
      this.rfpForm.controls.EvalCriteriaEdit?.get('Percentage')?.value :
      100)) {
      this.cs.createMessage(
        'error',
        totEvalPer + (subCriteria ? this.translate.instant('RFP.SubCritval') : this.translate.instant('RFP.EvalCritVal'))
      );

      return totEvalPer;
    }
    return totEvalPer;
  }




  handleProjTyChange(value: any) {
    this.rfpForm.controls['tyProc'].setValue(value.target.value);
  }


  handleConSwt(value: any) {
    this.isConsult = value;

    const consultControl = this.rfpForm.get('ConsultWork') as FormArray;

    if (value == true) {
      // this.rfpForm.controls['ConsultWork'].setValidators([Validators.required]);
      // this.rfpForm.controls['ConsultWork'].updateValueAndValidity();

      consultControl.controls.forEach((group: any) => {
        Object.keys(group.controls).forEach((controlKey) => {
          switch (controlKey) {
            case 'Phase':
            case 'ItemNo':
            case 'NameDelv':
            case 'Descr':
              group.controls[controlKey].setValidators([Validators.required]);
              break;
            default:
          }
          group.controls[controlKey].updateValueAndValidity();
        });
      });
    } else {
      this.rfpForm.controls['ConsultWork'].clearValidators();
      this.rfpForm.controls['ConsultWork'].updateValueAndValidity();

      consultControl.controls.forEach((group: any) => {
        Object.keys(group.controls).forEach((controlKey) => {
          group.controls[controlKey].clearValidators();
          group.controls[controlKey].updateValueAndValidity();
        });
      });
    }
  }
  handleManSwt(value: any) {
    this.isManPow = value;

    const manpowerControl = this.rfpForm.get('ManPower') as FormArray;

    if (value == true) {
      // this.rfpForm.controls['ManPower'].setValidators([Validators.required]);
      // this.rfpForm.controls['ManPower'].updateValueAndValidity();

      manpowerControl.controls.forEach((group: any) => {
        Object.keys(group.controls).forEach((controlKey) => {
          switch (controlKey) {
            case 'JobTitle':
            case 'ItemNo':
            case 'Amount':
            case 'SpeQualf':
              group.controls[controlKey].setValidators([Validators.required]);
              break;
            default:
          }
          switch (controlKey) {
            case 'SpeExp':
              group.controls[controlKey].setValidators([
                Validators.maxLength(300),
              ]);
              break;

            case 'Specilization':
              group.controls[controlKey].setValidators([
                Validators.maxLength(80),
              ]);

              break;
            default:
          }
          group.controls[controlKey].updateValueAndValidity();
        });
      });
    } else {
      this.rfpForm.controls['ManPower'].clearValidators();
      this.rfpForm.controls['ManPower'].updateValueAndValidity();

      manpowerControl.controls.forEach((group: any) => {
        Object.keys(group.controls).forEach((controlKey) => {
          group.controls[controlKey].clearValidators();
          group.controls[controlKey].updateValueAndValidity();
        });
      });
    }
  }

  handleTechrfp(value: any) {
    this.isTechRFP = value;
  }


  handleSingleVendor(value: any) {
    this.isSingleVendor = value;
  }


  removeValidations() {
    if (this.boqTabelList.length) {

      let boqGroup = (this.rfpForm?.get('billOFQty') as FormArray).at(0) as FormGroup;
      boqGroup.get('ItemNo')?.removeValidators([Validators.required]);
      boqGroup.get('ItemNo')?.updateValueAndValidity();

      boqGroup.get('MaterialText')?.removeValidators([Validators.required]);
      boqGroup.get('MaterialText')?.updateValueAndValidity();

      boqGroup.get('ItemDescription')?.removeValidators([Validators.required]);
      boqGroup.get('ItemDescription')?.updateValueAndValidity();

      boqGroup.get('Quantity')?.removeValidators([Validators.required]);
      boqGroup.get('Quantity')?.updateValueAndValidity();

      boqGroup.get('Uom')?.removeValidators([Validators.required]);
      boqGroup.get('Uom')?.updateValueAndValidity();

      boqGroup.get('Price')?.removeValidators([Validators.required]);
      boqGroup.get('Price')?.updateValueAndValidity();
      boqGroup.get('budgetYear')?.removeValidators([Validators.required]);
      boqGroup.get('budgetYear')?.updateValueAndValidity();

    }

    if (this.TechReqListData.length) {
      this.rfpForm.controls['TechReq'].get('Descr')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['TechReq'].get('Descr')?.updateValueAndValidity();
      this.rfpForm.controls['TechReqEdit'].get('Descr')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['TechReqEdit'].get('Descr')?.updateValueAndValidity();
      this.rfpForm.controls['TotTechEval'].removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['TotTechEval'].updateValueAndValidity();
    }


    if (this.EvalListData.length) {
      this.rfpForm.controls['EvalCriteria'].get('Descr')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Descr')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteria'].get('Percentage')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Percentage')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteria'].get('Headline')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('Headline')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteria'].get('SubCriFlg')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['EvalCriteria'].get('SubCriFlg')?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('SubCriFlg')
        ?.removeValidators([Validators.required]);
      this.rfpForm.controls['EvalCriteriaEdit'].get('SubCriFlg')
        ?.updateValueAndValidity();
      console.log(this.rfpForm.controls['EvalCriteriaEdit'].get('Descr'))
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('Descr')
        ?.removeValidators([Validators.required]);
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('Descr')
        ?.updateValueAndValidity();
      console.log(this.rfpForm.controls['EvalCriteriaEdit'].get('Descr'))
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('Percentage')
        ?.removeValidators([Validators.required]);
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('Percentage')
        ?.updateValueAndValidity();
      this.rfpForm.controls['EvalCriteriaEdit']
        .get('Headline')
        ?.removeValidators([Validators.required]);
      this.rfpForm.controls['EvalCriteriaEdit'].get('Headline')
        ?.updateValueAndValidity();
    }

    if (this.ManPowerListData.length || !this.isManPow) {
      this.rfpForm.controls['ManPowerForm'].get('JobTitle')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('JobTitle')?.updateValueAndValidity();
      this.rfpForm.controls['ManPowerForm'].get('Amount')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('Amount')?.updateValueAndValidity();


      this.rfpForm.controls['ManPowerForm'].get('SpeExp')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('SpeExp')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerForm'].get('Specilization')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('Specilization')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerForm'].get('SpeQualf')?.updateValueAndValidity();
      this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerFormEdit'].get('JobTitle')?.updateValueAndValidity();
      this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerFormEdit'].get('Amount')?.updateValueAndValidity();


      this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerFormEdit'].get('SpeExp')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerFormEdit'].get('Specilization')?.updateValueAndValidity();

      this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPowerFormEdit'].get('SpeQualf')?.updateValueAndValidity();
      this.rfpForm.controls['ManPower']?.removeValidators([
        Validators.required,
      ]);
      this.rfpForm.controls['ManPower']?.updateValueAndValidity();
    }



  }

  submitCase() {

    this.expcriteria = false;
    this.concriteria = false;
    this.hrcriteria = false;

    if (this.rfpForm.getRawValue().CostCenter1 === '' || this.rfpForm.getRawValue().CostCenter1 === null) {
      this.cs.createMessage("error", this.translate.instant('RFP.CCEmpty'))
      this.isSubmitClick = false;
      return;
    }

    if (this.rfpForm.getRawValue().Dept === '' || this.rfpForm.getRawValue().Dept === null) {
      this.cs.createMessage("error", this.translate.instant('RFP.DeptEmpty'))
      this.isSubmitClick = false;
      return;
    }

    let inval = false;

    let icon = 0, ipay = 0, itreq = 0, ieval = 0, iman = 0;

    this.ConsultListData.forEach((el: any) => {
      el.DeliveryDate = this.cs.getCurrentDateInApiFormat(el.DeliveryDate);
      el.ItemNo = (++icon).toString()
    })



    this.TechReqListData.forEach((el: any) => {
      el.ItemNo = (++itreq).toString()
    })

    this.EvalListData.forEach((el: any) => {
      el.ItemNo = (++ieval).toString()
    })

    this.ManPowerListData.forEach((el: any) => {
      el.ItemNo = (++iman).toString()
    })

    this.removeValidations();

    this.rfpForm.markAllAsTouched();


    if (this.rfpForm.invalid) {
      inval = true;
    }

    if (inval) {
      const errors = [...this.findInvalidControls()];
      const modalRef = this.modal.create({
        nzContent: ErrorPopupComponent,
        nzComponentParams: { errorList: errors, sectionHeight: '325px' },
        nzWidth: 600,
        nzBodyStyle: { height: 'auto', borderTop: `4px solid #005c99` },
        nzFooter: null
      });
      modalRef.afterClose
        .subscribe(() => {
          this.isSubmitClick = false;
        });
    } else {
      let data: any = {};
      if (this.step2 && this.step3) {

        if (this.expcriteria) {
          this.cs.createMessage("error", this.translate.instant('RFP.ExpCrtRangError'))
        }
        else if (this.concriteria) {
          this.cs.createMessage("error", this.translate.instant('RFP.ConCrtRangError'))
        }
        else if (this.hrcriteria) {
          this.cs.createMessage("error", this.translate.instant('RFP.HrCrtRangError'))
        }

        else if (this.rfpForm.controls['TotTechEval'].value == "" || this.rfpForm.controls['TotTechEval'].value == undefined || this.rfpForm.controls['TotTechEval'].value == null) {
          this.cs.createMessage(
            'error',
            this.translate.instant('RFP.TechPassReq')
          );
        }

        else if (this.checkEvalPer(false) > 100 || this.checkEvalPer(false) < 100) {
          this.cs.createMessage(
            'error',
            this.translate.instant('RFP.EvalError')
          );
        }

        else if (
          this.rfpForm.controls['MemManagerName'].value &&
          (this.rfpForm.controls['MemName'].value.includes(this.rfpForm.controls['MemManagerName'].value)
          )) {
          this.cs.createMessage(
            'error',
            this.translate.instant('RFP.TechMemError')
          )
        }
        else if (!this.boqTabelList.length) {
          this.cs.createMessage('error', this.translate.instant('RFP.BoqListAdd'))
        }
        else if (!this.TechReqListData.length) {
          this.cs.createMessage('error', this.translate.instant('RFP.TechReqListAdd'))
        }
        else if (!this.EvalListData.length) {
          this.cs.createMessage('error', this.translate.instant('RFP.EvalListAdd'))
        }
        else if (this.isManPow && !this.ManPowerListData.length) {
          this.cs.createMessage('error', this.translate.instant('RFP.ManpowerListAdd'))
        }
        else {
          for (let i = 0; i < this.boqTabelList.length; i++) {
            this.boqTabelList[i].Quantity = this.boqTabelList[i].Quantity.toString();
            this.boqTabelList[i].Price = this.cs.removeCommas(this.boqTabelList[i].Price);
            this.boqTabelList[i].CostCenter = this.rfpForm.getRawValue().CostCenter1 ? this.rfpForm.getRawValue().CostCenter1 : '';
            this.boqTabelList[i].PurGrpId = '';
          }

          for (let i = 0; i < this.rfpForm.value.Payment.length; i++) {
            ((this.rfpForm?.get('Payment') as FormArray).at(i) as FormGroup)
              .get('Percentage')
              ?.patchValue(
                this.rfpForm.value.Payment.at(i).Percentage.toString()
              );
          }
          if (this.isConsult) {
            for (let i = 0; i < this.rfpForm.value.ConsultWork.length; i++) {
              (
                (this.rfpForm?.get('ConsultWork') as FormArray).at(
                  i
                ) as FormGroup
              )
                .get('DeliveryDate')
                ?.patchValue(
                  this.cs.getCurrentDateInApiFormat(
                    this.rfpForm.value.ConsultWork.at(i).DeliveryDate
                  )
                );
            }
          }
          if (this.isManPow) {
            for (let i = 0; i < this.rfpForm.value.ManPower.length; i++) {
              ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
                .get('Amount')
                ?.patchValue(
                  this.rfpForm.value.ManPower.at(i).Amount.toString()
                );

              // ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
              //   .get('ExpBasicHr')
              //   ?.patchValue(
              //     this.rfpForm.value.ManPower.at(i).ExpBasicHr.toString()
              //   );

              // ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
              //   .get('ExpOvertime')
              //   ?.patchValue(
              //     this.rfpForm.value.ManPower.at(i).ExpOvertime.toString()
              //   );
            }
          }
          for (let i = 0; i < this.rfpForm.value.Evalcrt.length; i++) {
            ((this.rfpForm?.get('Evalcrt') as FormArray).at(i) as FormGroup)
              .get('Percentage')
              ?.patchValue(
                this.rfpForm.value.Evalcrt.at(i).Percentage.toString()
              );
          }


          data = {
            ExproAgrmnt: '',
            DeptId: this.cs.getUserData().DeptId,
            CostCenter: this.rfpForm.getRawValue().CostCenter1 ?? '',
            MatGrpId: this.rfpForm.getRawValue().MatGrpId ?? '',
            DeliveryDate: this.cs.getCurrentDateInApiFormat(this.rfpForm.getRawValue().DeliveryDate),
            RfpName: this.rfpForm.controls['RfpName'].value
              ? this.rfpForm.controls['RfpName'].value
              : '',
            JustfProj: this.rfpForm.controls['ProjJust'].value
              ? this.rfpForm.controls['ProjJust'].value
              : '',
            UrgntRfpJustf: '',
            ScopeWork: this.rfpForm.controls['SOP'].value
              ? this.rfpForm.controls['SOP'].value
              : '',
            PurGrpId: this.rfpForm.controls['PurGrpId'].value ?? '',
            ReqToBoqNavg: this.rfpService.transformToMasterBOQ(this.boqTabelList),
            ReqToBuddrNavg: this.rfpService.transformToReqToBuddrNavg(this.boqTabelList),
            ReqToBudsrNavg: this.rfpService.transformToReqToBudsrNavg(this.boqTabelList),
            DocTypeId: '',
            EstmPriceWithoutVat: this.rfpForm.controls['estPrice'].value ?
              this.cs.removeCommas(this.rfpForm.controls['estPrice'].value.toString()) : '',
            EstPrice: this.rfpForm.controls['estPriceVAT'].value
              ? this.cs.removeCommas(this.rfpForm.controls['estPriceVAT'].value.toString())
              : '',
            ProjDuration: this.rfpForm.controls['ProjDur'].value
              ? this.rfpForm.controls['ProjDur'].value.toString()
              : '',
            DurationMeasure: this.rfpForm.controls['DurationType'].value
              ? this.rfpForm.controls['DurationType'].value.toString()
              : '',

            CertReq: this.certificatedet === true ? 'X' : 'N',
            TecMemId: '',


            TechRfp: this.isTechRFP === true ? 'X' : 'N',
            UrgntRfp: '',



            TotTechEval: this.rfpForm.controls['TotTechEval'].value
              ? this.rfpForm.controls['TotTechEval'].value.toString()
              : '',

            RfpStatus: 'S',
            CreatedBy: this.cs.getUserData().userid,
            NwfApprvRole: 'REQSTR',
            Ind: '',
            RfpVersion: '',
            RfpNo: '',

            ProjManpower: this.rfpForm.controls['ProjManpower'].value
              ? 'X'
              : 'N',
            ReqToMpwrNavg: this.isManPow
              ? this.ManPowerListData
              : [],
            ReqToWorkNavg: this.isConsult
              ? this.ConsultListData
              : [],
            ReqToTechNavg: this.rfpForm.controls['Evalcrt'].value
              ? this.EvalListData.map(({ SubCriFlg, expand, ...rest }) => ({
                ...rest,
                SubCriFlg: SubCriFlg === 'y' ? '' : SubCriFlg
              }))
              : [],
            ReqToTreqNavg: this.rfpForm.controls['RfpTreq'].value
              ? this.TechReqListData
              : [],
            ReqToAttchNavg: this.fileNetList,
            ReqToTmbrNavg: this.rfpForm.controls['MemName'].value
              ? this.rfpService.getTechnicalMemberFormat(this.rfpForm.controls['MemName'].value, this.managerSubId) : [],
            TechEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'technicalEvaluationWeightage'])?.value.toString(),
            FinEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'financialEvaluationWeightage'])?.value.toString()
          };

          data = this.getChecklistMapped(data);

          data = this.getProclistMapped(data);

          if (data) {
            this.spinner.show()
            this.api.post('RfpHeaderSet', data).pipe(takeUntil(this.destroy$)).subscribe(
              (res: any) => {

                if (res.d.MessageId === 'S') {
                  this.spinner.hide();
                  // this.cs.createMessage(
                  //   'success',
                  //   this.cs.userLanguage === 'en'
                  //     ? res.d.MessageEn
                  //     : res.d.MessageAr
                  // );
                  this.submitConfirmation = true;
                  this.responseMessage = this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
                  this.router.navigate(['rfp/myrfp'], {
                    state: { ActiveTab: 'myrfp' },
                  });
                  this.cs.activeMenu = 'myrfp';
                } else {
                  this.spinner.hide();
                  // this.cs.createMessage(
                  //   'error',
                  //   this.cs.userLanguage === 'en'
                  //     ? res.d.MessageEn
                  //     : res.d.MessageAr
                  // );
                  this.submitConfirmationFailure = true;
                  this.responseMessage = this.cs.userLanguage === 'en' ? res.d.MessageEn : res.d.MessageAr
                  this.spinner.hide();
                }
              },
              (error) => {
                this.spinner.hide();
                // this.cs.createMessage('error', error);
                this.submitConfirmationFailure = true;
                this.responseMessage = error.statusText

              }


            );
          }
        }
      }
      else if (this.step2) {
        if (this.checkPayPer() > 100 || this.checkPayPer() < 100) {
          this.cs.createMessage(
            'error',
            this.translate.instant('RFP.PayError')
          );
        } else {
          for (let i = 0; i < this.boqTabelList.length; i++) {
            this.boqTabelList[i].Quantity = this.boqTabelList[i].Quantity.toString();
            this.boqTabelList[i].Price = this.cs.removeCommas(this.boqTabelList[i].Price);
            this.boqTabelList[i].CostCenter = this.rfpForm.getRawValue().CostCenter1 ? this.rfpForm.getRawValue().CostCenter1 : '';
            this.boqTabelList[i].PurGrpId = '';
          }

          for (let i = 0; i < this.rfpForm.value.Payment.length; i++) {
            ((this.rfpForm?.get('Payment') as FormArray).at(i) as FormGroup)
              .get('Percentage')
              ?.patchValue(
                this.rfpForm.value.Payment.at(i).Percentage.toString()
              );
          }
          data = {
            ExproAgrmnt: '',
            DeptId: this.cs.getUserData().DeptId,
            CostCenter: this.rfpForm.getRawValue().CostCenter1 ?? '',
            MatGrpId: this.rfpForm.getRawValue().MatGrpId ?? '',
            DeliveryDate: this.cs.getCurrentDateInApiFormat(this.rfpForm.getRawValue().DeliveryDate),
            RfpName: this.rfpForm.controls['RfpName'].value
              ? this.rfpForm.controls['RfpName'].value
              : '',
            JustfProj: this.rfpForm.controls['ProjJust'].value
              ? this.rfpForm.controls['ProjJust'].value
              : '',
            UrgntRfpJustf: '',
            ScopeWork: this.rfpForm.controls['SOP'].value
              ? this.rfpForm.controls['SOP'].value
              : '',
            PurGrpId: this.rfpForm.controls['PurGrpId'].value ?? '',
            ReqToBoqNavg: this.rfpService.transformToMasterBOQ(this.boqTabelList),
            ReqToBuddrNavg: this.rfpService.transformToReqToBuddrNavg(this.boqTabelList),
            ReqToBudsrNavg: this.rfpService.transformToReqToBudsrNavg(this.boqTabelList),
            DocTypeId: '',
            EstmPriceWithoutVat: this.rfpForm.controls['estPrice'].value ?
              this.cs.removeCommas(this.rfpForm.controls['estPrice'].value.toString()) : '',
            EstPrice: this.rfpForm.controls['estPriceVAT'].value
              ? this.cs.removeCommas(this.rfpForm.controls['estPriceVAT'].value.toString())
              : '',
            ProjDuration: this.rfpForm.controls['ProjDur'].value
              ? this.rfpForm.controls['ProjDur'].value.toString()
              : '',
            DurationMeasure: this.rfpForm.controls['DurationType'].value
              ? this.rfpForm.controls['DurationType'].value.toString()
              : '',

            CertReq: 'N',
            TecMemId: '',

            QualfCommMem: '',

            TechRfp: this.isTechRFP === true ? 'X' : 'N',
            UrgntRfp: '',

            ReqToQualfNavg: [],
            ReqCert: '',

            TotTechEval: this.rfpForm.controls['TotTechEval'].value
              ? this.rfpForm.controls['TotTechEval'].value.toString()
              : '',

            RfpStatus: 'S',
            CreatedBy: this.cs.getUserData().userid,
            NwfApprvRole: 'REQSTR',
            Ind: '',
            RfpVersion: '',
            RfpNo: '',
            ConsultWork: 'N',
            ProjManpower: 'N',
            ReqToMpwrNavg: [],
            ReqToWorkNavg: [],
            ReqToTechNavg: [],
            ReqToAttchNavg: this.fileNetList,
            ReqToTmbrNavg: this.rfpForm.controls['MemName'].value
              ? this.rfpService.getTechnicalMemberFormat(this.rfpForm.controls['MemName'].value, this.managerSubId) : [],
            TechEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'technicalEvaluationWeightage'])?.value.toString(),
            FinEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'financialEvaluationWeightage'])?.value.toString()
          };

          data = this.getChecklistMapped(data);

          data = this.getProclistMapped(data);

          if (data) {
            this.spinner.show()
            this.api.post('RfpHeaderSet', data).pipe(takeUntil(this.destroy$)).subscribe(
              (res: any) => {

                if (res.d.MessageId === 'S') {
                  this.cs.createMessage(
                    'success',
                    this.cs.userLanguage === 'en'
                      ? res.d.MessageEn
                      : res.d.MessageAr
                  );
                  this.router.navigate(['rfp/myrfp'], {
                    state: { ActiveTab: 'myrfp' },
                  });
                  this.cs.activeMenu = 'myrfp';
                } else {
                  this.cs.createMessage(
                    'error',
                    this.cs.userLanguage === 'en'
                      ? res.d.MessageEn
                      : res.d.MessageAr
                  );
                  this.spinner.hide();
                }
              },
              (error) => {
                this.spinner.hide();
                this.cs.createMessage('error', error);

              }
            );
          }
        }
      }
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.rfpForm.controls;
    for (const name in controls) {

      if (controls[name].invalid) {
        console.log('invaild rfp controls', this.translate.instant(name))
        invalid.push(this.translate.instant(name));
      }
    }
    return invalid;
  }

  submitDraft() {

    if (this.rfpForm.getRawValue().CostCenter1 === '' || this.rfpForm.getRawValue().CostCenter1 === null) {
      this.cs.createMessage("error", this.translate.instant('RFP.CCEmpty'))
      return;
    }

    if (this.rfpForm.getRawValue().Dept === '' || this.rfpForm.getRawValue().Dept === null) {
      this.cs.createMessage("error", this.translate.instant('RFP.DeptEmpty'))
      return;
    }

    let data: any = {};

    let icon = 0, ipay = 0, itreq = 0, ieval = 0, iman = 0;

    this.ConsultListData.forEach((el: any) => {
      el.DeliveryDate = this.cs.getCurrentDateInApiFormat(el.DeliveryDate);
      el.ItemNo = (++icon).toString()
    })


    this.TechReqListData.forEach((el: any) => {
      el.ItemNo = (++itreq).toString()
    })

    this.EvalListData.forEach((el: any) => {
      el.ItemNo = (++ieval).toString()
    })

    this.ManPowerListData.forEach((el: any) => {
      el.ItemNo = (++iman).toString()
    })

    if (this.step2 && this.step3) {
      for (let i = 0; i < this.boqTabelList.length; i++) {
        this.boqTabelList[i].Quantity = this.boqTabelList[i].Quantity.toString();
        this.boqTabelList[i].Price = this.cs.removeCommas(this.boqTabelList[i].Price);
        this.boqTabelList[i].CostCenter = this.rfpForm.getRawValue().CostCenter1 ? this.rfpForm.getRawValue().CostCenter1 : '';
        this.boqTabelList[i].PurGrpId = '';
      }

      for (let i = 0; i < this.rfpForm.value.Payment.length; i++) {
        ((this.rfpForm?.get('Payment') as FormArray).at(i) as FormGroup)
          .get('Percentage')
          ?.patchValue(this.rfpForm.value.Payment.at(i).Percentage.toString());
      }
      if (this.isConsult) {
        for (let i = 0; i < this.rfpForm.value.ConsultWork.length; i++) {
          ((this.rfpForm?.get('ConsultWork') as FormArray).at(i) as FormGroup)
            .get('DeliveryDate')
            ?.patchValue(
              this.cs.getCurrentDateInApiFormat(
                this.rfpForm.value.ConsultWork.at(i).DeliveryDate
              )
            );
        }
      }
      if (this.isManPow) {
        for (let i = 0; i < this.rfpForm.value.ManPower.length; i++) {
          ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
            .get('Amount')
            ?.patchValue(this.rfpForm.value.ManPower.at(i).Amount.toString());

          // ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
          //   .get('ExpBasicHr')
          //   ?.patchValue(
          //     this.rfpForm.value.ManPower.at(i).ExpBasicHr.toString()
          //   );

          // ((this.rfpForm?.get('ManPower') as FormArray).at(i) as FormGroup)
          //   .get('ExpOvertime')
          //   ?.patchValue(
          //     this.rfpForm.value.ManPower.at(i).ExpOvertime.toString()
          //   );
        }
      }

      for (let i = 0; i < this.rfpForm.value.Evalcrt.length; i++) {
        ((this.rfpForm?.get('Evalcrt') as FormArray).at(i) as FormGroup)
          .get('Percentage')
          ?.patchValue(this.rfpForm.value.Evalcrt.at(i).Percentage.toString());
      }


      data = {
        ExproAgrmnt: '',
        DeptId: this.cs.getUserData().DeptId,
        CostCenter: this.rfpForm.getRawValue().CostCenter1 ?? '',
        MatGrpId: this.rfpForm.getRawValue().MatGrpId ?? '',
        DeliveryDate: this.cs.getCurrentDateInApiFormat(this.rfpForm.getRawValue().DeliveryDate),
        RfpName: this.rfpForm.controls['RfpName'].value
          ? this.rfpForm.controls['RfpName'].value
          : '',
        JustfProj: this.rfpForm.controls['ProjJust'].value
          ? this.rfpForm.controls['ProjJust'].value
          : '',
        UrgntRfpJustf: '',
        ScopeWork: this.rfpForm.controls['SOP'].value
          ? this.rfpForm.controls['SOP'].value
          : '',
        PurGrpId: this.rfpForm.controls['PurGrpId'].value ?? '',
        ReqToBoqNavg: this.rfpService.transformToMasterBOQ(this.boqTabelList),
        ReqToBuddrNavg: this.rfpService.transformToReqToBuddrNavg(this.boqTabelList),
        ReqToBudsrNavg: this.rfpService.transformToReqToBudsrNavg(this.boqTabelList),
        DocTypeId: '',
        EstmPriceWithoutVat: this.rfpForm.controls['estPrice'].value ?
          this.cs.removeCommas(this.rfpForm.controls['estPrice'].value.toString()) : '',
        EstPrice: this.rfpForm.controls['estPriceVAT'].value
          ? this.cs.removeCommas(this.rfpForm.controls['estPriceVAT'].value.toString())
          : '',
        ProjDuration: this.rfpForm.controls['ProjDur'].value
          ? this.rfpForm.controls['ProjDur'].value.toString()
          : '',
        DurationMeasure: this.rfpForm.controls['DurationType'].value
          ? this.rfpForm.controls['DurationType'].value.toString()
          : '',

        CertReq: this.certificatedet === true ? 'X' : 'N',
        TecMemId: '',



        TechRfp: this.isTechRFP === true ? 'X' : 'N',
        UrgntRfp: '',





        TotTechEval: this.rfpForm.controls['TotTechEval'].value
          ? this.rfpForm.controls['TotTechEval'].value.toString()
          : '',

        RfpStatus: 'D',
        CreatedBy: this.cs.getUserData().userid,
        NwfApprvRole: 'REQSTR',
        Ind: '',
        RfpVersion: '',
        RfpNo: '',
        ProjManpower: this.rfpForm.controls['ProjManpower'].value ? 'X' : 'N',
        ReqToMpwrNavg: this.isManPow ? this.ManPowerListData : [],
        ReqToWorkNavg: this.isConsult
          ? this.ConsultListData
          : [],
        ReqToTechNavg: this.rfpForm.controls['Evalcrt'].value
          ? this.EvalListData.map(({ SubCriFlg, expand, ...rest }) => ({
            ...rest,
            SubCriFlg: SubCriFlg === 'y' ? '' : SubCriFlg
          }))
          : [],
        ReqToTreqNavg: this.rfpForm.controls['RfpTreq'].value
          ? this.TechReqListData
          : [],
        ReqToAttchNavg: this.fileNetList,
        ReqToTmbrNavg: this.rfpForm.controls['MemName'].value
          ? this.rfpService.getTechnicalMemberFormat(this.rfpForm.controls['MemName'].value, this.managerSubId) : [],
        TechEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'technicalEvaluationWeightage'])?.value.toString(),
        FinEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'financialEvaluationWeightage'])?.value.toString()
      };

      data = this.getChecklistMapped(data);

      data = this.getProclistMapped(data);

      if (data) {
        this.spinner.show()
        this.api.post('RfpHeaderSet', data).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.d.MessageId === 'S') {
              this.spinner.hide();
              this.cs.createMessage(
                'success',
                this.cs.userLanguage === 'en'
                  ? res.d.MessageEn
                  : res.d.MessageAr
              );
              this.router.navigate(['rfp/myrfp'], {
                state: { ActiveTab: 'create' },
              });
              this.cs.activeMenu = 'myrfp';
            } else {
              this.spinner.hide();
              this.cs.createMessage(
                'error',
                this.cs.userLanguage === 'en'
                  ? res.d.MessageEn
                  : res.d.MessageAr
              );
            }
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);

          }
        );
      }
    } else if (this.step2) {
      for (let i = 0; i < this.boqTabelList.length; i++) {
        this.boqTabelList[i].Quantity = this.boqTabelList[i].Quantity.toString();
        this.boqTabelList[i].Price = this.cs.removeCommas(this.boqTabelList[i].Price);
        this.boqTabelList[i].CostCenter = this.rfpForm.getRawValue().CostCenter1 ? this.rfpForm.getRawValue().CostCenter1 : '';
        this.boqTabelList[i].PurGrpId = '';
      }

      for (let i = 0; i < this.rfpForm.value.Payment.length; i++) {
        ((this.rfpForm?.get('Payment') as FormArray).at(i) as FormGroup)
          .get('Percentage')
          ?.patchValue(this.rfpForm.value.Payment.at(i).Percentage.toString());
      }
      data = {
        ExproAgrmnt: '',
        DeptId: this.cs.getUserData().DeptId,
        CostCenter: this.rfpForm.getRawValue().CostCenter1 ?? '',
        MatGrpId: this.rfpForm.getRawValue().MatGrpId ?? '',
        DeliveryDate: this.cs.getCurrentDateInApiFormat(this.rfpForm.getRawValue().DeliveryDate),
        RfpName: this.rfpForm.controls['RfpName'].value
          ? this.rfpForm.controls['RfpName'].value
          : '',
        JustfProj: this.rfpForm.controls['ProjJust'].value
          ? this.rfpForm.controls['ProjJust'].value
          : '',
        UrgntRfpJustf: '',
        ScopeWork: this.rfpForm.controls['SOP'].value
          ? this.rfpForm.controls['SOP'].value
          : '',
        PurGrpId: this.rfpForm.controls['PurGrpId'].value ?? '',
        ReqToBoqNavg: this.rfpService.transformToMasterBOQ(this.boqTabelList),
        ReqToBuddrNavg: this.rfpService.transformToReqToBuddrNavg(this.boqTabelList),
        ReqToBudsrNavg: this.rfpService.transformToReqToBudsrNavg(this.boqTabelList),
        DocTypeId: '',
        EstmPriceWithoutVat: this.rfpForm.controls['estPrice'].value ?
          this.cs.removeCommas(this.rfpForm.controls['estPrice'].value.toString()) : '',
        EstPrice: this.rfpForm.controls['estPriceVAT'].value
          ? this.cs.removeCommas(this.rfpForm.controls['estPriceVAT'].value.toString())
          : '',
        ProjDuration: this.rfpForm.controls['ProjDur'].value
          ? this.rfpForm.controls['ProjDur'].value.toString()
          : '',
        DurationMeasure: this.rfpForm.controls['DurationType'].value
          ? this.rfpForm.controls['DurationType'].value.toString()
          : '',

        CertReq: 'N',
        TecMemId: '',



        TechRfp: this.isTechRFP === true ? 'X' : 'N',
        UrgntRfp: '',
        ReqToQualfNavg: [],
        ReqCert: '',

        TotTechEval: this.rfpForm.controls['TotTechEval'].value
          ? this.rfpForm.controls['TotTechEval'].value.toString()
          : '',

        RfpStatus: 'D',
        CreatedBy: this.cs.getUserData().userid,
        NwfApprvRole: 'REQSTR',
        Ind: '',
        RfpVersion: '',
        RfpNo: '',
        ConsultWork: 'N',
        ProjManpower: 'N',
        ReqToMpwrNavg: [],
        ReqToWorkNavg: [],
        ReqToTechNavg: [],
        ReqToAttchNavg: this.fileNetList,
        ReqToTmbrNavg: this.rfpForm.controls['MemName'].value
          ? this.rfpService.getTechnicalMemberFormat(this.rfpForm.controls['MemName'].value, this.managerSubId) : [],
        TechEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'technicalEvaluationWeightage'])?.value.toString(),
        FinEvalWatage: this.rfpForm.get(['vendorEvaluationWeightage', 'financialEvaluationWeightage'])?.value.toString()
      };

      data = this.getChecklistMapped(data);

      data = this.getProclistMapped(data);

      if (data) {
        this.spinner.show()
        this.api.post('RfpHeaderSet', data).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.d.MessageId === 'S') {
              this.spinner.hide()
              this.cs.createMessage(
                'success',
                this.cs.userLanguage === 'en'
                  ? res.d.MessageEn
                  : res.d.MessageAr
              );
              this.router.navigate(['rfp/myrfp'], {
                state: { ActiveTab: 'create' },
              });
              this.cs.activeMenu = 'myrfp';
            } else {
              this.spinner.hide();
              this.cs.createMessage(
                'error',
                this.cs.userLanguage === 'en'
                  ? res.d.MessageEn
                  : res.d.MessageAr
              );
            }
          },
          (error) => {
            this.spinner.hide();
            this.cs.createMessage('error', error.statusText);

          }
        );
      }
    }
  }
  Close() {
    this.step2 = false;
    this.step3 = false;
  }

  handleDocType(value: any) {
    this.onDocumentTypeChangeResetFormControl();
    this.ptypes = this.rfpService.filterDocumentTypeWithId(value);
  }

  /**
   * Handles the Document Type change and reset the related form fields.
   */
  onDocumentTypeChangeResetFormControl(): void {
    this.rfpForm?.get('MatGrpId')
      ?.reset();
  }

  handleDocTypeBoq(value: any) {

    this.getMatgp(value)
  }


  allMatGroups: any;
  getMatgp(value?: any) {
    if (value) {
      let data = {
        "DocTypeId": ''
      }
      this.api.post('F4MatGrpSet', data).pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          this.matGp = res.d.results;

        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);

        }
      );
    }
    else {
      let data = {
        "DocTypeId": ""
      }
      this.api.post('F4MatGrpSet', data).pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          this.matGp = res.d.results;
          this.allMatGroups = res.d.results;
        },
        (error) => {
          this.spinner.hide();
          this.cs.createMessage('error', error.statusText);

        }
      );
    }


  }

  departmentType = localStorage.getItem('DepTxt');
  getDeps() {
    this.rfpForm.controls['Dept'].setValue(localStorage.getItem('DepTxt'));
    this.rfpForm.controls['Dept'].updateValueAndValidity();
    this.getMatgp();
  }

  get disableDate() {
    let duration = this.rfpForm.controls['ProjDur'].value;
    let unit = this.rfpForm.controls['DurationType'].value;

    let startDate = moment().add(Number(duration), unit); // Allowed start date

    return (date: Date): boolean => {
      return date < startDate.toDate(); // disable dates before startDate
    };
  }


  resetDeliveryDate() {
    this.rfpForm.controls['DeliveryDate'].setValue('')
  }

  getInvolvedYears(deliveryDate: Date, duration: number, unit: moment.unitOfTime.DurationConstructor): number[] {
    const endDate = moment(deliveryDate);
    const startDate = moment(deliveryDate).subtract(duration, unit);

    const startYear = startDate.year();
    const endYear = endDate.year();

    const years: number[] = [];

    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    return years;
  }

  upload() { }

  deleteFile(value: any) {
    this.spinner.show();
    let data = {
      name: value.AttchId,
    };
    let datad = {
      RfpNo: value.RfpNo,
      RfpVersion: value.RfpVersion,
      ItemNo: value.ItemNo.toString(),
    };
    this.api.post('RfpAttchSet', datad).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {

        if (res == 204) {
          this.api.post('deletefile', data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

            if (res) {
              this.spinner.hide();
            }
          });
        }
      },
      (error: any) => {
        this.spinner.hide();

      }
    );
  }

  filenetUpload(evt: any) {
    let itnatt = this.slatt++;
    console.log('rfp attachments', evt)

    this.fileNetList.push({
      RfpNo: '',
      ItemNo: itnatt.toString(),
      FilenetID: evt.createDocWithContentResponse.fileNetCreatedDocument.ID.replace('{', '').replace('}', ''),
      FileName: evt.createDocWithContentResponse.fileNetCreatedDocument.docTitle,
      // CommitteeId: this.CommitteeID,
      // CommitteeRole: this.role,
      // CommitteeUser: this.CommitteeName,
    })
  }

  fileSapUpload(evt: any) {
    console.log(evt, 'rfp attachment ')
    let itnatt = this.slatt++;
    this.fileNetList.push({
      RfpNo: "",
      ItemNo: itnatt.toString(),
      FilenetID: evt.Fileid,
      FileName: evt.Filename
    })
  }

  filenetDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID !== file.FilenetID);
  }


  fileSapDelete(evt: any) {
    this.fileNetList = this.fileNetList.filter((file: any) => evt.FilenetID != file.FilenetID);
  }

  // * Getter Methods
  getPurchaseGroup(type: any) {
    if (this.allPurGrp) {
      const data = this.allPurGrp.find((node: any) => node.PurGrpId == type);
      if (data) {
        if (this.cs.userLanguage === 'en') {
          return `${data.PurGrpId}-${data.PurGrpText}`;
        } else {
          return `${data.PurGrpText}-${data.PurGrpId}`;
        }
      } else {
        return '';
      }

    }

    return '';
  }

  getProcurementType(type: any) {
    if (this.dtypes) {
      const data = this.dtypes.find((node: any) => node.id == type);
      if (data) {
        return this.cs.userLanguage === 'en' ? data.value : data.valueAr;
      } else {
        return '';
      }
    }
    return '';
  }

  getMaterialGroup(type: any) {
    if (this.allMatGroups) {
      const data = this.allMatGroups.find((node: any) => node.MatGrpId == type);
      if (data) {
        if (this.cs.userLanguage === 'en') {
          return `${data.MatGrpId}-${data.MatGrpText}`;
        } else {
          return `${data.Data1}-${data.MatGrpId}`;
        }
      } else {
        return '';
      }
    }
    return '';
  }

  getUnitOfMeasureDesc(UnitId: string): string {
    if (this.uOM) {
      const unitOfMeasureGroup = this.uOM.filter((unitOfMeasure: any) => unitOfMeasure.Uom === UnitId);
      if (unitOfMeasureGroup) {
        if (this.cs.userLanguage === 'en') {
          return unitOfMeasureGroup[0].Uom + '-' + unitOfMeasureGroup[0].UomTxt;
        } else {
          return unitOfMeasureGroup[0].Data1 + '-' + unitOfMeasureGroup[0].Uom;
        }
      }
      else {
        return '';
      }
    }
    return '';
  }

  handleTotTechEvalEdit(value: boolean) {
    this.editTotTechEval = value;
    this.enableTotTechEval();
  }

  enableTotTechEval() {
    if (this.editTotTechEval) {
      this.rfpForm.controls.TotTechEval.enable()
    } else {
      this.rfpForm.controls.TotTechEval.disable()
    }
  }


  ontechnicalEvaluationWeightageChange() {
    console.log('change working')

    let technicalEvaluationWeightageValue = this.rfpForm.get('vendorEvaluationWeightage')?.get('technicalEvaluationWeightage')?.value
    console.log(technicalEvaluationWeightageValue)
    const financialWeightage = 100 - technicalEvaluationWeightageValue;
    const financialControl = this.rfpForm.get('vendorEvaluationWeightage.financialEvaluationWeightage');
    financialControl!.setValue(financialWeightage, { emitEvent: false });
  }

  // Add new method to update evaluation weights based on business rules
  updateEvaluationWeights(): void {
    const estimatedCost = this.rfpForm.get('estimatedCost')?.value;
    const activityId = this.rfpForm.get('activity')?.value;
    
    if (!estimatedCost || !activityId) {
      return;
    }

    const costInMillions = estimatedCost / 1000000; // Convert to millions
    let financialWeight = 80; // Default for other activities
    let technicalWeight = 20; // Default for other activities
    let technicalPassRate = 70; // Default pass rate

    if (costInMillions > 25) {
      // More than 25 million SAR
      if (activityId === 'ACT_CON') { // Contracting
        financialWeight = 80;
        technicalWeight = 20;
      } else if (activityId === 'ACT_CONS') { // Consultancy
        financialWeight = 30;
        technicalWeight = 70;
      } else if (activityId === 'ACT_FAC') { // Facility Operation, Maintenance, and Cleaning
        financialWeight = 65;
        technicalWeight = 35;
      }
      // For all other activities: use default 80, 20, 70
    } else {
      // Less than 25 million SAR
      if (activityId === 'ACT_FAC') { // Facility Operation, Maintenance, and Cleaning
        financialWeight = 70;
        technicalWeight = 30;
      } else if (activityId === 'ACT_CONS') { // Consultancy
        financialWeight = 35;
        technicalWeight = 65;
      } else if (activityId === 'ACT_CON') { // Contracting
        financialWeight = 85;
        technicalWeight = 15;
      }
      // For all other activities: use default 80, 20, 70
    }

    // Update the form controls
    const vendorEvaluationGroup = this.rfpForm.get('vendorEvaluationWeightage');
    vendorEvaluationGroup?.get('financialEvaluationWeightage')?.setValue(financialWeight, { emitEvent: false });
    vendorEvaluationGroup?.get('technicalEvaluationWeightage')?.setValue(technicalWeight, { emitEvent: false });
    
    // Update technical pass rate
    this.rfpForm.get('TotTechEval')?.setValue(technicalPassRate, { emitEvent: false });
  }


  getTotalPriceRow(item: any): number {
    const qty = parseFloat(item.Quantity) || 0;
    const price = parseFloat(item.Price) || 0;
    return qty * price;
  }

  getVatAmountRow(item: any): number {
    const total = this.getTotalPriceRow(item);
    const vatRate = 0.15; // 15% VAT (adjust if needed)
    return total * vatRate;
  }

  getTotalWithVatRow(item: any): number {
    return this.getTotalPriceRow(item) + this.getVatAmountRow(item);
  }

  getGrandTotalWithVat(data: readonly any[]): number {
    return data.reduce((sum, item) => sum + this.getTotalWithVatRow(item), 0);
  }
  getGrandTotalPrice(data: readonly any[]): number {
    return data.reduce((sum, item) => sum + this.getTotalPriceRow(item), 0);
  }

  getGrandVatAmount(data: readonly any[]): number {
    return data.reduce((sum, item) => sum + this.getVatAmountRow(item), 0);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createTechReq(): FormGroup {
    let itnoel = this.srNoTechReq++;
    return this.fb.group({
      RfpNo: [''],
      RfpVersion: [''],
      ItemNo: [
        { value: itnoel.toString(), disabled: true },
        [Validators.required],
      ],
      Descr: ['', [Validators.required, Validators.maxLength(600)]]
    });
  }
  restrictZero(event: any) {


    if (event.target.value.length === 0 && event.key <= "0") {

      event.preventDefault();
    }

  }

  showHideSubmit() {
    this.submitConfirmation = false;
    this.router.navigate(['rfp/myinbox']);
  }

  // * Getter methods
  get isRfpRequiredFieldsInValid(): boolean {
    if (this.boqFormGroup.invalid) return true;

    const RfpRequiredFields = ['ProjectId', 'RfpName', 'Dept', 'CostCenter1'];
    let isInvalid = false;
    RfpRequiredFields.forEach((fields) => {
      if (this.rfpForm.get(fields)?.invalid) isInvalid = true;
    });
    return isInvalid;
  }

  //*tech eval
  toggleDescrValidatorTechEval() {
    // Subscribe to valueChanges for EvalCriteria.SubCriFlg
    this.rfpForm?.get('EvalCriteria.SubCriFlg')?.valueChanges.subscribe((value) => {
      console.log(value);
      const descrControl = this.rfpForm.get('EvalCriteria.Descr');

      if (value === 'X') {
        descrControl?.clearValidators();
      } else {
        descrControl?.setValidators([Validators.required]);
      }

      descrControl?.updateValueAndValidity();
    });

    // Subscribe to valueChanges for EvalCriteriaEdit.SubCriFlg
    this.rfpForm?.get('EvalCriteriaEdit.SubCriFlg')?.valueChanges.subscribe((value) => {
      console.log(value);
      const descrControlEdit = this.rfpForm.get('EvalCriteriaEdit.Descr');

      if (value === 'X') {
        descrControlEdit?.clearValidators();
      } else {
        descrControlEdit?.setValidators([Validators.required]);
      }

      descrControlEdit?.updateValueAndValidity();
    });
  }



}




export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date().getTime();

    if (!(control && control.value)) {
      // if there's no control or no value, that's ok
      return null;
    }

    // return null if there's no errors
    return control.value.getTime() > today
      ? { invalidDate: 'You cannot use future dates' }
      : null;
  };



}
function downloadSelectedForm() {
  throw new Error('Function not implemented.');
}

