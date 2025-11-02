import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import {
  ContractCreationDetails,
  PRList,
  SERVICE_LINE_ITEM,
} from '../../contract.model';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  caseStatus,
  dtypes,
  ptypes,
  durationTypes,
} from 'src/app/shared/shared';
import { CommonService } from 'src/app/service/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FinalPopupComponent } from 'src/app/components/final-popup/final-popup.component';
import { MessageType } from 'src/app/components/common.model';


@Component({
  selector: 'app-contract-creation-form',
  templateUrl: './contract-creation-form.component.html',
  styleUrls: ['./contract-creation-form.component.scss'],
})
export class ContractCreationFormComponent implements OnInit {
  expandIconPosition: 'left' | 'right' = 'right';
  PRList: PRList[] = [];
  editId: string | null = null;
  selectedPR: string = '';
  selectedRFP: string = '';
  serviceLineItemColumns: string[] = SERVICE_LINE_ITEM;
  durationTypes = durationTypes;
  contractCreationDetails: ContractCreationDetails = {
    GrossPrice: '',
    SupplierName: '', // Added
    CompCodeDesc: '', // Added
    PurchaseRequest: '',
    PurchaseGrpname: '', // Added
    ContPerdUnit: '',
    Supplier: '',
    PurchaseOrg: '',
    PurchaseGrp: '',
    AgreementDt: '',
    AgreementType: '',
    TargetValue: '',
    ValStDate: null,
    ContPeriod: '',
    ValEndDate: null,
    ReferenceNo: '',
    CompCode: '',
    Item_overview: { results: [] },
    Service_line_item: { results: [] },
    Account_Assignment: { results: [] },
  };

  isTargetValueExceeded: boolean = false;
  groupedByYearArray: {
    year: string;
    accountAssignments: any[];
    itemOverviews: any[];
    serviceLineItems: any[];
  }[] = [];
  constructor(
    private contract: ContractService,
    private spinner: NgxSpinnerService,
    public cs: CommonService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.fetchPRList()
  }

  fetchPRList() {
    this.spinner.show();
    this.contract.getPRList().subscribe({
      next: (res) => {
        this.spinner.hide();
        console.log(res);

        this.PRList = res;
        this.selectedPR = this.PRList[0].PurchaseRequest;
        this.selectedRFP = this.PRList[0].RfpNo;
        this.onSelectedPRChange();
      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  onSelectedPRChange(PRNumber?: string) {
    this.spinner.show();

    if (PRNumber) {
      const selectedIndex = this.PRList.findIndex(
        (pr) => pr.PurchaseRequest === PRNumber
      );
      this.selectedRFP = this.PRList[selectedIndex].RfpNo;
    }

    this.contract.detailsForContractCreation(this.selectedPR).subscribe({
      next: (res: any) => {
        this.contractCreationDetails = res[0];
        console.log(this.contractCreationDetails);
        const yearMap: { [key: string]: any } = {};

        this.contractCreationDetails.Account_Assignment.results.forEach((item: any) => {
          const year = item.Year;
          if (!yearMap[year]) {
            yearMap[year] = {
              year,
              accountAssignments: [],
              itemOverviews: [],
              serviceLineItems: []
            };
          }
          yearMap[year].accountAssignments.push(item);
        });

        this.contractCreationDetails.Item_overview.results.forEach((item: any) => {
          const year = item.Year;
          if (!yearMap[year]) {
            yearMap[year] = {
              year,
              accountAssignments: [],
              itemOverviews: [],
              serviceLineItems: []
            };
          }
          yearMap[year].itemOverviews.push(item);
        });

        this.contractCreationDetails.Service_line_item.results.forEach((item: any) => {
          
          const year = item.Year;
          if (!yearMap[year]) {
            yearMap[year] = {
              year,
              accountAssignments: [],
              itemOverviews: [],
              serviceLineItems: []
         
            };
            item.NetValue = Number(item.SrQuan || 0) * Number(item.GrossPrice || 0);
          }
          yearMap[year].serviceLineItems.push(item);
        });
        this.groupedByYearArray = Object.values(yearMap);
        console.log(this.groupedByYearArray)
        this.isTargetValueExceeded = false

        this.spinner.hide();

        this.contractCreationDetails.ValStDate = new Date();

        this.calculateContractEndDate();
        this.targetValueExceedCheck()

      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  parseDate(dateString: string): Date | null {
    if (dateString) {
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is 0-based
      const day = parseInt(dateString.substring(6, 8), 10);
      return new Date(year, month, day);
    }
    return null;
  }

  // Previous logic - not used anymore because we wanted to calculate based on year
  // onGrossPriceChange(value: string, index: number) {
  //   if (
  //     !this.contractCreationDetails ||
  //     !this.contractCreationDetails.Service_line_item ||
  //     !this.contractCreationDetails.Service_line_item.results
  //   ) {
  //     console.error('Missing data in contractCreationDetails');
  //     return;
  //   }

  //   let totalNetPrice =
  //     this.contractCreationDetails.Service_line_item.results.reduce(
  //       (accumulator, item) =>
  //         accumulator + Number(item.GrossPrice) * Number(item.SrQuan),
  //       0
  //     );

  //   let selectedQuantity = Number(
  //     this.contractCreationDetails.Service_line_item.results[index]?.SrQuan || 0
  //   );
  //   let selectedGrossPrice = Number(
  //     this.contractCreationDetails.Service_line_item.results[index]
  //       ?.GrossPrice || 0
  //   );

  //   totalNetPrice -= selectedGrossPrice * selectedQuantity;
  //   let selectedItemTotal = selectedQuantity * selectedGrossPrice;

  //   totalNetPrice += selectedItemTotal;

  //   if (this.contractCreationDetails?.Item_overview?.results?.length > 0) {
  //     this.contractCreationDetails.Item_overview.results[0].NetPrice =
  //       totalNetPrice.toString();
  //   }

  //   this.validateDecimalInput(value, index)
  //   this.targetValueExceedCheck()

  // }

  onGrossPriceChange(value: string, year: string, index: number) {
    if (
      !this.contractCreationDetails ||
      !this.contractCreationDetails.Service_line_item ||
      !this.contractCreationDetails.Service_line_item.results
    ) {
      console.error('Missing data in contractCreationDetails');
      return;
    }
    const group = this.groupedByYearArray.find((g) => g.year === year);
    if (!group) return;

    const item = group.serviceLineItems[index];
    if (!item) return;

    const quantity = Number(item.SrQuan || 0);
    const grossPrice = Number(value || 0);
    item.GrossPrice = grossPrice.toFixed(3);
    item.NetValue = (quantity * grossPrice).toFixed(3);

    // Recalculate NetPrice for this year group
    const totalNetPrice = group.serviceLineItems.reduce((sum, itm) => {
      const q = Number(itm.SrQuan || 0);
      const g = Number(itm.GrossPrice || 0);
      return sum + (q * g);
    }, 0);

    const overviewItem = this.contractCreationDetails.Item_overview?.results
      ?.find((o: any) => o.Year === year);
    if (overviewItem) {
      overviewItem.NetPrice = totalNetPrice.toFixed(3);
    }

    this.validateDecimalInput(value, year, index);
    this.targetValueExceedCheck();
  }

  // Previous logic - not used anymore because we wanted to calculate based on year
  // targetValueExceedCheck() {
  //   // Step 1: Calculate 15% of TargetValue
  //   let netValueWithTax = parseFloat((Number(this.contractCreationDetails.Item_overview.results[0].NetPrice) * 1.15).toFixed(3)); // Adds 15% tax and limits to 3 decimals
  //   // Step 2: Compare totalGrossPrice with TargetValue + 15% tax

  //   if (netValueWithTax > Number(this.contractCreationDetails.TargetValue)) {
  //     this.isTargetValueExceeded = true;
  //   } else {
  //     this.isTargetValueExceeded = false;
  //   }
  // }
  targetValueExceedCheck() {
    // Step 1: Sum NetPrice from all year groups' itemOverviews
    let totalNetPrice = 0;

    this.groupedByYearArray.forEach(group => {
      const itemOverview = group.itemOverviews[0];
      if (itemOverview && itemOverview.NetPrice) {
        totalNetPrice += Number(itemOverview.NetPrice || 0);
      }
    });

    // Step 2: Apply 15% VAT
    const netValueWithTax = parseFloat((totalNetPrice * 1.15).toFixed(3));

    // Step 3: Compare with TargetValue
    const targetValue = Number(this.contractCreationDetails.TargetValue || 0);

    this.isTargetValueExceeded = netValueWithTax > targetValue;
  }


  calculateContractEndDate() {
    const currentDate = new Date(); // Get today's date
    const durationValue = Number(this.contractCreationDetails.ContPeriod); // Number input (e.g., 5)
    const durationUnit = this.contractCreationDetails.ContPerdUnit; // Selected unit (e.g., "Day", "Month", etc.)

    let resultDate = new Date(currentDate); // Clone current date

    switch (durationUnit) {
      case 'D':
        resultDate.setDate(resultDate.getDate() + durationValue);
        break;
      case 'W':
        resultDate.setDate(resultDate.getDate() + durationValue * 7);
        break;
      case 'M':
        resultDate.setMonth(resultDate.getMonth() + durationValue);
        break;
      case 'Y':
        resultDate.setFullYear(resultDate.getFullYear() + durationValue);
        break;
      default:
        console.warn('Invalid unit selected');
    }

    this.contractCreationDetails.ValEndDate = resultDate;
  }

  onContractCreationSubmit() {
    this.spinner.show();
    let dataToPost = this.PrepareContractDetailsToPost();
    this.contract.createContract(dataToPost).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.fetchPRList()
        if (this.cs.userLanguage === 'en') {
          if(res.d.MessageId !== 'E'){
            this.userAlertAfterContractCreationModel(res.d.MessageEn ? res.d.MessageEn : 'Contract Created successfully', MessageType.Success)
          }else{
            this.userAlertAfterContractCreationModel(res.d.MessageEn ? res.d.MessageEn : 'Something went wrong' , MessageType.Error)        
          }
      } else {
        if(res.d.MessageId !== 'E'){
          this.userAlertAfterContractCreationModel(res.d.MessageAr ? res.d.MessageAr : 'تم إنشاء العقد بنجاح', MessageType.Success)
        }else{
          this.userAlertAfterContractCreationModel(res.d.MessageAr ? res.d.MessageAr : 'حدث خطأ ما' , MessageType.Error)
        }
      }
    },
    error: (err) => {
      this.spinner.hide();
      if (this.cs.userLanguage !== 'en') {
          this.userAlertAfterContractCreationModel(err.d.MessageEn ? err.d.MessageEn : 'Something went wrong' , MessageType.Error)        
        } else {
          this.userAlertAfterContractCreationModel(err.d.MessageAr ? err.d.MessageAr : 'حدث خطأ ما' , MessageType.Error)
        }
      },
    });
  }

  // !better to have same struct to send as same as recived, refactor needed in both forntend and backend
  PrepareContractDetailsToPost() {
    const omitUnwantedFieldsInContractDetails = (details: any[]) => {
      return details.map((detail) => {
        const { __metadata, PR_Header, ...rest } = detail; // Exclude unwanted fields
        return rest;
      });
    };

    // Create a new formatted object instead of modifying `this.contractCreationDetails`
    const formattedContractDetails = {
      ...this.contractCreationDetails,
      ValEndDate: this.contractCreationDetails.ValEndDate
        ? new Date(this.contractCreationDetails.ValEndDate).toLocaleDateString(
            'de-DE',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }
          )
        : null,
      ValStDate: this.contractCreationDetails.ValStDate
        ? new Date(this.contractCreationDetails.ValStDate).toLocaleDateString(
            'de-DE',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }
          )
        : null,

      Item_overview: this.contractCreationDetails.Item_overview?.results
        ? omitUnwantedFieldsInContractDetails(
            this.contractCreationDetails.Item_overview.results
          )
        : [],
      Service_line_item: this.contractCreationDetails.Service_line_item?.results
        ? omitUnwantedFieldsInContractDetails(
            this.contractCreationDetails.Service_line_item.results
          )
        : [],
      Account_Assignment: this.contractCreationDetails.Account_Assignment
        ?.results
        ? omitUnwantedFieldsInContractDetails(
            this.contractCreationDetails.Account_Assignment.results
          )
        : [],
    };
    delete (formattedContractDetails.Item_overview[0] as any).OrdUnit;

    console.log(formattedContractDetails);
    return formattedContractDetails; // Return the new formatted object
  }

  restrictToOnlyNumbers(event: any) {
    const inputValue = event.target.value;
    // Remove any non-numeric characters
    event.target.value = inputValue.replace(/[^0-9]/g, '');
  }

  // Previous logic - not used anymore because we wanted to calculate based on year
  // validateDecimalInput(value: string, index: number): void {
  //   // Allow only numbers with up to 2 decimal places
  //   const validValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except '.'

  //   // Ensure only one decimal point
  //   const parts = validValue.split('.');
  //   if (parts.length > 2) {
  //     this.contractCreationDetails.Service_line_item.results[index]
  //       .GrossPrice  = parts[0] + '.' + parts[1]; // Keep only the first decimal part
  //   } else {
  //     this.contractCreationDetails.Service_line_item.results[index]
  //       .GrossPrice = validValue;
  //   }
  // }

  validateDecimalInput(value: string, year: string, index: number): void {
    const group = this.groupedByYearArray.find((g) => g.year === year);
    if (!group) return;

    const item = group.serviceLineItems[index];
    if (!item) return;

    const validValue = value.replace(/[^0-9.]/g, '');
    const parts = validValue.split('.');

    if (parts.length > 2) {
      item.GrossPrice = parts[0] + '.' + parts[1];
    } else {
      item.GrossPrice = validValue;
    }
  }
  
  restrictToNumbers(event: KeyboardEvent, value: string): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  
    // Allow backspace, delete, arrows, and tab
    if (allowedKeys.includes(event.key)) {
      return;
    }
  
    // Prevent multiple decimal points
    if (event.key === '.' && value.includes('.')) {
      event.preventDefault();
      return;
    }
  
    // Allow only numbers and a single decimal point
    if (!/^[0-9.]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  userAlertAfterContractCreationModel(popUpMessage: string, messgaeType: MessageType){
    this.modalService.create({
      
      nzContent: FinalPopupComponent, 
      nzComponentParams: { message: popUpMessage, messageType: messgaeType },
      

    });
  }
  
  
}
