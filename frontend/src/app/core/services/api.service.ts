import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, Assessment, Question, Attempt, Credential } from 'src/app/models/app.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }
}

// ======================================================
// 🔹 CANDIDATE SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class CandidateService {
  private baseUrl = `${environment.apiUrl}/api/candidate`;

  constructor(private http: HttpClient) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  getAssessment(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/assessments/${id}`);
  }

  startAssessment(assessmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/start/${assessmentId}`, {});
  }

  submitAssessment(attemptId: number, responses: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit/${attemptId}`, { responses: JSON.stringify(responses) });
  }

  getResults(): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(`${this.baseUrl}/results`);
  }

  getCredentials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/credentials`);
  }
}


// ======================================================
// 🔹 EXAMINER SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class ExaminerService {
  private baseUrl = `${environment.apiUrl}/api/examiner`;

  constructor(private http: HttpClient) { }

  getCandidates(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/candidates`);
  }

  getAttempts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attempts`);
  }

  evaluateAttempt(
    attemptId: number,
    payload: { score: number; remarks?: string }
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/evaluate/${attemptId}`, payload);
  }

  getMyQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }

  getMyAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  generateAssessment(payload: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/auto-generate`, payload);
  }

  createManualAssessment(payload: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/manual`, payload);
  }

  toggleAssessmentStatus(id: number, status: string): Observable<Assessment> {
    return this.http.patch<Assessment>(`${this.baseUrl}/assessments/${id}/status`, { status });
  }

  deleteAssessment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/assessments/${id}`);
  }
}

// ======================================================
// 🔹 ADMIN SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics`);
  }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  createAssessment(assessment: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments`, assessment);
  }

  autoGenerateAssessment(assessment: any, categoryId: number, count: number, difficulty: string): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/auto-generate?categoryId=${categoryId}&count=${count}&difficulty=${difficulty}`, assessment);
  }

  deleteAssessment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/assessments/${id}`);
  }

  assignQuestions(assessmentId: number, questionIds: number[]): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/${assessmentId}/questions`, questionIds);
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  addQuestion(question: any): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }

  updateQuestion(id: number, question: any): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }

  bulkUploadQuestions(questions: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/questions/bulk`, questions);
  }

  getReports(): Observable<Credential[]> {
    return this.http.get<Credential[]>(`${this.baseUrl}/credentials`);
  }

  revokeCredential(id: number): Observable<any> {
     return this.http.post(`${this.baseUrl}/credentials/revoke/${id}`, {});
  }

  deleteCredential(id: number): Observable<any> {
     return this.http.delete(`${this.baseUrl}/credentials/${id}`);
  }

  getExaminers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/examiners`);
  }

  updateExaminer(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteExaminer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}

// ======================================================
// 🔹 PUBLIC SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class PublicService {
  private baseUrl = `${environment.apiUrl}/api/public`;

  constructor(private http: HttpClient) { }

  verifyCredential(code: string): Observable<Credential> {
    return this.http.get<Credential>(`${this.baseUrl}/verify/${code}`);
  }
}