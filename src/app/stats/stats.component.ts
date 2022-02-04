import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {

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
    domain: ['#129b00']
  };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getPoolSpace().subscribe((d) => {
      this.data = [{
        "name": "Size",
        "series": (<any[]>d).map((item) => {
          return ({
            "name": (new Date(item['date']).toLocaleString()),
            "value": item['size'],
            "label": (item['size'] / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' PiB',
          })
        })
      }];
    });
  }

  yAxisFormat(data) {
    return (data / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' PiB';
  }

}
