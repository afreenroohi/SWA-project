export const SERVICE_PO_CODE = '9';

export interface PODetailsList {
  SiNo: number,
  ContractItem: string,
  PoNo: string,
  VendorName: string,
  PoItemNo: string,
  SesNo: string,
  SesAmount: string | number,
  SesRemainingAmt: string | number,
  PoAmount: string | number,
  PoIssueDate: string,
  PoRemainingAmt: string | number,
  CocAmount: string | number,
  ContractNumber: string,
  ItemCategory: string,
  checked: boolean
}

export interface CocFormField {
  AdvancePayment: string | number,
  ProjectName: string,
  CocNumber: string,
  ContractNo: string,
  ContractDate: string | Date,
  DocumentEnable: string,
  PercentCompletion: string | number,
  VendorName: string,
  PhaseName: string,
  InvNumber: string,
  InvIssueDate: string | Date,
  InvAmount: string | number,
  RetentionField: string,
  Penalties: string | number,
  EtmdRefNo: string | number,
  WorkStartDt: string | Date,
  WorkEndDt: string | Date,
  Bgvaliddatecal: string,
  CocAmount: string | number,
  SesAmount: string,
  ContractAmount: string | number,
  DisbursedAmount: string | number,
  ContractRemAmount: string | number,
  Isfinalsettlement: string,
  OtpRequired: string,
  PoDetailsList?: PODetailsList[]
}

export interface COCFormPayload {
  UserId: string,
  CocNumber: string,
  ProjectName: string,
  ReferenceCoc: string,
  ContractNo: string,
  ContractDate: string,
  PercentCompletion: string,
  VendorName: string,
  PhaseName: string,
  InvNumber: string,
  InvIssueDate: string,
  InvAmount: string,
  RetentionField: string,
  AdvancePayment: string,
  Penalties: string,
  CocAmount: string,
  ContractAmount: string,
  DisbursedAmount: string,
  ContractRemAmount: string,
  CocStatus: string,
  CocRole: string,
  CocAction: string,
  EtmdRefNo: string,
  Bgvaliddatecal: string,
  WorkStartDt: string,
  WorkEndDt: string,
  Isfinalsettlement: string,
  NextApprover: string,
  CocHeadtoItemNav: CocHeadtoItemNavItem[],
  // CocFormToAttachNav: CocFormToAttachNavItem[]
}

interface CocHeadtoItemNavItem {
  CocNumber: string,
  PoNo: string,
  PoItemNo: string,
  PoIssueDate: string,
  SesNo: string,
  SesAmount: string,
  CocAmount: string
}

export interface CocFormToAttachNavItem {
  CocNo: string,
  FilenetId: string,
  FileName: string,
  CreatedBy: string,
  CreatedOn: string,
  CreatedAt: string,
  Operation?: string,
}

export interface COCComments {
  CocNo: string,
  CommentId: string,
  CommentText: string,
  CommentBy: string,
  CommentByAr: string,
  CommentByEn: string,
  CommentDate: string,
  CommentTime: string
}

export interface COCDashboardList {
  SiNo: number,
  CocNo: string,
  DepartmentNo: string,
  ProjectName: string,
  VendorName: string,
  ContractNumber: string,
  PoNo: string,
  InvoiceNumber: string,
  CreatedBy: string,
  CreationDate: string,
  CocStatus: string,
  CocStatusEn: string,
  CocStatusAr: string,
  PendingWithEn: string,
  PendingWithAr: string,
  SlaAr: string,
  SlaEn: string,
  SlaFlag: string
}

export interface COCActionButton {
  UserId: string,
  CocNumber: string,
  CocStatus: string,
  CocRole: string,
  CocAction: string,
  OtpRequired?: string,
  CocActionEn?: string,
  CocActionAr?: string
  RetentionField?: string,
  CocAmount?: string,
  Penalties?: string,
  AdvancePayment?: string;
}

export interface COCHistory {
  SiNo: number,
  CreatedBy: string,
  CreatedByAr: string,
  CocAction: string,
  CocActionAr: string,
  CocRole: string,
  CocRoleAr: string,
  CreatedDate: string,
  CreatedTime: string
}

export enum searchKey {
  ContractNumber = 'CN',
  PoNumber = 'PN'
}

export enum cocFormDownload{
  ETIMADFORM = 'ETMD',
  INTERNALFORM = 'INTE',
  FINALSETTELMENT = 'FINL'
}

export interface userList {
  EmployeeNo: string;
  NameAR: string;
  NameEN: string;
  UserID: string;
}