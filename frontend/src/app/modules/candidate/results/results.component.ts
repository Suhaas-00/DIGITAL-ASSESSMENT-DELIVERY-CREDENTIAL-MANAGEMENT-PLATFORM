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

              <div class="d-flex gap-2">

                <button class="btn btn-outline-dark flex-grow-1 py-2 rounded-pill fw-bold small">
                  VIEW FEEDBACK
                </button>

                <button *ngIf="isPassed(res)"
                        class="btn btn-dark flex-grow-1 py-2 rounded-pill fw-bold small"
                        routerLink="/public/verify">
                  VERIFY
                </button>

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
    .result-card:hover { transform: translateY(-5px); }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .uppercase { text-transform: uppercase; font-size: 0.7rem; }
  `]
})
export class CandidateResultsComponent implements OnInit {

   results: Attempt[] = [];

   constructor(private candidateService: CandidateService) { }

   ngOnInit(): void {
      this.loadResults();
   }

   loadResults() {
      this.candidateService.getResults().subscribe({
         next: (data) => {
            console.log("📊 Results:", data);
            this.results = data;
         },
         error: (err) => {
            console.error("❌ Error loading results:", err);
         }
      });
   }

   // ✅ SAFE PASS CHECK
   isPassed(attempt: Attempt): boolean {
      return (attempt.score || 0) >= (attempt.assessment?.passingMarks || 0);
   }

   // ✅ SAFE PROGRESS CALCULATION
   getProgress(attempt: Attempt): string {
      const score = attempt.score || 0;
      const total = attempt.assessment?.totalMarks || 1;
      return ((score / total) * 100) + '%';
   }
}