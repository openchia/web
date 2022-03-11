import { LOCALE_ID, Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    private darkMode: boolean = false;
    @ViewChild('darkModeIcon') darkModeIcon: ElementRef;

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

    }
    ngAfterViewInit() {
        var darkMode = localStorage.getItem("darkmode");
        if(darkMode != '') {
            this.darkMode = (darkMode == "true") ? true : false;
        } else {
            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.darkMode = true;
            } else {
                this.darkMode = false;
            }
        }
        this.darkModeSet();
    }

    darkModeToggle() {
        this.darkMode = !this.darkMode;
        this.darkModeSet();
    }

    darkModeSet() {
        if(this.darkMode) {
            document.body.classList.remove('bootstrap');
            document.body.classList.add('bootstrap-dark');
            this.darkModeIcon.nativeElement.classList.remove('fa-moon');
            this.darkModeIcon.nativeElement.classList.add('fa-sun');
        } else {
            document.body.classList.remove('bootstrap-dark');
            document.body.classList.add('bootstrap');
            this.darkModeIcon.nativeElement.classList.add('fa-moon');
            this.darkModeIcon.nativeElement.classList.remove('fa-sun');
        }
        localStorage.setItem("darkmode", `${this.darkMode}`);
    }
}
