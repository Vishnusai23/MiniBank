import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // 🔥 ADD THIS
  ) {}

  login(): void {

    this.errorMessage = '';

    const payload = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    this.http.post<string>(
      'http://localhost:8080/api/users/login',
      payload
    ).subscribe({

      next: (token) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('role', 'USER');
        this.router.navigate(['/dashboard']);
      },

      error: (err: HttpErrorResponse) => {

        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed';
        }

        // 🔥 FORCE UI UPDATE IMMEDIATELY
        this.cdr.detectChanges();
      }
    });
  }
}
