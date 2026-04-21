import { Component, OnInit } from '@angular/core';
import { ExaminerService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-question-manager',
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">My Question Bank</h2>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ Add Question' }}
        </button>
      </div>

      <!-- ADD QUESTION FORM -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="showForm">
        <div class="card-header fw-bold bg-primary text-white">New Question</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Question Text *</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newQ.questionText" placeholder="Enter question..."></textarea>
            </div>
            <div class="col-md-4">
              <label class="form-label">Type</label>
              <select class="form-select" [(ngModel)]="newQ.questionType">
                <option value="MCQ">MCQ</option>
                <option value="TRUE_FALSE">True / False</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Difficulty</label>
              <select class="form-select" [(ngModel)]="newQ.difficultyLevel">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Marks</label>
              <input type="number" class="form-control" [(ngModel)]="newQ.marks" min="1" />
            </div>
            <div class="col-12">
              <label class="form-label">Options (JSON — e.g. ["A","B","C","D"])</label>
              <input type="text" class="form-control" [(ngModel)]="newQ.options"
                     placeholder='["Option A","Option B","Option C","Option D"]' />
            </div>
            <div class="col-12">
              <label class="form-label">Correct Answer *</label>
              <input type="text" class="form-control" [(ngModel)]="newQ.correctAnswer" placeholder="Option A" />
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-success px-4" (click)="addQuestion()" [disabled]="saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                Save Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ALERTS -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="successMsg">
        {{ successMsg }}
        <button type="button" class="btn-close" (click)="successMsg=''"></button>
      </div>
      <div class="alert alert-danger" *ngIf="errorMsg">{{ errorMsg }}</div>

      <!-- QUESTIONS TABLE -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Marks</th>
                  <th>Correct Answer</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let q of questions">
                  <td>{{ q.id }}</td>
                  <td>{{ q.questionText }}</td>
                  <td><span class="badge bg-secondary">{{ q.questionType }}</span></td>
                  <td>
                    <span class="badge"
                      [ngClass]="{
                        'bg-success': q.difficultyLevel === 'EASY',
                        'bg-warning text-dark': q.difficultyLevel === 'MEDIUM',
                        'bg-danger': q.difficultyLevel === 'HARD'
                      }">{{ q.difficultyLevel }}</span>
                  </td>
                  <td>{{ q.marks }}</td>
                  <td><code>{{ q.correctAnswer }}</code></td>
                  <td>
                    <span class="badge" [ngClass]="q.isActive ? 'bg-success' : 'bg-secondary'">
                      {{ q.isActive ? 'Yes' : 'No' }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="questions.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">
                    No questions found. Add your first question above.
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
export class QuestionManagerComponent implements OnInit {

  questions: any[] = [];
  showForm = false;
  saving = false;
  successMsg = '';
  errorMsg = '';

  newQ: any = {
    questionText: '',
    questionType: 'MCQ',
    difficultyLevel: 'MEDIUM',
    marks: 1,
    options: '',
    correctAnswer: '',
    isActive: true
  };

  constructor(
    private examinerService: ExaminerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.examinerService.getMyQuestions().subscribe({
      next: (data) => this.questions = data,
      error: (err) => {
        console.error('Failed to load questions:', err);
        this.errorMsg = 'Failed to load questions.';
      }
    });
  }

  addQuestion(): void {
    this.errorMsg = '';
    if (!this.newQ.questionText.trim() || !this.newQ.correctAnswer.trim()) {
      this.errorMsg = 'Question text and correct answer are required.';
      return;
    }

    this.saving = true;
    const user = this.authService.getCurrentUser();
    const payload = {
      ...this.newQ,
      examiner: user ? { id: user.id } : null
    };

    this.examinerService.createQuestion(payload).subscribe({
      next: () => {
        this.successMsg = 'Question added successfully!';
        this.showForm = false;
        this.saving = false;
        this.newQ = {
          questionText: '', questionType: 'MCQ',
          difficultyLevel: 'MEDIUM', marks: 1,
          options: '', correctAnswer: '', isActive: true
        };
        this.loadQuestions();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to create question.';
        this.saving = false;
      }
    });
  }
}
