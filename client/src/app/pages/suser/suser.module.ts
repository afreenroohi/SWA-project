import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { antModule } from "src/app/shared/ant.module";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedCustomModule } from "src/app/shared/shared-custom.module";
import { TicketsComponent } from '../Admin/tickets/tickets.component';
import { InitiativesComponent } from '../Admin/initiatives/initiatives.component';

const routes: Routes = [
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
    declarations: [],
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

export class SuserModule { }