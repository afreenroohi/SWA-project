import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IconList } from 'src/app/components/icon/icon.component';
import { ApiService } from 'src/app/service/RFP/api.service';
import { CommonService } from 'src/app/service/common.service';
import { COCService } from '../coc.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommaSeparatePipe } from 'src/app/pipes/comma-separate.pipe';
import { PODetailsList, SERVICE_PO_CODE } from '../coc.model';
import { TranslateService } from '@ngx-translate/core';

interface ContractList {
  SiNo: number,
  Contract: string,
  DocumentNo: string,
  VendorName: string,
  PrNo: string,
  ProfitCenter: string,
  ProjName: string,
  RfpNo: string
}

interface ContractDetailsList {
  SiNo: number,
  ContractNumber: string,
  ContractItemNumber: string,
  VendorName: string,
  PoNumber: string,
  PoItemNumber: string,
  PoItemDesc: string,
  checked: boolean
}

@Component({
  selector: 'app-coc-with-contract',
  templateUrl: './coc-with-contract.component.html',
  styleUrls: ['./coc-with-contract.component.scss']
})
export class CocWithContractComponent implements OnInit, OnDestroy {

  // * List Variables
  openContract: ContractList[] = [];
  displayOpenContract: ContractList[] = [];
  openPoWithoutContract: ContractList[] = [];
  displayOpenPoWithoutContract: ContractList[] = [];
  contractDetailsList: ContractDetailsList[] = [];
  displayContractDetailsList: ContractDetailsList[] = [];
  poDetailsList: PODetailsList[] = [];


  // * Conditional Variables
  showContractDetailsList = false;
  showPODetailsList = false;
  isPODetailsSelected = false;

  // * Store Variables
  selectedDepartmentName = '';
  selectedProjectName = '';
  docNumber = '';
  docType: 'CONTRACT' | 'PO' | '' = '';

  // * Control Variable
  selectedTabIndex = 0;

  // * Search Object
  openContractSearchObject = this.getOpenContractSearchObject;
  openPOSearchObject = this.getOpenPOSearchObject;


  // * Read only variables
  readonly IconList = IconList;
  private readonly _ngUnSubscribe = new Subject<void>();

  constructor(
    private spinner: NgxSpinnerService,
    public cs: CommonService,
    private api: ApiService,
    private routr: Router,
    private cocService: COCService,
    private currenyPipe: CommaSeparatePipe,
    public translate: TranslateService
  ) {
    this.selectedDepartmentName = this.cs.selectedDepartment.DepartmentName;
  }

  ngOnInit(): void {
    this.getContractDetails();
  }

  /**
   * Make a API call to get the list of contracts
   */
  getContractDetails(): void {
    this.spinner.show();

    const Payload = { ProfitCentre: this.cs.selectedDepartment.ProfitCentre };

    this.api.post('CocOpenPoAndContractSet', Payload).pipe(takeUntil(this._ngUnSubscribe)).subscribe((contractList) => {
      const _contractList = contractList?.d?.results;

      const _openContract = _contractList.filter((contract: any) => contract.Contract);
      const _openPoWithoutContract = _contractList.filter((contract: any) => !contract.Contract);

      this.openContract = this.cocService.addSerialNumber(_openContract).map((contract: ContractList) => {
        return {
          SiNo: contract.SiNo,
          Contract: contract.Contract,
          DocumentNo: contract.DocumentNo,
          VendorName: contract.VendorName,
          PrNo: contract.PrNo,
          ProfitCenter: contract.ProfitCenter,
          ProjName: contract.ProjName,
          RfpNo: contract.RfpNo
        }
      });
      this.displayOpenContract = this.openContract;

      this.openPoWithoutContract = this.cocService.addSerialNumber(_openPoWithoutContract).map((contract: ContractList) => {
        return {
          SiNo: contract.SiNo,
          Contract: contract.Contract,
          DocumentNo: contract.DocumentNo,
          VendorName: contract.VendorName,
          PrNo: contract.PrNo,
          ProfitCenter: contract.ProfitCenter,
          ProjName: contract.ProjName,
          RfpNo: contract.RfpNo
        }
      });
      this.displayOpenPoWithoutContract = this.openPoWithoutContract;
    }, err => {
      this.openContract = [];
      this.openPoWithoutContract = [];
    }).add(() => {
      this.spinner.hide();
    });
  }

  /**
   * 
   * @param contract 
   */
  openContractDetailsList(contract: ContractList) {

    // * Update store variable
    this.selectedProjectName = contract.ProjName;
    this.docNumber = contract.DocumentNo;
    this.docType = 'CONTRACT';

    this.spinner.show();

    const payload = {
      DocumentNo: contract.DocumentNo,
      VendorName: contract.VendorName
    }

    this.api.post('CocOpenContractItemSet', payload).subscribe((contractItemsList) => {
      const _contractItemsList = this.cocService.addSerialNumber(contractItemsList?.d?.results).map((contract: ContractDetailsList) => {
        return {
          SiNo: contract.SiNo,
          ContractNumber: contract.ContractNumber,
          ContractItemNumber: contract.ContractItemNumber,
          VendorName: contract.VendorName,
          PoNumber: contract.PoNumber,
          PoItemNumber: contract.PoItemNumber,
          PoItemDesc: contract.PoItemDesc,
          checked: false
        }
      });
      this.contractDetailsList = _contractItemsList;
      this.displayContractDetailsList = _contractItemsList;
      this.showContractDetailsList = true;
    }, err => {
      this.contractDetailsList = [];
    }).add(() => {
      this.spinner.hide();
    });
  }

  /**
   * 
   * @param contract 
   */
  openPODetailsList(contract: ContractList): void {

    // * Update strore variable
    this.selectedProjectName = contract.ProjName;
    this.docNumber = contract.DocumentNo;
    this.docType = 'PO';

    this.spinner.show();

    const payload = {
      DocumentNo: contract.DocumentNo,
      VendorName: contract.VendorName
    }

    this.api.post('CocOpenPoItemsSet', payload).subscribe((PoItemsList) => {
      const _PoItemsList = this.cocService.addSerialNumber(PoItemsList?.d?.results).map((poDetails: PODetailsList) => {
        return {
          SiNo: poDetails.SiNo,
          PoNo: poDetails.PoNo,
          VendorName: poDetails.VendorName,
          PoItemNo: poDetails.PoItemNo,
          SesNo: poDetails.SesNo,
          SesAmount: this.currenyPipe.transform(poDetails.SesAmount).toString(),
          SesRemainingAmt: this.currenyPipe.transform(poDetails.SesRemainingAmt).toString(),
          PoAmount: this.currenyPipe.transform(poDetails.PoAmount).toString(),
          PoIssueDate: poDetails.PoIssueDate,
          PoRemainingAmt: this.currenyPipe.transform(poDetails.PoRemainingAmt).toString(),
          CocAmount: this.currenyPipe.transform(poDetails.CocAmount).toString(),
          ContractItem: poDetails.ContractItem,
          ItemCategory: poDetails.ItemCategory,
          checked: false
        }
      });
      this.poDetailsList = _PoItemsList;
      this.isPODetailsSelected = true;
      this.showContractDetailsList = true;
      this.showPODetailsList = true;
    }, err => {
      this.poDetailsList = [];
    }).add(() => {
      this.spinner.hide();
    });
  }

  /**
   * Make the selection 
   * @param value 
   */
  onAllChecked(value: boolean, tableType: 'contract' | 'po'): void {
    if (tableType === 'contract') {
      this.displayContractDetailsList = this.displayContractDetailsList.map((contract) => {
        return {
          ...contract,
          checked: value
        }
      });
    }
    if (tableType === 'po') {
      this.poDetailsList = this.poDetailsList.map((po) => {
        return {
          ...po,
          checked: value
        }
      });
    }
  }

  /**
   * PO the contract select
   */
  postCotractSelection(): void {
    const checkedItems: {
      PoNo: string,
      ContractNumber: string,
      ContractItem: string
    }[] = [];
    this.displayContractDetailsList.filter(contract => contract.checked === true).forEach((contract) => {
      checkedItems.push({
        "PoNo": contract.PoNumber,
        "ContractNumber": contract.ContractNumber,
        "ContractItem": contract.ContractItemNumber
      });
    });
    this.spinner.show();
    this.api.post('POList', checkedItems).pipe(takeUntil(this._ngUnSubscribe)).subscribe((response) => {
      this.spinner.hide();
      if (response?.d?.CocPOtoItemNav?.results) {
        const _poDetailsList = response?.d?.CocPOtoItemNav?.results;
        this.poDetailsList = this.cocService.addSerialNumber(_poDetailsList).map((poDetail: PODetailsList) => {
          return {
            SiNo: poDetail.SiNo,
            PoNo: poDetail.PoNo,
            VendorName: poDetail.VendorName,
            PoItemNo: poDetail.PoItemNo,
            SesNo: poDetail.SesNo,
            SesAmount: this.currenyPipe.transform(poDetail.SesAmount).toString(),
            SesRemainingAmt: this.currenyPipe.transform(poDetail.SesRemainingAmt).toString(),
            PoAmount: this.currenyPipe.transform(poDetail.PoAmount).toString(),
            PoIssueDate: poDetail.PoIssueDate,
            PoRemainingAmt: this.currenyPipe.transform(poDetail.PoRemainingAmt).toString(),
            CocAmount: poDetail.CocAmount,
            ContractNumber: poDetail.ContractNumber,
            ContractItem: poDetail.ContractItem,
            ItemCategory: poDetail.ItemCategory,
            checked: false
          }
        })
        this.showPODetailsList = true;
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

  /**
   * Transforms the number to Amount with commas
   * @param event 
   * @param sino 
   */
  transformComma(event: any, sino: number) {
    const amountVal = event;
    this.poDetailsList.map((po) => {
      if (po.SiNo === sino) {
        po.CocAmount = this.currenyPipe.transform(amountVal).toString();
      }
      return po;
    })
  }

  createCOC(): void {
    const selectedPOList = this.poDetailsList.filter((po) => po.checked);
    this.routr.navigate(['coc/create'], { state: selectedPOList });
  }

  /**
   * Return navigation
   * 
   */
  back(): void {
    if (this.isPODetailsSelected) {
      this.isPODetailsSelected = !this.isPODetailsSelected;
      this.showPODetailsList = !this.showPODetailsList;
      // this.showContractDetailsList = !this.showContractDetailsList;
    }
    if (this.showPODetailsList) {
      this.showPODetailsList = !this.showPODetailsList;
      return;
    }
    if (this.showContractDetailsList) {
      this.showContractDetailsList = !this.showContractDetailsList;
      return;
    }
    this.routr.navigate(['coc/listofdept']);
  }

  /**
   * Reset the CoC Amount if unchecked
   * @param value 
   * @param sino 
   */
  resetValue(value: boolean, sino: number) {
    this.poDetailsList.forEach((po) => {
      const isSelectedPO = po.SiNo === sino;
  
      if (value) {
        if (isSelectedPO) {
          const amount = po.ItemCategory === this.SERVICE_PO_CODE ? po.SesRemainingAmt : po.PoAmount;
          po.CocAmount = this.currenyPipe.transform(amount)?.toString() ?? '0.000';
        } else {
          po.checked = false;
          if (po.CocAmount !== '0.000') {
            po.CocAmount = '0.000';
          }
        }
      } else if (isSelectedPO) {
        po.CocAmount = '0.000';
      }
    });
  }

  /**
   * Return the COC Max amount
   * @param sesRemainingAmount 
   * @param poRemainingAmount
   * @returns 
   */
  getCOCAmountMax(sesRemainingAmount: string | number, poRemainingAmount: string | number): number {
    const _sesRemainingAmount = this.cs.removeCommas(sesRemainingAmount);
    const _poRemainingAmount = this.cs.removeCommas(poRemainingAmount);
    if (parseInt(_sesRemainingAmount) === 0) {
      return parseInt(_poRemainingAmount) > 0 ? parseInt(_poRemainingAmount) : 0;
    }
    return parseInt(_sesRemainingAmount) > 0 ? parseInt(_sesRemainingAmount) : 0;
  }

  /**
   * Update the selected Tab Index
   * @param index 
   */
  updateSelectedTabIndex(index: number): void {
    this.selectedTabIndex = index;
    this.resetSearch();
  }

  // * Getter Methods
  getErrors(cocAmount: string | number): boolean {
    return parseInt(cocAmount.toString()) === 0 ? true : false;
  }

  /**
   * Search method for Open Contract table
   * @param searchvalue 
   */
  searchOpenContract(searchvalue: string): void {
    const searchObjReq = Object.entries(this.openContractSearchObject).find((obj) => {
      if (obj[1].visible) {
        obj[1].value = searchvalue;
        obj[1].visible = false;
        return true;
      }
      return false;
    });
    this.displayOpenContract = this.openContract.filter((item) => {
      switch (searchObjReq?.[0]) {
        case 'DocumentNo':
          return item['DocumentNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'VendorName':
          return item['VendorName'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'ProjName':
          return item['ProjName'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'RfpNo':
          return item['RfpNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'PrNo':
          return item['PrNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
      }
      return;
    });
  }


  /**
 * Search method for Open Contract table
 * @param searchvalue 
 */
  searchOpenPO(searchvalue: string): void {
    const searchObjReq = Object.entries(this.openPOSearchObject).find((obj) => {
      if (obj[1].visible) {
        obj[1].value = searchvalue;
        obj[1].visible = false;
        return true;
      }
      return false;
    });
    this.displayOpenPoWithoutContract = this.openPoWithoutContract.filter((item) => {
      switch (searchObjReq?.[0]) {
        case 'DocumentNo':
          return item['DocumentNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'VendorName':
          return item['VendorName'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'ProjName':
          return item['ProjName'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'RfpNo':
          return item['RfpNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
        case 'PrNo':
          return item['PrNo'].toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1;
      }
      return;
    });
  }

  /**
 * Reset the open contract list and search object
 */
  resetSearch(): void {
    this.displayOpenContract = this.openContract;
    this.displayOpenPoWithoutContract = this.openPoWithoutContract;
    this.openContractSearchObject = this.getOpenContractSearchObject;
    this.openPOSearchObject = this.getOpenPOSearchObject;
  }


  get isSelectedPOInValid(): boolean {
    const checkedPO = this.poDetailsList.filter((po) => po.checked);
    let invalidPOs = false;
    if (checkedPO.length > 0) {
      checkedPO.forEach((po) => {
        if (!po.CocAmount || parseInt(po.CocAmount.toString()) === 0) {
          invalidPOs = true;
        }
      });
      return invalidPOs;
    }
    return true;
  }

  get isAllContractDetailsChecked(): boolean {
    const allChecked = this.displayContractDetailsList.find((contract) => contract.checked === false);
    return allChecked ? false : true;
  }

  get isAllContractDetailsNotChecked(): boolean {
    const allNotChecked = this.displayContractDetailsList.find((contract) => contract.checked === true);
    return allNotChecked ? true : false;
  }

  get isAllPODetailsChecked(): boolean {
    const allChecked = this.poDetailsList.find((po) => po.checked === false);
    return allChecked ? false : true;
  }

  get SERVICE_PO_CODE(): string {
    return SERVICE_PO_CODE;
  }

  get getOpenContractSearchObject() {
    const obj = {
      DocumentNo: {
        value: '',
        visible: false
      },
      VendorName: {
        value: '',
        visible: false
      },
      ProjName: {
        value: '',
        visible: false
      },
      RfpNo: {
        value: '',
        visible: false
      },
      PrNo: {
        value: '',
        visible: false
      }
    }
    return obj;
  }

  get getOpenPOSearchObject() {
    const obj = {
      DocumentNo: {
        value: '',
        visible: false
      },
      VendorName: {
        value: '',
        visible: false
      },
      ProjName: {
        value: '',
        visible: false
      },
      RfpNo: {
        value: '',
        visible: false
      },
      PrNo: {
        value: '',
        visible: false
      }
    }
    return obj;
  }

  ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }
}
