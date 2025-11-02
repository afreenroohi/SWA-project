import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import {
  CommitmentItem,
  InternalOrder,
  KPIDetails,
  budgetSplit,
  PlannedBudget
} from 'src/app/pages/RFP/rfp/rfp.model';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-budget-planner-step-one',
  templateUrl: './budget-planner-step-one.component.html',
  styleUrls: ['./budget-planner-step-one.component.scss']
})
export class BudgetPlannerStepOneComponent implements OnInit {
  @Input() isBudgetPlannerVisible: boolean = false;
  @Input() budgetDetails!: KPIDetails;
  @Input() rfpNo!: string;
  @Input() rfpVersion!: string;
  @Output() onBudgetPlannerClosed = new EventEmitter<void>();
  private readonly destroy$ = new Subject<void>();
  
    leftOverBudgetdetails!: KPIDetails;
  
    commitmentItems!: CommitmentItem[];
    commitmentItem: string = '';
  
    internalOrderItems!: InternalOrder[];
    internalOrder: string = '';
  
    budgetPlannerForm = new FormGroup({
      totalNoOfYearsForBudget: new FormControl(0, [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      isSameCommitmentAndInternalOrder: new FormControl(true),
      commitmentItem: new FormControl('', Validators.required),
      internalOrder: new FormControl(''),
    });
  
    splittedBudgetDetails: budgetSplit[] = []
    currentStep = 1; // Start with Container 1
    updatedSplittedBudgetDetails: budgetSplit[] = []
    

    constructor(private rfp: RFPService, private translate: TranslateService,private spinner: NgxSpinnerService, private cs: CommonService, private cdRef: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.rfp.getCommitmentItems();
    this.rfp.commitmentItems$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (commitmentItemsList) => {
        this.commitmentItems = commitmentItemsList;
      },
    });
    this.budgetPlannerForm.controls['commitmentItem'].valueChanges.subscribe(
      (value) => {
        this.commitmentChange(value);
      }
    );
    this.leftOverBudgetdetails = {
      kpiHeading: this.budgetDetails.kpiHeading,
      kpiDescription:this.translate.instant('RFP.Remaining Budget')

    };
   
    this.updateBudgetPlannerValidations()
    this.getSplittedBudgetingItems()
  }

  updateBudgetPlannerValidations(){
    this.budgetPlannerForm.get('isSameCommitmentAndInternalOrder')?.valueChanges.subscribe((isSame) => {
      const commitmentItemControl = this.budgetPlannerForm.get('commitmentItem');
      const internalOrderControl = this.budgetPlannerForm.get('internalOrder');
    
      if (isSame) {
        commitmentItemControl?.setValidators([Validators.required]);
        // internalOrderControl?.setValidators([Validators.required]);
      } else {
        commitmentItemControl?.clearValidators();
        // internalOrderControl?.clearValidators();
      }
    
      // Update validation state
      commitmentItemControl?.updateValueAndValidity();
      // internalOrderControl?.updateValueAndValidity();
    });
    
  }

  getSplittedBudgetingItems() {
    // this.spinner.show();
    this.rfp.getSplittedBudgetingItems(this.rfpNo, this.rfpVersion)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (BOQItems) => {
          let items = BOQItems.results.map((item: any) => ({
            ...item,
            BudVat: parseFloat(item.BudVat) || 0,
            ItmAmount: parseFloat(item.ItmAmount) || 0,
            ItmYear: Number(item.ItmYear) || 0,
            NoYears: Number(item.NoYears) || 0,
            SameItm: item.SameItm === "" ? true : Boolean(item.SameItm)
          }));
  
          console.log(items);
  
          this.patchbudgetPlannerForm(items);
  
          // this.spinner.hide();
        }
      });
  }
  
  patchbudgetPlannerForm(BOQItems: any){
   console.log(BOQItems);
   this.budgetPlannerForm.patchValue({
    totalNoOfYearsForBudget: BOQItems[0].NoYears
  });
   this.budgetPlannerForm.patchValue({
    isSameCommitmentAndInternalOrder: BOQItems[0].SameItm
  });
   this.budgetPlannerForm.patchValue({
    commitmentItem: BOQItems[0].CommItm
  });
   this.budgetPlannerForm.patchValue({
    internalOrder: BOQItems[0].IntOrd
  });
  this.splittedBudgetDetails = BOQItems.map((item : any) => ({
    year: Number(item.ItmYear) || 0,        // Map ItmYear to year
    commitmentId: item.CommItm || '',       // Map CommItm to commitmentId
    internalOrder: item.IntOrd || '',       // Map IntOrd to internalOrder
    budget: parseFloat(item.ItmAmount) || 0 // Map ItmAmount to budget
  }));
   
  }

  get isSameCommitmentAndInternalOrder$(): Observable<boolean> {
    return this.budgetPlannerForm.controls['isSameCommitmentAndInternalOrder'].valueChanges.pipe(
      startWith(this.budgetPlannerForm.controls['isSameCommitmentAndInternalOrder'].value), // Emit initial value
      map(value => !!value) // Ensure boolean return
    );
  }


   closeBudgetPlannerVisible() {
    this.onBudgetPlannerClosed.emit();
  }

  commitmentChange(commitmentItem: string) {
    this.rfp.getInternalOrders(commitmentItem);
    this.rfp.internalOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (internalOrderList) => {
        this.internalOrderItems = internalOrderList;
      },
    });
  }

  onGeneratePlan() {
    if (this.hasInvalidRequiredFields()) {
      this.budgetPlannerForm.markAllAsTouched();
      return;
    }
    this.bugetSplitter();
  }
  
  private hasInvalidRequiredFields(): boolean {
    return Object.keys(this.budgetPlannerForm.controls).some((key) => {
      const control = this.budgetPlannerForm.get(key);
      return control?.invalid && control?.errors?.['required'];
    });
  }

  bugetSplitter() {
    //* get values from the budget planner form
    const years: number  =
      this.budgetPlannerForm.get('totalNoOfYearsForBudget')?.value ?? 0;
    const isSameCommitmentAndInternalOrder: boolean =
      this.budgetPlannerForm.get('isSameCommitmentAndInternalOrder')?.value ??
      false;
    const commitmentItem: string =
      this.budgetPlannerForm.get('commitmentItem')?.value ?? '';
    const internalOrder: string =
      this.budgetPlannerForm.get('internalOrder')?.value ?? '';

      const totalBudget  = this.budgetDetails.kpiHeading.replace(/SAR/i, '').trim();
      //* total buget / no of years
      let splittedBudget: number = Number((Number(totalBudget) / years).toFixed(2));
      const currentYear: number = new Date().getFullYear();

      

      //* generate the budget for the given number of years
      let splittedBudgetDetails: budgetSplit[] = []

      let consumedBudget = 0
      for(let year = 0; year < years; year++ ){
       
        splittedBudgetDetails.push({year:currentYear + year,
          commitmentId:isSameCommitmentAndInternalOrder ? commitmentItem : '',
          internalOrder:isSameCommitmentAndInternalOrder ? internalOrder : '',
          budget:splittedBudget
        })
        consumedBudget = consumedBudget + splittedBudget
      }

      this.leftOverBudgetdetails.kpiHeading = (Number(totalBudget) - consumedBudget).toFixed(2);

    this.splittedBudgetDetails = splittedBudgetDetails
      
  }

  getConsumedBudget(remainingBudget:number){
    // setTimeout(() => {
      this.leftOverBudgetdetails.kpiHeading = String(remainingBudget)
    // }, 10)
    // // this.cdRef.detectChanges(); 
  }

  getUpdatedsplittedBudgetDetails(budgetDetails:budgetSplit[]){
     this.preparePlannedBudgetToPost(budgetDetails)
     this.updatedSplittedBudgetDetails = budgetDetails

  }

  preparePlannedBudgetToPost(budgetDetails: budgetSplit[]): PlannedBudget {
    let plannedBudget: PlannedBudget = {} as PlannedBudget;
  
    plannedBudget.RfpNo = this.rfpNo;
    plannedBudget.RfpVersion = this.rfpVersion;
    plannedBudget.NoYears = String(this.budgetPlannerForm.get('totalNoOfYearsForBudget')?.value);
    plannedBudget.SameItm = this.budgetPlannerForm.get('isSameCommitmentAndInternalOrder')?.value ? 'T' : 'F'
    
    // Convert budget and year inside budgetSplit to string
    plannedBudget.rfp_budg_itm_dSet = budgetDetails.map(item => ({
      CommItm: item.commitmentId,
      IntOrd: item.internalOrder,
      ItmAmount: String(item.budget),
      ItmYear: String(item.year),
    }));
  
    return plannedBudget;
  }

  postPlannedBudgetToPost(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinner.show()
      this.rfp
      .postRFPBudgetSplit(this.preparePlannedBudgetToPost(this.updatedSplittedBudgetDetails))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.spinner.hide()
          this.cs.createMessage(
              'success',
              this.cs.userLanguage === 'En'
                ? 'RFP Budget plan was saved successfully'
                : 'تم حفظ خطة ميزانية طلب تقديم العروض بنجاح'
            );
            resolve(res);
          },
          error: (err) => {
          this.spinner.hide()
            this.cs.createMessage(
              'error',
              this.cs.userLanguage === 'En' ? 'Something went wrong' : 'حدث خطأ ما'
            );
            reject(err);
          },
        });
    });
  }
  
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
