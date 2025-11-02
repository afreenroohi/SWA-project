import { NzTableFilterList } from "ng-zorro-antd/table";

export const PAGE_SIZE = 5;
export interface FilterSet{
    lableName: string,
    width: string;
    dropDown: Dropdown[] 
}

export interface Dropdown {
    label: MultiLang,
    value: string
}

export type FilterValue = string | number | boolean | Date | { [key: string]: any };


export interface CardList {
    TotRfpPrCard: boolean,
    TotTndrCard: boolean,
    TotContCard: boolean,
    TotContPreAprCard: boolean,
    TotCocCard: boolean,
    TotRfpByDpt: boolean,
    TotRfpByMonth: boolean,
    TotTndrByMonth: boolean,
    TotTndrByCmt: boolean,
    TopVndrs: boolean,
    TotContByMonth: boolean,
    TotAmtByMonth: boolean
}

export interface CardData {
    TotalRfpCount: string,
    TotalPrCount: string,
    TotalTndrCount: string,
    TotalContSapCount: string,
    TotalContP2pCount: string,
    TotalContaprP2pCount: string,
    TotalCocCount: string
}

export interface ChartData {
    xAxis: MultiLang,
    xValues: MultiLang[],
    yAxis: MultiLang,
    yValues: MultiLang[],
    xIds?: string[]
}

export interface CardItem {
    title: string,
    value: string
}


export interface TableColumn {
    title: string;
    compare: ((arg1: any, arg2: any) => number) | null;
    priority: number | boolean;
    key: TableItemKeys;
    type: 'text' | 'number' | 'currency' | 'date';
    width: string | null;
    fixed?: boolean;
    sort: boolean;
    filter?: NzTableFilterList
}

export interface MultiLang {
    en: string;
    ar: string;
}

export interface RfpItem {
    projectName: string;
    rfpNumber: string;
    prNumber: string;
    department: string;
    createdBy: MultiLang;
    pendingWithUser: MultiLang;
    pendingWithDept: MultiLang;
    createdOn: Date | string;
}
export interface TenderItem {
    projectName: string;
    tenderId: string;
    rfpNumber: string;
    prNumber: string;
    typeofTender: MultiLang;
    openingDate: Date | string;
    status: MultiLang;
    pendingWithCommittee: MultiLang;
    pendingWithUser: MultiLang;
    tenderType: MultiLang;
    competitionType: MultiLang;
}

export interface ContractItem {
    contractName: string;
    contractNumber: string;
    prNumber: string;
    contractAmount: number;
    vendorName: string;
    projectType: MultiLang;
    pendingWithUser: MultiLang;
    pendingWithRole: MultiLang;
    status: MultiLang;
}

export interface ContractSAPItem {
    contractNumber: string;
    vendorName: string;
    prNumber: string;
    targetValue: string;
    createdOn: string | Date;
    valStartDate: string | Date;
    valEndDate: string | Date;
}

export interface CocItem {
    phaseName: string;
    cocNumber: string;
    poNumber: string;
    sesNumber: string;
    cocAmount: number;
    createdOn: Date | string;
    status: MultiLang;
    pendingWithUser: MultiLang;
}

export type TableItem = RfpItem | TenderItem | ContractItem | ContractSAPItem | CocItem;

export type TableItemKeys = keyof RfpItem | keyof TenderItem | keyof ContractItem | keyof ContractSAPItem | keyof CocItem;

export interface TableApiResponse {
    count: number;
    list: TableItem[]
}

export const CardTitle = {
    rfp: 'Dashboard.Total Number of RFPs',
    tender: 'Dashboard.Total Number of Tenders',
    contractSAP: 'Dashboard.Total Number of Contracts (SAP)',
    contract: 'Dashboard.Total Number of Contracts',
    coc: 'Dashboard.Total Number of CoCs',
} as const;

export const TableTitle = {
    rfp: 'Dashboard.Total Number of RFPs',
    tender: 'Dashboard.Total Number of Tenders',
    contractSAP: 'Dashboard.Total Number of Contracts (SAP)',
    contract: 'Dashboard.Total Number of Contracts',
    coc: 'Dashboard.Total Number of CoCs',
} as const;

export const SearchPlaceholder = {
    rfp: 'Dashboard.Search RFP',
    tender: 'Dashboard.Search Tender',
    contractSAP: 'Dashboard.Search Contract (SAP)',
    contract: 'Dashboard.Search Contract',
    coc: 'Dashboard.Search CoC',
} as const;

export interface CardEvent {
    visible: boolean;
    process: string;
}

export interface Vendor {
    VendorId: string;
    VendorName: string;
}

export interface ContractDetails {
    contractNumber: string,
    agreementDate: string,
    startDate: string,
    endDate: string,
    targetValue: string,
    po: string[],
    pr: string[]
}

export interface VendorDetails {
    vendorID: string,
    vendorName: string,
    city: string,
    country: MultiLang,
    postalCode: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    contractDetails: ContractDetails[]
}

export interface TableFilter {
    key: string;
    value: string;
}

export interface TableSort {
    key: string;
    value: 'A' | 'D';
}

export interface TableFilterSort { 
    filter: TableFilter[];
    sort: TableSort[];
}

export interface RfpUser {
    uname: string;
    pernr: string;
    userName: string;
    userName_ar: string;
}

export interface RfpDepartment {
    RfpWfDept: string;
    RfpWfDeptEn: string;
    RfpWfDeptAr: string;
}

export interface ProjectType {
    PrjTypeID: string;
    PrjTypeDescEN: string;
    PrjTypeDescAR: string;
}

export interface StatusType {
    StatusID: string;
    StatusDescEN: string;
    StatusDescAR: string;
}

export interface Role {
    RoleID: string;
    RoleDescEN: string;
    RoleDescAR: string;
}

export type TableFilterSet = RfpUser | RfpDepartment | Dropdown | ProjectType | StatusType | Role;