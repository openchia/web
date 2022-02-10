import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  tabActive = 1;

  partialsYAxisLabel: string = $localize`Last Partials (24 hours)`;
  partialsXAxisLabel: string = $localize`Time`;

  partialsGradient: boolean = true;
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

  harvesters: Set<string> = new Set();
  
  xch_current_price_usd: number = 0;
  xch_tb_month: number = 0;

  payoutaddrs$: Observable<any[]>;
  _payoutaddrs$ = new BehaviorSubject<any[]>([]);
  payoutsCollectionSize: number = 0;
  payoutsPage: number = 1;
  payoutsPageSize: number = 1000;
  payoutsCountTotal: number = 0;
  payoutsAmountTotal: number = 0;

  blocks$: Observable<any[]>;
  _blocks$ = new BehaviorSubject<any[]>([]);
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 10;

  giveaways$: Observable<any[]>;

  ticketsRound$: Observable<any[]>;

  colorScheme = {
    domain: ['#129b00', '#e00000']
  };

  private farmerid: string;
  public farmer: any = {};

  constructor(private dataService: DataService, private route: ActivatedRoute, private modal: NgbModal) {
    this.blocks$ = this._blocks$.asObservable();
    this.giveaways$ = dataService.giveaways$;
    this.payoutaddrs$ = this._payoutaddrs$.asObservable();
    this.ticketsRound$ = dataService.ticketsRound$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.farmerid = data['params']['id'];
      this.dataService.getGiveaways();
      this.refreshBlocks();
      this.refreshPayouts();
      this.dataService.getLauncher(this.farmerid).subscribe(launcher => {
        this.farmer = launcher;
        this.getPartialsData(this.farmerid);
      });
      this.dataService.getStats().subscribe(data => {
        this.xch_current_price_usd = data['xch_current_price']['usd'];
        this.xch_tb_month = data['xch_tb_month'];
      })
    });
  }

  _handlePartial(subscriber, data, successes, errors, hours) {

    this.partialsTable = this.partialsTable.concat(data['results']);
    data['results'].forEach(v => {
      this.harvesters.add(v['harvester_id']);
      var hour = Math.floor(v['timestamp'] / 3600) * 3600;
      hours.add(hour);

      // Partials by harvester (coming soon)

      // Partials success vs failed
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

  blocksEffortAverage(datas) {
    let blocks_array = [];
    const out = Object.keys(datas).map(index => {
      let data = datas[index];
      blocks_array.push(data['luck']);
    });
    return blocks_array.reduce((a, b) => a + b);
  }

  payoutGetTotalAmount(datas) {
    let amount_array = [];
    const out = Object.keys(datas).map(index => {
      let data = datas[index];
      amount_array.push(data['amount']);
    });
    return amount_array.reduce((a, b) => a + b, 0);
  }

  payoutDownloadCSV(datas) {
    let csv_array = [];
    const out = Object.keys(datas).map(index => {
      let data = datas[index];
      csv_array.push({
        id: data['id'],
        datetime: data['payout']['datetime'],
        transaction: (data['transaction']) ? data['transaction']['transaction'] : "",
        amount: data['amount'] / 1000000000000,
        price: (data['transaction'] && data['transaction']['xch_price']) ? data['transaction']['xch_price']['usd'] * (data['amount'] / 1000000000000) : ""
      });
    });
    var options = {
      headers: ["Id", "Datetime", "Transaction", "Amount", "Price USD"]
    };
    new AngularCsv(csv_array, 'payouts', options);
  }

  private handleBlocks(data) {
    this.blocksCollectionSize = data['count'];
    this._blocks$.next(data['results']);
  }

  refreshBlocks() {
    this.dataService.getBlocks({
      launcher: this.farmerid,
      offset: (this.blocksPage - 1) * this.blocksPageSize,
      limit: this.blocksPageSize
    }).subscribe(data => this.handleBlocks(data));
  }

  private handlePayouts(data) {
    this.payoutsCollectionSize = data['count'];
    this._payoutaddrs$.next(data['results']);
  }

  refreshPayouts() {
    this.dataService.getPayoutAddrs({
      launcher: this.farmerid,
      offset: (this.payoutsPage - 1) * this.payoutsPageSize,
      limit: this.payoutsPageSize
    }).subscribe(data => this.handlePayouts(data));
  }

  toggleFailedPartials(event): void {
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
    this.harvesters.clear();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data) => {
        this.partialsCollectionSize = data['count'];
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

  openGiveaway(content, id) {
    this.dataService.getTicketsRound(this.farmerid, id);
    this.modal.open(content, { size: 'lg' });
  }

  showPartialError(content) {
    this.modal.open(content, { size: 'xl' });
  }

}
