import { Component, OnInit } from '@angular/core';
import { ExaminerService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Assessment, Question, User } from 'src/app/models/app.models';

@Component({
  selector: 'app-assessment-builder',
  template: `
    <div class="p-4 bg-light min-vh-100 pb-5">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 mb-1 fw-bold">Assessment Builder</h2>
          <p class="text-muted small mb-0">Schedule automated or manual targeted skill evaluations</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center rounded-pill px-4 shadow-sm" (click)="toggleForm()">
          <i class="bi" [ngClass]="showForm ? 'bi-x-lg me-2' : 'bi-plus-lg me-2'"></i>
          {{ showForm ? 'Cancel' : 'New Assessment' }}
        </button>
      </div>

      <!-- ALERTS -->
      <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm" *ngIf="successMsg">
        <i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}
        <button type="button" class="btn-close" (click)="successMsg=''"></button>
      </div>

      <div class="alert alert-danger border-0 shadow-sm" *ngIf="errorMsg">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
      </div>

      <!-- FORM -->
      <div class="card border-0 shadow-sm mb-5 overflow-hidden animate-fade-in" *ngIf="showForm">
        <div class="card-header bg-white p-0 border-0">
          <ul class="nav nav-tabs nav-fill">
            <li class="nav-item">
              <a class="nav-link border-0 py-3 fw-bold" [class.active]="createMode === 'AUTO'" 
                 (click)="createMode = 'AUTO'" href="javascript:void(0)">
                <i class="bi bi-robot me-2"></i> Auto-Generate
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link border-0 py-3 fw-bold" [class.active]="createMode === 'MANUAL'" 
                 (click)="createMode = 'MANUAL'" href="javascript:void(0)">
                <i class="bi bi-pencil-square me-2"></i> Manual Selection
              </a>
            </li>
          </ul>
        </div>

        <div class="card-body p-4 p-md-5">
          <div class="row g-4">
            
            <!-- BASIC INFO -->
            <div class="col-md-4">
              <label class="form-label fw-bold text-secondary">Assessment Title *</label>
              <input type="text" class="form-control form-control-lg bg-light border-0 shadow-none" 
                     placeholder="e.g. Advanced Java Certification" [(ngModel)]="form.title" />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-bold text-secondary">Domain / Category *</label>
              <input type="text" class="form-control form-control-lg bg-light border-0 shadow-none" 
                     placeholder="e.g. Java, Python, SQL" [(ngModel)]="form.domain" />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-bold text-secondary">Duration (Minutes) *</label>
              <input type="number" class="form-control form-control-lg bg-light border-0 shadow-none" 
                     [(ngModel)]="form.duration" min="5" step="5" />
            </div>

            <!-- SCHEDULING -->
            <div class="col-md-6">
              <label class="form-label fw-bold text-secondary">Start Date & Time *</label>
              <input type="datetime-local" class="form-control form-control-lg bg-light border-0 shadow-none" 
                     [(ngModel)]="form.startDateTime" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold text-secondary">End Date & Time *</label>
              <input type="datetime-local" class="form-control form-control-lg bg-light border-0 shadow-none" 
                     [(ngModel)]="form.endDateTime" />
            </div>

            <!-- CANDIDATE MAPPING -->
            <div class="col-12">
              <label class="form-label fw-bold text-secondary mb-2">Assign Candidates (Targeted Audience) *</label>
              <div class="candidate-selector rounded-3 border bg-white p-3 d-flex flex-wrap gap-2" style="max-height: 150px; overflow-y: auto;">
                 <div *ngFor="let c of allCandidates" 
                      class="candidate-chip p-2 px-3 rounded-pill border transition-all pointer-cursor small"
                      [class.bg-primary]="selectedCandidateIds.has(c.id!)"
                      [class.text-white]="selectedCandidateIds.has(c.id!)"
                      (click)="toggleCandidate(c.id!)">
                    {{c.username}}
                 </div>
                 <div *ngIf="allCandidates.length === 0" class="text-muted small py-2 w-100 text-center">No candidates found</div>
              </div>
            </div>

            <hr class="my-4 opacity-5">

            <!-- MODE SPECIFIC -->
            <ng-container *ngIf="createMode === 'AUTO'">
              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary">Difficulty Level</label>
                <select class="form-select form-select-lg bg-light border-0 shadow-none" [(ngModel)]="form.difficulty">
                  <option value="EASY">Easy (Beginner)</option>
                  <option value="MEDIUM">Medium (Intermediate)</option>
                  <option value="HARD">Hard (Advanced)</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary">Number of Questions *</label>
                <input type="number" class="form-control form-control-lg bg-light border-0 shadow-none" 
                       [(ngModel)]="form.count" min="1" max="50" />
              </div>
            </ng-container>

            <ng-container *ngIf="createMode === 'MANUAL'">

              <div class="col-12 mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <label class="form-label fw-bold text-secondary mb-0">Select Questions ({{selectedQuestionIds.size}} selected)</label>
                </div>
                
                <div class="question-selector rounded-3 border bg-white shadow-inner p-3" style="max-height: 300px; overflow-y: auto;">
                   <div *ngFor="let q of myQuestions" class="question-item p-3 mb-2 rounded border-start border-4 hover-shadow transition-all pointer-cursor"
                        [class.border-primary]="selectedQuestionIds.has(q.id!)"
                        [class.bg-light-primary]="selectedQuestionIds.has(q.id!)"
                        (click)="toggleQuestion(q.id!)">
                      <div class="d-flex align-items-center">
                        <div class="form-check me-3">
                          <input class="form-check-input shadow-none" type="checkbox" [checked]="selectedQuestionIds.has(q.id!)">
                        </div>
                        <div class="flex-grow-1">
                          <span class="badge bg-light text-dark border me-2 small">{{q.difficultyLevel}}</span>
                          <span class="text-dark small">{{q.questionText}}</span>
                        </div>
                        <div class="text-primary fw-bold small ms-2">{{q.marks}} pts</div>
                      </div>
                   </div>
                </div>
              </div>
            </ng-container>

            <div class="col-12 text-end mt-5 pt-3 border-top">
              <button class="btn btn-lg btn-success rounded-pill px-5 shadow transition-all" 
                      (click)="save()" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ createMode === 'AUTO' ? 'Schedule Automation' : 'Confirm Manual Entry' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ASSESSMENT TABLE -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden border">
        <div class="card-header bg-white py-4 px-4 border-0 d-flex justify-content-between align-items-center">
           <h3 class="h5 mb-0 fw-bold">My Assessments</h3>
           <span class="badge bg-primary rounded-pill px-3 py-2">{{assessments.length}} total</span>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light-subtle shadow-sm border-bottom">
              <tr>
                <th class="px-4 py-3 border-0 text-secondary text-uppercase small ls-1 font-monospace">Details</th>
                <th class="py-3 border-0 text-secondary text-uppercase small ls-1 font-monospace">Window</th>
                <th class="py-3 border-0 text-secondary text-uppercase small ls-1 font-monospace text-center">Settings</th>
                <th class="py-3 border-0 text-secondary text-uppercase small ls-1 font-monospace text-center">Status</th>
                <th class="py-3 border-0 text-secondary text-uppercase small ls-1 font-monospace text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of assessments" class="transition-all border-bottom border-light">
                <td class="px-4 py-4">
                  <div class="d-flex align-items-center">
                    <div class="icon-box bg-primary-soft text-primary rounded-3 me-3 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;">
                      <i class="bi bi-file-earmark-text h5 mb-0"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark mb-1">{{ a.title }}</div>
                      <div class="badge bg-light text-primary small rounded-pill border border-primary-subtle">{{ a.domain }}</div>
                    </div>
                  </div>
                </td>
                <td>
                   <div class="small text-muted mb-1"><i class="bi bi-calendar-event me-2"></i>{{ a.startDateTime | date:'short' }}</div>
                   <div class="small text-muted"><i class="bi bi-calendar-check me-2"></i>{{ a.endDateTime | date:'short' }}</div>
                </td>
                <td class="text-center">
                   <div class="d-flex flex-column align-items-center gap-1">
                      <span class="small badge bg-light text-dark"><i class="bi bi-stopwatch me-1"></i>{{ a.duration }}m</span>
                      <span class="small fw-bold text-dark">{{ a.totalMarks }} pts</span>
                   </div>
                </td>
                <td class="text-center">
                  <div class="dropdown">
                    <button class="btn btn-sm px-3 rounded-pill dropdown-toggle border shadow-sm" 
                            [class.bg-success]="a.status === 'ACTIVE'"
                            [class.bg-danger]="a.status === 'COMPLETED'"
                            [class.bg-warning]="a.status === 'SCHEDULED'"
                            [class.text-white]="a.status !== 'SCHEDULED'"
                            data-bs-toggle="dropdown">
                      {{ a.status }}
                    </button>
                    <ul class="dropdown-menu shadow-lg border-0 rounded-3">
                      <li><a class="dropdown-item py-2" (click)="toggleStatus(a, 'ACTIVE')" href="javascript:void(0)">🚀 Activate</a></li>
                      <li><a class="dropdown-item py-2 text-danger" (click)="toggleStatus(a, 'COMPLETED')" href="javascript:void(0)">⏹ Stop</a></li>
                    </ul>
                  </div>
                </td>
                <td class="text-end px-4">
                   <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                      <button class="btn btn-white btn-sm px-3" (click)="viewDetails(a)" title="View Details">
                         <i class="bi bi-eye text-primary"></i>
                      </button>
                      <button class="btn btn-white btn-sm px-3 border-start" (click)="deleteAssessment(a.id!)" title="Delete">
                         <i class="bi bi-trash text-danger"></i>
                      </button>
                   </div>
                </td>
              </tr>
              <tr *ngIf="assessments.length === 0">
                <td colspan="5" class="text-center py-5">
                   <div class="opacity-25 py-4">
                      <p class="mt-3 h5 text-muted">No assessments yet</p>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VIEW DETAILS MODAL (SIMULTED) -->
      <div class="details-overlay" *ngIf="selectedAssessment" (click)="selectedAssessment = null">
         <div class="card details-modal border-0 shadow-lg" (click)="$event.stopPropagation()">
            <div class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
               <h5 class="mb-0">Assessment Details</h5>
               <button class="btn-close btn-close-white" (click)="selectedAssessment = null"></button>
            </div>
            <div class="card-body p-4">
               <h6><strong>Mapping:</strong> {{selectedAssessment.assignedCandidates?.length || 0}} Candidates</h6>
               <hr>
               <div class="mb-3">
                  <div class="text-muted small uppercase fw-bold mb-2">Description</div>
                  <p>{{selectedAssessment.description}}</p>
               </div>
               <div class="mb-3">
                  <div class="text-muted small uppercase fw-bold mb-2">Questions ({{selectedAssessment.questions?.length}})</div>
                  <ul class="list-group list-group-flush small">
                     <li *ngFor="let q of selectedAssessment.questions" class="list-group-item ps-0 border-light">
                        {{q.questionText}} ({{q.marks}} pts)
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .candidate-selector::-webkit-scrollbar { width: 5px; }
    .candidate-selector::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
    .candidate-chip { font-size: 0.75rem; font-weight: 500; cursor: pointer; border-color: #dee2e6; }
    .candidate-chip:hover { border-color: #0d6efd; background: #f8f9fa; }
    
    .bg-primary-soft { background: rgba(13, 110, 253, 0.08); }
    .ls-1 { letter-spacing: 0.5px; }
    .pointer-cursor { cursor: pointer; }
    .transition-all { transition: all 0.2s ease-in-out; }
    .hover-shadow:hover { background: #fdfdfd; }
    
    .details-overlay {
       position: fixed; top: 0; left: 0; width: 100%; height: 100%;
       background: rgba(0,0,0,0.5); z-index: 1050;
       display: flex; align-items: center; justify-content: center;
    }
    .details-modal { width: 600px; max-height: 80vh; overflow-y: auto; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  `]
})
export class AssessmentBuilderComponent implements OnInit {

  assessments: Assessment[] = [];
  myQuestions: Question[] = [];
  allCandidates: User[] = [];
  
  selectedQuestionIds = new Set<number>();
  selectedCandidateIds = new Set<number>();
  selectedAssessment: Assessment | null = null;
  
  showForm = false;
  createMode: 'AUTO' | 'MANUAL' = 'AUTO';
  loading = false;
  successMsg = '';
  errorMsg = '';

  form = {
    title: '',
    domain: '',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
    count: 10,
    duration: 60,
    startDateTime: '',
    endDateTime: ''
  };

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    const now = new Date();
    this.form.startDateTime = now.toISOString().slice(0, 16);
    this.form.endDateTime = new Date(now.getTime() + 7*24*60*60*1000).toISOString().slice(0, 16);
    
    this.loadAssessments();
    this.loadInitialData();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.successMsg = '';
    this.errorMsg = '';
  }

  loadInitialData(): void {
    this.examinerService.getMyQuestions().subscribe(data => this.myQuestions = data);
    this.examinerService.getCandidates().subscribe(data => this.allCandidates = data);
  }

  loadAssessments(): void {
    this.examinerService.getMyAssessments().subscribe({
      next: (data) => this.assessments = data,
      error: (err) => this.errorMsg = 'Failed to load assessments.'
    });
  }

  toggleCandidate(id: number): void {
    if (this.selectedCandidateIds.has(id)) this.selectedCandidateIds.delete(id);
    else this.selectedCandidateIds.add(id);
  }

  toggleQuestion(id: number): void {
    if (this.selectedQuestionIds.has(id)) this.selectedQuestionIds.delete(id);
    else this.selectedQuestionIds.add(id);
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.domain.trim() || !this.form.startDateTime || !this.form.endDateTime) {
      this.errorMsg = 'Missing required fields.';
      return;
    }
    if (this.selectedCandidateIds.size === 0) {
      this.errorMsg = 'Please assign at least one candidate.';
      return;
    }

    this.loading = true;
    const payload = {
       ...this.form,
       candidateIds: Array.from(this.selectedCandidateIds),
       questionIds: Array.from(this.selectedQuestionIds)
    };

    const action = this.createMode === 'AUTO' 
        ? this.examinerService.generateAssessment(payload) 
        : this.examinerService.createManualAssessment(payload);

    action.subscribe({
       next: (data) => {
          this.successMsg = `Assessment scheduled successfully!`;
          this.assessments.unshift(data);
          this.showForm = false;
          this.loading = false;
          this.resetForm();
       },
       error: (err) => {
          this.errorMsg = err?.error?.message || 'Failed to create assessment.';
          this.loading = false;
       }
    });
  }

  resetForm(): void {
     this.selectedCandidateIds.clear();
     this.selectedQuestionIds.clear();
     this.form.title = '';
  }

  deleteAssessment(id: number): void {
     if (!confirm('Are you sure you want to delete this assessment?')) return;
     this.examinerService.deleteAssessment(id).subscribe({
        next: () => {
           this.assessments = this.assessments.filter(a => a.id !== id);
           this.successMsg = 'Deleted successfully.';
        },
        error: () => this.errorMsg = 'Delete failed.'
     });
  }

  viewDetails(a: Assessment): void {
     this.selectedAssessment = a;
  }

  toggleStatus(a: Assessment, status: string): void {
    this.examinerService.toggleAssessmentStatus(a.id!, status).subscribe(updated => {
       a.status = updated.status;
       this.successMsg = `Status updated to ${status}.`;
    });
  }
}