import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Welcome back</h2>
        <p class="subtitle">Sign in to your account</p>

        @if (errorMsg) {
          <div class="alert-error">{{ errorMsg }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com" />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="field-error">Valid email required</span>
            }
          </div>

          <div class="field">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••" />
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <span class="field-error">Password required</span>
            }
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="switch-link">No account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
    }
    .auth-card {
      background: #fff;
      border-radius: 12px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    h2 { margin: 0 0 4px; font-size: 1.6rem; color: #1a1a2e; }
    .subtitle { color: #888; margin: 0 0 24px; }
    .field { display: flex; flex-direction: column; margin-bottom: 16px; }
    .field label { font-size: 0.85rem; font-weight: 600; color: #444; margin-bottom: 6px; }
    .field input {
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .field input:focus { border-color: #e94560; }
    .field-error { color: #e94560; font-size: 0.78rem; margin-top: 4px; }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) { background: #c73652; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert-error {
      background: #fff0f0;
      border: 1px solid #ffcdd2;
      color: #c62828;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .switch-link { text-align: center; margin-top: 20px; color: #666; font-size: 0.9rem; }
    .switch-link a { color: #e94560; text-decoration: none; font-weight: 600; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/products']),
      error: err => {
        this.errorMsg = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}