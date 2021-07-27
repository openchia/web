import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { FaqComponent } from './faq/faq.component';
import { FeesComponent } from './fees/fees.component';
import { JoinComponent } from './join/join.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes =[
    { path: 'join',             component: JoinComponent },
    { path: 'faq',             component: FaqComponent },
    { path: 'fees',             component: FeesComponent },
    { path: 'landing',          component: LandingComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
