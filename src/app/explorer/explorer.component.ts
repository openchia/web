import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})

export class ExplorerComponent implements OnInit {

  pool_space: any;
  estimate_win: any;
  rewards_blocks: any;
  farmers: any;

  launchers$: Observable<any[]>;

  constructor(private dataService: DataService) {
    this.launchers$ = dataService.launchers$;
  }

  ngOnInit() {
    this.dataService.getStats().subscribe(data => {
        this.pool_space = data['pool_space'];
        this.estimate_win = data['estimate_win'];
        this.rewards_blocks = data['rewards_blocks'];
        this.farmers = data['farmers'];
    });
    this.dataService.getLaunchers();
  }

}
