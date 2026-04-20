import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

// Shared Components
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { LayoutComponent } from './shared/layout/layout.component';

// Auth Components
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    AssessmentListComponent,
    QuestionListComponent,
    ReportComponent,
    CandidateDashboardComponent,
    ExamComponent,
    CandidateResultsComponent,
    ExaminerDashboardComponent,
    AttemptListComponent,
    QuestionManagerComponent,
    AssessmentBuilderComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
