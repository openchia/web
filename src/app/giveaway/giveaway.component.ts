import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.css']
})
export class GiveawayComponent implements OnInit {

  current: any = {};
  giveaways: any[] = [];
  giveaways$: Observable<any[]>;

  giveawaysPage: number = 1;
  giveawaysPageSize: number = 50;

  constructor(private dataService: DataService) {
    this.giveaways$ = dataService.giveaways$;
  }

  ngOnInit(): void {
    this.dataService.getGiveaways();
    var first = true;
    this.dataService.giveaways$.subscribe((data) => {
      if(data.length > 0) {
        if(first) {
          first = false;
          this.current = data[0];
          this.giveaways = this.giveaways.concat(data.slice(1));
        } else {
          this.giveaways = this.giveaways.concat(data);
        }
      }
    });
  }

}
