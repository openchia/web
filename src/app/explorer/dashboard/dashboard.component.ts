import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgTerminal, NgTerminalComponent } from 'ng-terminal';
import { DataService } from '../../data.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;
  @ViewChild('searchinput') searchInput: ElementRef;

  pool_space: number = 0;
  estimate_win: any;
  rewards_blocks: any;
  farmers: any;
  netspace: number = 0;
  poolLog: string = '';
  xch_current_price: number = 0;

  searchNotFound: boolean = false;

  blocks$: Observable<any[]>;
  launchers$: Observable<any[]>;
  _launchers$: Subject<any[]> = new Subject<any[]>();
  log$: Observable<string>;
  payouts$: Observable<any[]>;
  searchSubscription: Subscription;

  farmersCollectionSize: number = 0;
  farmersPage: number = 1;
  farmersPageSize: number = 30;

  constructor(private dataService: DataService, private router: Router) {
    this.blocks$ = dataService.blocks$;
    this.launchers$ = this._launchers$.asObservable();
    this.log$ = dataService.log$;
    this.payouts$ = dataService.payouts$;
  }

  ngAfterViewInit() {
    this.log$.subscribe(
      (msg) => this.child.write(msg.split('\n').join('\r\n')),
    );
  }

  ngOnInit() {
    this.dataService.getStats().subscribe(data => {
      this.pool_space = data['pool_space'];
      this.estimate_win = data['estimate_win'];
      this.rewards_blocks = data['rewards_blocks'];
      this.farmers = data['farmers'];
      this.netspace = data['blockchain_space'];
      this.xch_current_price = data['xch_current_price'];
    });
    this.dataService.getBlocks();
    this.dataService.getLaunchers({ limit: this.farmersPageSize }).subscribe(this.handleLaunchers.bind(this));
    this.dataService.getPayouts();

    this.dataService.connectLog();
    this.searchSubscription = this.launchers$.subscribe((data) => { this._handleSearch(data); });

  }

  private _handleSearch(data) {
    if(data.length == 0) {
      if(this.searchInput?.nativeElement.value?.length > 0)
        this.searchNotFound = true;
    } else if(data.length == 1) {
      this.router.navigate(['/explorer/farmer', data[0]['launcher_id']]);
    }
  }

  private handleLaunchers(data) {
    this.farmersCollectionSize = data['count'];
    this._launchers$.next(data['results']);
  }

  searchFarmer() {
    this.searchNotFound = false;
    this.farmersPage = 1;
    this.dataService.getLaunchers({ search: this.searchInput.nativeElement.value, limit: this.farmersPageSize, offset: (this.farmersPage - 1) * this.farmersPageSize }).subscribe(this.handleLaunchers.bind(this));
  }

  refreshFarmers() {
    this.dataService.getLaunchers({ search: this.searchInput.nativeElement.value, offset: (this.farmersPage - 1) * this.farmersPageSize, limit: this.farmersPageSize }).subscribe(this.handleLaunchers.bind(this));
  }

  ngOnDestroy() {
    this.dataService.disconnectLog();
    this.searchSubscription.unsubscribe();
  }

}
