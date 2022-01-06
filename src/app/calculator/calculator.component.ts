import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})

export class CalculatorComponent implements OnInit {

  xch_current_price: number = 0;
  xch_tb_month: number = 0;
  pool_space: number = 0;
  calculator: number = 0;

  calculator_plots_min: number = 20;
  calculator_plots_max: number = 20000;
  calculator_plots_current: number = 1000;

  constructor(private dataService: DataService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.dataService.getStats().subscribe(data => {
        this.xch_current_price = data['xch_current_price'];
        this.xch_tb_month = data['xch_tb_month'];
        this.pool_space = data['pool_space'];
        this.calculator_plots_min = this.calculator_plots_min;
        this.calculator_plots_max = this.calculator_plots_max;
        this.calculator_plots_current = this.calculator_plots_current;
      })
    });
  }

  convertPlotsToSpace(value) {
    return value * 101.4 / 1024;
  }

  convertPlotsToUtilization(value) {
    return this.convertPlotsToSpace(value) * 100 / ((this.pool_space / 1024 / 1024 / 1024 / 1024) + this.convertPlotsToSpace(value));
  }

  estimateDayXCH(value) {
    return this.xch_tb_month * this.convertPlotsToSpace(value);
  }

  estimateDayUSD(value) {
    return (this.xch_tb_month * this.convertPlotsToSpace(value)) * this.xch_current_price['usd'];
  }

}
