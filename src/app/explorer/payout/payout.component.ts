import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../data.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {

  payout: any = {};
  payoutid: number;
  payout_addrs: Array<any>;
  payoutaddrs$: Observable<any[]>;

  constructor(private dataService: DataService, private route: ActivatedRoute,) {
    this.payoutaddrs$ = dataService.payoutaddrs$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.payoutid = data['params']['id'];
      this.dataService.getPayoutAddrs({ id: this.payoutid });
      this.dataService.getPayout(this.payoutid).subscribe((res) => {
        this.payout = res;
      });
    });
  }

}