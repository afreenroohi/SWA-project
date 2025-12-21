import { Injectable } from '@angular/core';
import {
  DocumentType,
  DocumentTypeId,
  dtypes,
  TechMemberDetail,
} from 'src/app/shared/shared';
import { ApiService } from 'src/app/service/RFP/api.service';
import { AvailableBuget, CommitmentItem, InternalOrder, RFPUserRoleInfo } from 'src/app/pages/RFP/rfp/rfp.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import {
  PlannedBudget,
  BudgetServiceLineItemToPost,
} from 'src/app/pages/RFP/rfp/rfp.model';
import { NgxSpinnerService } from 'ngx-spinner';

// Define Ticket interface for compatibility
interface Ticket {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  screenshot?: string;
  ticketNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class RFPService {
  private tickets: Ticket[] = []; // In-memory store
  private idCounter = 1;
  commitmentItemsSubject = new Subject<CommitmentItem[]>();
  commitmentItems$ = this.commitmentItemsSubject.asObservable();

  internalOrderSubject = new Subject<InternalOrder[]>();
  internalOrder$ = this.internalOrderSubject.asObservable();

  RFPUserDetailsSubject = new BehaviorSubject<RFPUserRoleInfo>({
    ControllingArea: '',
    CostCenter: '',
    Data1: '',
    Data2: '',
    Data3: '',
    DeptId: '',
    DeptText: '',
    Lang: '',
    MessageAr: '',
    MessageEn: '',
    MessageId: '',
    RoleIdf: '',
    UserId: ''
  });
  RFPUserDetails$ = this.RFPUserDetailsSubject.asObservable()

  private budgetPlannerErrorSubject = new BehaviorSubject<{
    isBudgetConsumed: boolean;
    isCommitmentIdFilled: boolean;
  }>({ isBudgetConsumed: false, isCommitmentIdFilled: false });

  budjetPlannerErrorState$ = this.budgetPlannerErrorSubject.asObservable();

  private canGetBudgetDetailsSubject = new BehaviorSubject<boolean>(false);
  canGetBudgetDetailsstate$ = this.canGetBudgetDetailsSubject.asObservable();

  private RFPUserRoleAndDeptSubject = new BehaviorSubject<boolean>(false);
  RFPUserRoleAndDept$ = this.RFPUserRoleAndDeptSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  private isSearchRFPMenuActiveSubject = new BehaviorSubject<(boolean)>(false)
  isSearchRFPMenuActive$ = this.isSearchRFPMenuActiveSubject.asObservable()

  constructor(
    private api: ApiService,
    public cs: CommonService,
    private spinner: NgxSpinnerService
  ) {
  }
  /**
   * Filter the Document Types array based on the document type id.
   *
   * @param selectedDocumentId  `selectedDocumentId` {@link DocumentTypeId}
   * @returns `DocumentType[]` refer {@link DocumentType}
   */
  filterDocumentTypeWithId(selectedDocumentId: DocumentTypeId): DocumentType[] {
    return dtypes.filter((element: any) => selectedDocumentId === element.id);
  }

  getTechnicalMemberFormat(
    technicalMembers: string[],
    managerSubId: string
  ): TechMemberDetail[] {
    return technicalMembers.map((member: string) => {
      return {
        RfpNo: '',
        RfpVersion: '',
        IsManagerSelected: member === managerSubId ? 'X' : '',
        SrNo: '',
        TecMemId: member,
        TecMemName: '',
        TecMemNameAr: '',
      };
    });
  }

  getTechnicalMemberId(technicalMembers: any[]): string[] {
    return technicalMembers.map((member: any) => {
      return member.TecMemId;
    });
  }

  getCommitmentItems() {
    this.api
      .get('get-commitment-items')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.commitmentItemsSubject.next(res.d.results);
        },
        (err) => {
          this.cs.createMessage('error', err.statusText);
        }
      );
  }

  getInternalOrders(commitmentItem: string): Observable<InternalOrder[]> {
    return this.api
      .get(`get-internal-orders?commitment_id=${commitmentItem}`)
      .pipe(
        map((res: any) => res.d.results as InternalOrder[])
      );
  }

  getAvailableBudget(commitmentItem: string, internalOrder: string, year: string): Observable<AvailableBuget> {
  return this.api
    .get(
      `get-available-budget?CommitmentItem=${encodeURIComponent(commitmentItem)}&InternalOrder=${encodeURIComponent(internalOrder)}&Year=${encodeURIComponent(year)}`
    )
    .pipe(
      map((res: any) => res.d as AvailableBuget)
    );
}
  getBudgetingItems(rfpNo: string, rfpVersion: string): Observable<any> {
    return this.api.get(
      `rfp-budgeting-details?rfpno=${rfpNo}&RfpVersion=${rfpVersion}`
    );
  }
  getSplittedBudgetingItems(
    rfpNo: string,
    rfpVersion: string
  ): Observable<any> {
    return this.api.get(
      `rfp-splited-budget-details?rfpno=${rfpNo}&RfpVersion=${rfpVersion}`
    );
  }

  postRFPBudgetSplit(budgetSplit: PlannedBudget): Observable<any> {
    return this.api.post('rfp-budget-split', budgetSplit);
  }

  PostRFPBudget(budget: BudgetServiceLineItemToPost): Observable<any> {
    return this.api.post('rfp-budget', budget);
  }

  getCreatedRFPBudgetDetails(
    rfpNo: string,
    rfpVersion: string
  ): Observable<any> {
    return this.api.get(
      `rfp-budget-details?rfpno=${rfpNo}&RfpVersion=${rfpVersion}`
    );
  }

  setBudgetPlannerErrorState(
    isBudgetConsumed: boolean,
    isCommitmentIdFilled: boolean
  ) {
    this.budgetPlannerErrorSubject.next({
      isBudgetConsumed,
      isCommitmentIdFilled,
    });
  }
  setCanGetBudgetdetailsState(isCreated: boolean) {
    this.canGetBudgetDetailsSubject.next(isCreated);
  }

  setUserRoleAndDept(isFinteam: boolean) {
    this.RFPUserRoleAndDeptSubject.next(isFinteam);
  }

  transformToReqToBuddrNavg(boqTabelList:any[]): any[] {
    return boqTabelList.map((item: any) => ({
      RfpNo: item.RfpNo || '0000000000',
      RfpVersion: item.RfpVersion || '00000',
      ItmYear: item.budgetYear ? item.budgetYear.toString() : '',
      ItmAmount: item.Price ? item.Price.toString() : '',
      CommItm: item.CommItm ||'',
      NoYears: item.NoYears || '0001', // default to 1 year if not specified
      IntOrd: item.IntOrd || '',
    }));
  }

  transformToReqToBudsrNavg(boqTabelList:any[]): any[] {
    return boqTabelList.map((item: any, index: number) => ({
      ItemNo: (index + 1).toString(),
      RfpNo: item.RfpNo || '',
      RfpVersion: item.RfpVersion || '',
      ItemName: item.MaterialText || '',
      Uom: item.Uom,
      Quantity: item.Quantity ? parseFloat(item.Quantity).toFixed(3) + ' ' : '',
      RemQuan: '0.000 ',
      UnitPrice: item.Price ? parseFloat(item.Price).toFixed(2) + ' ' : '',
      TotPriWoVat: item.totalEstimatedPrice ? parseFloat(item.totalEstimatedPrice).toFixed(2) + ' ' : '',
      TotPriVat: item.totalEstimatedPriceVAT ? parseFloat(item.totalEstimatedPriceVAT).toFixed(2) + ' ' : '',
      BudYear: item.budgetYear ? item.budgetYear.toString() : '',
      CommItm: item.CommItm ||'',
      IntOrd: item.IntOrd || '',
      BudVat: item.totalEstimatedPriceVAT ? parseFloat(item.totalEstimatedPriceVAT).toFixed(2) + ' ' : '',
      SaveDraft: 'f',
    }));
  }

  transformToMasterBOQ(boqTabelList:any[]): any[]{
    return boqTabelList.map((item:any, index:number)=>({
      ItemNo: (index + 1).toString(),
      CostCenter: item.CostCenter,
      ItemDescription: item.ItemDescription,
      MaterialText: item.MaterialText,
      Price: '',
      PurGrpId: '',
      Quantity:'',
      RfpNo:'',
      Uom: item.Uom
    }))
  }

  transformToBoqTableList(boqDetails: any[], ReqToBoqNavg: any[]): any[] {
    return boqDetails.map((item: any, index: number) => ({
      RfpNo: item.RfpNo || '',
      ItemNo: parseInt(item.ItemNo) || index + 1,  // fallback to index if missing
      MaterialText: item.ItemName || '',
      ItemDescription: (
        ReqToBoqNavg.find((boqMasterItem: any) => parseInt(boqMasterItem.ItemNo) === parseInt(item.ItemNo)) && 
        ReqToBoqNavg.find((boqMasterItem: any) => parseInt(boqMasterItem.ItemNo) === parseInt(item.ItemNo)).ItemDescription
      ) || '', // optional, not present in API
      CostCenter: item.CostCenter || '', // optional, not present in API
      Quantity: parseFloat(item.Quantity ? item.Quantity.trim() : '0') || 0,
      Uom: item.Uom || '', // optional, not present in API
      Price: parseFloat(item.UnitPrice ? item.UnitPrice.trim() : '0') || 0,
      budgetYear: item.BudYear || '',
      applyForAllBudgetYears: false, // default as not returned by API
      CommItm: item.CommItm ||'',
      IntOrd: item.IntOrd || '',
    }));
  }

  setRFPUserDetails(userDetails: RFPUserRoleInfo){
    this.RFPUserDetailsSubject.next(userDetails)
  }

  getRfpUserDetails(
    rfpNo: string,
    rfpVersion: string,
    logonUsr: string
  ): Observable<any> {
    return this.api.get(
      `/get-RFP-user-details?rfpno=${rfpNo}&RfpVersion=${rfpVersion}&LogonUsr=${logonUsr}`
    );
  }

  setIsSearchRFPMenuActive(isActive: boolean){
    this.isSearchRFPMenuActiveSubject.next(isActive)
  }
  
  

  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // Ticket management methods for compatibility
  getTickets(): Ticket[] {
    return this.tickets;
  }

  addTicket(ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Ticket {
    const now = new Date();
    const newTicket: Ticket = {
      ...ticket,
      id: this.idCounter++,
      ticketNumber: `TKT-${String(this.idCounter).padStart(6, '0')}`,
      createdAt: now,
      updatedAt: now
    };
    this.tickets.push(newTicket);
    return newTicket;
  }

  updateTicketStatus(id: number, status: string): Ticket | null {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tickets[index] = { 
        ...this.tickets[index], 
        status,
        updatedAt: new Date()
      };
      return this.tickets[index];
    }
    return null;
  }

  updateTicket(id: number, updates: Partial<Ticket>): Ticket | null {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tickets[index] = { ...this.tickets[index], ...updates };
      return this.tickets[index];
    }
    return null;
  }

  deleteTicket(id: number): boolean {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tickets.splice(index, 1);
      return true;
    }
    return false;
  }
}
