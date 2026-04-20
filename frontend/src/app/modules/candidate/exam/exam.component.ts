import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, AdminService } from 'src/app/core/services/api.service';
import { Question, Assessment } from 'src/app/models/app.models';

@Component({
  selector: 'app-exam',
  template: `
    <div class="exam-container">
      <div *ngIf="loading" class="loader-overlay">
        <div class="spinner"></div>
        <p>Preparing your examination session...</p>
      </div>

      <div *ngIf="!loading && assessment" class="content-fade">
        <!-- Modern Header -->
        <header class="exam-header shadow-sm">
          <div class="header-left">
            <h2 class="title">{{assessment.title}}</h2>
            <div class="metadata">
              <span class="badge bg-primary-soft text-primary">{{assessment.domain}}</span>
              <span class="q-count">Question {{currentQuestionIndex + 1}} of {{questions.length}}</span>
            </div>
          </div>
          
          <div class="timer-card" [class.warning]="timeLeft < 300">
            <i class="bi bi-clock-fill me-2"></i>
            <span class="time">{{timeLeftDisplay}}</span>
          </div>

          <button class="btn btn-finish" (click)="confirmSubmit()">
            FINISH EXAM
          </button>
        </header>

        <!-- Main Exam Area -->
        <main class="exam-main container py-5">
           <div class="row justify-content-center">
              <div class="col-lg-8">
                 <div class="question-card shadow">
                    <div class="q-body p-5">
                       <h3 class="q-text mb-5">{{questions[currentQuestionIndex].questionText}}</h3>
                       
                       <div class="options-container">
                          <div *ngFor="let opt of parseOptions(questions[currentQuestionIndex].options)" 
                               class="option-item" 
                               [class.selected]="responses[questions[currentQuestionIndex].id!] === opt"
                               (click)="onSelect(questions[currentQuestionIndex].id!, opt)">
                             <div class="option-indicator"></div>
                             <span class="option-text">{{opt}}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div class="q-footer p-4 border-top d-flex justify-content-between bg-light">
                       <button class="btn btn-outline-secondary px-4 py-2 rounded-pill" 
                               [disabled]="currentQuestionIndex === 0"
                               (click)="currentQuestionIndex = currentQuestionIndex - 1">
                               <i class="bi bi-arrow-left me-2"></i> Previous
                       </button>
                       <button class="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm" 
                               *ngIf="currentQuestionIndex < questions.length - 1"
                               (click)="currentQuestionIndex = currentQuestionIndex + 1">
                               Next <i class="bi bi-arrow-right ms-2"></i>
                       </button>
                       <button class="btn btn-success px-5 py-2 rounded-pill fw-bold shadow-sm" 
                               *ngIf="currentQuestionIndex === questions.length - 1"
                               (click)="confirmSubmit()">
                               SUBMIT ANSWERS
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .exam-container { min-height: 100vh; background: #f8fbff; font-family: 'Inter', sans-serif; }
    .loader-overlay { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
    .spinner { width: 50px; height: 50px; border: 5px solid #e0e0e0; border-top-color: #0d6efd; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .exam-header { 
      background: white; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; 
      position: sticky; top: 0; z-index: 1000; border-bottom: 2px solid #edf2f7;
    }
    .title { font-weight: 800; color: #1a202c; font-size: 1.25rem; margin: 0; }
    .metadata { display: flex; gap: 1rem; align-items: center; margin-top: 0.25rem; }
    .bg-primary-soft { background: #e3f2fd; padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; }
    .q-count { color: #718096; font-size: 0.85rem; font-weight: 500; }
    
    .timer-card { 
      background: #1a202c; color: white; padding: 0.75rem 1.5rem; border-radius: 12px; 
      display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-weight: 700;
    }
    .timer-card.warning { background: #e53e3e; animation: pulse 1s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
    
    .btn-finish { background: #000; color: white; font-weight: 700; border-radius: 8px; padding: 0.75rem 1.75rem; transition: all 0.2s; }
    .btn-finish:hover { background: #2d3748; transform: translateY(-1px); }
    
    .question-card { background: white; border-radius: 24px; border: none; overflow: hidden; }
    .q-text { font-size: 1.5rem; color: #2d3748; font-weight: 700; line-height: 1.4; }
    
    .option-item { 
      padding: 1.25rem 1.5rem; border: 2px solid #edf2f7; border-radius: 16px; margin-bottom: 1rem;
      cursor: pointer; display: flex; align-items: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .option-item:hover { border-color: #0d6efd; background: #f0f7ff; }
    .option-item.selected { border-color: #0d6efd; background: #0d6efd; color: white; transform: scale(1.02); box-shadow: 0 10px 15px -3px rgba(13, 110, 253, 0.2); }
    
    .option-indicator { width: 14px; height: 14px; border: 2px solid #cbd5e0; border-radius: 50%; margin-right: 1.25rem; }
    .selected .option-indicator { background: white; border-color: white; }
    .option-text { font-size: 1.1rem; font-weight: 600; }
    
    .content-fade { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ExamComponent implements OnInit, OnDestroy {
  assessmentId!: number;
  attemptId?: number;
  assessment?: Assessment;
  questions: Question[] = [];
  responses: { [key: number]: string } = {};
  currentQuestionIndex = 0;
  timeLeft: number = 0;
  timer: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.assessmentId = +this.route.snapshot.params['id'];
    this.initExam();
    this.setupAntiTamper();
  }

  setupAntiTamper() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.warn('Student switched tabs!');
        // In a real app, you might auto-submit or penalize
        alert('Warning: Tab switching is monitored. This event has been logged.');
      }
    });

    // Prevent right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initExam() {
    // 1. Load Assessment Details
    this.adminService.getAssessments().subscribe(data => {
      this.assessment = data.find(a => a.id === this.assessmentId);
      if (this.assessment) {
        this.timeLeft = this.assessment.duration * 60;
        
        // 2. Start Assessment Attempt in Backend
        this.candidateService.startAssessment(this.assessmentId).subscribe(attempt => {
            this.attemptId = attempt.id;
            this.questions = this.assessment?.questions || [];
            this.loading = false;
            this.startTimer();
        });
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  get timeLeftDisplay() {
    const min = Math.floor(this.timeLeft / 60);
    const sec = this.timeLeft % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  parseOptions(optStr: string): string[] {
    if (!optStr) return [];
    return optStr.split(',').map(s => s.trim());
  }

  onSelect(questionId: number, val: string) {
    this.responses[questionId] = val;
  }

  confirmSubmit() {
      if (confirm('Are you sure you want to finish the exam? All answers will be finalized.')) {
          this.submitExam();
      }
  }

  submitExam() {
    if (!this.attemptId) return;
    
    clearInterval(this.timer);
    this.loading = true;
    
    // Format responses as a proper JSON string for backend parsing
    const payload = JSON.stringify(this.responses);
    
    this.candidateService.submitAssessment(this.attemptId, { responses: payload }).subscribe({
      next: () => {
        this.router.navigate(['/candidate/results']);
      },
      error: (err) => {
          console.error(err);
          alert('Submission failed. Please try again.');
          this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
