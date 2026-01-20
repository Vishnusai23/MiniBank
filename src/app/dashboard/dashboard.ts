import { Component } from '@angular/core';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
    constructor(private router: Router) {}

  logout() {
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');

    this.router.navigate(['/']);
  }
}
