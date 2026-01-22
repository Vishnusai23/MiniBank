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
import { FormsModule } from '@angular/forms'; // ✅ REQUIRED for ngModel

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule   // ✅ FIX
  ],
  templateUrl: './admin-transactions.html',
  styleUrls: ['./admin-transactions.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTransactionsComponent implements OnInit {

  transactions: any[] = [];
  loading = false;
  errorMessage = '';

  updatingId: number | null = null;   // ✅ FIX

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadAllTransactions();
  }

  loadAllTransactions(): void {

    this.zone.run(() => {
      this.loading = true;
      this.errorMessage = '';
      this.transactions = [];
    });
    this.cdr.detectChanges();

    this.http
      .get<any[]>('http://localhost:8080/api/admin/transactions')
      .subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.loading = false;
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
              err?.error?.message || 'Unable to load admin transactions';
          });
          this.cdr.detectChanges();
        }
      });
  }

  updateTransaction(t: any): void {

    if (!t.status || !t.remarks) return;

    this.updatingId = t.transactionId;
    this.cdr.detectChanges();

    const payload = {
      status: t.status,
      remarks: t.remarks
    };

    this.http
      .put(
        `http://localhost:8080/api/admin/transactions/${t.transactionId}`,
        payload
      )
      .subscribe({
        next: () => {
          this.updatingId = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err?.error?.message || 'Update failed');
          this.updatingId = null;
          this.cdr.detectChanges();
        }
      });
  }

  trackByTxn(index: number, t: any) {
    return t.transactionId;
  }

  goDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
