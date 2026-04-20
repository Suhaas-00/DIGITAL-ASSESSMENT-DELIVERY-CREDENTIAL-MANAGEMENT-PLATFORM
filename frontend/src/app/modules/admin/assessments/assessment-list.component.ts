import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';
import { Assessment, Question } from 'src/app/models/app.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment-list',
  template: `
    <div class="px-4 py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold m-0">Assessment Management</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary px-4 rounded-pill fw-bold shadow-sm" (click)="autoGenerate()">
            <i class="bi bi-robot me-2"></i> Auto-Generate
          </button>
          <button class="btn btn-primary px-4 rounded-pill fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#addAssessmentModal">
            <i class="bi bi-plus-lg me-2"></i> New Assessment
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr class="small text-muted uppercase fw-bold">
                  <th class="ps-4 py-3">Assessment Title</th>
                  <th>Domain</th>
                  <th>Schedule</th>
                  <th>Marks</th>
                  <th>Status</th>
                  <th class="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of assessments">
                  <td class="ps-4">
                    <div class="fw-bold text-dark">{{item.title}}</div>
                    <small class="text-muted">{{item.duration}} mins</small>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{item.domain}}</span></td>
                  <td>
                    <div class="small fw-bold">{{item.startDateTime | date:'short'}}</div>
                    <div class="small text-muted">to {{item.endDateTime | date:'short'}}</div>
                  </td>
                  <td>
                     <div class="small"><span class="fw-bold">{{item.passingMarks}}</span> / {{item.totalMarks}}</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success-soft text-success': item.status === 'ACTIVE',
                      'bg-warning-soft text-warning': item.status === 'SCHEDULED',
                      'bg-secondary-soft text-secondary': item.status === 'COMPLETED'
                    }">{{item.status}}</span>
                  </td>
                  <td class="pe-4 text-end">
                    <button class="btn btn-outline-dark btn-sm rounded-pill px-3 me-2" (click)="openAssignModal(item)">
                      <i class="bi bi-list-check me-1"></i> Questions
                    </button>
                    <button class="btn btn-link link-danger p-0" (click)="deleteAssessment(item.id!)">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Assessment Modal -->
    <div class="modal fade" id="addAssessmentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-bottom-0 pt-4 px-4 pb-2">
            <h4 class="modal-title fw-bold">Create Assessment Schedule</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form [formGroup]="assessmentForm" (ngSubmit)="onSubmit()">
            <div class="modal-body p-4">
              <div class="mb-4">
                 <label class="form-label fw-bold small text-muted uppercase">Assessment Title</label>
                 <input type="text" formControlName="title" class="form-control rounded-3" placeholder="e.g. Advanced Java Certification">
              </div>
              <div class="row g-3 mb-4">
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">Domain</label>
                    <input type="text" formControlName="domain" class="form-control rounded-3" placeholder="e.g. Backend Development">
                 </div>
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">Duration (Minutes)</label>
                    <input type="number" formControlName="duration" class="form-control rounded-3">
                 </div>
              </div>
              <div class="row g-3 mb-4">
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">Total Marks</label>
                    <input type="number" formControlName="totalMarks" class="form-control rounded-3">
                 </div>
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">Passing Marks</label>
                    <input type="number" formControlName="passingMarks" class="form-control rounded-3">
                 </div>
              </div>
              <div class="row g-3 mb-2">
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">Start Date & Time</label>
                    <input type="datetime-local" formControlName="startDateTime" class="form-control rounded-3">
                 </div>
                 <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted uppercase">End Date & Time</label>
                    <input type="datetime-local" formControlName="endDateTime" class="form-control rounded-3">
                 </div>
              </div>
            </div>
            <div class="modal-footer border-top-0 p-4">
               <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold" [disabled]="assessmentForm.invalid">SCHEDULE ASSESSMENT</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Assign Questions Modal (Custom Implementation) -->
    <div *ngIf="showAssignModal" class="custom-modal-overlay">
       <div class="custom-modal shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header p-4 bg-dark text-white d-flex justify-content-between align-items-center">
             <h5 class="mb-0 fw-bold">Link Questions to: {{selectedAssessment?.title}}</h5>
             <button class="btn btn-link text-white p-0" (click)="showAssignModal = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body p-4" style="max-height: 60vh; overflow-y: auto;">
             <p class="text-muted small mb-4">Select questions from the repository to include in this assessment.</p>
             <div class="list-group list-group-flush">
                <div *ngFor="let q of allQuestions" class="list-group-item px-0 py-3 d-flex align-items-center border-bottom">
                   <div class="form-check me-3">
                      <input class="form-check-input" type="checkbox" 
                             [checked]="isSelected(q.id!)" 
                             (change)="toggleQuestion(q.id!)">
                   </div>
                   <div class="flex-grow-1">
                      <div class="fw-bold small text-dark">{{q.questionText}}</div>
                      <small class="text-muted">{{q.difficultyLevel}} • {{q.marks}} Marks</small>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer p-4 bg-light">
             <button class="btn btn-dark w-100 py-2 rounded-pill fw-bold" (click)="saveAssignment()">UPDATE ASSESSMENT QUESTIONS</button>
          </div>
       </div>
    </div>
  `,
  styles: [`
    .bg-success-soft { background: #ecfdf5; color: #059669; }
    .bg-warning-soft { background: #fffbeb; color: #d97706; }
    .bg-secondary-soft { background: #f3f4f6; color: #4b5563; }
    .custom-modal-overlay { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; 
    }
    .custom-modal { background: white; width: 600px; max-width: 90%; }
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
    this.adminService.getAssessments().subscribe(data => this.assessments = data);
  }

  loadQuestions() {
    this.adminService.getQuestions().subscribe(data => this.allQuestions = data);
  }

  onSubmit() {
    if (this.assessmentForm.invalid) return;
    this.adminService.createAssessment(this.assessmentForm.value).subscribe(() => {
      this.refresh();
      this.assessmentForm.reset({ duration: 60, totalMarks: 100, passingMarks: 40 });
    });
  }

  deleteAssessment(id: number) {
    if (confirm('Delete this assessment and all related records?')) {
      // Assuming delete endpoint exists in service
      this.adminService.getAssessments().subscribe(); // Placeholder for actual delete call
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
