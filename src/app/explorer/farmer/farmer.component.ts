import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  tabActive = 1;

  yAxisLabel: string = $localize`Last Partials (24 hours)`;
  xAxisLabel: string = $localize`Time`;

  partialsData: any[] = null;
  partialsXTicks: any[] = [];
  partialsTable: any[] = [];
  partialsFiltered: any[] = [];
  partialsCollectionSize: number = 0;
  partialsPage: number = 1;
  partialsPageSize: number = 100;
  partialsSuccessful: number = 0;
  partialsFailed: number = 0;
  partialsPoints: number = 0;
  failedPartials: boolean = false;

  payoutaddrs$: Observable<any[]>;
  payoutsCollectionSize: number = 0;
  payoutsPage: number = 1;
  payoutsPageSize: number = 100;

  blocks$: Observable<any[]>;
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 100;

  colorScheme = {
    domain: ['#129b00', '#e00000']
  };

  private farmerid: string;
  public farmer: any = {};

  constructor(private dataService: DataService, private route: ActivatedRoute,) {
    this.blocks$ = dataService.blocks$;
    this.payoutaddrs$ = dataService.payoutaddrs$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.farmerid = data['params']['id'];
      this.dataService.getLauncher(this.farmerid).subscribe(launcher => {
        this.farmer = launcher;
        this.getPartialsData(this.farmerid);
        this.dataService.getPayoutAddrs({ launcher: this.farmerid });
        this.dataService.getBlocks(this.farmerid);
      });
    });
  }

  _handlePartial(subscriber, data, successes, errors, hours) {

    this.partialsTable = this.partialsTable.concat(data['results']);
    data['results'].forEach(v => {
      var hour = Math.floor(v['timestamp'] / 3600) * 3600;
      hours.add(hour);
      if(v.error === null) {
        this.partialsSuccessful++;
        this.partialsPoints += v['difficulty'];
        errors.set(hour, (errors.get(hour) || 0))
        successes.set(hour, (successes.get(hour) || 0) + 1)
      } else {
        this.partialsFailed++;
        errors.set(hour, (errors.get(hour) || 0) + 1)
        successes.set(hour, (successes.get(hour) || 0))
      }

    });

    if(data['next']) {
      this.dataService.getNext(data['next']).subscribe(
        (data) => { this._handlePartial(subscriber, data, successes, errors, hours); }
      );
    } else {
      subscriber.complete();
      this.filterPartials();
    }

  }

  refreshBlocks() {
    this.dataService.getBlocks(this.farmerid, (this.blocksPage - 1) * this.blocksPageSize);
  }

  toggleFailedPartials(event) {
    this.failedPartials = event.target.checked;
    this.filterPartials();
  }

  filterPartials() {
    if(this.failedPartials) {
      this.partialsFiltered = this.partialsTable.filter(entry => entry.error !== null)
    } else {
      this.partialsFiltered = [...this.partialsTable];
    }
  }

  getPartialsData(launcher_id) {

    var successes = new Map();
    var errors = new Map();
    var hours = new Set();

    this.partialsTable = [];
    this.partialsFiltered = [];

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data) => {
        this._handlePartial(subscriber, data, successes, errors, hours);
      });
    });

    obs.subscribe(
      (x) => { },
      (err) => { console.error('something wrong occurred: ' + err); },
      () => {

        this.partialsXTicks = Array.from(hours);

        this.partialsData = [
          {
            "name": $localize`Successful Partials`,
            "series": Array.from(successes, (i, idx) => {
              return { "name": i[0], "value": i[1] };
            }),
          },
          {
            "name": $localize`Failed Partials`,
            "series": Array.from(errors, (i, idx) => {
              return { "name": i[0], "value": i[1] };
            }),
          },
        ];

      }
    );

  }

  partialsXAxisFormat(data) {
    return new Date(data * 1000).toLocaleTimeString();
  }

}
