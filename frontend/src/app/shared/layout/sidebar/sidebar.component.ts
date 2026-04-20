import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" [routerLink]="dashboardLink">
            <span class="bi bi-house-door me-2"></span>
            Dashboard
          </a>
        </li>
      </ul>

      <!-- Admin Menu -->
      <h6 *ngIf="role === 'ADMIN'" class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
        <span>Administration</span>
      </h6>
      <ul *ngIf="role === 'ADMIN'" class="nav flex-column mb-2">
        <li class="nav-item">
          <a class="nav-link" routerLink="/admin/assessments">
            <span class="bi bi-file-earmark-text me-2"></span>
            Manage Assessments
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/admin/questions">
            <span class="bi bi-question-circle me-2"></span>
            Manage Questions
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/admin/reports">
            <span class="bi bi-graph-up me-2"></span>
            Reports
          </a>
        </li>
      </ul>

      <!-- Examiner Menu -->
      <h6 *ngIf="role === 'EXAMINER'" class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
        <span>Content Manager</span>
      </h6>
      <ul *ngIf="role === 'EXAMINER'" class="nav flex-column mb-2">
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" routerLink="/examiner/questions">
            <span class="bi bi-question-circle me-2"></span>
            Question Bank
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" routerLink="/examiner/assessments">
            <span class="bi bi-file-earmark-plus me-2"></span>
            Build Assessment
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" routerLink="/examiner/attempts">
            <span class="bi bi-list-check me-2"></span>
            Review Attempts
          </a>
        </li>
      </ul>

      <!-- Candidate Menu -->
      <h6 *ngIf="role === 'CANDIDATE'" class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
        <span>My Exams</span>
      </h6>
      <ul *ngIf="role === 'CANDIDATE'" class="nav flex-column mb-2">
        <li class="nav-item">
          <a class="nav-link" routerLink="/candidate/assessments">
            <span class="bi bi-pencil-square me-2"></span>
            Available Assessments
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/candidate/results">
            <span class="bi bi-award me-2"></span>
            My Results
          </a>
        </li>
      </ul>
      
      <hr>
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link" routerLink="/verify">
            <span class="bi bi-check-circle me-2"></span>
            Verify Credential
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .nav-link {
      font-weight: 500;
      color: #333;
      padding: 0.5rem 1rem;
    }
    .nav-link:hover {
      color: #0d6efd;
      background-color: rgba(13, 110, 253, 0.05);
    }
    .nav-link.active {
      color: #0d6efd;
    }
    .sidebar-heading {
      font-size: .75rem;
    }
  `]
})
export class SidebarComponent implements OnInit {
  role: string = '';
  dashboardLink: string = '/';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole() || '';
    if (this.role === 'ADMIN') this.dashboardLink = '/admin';
    else if (this.role === 'EXAMINER') this.dashboardLink = '/examiner';
    else if (this.role === 'CANDIDATE') this.dashboardLink = '/candidate';
  }
}
