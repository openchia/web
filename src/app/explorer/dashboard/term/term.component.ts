import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
  @ViewChild('partials') partials: ElementRef;
  @ViewChild('payment') payment: ElementRef;

  log$: Observable<object>;

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
        (msg) => {
          if('message' in msg) {
            if('funcName' in msg) {
              if(['update_db', 'post_partial'].includes(msg['funcName']) && !this.partials.nativeElement.checked) {
                return;
              }
              if(['submit_payment_loop', 'create_payment_loop', 'check_and_confirm_partial'].includes(msg['funcName']) && !this.payment.nativeElement.checked) {
                return;
              }
            }
            c.instance.write(`${msg["timestamp"]}: ${msg["message"]}\r\n`);
          }
        },
      );
    }, 1000);
  }

  ngOnDestroy() {
    this.dataService.disconnectLog();
  }

}
