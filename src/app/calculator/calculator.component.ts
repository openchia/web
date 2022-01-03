import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})

export class CalculatorComponent implements OnInit {

  xch_current_price: number = 0;
  xch_tb_month: number = 0;
  calculator: number = 0;

  constructor(private dataService: DataService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.dataService.getStats().subscribe(data => {
        this.xch_current_price = data['xch_current_price'];
        this.xch_tb_month = data['xch_tb_month'];
      })
    });
  }

  convertPlotsToSpace(value) {
    return value * 101.4 / 1024;
  }

  estimateDayXCH(value) {
    return this.xch_tb_month * this.convertPlotsToSpace(value);
  }

  estimateDayUSD(value) {
    return (this.xch_tb_month * this.convertPlotsToSpace(value)) * this.xch_current_price['usd'];
  }

}
