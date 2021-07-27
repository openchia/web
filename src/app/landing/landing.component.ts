import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = true;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Pool Space';
  timeline: boolean = false;
  data: any[] = null;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getPoolSpace().subscribe((d) => {
      this.data = [{
        "name": "Size",
        "series": (<any[]>d).map((item) => {
          return ({"name": item['date'], "value": item['size'], "label": (item['size'] / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' TiB'})
        })
      }];
    });
  }

  yAxisFormat(data) {
    return (data / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' TiB';
  }

}
