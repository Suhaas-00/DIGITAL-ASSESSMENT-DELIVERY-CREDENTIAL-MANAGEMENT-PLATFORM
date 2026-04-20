import { Component, OnInit } from '@angular/core';
import { ExaminerService, AdminService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-assessment-builder',
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Assessment Builder</h2>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ New Assessment' }}
        </button>
      </div>

      <!-- ALERTS -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="successMsg">
        {{ successMsg }}
        <button type="button" class="btn-close" (click)="successMsg=''"></button>
      </div>
      <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>

      <!-- AUTO-GENERATE FORM -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="showForm">
        <div class="card-header fw-bold bg-success text-white">Auto-Generate Assessment from Question Bank</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Assessment Title *</label>
              <input type="text" class="form-control" [(ngModel)]="form.title" placeholder="e.g. Java Fundamentals Test" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Domain / Category Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.domain"
                     placeholder="Must match an existing category name" />
              <div class="form-text">Enter a category name that exists in the system (e.g. Java, Python, SQL)</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Difficulty Level</label>
              <select class="form-select" [(ngModel)]="form.difficulty">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Number of Questions *</label>
              <input type="number" class="form-control" [(ngModel)]="form.count" min="1" max="50" />
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-success px-4" (click)="generate()" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Generate Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MY ASSESSMENTS -->
      <div class="card border-0 shadow-sm">
        <div class="card-header fw-bold bg-white py-3">My Assessments</div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Domain</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                  <th>Passing Marks</th>
                  <th>Status</th>
                  <th>Scheduled From</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of assessments">
                  <td>{{ a.id }}</td>
                  <td><strong>{{ a.title }}</strong></td>
                  <td>{{ a.domain }}</td>
                  <td>{{ a.duration }} min</td>
                  <td>{{ a.totalMarks }}</td>
                  <td>{{ a.passingMarks }}</td>
                  <td>
                    <span class="badge"
                      [ngClass]="{
                        'bg-warning text-dark': a.status === 'SCHEDULED',
                        'bg-success':           a.status === 'ACTIVE',
                        'bg-secondary':         a.status === 'COMPLETED'
                      }">{{ a.status }}</span>
                  </td>
                  <td>{{ a.startDateTime | date:'short' }}</td>
                </tr>
                <tr *ngIf="assessments.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    No assessments yet. Use the form above to generate one.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AssessmentBuilderComponent implements OnInit {

  assessments: any[] = [];
  showForm = false;
  loading = false;
  successMsg = '';
  errorMsg = '';

  form = {
    title: '',
    domain: '',
    difficulty: 'MEDIUM',
    count: 10
  };

  constructor(
    private examinerService: ExaminerService,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    // Load all assessments and filter by createdBy on frontend for now
    this.adminService.getAssessments().subscribe({
      next: (data) => {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
          this.assessments = data.filter((a: any) => a.createdBy?.id === user.id);
        } else {
          this.assessments = data;
        }
      },
      error: (err) => console.error('Failed to load assessments:', err)
    });
  }

  generate(): void {
    this.errorMsg = '';
    if (!this.form.title.trim() || !this.form.domain.trim() || !this.form.count) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    this.loading = true;

    const user = this.authService.getCurrentUser();
    const examinerId = user?.id || 1;

    this.examinerService.generateAssessment(
      this.form.title,
      this.form.domain,
      this.form.difficulty,
      this.form.count
    ).subscribe({
      next: (data: any) => {
        this.successMsg = `✅ Assessment "${data.title}" created with ${data.questions?.length || this.form.count} questions!`;
        this.showForm = false;
        this.loading = false;
        this.assessments.unshift(data);
      },
      error: (err: any) => {
        this.errorMsg = err?.error?.message || 'Generation failed. Ensure enough questions exist in the selected category & difficulty.';
        this.loading = false;
      }
    });
  }
}
