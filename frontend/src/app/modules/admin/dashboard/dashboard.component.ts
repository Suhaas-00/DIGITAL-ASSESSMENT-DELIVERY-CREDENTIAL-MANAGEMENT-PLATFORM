import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-wrap p-4">
      <div class="row align-items-center mb-5">
        <div class="col-md-8">
          <h1 class="display-5 fw-bold text-dark mb-1">System Intelligence</h1>
          <p class="text-muted fs-5">Real-time overview of your digital assessment platform.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="date-chip"> <i class="bi bi-calendar-event me-2"></i> {{ today | date:'mediumDate' }} </div>
        </div>
      </div>

      <!-- Analytics Grid -->
      <div class="row g-4 mb-5" *ngIf="analytics">
        <div class="col-lg-3 col-sm-6" *ngFor="let stat of statCards">
          <div class="stat-card shadow-sm border-0 h-100" [ngStyle]="{'border-bottom': '4px solid ' + stat.color}">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box" [ngStyle]="{'background': stat.color + '15', 'color': stat.color}">
                   <i [class]="stat.icon"></i>
                </div>
                <span class="trend text-success"><i class="bi bi-arrow-up-short"></i> Live</span>
              </div>
              <h6 class="text-muted fw-bold small uppercase mb-1">{{stat.label}}</h6>
              <h2 class="fw-bold mb-0">{{stat.value}}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Recent Assessments -->
        <div class="col-xl-8">
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
             <div class="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h4 class="fw-bold mb-0">Active Assessments</h4>
                <button class="btn btn-primary-soft btn-sm px-3 rounded-pill" routerLink="/admin/assessments">Manage All</button>
             </div>
             <div class="card-body p-0">
                <div class="table-responsive">
                   <table class="table table-hover align-middle mb-0">
                      <thead class="bg-light">
                         <tr class="text-muted small uppercase fw-bold">
                            <th class="ps-4">Topic / Domain</th>
                            <th>Status</th>
                            <th>Passing Rate</th>
                            <th class="pe-4 text-end">Action</th>
                         </tr>
                      </thead>
                      <tbody>
                         <tr *ngFor="let item of assessments?.slice(0,5)">
                            <td class="ps-4 py-3">
                               <div class="fw-bold text-dark">{{item.title}}</div>
                               <small class="text-muted">{{item.domain}} • {{item.duration}}m</small>
                            </td>
                            <td><span class="badge" [ngClass]="item.status === 'ACTIVE' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'">{{item.status}}</span></td>
                            <td>
                               <div class="progress rounded-pill" style="height: 6px; width: 100px;">
                                  <div class="progress-bar bg-primary" [style.width]="'75%'"></div>
                               </div>
                               <small class="text-muted mt-2 d-block">75% Avg.</small>
                            </td>
                            <td class="pe-4 text-end">
                               <button class="btn btn-icon" [routerLink]="['/admin/assessments', item.id]"><i class="bi bi-chevron-right"></i></button>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>

        <!-- Insights Sidebar -->
        <div class="col-xl-4">
           <div class="card shadow-sm border-0 rounded-4 h-100 bg-dark text-white p-4">
              <h4 class="fw-bold mb-4">Quick Insights</h4>
              <div class="insight-item mb-4">
                 <small class="text-white-50 d-block mb-1">Average System Score</small>
                 <h2 class="display-6 fw-bold mb-0">{{analytics?.averageScore | number:'1.1-1'}}%</h2>
              </div>
              <hr class="border-secondary mb-4">
              <div class="mb-4">
                 <small class="text-white-50 d-block mb-2">Attempts by Status</small>
                 <div *ngFor="let entry of analytics?.attemptsByStatus | keyvalue" class="d-flex justify-content-between mb-2">
                    <span>{{entry.key}}</span>
                    <span class="fw-bold">{{entry.value}}</span>
                 </div>
              </div>
              <div class="mt-auto">
                 <button class="btn btn-outline-light w-100 py-2 rounded-pill fw-bold">Download Full Report</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrap { background: #f8fbff; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .stat-card { border-radius: 20px; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-5px); }
    .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .trend { font-size: 0.75rem; font-weight: 700; background: #e6fffa; padding: 2px 8px; border-radius: 6px; }
    .btn-primary-soft { background: #e0e7ff; color: #4338ca; border: none; font-weight: 700; }
    .bg-success-soft { background: #ecfdf5; color: #059669; }
    .bg-warning-soft { background: #fffbeb; color: #d97706; }
    .btn-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #a0aec0; }
    .btn-icon:hover { background: #f7fafc; color: #2d3748; }
    .date-chip { background: white; padding: 0.5rem 1rem; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 600; color: #4a5568; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  analytics: any;
  assessments: any[] = [];
  today = new Date();
  statCards: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getAnalytics().subscribe(data => {
      this.analytics = data;
      this.statCards = [
        { label: 'Total Assessments', value: data.totalAssessments, icon: 'bi bi-file-earmark-text', color: '#6366f1' },
        { label: 'Total Candidates', value: data.totalCandidates, icon: 'bi bi-people', color: '#10b981' },
        { label: 'Total Attempts', value: data.totalAttempts, icon: 'bi bi-activity', color: '#f59e0b' },
        { label: 'Credentials Issued', value: data.totalCredentialsIssued, icon: 'bi bi-patch-check', color: '#ec4899' }
      ];
    });

    this.adminService.getAssessments().subscribe(data => {
      this.assessments = data;
    });
  }
}
