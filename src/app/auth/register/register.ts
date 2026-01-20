import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

 register(): void {

  this.errorMessage = '';
  this.successMessage = '';

  // ❌ Prevent admin registration
  if (this.email.trim().toLowerCase() === 'admin') {
    this.errorMessage = 'Admin cannot be registered';
    return;
  }

  if (!this.email.trim() || !this.password.trim()) {
    this.errorMessage = 'Email and password are required';
    return;
  }

  // ✅ Gmail validation
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(this.email.trim())) {
    this.errorMessage = 'Email must be a valid @gmail.com address';
    return;
  }

  // ✅ Strong password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(this.password.trim())) {
    this.errorMessage =
      'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    return;
  }

  const payload = {
    email: this.email.trim(),
    password: this.password.trim()
  };

  this.http.post(
    'http://localhost:8080/api/users/register',
    payload,
    { responseType: 'text' }
  ).subscribe({
    next: () => {
      this.successMessage = 'Registration successful. Please login.';
      this.email = '';
      this.password = '';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    },
    error: (err) => {
      this.errorMessage = err?.error || 'Registration failed';
    }
  });
}

}
