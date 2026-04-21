import { Component, OnInit } from '@angular/core';
import { ExaminerService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-examiner-dashboard',
  template: `
    <div class="px-4 py-4 min-vh-100 bg-light animate__animated animate__fadeIn">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 class="fw-bold m-0 brand-text">Examiner Control</h2>
          <p class="text-muted small uppercase ls-1">Monitor submissions and evaluate candidate performances</p>
        </div>
      </div>

      <!-- STATS -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card border bg-white shadow-none rounded-2 p-4 h-100 position-relative hover-shadow-google transition-all">
            <h6 class="text-muted fw-bold small uppercase ls-1 mb-2">Pending Evaluation</h6>
            <h2 class="fw-bold text-dark mb-0">{{ pendingCount }}</h2>
            <div class="position-absolute top-0 end-0 p-3">
               <i class="bi bi-hourglass-split text-warning h4 opacity-50"></i>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card border bg-white shadow-none rounded-2 p-4 h-100 position-relative hover-shadow-google transition-all">
             <h6 class="text-muted fw-bold small uppercase ls-1 mb-2">Processed Clusters</h6>
             <h2 class="fw-bold text-dark mb-0">{{ attempts.length }}</h2>
             <div class="position-absolute top-0 end-0 p-3">
               <i class="bi bi-layers text-primary h4 opacity-50"></i>
            </div>
          </div>
        </div>

        <div class="col-md-4">
           <div class="card border-0 bg-primary text-white rounded-2 p-4 h-100 position-relative shadow-none overflow-hidden">
              <h6 class="fw-bold small uppercase ls-1 mb-2 opacity-75">Neural Capacity</h6>
              <h2 class="fw-bold mb-0">98.4%</h2>
              <p class="small mb-0 mt-2 opacity-75">All regional nodes responding.</p>
              <i class="bi bi-cpu position-absolute opacity-10" style="bottom: -15px; right: 5px; font-size: 4rem;"></i>
           </div>
        </div>
      </div>

      <!-- RECENT SUBMISSIONS -->
      <div class="card border bg-white shadow-none rounded-2 overflow-hidden">
        <div class="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0 brand-text">Transmission Queue</h5>
          <button class="btn btn-outline-primary btn-sm px-3 fw-bold" routerLink="/examiner/attempts">Full Ledger</button>
        </div>

        <div class="card-body p-0">
          <app-attempt-list [limit]="5"></app-attempt-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 1px; }
    .hover-shadow-google:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
    .transition-all { transition: all 0.2s ease-in-out; }
  `]
})
export class ExaminerDashboardComponent implements OnInit {

  attempts: any[] = [];        // ✅ FIXED
  pendingCount = 0;

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    this.loadAttempts();
  }

  loadAttempts() {
    this.examinerService.getAttempts().subscribe({
      next: (data) => {
        console.log("Dashboard Attempts:", data);
        this.attempts = data;

        // ✅ FIXED COUNT
        this.pendingCount = data.filter(a => a.status === 'SUBMITTED').length;
      },
      error: (err) => console.error(err)
    });
  }
}