import { AbstractControl } from "@angular/forms"

export interface Constant {
    'CnstId': string,
    'CnstValue': string,
    'Description': string,
    'Active': string
}

/**
 * List of Members Interface
 * 
 */
export interface MemberList {
    "CommitteeId": string,
    "TenderId": string,
    "CommitteeRole": string,
    "CommitteeUser": string,
    "CommitteeBckupUser": string,
    "CommitteeUserName": string,
    "CommitteeBkpUserName": string,
    "SelectedMbr": string
}

export enum Department {
    "Legal Member" = "LM",
    "Technical Member" = "TM",
    "Procurement Member" = "PM",
    "Finance Member" = "FM",
    "Committee Member" = "MR"
}

export interface TechnicalEvaluation {
    'CommitteeId': string,
    'TenderId': string,
    'VendorId': string,
    Headline: string,
    'EvltnTechCriteriaId'?: string,
    'EvltnTechCriteriaDesc'?: string,
    'EvltnTechCriteriaId_RFP'?: string,
    'EvltnTechCriteriaDesc_RFP'?: string,
    Subcriflg: string,
    'Weightage': string,
    'Actual': Number,
    PageNO: Number,
    Comments: string,
    to_tcritosubcri: any,
    to_tevalsub: any
}

export interface Subcriteria {
    ItemNo: string,
    EvltnTechCriteriaId: string,
    SubItemNo: string,
    EvltnTechSubCriteriaId: string,
    Descr: string,
    EvltnTechCriteriaDesc: string,
    Percentage: string,
    Weightage: string,
    Actual: number,
    // PageNO: number,
    // Comments: string
}

export interface TechnicalRequirementStauts {
    'TechReqStatusID': string,
    'TechReqStatusDescEN': string,
    'TechReqStatusDescAR': string
}

export interface TechnicalRequirement {
    "RfpNo": string,
    "RfpVersion": string,
    "EvltnTechReqId": string,
    "EvltnTechReqDesc": string,
    "IscriteriaApplicable": string,
    "TecReqJustification": string,
    "CreatedBy": string,
    "CreatedOn": string,
    "CreatedAt": string,
    "ChangedBy": string,
    "ChangedOn": string
}

export interface VendorCheckList {
    "AttachmentFlag": string,
    "ChecklistId": string,
    "ChecklistName": string,
    "ChecklistNameAr": string,
    "ChecklistType": string,
    "ChklstTypeDesc_ar": string,
    "CommitteeId": string,
    "IsAttachmentValid": string,
    "TenderId": string,
    "VendorId": string
}

export interface doumentDownload {
    'CommitteeID': string,
    'TndrID': string,
    'LoggedInID'?: string,
    'LoggedCmt'?: string,
    'Role'?: string,
    'Identifier'?: string
}

export interface actionButtonDetails {
    BUTTON_AR: string;
    BUTTON_EN: string;
    Button_ID: string;
    CmtID: string;
    CmtMenu: string;
    CmtRole: string;
    OTP_Required: string;
    TenderID: string;
    rule_id: string;
    action:()=> void;
    validation:()=> boolean;
}

type ActionKeys = 
  | 'BOPN_OF_SUB'
  | 'BPRV_OF_SUB'
  | 'BOPN_CH_ASG'
  | 'BOMR_MR_APR'
  | 'BOMR_MR_RET'
  | 'BAPR_CH_ABC'
  | 'BOPN_CH_RTS'
  | 'BAPR_CH_RTS'
  | 'BPRV_OF_SUB'

export type ActionMap = {
    [key in ActionKeys]: () => void; 
  };    

type DPActionKeys = 
  | 'BOPN_OF_SUB'

export type DPActionMap = {
    [key in DPActionKeys]: () => void; 
  };


type BqcActionKeys = 
    | 'BTEV_OF_SUB'
    | 'BTEV_OF_DFT'
    | 'BTEV_CH_AQM'
    | 'BTEV_CH_ABE'
    | 'BTEV_CH_RTS'
    
    export type BqcActionMap = {
    [key in BqcActionKeys]: () => void; 
  };


  export interface CommitteeMembers {
    CommitteeBckupUser: string;
    CommitteeBkpUserName: string;
    CommitteeBkpUserName_AR: string;
    CommitteeId: string;
    CommitteeRole: string;
    CommitteeRoleName: string;
    CommitteeUser: string;
    CommitteeUserName: string;
    CommitteeUserName_AR: string;
    Identifier: string;
    Inactive: boolean;
    SelectedMbr: string;
    TenderId: string;
    isChecked?: boolean;
    isBackupChecked?: boolean;
  }
  

  export interface CommitteeMembersFromAPI {
    CommitteeBkpUserID: string;
    CommitteeBkpUserName: string;
    CommitteeBkpUserName_AR: string;
    CommitteeId: string;
    CommitteeRole: string;
    CommitteeRoleName: string;
    CommitteeUserID: string;
    CommitteeUserName: string;
    CommitteeUserName_AR: string;
    CommitteeYear: string;
    DataSource: string;
    IsBackup: string;
    IsMemberSelected: string;
    SAPCmtRole: string;
    TenderId: string;
    ValidCmtBkpUsr: string;
    ValidCmtUsr: string;
  }
  
  export interface FinancialWeightageCheck {
    vendorname: string;
    isCalculated: boolean;
    isVendorpassed: boolean;
  }
  type legalStatus = 'Pass' | 'Fail';

  export interface legalWeightageCheck {
    vendorname: string;
    LeagalSocre: legalStatus;
    isVendorpassed: boolean;
  }
  
  export interface totalWeightageCheck {
    vendorname: string;
    LeagalSocre: legalStatus;
    isVendorpassed: boolean;
    totalWeightage: number
  }


  export interface docParams {
    DefId: string;
    EntityId: string;
    EntityName: string;
    HeaderKey: string;
    ItemKey: string;
    ItemSecKey: string;
    RelatedEntityId?: string;
    RelatedEntityName: string;
  }

  export interface highLevelDocParams{
    VendorGUID?: string;
    editable: boolean;
    firstLevelId: string;
    firstLevelName: string;
    operation: string;
    secondLevelId: string;
    secondLevelName: string;
    thirdLevelId: string;
  };

  export interface dropDown{
    domvalue_l: string,
    DesEn: string,
    DesAr: string,
    isDisabled: boolean
  }


  export interface Country {
    Land1: string;
    Landx50En: string;
    Natx50En: string;
    Natx50AR: string;
    Landx50Ar: string;
  }