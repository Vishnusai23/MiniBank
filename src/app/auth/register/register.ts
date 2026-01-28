import { Component,ChangeDetectorRef } from '@angular/core';
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
    private router: Router, private cdr: ChangeDetectorRef
  ) {}

register(): void {

  // 🔥 Force UI update immediately
  this.errorMessage = '';
  this.successMessage = '';
  this.cdr.detectChanges();

  // ❌ Prevent admin registration
  if (this.email.trim().toLowerCase() === 'admin') {
    this.errorMessage = 'Admin cannot be registered';
    this.cdr.detectChanges();
    return;
  }

  if (!this.email.trim() || !this.password.trim()) {
    this.errorMessage = 'Email and password are required';
    this.cdr.detectChanges();
    return;
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(this.email.trim())) {
    this.errorMessage = 'Email must be a valid @gmail.com address';
    this.cdr.detectChanges();
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  if (!passwordRegex.test(this.password.trim())) {
    this.errorMessage =
      'Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    this.cdr.detectChanges();
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
      this.successMessage = 'OTP sent to your email';
this.cdr.detectChanges();

this.router.navigate(['/verify-otp'], {
  state: { email: this.email.trim() }
});

    },
    error: (err) => {
      this.errorMessage = err?.error || 'Registration failed';
      this.cdr.detectChanges(); // 🔥 reflect instantly
    }
  });
}


}
