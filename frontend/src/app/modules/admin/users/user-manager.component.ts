import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-manager',
  template: `
    <div class="p-4 bg-light min-vh-100">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-0">System Authority Configurator</h2>
          <p class="text-muted small">Master Administration over global system accounts and roles.</p>
        </div>
        <button class="btn btn-primary shadow-sm" (click)="showForm = !showForm">
           <i class="bi" [ngClass]="showForm ? 'bi-x-circle' : 'bi-person-plus'"></i> 
           {{ showForm ? 'Close Engine' : 'Provision User' }}
        </button>
      </div>

      <!-- Add User Form -->
      <div class="card border-0 shadow-sm rounded-4 mb-4" *ngIf="showForm">
         <div class="card-body p-4 bg-white text-dark">
            <h5 class="fw-bold mb-3 border-bottom pb-2">New Identity Record</h5>
            <div class="row g-3">
               <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted uppercase">Username</label>
                  <input type="text" class="form-control" [(ngModel)]="newUser.username" placeholder="johndoe_xx">
               </div>
               <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted uppercase">Email Asset</label>
                  <input type="email" class="form-control" [(ngModel)]="newUser.email" placeholder="john@domain.com">
               </div>
               <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted uppercase">Full Name</label>
                  <input type="text" class="form-control" [(ngModel)]="newUser.fullName">
               </div>
               <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted uppercase">Clearance Level (Role)</label>
                  <select class="form-select" [(ngModel)]="newUser.role">
                     <option value="CANDIDATE">CANDIDATE</option>
                     <option value="EXAMINER">EXAMINER</option>
                     <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                  </select>
               </div>
               <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted uppercase">Temporary Password</label>
                  <input type="password" class="form-control" [(ngModel)]="newUser.password">
               </div>
               <div class="col-12 mt-4 text-end">
                  <button class="btn btn-dark px-5 py-2 rounded-pill fw-bold" (click)="saveUser()">Deploy Identity</button>
               </div>
            </div>
         </div>
      </div>

      <!-- Users Grid -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
         <div class="card-header bg-white py-3 border-0">
             <h5 class="fw-bold mb-0">Active Identities</h5>
         </div>
         <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
               <thead class="bg-light">
                  <tr class="small uppercase fw-bold text-muted">
                     <th class="ps-4">Identifier</th>
                     <th>Clearance</th>
                     <th>Account Health</th>
                     <th class="pe-4 text-end">Action / Terminate</th>
                  </tr>
               </thead>
               <tbody class="bg-white">
                  <tr *ngFor="let u of users" class="transition-all hover-shadow">
                     <td class="ps-4 py-3">
                        <div class="fw-bold text-dark">{{u.fullName}}</div>
                        <span class="text-muted small">&#64;{{u.username}} • {{u.email}}</span>
                     </td>
                     <td>
                        <span class="badge" 
                           [ngClass]="{
                             'bg-danger': u.role === 'ADMINISTRATOR',
                             'bg-primary': u.role === 'EXAMINER',
                             'bg-secondary': u.role === 'CANDIDATE'
                           }">{{u.role}}</span>
                     </td>
                     <td>
                        <span class="badge border" 
                           [ngClass]="u.status === 'ACTIVE' ? 'bg-success-soft text-success border-success' : 'bg-danger-soft text-danger border-danger'">
                           {{u.status || 'ACTIVE'}}
                        </span>
                     </td>
                     <td class="pe-4 text-end d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-warning" (click)="toggleStatus(u)">
                            <i class="bi" [ngClass]="u.status === 'ACTIVE' ? 'bi-pause-circle' : 'bi-play-circle'"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(u.id)">
                            <i class="bi bi-trash"></i>
                        </button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .uppercase { letter-spacing: 0.05em; }
    .hover-shadow:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.05); transform: translateY(-2px); border-color: #dee2e6 !important; }
    .transition-all { transition: all 0.3s; }
  `]
})
export class UserManagerComponent implements OnInit {
  users: any[] = [];
  showForm = false;
  newUser: any = { role: 'CANDIDATE', status: 'ACTIVE' };
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/users`).subscribe(data => this.users = data);
  }

  saveUser() {
    if (!this.newUser.username || !this.newUser.password) return;
    const payload = { ...this.newUser, status: 'ACTIVE' };
    this.http.post(`${environment.apiUrl}/api/admin/users`, payload).subscribe({
      next: () => {
        this.showForm = false;
        this.newUser = { role: 'CANDIDATE', status: 'ACTIVE' };
        this.loadUsers();
        alert('Identity deployed successfully!');
      },
      error: (err) => {
        console.error('Deployment failed:', err);
        alert('Failed to deploy identity: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

  toggleStatus(u: any) {
    const toggled = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.http.put(`${environment.apiUrl}/api/admin/users/${u.id}`, { status: toggled }).subscribe({
      next: () => {
        this.loadUsers();
        alert(`User status updated to ${toggled}`);
      },
      error: (err) => alert('Failed to update status: ' + (err.error?.error || 'Server error'))
    });
  }

  deleteUser(id: number) {
    if (confirm("Permanently wipe this identity from the central ledger? This will also remove their credentials and history.")) {
       this.http.delete(`${environment.apiUrl}/api/admin/users/${id}`).subscribe({
         next: () => {
           this.loadUsers();
           alert('Identity successfully removed.');
         },
         error: (err) => {
           console.error('Delete failed', err);
           alert('Failed to remove identity. Error: ' + (err.error?.error || 'Check for related records'));
         }
       });
    }
  }
}
