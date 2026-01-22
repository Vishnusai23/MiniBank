import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-transactions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './view-transactions.html',
  styleUrls: ['./view-transactions.css'],
  changeDetection: ChangeDetectionStrategy.OnPush   // 🔥 IMPORTANT
})
export class ViewTransactions implements OnInit {

  transactions: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      this.cdr.detectChanges();
      return;
    }

    // 🔥 Reset UI instantly
    this.zone.run(() => {
      this.loading = true;
      this.errorMessage = '';
      this.transactions = [];
    });
    this.cdr.detectChanges();

    const payload = { email };

    this.http
      .post<any[]>('http://localhost:8080/api/transactions/history', payload)
      .subscribe({
        next: (res) => {
          // 🔥 Stop loader FIRST so UI updates immediately
          this.zone.run(() => {
            this.loading = false;
          });
          this.cdr.detectChanges();

          // 🔥 Preprocess data (NO date pipe lag)
          this.zone.run(() => {
            this.transactions = (res || []).map(t => ({
              ...t,
              formattedTime: new Date(t.transactionTime).toLocaleString(),
              rowClass: t.type === 'CREDIT' ? 'credit' : 'debit',
              statusClass:
                t.status === 'SUCCESS'
                  ? 'success'
                  : t.status === 'FAILED'
                  ? 'failed'
                  : 'pending'
            }));
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.zone.run(() => {
            this.loading = false;
            this.errorMessage =
              err?.error?.message || 'Unable to load transactions';
          });
          this.cdr.detectChanges();
        }
      });
  }

  trackByTxn(index: number, t: any) {
    return t.transactionTime; // or transactionId if available
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
