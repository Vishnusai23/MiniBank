import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

  constructor(private router: Router) {}

  logout() {
    sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('role');
  
    this.router.navigate(['/']);
  }
}
