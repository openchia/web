import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgTerminal, NgTerminalComponent } from 'ng-terminal';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css'],
})
export class TermComponent implements OnInit, AfterViewInit {

  @ViewChild("term", { read: ViewContainerRef }) term!: ViewContainerRef;

  log$: Observable<string>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.log$ = this.dataService.log$;
    this.dataService.connectLog();
  }

  ngAfterViewInit() {
    var c = this.term.createComponent(NgTerminalComponent);
    // FIXME: find a way to wait for component to be created
    setTimeout(() => {
      this.log$.subscribe(
        (msg) => c.instance.write(msg.split('\n').join('\r\n')),
      );
    }, 1000);
  }

  ngOnDestroy() {
    this.dataService.disconnectLog();
  }

}
