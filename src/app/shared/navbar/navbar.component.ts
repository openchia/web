import { LOCALE_ID, Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    public isDarkEnabled = false;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    private presentTheme$ = new BehaviorSubject<string>('theme-light');

    constructor(public location: Location, private router: Router, @Inject(LOCALE_ID) public locale: string) {
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            this.isCollapsed = true;
            if(event instanceof NavigationStart) {
                if(event.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if(event instanceof NavigationEnd) {
                if(event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else
                    window.scrollTo(0, 0);
            }
        });
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme) {
            this.presentTheme$.next(savedTheme);
        }
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if(titlee === '#/landing') {
            return true;
        }
        else {
            return false;
        }
    }

    updateTheme() {
        this.presentTheme$.value == 'theme-light'
        ? this.presentTheme$.next('theme-dark')
        : this.presentTheme$.next('theme-light');

        localStorage.setItem('theme', this.presentTheme$.value);
        this.isDarkEnabled = !this.isDarkEnabled;
    }
}
