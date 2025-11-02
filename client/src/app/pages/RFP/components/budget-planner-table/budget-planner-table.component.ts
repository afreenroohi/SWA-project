import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  CommitmentItem,
  InternalOrder,
  KPIDetails,
  budgetSplit,
} from 'src/app/pages/RFP/rfp/rfp.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { CommonService } from 'src/app/service/common.service';

interface ItemData {
  id: string;
  name: string;
  age: string;
  address: string;
}

@Component({
  selector: 'app-budget-planner-table',
  templateUrl: './budget-planner-table.component.html',
  styleUrls: ['./budget-planner-table.component.scss'],
})
export class BudgetPlannerTableComponent implements OnChanges {
  @Input() splittedBudgetDetails: budgetSplit[] = [];
  @Input() commitmentItems!: CommitmentItem[];
  @Input() isSameCommitmentAndInternalOrder!: Observable<boolean>;
  @Input() totalBudget!: string;
  @Output() consumedBudget = new EventEmitter<number>();
  @Output() updatedsplittedBudgetDetails = new EventEmitter<budgetSplit[]>();
  internalOrderItems!: InternalOrder[];
  isBudgetAllocationExcceds: boolean = false;
  isCommitmentItemsEmpty: boolean = false;
  errorMessage: string = '';
  

  budgetPlannerColumns: string[] = [
    'RFP.Year',
    'contract.create.Commitment Item',
    'RFP.Internal Order',
    'RFP.Budget with VAT(SAR)',
  ];
  private readonly destroy$ = new Subject<void>();

  i = 0;
  editId!: number;
  listOfData: ItemData[] = [];

  constructor(private rfp: RFPService, private cs: CommonService) {}

  // ngOnInit(): void {
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['splittedBudgetDetails']) {
      // this.initalvalidationCheck();
      // this.rfp.setBudgetPlannerErrorState(false);
      this.checkIsBudgetConsumed(this.getTotalBudget())
    this.checkIsCommitmentItemIsFilled()
    }
  }

  initalvalidationCheck() {
    const isSomeCommitmentItemisEmpty = this.splittedBudgetDetails.some(
      (item) => item.commitmentId === ''
    );
    if (isSomeCommitmentItemisEmpty) {
      this.isBudgetAllocationExcceds = true;
      this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds, this.isCommitmentItemsEmpty);
      this.cs.userLanguage === 'en'
      ? 'Note: Please consume the total budget to proceed'
      : 'ملاحظة: يرجى استهلاك الميزانية الإجمالية للمتابعة';
      console.log(isSomeCommitmentItemisEmpty);
      
    }else{
      this.errorMessage = ''
      this.isBudgetAllocationExcceds = false;
      this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds, this.isCommitmentItemsEmpty);
      console.log(isSomeCommitmentItemisEmpty);
    }
  }

  startEdit(id: number, commitmentId: string): void {
    this.editId = id;
    this.updateCommitment(id, commitmentId);
  }

  stopEdit(): void {
    this.editId = 0;
  }

  updateCommitment(year: number, commitmentItem: string): void {
    const index = this.splittedBudgetDetails.findIndex(
      (budget) => budget.year === year
    );
    if (index !== -1) {
      this.splittedBudgetDetails[index].commitmentId = commitmentItem;
    }
    this.rfp.getInternalOrders(commitmentItem);
    this.rfp.internalOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (internalOrderList) => {
        this.internalOrderItems = internalOrderList;
      },
    });
    this.checkIsCommitmentItemIsFilled()
    // this.checkIsBudgetConsumed(this.getTotalBudget())


  }
  onSplittedBudgetUpdate(){
    this.checkIsBudgetConsumed(this.getTotalBudget())
    // this.checkIsCommitmentItemIsFilled()
  }
  onSplittedBudgetEditKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.onSplittedBudgetUpdate();
    }
  }
  updateInternalOrder(year: number, newValue: string): void {
    const index = this.splittedBudgetDetails.findIndex(
      (budget) => budget.year === year
    );
    if (index !== -1) {
      this.splittedBudgetDetails[index].internalOrder = newValue;
    }
  }

  checkIsCommitmentItemIsFilled() {
    // this.errorMessage = '';
    let hasError = false;

    for (let item of this.splittedBudgetDetails) {
      if (!item.commitmentId) {
        // Check for empty or undefined
        hasError = true;
        this.errorMessage =
          this.cs.userLanguage === 'en'
            ? 'Please fill the Commitment ID to proceed.'
            : 'يرجى ملء معرف الالتزام للمتابعة';
        break; // Exit loop on first error
      }
    }
    this.isCommitmentItemsEmpty = hasError;
    this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds,this.isCommitmentItemsEmpty);
  }

  checkIsBudgetConsumed(total: number){
    // Calculate remaining budget
    let remainingBudget = parseFloat(
      (Number(this.totalBudget) - total).toFixed(2)
    );
    // Emit remaining budget only if it's valid
    this.consumedBudget.emit(remainingBudget);

    // Check if total exceeds available budget
    if (total > Number(this.totalBudget)) {
      this.isBudgetAllocationExcceds = true;
      this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds, this.isCommitmentItemsEmpty);
      this.errorMessage =
        this.cs.userLanguage === 'en'
          ? 'Note: The total budget allocation exceeds the available budget.'
          : 'ملاحظة: يتجاوز إجمالي تخصيص الميزانية الميزانية المتاحة';

      // return total; // Stop execution without emitting
    }else if(total < Number(this.totalBudget)){
      this.isBudgetAllocationExcceds = true;

      this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds, this.isCommitmentItemsEmpty);
      this.errorMessage =
      this.cs.userLanguage === 'en'
      ? 'Note: Please consume the total budget to proceed'
      : 'ملاحظة: يرجى استهلاك الميزانية الإجمالية للمتابعة';
    } else if(total === Number(this.totalBudget)){
    this.errorMessage = '';
    this.isBudgetAllocationExcceds = false;

      this.rfp.setBudgetPlannerErrorState(this.isBudgetAllocationExcceds, this.isCommitmentItemsEmpty);
    }

    // Emit updated budget details
    this.updatedsplittedBudgetDetails.emit(this.splittedBudgetDetails);
  }

  getTotalBudget(): number {
    // this.errorMessage = '';
    const total = this.splittedBudgetDetails.reduce(
      (sum, item) => sum + (Number(item.budget)),
      0
    );

    
    return total;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
