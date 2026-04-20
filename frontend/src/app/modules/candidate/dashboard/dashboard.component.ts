import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/core/services/api.service';
import { Assessment } from 'src/app/models/app.models';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-candidate-dashboard',
  template: `
    <div class="candidate-dash p-4">
      <!-- Welcome Hero -->
      <div class="welcome-hero mb-5 p-5 rounded-4 shadow-sm text-white overflow-hidden position-relative">
        <div class="z-index-1 position-relative">
          <span class="badge bg-white-20 mb-3 px-3 py-2 rounded-pill small fw-bold">CANDIDATE PORTAL</span>
          <h1 class="display-4 fw-bold mb-2">Hello, {{username}}!</h1>
          <p class="fs-5 text-white-50 mb-0">Ready to showcase your skills? You have {{assessments.length}} assessments waiting.</p>
        </div>
        <div class="hero-bg-shapes"></div>
      </div>

      <div class="row g-4">
        <!-- Main Content -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-dark m-0">Available Assessments</h3>
            <div class="filter-pills d-flex gap-2">
               <span class="badge bg-white text-dark shadow-sm px-3 py-2 border rounded-pill clickable">All</span>
               <span class="badge bg-white text-muted shadow-sm px-3 py-2 border rounded-pill clickable">Java</span>
               <span class="badge bg-white text-muted shadow-sm px-3 py-2 border rounded-pill clickable">Python</span>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-6" *ngFor="let item of assessments">
              <div class="card h-100 border-0 shadow-sm rounded-4 assessment-card overflow-hidden">
                <div class="card-body p-4">
                  <div class="mb-3 d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary-soft text-primary rounded-pill px-3">{{item.domain}}</span>
                    <span class="text-muted small fw-bold"><i class="bi bi-clock me-1"></i> {{item.duration}}m</span>
                  </div>
                  <h4 class="fw-bold text-dark mb-3">{{item.title}}</h4>
                  <p class="text-muted small mb-4 line-clamp-2">{{item.description}}</p>
                  <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                     <span class="small fw-bold text-dark">{{item.totalMarks}} Points</span>
                     <button class="btn btn-dark btn-sm rounded-pill px-4 py-2 fw-bold" [routerLink]="['/candidate/exam', item.id]">
                        START SESSION
                     </button>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="assessments.length === 0" class="col-12 text-center py-5 bg-white rounded-4 shadow-sm border">
               <i class="bi bi-journal-x display-1 text-muted opacity-25"></i>
               <h5 class="mt-3 text-muted">No assessments currently assigned to you.</h5>
            </div>
          </div>
        </div>

        <!-- Sidebar Activity -->
        <div class="col-lg-4">
           <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 class="fw-bold text-dark mb-4">Recent Activity</h5>
              <div *ngIf="results.length > 0; else noResults">
                <div *ngFor="let res of results.slice(0,3)" class="activity-item d-flex gap-3 mb-4">
                   <div class="activity-icon" [ngClass]="res.score! >= res.assessment.passingMarks ? 'bg-success' : 'bg-danger'">
                      <i class="bi" [ngClass]="res.score! >= res.assessment.passingMarks ? 'bi-trophy-fill' : 'bi-x-circle-fill'"></i>
                   </div>
                   <div>
                      <div class="fw-bold small text-dark">{{res.assessment.title}}</div>
                      <div class="small text-muted">{{res.score}}% Score • {{res.endTime | date:'shortDate'}}</div>
                   </div>
                </div>
              </div>
              <ng-template #noResults>
                 <div class="text-center py-4">
                    <p class="text-muted small m-0">No past attempts found.</p>
                 </div>
              </ng-template>
              <button class="btn btn-outline-dark w-100 rounded-pill py-2 mt-2 fw-bold small" routerLink="/candidate/results">VIEW ALL RESULTS</button>
           </div>
           
           <div class="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white">
              <h6 class="fw-bold small uppercase mb-1 opacity-75">Your Ranking</h6>
              <h3 class="fw-bold mb-3">#12 <small class="fs-6 fw-normal">Global</small></h3>
              <div class="progress bg-white-20 rounded-pill mb-3" style="height: 6px;">
                 <div class="progress-bar bg-white" style="width: 85%"></div>
              </div>
              <p class="small mb-0">Top 15% of candidates this month. Keep it up!</p>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .candidate-dash { background: #f8fbff; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .welcome-hero { background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); position: relative; }
    .bg-white-20 { background: rgba(255,255,255,0.15); }
    .hero-bg-shapes { 
      position: absolute; top: 0; right: 0; width: 100%; height: 100%; 
      background: radial-gradient(circle at top right, rgba(66, 153, 225, 0.2), transparent 50%);
    }
    .assessment-card { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent !important; }
    .assessment-card:hover { border-color: #0d6efd !important; transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important; }
    .bg-primary-soft { background: #eef2ff; color: #4338ca; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .activity-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
    .clickable { cursor: pointer; transition: background 0.2s; }
    .clickable:hover { background: #f3f4f6 !important; }
  `]
})
export class CandidateDashboardComponent implements OnInit {
  assessments: Assessment[] = [];
  results: any[] = [];
  username: string = '';

  constructor(private candidateService: CandidateService, private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || '';
    this.loadData();
  }

  loadData() {
    this.candidateService.getAssessments().subscribe(data => this.assessments = data);
    this.candidateService.getResults().subscribe(data => this.results = data);
  }
}
