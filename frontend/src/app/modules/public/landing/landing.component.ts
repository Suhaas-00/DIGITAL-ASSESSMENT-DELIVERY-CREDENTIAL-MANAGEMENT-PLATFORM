import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing-page">
      <!-- Navigation Header -->
      <nav class="landing-nav d-flex justify-content-between align-items-center px-5 py-3 border-bottom sticky-top bg-white">
        <div class="d-flex align-items-center cursor-pointer" routerLink="/">
          <div class="logo-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; border-radius: 8px shadow-sm;">
            <i class="bi bi-cpu"></i>
          </div>
          <span class="fs-4 fw-medium brand-text" style="color: #202124;">AssessiMate</span>
        </div>
        <div class="d-flex gap-4 align-items-center">
          <a (click)="scrollToFeatures()" class="text-decoration-none text-muted small fw-medium cursor-pointer hover-text-primary">Features</a>
          <a (click)="scrollToAbout()" class="text-decoration-none text-muted small fw-medium cursor-pointer hover-text-primary">About</a>
          <button class="btn btn-primary px-4 py-2 rounded-2 fw-medium shadow-sm transition-all" routerLink="/auth/login">Sign in</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="hero-section text-center py-5 mt-5">
        <div class="container py-5">
          <h1 class="display-1 fw-bold mb-4 animate__animated animate__fadeInDown" style="letter-spacing: -3px; color: #202124;">
            Intelligent Assessment <br>for the <span class="text-primary">Next Generation</span>
          </h1>
          <p class="lead text-muted mx-auto mb-5 animate__animated animate__fadeInUp" style="max-width: 700px; font-size: 1.4rem;">
            AssessiMate is a secure, role-based platform designed for modern workforce evaluation and verifiable credentialing.
          </p>
          <div class="d-flex justify-content-center gap-3 animate__animated animate__fadeInUp animate__delay-1s">
            <button class="btn btn-primary btn-lg px-5 py-3 rounded-2 fw-bold shadow-sm transition-all hover-scale" routerLink="/auth/register">Get Started</button>
            <button class="btn btn-outline-primary btn-lg px-5 py-3 rounded-2 fw-bold transition-all" (click)="demoNotice()">Request Demo</button>
          </div>
        </div>
      </header>

      <!-- Features Block -->
      <section id="features" class="py-5 bg-light">
        <div class="container py-5 text-center">
          <h2 class="fw-bold mb-2 display-5">Built for Scale</h2>
          <p class="text-muted mb-5">Global infrastructure for institutional evaluations.</p>
          <div class="row g-4 mt-2">
            <div class="col-md-4">
              <div class="card p-4 h-100 border bg-white shadow-none rounded-3 hover-shadow-google transition-all">
                <i class="bi bi-shield-check text-success display-4 mb-3"></i>
                <h4 class="fw-bold">High Security</h4>
                <p class="small text-muted">Advanced anti-tampering measures and cryptographic credential verification.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 h-100 border bg-white shadow-none rounded-3 hover-shadow-google transition-all">
                <i class="bi bi-lightning-charge text-primary display-4 mb-3"></i>
                <h4 class="fw-bold">Neural Bank</h4>
                <p class="small text-muted">Automated question generation and intelligent evaluation engines.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 h-100 border bg-white shadow-none rounded-3 hover-shadow-google transition-all">
                <i class="bi bi-award text-danger display-4 mb-3"></i>
                <h4 class="fw-bold">Trust Engine</h4>
                <p class="small text-muted">Publicly verifiable digital credentials issued instantly upon success.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Organization Section -->
      <section id="about" class="py-5">
        <div class="container py-5">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <span class="badge bg-light text-primary border px-3 py-2 rounded-pill mb-3 uppercase ls-1">The Organisation</span>
              <h2 class="display-5 fw-bold mb-4">Empowering Intelligence through <span class="text-danger">AssessiMate</span></h2>
              <p class="text-muted fs-5 mb-4">
                Part of the Alphabet ecosystem, we are dedicated to organizing the world's talent and making it universally accessible and verifiable. AssessiMate is our flagship platform for institutional skill measurement.
              </p>
              <div class="d-flex gap-4">
                <div class="text-center">
                   <div class="fw-bold display-6">500K+</div>
                   <div class="small text-muted uppercase tracking-widest">Candidates</div>
                </div>
                <div class="text-center">
                   <div class="fw-bold display-6">12M+</div>
                   <div class="small text-muted uppercase tracking-widest">Credentials</div>
                </div>
              </div>
            </div>
            <div class="col-lg-5 offset-lg-1">
               <div class="p-5 bg-primary text-white rounded-5 shadow-lg position-relative overflow-hidden">
                  <h4 class="fw-bold mb-3">Provision Your Identity</h4>
                  <p class="small opacity-75 mb-4">Join our global network of experts and verified professionals today.</p>
                  <button class="btn btn-light w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale" routerLink="/auth/register">CREATE ACCOUNT</button>
                  <div class="position-absolute opacity-10" style="bottom: -20px; right: -20px; font-size: 15rem;">
                     <i class="bi bi-cpu"></i>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-5 border-top bg-white">
        <div class="container">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="d-flex align-items-center mb-3">
                <div class="logo-circle bg-dark text-white me-2 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; border-radius: 6px;">
                  <i class="bi bi-cpu small"></i>
                </div>
                <span class="fw-bold brand-text">AssessiMate</span>
              </div>
              <p class="small text-muted">A subsidiary of Alphabet Inc. Building the future of assessment technology.</p>
            </div>
            <div class="col-6 col-md-2 mb-4">
              <h6 class="fw-bold small mb-3">Product</h6>
              <ul class="list-unstyled small text-muted">
                <li class="mb-2 cursor-pointer hover-text-primary" (click)="scrollToFeatures()">Features</li>
                <li class="mb-2 cursor-pointer hover-text-primary" (click)="demoNotice()">Solutions</li>
                <li class="mb-2 cursor-pointer hover-text-primary" routerLink="/verify">Verify Credentials</li>
              </ul>
            </div>
            <div class="col-6 col-md-2 mb-4">
              <h6 class="fw-bold small mb-3">Company</h6>
              <ul class="list-unstyled small text-muted">
                <li class="mb-2 cursor-pointer hover-text-primary" (click)="scrollToAbout()">About</li>
                <li class="mb-2">Careers</li>
                <li class="mb-2">Privacy</li>
              </ul>
            </div>
            <div class="col-md-4 mb-4 text-md-end">
               <div class="d-flex gap-3 justify-content-md-end">
                  <i class="bi bi-twitter text-muted h5 cursor-pointer"></i>
                  <i class="bi bi-linkedin text-muted h5 cursor-pointer"></i>
                  <i class="bi bi-github text-muted h5 cursor-pointer"></i>
               </div>
               <p class="small text-muted mt-3 mb-0">© 2026 Alphabet AssessiMate Terminals.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .landing-page { min-height: 100vh; overflow-x: hidden; }
    .hero-section { background: radial-gradient(circle at 80% 20%, rgba(66, 133, 244, 0.05), transparent 40%); }
    .ls-1 { letter-spacing: 1px; }
    .cursor-pointer { cursor: pointer; }
    .hover-text-primary:hover { color: #1a73e8 !important; }
    .transition-all { transition: all 0.3s ease; }
    .hover-scale:hover { transform: scale(1.05); }
    .hover-shadow-google:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; }
  `]
})
export class LandingComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      if (role === 'ADMINISTRATOR') this.router.navigate(['/admin']);
      else if (role === 'EXAMINER') this.router.navigate(['/examiner']);
      else if (role === 'CANDIDATE') this.router.navigate(['/candidate']);
    }
  }

  demoNotice() {
    alert('Request Received. Our regional cluster representative will reach out to you shortly for a neural demo.');
  }

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
