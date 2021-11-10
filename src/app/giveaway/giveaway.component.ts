import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.css']
})
export class GiveawayComponent implements OnInit {

  current: any;
  giveaways: any[];

  giveawaysPage: number = 1;
  giveawaysPageSize: number = 50;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGiveaways().subscribe((data) => {
      this.current = data['results'][0];
      this.giveaways = data['results'].slice(1);
    })
  }

}
