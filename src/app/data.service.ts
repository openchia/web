import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "/api/v1.0/";
  private _blocks$ = new BehaviorSubject<any[]>([]);
  private _launchers$ = new BehaviorSubject<any[]>([]);
  private _payouts$ = new BehaviorSubject<any[]>([]);
  private socket$: WebSocketSubject<any>;

  constructor(private httpClient: HttpClient) { }

  getStats() {
    return this.httpClient.get(this.REST_API_SERVER + 'stats');
  }

  getBlocks() {
    return this.httpClient.get(this.REST_API_SERVER + 'block/').subscribe(data => {
      this._blocks$.next(data['results']);
    });
  }

  getLaunchers() {
    return this.httpClient.get(this.REST_API_SERVER + 'launcher/').subscribe(data => {
      this._launchers$.next(data['results']);
    });
  }

  getPayouts() {
    return this.httpClient.get(this.REST_API_SERVER + 'payout/').subscribe(data => {
      this._payouts$.next(data['results']);
    });
  }

  getLauncher(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + 'launcher/' + id + '/');
  }

  getPoolSpace() {
    return this.httpClient.get(this.REST_API_SERVER + 'space?days=2');
  }

  getPartials(launcher) {
    var timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24 * 7;
    return this.httpClient.get(this.REST_API_SERVER + 'partial/?ordering=timestamp&min_timestamp=' + timestamp.toString() + '&launcher=' + launcher);
  }

  getNext(url) {
    return this.httpClient.get(url);
  }

  get blocks$() { return this._blocks$.asObservable(); }

  get launchers$() { return this._launchers$.asObservable(); }

  get payouts$() { return this._payouts$.asObservable(); }

  connectLog(msgCallback) {
    var proto = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    this.socket$ = webSocket(proto + window.location.host + '/ws/log/');
    this.socket$.subscribe(
      msg => {
        msgCallback(msg);
      },
      err => console.log(err),
      () => {
      },
    );
  }

  disconnectLog() {
    if(this.socket$) {
      this.socket$.unsubscribe();
    }
  }

}
