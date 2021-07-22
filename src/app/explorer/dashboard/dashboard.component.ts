import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pool_space: any;
  estimate_win: any;
  rewards_blocks: any;
  farmers: any;
  poolLog: string = '';

  blocks$: Observable<any[]>;
  launchers$: Observable<any[]>;
  payouts$: Observable<any[]>;

  constructor(private dataService: DataService) {
    this.blocks$ = dataService.blocks$;
    this.launchers$ = dataService.launchers$;
    this.payouts$ = dataService.payouts$;
  }

  ngOnInit() {
    this.dataService.getStats().subscribe(data => {
        this.pool_space = data['pool_space'];
        this.estimate_win = data['estimate_win'];
        this.rewards_blocks = data['rewards_blocks'];
        this.farmers = data['farmers'];
    });
    this.dataService.getBlocks();
    this.dataService.getLaunchers();
    this.dataService.getPayouts();

    this.dataService.connectLog(msg => {
        var temp = this.poolLog + msg['data'];
        this.poolLog = temp.split('\n').slice(-15).join("\n");
    });
  }

  ngOnDestroy() {
    this.dataService.disconnectLog();
  }

}
