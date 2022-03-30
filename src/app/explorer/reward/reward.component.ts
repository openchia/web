import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit {

  payout: any = {};
  payoutid: number;
  payoutaddrs$: Observable<any[]>;
  _payoutaddrs$: Subject<any[]> = new Subject<any[]>();

  payoutaddrsCollectionSize: number = 0;
  payoutaddrsPage: number = 1;
  payoutaddrsPageSize: number = 25;

  // Payoutaddrs chart options
  payoutaddrsLegend: boolean = false;
  payoutaddrsShowLabels: boolean = true;
  payoutaddrsAnimations: boolean = true;
  payoutaddrsData: any[] = null;

  colorScheme = {
    domain: [
      '#004B23', '#005812', '#006400', '#006B00', '#007200',
      '#008000', '#38B000', '#70E000', '#9EF01A', '#CCFF33',
    ]
  };

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.payoutaddrs$ = this._payoutaddrs$.asObservable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.payoutid = data['params']['id'];
      this.dataService.getPayoutAddrs({
        id: this.payoutid,
        limit: this.payoutaddrsPageSize
      }).subscribe(this.handlePayoutAddrs.bind(this));
      this.dataService.getPayout(this.payoutid).subscribe((res) => {
        this.payout = res;
      });
    });
  }

  private handlePayoutAddrs(data) {
    this.payoutaddrsCollectionSize = data['count'];
    this._payoutaddrs$.next(data['results']);
    this.payoutaddrsData = (<any[]>data['results']).map((item) => {
      return ({
        "name": (item['launcher'] == null && "?") || (item['launcher']['name'] || item['launcher']['launcher_id']),
        "value": item['amount'] / 1000000000000,
      })
    });
  }

  refreshPayoutAddrs() {
    this.dataService.getPayoutAddrs({
      id: this.payoutid,
      offset: (this.payoutaddrsPage - 1) * this.payoutaddrsPageSize,
      limit: this.payoutaddrsPageSize
    }).subscribe(this.handlePayoutAddrs.bind(this));
  }

}