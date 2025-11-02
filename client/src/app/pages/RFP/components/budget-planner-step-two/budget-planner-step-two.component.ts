import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  splitedBudget,
  BOQItem,
  BudgetServiceLineItemToPost,
  BudgetServiceLineItem,
  BudgetType,
  BOQMaster,
} from '../../rfp/rfp.model';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-budget-planner-step-two',
  templateUrl: './budget-planner-step-two.component.html',
  styleUrls: ['./budget-planner-step-two.component.scss'],
})
export class BudgetPlannerStepTwoComponent implements OnInit {
  splitedBudget: splitedBudget[] = [];
  BOQMasterData: BOQMaster[] = []
  isPanelActive: boolean = true;
  @Input() rfpNo!: string;
  @Input() rfpVersion!: string;
  @Input() isViewOnlyMode: boolean = false;
  @Output() onSuccessfullBudgetCreation = new EventEmitter<void>();
  errorMessage: string = '';
  totalQuantity: number = 0;
  consumedQuantity: number = 0;
  overAllQuantityDetails!: {
    ItemName: string;
    RemainingQuantity: number;
    TotalQuantity: number;
  }[];

  private readonly destroy$ = new Subject<void>();
  isSaveAsDraft: boolean = true;
  constructor(
    private rfp: RFPService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.getCreatedRFPBudget();
  }

  getCreatedRFPBudget() {
    forkJoin({
      boqItems: this.rfp.getBudgetingItems(this.rfpNo, this.rfpVersion),
      getCreatedRFPBudgetDetails:  this.rfp
      .getCreatedRFPBudgetDetails(this.rfpNo, this.rfpVersion)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next:({boqItems,getCreatedRFPBudgetDetails})=>{
        //* master BOQ item data
        this.BOQMasterData = boqItems.results
 
        //* getting already created Budget data
        if (getCreatedRFPBudgetDetails.results.length === 0) {
          this.loadBudgetingData();
        }
        console.log(this.transformBudgetData(getCreatedRFPBudgetDetails.results));
        this.splitedBudget = this.transformBudgetData(getCreatedRFPBudgetDetails.results);
        this.getTotalQuantityAndRemainingQuantity(
          getCreatedRFPBudgetDetails.results,
          'pendingBudget'
        );
      }
    })
   
  }

  loadBudgetingData() {
    forkJoin({
      boqItems: this.rfp.getBudgetingItems(this.rfpNo, this.rfpVersion),
      splittedBudgetItems: this.rfp.getSplittedBudgetingItems(
        this.rfpNo,
        this.rfpVersion
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ boqItems, splittedBudgetItems }) => {
          console.log('BOQ Items:', boqItems);
          console.log('Splitted Budget Items:', splittedBudgetItems);

          // Now you can transform the data
          this.splitedBudget = this.transformToSplittedBudget(
            boqItems.results,
            splittedBudgetItems.results
          );
          this.getTotalQuantityAndRemainingQuantity(
            boqItems.results,
            'NewBudget'
          );

          console.log('Transformed Data:', this.splitedBudget);
        },
        error: (err) => {
          console.error('Error loading budgeting data:', err);
        },
      });
  }

  transformBudgetData(data: any[]): splitedBudget[] {
    const groupedData: { [key: string]: splitedBudget } = {};

    data.forEach((item) => {
      const key = `${item.BudYear}-${item.CommItm}-${item.IntOrd}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          year: item.BudYear,
          committeItem: item.CommItm.replace(/^0+/, ''), // Remove leading zeros
          internalOrder: item.IntOrd.replace(/^0+/, ''), // Remove leading zeros
          budgetWithVAT: parseFloat(item.BudVat.trim()) || 0,
          BOQItems: [],
        };
      }

      groupedData[key].BOQItems.push({
        itemName: item.ItemName,
        previousQuantity: 0, // Assuming no previous quantity in the current dataset
        quantity: parseFloat(item.Quantity.trim()) || 0,
        remainingQuantity: parseFloat(item.RemQuan.trim()) || 0,
        estUnitPrice: parseFloat(item.UnitPrice.trim()) || 0,
        totalEstimatedPriceWithoutVAT: parseFloat(item.TotPriWoVat.trim()) || 0,
        totalEstimatedPriceWithVAT: parseFloat(item.TotPriVat.trim()) || 0,
      });
    });

    return Object.values(groupedData);
  }

  getTotalQuantityAndRemainingQuantity(
    itemsArray: any[],
    budgetType: BudgetType
  ) {
    const groupedItems = itemsArray.reduce((acc, item) => {
      const itemName = item.ItemName;
      const quantity = parseFloat(item.Quantity.trim());
      const remQuan = parseFloat(item.RemQuan.trim());

      if (!acc[itemName]) {
        acc[itemName] = {
          ItemName: itemName,
          TotalQuantity: 0,
          RemainingQuantity: remQuan,
          isRemQuanAdded: false,
        };
      }
      if (budgetType === 'NewBudget') {
        acc[itemName].TotalQuantity = remQuan;
        acc[itemName].RemainingQuantity = 0;
      } else if (budgetType === 'pendingBudget') {
        acc[itemName].TotalQuantity += quantity;

        if (!acc[itemName].isRemQuanAdded) {
          acc[itemName].TotalQuantity += remQuan;
          acc[itemName].isRemQuanAdded = true; // Ensure remQuan is added only once
        }
        acc[itemName].RemainingQuantity = remQuan;
      }

      return acc;
    }, {} as Record<string, { ItemName: string; TotalQuantity: number; RemainingQuantity: number }>);

    // Convert to array
    const result = Object.values(groupedItems) as {
      ItemName: string;
      RemainingQuantity: number;
      TotalQuantity: number;
    }[];

    console.log(result);

    this.overAllQuantityDetails = result;
  }

  onQuantityUpdated(event: any, index: number) {
    // console.log(
    //   'Updated Item:',
    //   event.itemName,
    //   'Quantity:',
    //   event.quantity,
    //   'previousQuantity:',
    //   event.previousQuantity,
    //   event.index
    // );
    this.splitedBudget.forEach((budget) => {
      budget.BOQItems.forEach((item) => {
        if (item.itemName === event.itemName) {
          let getTotalQuantityForAnSelecteditem =
            this.overAllQuantityDetails.find(
              (quantitydetail) => quantitydetail.ItemName === event.itemName
            );
          const totalQuantityForSelectedItem = this.splitedBudget.reduce(
            (sum, budget) => {
              return (
                sum +
                budget.BOQItems.filter(
                  (item) => item.itemName === event.itemName
                ) // Only consider matching items
                  .reduce((itemSum, item) => itemSum + Number(item.quantity), 0)
              ); // Convert to number before summing
            },
            0
          );

          // Adjust the remaining quantity
          item.remainingQuantity = Math.max(
            0,
            getTotalQuantityForAnSelecteditem!.TotalQuantity -
              totalQuantityForSelectedItem
          );
        }
      });
    });

    const budget = this.splitedBudget[index]; // Accessing the correct budget using the index
    if (budget && budget.BOQItems[event.index]) {
      const item = budget.BOQItems[event.index];
      // Update total estimated prices
      item.totalEstimatedPriceWithoutVAT = item.estUnitPrice * event.quantity;
      item.totalEstimatedPriceWithVAT =
        item.totalEstimatedPriceWithoutVAT * 1.15; // Adding 15% VAT
    }
    console.log(this.splitedBudget);
  }
  onUpdatedBOQ(event: any, index: number) {
    if (event.type === 'add') {
      const newItem: BOQItem = {
        itemName: '',
        estUnitPrice: 0,
        quantity: 0,
        previousQuantity: 0,
        remainingQuantity: 0,
        totalEstimatedPriceWithoutVAT: 0,
        totalEstimatedPriceWithVAT: 0,
      };

      const budget = this.splitedBudget[index];
      if (budget) {
        // Create a new array reference
        budget.BOQItems = [...budget.BOQItems, newItem];
      }
    } else if (event.type === 'delete') {
      const budget = this.splitedBudget[index];
      if (budget && budget.BOQItems.length > event.index) {
        // Create a new array reference without the item at event.index
        budget.BOQItems = budget.BOQItems.filter((_, i) => i !== event.index);
      }
    }

    this.cdr.detectChanges();
  }

  onAddBOQItem(event: any, index: number) {
    console.log(
      'Updated Item:',
      event.itemName,
      'Quantity:',
      event.quantity,
      'previousQuantity:',
      event.unit,
      event.index
    );
    this.splitedBudget[index].BOQItems[event.index].estUnitPrice = event.unit;
    this.splitedBudget[index].BOQItems[event.index].remainingQuantity =
      event.quantity;

    console.log(this.splitedBudget);
  }

  transformToSplittedBudget(
    boqItemsArray: any[],
    budgetItemsArray: any[]
  ): splitedBudget[] {
    return budgetItemsArray.map((budgetItem) => {
      // Filter BOQ items that match the RfpNo and RfpVersion
      const relatedBOQItems: BOQItem[] = boqItemsArray.map((boqItem) => ({
        itemName: boqItem.ItemName || '',
        previousQuantity: Number(boqItem.Quantity) || 0,
        quantity: 0,
        remainingQuantity: Number(boqItem.RemQuan) || 0, // Assuming same as quantity
        estUnitPrice: parseFloat(boqItem.UnitPrice) || 0,
        totalEstimatedPriceWithoutVAT: parseFloat(boqItem.TotPriWoVat) || 0,
        totalEstimatedPriceWithVAT: parseFloat(boqItem.TotPriVat) || 0,
      }));

      return {
        year: budgetItem.ItmYear || '',
        committeItem: budgetItem.CommItm || '',
        internalOrder: budgetItem.IntOrd || '',
        budgetWithVAT: parseFloat(budgetItem.ItmAmount) || 0,
        BOQItems: relatedBOQItems,
      };
    });
  }

  transformToBudgetServiceLineItemToPost(
    budgetArray: splitedBudget[]
  ): BudgetServiceLineItemToPost {
    let Rfp_budg_srv_itm_fin: BudgetServiceLineItem[] = [];

    budgetArray.forEach((budget) => {
      budget.BOQItems.forEach((item, itemIndex) => {
        Rfp_budg_srv_itm_fin.push({
          RfpNo: this.rfpNo,
          RfpVersion: this.rfpVersion,
          ItemName: item.itemName,
          Quantity: item.quantity.toString(),
          RemQuan: item.remainingQuantity.toString(),
          UnitPrice: item.estUnitPrice.toString(),
          TotPriVat: item.totalEstimatedPriceWithoutVAT.toString(),
          TotPriWoVat: item.totalEstimatedPriceWithVAT.toString(),
          BudYear: budget.year,
          CommItm: budget.committeItem,
          IntOrd: budget.internalOrder,
          BudVat: budget.budgetWithVAT.toString(),
          SaveDraft: this.isSaveAsDraft ? 't' : 'f',
          ItemNo: (itemIndex + 1).toString().padStart(5, '0'), // Ensures NUMC 5 format
        });
      });
    });

    return {
      RfpNo: this.rfpNo,
      RfpVersion: this.rfpVersion,
      Rfp_budg_srv_itm_fin, // Correctly assigning mapped values
    };
  }

  postBudgetServiceLineItem() {
    this.spinner.show();
    this.rfp
      .PostRFPBudget(
        this.transformToBudgetServiceLineItemToPost(this.splitedBudget)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.rfp.setCanGetBudgetdetailsState(true);
          this.spinner.hide();
          this.cs.createMessage(
            'success',
            this.cs.userLanguage === 'En'
              ? 'RFP Budget was saved successfully'
              : 'تم حفظ ميزانية طلب تقديم العروض بنجاح'
          );
          this.onSuccessfullBudgetCreation.emit();
          console.log(res);
        },
        error: (err) => {
          this.rfp.setCanGetBudgetdetailsState(false);
          this.spinner.hide();
          this.cs.createMessage(
            'error',
            this.cs.userLanguage === 'En'
              ? 'Something went wrong'
              : 'حدث خطأ ما'
          );
          this.onSuccessfullBudgetCreation.emit();

          console.log(err);
        },
      });
    // console.log(this.transformToServiceLineItems(this.splitedBudget));
  }

  checkErrorsInBudgeting() {
    this.errorMessage = '';
    this.isPanelActive = true; // Assume no errors initially

    const yearsWithRemainingQuantity: Set<string> = new Set();
    const duplicateItems: string[] = [];

    this.splitedBudget.forEach((budget) => {
      const itemNames = new Set<string>();

      budget.BOQItems.forEach((item) => {
        if (item.remainingQuantity !== 0) {
          yearsWithRemainingQuantity.add(budget.year);
        }

        // Check for duplicate items
        if (itemNames.has(item.itemName)) {
          duplicateItems.push(`${item.itemName} (${budget.year})`);
        } else {
          itemNames.add(item.itemName);
        }
      });
    });

    let errorMessages: string[] = [];

    // Check for remaining quantities
    if (yearsWithRemainingQuantity.size > 0) {
      const yearsList = Array.from(yearsWithRemainingQuantity).join(', ');
      errorMessages.push(
        this.cs.userLanguage === 'en'
          ? `Error: BOQ items from the following years have remaining quantities yet to be consumed: ${yearsList}.`
          : `خطأ: لا تزال هناك كميات متبقية لم يتم استهلاكها من بنود BOQ للأعوام التالية: ${yearsList}.`
      );
    }

    // Check for duplicate items
    if (duplicateItems.length > 0) {
      const duplicateList = duplicateItems.join(', ');
      errorMessages.push(
        this.cs.userLanguage === 'en'
          ? `Error: Duplicate items found - ${duplicateList}.`
          : `خطأ: تم العثور على عناصر مكررة - ${duplicateList}.`
      );
    }

    // Apply error messages
    if (errorMessages.length > 0) {
      this.errorMessage = errorMessages.join(' ');
      this.isPanelActive = false;
    }
  }

  checkForErrosAndPostBudgetDetails(isSaveAsDraft: boolean) {
    this.isSaveAsDraft = isSaveAsDraft;

    if (isSaveAsDraft) {
      this.postBudgetServiceLineItem();
      return; // Stop further execution
    }

    this.checkErrorsInBudgeting();

    // Proceed only if there's no error message
    if (!this.errorMessage) {
      this.postBudgetServiceLineItem();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
