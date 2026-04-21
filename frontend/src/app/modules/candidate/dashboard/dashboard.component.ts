import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/core/services/api.service';
import { Assessment } from 'src/app/models/app.models';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-candidate-dashboard',
  template: `
    <div class="px-4 py-4 min-vh-100 bg-light animate__animated animate__fadeIn">
      
      <!-- User Hero -->
      <div class="card border-0 bg-white shadow-sm rounded-2 p-4 mb-4">
         <div class="d-flex align-items-center gap-4">
            <div class="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; border-radius: 50%; font-size: 24px; font-weight: 700;">
               {{username.charAt(0).toUpperCase()}}
            </div>
            <div>
               <h2 class="fw-bold m-0 brand-text">Welcome back, {{username}}</h2>
               <p class="text-muted m-0">Explore your assigned evaluations and track your certification progress.</p>
            </div>
         </div>
      </div>

      <div class="row g-4">
        <!-- Main Content -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark m-0 uppercase ls-1">Active Clusters</h5>
            <div class="d-flex gap-2">
               <button class="btn btn-outline-primary btn-sm px-3 rounded-pill fw-bold">All Domains</button>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-6" *ngFor="let item of assessments">
              <div class="card h-100 border bg-white shadow-none rounded-2 hover-shadow-google overflow-hidden">
                <div class="card-body p-4">
                  <div class="mb-3 d-flex justify-content-between align-items-center">
                    <span class="badge bg-light text-muted border px-3 py-1" style="font-size: 10px;">{{item.domain}}</span>
                    <span class="text-muted small"><i class="bi bi-clock me-1"></i> {{item.duration}}m</span>
                  </div>
                  <h5 class="fw-bold text-dark mb-2">{{item.title}}</h5>
                  <p class="text-muted small mb-4">{{item.description}}</p>
                  <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                     <span class="small fw-bold text-dark">{{item.totalMarks}} Marks</span>
                     <button class="btn btn-primary btn-sm px-4 fw-bold" [routerLink]="['/candidate/exam', item.id]">
                        INITIALIZE SESSION
                     </button>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="assessments.length === 0" class="col-12 text-center py-5 bg-white rounded-2 border">
               <i class="bi bi-inbox text-muted display-1"></i>
               <h6 class="mt-3 text-muted">Provisioning complete. No active assessments found for your node.</h6>
            </div>
          </div>
        </div>

        <!-- Sidebar Activity -->
        <div class="col-lg-4">
           <div class="card border bg-white shadow-none rounded-2 p-4 mb-4">
              <h6 class="fw-bold text-dark mb-4 uppercase ls-1">Telemetry / Logs</h6>
              <div *ngIf="results.length > 0; else noResults">
                <div *ngFor="let res of results.slice(0,3)" class="activity-item d-flex gap-3 mb-4">
                   <div class="activity-icon border" [ngClass]="isPassed(res) ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'" style="width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi" [ngClass]="isPassed(res) ? 'bi-check-circle-fill' : 'bi-dash-circle-fill'"></i>
                   </div>
                   <div>
                      <div class="fw-bold small text-dark">{{res.assessment.title}}</div>
                      <div class="small text-muted" style="font-size: 11px;">{{getScorePercent(res)}}% Analysis • {{res.endTime | date:'mediumDate'}}</div>
                   </div>
                </div>
              </div>
              <ng-template #noResults>
                 <div class="text-center py-4">
                    <p class="text-muted small m-0">No historical data available.</p>
                 </div>
              </ng-template>
              <button class="btn btn-outline-primary w-100 py-2 mt-2 fw-bold small" routerLink="/candidate/results">CORE ANALYSIS LOG</button>
           </div>
           
           <div class="card border-0 rounded-2 p-4 bg-primary text-white shadow-none position-relative overflow-hidden">
              <h6 class="fw-bold small uppercase mb-1 opacity-75 ls-1">Intelligence Rank</h6>
              <h3 class="fw-bold mb-3">Global Consensus #12</h3>
              <div class="progress bg-white-20 rounded-pill mb-3" style="height: 4px;">
                 <div class="progress-bar bg-white" style="width: 85%"></div>
              </div>
              <p class="small mb-0 opacity-75">You are performing at the 85th percentile of all regional cluster nodes.</p>
              <i class="bi bi-graph-up-arrow position-absolute opacity-10" style="bottom: -10px; right: 10px; font-size: 5rem;"></i>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 1px; }
    .bg-white-20 { background: rgba(255,255,255,0.2); }
    .bg-success-soft { background: rgba(52, 168, 83, 0.1); color: #34a853; }
    .bg-danger-soft { background: rgba(234, 67, 53, 0.1); color: #ea4335; }
    .hover-shadow-google:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important; }
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

  isPassed(res: any): boolean {
    const score = res.score || 0;
    const total = res.assessment?.totalMarks || 1;
    const passing = res.assessment?.passingMarks || Math.ceil(total * 0.5);
    return score >= Math.max(passing, Math.ceil(total * 0.5));
  }

  getScorePercent(res: any): number {
    const total = res.assessment?.totalMarks || 1;
    return Math.round((res.score / total) * 100);
  }
}
