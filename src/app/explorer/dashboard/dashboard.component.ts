import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild('searchinput') searchInput: ElementRef;
  @ViewChild('viewTerm') viewTerm: ElementRef;
  @ViewChild("termComponent", { read: ViewContainerRef }) termComponent!: ViewContainerRef;

  pool_space: number = 0;
  estimate_win: any;
  rewards_blocks: any;
  rewards_amount: number = 0;
  farmers: any;
  netspace: number = 0;
  poolLog: string = '';
  xch_current_price: number = 0;
  pool_wallets: Array<any> = new Array();
  current_effort: number = 0;
  time_since_last_win: string = '';
  xch_tb_month: number = 0;
  average_effort: number = 0;

  searchFarmerStr: any;
  searchNotFound: boolean = false;

  blocks$: Observable<any[]>;
  _blocks$: Subject<any[]> = new Subject<any[]>();
  launchers$: Observable<any[]>;
  _launchers$: Subject<any[]> = new Subject<any[]>();
  payouts$: Observable<any[]>;
  _payouts$: Subject<any[]> = new Subject<any[]>();
  searchSubscription: Subscription;

  leaderboard: Array<any> = new Array();

  farmersCollectionSize: number = 0;
  farmersPage: number = 1;
  farmersPageSize: number = 30;
  farmersFilterActive: number = 1;

  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 10;

  payoutsCollectionSize: number = 0;
  payoutsPage: number = 1;
  payoutsPageSize: number = 10;

  constructor(private dataService: DataService, private router: Router) {
    this.blocks$ = this._blocks$.asObservable();
    this.launchers$ = this._launchers$.asObservable();
    this.payouts$ = this._payouts$.asObservable();
  }

  ngOnInit() {
    this.farmersFilterActive = (localStorage.getItem('farmer_show_active_only') == 'false') ? 0 : 1;

    this.dataService.getStats().subscribe(data => {
      this.pool_space = data['pool_space'];
      this.estimate_win = this.secondsToHm(data['estimate_win'] * 60);
      this.rewards_blocks = data['rewards_blocks'];
      this.rewards_amount = data['rewards_amount'];
      this.farmers = data['farmers_active'];
      this.netspace = data['blockchain_space'];
      this.xch_current_price = data['xch_current_price'];
      this.pool_wallets = data['pool_wallets'];
      this.current_effort = (data['time_since_last_win'] / (data['estimate_win'] * 60)) * 100;
      this.time_since_last_win = this.secondsToHm(data['time_since_last_win']);
      this.xch_tb_month = data['xch_tb_month'];
      this.average_effort = data['average_effort'];
    });

    this.dataService.getBlocks({
      limit: this.blocksPageSize
    }).subscribe(this.handleBlocks.bind(this));

    this.dataService.getLaunchers({
      limit: this.farmersPageSize,
      points_pplns__gt: this.farmersFilterActive
    }).subscribe(this.handleLaunchers.bind(this));

    this.dataService.getPayouts({
      limit: this.payoutsPageSize
    }).subscribe(this.handlePayouts.bind(this));

    this.searchSubscription = this.launchers$.subscribe((data) => { this._handleSearch(data); });
  }

  async loadTerm() {
    const { TermComponent } = await import('./term/term.component');
    this.termComponent.clear();
    this.termComponent.createComponent(TermComponent);
    this.viewTerm.nativeElement.remove();
  }

  private secondsToHm(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var hDisplay = h > 0 ? h + "h" : "";
    var mDisplay = m > 0 ? m + "m" : "";
    return hDisplay + " " + mDisplay;
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
    if(this.leaderboard.length == 0) {
      this.leaderboard = data['results'].slice(0, 3);
    }
    this.farmersCollectionSize = data['count'];
    this._launchers$.next(data['results']);
  }

  private handleBlocks(data) {
    this.blocksCollectionSize = data['count'];
    this._blocks$.next(data['results']);
  }

  private handlePayouts(data) {
    this.payoutsCollectionSize = data['count'];
    this._payouts$.next(data['results']);
  }

  searchFarmer() {
    this.searchFarmerStr = this.searchInput.nativeElement.value;
    this.searchNotFound = false;
    this.farmersPage = 1;

    // auto remove '0x' if use full launcherid
    if(this.searchFarmerStr.length == 66 && this.searchFarmerStr.startsWith('0x')) {
      this.searchFarmerStr = this.searchFarmerStr.replace(/^0x/, '');
    }

    this.dataService.getLaunchers({
      search: this.searchFarmerStr,
      limit: this.farmersPageSize,
      offset: (this.farmersPage - 1) * this.farmersPageSize
    }).subscribe(this.handleLaunchers.bind(this));
  }

  refreshFarmers(filter) {
    this.farmersFilterActive = parseInt(filter);
    this.dataService.getLaunchers({
      search: this.searchInput.nativeElement.value,
      offset: (this.farmersPage - 1) * this.farmersPageSize,
      limit: this.farmersPageSize,
      points_pplns__gt: this.farmersFilterActive
    }).subscribe(this.handleLaunchers.bind(this));
    localStorage.setItem('farmer_show_active_only', (parseInt(filter) == 1) ? 'true' : 'false');
  }

  refreshBlocks() {
    this.dataService.getBlocks({
      offset: (this.blocksPage - 1) * this.blocksPageSize,
      limit: this.blocksPageSize
    }).subscribe(this.handleBlocks.bind(this));
  }

  refreshPayouts() {
    this.dataService.getPayouts({
      offset: (this.payoutsPage - 1) * this.payoutsPageSize,
      limit: this.payoutsPageSize
    }).subscribe(this.handlePayouts.bind(this));
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

}
