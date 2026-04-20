import { Component, OnInit } from '@angular/core';
import { ExaminerService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-examiner-dashboard',
  template: `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Examiner Dashboard</h1>
    </div>

    <!-- STATS -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-info text-white">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 small opacity-75">Pending Evaluations</h6>
            <h2 class="card-title mb-0">{{ pendingCount }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- ATTEMPTS -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0">Recent Submissions</h5>
      </div>

      <div class="card-body p-0">
        <app-attempt-list [limit]="5"></app-attempt-list>
      </div>
    </div>
  `
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