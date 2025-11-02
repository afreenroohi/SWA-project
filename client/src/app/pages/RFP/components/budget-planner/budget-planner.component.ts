import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CommitmentItem,
  InternalOrder,
  KPIDetails,
  budgetSplit
} from 'src/app/pages/RFP/rfp/rfp.model';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { TranslateService } from '@ngx-translate/core';
import {BudgetPlannerStepOneComponent} from '../budget-planner-step-one/budget-planner-step-one.component'
import {BudgetPlannerStepTwoComponent} from '../budget-planner-step-two/budget-planner-step-two.component'


@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss'],
})
export class BudgetPlannerComponent implements OnInit {
  @Input() isBudgetPlannerVisible: boolean = false;
  @Input() budgetDetails!: KPIDetails;
  @Input() rfpNo!: string;
  @Input() rfpVersion!: string;
  @Output() onBudgetPlannerClosed = new EventEmitter<void>();
  @ViewChild(BudgetPlannerStepOneComponent) budgetplanner!: BudgetPlannerStepOneComponent;
  @ViewChild(BudgetPlannerStepTwoComponent) budgetEditor!: BudgetPlannerStepTwoComponent;
  isNextStepButtonDisabled: boolean = false

  private readonly destroy$ = new Subject<void>();

  
  currentStep = 1; // Start with Container 1


  constructor(private rfp: RFPService, private translate: TranslateService,) {}

  ngOnInit(): void {
   this.budgetPlannerFormerrorChecker()
  }

  budgetPlannerFormerrorChecker(){
    this.rfp.budjetPlannerErrorState$.pipe(takeUntil(this.destroy$)).subscribe((errorState) => {
      console.log(errorState);
      this.isNextStepButtonDisabled = !(errorState.isBudgetConsumed === false && errorState.isCommitmentIdFilled === false);
    });
  }

  closeBudgetPlannerVisible() {
    this.onBudgetPlannerClosed.emit();
  }

  
  async nextStep() {
    try {
      await this.budgetplanner.postPlannedBudgetToPost();
      if (this.currentStep < 2) {
        this.currentStep++;
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  }
  
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

saveAsDraftBudgetPlan(){
  this.budgetplanner.postPlannedBudgetToPost();
}
saveAsDraftBudget(){
  this.budgetEditor.checkForErrosAndPostBudgetDetails(true)
}
createBudget(){
  this.budgetEditor.checkForErrosAndPostBudgetDetails(false)
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
