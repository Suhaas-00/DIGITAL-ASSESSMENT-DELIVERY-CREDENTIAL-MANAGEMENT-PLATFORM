import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ExaminerDashboardComponent } from './dashboard/dashboard.component';
import { AttemptListComponent }       from './attempts/attempt-list.component';
import { QuestionManagerComponent }   from './questions/question-manager.component';
import { AssessmentBuilderComponent } from './assessments/assessment-builder.component';

const routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',   component: ExaminerDashboardComponent },
  { path: 'questions',   component: QuestionManagerComponent },
  { path: 'assessments', component: AssessmentBuilderComponent },
  { path: 'attempts',    component: AttemptListComponent },
];

@NgModule({
  declarations: [
    ExaminerDashboardComponent,
    AttemptListComponent,
    QuestionManagerComponent,
    AssessmentBuilderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
})
export class ExaminerModule {}
