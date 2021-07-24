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

  partialsData: any[] = null;
  partialsXTicks: any[] = []
  partials$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  partialsObs$: Observable<any[]> = this.partials$.asObservable();
  partialsCollectionSize: number = 0;
  partialsPage: number = 1;
  partialsPageSize: number = 100;

  payouts$: Observable<any[]>;
  payoutsCollectionSize: number = 0;
  payoutsPage: number = 1;
  payoutsPageSize: number = 100;

  blocks$: Observable<any[]>;
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 100;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  private farmerid: string;
  public farmer: any = {};

  constructor(private dataService: DataService, private route: ActivatedRoute,) {
    this.blocks$ = dataService.blocks$;
    this.payouts$ = dataService.payouts$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.farmerid = data['params']['id'];
      this.dataService.getLauncher(this.farmerid).subscribe(launcher => {
        this.farmer = launcher;
        this.getPartialsData(this.farmerid);
	this.dataService.getPayouts(this.farmerid);
	this.dataService.getBlocks(this.farmerid);
      });
    });
  }

  _handlePartial(subscriber, data, successes, errors, hours) {

     data['results'].forEach(v => {
       var hour = Math.floor(v['timestamp'] / 3600) * 3600;
       hours.add(hour);
       if(v.error === null) {
         errors.set(hour, (errors.get(hour) || 0))
         successes.set(hour, (successes.get(hour) || 0) + 1)
       } else {
         errors.set(hour, (errors.get(hour) || 0) + 1)
         successes.set(hour, (successes.get(hour) || 0))
       }

     });

     if(data['next']) {
       this.dataService.getNext(data['next']).subscribe(
         (data) => {this._handlePartial(subscriber, data, successes, errors, hours);}
       );
     } else {
       subscriber.complete();
     }

  }

  refreshBlocks() {
    this.dataService.getBlocks(this.farmerid, (this.partialsPage - 1) * this.partialsPageSize);
  }

  refreshPartials() {
     this.dataService.getPartials(this.farmerid, (this.partialsPage - 1) * this.partialsPageSize).subscribe(data => {
       this.partialsCollectionSize = data['count'];
       this.partials$.next(data['results']);
     });
  }

  getPartialsData(launcher_id) {

    var successes = new Map();;
    var errors = new Map();
    var hours = new Set();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data) => {
        this.partialsCollectionSize = data['count'];
        this.partials$.next(data['results']);
        this._handlePartial(subscriber, data, successes, errors, hours);
      });
    });

    obs.subscribe(
      (x) => {},
      (err) => { console.error('something wrong occurred: ' + err); },
      () => {

        this.partialsXTicks = Array.from(hours);

        this.partialsData = [
          {
            "name": "Successful Partials",
            "series": Array.from(successes, (i, idx) => {
                    return {"name": i[0], "value": i[1]};
            }),
          },
          {
            "name": "Failed Partials",
            "series": Array.from(errors, (i, idx) => {
                    return {"name": i[0], "value": i[1]};
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
