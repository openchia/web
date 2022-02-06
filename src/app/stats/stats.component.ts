import { Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {
  @ViewChild('term', { static: true }) child: NgTerminal;

  // Pool Space chart options
  spaceLegend: boolean = false;
  spaceShowLabels: boolean = false;
  spaceAnimations: boolean = true;
  spaceAxisX: boolean = false;
  spaceAxisY: boolean = true;
  spaceShowAxisXLabel: boolean = false;
  spaceShowAxisYLabel: boolean = false;
  spaceShowTimeline: boolean = false;
  spaceData: any[] = null;
  spaceDays: number = 7;

  // Blocks Found chart options
  blocksLegend: boolean = false;
  blocksShowLabels: boolean = false;
  blocksAnimations: boolean = true;
  blocksAxisX: boolean = false;
  blocksAxisY: boolean = true;
  blocksShowAxisXLabel: boolean = false;
  blocksShowAxisYLabel: boolean = false;
  blocksShowTimeline: boolean = false;
  blocksData: any[] = null;
  blocksDays: number = 7;

  log$: Observable<string>;

  colorScheme = {
    domain: ['#129b00']
  };

  constructor(private dataService: DataService) {
    this.log$ = dataService.log$;
  }

  ngOnInit() {

    this.dataService.getPoolSpace(this.spaceDays).subscribe((d) => {
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
