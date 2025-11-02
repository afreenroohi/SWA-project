import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntil,tap } from 'rxjs/operators';
import { BOQItem, BOQMaster } from 'src/app/pages/RFP/rfp/rfp.model';
import { CommonService } from 'src/app/service/common.service';
import { RFPService } from 'src/app/service/RFP/rfp.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';



interface ItemData {
  id: string;
  name: string;
  age: string;
  address: string;
}

@Component({
  selector: 'app-budget-planner-boq-tabel',
  templateUrl: './budget-planner-boq-tabel.component.html',
  styleUrls: ['./budget-planner-boq-tabel.component.scss'],
})
export class BudgetPlannerBOQTabelComponent implements OnInit {
  @Input() BOQItems!: BOQItem[];
  @Input() BOQItemsMaster!: BOQMaster[];
  @Input() budget!: number;
  @Input() isViewOnlyMode: boolean = false
  @Output() itemUpdated = new EventEmitter<{
    itemName: string;
    quantity: number;
    previousQuantity: number;
    index: number;
  }>();
  @Output() addItem = new EventEmitter<{
    itemName: string;
    quantity: number;
    unit: number;
    index: number;
  }>();
  @Output() addRowToBOQ = new EventEmitter<{ type: string; index: number }>();

  BOQItemNameList: string[] = [];
  totalNoItem: number = 0;
  isError: boolean = false;
  isDuplicateItemSelection: boolean = false
  errorMessage: string = ''
  itemMapWithUnitAndQuantity: Record<
    string,
    { unit: number; quantity: number }
  > = {};

  budgetPlannerBOQColumns: string[] = [
    'RFP.MatDes',
    'RFP.QTY',
    'RFP.Remaining Quantity',
    'RFP.Unit Price',
    'RFP.Total Estimated Price Without VAT',
    'RFP.Total Estimated Price',
    'COM.Action',
  ];
  filteredBudgetPlannerBOQColumns: string[] = [];


  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];
  previousItemName: string = '';
  isActionsAndRemainingQuantityVisible:boolean = false
  isFinTeam: boolean = false
  private readonly destroy$ = new Subject<void>();
  
  constructor(private cs: CommonService, private rfp: RFPService){
    
  }
  ngOnInit(): void {
    console.log(this.cs.getUserData());
    
    this.totalNoItem = this.BOQItemsMaster.length;
    this.BOQItemNameList = this.BOQItemsMaster.map((item) => item.ItemName);
    this.BOQItemsMaster.forEach((item) => {
      this.itemMapWithUnitAndQuantity[item.ItemName] = {
        unit: Number(item.UnitPrice),
        quantity: Number(item.Quantity),
      };
    });
    this.getRFPUserRoleAndDept()
  }

  getRFPUserRoleAndDept(){
    this.rfp.RFPUserRoleAndDept$.pipe(tap(userDetails => console.log('Received user details:', userDetails)),
    takeUntil(this.destroy$)).subscribe({
      next:(isFinteam)=>{
        this.isFinTeam = isFinteam
        console.log(isFinteam);
        
        this.updateFilteredColumns()
        
      },
      error:(err)=>{
        console.warn(err);
      }
    })
  }
  updateFilteredColumns() {
    this.filteredBudgetPlannerBOQColumns = !this.isFinTeam
      ? this.budgetPlannerBOQColumns.filter(col => col !== 'COM.Action' && col !== 'RFP.Remaining Quantity')
      : [...this.budgetPlannerBOQColumns]; // Copy of the original array
  }

  
  startEdit(id: string): void {
    this.editId = id;
    this.previousItemName = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(itemName: string, index: number): void {
    this.addRowToBOQ.emit({ type: 'add', index: index });
  }

  deleteRow(id: string, index: number): void {
    this.addRowToBOQ.emit({ type: 'delete', index: index });
  }

  onItemNameChange(selectedItemName: string): void {
    // Find the item in boqItems by itemName
    this.isUniqueBOQItems(this.BOQItems);
    const selectedItemIndex = this.BOQItems.findIndex(
      (item) => item.itemName === selectedItemName
    );

    if (selectedItemIndex === -1) {
      console.log(`Item '${selectedItemName}' not found in BOQ.`);
      return;
    }

    // Get unit and quantity from itemMap
    const itemDetails = this.itemMapWithUnitAndQuantity[selectedItemName];

    if (!itemDetails) {
      console.log(`Item '${selectedItemName}' not found in itemMap.`);
      return;
    }

    this.addItem.emit({
      index: selectedItemIndex,
      itemName: selectedItemName,
      quantity: itemDetails.quantity,
      unit: itemDetails.unit,
    });
    this.updateErrorMessage()
  }

  emitItemUpdate(itemName: string, quantity: number, index: number): void {
    // Find the BOQ item by name
    const item = this.BOQItems.find((i) => i.itemName === itemName);

    if (item) {
      const previousQuantity = item.previousQuantity ?? 0; // Default to 0 if undefined

      console.log(
        `Updated Item: ${itemName} Quantity: ${quantity} Previous Quantity: ${previousQuantity}`
      );

      // Update the item's previous quantity
      item.previousQuantity = quantity;

      // Emit the event
      this.itemUpdated.emit({ itemName, quantity, previousQuantity, index });
    }
  }

  getTotalBudget(): number {
    let total = this.BOQItems.reduce(
      (sum, item) => sum + (Number(item.totalEstimatedPriceWithVAT) || 0),
      0
    );
    if (total > this.budget) {
      this.isError = true;
    } else {
      this.isError = false;
    }
    this.updateErrorMessage()
    return total;
  }

  isUniqueBOQItems(BOQItems: BOQItem[]) {
    const names = new Set();
    this.isDuplicateItemSelection = false; // Track if duplicates exist

    for (const item of BOQItems) {
      if (names.has(item.itemName)) {
        this.isDuplicateItemSelection = true; // Duplicate found
        break;
      }
      names.add(item.itemName);
    }

    this.updateErrorMessage()
    
  }

  updateErrorMessage() {
    if (this.isError) {
      this.errorMessage = this.cs.userLanguage === 'en' 
        ? 'Note: Total exceeds the allocated Budget' 
        : 'ملاحظة: المجموع يتجاوز الميزانية المخصصة';
    } else if (this.isDuplicateItemSelection) {
      this.errorMessage = this.cs.userLanguage === 'en' 
        ? 'Duplicate items detected in the BOQ!' 
        : 'تم اكتشاف عناصر مكررة في BOQ!';
    } else {
      this.errorMessage = ''; // Clear error message if no errors
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
