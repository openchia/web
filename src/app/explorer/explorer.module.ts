import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgTerminalModule } from 'ng-terminal';

import { MaxLengthPipe } from '../pipes/maxlength.pipe';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExplorerComponent } from './explorer.component';
import { FarmerComponent } from './farmer/farmer.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [DashboardComponent, ExplorerComponent, FarmerComponent, LoginComponent, MaxLengthPipe,],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    NgbModule,
    NgxChartsModule,
    NgxFilesizeModule,
    NgTerminalModule,
  ]
})
export class ExplorerModule { }
