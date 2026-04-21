import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-examiner-manager',
  template: `
    <div class="examiners-page p-4">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Examiner Management</h2>
          <p class="text-muted mb-0">View, edit and manage all platform examiners</p>
        </div>
        <div class="d-flex gap-2">
          <input type="text" class="form-control search-box" placeholder="Search by name, email..."
            [(ngModel)]="searchTerm" (input)="filterExaminers()">
          <span class="badge bg-primary align-self-center px-3 py-2 fs-6">{{filtered.length}} Examiners</span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="stat-mini border rounded-3 p-3 bg-white shadow-sm text-center">
            <div class="fs-3 fw-bold text-primary">{{examiners.length}}</div>
            <div class="text-muted small">Total Examiners</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-mini border rounded-3 p-3 bg-white shadow-sm text-center">
            <div class="fs-3 fw-bold text-success">{{activeCount}}</div>
            <div class="text-muted small">Active</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-mini border rounded-3 p-3 bg-white shadow-sm text-center">
            <div class="fs-3 fw-bold text-warning">{{inactiveCount}}</div>
            <div class="text-muted small">Inactive</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-mini border rounded-3 p-3 bg-white shadow-sm text-center">
            <div class="fs-3 fw-bold text-info">{{totalQuestions}}</div>
            <div class="text-muted small">Total Questions Added</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-3">Loading examiners...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMsg" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i> {{errorMsg}}
      </div>

      <!-- Examiner Cards Grid -->
      <div class="row g-4" *ngIf="!loading && !errorMsg">
        <div class="col-lg-6 col-xl-4" *ngFor="let ex of filtered">
          <div class="examiner-card card border-0 shadow-sm rounded-4 h-100 overflow-hidden">

            <!-- Card Header -->
            <div class="card-header-custom d-flex align-items-center gap-3 p-4">
              <div class="avatar-circle" [style.background]="getAvatarColor(ex.username)">
                {{ex.fullName?.substring(0,1)?.toUpperCase() || ex.username?.substring(0,1)?.toUpperCase()}}
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-6 text-dark">{{ex.fullName || 'N/A'}}</div>
                <div class="text-muted small">&#64;{{ex.username}}</div>
              </div>
              <span class="badge rounded-pill px-3"
                [ngClass]="ex.status === 'ACTIVE' ? 'bg-success' : (ex.status === 'INACTIVE' ? 'bg-danger' : 'bg-secondary')">
                {{ex.status || 'ACTIVE'}}
              </span>
            </div>

            <!-- Card Body -->
            <div class="card-body p-4 pt-0">
              <hr class="my-3 opacity-25">

              <!-- Details -->
              <div class="details-grid">
                <div class="detail-row">
                  <i class="bi bi-envelope text-primary"></i>
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ex.email || '—'}}</span>
                </div>
                <div class="detail-row">
                  <i class="bi bi-calendar text-info"></i>
                  <span class="detail-label">Date of Birth</span>
                  <span class="detail-value">{{ex.dateOfBirth || '—'}}</span>
                </div>
                <div class="detail-row">
                  <i class="bi bi-person-badge text-warning"></i>
                  <span class="detail-label">Role</span>
                  <span class="detail-value fw-bold">EXAMINER</span>
                </div>
              </div>

              <hr class="my-3 opacity-25">

              <!-- Action Buttons -->
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm flex-fill rounded-pill"
                  (click)="openEditModal(ex)">
                  <i class="bi bi-pencil me-1"></i> Edit
                </button>
                <button class="btn btn-outline-info btn-sm flex-fill rounded-pill"
                  (click)="viewDetails(ex)">
                  <i class="bi bi-eye me-1"></i> View
                </button>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3"
                  (click)="confirmDelete(ex)"
                  title="Remove Examiner">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="col-12 text-center py-5" *ngIf="filtered.length === 0 && !loading">
          <i class="bi bi-people fs-1 text-muted d-block mb-3"></i>
          <h5 class="text-muted">No examiners found</h5>
          <p class="text-muted">No examiners match your search criteria.</p>
        </div>
      </div>

      <!-- EDIT MODAL -->
      <div class="modal-backdrop-custom" *ngIf="editingExaminer" (click)="closeModal()"></div>
      <div class="modal-panel" *ngIf="editingExaminer">
        <div class="modal-panel-header d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">Edit Examiner Profile</h5>
          <button class="btn btn-light btn-sm rounded-circle" (click)="closeModal()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Full Name</label>
          <input class="form-control" [(ngModel)]="editForm.fullName" placeholder="Full Name">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Email Address</label>
          <input class="form-control" [(ngModel)]="editForm.email" type="email" placeholder="Email">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Username</label>
          <input class="form-control" [(ngModel)]="editForm.username" placeholder="Username">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Status</label>
          <select class="form-select" [(ngModel)]="editForm.status">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="form-label fw-bold">Date of Birth</label>
          <input class="form-control" [(ngModel)]="editForm.dateOfBirth" type="date">
        </div>

        <div *ngIf="saveSuccess" class="alert alert-success py-2">
          <i class="bi bi-check-circle me-2"></i> Profile updated successfully!
        </div>
        <div *ngIf="saveError" class="alert alert-danger py-2">
          <i class="bi bi-exclamation-triangle me-2"></i> {{saveError}}
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-primary flex-fill" (click)="saveExaminer()" [disabled]="saving">
            <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
            Save Changes
          </button>
          <button class="btn btn-light flex-fill" (click)="closeModal()">Cancel</button>
        </div>
      </div>

      <!-- VIEW MODAL -->
      <div class="modal-backdrop-custom" *ngIf="viewingExaminer" (click)="closeViewModal()"></div>
      <div class="modal-panel" *ngIf="viewingExaminer">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">Examiner Profile Details</h5>
          <button class="btn btn-light btn-sm rounded-circle" (click)="closeViewModal()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="text-center mb-4">
          <div class="avatar-circle-lg mx-auto mb-3" [style.background]="getAvatarColor(viewingExaminer.username)">
            {{viewingExaminer.fullName?.substring(0,1)?.toUpperCase()}}
          </div>
          <h4 class="fw-bold">{{viewingExaminer.fullName}}</h4>
          <span class="badge bg-primary px-3 py-2">EXAMINER</span>
        </div>
        <table class="table table-borderless">
          <tbody>
            <tr><td class="fw-bold text-muted">Username</td><td>&#64;{{viewingExaminer.username}}</td></tr>
            <tr><td class="fw-bold text-muted">Email</td><td>{{viewingExaminer.email}}</td></tr>
            <tr><td class="fw-bold text-muted">Status</td>
              <td><span class="badge" [ngClass]="viewingExaminer.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'">{{viewingExaminer.status || 'ACTIVE'}}</span></td>
            </tr>
            <tr><td class="fw-bold text-muted">Date of Birth</td><td>{{viewingExaminer.dateOfBirth || '—'}}</td></tr>
          </tbody>
        </table>
        <button class="btn btn-outline-primary w-100 mt-2" (click)="closeViewModal()">Close</button>
      </div>

      <!-- CONFIRM DELETE MODAL -->
      <div class="modal-backdrop-custom" *ngIf="deletingExaminer" (click)="cancelDelete()"></div>
      <div class="modal-panel confirm-panel" *ngIf="deletingExaminer">
        <div class="text-center mb-4">
          <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
          <h5 class="fw-bold">Remove Examiner?</h5>
          <p class="text-muted">Are you sure you want to remove <strong>{{deletingExaminer.fullName}}</strong> from the platform? This action cannot be undone.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger flex-fill" (click)="deleteExaminer()" [disabled]="saving">
            <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
            Yes, Remove
          </button>
          <button class="btn btn-light flex-fill" (click)="cancelDelete()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .examiners-page { background: #f4f7f9; min-height: 100vh; }
    .search-box { max-width: 280px; border-radius: 50px; border: 1.5px solid #e0e0e0; }
    .stat-mini { transition: transform 0.2s; }
    .stat-mini:hover { transform: translateY(-3px); }
    .examiner-card { transition: transform 0.25s, box-shadow 0.25s; }
    .examiner-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
    .card-header-custom { background: #f8f9ff; border-bottom: 1px solid #e8ecf4; }
    .avatar-circle {
      width: 52px; height: 52px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; font-weight: 700; color: white; flex-shrink: 0;
    }
    .avatar-circle-lg {
      width: 80px; height: 80px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 700; color: white;
    }
    .details-grid { display: flex; flex-direction: column; gap: 0.6rem; }
    .detail-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.875rem; }
    .detail-label { color: #6c757d; min-width: 90px; }
    .detail-value { color: #212529; font-weight: 500; }
    .modal-backdrop-custom {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 1000; backdrop-filter: blur(2px);
    }
    .modal-panel {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; border-radius: 20px; padding: 2rem;
      width: 90%; max-width: 480px; z-index: 1001;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .confirm-panel { max-width: 400px; }
  `]
})
export class ExaminerManagerComponent implements OnInit {
  examiners: any[] = [];
  filtered: any[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';

  editingExaminer: any = null;
  viewingExaminer: any = null;
  deletingExaminer: any = null;

  editForm: any = {};
  saving = false;
  saveSuccess = false;
  saveError = '';

  // Computed stats
  get activeCount() { return this.examiners.filter(e => !e.status || e.status === 'ACTIVE').length; }
  get inactiveCount() { return this.examiners.filter(e => e.status === 'INACTIVE').length; }
  get totalQuestions() { return this.examiners.reduce((sum, e) => sum + (e.questionsCount || 0), 0); }

  avatarColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadExaminers();
  }

  loadExaminers() {
    this.loading = true;
    this.errorMsg = '';
    // First try the dedicated examiners endpoint
    this.adminService.getExaminers().subscribe({
      next: (data: any[]) => {
        this.examiners = data;
        this.filtered = data;
        this.loading = false;
      },
      error: (err) => {
        // Fallback: load from analytics
        this.adminService.getAnalytics().subscribe({
          next: (analytics: any) => {
            this.examiners = analytics.examinerContribution || [];
            this.filtered = this.examiners;
            this.loading = false;
          },
          error: () => {
            this.errorMsg = 'Failed to load examiners. Please ensure the backend is running.';
            this.loading = false;
          }
        });
      }
    });
  }

  filterExaminers() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filtered = this.examiners;
      return;
    }
    this.filtered = this.examiners.filter(ex =>
      (ex.fullName || '').toLowerCase().includes(term) ||
      (ex.username || '').toLowerCase().includes(term) ||
      (ex.email || '').toLowerCase().includes(term)
    );
  }

  getAvatarColor(username: string): string {
    if (!username) return this.avatarColors[0];
    const idx = username.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[idx];
  }

  openEditModal(ex: any) {
    this.editingExaminer = ex;
    this.editForm = {
      fullName: ex.fullName || ex.full_name || '',
      email: ex.email || '',
      username: ex.username || '',
      status: ex.status || 'ACTIVE',
      dateOfBirth: ex.dateOfBirth || ex.dob || ''
    };
    this.saveSuccess = false;
    this.saveError = '';
  }

  closeModal() {
    this.editingExaminer = null;
    this.saveSuccess = false;
    this.saveError = '';
  }

  saveExaminer() {
    if (!this.editingExaminer?.id) {
      this.saveError = 'Cannot update: examiner ID not found.';
      return;
    }
    this.saving = true;
    this.saveError = '';
    const payload = {
      ...this.editForm,
      role: 'EXAMINER'
    };
    this.adminService.updateExaminer(this.editingExaminer.id, payload).subscribe({
      next: (updated) => {
        this.saving = false;
        this.saveSuccess = true;
        // Update local data
        const idx = this.examiners.findIndex(e => e.id === this.editingExaminer.id);
        if (idx !== -1) {
          this.examiners[idx] = { ...this.examiners[idx], ...this.editForm };
          this.filterExaminers();
        }
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (err) => {
        this.saving = false;
        this.saveError = 'Update failed. Please try again.';
      }
    });
  }

  viewDetails(ex: any) {
    this.viewingExaminer = ex;
  }

  closeViewModal() {
    this.viewingExaminer = null;
  }

  confirmDelete(ex: any) {
    this.deletingExaminer = ex;
  }

  cancelDelete() {
    this.deletingExaminer = null;
  }

  deleteExaminer() {
    if (!this.deletingExaminer?.id) return;
    this.saving = true;
    this.adminService.deleteExaminer(this.deletingExaminer.id).subscribe({
      next: () => {
        this.saving = false;
        this.examiners = this.examiners.filter(e => e.id !== this.deletingExaminer.id);
        this.filterExaminers();
        this.deletingExaminer = null;
      },
      error: () => {
        this.saving = false;
        this.deletingExaminer = null;
      }
    });
  }
}
