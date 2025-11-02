import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreteCOCComponent } from './crete-coc/crete-coc.component';
import { ProjOwnDashComponent } from './proj-own-dash/proj-own-dash.component';
import { antModule } from 'src/app/shared/ant.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { POTableComponent } from './potable/potable.component';
import { ProcurementComponent } from './procurement/procurement.component';
import { CoordinatorComponent } from './coordinator/coordinator.component';
import { ProcurementCreateComponent } from './procurement-create/procurement-create.component';
import { CordinatorUpdateComponent } from './cordinator-update/cordinator-update.component';
import { SESListComponent } from './seslist/seslist.component';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuardGuard } from 'src/app/auth-guard.guard';
import { MycocComponent } from './mycoc/mycoc.component';
import { ListOfDepartmentComponent } from './list-of-department/list-of-department.component';
import { ListOfOpenContractComponent } from './list-of-open-contract/list-of-open-contract.component';
import { CocWithContractComponent } from './coc-with-contract/coc-with-contract.component';
import { CocWithPoComponent } from './coc-with-po/coc-with-po.component';
import { ComponentsModule } from "../../components/components.module";
import { COCService } from './coc.service';
import { SharedCustomModule } from 'src/app/shared/shared-custom.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SignatureUploadComponent } from 'src/app/components/SignatureUpload/signature-upload.component';

// TODO: COC - Uncomment the 'canActivate' while moving COC to production

const routes: Routes = [
  {
    path: 'OwnerDashboard',
    component: ProjOwnDashComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_owner',
    // },
  },
  {
    path: 'create',
    component: CreteCOCComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_owner',
    // },
  },

  {
    path: 'update',
    component: CreteCOCComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_proc',
    // },
  },
  {
    path: 'comment',
    component: CordinatorUpdateComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },
  {
    path: 'PoDetails',
    component: POTableComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_owner',
    // },
  },
  {
    path: 'procurement',
    component: ProcurementComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_proc',
    // },
  },

  {
    path: 'coordinator',
    component: CoordinatorComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard,AuthGuardGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },

  {
    path: 'SES',
    component: SESListComponent,
    canActivate: [AuthGuardGuard],
    //canActivate: [MsalGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },

  {
    path: 'coclist',
    component: MycocComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },

  {
    path: 'listofdept',
    component: ListOfDepartmentComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },

  {
    path: 'listofcontractandpo',
    component: CocWithContractComponent,
    canActivate: [AuthGuardGuard],
    // canActivate: [MsalGuard],
    // data: {
    //   role1: 'COC_cord',
    // },
  },{
    path: 'signature_upload',
    component: SignatureUploadComponent,
    canActivate: [AuthGuardGuard],
  }
];

@NgModule({
  declarations: [
    CreteCOCComponent,
    ProjOwnDashComponent,
    POTableComponent,
    ProcurementComponent,
    CoordinatorComponent,
    ProcurementCreateComponent,
    CordinatorUpdateComponent,
    SESListComponent,
    MycocComponent,
    ListOfDepartmentComponent,
    ListOfOpenContractComponent,
    CocWithContractComponent,
    CocWithPoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    antModule,
    NgxSpinnerModule,
    IconsProviderModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    SharedCustomModule,
    NzGridModule
  ],
  providers: [
    COCService
  ],
})
export class COCModule { }
