import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExplorerComponent } from './explorer.component';
import { FarmerComponent } from './farmer/farmer.component';

@NgModule({
  declarations: [DashboardComponent, ExplorerComponent, FarmerComponent],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    NgxChartsModule,
  ]
})
export class ExplorerModule { }
