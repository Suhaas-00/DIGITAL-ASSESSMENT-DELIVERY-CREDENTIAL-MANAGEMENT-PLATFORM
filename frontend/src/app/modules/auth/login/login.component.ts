import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page d-flex align-items-center justify-content-center p-3">
      <div class="auth-card p-4 p-md-5 bg-white border animate__animated animate__fadeIn">
        <div class="text-center mb-5">
           <div class="logo-box mb-4 mx-auto d-flex align-items-center justify-content-center">
              <i class="bi bi-cpu text-primary display-4"></i>
           </div>
           <h1 class="fw-bold brand-text mb-1">AssessiMate</h1>
           <p class="text-muted small uppercase ls-1">Terminal Login</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="animate__animated animate__fadeInUp">
          <div class="mb-3">
             <label class="form-label small fw-bold text-muted uppercase">Username</label>
             <input type="text" formControlName="username" class="form-control py-2 shadow-none" placeholder="e.g. jdoe_admin">
          </div>

          <div class="mb-4">
             <div class="d-flex justify-content-between">
                <label class="form-label small fw-bold text-muted uppercase">Password</label>
                <a href="#" class="small text-decoration-none text-primary">Recovery</a>
             </div>
             <input type="password" formControlName="password" class="form-control py-2 shadow-none" placeholder="••••••••">
          </div>

          <div *ngIf="error" class="alert alert-danger border-0 rounded-1 py-2 small mb-4">
            <i class="bi bi-exclamation-circle me-2"></i> {{error}}
          </div>

          <button type="submit" [disabled]="loading || loginForm.invalid" 
                  class="btn btn-primary w-100 py-2 fw-bold text-uppercase ls-1">
             {{ loading ? 'Synchronizing...' : 'SIGN IN' }}
          </button>
        </form>

        <div class="text-center mt-5 pt-4 border-top">
           <p class="small text-muted mb-0">Identity not provisioned? <a routerLink="/auth/register" class="text-primary fw-bold text-decoration-none">Create Account</a></p>
        </div>
      </div>
      
      <!-- Footer Link -->
      <div class="position-absolute bottom-0 w-100 p-4 text-center">
         <a routerLink="/" class="text-decoration-none text-muted small">← Return to Public Portal</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { height: 100vh; background: #f8f9fa; }
    .auth-card { width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    .ls-1 { letter-spacing: 1px; }
    .logo-box { width: 80px; height: 80px; border-radius: 12px; border: 1px solid #e0e0e0; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        // Redirection based on official Role enums
        const roleLink = user.role === 'ADMINISTRATOR' ? '/admin' : (user.role === 'EXAMINER' ? '/examiner' : '/candidate');
        this.router.navigate([roleLink]);
      },
      error: (err) => {
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }
}
