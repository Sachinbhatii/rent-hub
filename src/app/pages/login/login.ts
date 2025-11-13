import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./login.scss'],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private auth: Auth, private router: Router) {}

  async submit() {
    try {
      const success = await this.auth.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error = 'Invalid credentials';
      }
    } catch(err: any) {
      this.error = err.message || 'Login failed';
    }
  }
}
