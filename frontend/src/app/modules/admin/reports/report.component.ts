import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';
import { Credential } from 'src/app/models/app.models';

@Component({
  selector: 'app-report',
  template: `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Credential Reports</h1>
      <button class="btn btn-outline-secondary btn-sm">
        <span class="bi bi-download me-2"></span> Export PDF
      </button>
    </div>

    <div class="alert alert-info">
      <span class="bi bi-info-circle me-2"></span>
      This report shows all credentials issued to candidates across all assessments.
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Candidate Name</th>
                <th>Assessment</th>
                <th>Issue Date</th>
                <th>Verification Code</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let item of reports">

                <!-- ✅ FIXED -->
                <td>
                  <strong>
                    {{ item.candidate.fullName || item.candidate.username }}
                  </strong>
                </td>

                <!-- ✅ FIXED -->
                <td>{{ item.assessment.title }}</td>

                <td>{{ item.issueDate | date:'mediumDate' }}</td>

                <!-- ✅ FIXED -->
                <td>
                  <code class="text-primary">
                    {{ item.credentialCode }}
                  </code>
                </td>

                <!-- ✅ FIXED -->
                <td>
                  <span class="badge"
                        [ngClass]="item.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'">
                    {{ item.status }}
                  </span>
                </td>

                <td class="text-end">
                  <button class="btn btn-sm btn-outline-danger" 
                          *ngIf="item.status !== 'REVOKED'"
                          (click)="revoke(item.id!)">
                    <span class="bi bi-x-circle me-1"></span> Revoke
                  </button>
                  <span class="text-muted small" *ngIf="item.status === 'REVOKED'">Revoked</span>
                </td>

              </tr>

              <!-- EMPTY STATE -->
              <tr *ngIf="reports.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  No reports available
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ReportComponent implements OnInit {

  reports: Credential[] = [];
  loading = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;

    this.adminService.getReports().subscribe({
      next: (data: Credential[]) => {
        console.log("📊 Reports:", data);
        this.reports = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error("❌ Error loading reports:", err);
        this.loading = false;
      }
    });
  }

  revoke(id: number) {
    if(confirm("Are you sure you want to revoke this credential permanently?")) {
       this.adminService.revokeCredential(id).subscribe(() => {
          this.loadReports();
       });
    }
  }
}