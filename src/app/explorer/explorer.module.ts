import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxFilesizeModule } from 'ngx-filesize';

import { MaxLengthPipe } from '../pipes/maxlength.pipe';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExplorerComponent } from './explorer.component';
import { FarmerComponent } from './farmer/farmer.component';
import { LoginComponent } from './login/login.component';
import { RewardComponent } from './reward/reward.component';

@NgModule({
  declarations: [DashboardComponent, ExplorerComponent, FarmerComponent, LoginComponent, MaxLengthPipe, RewardComponent,],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    NgbModule,
    NgxChartsModule,
    NgxFilesizeModule,
  ]
})
export class ExplorerModule { }
