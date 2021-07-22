import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  partialsData: any[] = null;
  partialsXTicks: any[] = []

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  private farmerid: string;
  public farmer: any = {};

  constructor(private dataService: DataService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.farmerid = data['params']['id'];
      this.dataService.getLauncher(this.farmerid).subscribe(launcher => {
        this.farmer = launcher;
        this.getPartialsData(this.farmerid);
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

  getPartialsData(launcher_id) {

    var successes = new Map();;
    var errors = new Map();
    var hours = new Set();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data) => {
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
