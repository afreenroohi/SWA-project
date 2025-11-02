export interface PRList {
    PurchaseRequest: string,
    RfpNo: string
}


// export  interface serviceLineItem {
//     lineNumber: string; 
//     shortText: string;
//     quantity: string;
//     unit: string;
//     grossPricePerUnit: string; 
//     currency: string;
//     costCenter: string;
//     order: string; 
//   }


  export const SERVICE_LINE_ITEM: string[] = [
    "contract.create.Line number",
    "contract.create.Short text",
    "contract.create.Quantity",
    "contract.create.Unit",
    "contract.create.Gross Price per unit (Without VAT)",
    "contract.create.Currency",
    // "contract.create.Costcenter",
    // "contract.create.Order",
    "contract.create.Total Price"
  ];
  
  // Assigning ORDER_FIELDS to a variable (optional)
  export const orderFieldValues = [...SERVICE_LINE_ITEM];

  type OmitMetadataAndDeferred<T> = Omit<T, '__metadata' | 'PR_Header'>;


  export interface ContractCreationDetails {
    GrossPrice: string;
    SupplierName: string;
    CompCodeDesc: string;
    PurchaseRequest: string;
    PurchaseGrpname: string;
    ContPerdUnit: string;
    Supplier: string;
    PurchaseOrg: string;
    PurchaseGrp: string;
    AgreementDt: string;
    AgreementType: string;
    TargetValue: string;
    ValStDate: Date | null;
    ContPeriod: string;
    ValEndDate: Date | null;
    ReferenceNo: string;
    CompCode: string;
    Item_overview: {
        results: OmitMetadataAndDeferred<ItemOverview>[]; // Apply the Omit type here
    };
    Service_line_item: {
        results: OmitMetadataAndDeferred<ServiceLineItem>[]; // Apply the Omit type here
    };
    Account_Assignment: {
        results: OmitMetadataAndDeferred<AccountAssignment>[]; // Apply the Omit type here
    };
}

export interface ItemOverview {
    __metadata: Metadata;
    Item: string;
    PurchaseRequest: string;
    ItemCat: string;
    AccAssig: string;
    Material: string;
    ShortText: string;
    TargQua: string;
    OrdUnit: string;
    NetPrice: string;
    PriceUnit: string;
    OrdPrUnit: string;
    MatGrp: string;
    MatGrpDescAra: string;
    MatGrpDesc: string;
    Plant: string;
    PlantDesc: string;
    TaxCode: string;
    TaxCodeDescAra: string;
    TaxCodeDesc: string;
    ItmCatDesEn: string;
    ItmCatDesAra: string;
    PR_Header: Deferred;
    AccAssigDesAr:string;
    AccAssigDesc: string
}

export interface ServiceLineItem {
    __metadata: Metadata;
    LineNum: string;
    PurchaseRequest: string;
    ShortText: string;
    SrQuan: string;
    SrUnit: string;
    GrossPrice: string;
    Currency: string;
    CostCent: string;
    Order: string;
    PR_Header: Deferred;
}

export interface AccountAssignment {
    __metadata: Metadata;
    CostCent: string;
    CostCentDesc: string;
    ContArea: string;
    PurchaseRequest: string;
    Order: string;
    OrdDesc: string;
    CompCode: string;
    GlAcc: string;
    ProfitCent: string;
    Fund: string;
    FundCent: string;
    CommItem: string;
    ComItmDesc: string;
    Recipient: string;
    PR_Header: Deferred;
}

export interface Metadata {
    id: string;
    uri: string;
    type: string;
}

export interface Deferred {
    __deferred: {
        uri: string;
    };
}
