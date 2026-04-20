import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-sm border-0 p-4" style="width: 100%; max-width: 400px;">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">DADCMP</h2>
          <p class="text-muted">Sign in to continue</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" formControlName="username" class="form-control" [ngClass]="{'is-invalid': f['username'].touched && f['username'].errors}">
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-control" [ngClass]="{'is-invalid': f['password'].touched && f['password'].errors}">
          </div>
          
          <div *ngIf="error" class="alert alert-danger py-2 small">{{error}}</div>
          
          <button type="submit" [disabled]="loading || loginForm.invalid" class="btn btn-primary w-100 py-2 fw-bold">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Sign In
          </button>
        </form>
        
        <div class="text-center mt-4">
          <p class="small text-muted mb-0">Don't have an account? <a routerLink="/auth/register" class="text-primary fw-bold">Register here</a></p>
          <hr>
          <p class="small text-muted mb-0">Verify a credential? <a routerLink="/verify" class="text-primary fw-bold">Verify Code</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { height: 100vh; }
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
        const roleLink = user.role === 'ADMIN' ? '/admin' : (user.role === 'EXAMINER' ? '/examiner' : '/candidate');
        this.router.navigate([roleLink]);
      },
      error: (err) => {
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }
}
