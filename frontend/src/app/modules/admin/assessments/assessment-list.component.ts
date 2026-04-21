import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';
import { Assessment, Question } from 'src/app/models/app.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment-list',
  template: `
    <div class="px-4 py-4 min-vh-100 bg-light">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold m-0 brand-text">Assessments</h2>
          <p class="text-muted small uppercase ls-1">Schedule and configure evaluations</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary px-4 fw-bold" (click)="autoGenerate()">
            <i class="bi bi-robot me-2"></i> Intelligence Engine
          </button>
          <button class="btn btn-primary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#addAssessmentModal">
            <i class="bi bi-plus-lg me-2"></i> Provision Schedule
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-2 overflow-hidden mb-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th class="ps-4">Assessment Path</th>
                  <th>Domain</th>
                  <th>Timeline</th>
                  <th>Metrics</th>
                  <th>Status</th>
                  <th class="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of assessments">
                  <td class="ps-4">
                    <div class="fw-bold text-dark">{{item.title}}</div>
                    <small class="text-muted">{{item.duration}}m Session</small>
                  </td>
                  <td><span class="badge bg-light text-muted border px-2 py-1">{{item.domain}}</span></td>
                  <td>
                    <div class="small fw-medium">{{item.startDateTime | date:'medium'}}</div>
                    <div class="small text-muted">to {{item.endDateTime | date:'medium'}}</div>
                  </td>
                  <td>
                     <div class="small"><span class="fw-bold">{{item.passingMarks}}</span> / {{item.totalMarks}} Marks</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success-soft text-success': item.status === 'ACTIVE',
                      'bg-warning-soft text-warning': item.status === 'SCHEDULED',
                      'bg-secondary-soft text-secondary': item.status === 'COMPLETED'
                    }">{{item.status}}</span>
                  </td>
                  <td class="pe-4 text-end">
                    <button class="btn btn-outline-primary btn-sm me-2" (click)="openAssignModal(item)">
                      <i class="bi bi-link-45deg me-1"></i> Questions
                    </button>
                    <button class="btn btn-link text-danger p-1" (click)="deleteAssessment(item.id!)">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="assessments.length === 0">
                   <td colspan="6" class="text-center py-5 text-muted">No assessment clusters provisioned.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Assessment Modal -->
    <div class="modal fade" id="addAssessmentModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-2 border-0 shadow-lg">
          <div class="modal-header border-bottom py-3 px-4">
            <h5 class="modal-title fw-bold brand-text">New Schedule Record</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form [formGroup]="assessmentForm" (ngSubmit)="onSubmit()">
            <div class="modal-body p-4">
               <div class="mb-4">
                  <label class="form-label small fw-bold text-muted uppercase ls-1">Terminal Title</label>
                  <input type="text" formControlName="title" class="form-control py-2 shadow-none" placeholder="e.g. Cognitive Intelligence Tier 1">
               </div>
               <div class="mb-4">
                  <label class="form-label small fw-bold text-muted uppercase ls-1">Objective Summary</label>
                  <textarea formControlName="description" class="form-control py-2 shadow-none" rows="2" placeholder="Primary evaluation goals..."></textarea>
               </div>
               <div class="row g-3">
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Cluster / Domain</label>
                     <input type="text" formControlName="domain" class="form-control py-2 shadow-none">
                  </div>
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Window (Minutes)</label>
                     <input type="number" formControlName="duration" class="form-control py-2 shadow-none">
                  </div>
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Total Mark Capacity</label>
                     <input type="number" formControlName="totalMarks" class="form-control py-2 shadow-none">
                  </div>
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Minimum Threshold</label>
                     <input type="number" formControlName="passingMarks" class="form-control py-2 shadow-none">
                  </div>
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Activation Time</label>
                     <input type="datetime-local" formControlName="startDateTime" class="form-control py-2 shadow-none">
                  </div>
                  <div class="col-md-6 mb-3">
                     <label class="form-label small fw-bold text-muted uppercase ls-1">Termination Time</label>
                     <input type="datetime-local" formControlName="endDateTime" class="form-control py-2 shadow-none">
                  </div>
               </div>
            </div>
            <div class="modal-footer border-top p-4 bg-light">
               <button type="submit" class="btn btn-primary px-5 py-2 fw-bold" [disabled]="assessmentForm.invalid">DEPLOY SCHEDULE</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Assign Questions Modal -->
    <div *ngIf="showAssignModal" class="custom-modal-overlay">
       <div class="custom-modal bg-white shadow-lg rounded-2 border animate__animated animate__fadeInDown">
          <div class="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
             <h5 class="mb-0 fw-bold brand-text">Sync Neural Items: {{selectedAssessment?.title}}</h5>
             <button class="btn btn-link text-muted p-0" (click)="showAssignModal = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body p-4" style="max-height: 50vh; overflow-y: auto;">
             <p class="text-muted small uppercase ls-1 fw-bold mb-3">Available Question Cluster</p>
             
             <div *ngIf="allQuestions.length === 0" class="text-center py-5">
                <i class="bi bi-inbox text-muted display-1"></i>
                <p class="mt-3 text-muted">Neural Bank is empty. Provision questions first.</p>
             </div>

             <div class="list-group border-0">
                <div *ngFor="let q of allQuestions" class="list-group-item px-3 py-3 d-flex align-items-center border rounded-2 mb-2">
                   <div class="form-check me-3">
                      <input class="form-check-input shadow-none" type="checkbox" 
                             [checked]="isSelected(q.id!)" 
                             (change)="toggleQuestion(q.id!)">
                   </div>
                   <div class="flex-grow-1">
                      <div class="fw-bold small text-dark">{{q.questionText}}</div>
                      <div class="d-flex gap-2 mt-1">
                         <span class="badge bg-light text-muted border py-1" style="font-size: 9px;">{{q.difficultyLevel}}</span>
                         <span class="badge bg-light text-muted border py-1" style="font-size: 9px;">{{q.marks}} Marks</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer p-4 border-top">
             <button class="btn btn-primary w-100 py-2 fw-bold" (click)="saveAssignment()">SYNCHRONIZE ITEMS</button>
          </div>
       </div>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 1px; }
    .bg-success-soft { background: rgba(52, 168, 83, 0.1); color: #34a853; }
    .bg-warning-soft { background: rgba(251, 188, 5, 0.1); color: #fbbc05; }
    .bg-secondary-soft { background: #f1f3f4; color: #5f6368; }
    .custom-modal-overlay { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(32, 33, 36, 0.6); z-index: 2000; display: flex; align-items: flex-start; justify-content: center; padding-top: 50px;
    }
    .custom-modal { width: 680px; max-width: 95%; }
  `]
})
export class AssessmentListComponent implements OnInit {
  assessments: Assessment[] = [];
  allQuestions: Question[] = [];
  selectedAssessment: Assessment | null = null;
  selectedQuestionIds: number[] = [];
  showAssignModal = false;
  assessmentForm!: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.refresh();
    this.loadQuestions();
    this.assessmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      domain: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      totalMarks: [100, [Validators.required, Validators.min(1)]],
      passingMarks: [40, [Validators.required, Validators.min(1)]],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
  }

  refresh() {
    this.adminService.getAssessments().subscribe((data: Assessment[]) => this.assessments = data);
  }

  loadQuestions() {
    this.adminService.getQuestions().subscribe((data: Question[]) => this.allQuestions = data);
  }

  onSubmit() {
    if (this.assessmentForm.invalid) return;
    const payload = { ...this.assessmentForm.value, status: 'SCHEDULED' };
    this.adminService.createAssessment(payload).subscribe({
      next: () => {
        this.refresh();
        this.assessmentForm.reset({ duration: 60, totalMarks: 100, passingMarks: 40 });
        // Manually close the modal
        const modalElement = document.getElementById('addAssessmentModal');
        if (modalElement) {
          (window as any).bootstrap.Modal.getInstance(modalElement)?.hide();
        }
        alert('Assessment scheduled successfully!');
      },
      error: (err) => {
        console.error('Failed to create assessment:', err);
        alert('Failed to schedule assessment: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

  deleteAssessment(id: number) {
    if (confirm('Delete this assessment and all related records?')) {
      this.adminService.deleteAssessment(id).subscribe(() => this.refresh());
    }
  }

  openAssignModal(assessment: Assessment) {
    this.selectedAssessment = assessment;
    this.selectedQuestionIds = assessment.questions?.map(q => q.id!) || [];
    this.showAssignModal = true;
  }

  isSelected(id: number) {
    return this.selectedQuestionIds.includes(id);
  }

  toggleQuestion(id: number) {
    if (this.isSelected(id)) {
      this.selectedQuestionIds = this.selectedQuestionIds.filter(qid => qid !== id);
    } else {
      this.selectedQuestionIds.push(id);
    }
  }

  saveAssignment() {
    if (!this.selectedAssessment) return;
    this.adminService.assignQuestions(this.selectedAssessment.id!, this.selectedQuestionIds).subscribe(() => {
      this.showAssignModal = false;
      this.refresh();
    });
  }

  autoGenerate() {
    const title = prompt('Enter Assessment Title:');
    const categoryId = prompt('Enter Category ID:');
    const count = prompt('Enter Number of Questions (Default 10):') || '10';
    
    if (title && categoryId) {
      const assessment = {
        title: title,
        description: 'Auto-generated assessment',
        domain: 'General',
        duration: 30,
        passingMarks: 5,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 86400000).toISOString(),
        status: 'SCHEDULED'
      };

      this.adminService.autoGenerateAssessment(assessment, +categoryId, +count, 'MEDIUM').subscribe(() => {
        alert('Assessment generated successfully!');
        this.refresh();
      });
    }
  }
}
