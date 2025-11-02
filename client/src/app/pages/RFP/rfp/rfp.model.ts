export interface CommitmentItem {
    CommitmentItem: string,
    DocumentTypeId: string
}


export interface QualificationMetadata {
    id: string;
    uri: string;
    type: string;
  }
  
  export interface FullQualification {
    QualtypeID: string;
    QualtypeDesc: string;
    QualtypeDescAR: string;
    __metadata: QualificationMetadata;
  }
  
  export interface QualificationListFullResponse {
    d: {
      results: FullQualification[];
    };
  }

  export interface WorkflowPayload {
    RfpNo: string,
    RfpVersion: string,
    DeptId: string,
    WfResComment: string,
    WfApprvAction: string,
    NwfApprvDept: string,
    NwfApprvLevel: string,
    NwfApprvRole: string,
    NwfApprvId: string,
    NwfDept: string,
    CreatedBy: string,
    LogonUsr: string
  }

export enum stepperStatus{
  Pending = "pending",
  COMPLETED = "completed",
}
  
export interface stepperStatesDetails{
  sNo: number,
  titleEN:string,
  titleAR:string,
  state:stepperStatus

}



export interface CommitmentItem {
  Commitmentitem: string,
  Description: string,
  FMArea: string,
  FiscalYear: string,
  Language: string
}

export interface InternalOrder {
  CommitmentItem: string,
  FicialYear: string,
  InternalOrder: string
}

export interface KPIDetails{
  kpiHeading:string
  kpiDescription:string
}

export interface budgetSplit{
  year: number ,
  commitmentId:string,
  internalOrder:string,
  budget:number 
}


export interface BOQItem {
  itemName: string;
  previousQuantity: number;
  quantity: number;
  remainingQuantity: number;
  estUnitPrice: number;
  totalEstimatedPriceWithoutVAT: number;
  totalEstimatedPriceWithVAT: number;
}

export interface splitedBudget {
  year: string;
  committeItem: string;
  internalOrder: string;
  budgetWithVAT: number;
  BOQItems: BOQItem[];
}

export interface BudgetSplitForPost {
  ItmYear: string;
  CommItm: string;
  IntOrd: string;
  ItmAmount: string;
}

export interface PlannedBudget {
  NoYears: string;
  SameItm: string;
  RfpNo: string;
  RfpVersion: string;
  rfp_budg_itm_dSet: BudgetSplitForPost[];
}

export interface BudgetingBOQItem {
  itemName: string;
  quantity: number;
  remainingQuantity: number;
  estimatedUnitPriceWithoutVAT: number;
  totalEstimatedPriceWithoutVAT: number;
  totalEstimatedPriceWithVAT: number;
}

export interface BudgetServiceLineItemToPost {
  RfpNo: string;
  RfpVersion: string;
  Rfp_budg_srv_itm_fin: BudgetServiceLineItem[];
}

export interface BudgetServiceLineItem {
  RfpNo: string;        // RFP no (NUMC 10)
  RfpVersion: string;   // P2P - RFP Version (NUMC 5)
  ItemName: string;     // Item Name (STRING)
  Quantity: string;     // Quantity (STRING)
  RemQuan: string;      // Remaining Quantity (STRING)
  UnitPrice: string;    // Unit Price (STRING)
  TotPriWoVat: string;  // Total Price Without VAT (STRING)
  TotPriVat: string;    // Total Price With VAT (STRING)
  BudYear: string;      // Fiscal Year (NUMC 4)
  CommItm: string;      // Committed Item (STRING)
  IntOrd: string;       // Internal Order (STRING)
  BudVat: string;       // Budget VAT (STRING)
  SaveDraft: string;    // Save Draft (STRING)
  ItemNo: string;       // Item Number of Purchasing Document (NUMC 5)
}


export type BudgetType = "NewBudget" | "pendingBudget";


export interface BOQMaster {
  BudVat: string;
  BudYear: string;
  CommItm: string;
  IntOrd: string;
  ItemName: string;
  ItemNo: string;
  Quantity: string;
  RemQuan: string;
  RfpNo: string;
  RfpVersion: string;
  Rfp_budg_srv_itm_fin: { __deferred: any }; // Adjust type based on actual structure
  SaveDraft: string;
  TotPriVat: string;
  TotPriWoVat: string;
  UnitPrice: string;
}

export interface RFPUserRoleInfo {
  ControllingArea: string;
  CostCenter: string;
  Data1: string;
  Data2: string;
  Data3: string;
  DeptId: string;
  DeptText: string;
  Lang: string;
  MessageAr: string;
  MessageEn: string;
  MessageId: string;
  RoleIdf: string;
  UserId: string;
}

export interface AvailableBuget {
  CommitmentItem: string;
  AvaiableBudget: string;
}