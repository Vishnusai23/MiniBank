import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-accounts.html',
  styleUrls: ['./admin-accounts.css']
})
export class AdminAccountsComponent implements OnInit {
  

  accounts: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
  private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

 loadAccounts() {
  this.loading = true;
  this.errorMessage = '';
  this.accounts = [];

  this.http
    .get<any[]>('http://localhost:8080/api/admin/accounts')
    .pipe(
      finalize(() => {
        // 🔥 ALWAYS stop loading
        this.loading = false;

        // 🔥 FORCE Angular to update UI
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.accounts = [...res]; // NEW reference
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load accounts';
      }
    });
}


  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
