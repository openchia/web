import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  xch_current_price: any;
  pool_space: number = 0;
  estimate_win: any;
  farmers: any;
  rewards_blocks: any;
  xch_tb_month: number = 0;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getStats().subscribe(data => {
      this.xch_current_price = data['xch_current_price'];
      this.pool_space = data['pool_space'];
      this.estimate_win = this.secondsToHm(data['estimate_win'] * 60);
      this.farmers = data['farmers_active'];
      this.rewards_blocks = data['rewards_blocks'];
      this.xch_tb_month = data['xch_tb_month'];
    })
  }

  private secondsToHm(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var hDisplay = h > 0 ? h + "h" : "";
    var mDisplay = m > 0 ? m + "m" : "";
    return hDisplay + " " + mDisplay;
  }

}
