import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar-wrapper animate__animated animate__fadeInLeft pb-5">
      <div class="px-4 py-4 mb-2">
         <div class="small text-muted fw-bold uppercase ls-1 mb-1">Navigation</div>
      </div>

      <div class="px-0">
        <ul class="nav flex-column mb-3">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" [routerLink]="dashboardLink">
              <i class="bi bi-compass me-3 fs-5"></i>
              <span>Overview</span>
            </a>
          </li>
        </ul>

        <!-- Admin Menu -->
        <div *ngIf="role === 'ADMINISTRATOR'" class="mt-4">
          <div class="px-4 mb-2 small text-muted fw-bold uppercase ls-1">Management</div>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/admin/assessments">
                <i class="bi bi-clipboard-check me-3 fs-5"></i>
                <span>Assessments</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/admin/questions">
                <i class="bi bi-journal-text me-3 fs-5"></i>
                <span>Question Bank</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/admin/reports">
                <i class="bi bi-bar-chart-line me-3 fs-5"></i>
                <span>Insights</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/admin/users">
                <i class="bi bi-person-badge me-3 fs-5"></i>
                <span>User Registry</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Examiner Menu -->
        <div *ngIf="role === 'EXAMINER'" class="mt-4">
          <div class="px-4 mb-2 small text-muted fw-bold uppercase ls-1">Curator Tools</div>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/examiner/questions">
                <i class="bi bi-pencil-square me-3 fs-5"></i>
                <span>Item Editor</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/examiner/assessments">
                <i class="bi bi-kanban me-3 fs-5"></i>
                <span>Session Builder</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/examiner/attempts">
                <i class="bi bi-check2-all me-3 fs-5"></i>
                <span>Review Desk</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Candidate Menu -->
        <div *ngIf="role === 'CANDIDATE'" class="mt-4">
          <div class="px-4 mb-2 small text-muted fw-bold uppercase ls-1">Learning</div>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/candidate/assessments">
                <i class="bi bi-journal-check me-3 fs-5"></i>
                <span>My Evaluations</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/candidate/results">
                <i class="bi bi-award me-3 fs-5"></i>
                <span>Achievements</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="mt-5 pt-3 border-top mx-4 border-light opacity-50"></div>
        <ul class="nav flex-column mt-3">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center" routerLinkActive="active" routerLink="/verify">
              <i class="bi bi-shield-check me-3 fs-5 text-primary"></i>
              <span class="fw-bold">Verifier</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-wrapper { height: 100vh; overflow-y: auto; background: white; border-right: 1px solid #f1f3f4; }
    .nav-link { 
       transition: all 0.2s ease;
       padding: 0.75rem 1.5rem;
       margin: 0.25rem 0.75rem;
       border-radius: 0 50px 50px 0;
       color: #5f6368 !important;
       font-weight: 500;
       font-size: 0.9rem;
       border-left: none !important;
    }
    .nav-link i { color: #5f6368; }
    .nav-link:hover { 
      background-color: #f1f3f4;
      color: #202124 !important;
    }
    .nav-link.active {
       background: #e8f0fe !important;
       color: #1967d2 !important;
    }
    .nav-link.active i {
       color: #1a73e8;
    }
    .ls-1 { letter-spacing: 1px; }
  `]
})
export class SidebarComponent implements OnInit {
  role: string = '';
  dashboardLink: string = '/';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole() || '';
    if (this.role === 'ADMINISTRATOR') this.dashboardLink = '/admin';
    else if (this.role === 'EXAMINER') this.dashboardLink = '/examiner';
    else if (this.role === 'CANDIDATE') this.dashboardLink = '/candidate';
  }
}
