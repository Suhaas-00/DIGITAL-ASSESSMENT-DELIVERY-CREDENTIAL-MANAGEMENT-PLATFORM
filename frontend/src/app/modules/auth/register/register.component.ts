import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-sm border-0 p-4" style="width: 100%; max-width: 450px;">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">Join DADCMP</h2>
          <p class="text-muted">Create your account</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input type="text" formControlName="fullName" class="form-control"
              [ngClass]="{'is-invalid': f['fullName'].touched && f['fullName'].errors}">
          </div>

          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" formControlName="username" class="form-control"
              [ngClass]="{'is-invalid': f['username'].touched && f['username'].errors}">
          </div>

          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input type="email" formControlName="email" class="form-control"
              [ngClass]="{'is-invalid': f['email'].touched && f['email'].errors}">
          </div>

          <div class="mb-3">
            <label class="form-label">Role</label>
            <select formControlName="role" class="form-select"
              [ngClass]="{'is-invalid': f['role'].touched && f['role'].errors}">
              <option value="CANDIDATE">Candidate</option>
              <option value="EXAMINER">Examiner</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-control"
              [ngClass]="{'is-invalid': f['password'].touched && f['password'].errors}">
          </div>
          
          <div *ngIf="error" class="alert alert-danger py-2 small">{{error}}</div>
          <div *ngIf="success" class="alert alert-success py-2 small">
            Registration successful! Redirecting to login...
          </div>
          
          <button type="submit" [disabled]="loading || registerForm.invalid"
            class="btn btn-primary w-100 py-2 fw-bold">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Register
          </button>
        </form>
        
        <div class="text-center mt-4">
          <p class="small text-muted">
            Already have an account?
            <a routerLink="/auth/login" class="text-primary fw-bold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { height: 100vh; }
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
      fullName: ['', Validators.required], // ✅ ADDED (IMPORTANT)
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

    console.log("📤 Sending payload:", payload); // ✅ DEBUG

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log("✅ Success:", res);
        this.success = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        console.error("❌ Error:", err);

        // ✅ SHOW REAL BACKEND MESSAGE
        this.error = err.error?.message || "Registration failed";
        this.loading = false;
      }
    });
  }
}