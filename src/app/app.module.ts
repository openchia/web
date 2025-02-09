import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxFilesizeModule } from 'ngx-filesize';

import { AppRoutingModule } from './app.routing';
import { ExplorerModule } from './explorer/explorer.module';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { StatsComponent } from './stats/stats.component';
import { FeesComponent } from './fees/fees.component';
import { FaqComponent } from './faq/faq.component';
import { TermsComponent } from './terms/terms.component';
import { PartnersComponent } from './partners/partners.component';
import { ReferralComponent } from './referral/referral.component';
import { GiveawayComponent } from './giveaway/giveaway.component';
import { CalculatorComponent } from './calculator/calculator.component';

@NgModule({ declarations: [
        AppComponent,
        LandingComponent,
        NavbarComponent,
        FooterComponent,
        StatsComponent,
        FeesComponent,
        FaqComponent,
        TermsComponent,
        PartnersComponent,
        ReferralComponent,
        GiveawayComponent,
        CalculatorComponent,
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        NgbModule,
        FormsModule,
        RouterModule,
        AppRoutingModule,
        ExplorerModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        ClipboardModule,
        NgxFilesizeModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] }
)

export class AppModule { }
