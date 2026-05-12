import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicNavbar } from '../../shared/public-navbar/public-navbar';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PublicNavbar
  ],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  email = 'visitor@freightflow360.com';
  password = 'Visiter@123';
  errorMessage = '';
  loading = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.loading = true;

    this.adminAuthService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}