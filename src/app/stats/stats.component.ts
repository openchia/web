import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {

  // Pool Space chart options
  spaceLegend: boolean = false;
  spaceShowLabels: boolean = false;
  spaceAnimations: boolean = true;
  spaceAxisX: boolean = false;
  spaceAxisY: boolean = true;
  spaceShowAxisXLabel: boolean = true;
  spaceShowAxisYLabel: boolean = false;
  spaceShowTimeline: boolean = false;
  spaceData: any[] = null;
  spaceDays: number = 7;

  // New pool space chart
  ngSpaceLegend: boolean = true;
  ngSpaceShowLabels: boolean = true;
  ngSpaceAnimations: boolean = true;
  ngSpaceAxisX: boolean = false;
  ngSpaceAxisY: boolean = true;
  ngSpaceShowAxisXLabel: boolean = true;
  ngSpaceShowAxisYLabel: boolean = false;
  ngSpaceShowTimeline: boolean = false;
  ngSpaceData: any[] = null;
  ngSpaceDays: number = 7;

  colorScheme = {
    domain: ['#129b00', '#629a00', '#b29a00']
  };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.refreshSpace(7);
    this.refreshSize(7);
  }

  refreshSize(days: number) {
    this.dataService.getPoolSize(days).subscribe((d) => {

      this.ngSpaceDays = days;

      var data: Map<String, Array<any>> = new Map();
      (<any[]>d).map((i) => {
        if(!data.has(i['field'])) {
          data.set(i['field'], new Array());
        }
        data.get(i['field']).push({ 'name': new Date(i['datetime']).toLocaleString(), 'value': i['value'], 'label': i['field'] + ': ' + (i['value'] / 1024 ** 5).toFixed(2).toString() + ' PiB' });
      });

      this.ngSpaceData = [];
      data.forEach((v, k) => {
        this.ngSpaceData.push({
          "name": k,
          "series": v,
        })
      })

    })
  }

  refreshSpace(days?) {
    this.dataService.getPoolSpace(days).subscribe((d) => {
      this.spaceDays = days;
      this.spaceData = [{
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

  spaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' PiB';
  }

  ngSpaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' PiB';
  }

}
