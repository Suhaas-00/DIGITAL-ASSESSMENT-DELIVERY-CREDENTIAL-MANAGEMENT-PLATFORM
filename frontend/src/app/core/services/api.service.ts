import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment, Question, Credential } from '../../models/app.models';


// ======================================================
// 🔹 ADMIN SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  createAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments`, assessment);
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }

  updateQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }

  getReports(): Observable<Credential[]> {
    return this.http.get<Credential[]>(`${this.baseUrl}/reports`);
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`);
  }

  assignQuestions(assessmentId: number, questionIds: number[]): Observable<Assessment> {
    return this.http.post<Assessment>(
      `${this.baseUrl}/assessments/${assessmentId}/questions`,
      questionIds
    );
  }

  autoGenerateAssessment(
    assessment: any,
    categoryId: number,
    count: number,
    difficulty: string
  ): Observable<Assessment> {
    return this.http.post<Assessment>(
      `${this.baseUrl}/assessments/auto-generate?categoryId=${categoryId}&count=${count}&difficulty=${difficulty}`,
      assessment
    );
  }

  bulkUploadQuestions(questions: Question[]): Observable<Question[]> {
    return this.http.post<Question[]>(`${this.baseUrl}/questions/bulk`, questions);
  }

  searchQuestions(query?: string, categoryId?: number, difficulty?: string): Observable<Question[]> {
    let url = `${this.baseUrl}/questions/search?`;

    if (query) url += `query=${query}&`;
    if (categoryId) url += `categoryId=${categoryId}&`;
    if (difficulty) url += `difficulty=${difficulty}`;

    return this.http.get<Question[]>(url);
  }
}


// ======================================================
// 🔹 CANDIDATE SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class CandidateService {
  private baseUrl = `${environment.apiUrl}/candidate`;

  constructor(private http: HttpClient) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/assessments`);
  }

  startAssessment(assessmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/start/${assessmentId}`, {});
  }

  submitAssessment(assessmentId: number, responses: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit/${assessmentId}`, responses);
  }

  getResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/results`);
  }
}


// ======================================================
// 🔹 EXAMINER SERVICE (✅ FIXED)
// ======================================================
@Injectable({ providedIn: 'root' })
export class ExaminerService {
  private baseUrl = `${environment.apiUrl}/examiner`;

  constructor(private http: HttpClient) { }

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
    // Questions are created via the admin questions endpoint
    return this.http.post<Question>(`${environment.apiUrl}/admin/questions`, question);
  }

  generateAssessment(
    title: string,
    domain: string,
    difficulty: string,
    count: number
  ): Observable<Assessment> {
    return this.http.post<Assessment>(
      `${this.baseUrl}/assessments/auto-generate?title=${encodeURIComponent(title)}&domain=${encodeURIComponent(domain)}&difficulty=${difficulty}&count=${count}`,
      {}
    );
  }
}


// ======================================================
// 🔹 PUBLIC SERVICE
// ======================================================
@Injectable({ providedIn: 'root' })
export class PublicService {
  private baseUrl = `${environment.apiUrl}/credentials`;

  constructor(private http: HttpClient) { }

  verifyCredential(code: string): Observable<Credential> {
    return this.http.get<Credential>(`${this.baseUrl}/verify/${code}`);
  }
}