import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './open-account.html',
  styleUrls: ['./open-account.css']
})
export class OpenAccountComponent {

  fullName: string = '';
  dob: string = '';
  phoneNumber: string = '';
  panNumber: string = '';
  aadhaarNumber: string = '';
  address: string = '';
  accountType: string = 'SAVINGS';

  successMessage: string = '';
  errorMessage: string = '';
  dobError: boolean = false;

  maxDob: string = '';
  minDob: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const today = new Date();

    const max = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    const min = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );

    this.maxDob = max.toISOString().split('T')[0];
    this.minDob = min.toISOString().split('T')[0];
  }

  validateDob(): void {
    this.dobError = false;

    if (!this.dob) {
      this.dobError = true;
      return;
    }

    const dobDate = new Date(this.dob);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    if (age < 18 || age > 100) {
      this.dobError = true;
    }
  }

  submit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.dobError) {
      this.errorMessage = 'Invalid date of birth';
      return;
    }

    // ✅ CORRECT KEY (matches login component)
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      email: email,
      fullName: this.fullName.trim(),
      dob: this.dob,
      phoneNumber: this.phoneNumber.trim(),
      panNumber: this.panNumber.trim(),
      aadhaarNumber: this.aadhaarNumber.trim(),
      address: this.address.trim(),
      accountType: this.accountType
    };

    this.http.post<{ message: string }>(
      'http://localhost:8080/api/accounts/create',
      payload
    ).subscribe({
      next: (res) => {
        alert(res.message || 'Account created successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const message = err?.error?.message || 'Something went wrong';
        alert(message);
        this.errorMessage = message;
      }
    });
  }
}
