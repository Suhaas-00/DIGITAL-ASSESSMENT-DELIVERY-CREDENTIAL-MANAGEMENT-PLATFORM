import { Component, Input, OnInit } from '@angular/core';
import { ExaminerService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-attempt-list',
  template: `
    <div [ngClass]="{'p-4': !limit}">
      <h2 *ngIf="!limit" class="h2 mb-4">Student Attempts</h2>

      <div class="table-responsive">
        <table class="table table-hover align-middle">

          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>Assessment</th>
              <th>Status</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let item of (limit ? attempts.slice(0, limit) : attempts)">

              <td>#{{ item.id }}</td>

              <!-- ✅ FIXED -->
              <td>
                <strong>
                  {{ item.candidate?.fullName || item.candidate?.username || 'Unknown' }}
                </strong>
              </td>

              <!-- ✅ FIXED -->
              <td>{{ item.assessment?.title }}</td>

              <td>
                <span class="badge"
                  [ngClass]="{
                    'bg-warning': item.status === 'SUBMITTED',
                    'bg-success': item.status === 'EVALUATED',
                    'bg-info': item.status === 'IN_PROGRESS'
                  }">
                  {{ item.status }}
                </span>
              </td>

              <td>{{ item.score ?? 'N/A' }}</td>

              <td>
                <button *ngIf="item.status === 'SUBMITTED'"
                        class="btn btn-sm btn-primary"
                        (click)="selectAttempt(item)"
                        data-bs-toggle="modal"
                        data-bs-target="#evaluateModal">
                  Evaluate
                </button>
              </td>

            </tr>

            <!-- EMPTY -->
            <tr *ngIf="attempts.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                No attempts available
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" id="evaluateModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" *ngIf="selectedAttempt">

          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              Evaluate Attempt #{{ selectedAttempt.id }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p><strong>Candidate:</strong> {{ selectedAttempt.candidate?.username }}</p>
            <p><strong>Responses:</strong> {{ selectedAttempt.responses }}</p>

            <div class="mb-3">
              <label class="form-label">Score</label>
              <input type="number" #scoreInput class="form-control" min="0" max="100">
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-primary w-100"
                    (click)="evaluate(scoreInput.value)">
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AttemptListComponent implements OnInit {

  @Input() limit?: number;

  attempts: any[] = [];
  selectedAttempt: any;

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.examinerService.getAttempts().subscribe({
      next: (data) => {
        console.log("Attempts:", data);
        this.attempts = data;
      },
      error: (err) => console.error(err)
    });
  }

  selectAttempt(item: any) {
    this.selectedAttempt = item;
  }

  evaluate(score: string) {
    if (!score) return;

    this.examinerService
      .evaluateAttempt(this.selectedAttempt.id, { score: +score })
      .subscribe({
        next: () => {
          this.refresh();
        },
        error: (err) => console.error(err)
      });
  }
}