import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { gitVersion } from '../../../environments/git-version';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
    currentYear : Date = new Date();
    gitVersion = gitVersion;

    constructor(
      private router: Router,
      private modal: NgbModal
    ) { }

    ngOnInit() { }

    getPath() {
      return this.router.url;
    }

    showGithubDetails(content) {
      this.modal.open(content, {
        size: 'xl',
        keyboard: true,
        backdrop: false,
        scrollable: true
      })
    }
}
