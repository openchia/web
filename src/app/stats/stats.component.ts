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

  colorScheme = {
    domain: ['#129b00']
  };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.refreshSpace(7);
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

  spaceFormatAxisY(spaceData) {
    return (spaceData / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2).toString() + ' PiB';
  }

}
