import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';
import { NoroleComponent } from './pages/norole/norole.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'rfp/home',
    pathMatch: 'full'
  },
  // {     // afreen commented
  //   path: 'noaccess' ,
  //   component: NoroleComponent,
  //   canActivate:[AuthGuardGuard]
  // },

  
  
  { path: 'rfp', loadChildren: () => import('./pages/RFP/rfp.module').then(m => m.RFPModule)},
  
  { path: 'coc', loadChildren: () => import('./pages/COC/coc.module').then(m => m.COCModule)},
  
  { path: 'committee', loadChildren: () => import('./pages/COMMITTEE/committee.module').then(m => m.CommitteeModule)},
  
  { path: 'contract', loadChildren: () => import('./pages/CONTRACT/contract.module').then(m => m.ContractModule)},

  { path: 'admin', loadChildren: () => import('./pages/Admin/admin.module').then(m => m.AdminModule)},
  
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
