import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgTerminal, NgTerminalComponent } from 'ng-terminal';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;

  pool_space: number = 0;
  estimate_win: any;
  rewards_blocks: any;
  farmers: any;
  netspace: number = 0;
  poolLog: string = '';

  blocks$: Observable<any[]>;
  launchers$: Observable<any[]>;
  log$: Observable<string>;
  payouts$: Observable<any[]>;

  constructor(private dataService: DataService) {
    this.blocks$ = dataService.blocks$;
    this.launchers$ = dataService.launchers$;
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
    });
    this.dataService.getBlocks();
    this.dataService.getLaunchers();
    this.dataService.getPayouts();

    this.dataService.connectLog();

  }

  ngOnDestroy() {
    this.dataService.disconnectLog();
  }

}
