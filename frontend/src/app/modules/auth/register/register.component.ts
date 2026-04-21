import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-page d-flex align-items-center justify-content-center p-3">
      <div class="auth-card p-4 p-md-5 bg-white border animate__animated animate__fadeIn">
        <div class="text-center mb-5">
           <h2 class="fw-bold brand-text mb-1">AssessiMate</h2>
           <p class="text-muted small uppercase ls-1">Register New Account</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="animate__animated animate__fadeInUp">
          <div class="mb-3">
             <label class="form-label small fw-bold text-muted uppercase">Full Name</label>
             <input type="text" formControlName="fullName" class="form-control py-2 shadow-none" placeholder="e.g. John Doe">
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
               <label class="form-label small fw-bold text-muted uppercase">Username</label>
               <input type="text" formControlName="username" class="form-control py-2 shadow-none" placeholder="jdoe">
            </div>
            <div class="col-6">
               <label class="form-label small fw-bold text-muted uppercase">Role</label>
               <select formControlName="role" class="form-select py-2 shadow-none">
                  <option value="CANDIDATE">Candidate</option>
                  <option value="EXAMINER">Examiner</option>
                  <option value="ADMINISTRATOR">Administrator</option>
               </select>
            </div>
          </div>

          <div class="mb-3">
             <label class="form-label small fw-bold text-muted uppercase">Email Address</label>
             <input type="email" formControlName="email" class="form-control py-2 shadow-none" placeholder="john@alphabet.com">
          </div>

          <div class="mb-4">
             <label class="form-label small fw-bold text-muted uppercase">Security Password</label>
             <input type="password" formControlName="password" class="form-control py-2 shadow-none" placeholder="••••••••">
          </div>

          <div *ngIf="error" class="alert alert-danger border-0 rounded-1 py-2 small mb-4">
            <i class="bi bi-exclamation-circle me-2"></i> {{error}}
          </div>
          
          <div *ngIf="success" class="alert alert-success border-0 rounded-1 py-2 small mb-4">
            Registration successful. Initializing terminal access...
          </div>

          <button type="submit" [disabled]="loading || registerForm.invalid" 
                  class="btn btn-primary w-100 py-2 fw-bold text-uppercase ls-1">
             {{ loading ? 'Provisioning...' : 'INITIALIZE ACCOUNT' }}
          </button>
        </form>

        <div class="text-center mt-4">
           <p class="small text-muted mb-0">Already authenticated? <a routerLink="/auth/login" class="text-primary fw-bold text-decoration-none">Return to Portal</a></p>
        </div>
      </div>

       <!-- Footer Link -->
       <div class="position-absolute bottom-0 w-100 p-4 text-center">
         <a routerLink="/" class="text-decoration-none text-muted small">← Return to Public Portal</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; background: #f8f9fa; display: flex; flex-direction: column; }
    .auth-card { width: 100%; max-width: 480px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    .ls-1 { letter-spacing: 1px; }
  `]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CANDIDATE', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || "Registration failed";
        this.loading = false;
      }
    });
  }
}