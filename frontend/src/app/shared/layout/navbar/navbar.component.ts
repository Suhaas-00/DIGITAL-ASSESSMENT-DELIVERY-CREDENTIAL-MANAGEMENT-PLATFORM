import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-5 fw-bold" href="#">DADCMP</a>
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-nav w-100 d-flex flex-row justify-content-end px-3">
        <div class="nav-item text-nowrap d-flex align-items-center">
          <span class="text-white me-3 d-none d-sm-inline">Welcome, <strong>{{username}}</strong> ({{role}})</span>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">Sign out</button>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || '';
    this.role = this.authService.getUserRole() || '';
  }

  logout() {
    this.authService.logout();
  }
}
