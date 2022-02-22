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
  nxSpaceLegendPosition: string = 'below';
  nxSpaceLegendTitle: string = '';
  ngSpaceShowLabels: boolean = true;
  ngSpaceAnimations: boolean = true;
  ngSpaceAxisX: boolean = false;
  ngSpaceAxisY: boolean = true;
  ngSpaceShowAxisXLabel: boolean = true;
  ngSpaceShowAxisYLabel: boolean = false;
  ngSpaceShowTimeline: boolean = false;
  ngSpaceData: any[] = null;
  ngSpaceDays: number = 7;

  netspaceLegend: boolean = false;
  netspaceShowLabels: boolean = true;
  netspaceAnimations: boolean = true;
  netspaceAxisX: boolean = false;
  netspaceAxisY: boolean = true;
  netspaceShowAxisXLabel: boolean = true;
  netspaceShowAxisYLabel: boolean = false;
  netspaceShowTimeline: boolean = false;
  netspaceData: any[] = null;
  netspaceDays: number = 7;

  priceLegend: boolean = true;
  priceShowLabels: boolean = true;
  priceAnimations: boolean = true;
  priceAxisX: boolean = false;
  priceAxisY: boolean = true;
  priceShowAxisXLabel: boolean = true;
  priceShowAxisYLabel: boolean = false;
  priceShowTimeline: boolean = false;
  priceData: any[] = null;
  priceDays: number = 7;

  colorScheme = { domain: ['#149b00', '#006400', '#9ef01a'] };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.refreshSpace(7);
    this.refreshSize(7);
    this.getNetspace(7);
    this.getXchPrice(7);
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

  getXchPrice(days: number) {
    this.dataService.getXchPrice(days).subscribe((d) => {

      this.priceDays = days;

      var data: Map<String, Array<any>> = new Map();
      (<any[]>d).map((i) => {
        if(!data.has(i['field'])) {
          data.set(i['field'], new Array());
        }
        data.get(i['field']).push({
          'name': new Date(i['datetime']).toLocaleString(),
          'value': i['value'].toFixed((['btc', 'eth'].includes(i['field'])) ? 5 : 2),
          'label': i['field'] + ': ' + i['value'].toFixed((['btc', 'eth'].includes(i['field'])) ? 5 : 2),
        });
      });

      this.priceData = [];
      data.forEach((v, k) => {
        this.priceData.push({
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
            "label": (item['size'] / 1024 ** 5).toFixed(2).toString() + ' PiB',
          })
        })
      }];
    });
  }

  getNetspace(days: number) {
    this.dataService.getNetspace(days).subscribe((d) => {

      this.netspaceDays = days;
      this.netspaceData = [{
        "name": "Size",
        "series": (<any[]>d).map((item) => {
          return ({
            "name": (new Date(item['datetime']).toLocaleString()),
            "value": item['value'],
            "label": (item['value'] / 1024 ** 4).toFixed(2).toString() + ' EiB',
          })
        })
      }];

    })
  }

  spaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 5).toFixed(2).toString() + ' PiB';
  }

  ngSpaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 5).toFixed(2).toString() + ' PiB';
  }

  netspaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 4).toFixed(2).toString() + ' EiB';
  }

}
