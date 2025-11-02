// Initial Packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Packages
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgChartsModule } from 'ng2-charts';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TranslateModule } from '@ngx-translate/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

// Routing Module
import { DashboardRoutingModule } from './dashboard-routing.module';

// Shared Modules
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedCustomModule } from 'src/app/shared/shared-custom.module';

// Components
import { DashboardComponent } from './dashboard.component';
import { CardComponent } from './components/card/card.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { TopFiveCardComponent } from './components/top-five-card/top-five-card.component';
import { TableComponent } from './components/table/table.component';
import { VendorPopupComponent } from './components/vendor-popup/vendor-popup.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent,
    TopFiveCardComponent,
    TableComponent,
    VendorPopupComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedCustomModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    ComponentsModule,
    NgChartsModule,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzFormModule,
    FormsModule,
    TranslateModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
    NzModalModule,
    NzSkeletonModule
  ]
})
export class DashboardModule { }
