import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-transactions.html',
  styleUrls: ['./admin-transactions.css']
})
export class AdminTransactionsComponent implements OnInit {

  transactions: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.errorMessage = '';
    this.transactions = [];

    this.http
      .get<any[]>('http://localhost:8080/api/admin/transactions')
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.transactions = [...(res || [])];
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load transactions';
        }
      });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
