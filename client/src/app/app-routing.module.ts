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
  //   path: 'noaccess' ,  // afreen commented ///////
  //   component: NoroleComponent,
  //   canActivate:[AuthGuardGuard]
  // },



  { path: 'rfp', loadChildren: () => import('./pages/RFP/rfp.module').then(m => m.RFPModule) },

  { path: 'coc', loadChildren: () => import('./pages/COC/coc.module').then(m => m.COCModule), canActivate: [AuthGuardGuard] },

  { path: 'committee', loadChildren: () => import('./pages/COMMITTEE/committee.module').then(m => m.CommitteeModule), canActivate: [AuthGuardGuard] },

  { path: 'contract', loadChildren: () => import('./pages/CONTRACT/contract.module').then(m => m.ContractModule), canActivate: [AuthGuardGuard] },

  { path: 'admin', loadChildren: () => import('./pages/Admin/admin.module').then(m => m.AdminModule) }, // canActivate: [AuthGuardGuard] },

  // { path: 'suser', loadChildren: () => import('./pages/suser/suser.module').then(m => m.SuserModule) },

  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuardGuard] },

  // { path: '**', redirectTo: 'rfp/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
