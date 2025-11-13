import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  form!: FormGroup;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.error = 'Please fill all fields correctly.';
      return;
    }

    try {
      // ✅ Check if a user with the same email already exists
      const existingUser = await this.auth.getUserByEmail(this.form.value.email);

      if (existingUser) {
        this.error = 'This email is already registered. Please use another email.';
        return;
      }

      // ✅ Proceed with signup
      await this.auth.signup(this.form.value);
      this.success = 'Account created successfully! Redirecting...';

      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (e) {
      console.error('Signup error:', e);
      this.error = 'Error creating account. Please try again.';
    }
  }
}
