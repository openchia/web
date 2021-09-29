import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "/api/v1.0/";
  private _blocks$ = new BehaviorSubject<any[]>([]);
  private _launchers$ = new Subject<any[]>();
  private _payouts$ = new BehaviorSubject<any[]>([]);
  private _payoutaddrs$ = new BehaviorSubject<any[]>([]);
  private _referrals$ = new BehaviorSubject<any[]>([]);
  private _log$ = new BehaviorSubject<string>('');
  private socket$: WebSocketSubject<any>;

  constructor(private httpClient: HttpClient) { }

  getStats() {
    return this.httpClient.get(this.REST_API_SERVER + 'stats');
  }

  getBlocks(launcher?, offset?) {
    var params = [];
    if(launcher) params.push(`farmed_by=${launcher}`);
    if(offset) params.push(`offset=${offset}`);
    return this.httpClient.get(this.REST_API_SERVER + 'block/?' + params.join('&')).subscribe(data => {
      this._blocks$.next(data['results']);
    });
  }

  getLaunchers(attrs) {
    var params = new HttpParams();
    params = params.set('is_pool_member', 'true');
    if(attrs) {
      if(attrs.offset) params = params.set('offset', attrs.offset);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.search) params = params.set('search', attrs.search);
    }
    return this.httpClient.get(`${this.REST_API_SERVER}launcher/`, { params });
  }

  getPayouts(launcher?, offset?) {
    var params = [];
    if(launcher) params.push(`launcher=${launcher}`);
    if(offset) params.push(`offset=${offset}`);
    return this.httpClient.get(this.REST_API_SERVER + 'payout/?' + params.join('&')).subscribe(data => {
      this._payouts$.next(data['results']);
    });
  }

  getPayoutAddrs(attrs: any, offset?) {
    var params = new HttpParams();
    if(attrs.id) {
      params = params.set('payout', attrs.id);
    }
    if(attrs.launcher) {
      params = params.set('launcher', attrs.launcher);
    }
    if(offset) {
      params = params.set('offset', offset);
    }
    return this.httpClient.get(`${this.REST_API_SERVER}payoutaddress/`, { params }).subscribe(data => {
      this._payoutaddrs$.next(data['results']);
    });
  }

  getReferrals(attrs: any, offset?) {
    var params = new HttpParams();
    if(attrs.launcher) {
      params = params.set('launcher', attrs.launcher);
    }
    if(attrs.referrer) {
      params = params.set('referrer', attrs.referrer);
    }
    if(offset) {
      params = params.set('offset', offset);
    }
    return this.httpClient.get(`${this.REST_API_SERVER}referral/`, { params }).subscribe(data => {
      this._referrals$.next(data['results']);
    });
  }

  getLauncher(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + 'launcher/' + id + '/');
  }

  updateLauncher(id: string, params) {
    return this.httpClient.put(this.REST_API_SERVER + 'launcher/' + id + '/', params);
  }

  getPayout(id: number) {
    return this.httpClient.get(`${this.REST_API_SERVER}payout/${id}/`);
  }

  getPoolSpace() {
    return this.httpClient.get(`${this.REST_API_SERVER}space?days=7`);
  }

  getPartials(launcher, offset?) {
    var timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
    return this.httpClient.get(this.REST_API_SERVER + 'partial/?ordering=-timestamp&min_timestamp=' + timestamp.toString() + '&launcher=' + launcher + '&offset=' + (offset || ''));
  }

  getNext(url) {
    return this.httpClient.get(url);
  }

  doLogin(params) {
    return this.httpClient.post(this.REST_API_SERVER + 'login', params);
  }

  getLoggedIn() {
    return this.httpClient.get(`${this.REST_API_SERVER}loggedin`);
  }

  get blocks$() { return this._blocks$.asObservable(); }

  get launchers$() { return this._launchers$.asObservable(); }

  get log$() { return this._log$.asObservable(); }

  get payouts$() { return this._payouts$.asObservable(); }

  get payoutaddrs$() { return this._payoutaddrs$.asObservable(); }

  get referrals$() { return this._referrals$.asObservable(); }

  connectLog(msgCallback?) {
    var proto = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    this.socket$ = webSocket(proto + window.location.host + '/ws/log/');
    this.socket$.subscribe(
      msg => {
        this._log$.next(msg['data']);
        if(msgCallback) msgCallback(msg);
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
