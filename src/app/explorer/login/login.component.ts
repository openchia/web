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
  @ViewChild('minPayout') minPayout: ElementRef;
  @ViewChild('customDifficulty') customDifficulty: ElementRef;
  @ViewChild('customDifficultyValue') customDifficultyValue: ElementRef;
  @ViewChild('referrer') referrer: ElementRef;

  @ViewChild('notifyPaymentEmail') notifyPaymentEmail: ElementRef;
  @ViewChild('notifyPaymentPush') notifyPaymentPush: ElementRef;
  @ViewChild('notifySizeDropEmail') notifySizeDropEmail: ElementRef;
  @ViewChild('notifySizeDropPush') notifySizeDropPush: ElementRef;
  @ViewChild('notifySizeDropInterval') notifySizeDropInterval: ElementRef;
  @ViewChild('notifySizeDropPercent') notifySizeDropPercent: ElementRef;

  tabActive = 1;

  loggingIn: boolean = true;
  loggedIn: boolean = false;
  error: boolean = false;
  customDifficultyError: string = '';
  difficultyValue: string = '';
  nameError: string = '';
  emailError: string = '';
  notifyMissingPartialsError: string = '';
  minPayoutError: string = '';
  referrerError: string = '';
  farmer: any = {};

  notifyPaymentError: string = '';
  notifySizeDropError: string = '';
  notifySizeDropPercentError: string = '';
  notifySizeDropIntervalError: string = '';

  referrals$: Observable<any[]>;
  referralsCollectionSize: number = 0;
  referralsPage: number = 1;
  referralsPageSize: number = 100;

  referrerValue: string = '';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.referrals$ = dataService.referrals$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      if(!data.launcher_id) {
        this.dataService.getLoggedIn().subscribe(res => {
          if(res['launcher_id']) {
            this.onLoggedIn(res['launcher_id']);
          } else {
            this.loggingIn = false;
            this.error = true;
          }
        })
      } else {
        this.dataService.doLogin(data).subscribe(
          success => {
            this.onLoggedIn(data.launcher_id);
          },
          error => {
            this.loggingIn = false;
            this.error = true;
          }
        );
      }
    });

  }

  onLoggedIn(launcher_id) {
    this.loggingIn = false;
    this.loggedIn = true;
    this.dataService.getLauncher(launcher_id).subscribe(launcher => {
      this.farmer = launcher;
      if(launcher['referrer'] !== null) {
        this.referrerValue = launcher['referrer'];
      } else {
        this.referrerValue = localStorage.getItem('referrer');
      }
      this.dataService.getReferrals({ referrer: launcher['launcher_id'] });
    });
  }

  refreshBlocks() {
    this.dataService.getReferrals({ referrer: this.farmer['launcher_id'], offset: (this.referralsPage - 1) * this.referralsPageSize });
  }

  submit() {
    this.customDifficultyError = '';
    this.nameError = '';
    this.emailError = '';
    this.minPayoutError = '';
    this.notifyMissingPartialsError = '';
    this.referrerError = '';
    this.notifyPaymentError = '';
    this.notifySizeDropError = '';
    this.notifySizeDropIntervalError = '';
    this.notifySizeDropPercentError = '';

    var payment: string[] = [];
    if(this.notifyPaymentEmail.nativeElement.checked) {
      payment.push('EMAIL');
    }
    if(this.notifyPaymentPush.nativeElement.checked) {
      payment.push('PUSH');
    }

    var size_drop: string[] = [];
    if(this.notifySizeDropEmail.nativeElement.checked) {
      size_drop.push('EMAIL');
    }
    if(this.notifySizeDropPush.nativeElement.checked) {
      size_drop.push('PUSH');
    }

    if(this.customDifficultyValue.nativeElement.value) {
      if(this.validateCustomDifficulty(this.customDifficultyValue.nativeElement.value)) {
        this.difficultyValue = ':' + this.customDifficultyValue.nativeElement.value;
      }
    }

    this.dataService.updateLauncher(this.farmer.launcher_id, {
      "custom_difficulty": (this.customDifficulty.nativeElement.value) ? this.customDifficulty.nativeElement.value + this.difficultyValue : null,
      "name": this.name.nativeElement.value,
      "email": (this.email.nativeElement.value) ? this.email.nativeElement.value : null,
      "minimum_payout": (this.minPayout.nativeElement.value) ? this.minPayout.nativeElement.value * 1000000000000 : null,
      "notify_missing_partials_hours": (this.notifyMissingPartials.nativeElement.checked) ? 1 : null,
      "referrer": (this.referrer.nativeElement.value) ? this.referrer.nativeElement.value : null,
      "payment": payment,
      "size_drop": size_drop,
      "size_drop_interval": (this.notifySizeDropInterval.nativeElement.value) ? this.notifySizeDropInterval.nativeElement.value : null,
      "size_drop_percent": (this.notifySizeDropPercent.nativeElement.value) ? this.notifySizeDropPercent.nativeElement.value : null,
    }).subscribe(
      data => {
        this.router.navigate(['/explorer/farmer', this.farmer.launcher_id]);
      },
      error => {
        this.nameError = error.error?.name;
        this.emailError = error.error?.email;
        this.notifyMissingPartialsError = error.error?.notify_missing_partials_hours;
        this.referrerError = error.error?.referrer;
        this.notifyPaymentError = error.error?.payment;
        this.notifySizeDropError = error.error?.size_drop;
        this.notifySizeDropIntervalError = error.error?.size_drop_interval;
        this.notifySizeDropPercentError = error.error?.size_drop_percent;
        this.customDifficultyError = error.error?.custom_difficulty;
      }
    );
  }

  showCustomDifficultyInput(data: any) {
    const element = document.getElementById('ifCustomValue');
    if(element && data.target.value) {
      if(data.target.value == 'CUSTOM') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  }

  validateCustomDifficulty(value: number): boolean {
    if(value < 10 || value > 150) {
      return false;
    }
    return true;
  }

}
