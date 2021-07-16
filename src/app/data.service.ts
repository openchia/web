import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "/api/v1.0/";
  private _launchers$ = new BehaviorSubject<any[]>([]);

  constructor(private httpClient: HttpClient) { }

  getStats() {
    return this.httpClient.get(this.REST_API_SERVER + 'stats');
  }

  getLaunchers() {
    return this.httpClient.get(this.REST_API_SERVER + 'launcher').subscribe(data => {
      this._launchers$.next(data['results']);
    });
  }

  get launchers$() { return this._launchers$.asObservable(); }

}
