import { Component } from '@angular/core';
import { PublicService } from 'src/app/core/services/api.service';
import { Credential } from 'src/app/models/app.models';

@Component({
  selector: 'app-verify',
  template: `
    <div class="verify-page pt-5 px-3">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-7">
            <div class="text-center mb-5 content-fade">
              <div class="logo-circle mb-4 mx-auto shadow-sm">
                <i class="bi bi-shield-check text-primary h1"></i>
              </div>
              <h1 class="display-5 fw-bold text-dark">Trust Engine</h1>
              <p class="text-muted fs-5">Verify the authenticity of digital credentials issued by DADCMP.</p>
            </div>

            <div class="card border-0 shadow-lg rounded-4 p-2 mb-5">
              <div class="card-body p-4">
                <div class="input-group input-group-lg search-box">
                  <span class="input-group-text bg-white border-0 ps-4"><i class="bi bi-hash text-muted"></i></span>
                  <input type="text" #codeInput class="form-control border-0 py-4 shadow-none" 
                         placeholder="Enter Certification Code (e.g. CERT-...)" 
                         (keyup.enter)="verify(codeInput.value)">
                  <button class="btn btn-dark px-5 m-2 rounded-3 fw-bold" 
                          (click)="verify(codeInput.value)" 
                          [disabled]="loading">
                    {{ loading ? 'Verifying...' : 'VERIFY' }}
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="error" class="alert alert-danger custom-alert mb-5 animate__animated animate__shakeX">
              <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill h4 me-3 mb-0"></i>
                <div>
                  <div class="fw-bold">No Valid Record Found</div>
                  <small>The code provided does not match any certificate in our blockchain-verified database.</small>
                </div>
              </div>
            </div>

            <div *ngIf="result" class="credential-card animate__animated animate__fadeInUp">
               <div class="card border-0 shadow-xl rounded-4 overflow-hidden">
                  <div class="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
                     <span class="small fw-bold uppercase tracking-wider">OFFICIAL TRANSCRIPT</span>
                     <span class="badge bg-success px-3 py-2 rounded-pill shadow-sm"><i class="bi bi-check-circle-fill me-1"></i> VALID</span>
                  </div>
                  <div class="card-body p-5 bg-white">
                     <div class="row g-5">
                        <div class="col-md-6">
                           <label class="text-muted small uppercase fw-bold d-block mb-1">CANDIDATE</label>
                           <h3 class="fw-bold mb-0">{{result.candidate.username}}</h3>
                           <small class="text-primary">{{result.candidate.email}}</small>
                        </div>
                        <div class="col-md-6">
                           <label class="text-muted small uppercase fw-bold d-block mb-1">ASSESSMENT</label>
                           <h3 class="fw-bold mb-0">{{result.assessment.title}}</h3>
                           <small class="text-muted">{{result.assessment.domain}}</small>
                        </div>
                        <div class="col-12"><hr class="my-0"></div>
                        <div class="col-md-4 text-center border-end">
                           <label class="text-muted small uppercase fw-bold d-block mb-1">ISSUE DATE</label>
                           <div class="fw-bold">{{result.issueDate | date:'mediumDate'}}</div>
                        </div>
                        <div class="col-md-4 text-center border-end">
                           <label class="text-muted small uppercase fw-bold d-block mb-1">EXPIRY</label>
                           <div class="fw-bold">{{result.expiryDate | date:'mediumDate'}}</div>
                        </div>
                        <div class="col-md-4 text-center">
                           <label class="text-muted small uppercase fw-bold d-block mb-1">LICENSE CODE</label>
                           <div class="fw-bold text-primary">{{result.credentialCode}}</div>
                        </div>
                     </div>
                  </div>
                  <div class="card-footer bg-light border-0 py-3 text-center">
                     <small class="text-muted italic"><i class="bi bi-info-circle me-1"></i> Digital signature verified. Integrity check passed.</small>
                  </div>
               </div>
            </div>

            <div class="text-center mt-5">
               <a routerLink="/auth/login" class="btn btn-link text-decoration-none text-muted">
                 <i class="bi bi-arrow-left me-2"></i> Return to Gateway
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-page { min-height: 100vh; background: #fbfcfe; font-family: 'Inter', sans-serif; }
    .logo-circle { width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .search-box { background: white; border-radius: 12px; }
    .custom-alert { border: none; border-radius: 16px; background: #fff5f5; color: #c53030; }
    .credential-card { position: relative; }
    .uppercase { text-transform: uppercase; }
    .tracking-wider { letter-spacing: 0.1em; }
    .shadow-xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
    .content-fade { animation: fadeInDown 0.8s ease-out; }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
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
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
