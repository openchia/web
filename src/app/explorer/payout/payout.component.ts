import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../data.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {

  payout: any = {};
  payoutid: number;
  payoutaddrs$: Observable<any[]>;
  _payoutaddrs$: Subject<any[]> = new Subject<any[]>();

  payoutaddrsCollectionSize: number = 0;
  payoutaddrsPage: number = 1;
  payoutaddrsPageSize: number = 50;

  constructor(private dataService: DataService, private route: ActivatedRoute,) {
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
  }

  refreshPayoutAddrs() {
    this.dataService.getPayoutAddrs({
      id: this.payoutid,
      offset: (this.payoutaddrsPage - 1) * this.payoutaddrsPageSize,
      limit: this.payoutaddrsPageSize
    }).subscribe(this.handlePayoutAddrs.bind(this));
  }

}