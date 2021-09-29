import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('name') name: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('notifyMissingPartials') notifyMissingPartials: ElementRef;
  @ViewChild('referrer') referrer: ElementRef;

  tabActive = 1;

  loggingIn: boolean = true;
  loggedIn: boolean = false;
  error: boolean = false;
  nameError: string = '';
  emailError: string = '';
  notifyMissingPartialsError: string = '';
  referrerError: string = '';
  farmer: any = {};

  referrals$: Observable<any[]>;
  referralsCollectionSize: number = 0;
  referralsPage: number = 1;
  referralsPageSize: number = 100;

  referrerValue: string = '';

  constructor(private dataService: DataService, private route: ActivatedRoute,
    private router: Router) {
    this.referrals$ = dataService.referrals$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.dataService.doLogin(data).subscribe(
        success => {
          this.loggingIn = false;
          this.loggedIn = true;
          this.dataService.getLauncher(data.launcher_id).subscribe(launcher => {
            this.farmer = launcher;
            if(launcher['referrer'] !== null) {
              this.referrerValue = launcher['referrer'];
            } else {
              this.referrerValue = localStorage.getItem('referrer');
            }
            this.dataService.getReferrals({ referrer: launcher['launcher_id'] });
          });

        },
        error => {
          this.loggingIn = false;
          this.error = true;
        }
      );
    });

  }

  refreshBlocks() {
    this.dataService.getReferrals({ referrer: this.farmer['launcher_id'], offset: (this.referralsPage - 1) * this.referralsPageSize });
  }

  submit() {
    this.nameError = '';
    this.emailError = '';
    this.notifyMissingPartialsError = '';
    this.referrerError = '';
    this.dataService.updateLauncher(this.farmer.launcher_id, {
      "name": this.name.nativeElement.value,
      "email": (this.email.nativeElement.value) ? this.email.nativeElement.value : null,
      "notify_missing_partials_hours": (this.notifyMissingPartials.nativeElement.checked) ? 1 : null,
      "referrer": (this.referrer.nativeElement.value) ? this.referrer.nativeElement.value : null,
    }).subscribe(
      data => {
        this.router.navigate(['/explorer/farmer', this.farmer.launcher_id]);
      },
      error => {
        this.nameError = error.error?.name;
        this.emailError = error.error?.email;
        this.notifyMissingPartialsError = error.error?.notify_missing_partials_hours;
        this.referrerError = error.error?.referrer;
      }
    );
  }

}
