import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from 'src/app/core/services/api.service';
import { Question, Assessment } from 'src/app/models/app.models';

@Component({
  selector: 'app-exam',
  template: `
    <div class="exam-immersion animate__animated animate__fadeIn">
      <!-- Loading Overlay -->
      <div *ngIf="loading" class="loader-gate">
        <div class="quantum-spinner mb-4"></div>
        <h4 class="fw-bold tracking-widest text-uppercase">Synchronizing Nodes</h4>
        <p class="text-muted opacity-75">Establishing secure session protocols...</p>
      </div>

      <!-- Exam Content -->
      <div *ngIf="!loading && assessment" class="exam-engine">
        
        <!-- Premium HUD -->
        <div class="exam-hud px-4 py-3 d-flex align-items-center justify-content-between shadow-lg">
          <div class="hud-left d-flex align-items-center gap-4">
             <div class="brand-small bg-dark text-white rounded-3 p-2">
                <i class="bi bi-cpu fs-5"></i>
             </div>
             <div>
                <h5 class="mb-0 fw-bold">{{assessment.title}}</h5>
                <div class="progress-metrix small text-muted font-monospace">
                   BLOCK {{currentQuestionIndex + 1}} / {{questions.length}}
                </div>
             </div>
          </div>

          <div class="hud-center d-none d-lg-block w-25">
             <div class="progress rounded-pill bg-light" style="height: 6px;">
                <div class="progress-bar bg-primary animate-progress" [style.width]="((currentQuestionIndex + 1) / questions.length * 100) + '%'"></div>
             </div>
          </div>

          <div class="hud-right d-flex align-items-center gap-3">
             <div class="chronometer" [class.danger-pulse]="timeLeft < 300">
                <i class="bi bi-hourglass-split me-2"></i>
                <span class="timer-font">{{timeLeftDisplay}}</span>
             </div>
             <button class="btn btn-dark-glass text-uppercase px-4 py-2 small fw-bold" (click)="confirmSubmit()">
                CLOSE SESSION
             </button>
          </div>
        </div>

        <main class="viewport d-flex align-items-center justify-content-center p-3 p-md-5">
           <div class="question-capsule border-0 shadow-2xl animate__animated animate__zoomIn">
              <div class="capsule-content p-4 p-md-5">
                 <div class="q-label text-primary small fw-bold mb-3 uppercase tracking-widest">Question Stimulus</div>
                 <h2 class="q-display mb-5 lh-base">{{questions[currentQuestionIndex].questionText}}</h2>

                 <div class="options-grid">
                    <div *ngFor="let opt of getOptions(currentQuestionIndex)" 
                         class="neuro-option"
                         [class.selected]="responses[questions[currentQuestionIndex].id!] === opt"
                         (click)="onSelect(questions[currentQuestionIndex].id!, opt)">
                       <div class="check-node"></div>
                       <div class="opt-label">{{opt}}</div>
                    </div>

                    <!-- Logical Fallback -->
                    <div *ngIf="getOptions(currentQuestionIndex).length === 0 && questions[currentQuestionIndex].questionType === 'TRUE_FALSE'">
                       <div class="neuro-option" [class.selected]="responses[questions[currentQuestionIndex].id!] === 'True'" (click)="onSelect(questions[currentQuestionIndex].id!, 'True')">
                          <div class="check-node"></div>
                          <div class="opt-label">True</div>
                       </div>
                       <div class="neuro-option" [class.selected]="responses[questions[currentQuestionIndex].id!] === 'False'" (click)="onSelect(questions[currentQuestionIndex].id!, 'False')">
                          <div class="check-node"></div>
                          <div class="opt-label">False</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="capsule-footer p-4 d-flex justify-content-between align-items-center border-top">
                 <button class="btn btn-link text-muted fw-bold text-decoration-none" [disabled]="currentQuestionIndex === 0" (click)="currentQuestionIndex = currentQuestionIndex - 1">
                    <i class="bi bi-arrow-left-short fs-4"></i> PREVIOUS
                 </button>
                 
                 <div class="d-flex gap-2">
                    <button class="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-xl" 
                            *ngIf="currentQuestionIndex < questions.length - 1"
                            (click)="currentQuestionIndex = currentQuestionIndex + 1">
                       NEXT STEP <i class="bi bi-arrow-right-short fs-4"></i>
                    </button>
                    <button class="btn btn-success px-5 py-3 rounded-pill fw-bold shadow-xl" 
                            *ngIf="currentQuestionIndex === questions.length - 1"
                            (click)="confirmSubmit()">
                       FINALIZE & SUBMIT
                    </button>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .exam-immersion { min-height: 100vh; background: #0f172a; color: #f8fafc; font-family: 'Inter', sans-serif; overflow: hidden; }
    .loader-gate { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .quantum-spinner { width: 60px; height: 60px; border: 4px solid rgba(99, 102, 241, 0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin-q 1.5s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite; }
    @keyframes spin-q { to { transform: rotate(360deg); } }

    .exam-hud { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.1); width: 100%; position: sticky; top: 0; z-index: 100; }
    .chronometer { background: rgba(255, 255, 255, 0.05); padding: 8px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Outfit', sans-serif; }
    .timer-font { font-size: 1.25rem; font-weight: 700; letter-spacing: 1px; }
    .danger-pulse { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; animation: pulse-r 1s infinite; }
    @keyframes pulse-r { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

    .viewport { min-height: calc(100vh - 80px); background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); }
    .question-capsule { background: #ffffff; color: #1e293b; width: 100%; max-width: 900px; border-radius: 32px; overflow: hidden; position: relative; }
    .q-display { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.85rem; color: #0f172a; }

    .neuro-option {
       padding: 20px 24px; border: 2px solid #f1f5f9; border-radius: 20px; margin-bottom: 16px; 
       cursor: pointer; display: flex; align-items: center; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
       background: #f8fafc;
    }
    .neuro-option:hover { transform: translateX(8px); border-color: var(--primary); background: #ffffff; }
    .neuro-option.selected { background: var(--primary); color: #ffffff; border-color: var(--primary); box-shadow: 0 15px 30px -10px rgba(99, 102, 241, 0.4); transform: scale(1.02); }
    
    .check-node { width: 12px; height: 12px; border: 2px solid #cbd5e1; border-radius: 50%; margin-right: 20px; flex-shrink: 0; }
    .selected .check-node { background: #ffffff; border-color: #ffffff; }
    .opt-label { font-size: 1.15rem; font-weight: 500; }
    
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .animate-progress { transition: width 0.6s cubic-bezier(1, 0, 0, 1.01); }
    .btn-dark-glass { background: rgba(255, 255, 255, 0.05); color: #f8fafc; border: 1px solid rgba(255,255,255,0.1); }
    .btn-dark-glass:hover { background: rgba(255, 255, 255, 0.15); border-color: rgba(255,255,255,0.3); }

    @media (max-width: 768px) {
       .q-display { font-size: 1.4rem; }
       .neuro-option { padding: 15px 20px; }
    }
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
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService
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
      }
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initExam() {
    this.loading = true;
    this.errorMsg = '';

    // ✅ OPTIMIZED: Fetch ONLY the specific assessment by ID
    this.candidateService.getAssessment(this.assessmentId).subscribe({
      next: (data) => {
        this.assessment = data;

        if (!this.assessment || this.assessment.status !== 'ACTIVE') {
          this.errorMsg = `Assessment #${this.assessmentId} is not accessible or currently closed.`;
          this.loading = false;
          return;
        }

        this.questions = this.assessment.questions || [];
        this.timeLeft = (this.assessment.duration || 60) * 60;

        // Start the attempt in the backend
        this.candidateService.startAssessment(this.assessmentId).subscribe({
          next: (attempt) => {
            this.attemptId = attempt.id;
            this.loading = false;
            this.startTimer();
          },
          error: (err) => {
            // Even if startAttempt fails, let the candidate proceed (graceful degradation)
            console.warn('Could not register attempt start:', err);
            this.loading = false;
            this.startTimer();
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Failed to load the assessment. Please refresh or go back.';
        console.error('initExam error:', err);
        this.loading = false;
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

  /**
   * ✅ FIX 3: Parse options correctly from JSON array string OR comma-separated.
   * Backend stores options as: ["Option A","Option B","Option C","Option D"]
   */
  getOptions(index: number): string[] {
    const optStr = this.questions[index]?.options;
    if (!optStr) return [];

    const trimmed = optStr.trim();

    // ✅ Try JSON array first (the actual storage format)
    if (trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        // fall through
      }
    }

    // Fallback: comma-separated plain text
    return trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
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
    clearInterval(this.timer);
    this.loading = true;

    const payload = this.responses;

    if (!this.attemptId) {
      // No attempt registered — navigate anyway
      this.router.navigate(['/candidate/results']);
      return;
    }

    // ✅ Submit using attemptId (backend: POST /candidate/submit/{attemptId})
    this.candidateService.submitAssessment(this.attemptId, payload).subscribe({
      next: () => {
        this.router.navigate(['/candidate/results']);
      },
      error: (err) => {
        console.error('Submit error:', err);
        alert('Submission failed. Please try again.');
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/candidate/dashboard']);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    document.removeEventListener('contextmenu', (e) => e.preventDefault());
  }
}
