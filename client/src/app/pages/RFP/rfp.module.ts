import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRFPComponent } from './rfp/create-rfp/create-rfp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { antModule } from 'src/app/shared/ant.module';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { BudgetAllocComponent } from './Budget/budget-alloc/budget-alloc.component';
import { RfplistComponent } from './rfp/rfplist/rfplist.component';
import { MyrfpComponent } from './rfp/myrfp/myrfp.component';
import { RfpdetailsComponent } from './rfp/rfpdetails/rfpdetails.component';
import { MyinboxComponent } from './Inbox/myinbox/myinbox.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RfpchangeComponent } from './rfp/rfpchange/rfpchange.component';
import { RfptableComponent } from './rfp/rfptable/rfptable.component';
import { ListComponent } from './Budget/list/list.component';
import { AuthGuardGuard } from 'src/app/auth-guard.guard';
import { RfpdetailviewComponent } from './rfp/rfpdetailview/rfpdetailview.component';
import { DashbardComponent } from './dashbard/dashbard.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ComponentsModule } from 'src/app/components/components.module';
import { BudgetPlannerComponent } from './components/budget-planner/budget-planner.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { BudgetPlannerStepperFormComponent } from './components/budget-planner-stepper-form/budget-planner-stepper-form.component';
import { BudgetPlannerStepperComponent } from './components/budget-planner-stepper/budget-planner-stepper.component';
import { BudgetPlannerTableComponent } from './components/budget-planner-table/budget-planner-table.component';
import { BudgetPlannerStepOneComponent } from './components/budget-planner-step-one/budget-planner-step-one.component';
import { BudgetPlannerStepTwoComponent } from './components/budget-planner-step-two/budget-planner-step-two.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { BudgetPlannerBOQTabelComponent } from './components/budget-planner-boq-tabel/budget-planner-boq-tabel.component';
import { NgChartsModule } from 'ng2-charts';
import { PrequalificationComponent } from './prequalification/prequalification.component';
import { PrequalificationViewComponent } from './prequalification-view/prequalification-view.component';


const routes: Routes = [
  {
    path: 'create',
    component: CreateRFPComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role: 'Requestor',
    // },
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'list',
    component: RfplistComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
  },

  {
    path: 'dashboard',
    component: DashbardComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
  },
  {
    path: 'prequalification',
    component: PrequalificationComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
  },
  {
    path: 'prequalification-view',
    component: PrequalificationViewComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
  },
  {
    path: 'budget',
    component: BudgetAllocComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role: 'Requestor',
    // },
  },
  {
    path: 'budgetrequest',
    component: ListComponent,
    canActivate: [AuthGuardGuard],
    //  canActivate: [MsalGuard]
  },
  {
    path: 'myrfp',
    component: MyrfpComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role: 'Requestor',
    // },
  },

  {
    path: 'details',
    component: RfpdetailsComponent,
    canActivate: [AuthGuardGuard],
    //  canActivate: [MsalGuard]
  },
  {
    path: 'detail',
    component: RfpdetailviewComponent,
    // canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard]
  },
  {
    path: 'change',
    component: RfpchangeComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role: 'Requestor',
    // },
  },
  {
    path: 'myinbox',
    component: MyinboxComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role: 'Approver',
    // },
  },
];

@NgModule({
  declarations: [
    CreateRFPComponent,
    HomeComponent,
    BudgetAllocComponent,
    RfplistComponent,
    MyrfpComponent,
    RfpdetailsComponent,
    MyinboxComponent,
    RfpchangeComponent,
    RfptableComponent,
    ListComponent,
    RfpdetailviewComponent,
    DashbardComponent,
    BudgetPlannerComponent,
    BudgetPlannerStepperFormComponent,
    BudgetPlannerStepperComponent,
    BudgetPlannerTableComponent,
    BudgetPlannerStepOneComponent,
    BudgetPlannerStepTwoComponent,
    BudgetPlannerBOQTabelComponent,
    PrequalificationComponent,
    PrequalificationViewComponent,
    // IconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    antModule,
    NgxSpinnerModule,
    NzDividerModule,
    IconsProviderModule,
    ComponentsModule,
    NzDrawerModule,
    NzCollapseModule,
    NgChartsModule,
    RouterModule.forChild(routes)

  ],
  providers: [

  ]
})
export class RFPModule { }
