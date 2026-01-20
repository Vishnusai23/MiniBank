import {
  Component,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class TransferComponent {

  receiverAccountNumber!: number;
  amount!: number;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  transfer(form?: any): void {
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      receiverAccountNumber: this.receiverAccountNumber,
      amount: this.amount
    };

    this.http.post<any>(
      'http://localhost:8080/api/transactions/transfer',
      payload,
      {
        headers: { 'X-USER-EMAIL': email }
      }
    )
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.successMessage = res?.message || 'Transfer successful';

          // reset fields
          this.receiverAccountNumber = undefined!;
          this.amount = undefined!;

          if (form) {
            form.resetForm();
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.errorMessage = err?.error?.message || 'Transfer failed';
        });
      }
    });
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
        localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');

    this.router.navigate(['/']);
  }
}
