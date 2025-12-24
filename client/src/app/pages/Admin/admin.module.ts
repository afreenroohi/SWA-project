import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RFPMaintenanceComponent } from "./rfp-maintenance/rfp-maintenance.component";
import { SlaComponent } from "./sla/sla.component";
import { TranslateModule } from "@ngx-translate/core";
import { antModule } from "src/app/shared/ant.module";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DelegationComponent } from "./delegation/delegation.component";
import { CommitteeMemberMaintenanceComponent } from './committee-member-maintenance/committee-member-maintenance.component';
import { SharedCustomModule } from "src/app/shared/shared-custom.module";
import { TicketsComponent } from './tickets/tickets.component';

import { InitiativesComponent } from './initiatives/initiatives.component';

const routes: Routes = [
    {
        path: 'delegation',
        component: DelegationComponent
    },
    {
        path: 'rfpMaintenance',
        component: RFPMaintenanceComponent
    },
    {
        path: 'sla',
        component: SlaComponent
    },
    {
        path: 'committeeMemberMaintenance',
        component: CommitteeMemberMaintenanceComponent
    },
    {
        path: 'tickets',
        component: TicketsComponent
    },
    {
        path: 'initiatives',
        component: InitiativesComponent
    }
]

@NgModule({
    declarations: [
        RFPMaintenanceComponent,
        DelegationComponent,
        SlaComponent,
        CommitteeMemberMaintenanceComponent,
        TicketsComponent,
        InitiativesComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        antModule,
        ComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedCustomModule,
        RouterModule.forChild(routes)
    ]
})

export class AdminModule { }