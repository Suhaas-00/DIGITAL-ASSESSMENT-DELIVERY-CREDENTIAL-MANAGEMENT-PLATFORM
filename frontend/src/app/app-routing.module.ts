import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

// Admin Components
import { AdminDashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { AssessmentListComponent } from './modules/admin/assessments/assessment-list.component';
import { QuestionListComponent } from './modules/admin/questions/question-list.component';
import { ReportComponent } from './modules/admin/reports/report.component';

// Candidate Components
import { CandidateDashboardComponent } from './modules/candidate/dashboard/dashboard.component';
import { ExamComponent } from './modules/candidate/exam/exam.component';
import { CandidateResultsComponent } from './modules/candidate/results/results.component';

// Examiner Components
import { ExaminerDashboardComponent } from './modules/examiner/dashboard/dashboard.component';
import { AttemptListComponent } from './modules/examiner/attempts/attempt-list.component';
import { QuestionManagerComponent } from './modules/examiner/questions/question-manager.component';
import { AssessmentBuilderComponent } from './modules/examiner/assessments/assessment-builder.component';

// Public Components
import { VerifyComponent } from './modules/public/verify/verify.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Admin Routes
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ADMIN'] },
        children: [
          { path: '', component: AdminDashboardComponent },
          { path: 'assessments', component: AssessmentListComponent },
          { path: 'questions', component: QuestionListComponent },
          { path: 'reports', component: ReportComponent }
        ]
      },
      // Examiner Routes
      {
        path: 'examiner',
        canActivate: [RoleGuard],
        data: { expectedRoles: ['EXAMINER'] },
        children: [
          { path: '', component: ExaminerDashboardComponent },
          { path: 'attempts', component: AttemptListComponent },
          { path: 'questions', component: QuestionManagerComponent },
          { path: 'assessments', component: AssessmentBuilderComponent }
        ]
      },
      // Candidate Routes
      {
        path: 'candidate',
        canActivate: [RoleGuard],
        data: { expectedRoles: ['CANDIDATE'] },
        children: [
          { path: '', component: CandidateDashboardComponent },
          { path: 'assessments', component: CandidateDashboardComponent }, // Shared with dashboard for now
          { path: 'exam/:id', component: ExamComponent },
          { path: 'results', component: CandidateResultsComponent }
        ]
      },
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
