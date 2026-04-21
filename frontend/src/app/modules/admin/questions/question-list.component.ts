import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';
import { Question } from 'src/app/models/app.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-list',
  template: `
    <div class="px-4 py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold m-0">Question Repository</h2>
        <div class="d-flex gap-2">
          <!-- Added template download button -->
          <button class="btn btn-outline-primary px-3 rounded-pill fw-bold shadow-sm" (click)="downloadTemplate()">
            <i class="bi bi-download me-2"></i> Download Template
          </button>
          
          <button class="btn btn-outline-dark px-3 rounded-pill fw-bold shadow-sm" (click)="triggerBulkUpload()">
            <i class="bi bi-file-earmark-arrow-up me-2"></i> Bulk Upload
          </button>
          
          <button class="btn btn-dark px-3 rounded-pill fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#addQuestionModal">
            <i class="bi bi-plus-lg me-2"></i> Create Question
          </button>
        </div>
        <input type="file" id="bulkUploadInput" style="display: none" accept=".json" (change)="onFileSelected($event)">
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr class="small text-muted uppercase fw-bold">
                  <th class="ps-4 py-3">Question Text</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Marks</th>
                  <th class="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of questions">
                  <td class="ps-4">
                    <div class="text-truncate" style="max-width: 400px;" [title]="item.questionText || item.question_text || ''">
                      {{item.questionText || item.question_text || '(Extraction format mismatch)'}}
                    </div>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{item.questionType}}</span></td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success-soft text-success': item.difficultyLevel === 'EASY',
                      'bg-warning-soft text-warning': item.difficultyLevel === 'MEDIUM',
                      'bg-danger-soft text-danger': item.difficultyLevel === 'HARD'
                    }">{{item.difficultyLevel}}</span>
                  </td>
                  <td><span class="fw-bold">{{item.marks}}</span></td>
                  <td class="pe-4 text-end">
                    <button class="btn btn-link link-danger p-0" (click)="deleteQuestion(item.id!)">
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

    <!-- Premium Modal -->
    <div class="modal fade" id="addQuestionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-bottom-0 pt-4 px-4 pb-2">
            <h4 class="modal-title fw-bold">Design New Question</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <div class="modal-body p-4">
              <div class="mb-4">
                <label class="form-label fw-bold small text-muted uppercase">Question Stimulus</label>
                <textarea formControlName="questionText" class="form-control rounded-3" rows="4" placeholder="Enter the question text here..."></textarea>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label fw-bold small text-muted uppercase">Type</label>
                  <select formControlName="questionType" class="form-select rounded-3">
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold small text-muted uppercase">Difficulty</label>
                  <select formControlName="difficultyLevel" class="form-select rounded-3">
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div class="col-md-4">
                   <label class="form-label fw-bold small text-muted uppercase">Marks</label>
                   <input type="number" formControlName="marks" class="form-control rounded-3">
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold small text-muted uppercase">Response Options (Comma Separated)</label>
                <input type="text" formControlName="options" class="form-control rounded-3" placeholder="Option A, Option B, Option C, Option D">
              </div>
              
              <div class="mb-4">
                <label class="form-label fw-bold small text-muted uppercase">Taxonomy / Tags (Comma Separated)</label>
                <input type="text" formControlName="tags" class="form-control rounded-3" placeholder="e.g. OOP, JDBC, Collections">
              </div>
              
              <div class="mb-2">
                <label class="form-label fw-bold small text-muted uppercase">Correct Answer</label>
                <input type="text" formControlName="correctAnswer" class="form-control rounded-3" placeholder="Matches one of the options exactly">
              </div>
            </div>
            <div class="modal-footer border-top-0 p-4">
               <button type="submit" class="btn btn-dark w-100 py-3 rounded-pill fw-bold" [disabled]="questionForm.invalid">SAVE TO REPOSITORY</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-success-soft { background: #ecfdf5; color: #059669; }
    .bg-warning-soft { background: #fffbeb; color: #d97706; }
    .bg-danger-soft { background: #fef2f2; color: #dc2626; }
  `]
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  questionForm!: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.refresh();
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['MCQ', Validators.required],
      difficultyLevel: ['EASY', Validators.required],
      marks: [1, [Validators.required, Validators.min(1)]],
      options: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      tags: ['']
    });
  }

  refresh() {
    this.adminService.getQuestions().subscribe((data: Question[]) => this.questions = data);
  }

  onSubmit() {
    if (this.questionForm.invalid) return;

    // Safety: Format Options to highly valid JSON String array
    let formPayload = { ...this.questionForm.value };
    if (typeof formPayload.options === 'string') {
        const optionArray = formPayload.options.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0);
        formPayload.options = JSON.stringify(optionArray);
    }
    
    // Convert tags same way if requested
    if (typeof formPayload.tags === 'string' && formPayload.tags) {
       // Since the DB uses Tag entity, we may need to make it simple or omit, but for now passing string
       formPayload.tags = []; // Backend may handle string arrays or object array mapping
    } else {
       formPayload.tags = [];
    }

    this.adminService.addQuestion(formPayload).subscribe({
       next: () => {
         this.refresh();
         this.questionForm.reset({ questionType: 'MCQ', difficultyLevel: 'EASY', marks: 1 });
         // Close the modal automatically
         const modalCloseBtn = document.querySelector('#addQuestionModal .btn-close') as HTMLElement;
         if (modalCloseBtn) modalCloseBtn.click();
       },
       error: (err) => {
         console.error('Failed to create question', err);
         alert('Failed to save question. Check server logs.');
       }
    });
  }

  deleteQuestion(id: number) {
    if (confirm('Permanently delete this question from the repository?')) {
      this.adminService.deleteQuestion(id).subscribe(() => this.refresh());
    }
  }

  downloadTemplate() {
    const templateObject = [
      {
        "questionText": "What is the capital of France?",
        "questionType": "MCQ",
        "difficultyLevel": "EASY",
        "marks": 5,
        "options": "[\"London\", \"Paris\", \"Berlin\", \"Madrid\"]",
        "correctAnswer": "Paris"
      },
      {
        "questionText": "Is Java an object-oriented language?",
        "questionType": "TRUE_FALSE",
        "difficultyLevel": "EASY",
        "marks": 2,
        "options": "[\"True\", \"False\"]",
        "correctAnswer": "True"
      }
    ];

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateObject, null, 2));
    const dt = document.createElement('a');
    dt.setAttribute("href", dataStr);
    dt.setAttribute("download", "questions_bulk_template.json");
    dt.click();
  }

  triggerBulkUpload() {
    document.getElementById('bulkUploadInput')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const questions = JSON.parse(e.target.result);
          if (!Array.isArray(questions)) {
            alert('File must contain an array of question objects.');
            return;
          }
          this.adminService.bulkUploadQuestions(questions).subscribe({
            next: () => {
              alert('Bulk upload successful!');
              this.refresh();
              event.target.value = ''; // Reset input
            },
            error: (err) => {
              console.error('Bulk upload failed', err);
              alert('Failed to process bulk upload. Please check the file format matches the template.');
            }
          });
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  }
}
