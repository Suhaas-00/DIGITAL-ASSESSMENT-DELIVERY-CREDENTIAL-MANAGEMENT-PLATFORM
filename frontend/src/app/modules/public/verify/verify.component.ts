import { Component } from '@angular/core';
import { PublicService } from 'src/app/core/services/api.service';
import { Credential } from 'src/app/models/app.models';

@Component({
  selector: 'app-verify',
  template: `
    <div class="verify-page d-flex align-items-center justify-content-center p-3 animate__animated animate__fadeIn">
      <div class="container" style="max-width: 700px;">
        <div class="text-center mb-5">
           <div class="logo-box mb-4 mx-auto border d-flex align-items-center justify-content-center bg-white shadow-sm">
              <i class="bi bi-shield-check text-primary display-4"></i>
           </div>
           <h1 class="fw-bold brand-text mb-3">Verification Terminal</h1>
           <p class="text-muted fs-5">Authenticating cryptographically signed credentials from the AssessiMate cluster.</p>
        </div>

        <div class="card p-4 p-md-5 rounded-3 border bg-white animate__animated animate__zoomIn">
          <div class="mb-5">
             <label class="form-label small fw-bold text-muted uppercase ls-1">Enter Verification Code</label>
             <div class="input-group input-group-lg border rounded-2 overflow-hidden shadow-sm">
                <span class="input-group-text bg-light border-0 ps-4"><i class="bi bi-hash text-muted"></i></span>
                <input type="text" #codeInput class="form-control border-0 py-3 shadow-none" 
                       placeholder="e.g. CERT-..." 
                       (keyup.enter)="verify(codeInput.value)">
                <button class="btn btn-primary px-5 m-1 rounded-1 fw-bold" 
                        (click)="verify(codeInput.value)" 
                        [disabled]="loading">
                  {{ loading ? 'SCANNING...' : 'VERIFY' }}
                </button>
             </div>
          </div>

          <!-- Error Feedback -->
          <div *ngIf="error" class="alert alert-danger border-0 rounded-2 p-3 animate__animated animate__shakeX">
             <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill h4 me-3 mb-0"></i>
                <div>
                   <h6 class="fw-bold mb-0">No Valid Record Found</h6>
                   <p class="mb-0 small">The signature provides does not correspond to any valid node.</p>
                </div>
             </div>
          </div>

          <!-- Result Card -->
          <div *ngIf="result" class="credential-view animate__animated animate__fadeInUp">
             <div class="cert-record border rounded-3 overflow-hidden shadow-sm bg-white">
                <div class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                   <div class="small fw-bold text-muted uppercase ls-1">Official Transcript</div>
                   <div class="badge bg-success-soft text-success px-3 py-1 rounded-pill">GENUINE</div>
                </div>
                <div class="p-4 p-md-5">
                   <div class="row g-4 mb-4">
                      <div class="col-md-6">
                         <div class="text-muted small uppercase fw-bold mb-1">Holder</div>
                         <h4 class="fw-bold mb-0">{{result.candidate.username}}</h4>
                      </div>
                      <div class="col-md-6">
                         <div class="text-muted small uppercase fw-bold mb-1">Certification</div>
                         <h4 class="fw-bold mb-0 text-primary">{{result.assessment.title}}</h4>
                      </div>
                   </div>
                   <div class="row g-4 pt-4 border-top">
                      <div class="col-4">
                         <div class="small text-muted mb-1 uppercase ls-1" style="font-size: 10px;">Issued</div>
                         <div class="small fw-bold">{{result.issueDate | date:'mediumDate'}}</div>
                      </div>
                      <div class="col-4 border-start">
                         <div class="small text-muted mb-1 uppercase ls-1" style="font-size: 10px;">Expires</div>
                         <div class="small fw-bold">{{result.expiryDate | date:'mediumDate'}}</div>
                      </div>
                      <div class="col-4 border-start">
                         <div class="small text-muted mb-1 uppercase ls-1" style="font-size: 10px;">Reference</div>
                         <div class="small fw-bold font-monospace text-truncate">{{result.credentialCode}}</div>
                      </div>
                   </div>
                </div>
                <div class="p-2 bg-light text-center border-top">
                   <span class="small text-muted" style="font-size: 10px;">Digitally signed and sealed by AssessiMate Trust Protocol.</span>
                </div>
             </div>
          </div>
        </div>

        <div class="text-center mt-5">
           <a routerLink="/" class="text-decoration-none text-muted fw-bold small">
              <i class="bi bi-arrow-left me-2"></i> RETURN TO HOME
           </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-page { min-height: 100vh; background: #f8f9fa; }
    .logo-box { width: 80px; height: 80px; border-radius: 12px; }
    .ls-1 { letter-spacing: 1px; }
    .bg-success-soft { background: rgba(52, 168, 83, 0.1); color: #34a853; }
  `]
})
export class VerifyComponent {
  result: Credential | null = null;
  error = false;
  loading = false;

  constructor(private publicService: PublicService) {}

  verify(code: string) {
    if (!code) return;
    this.loading = true;
    this.error = false;
    this.result = null;

    this.publicService.verifyCredential(code).subscribe({
      next: (data: any) => {
        if (data.genuine) {
          this.result = data.details;
          alert(data.message); // Direct feedback
        } else {
          this.error = true;
          this.result = null;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.result = null;
      }
    });
  }
}
