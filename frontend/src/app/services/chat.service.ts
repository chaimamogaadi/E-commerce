import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private base = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(this.base, { message });
  }
}