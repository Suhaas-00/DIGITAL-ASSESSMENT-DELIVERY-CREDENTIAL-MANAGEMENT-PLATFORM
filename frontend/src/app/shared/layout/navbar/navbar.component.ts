import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="navbar navbar-light sticky-top px-4 py-2">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <div class="logo-box bg-primary text-white me-2 rounded-2 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;">
            <i class="bi bi-cpu small"></i>
          </div>
          <span class="brand-text fs-5">AssessiMate</span>
        </a>
        
        <div class="d-flex align-items-center gap-3">
          <div class="d-none d-md-flex align-items-center">
            <div class="d-flex flex-column text-end me-3">
              <span class="small fw-medium text-dark">{{username}}</span>
              <span class="text-muted" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">{{role}}</span>
            </div>
            <div class="user-avatar bg-light border d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; border-radius: 50%;">
               <i class="bi bi-person text-muted"></i>
            </div>
          </div>
          
          <button class="btn btn-link text-muted p-1" (click)="logout()" title="Sign out">
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar { background: var(--white) !important; border-bottom: 1px solid var(--border-color) !important; height: 64px; }
  `]
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
