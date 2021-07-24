import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgTerminalModule } from 'ng-terminal';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExplorerComponent } from './explorer.component';
import { FarmerComponent } from './farmer/farmer.component';

@NgModule({
  declarations: [DashboardComponent, ExplorerComponent, FarmerComponent],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    NgbModule,
    NgxChartsModule,
    NgTerminalModule,
  ]
})
export class ExplorerModule { }
