import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('name') name: ElementRef;

  loggingIn: boolean = true;
  loggedIn: boolean = false;
  error: boolean = false;
  nameError: string = '';
  farmer: any = {};

  constructor(private dataService: DataService, private route: ActivatedRoute,
             private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.dataService.doLogin(data).subscribe(
        success => {
          this.loggingIn = false;
          this.loggedIn = true;
          this.dataService.getLauncher(data.launcher_id).subscribe(launcher => {
            this.farmer = launcher;
          });

        },
        error => {
          this.loggingIn = false;
          this.error = true;
        }
      );
    });
  }

  submit() {
    this.nameError = '';
    this.dataService.updateLauncher(this.farmer.launcher_id, {"name": this.name.nativeElement.value}).subscribe(
      data => {
        this.router.navigate(['/explorer/farmer', this.farmer.launcher_id]);
      },
      error => {
        this.nameError = error.error?.name;
      }
    );
  }

}
