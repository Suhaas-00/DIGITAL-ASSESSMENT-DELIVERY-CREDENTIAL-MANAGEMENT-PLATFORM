import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/core/services/api.service';
import { Attempt } from 'src/app/models/app.models';

@Component({
   selector: 'app-candidate-results',
   template: `
    <div class="results-page p-4">
      <div class="header-section mb-5">
        <h1 class="display-6 fw-bold text-dark">Performance Analytics</h1>
        <p class="text-muted">Detailed breakdown of your assessment outcomes.</p>
      </div>

      <div class="row g-4">

        <div class="col-xl-4 col-md-6" *ngFor="let res of results">

          <div class="result-card shadow-sm border-0 rounded-4 overflow-hidden h-100 bg-white">

            <!-- HEADER -->
            <div class="card-header p-4 border-0 d-flex justify-content-between align-items-center"
                 [ngClass]="isPassed(res) ? 'bg-success-soft' : 'bg-danger-soft'">

              <span class="badge rounded-pill px-3 py-2"
                    [ngClass]="isPassed(res) ? 'bg-success' : 'bg-danger'">
                {{ isPassed(res) ? 'PASSED' : 'FAILED' }}
              </span>

              <span class="small fw-bold"
                    [ngClass]="isPassed(res) ? 'text-success' : 'text-danger'">
                {{ res.endTime | date:'mediumDate' }}
              </span>
            </div>

            <!-- BODY -->
            <div class="card-body p-4">

              <!-- ✅ SAFE ACCESS -->
              <h4 class="fw-bold text-dark mb-4 text-truncate">
                {{ res.assessment.title }}
              </h4>

              <div class="metrics-grid mb-4">

                <div class="metric">
                  <label class="text-muted small uppercase fw-bold mb-1">Score</label>
                  <div class="h2 fw-bold mb-0"
                       [ngClass]="isPassed(res) ? 'text-success' : 'text-danger'">
                    {{ res.score || 0 }}
                  </div>
                </div>

                <div class="metric">
                  <label class="text-muted small uppercase fw-bold mb-1">Max</label>
                  <div class="h2 fw-bold text-dark mb-0">
                    {{ res.assessment.totalMarks || 0 }}
                  </div>
                </div>

              </div>

              <!-- ✅ FIXED PROGRESS -->
              <div class="progress rounded-pill mb-4" style="height: 10px;">
                <div class="progress-bar"
                     [ngClass]="isPassed(res) ? 'bg-success' : 'bg-danger'"
                     [style.width]="getProgress(res)">
                </div>
              </div>

              <div class="d-flex flex-column gap-2">
                <button class="btn btn-outline-dark w-100 py-2 rounded-pill fw-bold small">
                  VIEW FEEDBACK
                </button>
                <!-- CREDENTIAL DISPLAY -->
                <div *ngIf="isPassed(res) && getCredentialCode(res.assessment.id)" class="mt-2 text-center">
                    <span class="d-block small text-muted uppercase fw-bold mb-1">Credential Code Generated</span>
                    <div class="input-group">
                       <input type="text" readonly class="form-control form-control-sm text-center fw-bold font-monospace bg-light border-0" [value]="getCredentialCode(res.assessment.id)">
                       <button class="btn btn-primary btn-sm fw-bold px-3" [routerLink]="['/verify']" [queryParams]="{code: getCredentialCode(res.assessment.id)}">Verify</button>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div *ngIf="results.length === 0" class="col-12 text-center py-5">
          <h3>No Results Yet</h3>
        </div>

      </div>
    </div>
  `,
   styles: [`
    .results-page { background: #f8fbff; min-height: 100vh; }
    .bg-success-soft { background: #ecfdf5; }
    .bg-danger-soft { background: #fef2f2; }
    .result-card { transition: transform 0.2s; }
    .result-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .uppercase { text-transform: uppercase; font-size: 0.7rem; }
  `]
})
export class CandidateResultsComponent implements OnInit {

   results: Attempt[] = [];
   credentials: any[] = [];

   constructor(private candidateService: CandidateService) { }

   ngOnInit(): void {
      this.loadResults();
   }

   loadResults() {
      this.candidateService.getResults().subscribe(data => this.results = data);
      this.candidateService.getCredentials().subscribe(data => this.credentials = data);
   }

   // ✅ STRICT PASS CHECK (Enforces 50% Threshold)
   isPassed(attempt: Attempt): boolean {
      const score = attempt.score || 0;
      const total = attempt.assessment?.totalMarks || 1;
      const passing = attempt.assessment?.passingMarks || Math.ceil(total * 0.5);
      
      // Secondary safety check: ensure the score is at least 50% of total marks
      const fiftyPercent = Math.ceil(total * 0.5);
      return score >= Math.max(passing, fiftyPercent);
   }

   // ✅ SAFE PROGRESS CALCULATION
   getProgress(attempt: Attempt): string {
      const score = attempt.score || 0;
      const total = attempt.assessment?.totalMarks || 1;
      return ((score / total) * 100) + '%';
   }

   // ✅ MAP CREDENTIAL CODE
   getCredentialCode(assessmentId: number | undefined): string | null {
      if (!assessmentId) return null;
      const cred = this.credentials.find(c => c.assessment?.id === assessmentId);
      return cred ? cred.credentialCode : null;
   }
}