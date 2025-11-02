import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { antModule } from 'src/app/shared/ant.module';
import { DashboardComponent } from './ContractUnitHead/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './ContractUnitHead/project-details/project-details.component';
import { OfficerDashboardComponent } from './ContractUnitOfficer/officer-dashboard/officer-dashboard.component';
import { ContractFormComponent } from './ContractUnitOfficer/contract-form/contract-form.component';
import { AmountToWordPipe } from './amount-to-word.pipe';
import { LegalManagerDashboardComponent } from './LegalManager/legal-manager-dashboard/legal-manager-dashboard.component';
import { AssignLegalHeadComponent } from './LegalManager/assign-legal-head/assign-legal-head.component';
import { LegalHeadDashboardComponent } from './LegalUnitHead/legal-head-dashboard/legal-head-dashboard.component';
import { AssignLegalOfficerComponent } from './LegalUnitHead/assign-legal-officer/assign-legal-officer.component';
import { LegalOfficerDashboardComponent } from './LegalUnitOfficer/legal-officer-dashboard/legal-officer-dashboard.component';
import { ContractPreparationFormComponent } from './LegalUnitOfficer/contract-preparation-form/contract-preparation-form.component';
import { ApproveContractComponent } from './LegalUnitHead/approve-contract/approve-contract.component';
import { ApproveContractCHComponent } from './ContractUnitHead/approve-contract-ch/approve-contract-ch.component';
import { RfpManagerDashboardComponent } from './RfpManager/rfp-manager-dashboard/rfp-manager-dashboard.component';
import { RfpManagerDetailsComponent } from './RfpManager/rfp-manager-details/rfp-manager-details.component';
import { ContractManagerDashboardComponent } from './ContractManager/contract-manager-dashboard/contract-manager-dashboard.component';
import { ContractManagerDetailsComponent } from './ContractManager/contract-manager-details/contract-manager-details.component';
import { SsDirectorDashboardComponent } from './SupportServicesDirector/ss-director-dashboard/ss-director-dashboard.component';
import { SsDirectorDetailsComponent } from './SupportServicesDirector/ss-director-details/ss-director-details.component';
import { VpCorServDashboardComponent } from './VPCorporateServices/vp-cor-serv-dashboard/vp-cor-serv-dashboard.component';
import { VpCorServDetailsComponent } from './VPCorporateServices/vp-cor-serv-details/vp-cor-serv-details.component';
import { ContractListComponent } from './Common/contract-list/contract-list.component';
import { ComponentsModule } from "../../components/components.module";
import { ContractPreparationComponent } from './ContractUnitHead/dashboard/contract-preparation/contract-preparation.component';
import { ContractApprovalComponent } from './ContractUnitHead/dashboard/contract-approval/contract-approval.component';
import { LuhAssignmentComponent } from './LegalUnitHead/legal-head-dashboard/luh-assignment/luh-assignment.component';
import { LuhApprovalComponent } from './LegalUnitHead/legal-head-dashboard/luh-approval/luh-approval.component';
import { ContOfficerContractCreateComponent } from './ContractUnitOfficer/officer-dashboard/contract-create/contract-create.component';
import { ContOfficerRmiComponent } from './ContractUnitOfficer/officer-dashboard/rmi/rmi.component';
import { LMContractAssignmentComponent } from './LegalManager/legal-manager-dashboard/contract-assignment/contract-assignment.component';
import { LMContractApprovalComponent } from './LegalManager/legal-manager-dashboard/contract-approval/contract-approval.component';
import { LORequestContractPreparationComponent } from './LegalUnitOfficer/legal-officer-dashboard/request-contract-preparation/request-contract-preparation.component';
import { LOReturnFromRmiComponent } from './LegalUnitOfficer/legal-officer-dashboard/return-from-rmi/return-from-rmi.component';
import { LOReturnFromApprovalComponent } from './LegalUnitOfficer/legal-officer-dashboard/return-from-approval/return-from-approval.component';
import { RFPRmiComponent } from './RfpManager/rfp-manager-dashboard/rmi/rmi.component';
import { RFPContractApprovalComponent } from './RfpManager/rfp-manager-dashboard/contract-approval/contract-approval.component';
import { RfpRmiComponent } from './RfpManager/rfp-rmi/rfp-rmi.component';
import { RfpReturnComponent } from './RfpManager/rfp-return/rfp-return.component';
import { CommentsComponent } from './Common/comments/comments.component';
import { HijriDatepickerComponent } from './Common/hijri-datepicker/hijri-datepicker.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputMaskModule } from '@ngneat/input-mask';
import { SignatureUploadComponent } from './SignatureUpload/signature-upload.component';
import { SharedCustomModule } from 'src/app/shared/shared-custom.module';
import { ManagerApprovalComponent } from './LegalManager/manager-approval/manager-approval.component';
import { ReturnFromApprovalComponent } from './ContractUnitOfficer/officer-dashboard/return-from-approval/return-from-approval.component';
import { CommitteeService } from '../COMMITTEE/committee.service';
import { ContractCreationFormComponent } from './ContractCreator/contract-creation-form/contract-creation-form.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';

const routes: Routes = [
  {
    path: 'dashboard/prep',
    component: ContractPreparationComponent,
  },
  {
    path: 'dashboard/approve',
    component: ContractApprovalComponent,
  },
  {
    path: 'details',
    component: ProjectDetailsComponent
  },
  {
    path: 'approveContractCUH',
    component: ApproveContractCHComponent
  },
  {
    path: 'officerDashboard/ContCrt',
    component: ContOfficerContractCreateComponent
  },
  {
    path: 'officerDashboard/rmi',
    component: ContOfficerRmiComponent
  },
  {
    path: 'officerDashboard/returnFromApproval',
    component: ReturnFromApprovalComponent
  },
  {
    path: 'contractForm',
    component: ContractFormComponent
  },
  {
    path: 'legalManagerDashboard/Approve',
    component: LMContractApprovalComponent
  },
  {
    path: 'legalManagerDashboard/Assign',
    component: LMContractAssignmentComponent
  },
  {
    path: 'assignLegalHead',
    component: AssignLegalHeadComponent
  },
  {
    path: 'approveContractLM',
    component: ManagerApprovalComponent
  },
  {
    path: 'legalHeadDashboard/assign',
    component: LuhAssignmentComponent
  },
  {
    path: 'legalHeadDashboard/approve',
    component: LuhApprovalComponent
  },
  {
    path: 'assignLegalOfficer',
    component: AssignLegalOfficerComponent
  },
  {
    path: 'approveContract',
    component: ApproveContractComponent
  },
  {
    path: 'legalOfficerDashboard/ContPrep',
    component: LORequestContractPreparationComponent
  },
  {
    path: 'legalOfficerDashboard/RetFrAppr',
    component: LOReturnFromApprovalComponent
  },
  {
    path: 'legalOfficerDashboard/RetFrRmi',
    component: LOReturnFromRmiComponent
  },
  {
    path: 'contractPrepForm/:project_name/:award_number',
    component: ContractPreparationFormComponent
  },
  {
    path: 'RfpManagerDashboard/ContAppr',
    component: RFPContractApprovalComponent
  },
  {
    path: 'RfpManagerDashboard/Rmi',
    component: RFPRmiComponent
  },
  {
    path: 'RfpManagerDetails',
    component: RfpManagerDetailsComponent
  },
  {
    path: 'RfpManagerRmi',
    component: RfpReturnComponent
  },
  {
    path: 'ContractManagerDashboard',
    component: ContractManagerDashboardComponent
  },
  {
    path: 'ContractManagerDetails',
    component: ContractManagerDetailsComponent
  },
  {
    path: 'SsDirectorDashboard',
    component: SsDirectorDashboardComponent
  },
  {
    path: 'SsDirectorDetails',
    component: SsDirectorDetailsComponent
  },
  {
    path: 'VpCorServDashboard',
    component: VpCorServDashboardComponent
  },
  {
    path: 'VpCorServDetails',
    component: VpCorServDetailsComponent
  },
  {
    path: 'ContractList',
    component: ContractListComponent
  },
  {
    path: 'signature_upload',
    component: SignatureUploadComponent
  },
  {
    path: 'create-contract',
    component: ContractCreationFormComponent
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectDetailsComponent,
    OfficerDashboardComponent,
    ContractFormComponent,
    AmountToWordPipe,
    LegalManagerDashboardComponent,
    AssignLegalHeadComponent,
    LegalHeadDashboardComponent,
    AssignLegalOfficerComponent,
    LegalOfficerDashboardComponent,
    ContractPreparationFormComponent,
    ApproveContractComponent,
    ApproveContractCHComponent,
    RfpManagerDashboardComponent,
    RfpManagerDetailsComponent,
    ContractManagerDashboardComponent,
    ContractManagerDetailsComponent,
    SsDirectorDashboardComponent,
    SsDirectorDetailsComponent,
    VpCorServDashboardComponent,
    VpCorServDetailsComponent,
    ContractListComponent,
    ContractPreparationComponent,
    ContractApprovalComponent,
    LuhAssignmentComponent,
    LuhApprovalComponent,
    ContOfficerContractCreateComponent,
    ContOfficerRmiComponent,
    LMContractAssignmentComponent,
    LMContractApprovalComponent,
    LORequestContractPreparationComponent,
    LOReturnFromRmiComponent,
    LOReturnFromApprovalComponent,
    RFPRmiComponent,
    RFPContractApprovalComponent,
    RfpReturnComponent,
    CommentsComponent,
    ManagerApprovalComponent,
    HijriDatepickerComponent,
    SignatureUploadComponent,
    ReturnFromApprovalComponent,
    ContractCreationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule,
    antModule,
    NgxSpinnerModule,
    IconsProviderModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    InputMaskModule,
    SharedCustomModule,
    NzDividerModule
  ],
  providers: [CommitteeService]
})
export class ContractModule { }
