import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';
import { Assessment } from 'src/app/models/app.models';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-wrap p-4">
      <div class="row align-items-center mb-5">
        <div class="col-md-8">
          <h1 class="display-5 fw-bold text-dark mb-1">Command Center</h1>
          <p class="text-muted fs-5">Advanced Administrator Interface for governing platform algorithms and users.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="date-chip shadow-sm border">
            <i class="bi bi-shield-check text-success me-2"></i> Authorized Root Access
          </div>
        </div>
      </div>

      <!-- Advanced Analytics Grid -->
      <div class="row g-4 mb-5" *ngIf="analytics">
        <div class="col-lg col-sm-6" *ngFor="let stat of statCards">
          <div class="stat-card shadow-sm border-0 h-100 overflow-hidden position-relative">
            <div class="card-body p-4 position-relative z-index-1">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box" [ngStyle]="{'background': stat.color + '20', 'color': stat.color}">
                   <i [class]="stat.icon"></i>
                </div>
                <span class="trend badge rounded-pill" [ngStyle]="{'background': stat.color, 'color': '#fff'}">LIVE</span>
              </div>
              <h6 class="text-muted fw-bold small uppercase mb-1 tracking-wider">{{stat.label}}</h6>
              <h2 class="fw-bold mb-0 text-dark display-6">{{stat.value}}</h2>
            </div>
            <div class="stat-bg-blob" [ngStyle]="{'background': 'radial-gradient(circle, ' + stat.color + '10, transparent 70%)'}"></div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Center Console: Master Controls & Recent Assessments -->
        <div class="col-xl-8">
           <!-- Master Controls -->
           <div class="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-4 position-relative overflow-hidden">
             <div class="bg-blur-blob"></div>
             <div class="position-relative z-index-1">
                <h4 class="fw-bold mb-4"><i class="bi bi-cpu me-2"></i> Administrative Master Controls</h4>
                <div class="row g-3">
                   <div class="col-md-4">
                      <button class="btn btn-outline-light w-100 py-3 rounded-3 text-start control-btn" routerLink="/admin/assessments">
                         <i class="bi bi-journal-code text-primary fs-4 d-block mb-2"></i>
                         <strong class="d-block">Assessment AI</strong>
                         <small class="text-white-50">Manage algorithms & rules</small>
                      </button>
                   </div>
                   <div class="col-md-4">
                      <button class="btn btn-outline-light w-100 py-3 rounded-3 text-start control-btn" routerLink="/admin/questions">
                         <i class="bi bi-cloud-arrow-up text-success fs-4 d-block mb-2"></i>
                         <strong class="d-block">Bulk Question I/O</strong>
                         <small class="text-white-50">Ingest .csv question banks</small>
                      </button>
                   </div>
                   <div class="col-md-4">
                      <button class="btn btn-outline-light w-100 py-3 rounded-3 text-start control-btn" routerLink="/admin/reports">
                         <i class="bi bi-shield-lock text-warning fs-4 d-block mb-2"></i>
                         <strong class="d-block">Security & Audits</strong>
                         <small class="text-white-50">View credential traces</small>
                      </button>
                   </div>
                </div>
             </div>
           </div>

          <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
             <div class="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h4 class="fw-bold mb-0">System Algorithms (Assessments)</h4>
                <button class="btn btn-light shadow-sm btn-sm px-4 fw-bold rounded-pill" routerLink="/admin/assessments">View Catalog</button>
             </div>
             <div class="card-body p-0">
                <div class="table-responsive">
                   <table class="table table-hover align-middle mb-0">
                      <thead class="bg-light">
                         <tr class="text-muted small uppercase fw-bold">
                            <th class="ps-4">Entity Record</th>
                            <th>Status Matrix</th>
                            <th>Pass Ratio</th>
                            <th class="pe-4 text-end">Inspect</th>
                         </tr>
                      </thead>
                      <tbody>
                         <tr *ngFor="let item of assessments?.slice(0,5)" class="cursor-pointer transition-all hover-scale">
                            <td class="ps-4 py-3">
                               <div class="fw-bold text-dark">{{item.title}}</div>
                               <span class="badge bg-secondary opacity-75 mt-1">{{item.domain}} • {{item.duration}}m</span>
                            </td>
                            <td><span class="badge px-3 py-2 border" [ngClass]="item.status === 'ACTIVE' ? 'bg-success-soft text-success border-success' : 'bg-warning-soft text-warning border-warning'">{{item.status}}</span></td>
                            <td>
                               <div class="progress rounded-pill bg-light border" style="height: 8px; width: 120px;">
                                  <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" [style.width]="'82%'"></div>
                                </div>
                               <small class="text-muted mt-2 d-block fw-bold">82.4% Optimal</small>
                            </td>
                            <td class="pe-4 text-end">
                               <button class="btn btn-icon btn-light border shadow-sm"><i class="bi bi-box-arrow-up-right text-muted"></i></button>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          <!-- Examiner Visibility Matrix -->
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden" *ngIf="analytics?.examinerContribution">
             <div class="card-header bg-white border-bottom-0 py-4 px-4">
                <h4 class="fw-bold mb-0">Platform Examiner Directory (Master List)</h4>
             </div>
             <div class="card-body p-0">
                <div class="table-responsive">
                   <table class="table table-hover align-middle mb-0">
                      <thead class="bg-dark text-white">
                         <tr class="small uppercase fw-bold">
                            <th class="ps-4">Examiner Profile</th>
                            <th>Status</th>
                            <th>Birth Date</th>
                            <th>Bank Size</th>
                            <th>Exams</th>
                            <th class="pe-4 text-end">Administrative Actions</th>
                         </tr>
                      </thead>
                      <tbody>
                         <tr *ngFor="let ex of analytics.examinerContribution" class="hover-shadow-sm transition-all">
                            <td class="ps-4 py-3">
                               <div class="d-flex align-items-center">
                                  <div class="avatar-sm bg-primary-soft text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold">
                                     {{ex.username.substring(0,1).toUpperCase()}}
                                  </div>
                                  <div>
                                     <div class="fw-bold text-dark">{{ex.fullName}}</div>
                                     <div class="text-muted small opacity-75">@{{ex.username}} • {{ex.email}}</div>
                                  </div>
                               </div>
                            </td>
                            <td>
                               <span class="badge rounded-pill px-3" [ngClass]="ex.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'">
                                  {{ex.status}}
                               </span>
                            </td>
                            <td><span class="small fw-bold text-secondary">{{ex.dob}}</span></td>
                            <td>
                               <div class="d-flex align-items-center gap-2">
                                  <span class="fw-bold text-dark">{{ex.questionsCount}}</span>
                                  <span class="text-muted small">Qns</span>
                               </div>
                            </td>
                            <td>
                               <div class="d-flex align-items-center gap-2">
                                  <span class="fw-bold text-primary">{{ex.assessmentsCount}}</span>
                               </div>
                            </td>
                            <td class="pe-4 text-end">
                               <div class="btn-group shadow-sm rounded-pill overflow-hidden border">
                                  <button class="btn btn-white btn-sm px-3 fw-bold" routerLink="/admin/examiners" title="Manage Examiner"><i class="bi bi-gear-fill text-primary me-2"></i> Manage Examiner</button>
                                </div>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>

        <!-- Right Side: Threat/Audit Sidebar -->
        <div class="col-xl-4">
           <div class="card shadow-sm border-0 rounded-4 bg-white p-4 mb-4">
              <h5 class="fw-bold mb-4 text-dark"><i class="bi bi-activity text-danger me-2"></i> Global Performance</h5>
              <div class="px-3 py-4 text-center rounded-3 bg-light border mb-4">
                 <h1 class="display-3 fw-bold text-primary mb-0">{{analytics?.averageScore | number:'1.1-1'}}%</h1>
                 <span class="text-muted fw-bold small uppercase tracking-wider d-block mt-2">Aggregate Model Avg</span>
              </div>
              <div class="mb-4">
                 <div *ngFor="let entry of analytics?.attemptsByStatus | keyvalue" class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded-3 bg-white hover-shadow transition-all">
                    <span class="fw-bold text-dark"><i class="bi bi-record-circle text-primary me-2"></i>{{entry.key}}</span>
                    <span class="badge bg-dark rounded-pill fs-6 px-3">{{entry.value}}</span>
                 </div>
              </div>
           </div>
           
           <div class="card shadow-sm border-0 rounded-4 p-4 bg-gradient-primary text-white position-relative overflow-hidden">
              <div class="bg-blur-blob"></div>
              <div class="position-relative z-index-1">
                  <h6 class="fw-bold small uppercase mb-1 opacity-75">Platform Compliance</h6>
                  <h3 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-1 me-3 bg-white rounded-circle"></i> ISO-27001</h3>
                  <p class="small mb-0 opacity-75">All encrypted credential hashes are secure and blockchain ledgers parallelized successfully.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrap { background: #f4f7f9; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .stat-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
    .stat-card:hover { transform: translateY(-7px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1) !important; }
    .icon-box { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: transform 0.3s; }
    .stat-card:hover .icon-box { transform: scale(1.1) rotate(-5deg); }
    .stat-bg-blob { position: absolute; bottom: -50px; right: -50px; width: 150px; height: 150px; border-radius: 50%; z-index: 0; filter: blur(30px); }
    .z-index-1 { z-index: 1; }
    .bg-gradient-primary { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); }
    .bg-blur-blob { position: absolute; top: -50px; right: 0; width: 200px; height: 200px; background: rgba(255,255,255,0.05); filter: blur(40px); border-radius: 50%; z-index: 0; }
    .tracking-wider { letter-spacing: 0.05em; }
    .btn-primary-soft { background: #e0e7ff; color: #4338ca; border: none; font-weight: 700; }
    .bg-success-soft { background: #ecfdf5; color: #059669; }
    .bg-warning-soft { background: #fffbeb; color: #d97706; }
    .btn-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-icon:hover { transform: scale(1.1); background: #f8f9fa; border-color: #dee2e6; }
    .date-chip { background: white; padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 600; color: #343a40; display: inline-block; }
    .control-btn { border-color: rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.03); transition: all 0.3s; }
    .control-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3) !important; transform: translateY(-3px); }
    .hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateX(5px); border-color: #dee2e6 !important; }
    .hover-shadow-sm:hover { background: #fafbff; }
    .transition-all { transition: all 0.3s; }
    .cursor-pointer { cursor: pointer; }
    .avatar-sm { width: 40px; height: 40px; font-size: 0.9rem; }
    .btn-white { background: white; border: none; transition: all 0.2s; }
    .btn-white:hover { background: #f8f9fa; }
    .btn-white:active { background: #e9ecef; }
    .bg-indigo { background: #4338ca; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  analytics: any;
  assessments: any[] = [];
  statCards: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getAnalytics().subscribe((data: any) => {
      this.analytics = data;
      this.statCards = [
        { label: 'Network Assessments', value: data.totalAssessments, icon: 'bi bi-hdd-network', color: '#6366f1' },
        { label: 'Authorized Candidates', value: data.totalCandidates, icon: 'bi bi-person-check', color: '#10b981' },
        { label: 'Platform Examiners', value: data.totalExaminers, icon: 'bi bi-person-workspace', color: '#8b5cf6' },
        { label: 'Processed Computations', value: data.totalAttempts, icon: 'bi bi-cpu', color: '#f59e0b' },
        { label: 'Secured Credentials', value: data.totalCredentialsIssued, icon: 'bi bi-shield-check', color: '#ec4899' }
      ];
    });

    this.adminService.getAssessments().subscribe((data: Assessment[]) => {
      this.assessments = data;
    });
  }
}
