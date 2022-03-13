import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-landing',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss']
})

export class JoinComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor(private clipboardApi: ClipboardService) { }

  ngOnInit() {}

  copyToClipboard(content) {
    this.clipboardApi.copyFromContent(content);
  }

}
