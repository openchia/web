import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ExplorerComponent } from './explorer/explorer.component';
import { JoinComponent } from './join/join.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes =[
    { path: 'explorer',         component: ExplorerComponent },
    { path: 'join',             component: JoinComponent },
    { path: 'landing',          component: LandingComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
