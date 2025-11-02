import { DpBidsToBeOpenedComponent } from './DP-Evaluation/dashboard/bids-to-be-opened/bids-to-be-opened.component';
import { PassFormDataService } from 'src/app/service/FormData/pass-form-data.service';
import { BEMemberDashboardComponent } from './BidEvaluationCommittee/member-dashboard/member-dashboard.component';
import { BEOfficerDashboardComponent } from './BidEvaluationCommittee/officer-dashboard/officer-dashboard.component';
import { BEChairmanDashboardComponent } from './BidEvaluationCommittee/chairman-dashboard/chairman-dashboard.component';
import { BOOfficerDashboardComponent } from './BidOpenCommittee/officer-dashboard/officer-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { antModule } from 'src/app/shared/ant.module';
import { BidopencreateComponent } from './BIDOPEN/bidopencreate/bidopencreate.component';
import { DpDashboardComponent } from './DP-Evaluation/dashboard/dashboard.component';
import { BOChairmanDashboardComponent } from './BidOpenCommittee/chairman-dashboard/chairman-dashboard.component';
import { BidopeningCommitteeComponent } from './BidOpenCommittee/bidopening-committee/bidopening-committee.component';
import { BidListComponent } from './bidList/bid-list/bid-list.component';
import { BidqualificationcommitteeComponent } from './bidqulificationcommittee/bidqualificationcommittee/bidqualificationcommittee.component';
import { CommitteeTableComponent } from './common-committee-table/committee-table.component';
import { BOMemberDashboardComponent } from './BidOpenCommittee/member-dashboard/member-dashboard.component';
import { BQChairmanDashboardComponent } from './BidQualificationCommittee/chairman-dashboard/chairman-dashboard.component';
import { BQMemberDashboardComponent } from './BidQualificationCommittee/member-dashboard/member-dashboard.component';
import { BQOfficerDashboardComponent } from './BidQualificationCommittee/officer-dashboard/officer-dashboard.component';
import { BidEvaluationCommitteeComponent } from './BIDOPEN/bid-evaluation/bid-evaluation-committee/bid-evaluation-committee.component';
import { DpEvaluationCommitteeComponent } from './DP-Evaluation/dp-evaluation-committee/dp-evaluation-committee.component';
import { BidsToEvaluateComponent } from './BidQualificationCommittee/chairman-dashboard/bids-to-evaluate/bids-to-evaluate.component';
import { QulificationCommitteeComponent } from './BidQualificationCommittee/chairman-dashboard/qulification-committee/qulification-committee.component';
import { BidsListComponent } from './BidQualificationCommittee/chairman-dashboard/bids-list/bids-list.component';
import { PendingApprovalComponent } from './BidQualificationCommittee/chairman-dashboard/pending-approval/pending-approval.component';
import { BidsToOpenComponent } from './BidEvaluationCommittee/chairman-dashboard/bids-to-open/bids-to-open.component';
import { BidsWithEvalCommitteeComponent } from './BidEvaluationCommittee/chairman-dashboard/bids-with-eval-committee/bids-with-eval-committee.component';
import { BidsToBeApprovedComponent } from './BidEvaluationCommittee/chairman-dashboard/bids-to-be-approved/bids-to-be-approved.component';
import { FromQualCommitteeComponent } from './BidEvaluationCommittee/chairman-dashboard/from-qual-committee/from-qual-committee.component';
import { BidstobapprovedDashboardComponent } from './BidOpenCommittee/bidstobapproved-dashboard/bidstobapproved-dashboard.component';
import { DpFromEvalCommitteeComponent } from './DP-Evaluation/dashboard/from-eval-committee/from-eval-committee.component';
import { DirectPurchaseListComponent } from './DP-Evaluation/dashboard/direct-purchase-list/direct-purchase-list.component';
import { DpBidsToBeEvaluatedComponent } from './DP-Evaluation/dashboard/bids-to-be-evaluated/bids-to-be-evaluated.component';
import { CEOComponent } from './Dashboards/ceo/ceo.component';
// import { BidsToBeEvaluatedComponent } from './DP-Evaluation/dashboard/bids-to-be-evaluated/bids-to-be-evaluated.component';
import { PendingreviewDashboardComponent } from './BidOpenCommittee/pendingreview-dashboard/pendingreview-dashboard.component';
import { BidstobeopenFinancialofficerDashboardComponent } from './BidOpenCommittee/bidstobeopen-financialofficer-dashboard/bidstobeopen-financialofficer-dashboard.component';
import { BidsFinalApprovalComponent } from './BidEvaluationCommittee/bids-final-approval/bids-final-approval.component';
import { BidsfinanceofferComponent } from './BidOpenCommittee/bidsfinanceoffer/bidsfinanceoffer.component';
import { FinalApproveComponent } from './DP-Evaluation/dashboard/final-approve/final-approve.component';
import { FinalApproveCharimanComponent } from './DP-Evaluation/dashboard/final-approve-chariman/final-approve-chariman.component';
import { ComponentsModule } from "../../components/components.module";
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SignatureUploadComponent } from '../../components/SignatureUpload/signature-upload.component';
import { BidEvalFinanceOfferComponent } from './BidEvaluationCommittee/chairman-dashboard/bidsfinanceoffer/bidevalfinanceoffer.component';
import { BidsFinanceOfferMemberComponent } from './BidOpenCommittee/bidsfinanceoffermember/bidsfinanceoffermember.component';
import { SharedCustomModule } from 'src/app/shared/shared-custom.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BidsFromFinanceComponent } from './BidEvaluationCommittee/chairman-dashboard/bids-from-finance/bids-from-finance.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { CommitteeService } from './committee.service';
import { DashboardComponent } from './technical-evaluation-committee/dashboard/dashboard.component';
import { WorkflowFormComponent } from './technical-evaluation-committee/workflow-form/workflow-form.component';
import { BidsToBeEvaluatedComponent } from './technical-evaluation-committee/bids-to-be-evaluated/bids-to-be-evaluated.component';
import { BidsFromTechMembersComponent } from './technical-evaluation-committee/bids-from-tech-members/bids-from-tech-members.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { TwoDecimalPipe } from 'src/app/pipes/two-decimal.pipe';
import { VendorFormComponent } from './vendor/vendor-form/vendor-form.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { DashboardComponent as NewDpDashboardComponent } from './dp-evaluation-committee/dashboard/dashboard.component';
import { WorkflowFormComponent as NewDpWorkflowComponent } from './dp-evaluation-committee/workflow-form/workflow-form.component';
import { BidsToBeOpenedComponent as NewDpBidsToBeOpenedComponent } from './dp-evaluation-committee/bids-to-be-opened/bids-to-be-opened.component';
import { BidsToBeEvaluatedComponent as NewDpBidsToBeEvaluatedComponent } from './dp-evaluation-committee/bids-to-be-evaluated/bids-to-be-evaluated.component';
import { BidsToBeApprovedComponent as NewDpBidsToBeApprovedComponent } from './dp-evaluation-committee/bids-to-be-approved/bids-to-be-approved.component';
import { FinalApprovalComponent as NewDpFinalApproval } from './dp-evaluation-committee/final-approval/final-approval.component';
const routes: Routes = [
  {
    path: 'Bid_Create',
    component: BidopencreateComponent
  },
  {
    path: 'Bid_Opening_Committe',
    component: BidopeningCommitteeComponent
  },
  {
    path: 'Bid_Pending_Review',
    component: PendingreviewDashboardComponent
  },
  {
    path: 'Bid_tobe_Financial_Offer',
    component: BidstobeopenFinancialofficerDashboardComponent
  },
  {
    path: 'Bid_Qualification_Committee',
    component: BidqualificationcommitteeComponent
  },
  {
    path: 'BidList',
    component: BidListComponent
  },
  {
    path:'bids_to_be_approved',
    component:BidstobapprovedDashboardComponent
  },


  {
    path: 'finalapproval',
    component: CEOComponent
  },
  {
    path: 'bo_chair_dashboard',
    component: BOChairmanDashboardComponent
  },
  {
    path: 'bo_officer_dashboard',
    component: BOOfficerDashboardComponent
  },
  {
    path: 'bo_member_dashboard',
    component: BOMemberDashboardComponent
  },

  {
    path: 'bids_to_be_approved',
    component: BidstobapprovedDashboardComponent
  },

  {
    path: 'bids_financial_offer',
    component: BidsfinanceofferComponent
  },

  {
    path: 'bids_financial_offer_member',
    component: BidsFinanceOfferMemberComponent
  },



  {
    path: 'bq_chair_dashboard/bid_to_evaluate',
    component: BidsToEvaluateComponent
  },
  {
    path: 'bq_chair_dashboard/pending_approval',
    component: PendingApprovalComponent
  },
  {
    path: 'bq_chair_dashboard/qualification_committee',
    component: QulificationCommitteeComponent
  },
  {
    path: 'bq_chair_dashboard/bids-list',
    component: BidsListComponent
  },


  {
    path: 'bq_officer_dashboard',
    component: BQOfficerDashboardComponent
  },
  {
    path: 'bq_member_dashboard',
    component: BQMemberDashboardComponent
  },
  {
    path: 'be_chair_dashboard',
    component: BEChairmanDashboardComponent
  },
  {
    path: 'be_chair_dashboard/bids_to_be_open',
    component: BidsToOpenComponent
  },
  {
    path: 'be_chair_dashboard/bids_with_eval_committee',
    component: BidsWithEvalCommitteeComponent
  },
  {
    path: 'be_chair_dashboard/bids_to_be_approved',
    component: BidsToBeApprovedComponent
  },
  {
    path: 'be_chair_dashboard/financial_controller_approval',
    component: BidsToBeApprovedComponent
  },
  {
    path: 'be_chair_dashboard/bids_from_technical_evaluation',
    component: BidsToBeApprovedComponent
  },
  {
    path: 'be_chair_dashboard/bids_to_eval_MEAW',
    component: BidsToBeApprovedComponent
  },

  {
    path: 'be_chair_dashboard/bids_financial_offer',
    component: BidEvalFinanceOfferComponent
  },
  {
    path: 'be_chair_dashboard/bids_from_financial',
    component: BidsFromFinanceComponent
  },
  {
    path: 'be_chair_dashboard/bids_final_approval',
    component: BidsFinalApprovalComponent
  },
  {
    path: 'be_chair_dashboard/from_qualification_committee',
    component: FromQualCommitteeComponent
  },
  {
    path: 'be_officer_dashboard',
    component: BEOfficerDashboardComponent
  },
  {
    path: 'be_member_dashboard',
    component: BEMemberDashboardComponent
  },
  {
    path: 'Bid_Eval',
    component: BidEvaluationCommitteeComponent
  },
  {
    path: 'dp_dashboard/bids_to_open',
    component: DpBidsToBeOpenedComponent
  },
  {
    path: 'dp_dashboard/from_evalution_member',
    component: DpFromEvalCommitteeComponent
  },
  {
    path: 'dp_dashboard/bid_list',
    component: BidListComponent
  },
  {
    path: `dp_dashboard/fromQualification`,
    component: DpFromEvalCommitteeComponent,
  },
  {
    path: 'dp_dashboard/bids_to_evaluate',
    component: DpBidsToBeEvaluatedComponent
  },
  {
    path: 'dp_dashboard/final_approval',
    component: FinalApproveComponent
  },

  {
    path: 'dp_dashboard/final_chariman_approval',
    component: FinalApproveCharimanComponent
  },
  {
    path: 'DP_Eval',
    component: WorkflowFormComponent
  },
  {
    path: 'signature_upload',
    component: SignatureUploadComponent
  },

  // * Technical Evaluation Routes
  {
    path: 'technical-evaluation/bids-to-be-evaluated',
    component: BidsToBeEvaluatedComponent
  },
  {
    path: 'technical-evaluation/bids-from-tech-members',
    component: BidsFromTechMembersComponent
  },
  {
    path: 'technical-evaluation/evaluation-form',
    component: WorkflowFormComponent
  },


  // * DP Evaluation Routes
  {
    path: 'dp-evaluation/bids-to-be-opened',
    component: NewDpBidsToBeOpenedComponent
  },
  {
    path: 'dp-evaluation/bids-to-be-evaluated',
    component: NewDpBidsToBeEvaluatedComponent
  },
  {
    path: 'dp-evaluation/bids-to-be-approved',
    component: NewDpBidsToBeApprovedComponent
  },
  {
    path: 'dp-evaluation/final-approval',
    component: NewDpFinalApproval
  },
  {
    path: 'dp-evaluation/form',
    component: NewDpWorkflowComponent
  },

  // * Vendor Routes 
  {
    path: 'vendor/vendor-list',
    component: VendorListComponent
  },
  {
    path: 'vendor/vendor-create',
    component: VendorFormComponent
  }

]

@NgModule({
  declarations: [
    FilterPipe,
    BidopencreateComponent,
    CommitteeTableComponent,
    DpDashboardComponent,
    BidopeningCommitteeComponent,
    BidListComponent,
    BidqualificationcommitteeComponent,
    BOChairmanDashboardComponent,
    BOMemberDashboardComponent,
    BOOfficerDashboardComponent,
    BQChairmanDashboardComponent,
    BQMemberDashboardComponent,
    BQOfficerDashboardComponent,
    BEChairmanDashboardComponent,
    BEOfficerDashboardComponent,
    BEMemberDashboardComponent,
    BidEvaluationCommitteeComponent,
    DpEvaluationCommitteeComponent,
    BidsToEvaluateComponent,
    QulificationCommitteeComponent,
    BidsListComponent,
    PendingApprovalComponent,
    BidsToOpenComponent,
    BidsWithEvalCommitteeComponent,
    BidsToBeApprovedComponent,
    FromQualCommitteeComponent,
    BidstobapprovedDashboardComponent,
    DpFromEvalCommitteeComponent,
    DirectPurchaseListComponent,
    DpBidsToBeEvaluatedComponent,
    DpBidsToBeOpenedComponent,
    CEOComponent,
    //BidsToBeEvaluatedComponent,
    PendingreviewDashboardComponent,
    BidstobeopenFinancialofficerDashboardComponent,
    BidsFinalApprovalComponent,
    BidsfinanceofferComponent,
    BidsFinanceOfferMemberComponent,
    FinalApproveComponent,
    FinalApproveCharimanComponent,
   // FileUploaderComponent,
   SignatureUploadComponent,
   BidEvalFinanceOfferComponent,
   BidsFromFinanceComponent,

   // * Technical Evaluation Components
   DashboardComponent, // ? Base dashboard
   WorkflowFormComponent, // ? Approver Form
   BidsToBeEvaluatedComponent, // ? Bids List for Chairman and Member
   BidsFromTechMembersComponent, // ? Bids List Chairman Final 

   // * Vendor 
   VendorListComponent, // ? Vendor List 
   VendorFormComponent, // ? Vendor Details

    // * DP Evaluation Committee
    NewDpDashboardComponent, // ? DP Dashboard / Table
    NewDpWorkflowComponent, // ? Workflow form
    NewDpBidsToBeApprovedComponent, // ? DP Bids to be approved
    NewDpBidsToBeEvaluatedComponent, // ? DP Bids to be evaluated
    NewDpBidsToBeOpenedComponent, // ? DP Bids to be opened
    NewDpFinalApproval // ? DP Final Approval

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    antModule,
    NgxSpinnerModule,
    IconsProviderModule,
    NzCollapseModule,
    NzCarouselModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    SharedCustomModule,
    NgbModule,
    NzDividerModule
  ],
  providers: [PassFormDataService, CommitteeService, FilterPipe, TwoDecimalPipe, DatePipe]
})
export class CommitteeModule { }
