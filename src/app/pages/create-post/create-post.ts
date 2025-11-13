import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DB } from '../../core/services/db';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  form!: FormGroup;
  successMsg = '';
  photos: string[] = []; // store base64 image data for preview

  constructor(private fb: FormBuilder, private db: DB, private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      location: ['', Validators.required],
      furnished: ['no', Validators.required],
      amenities: this.fb.group({
        wifi: [false],
        parking: [false],
        ac: [false],
        gym: [false],
      }),
      vegetarian: ['no', Validators.required],
      contact: ['', Validators.required],
    });
  }


  // 📸 Handle file uploads
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    if (files.length + this.photos.length > 5) {
      alert('You can upload a maximum of 5 photos.');
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photos.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const newPost = {
      ...this.form.value,
      photos: this.photos,
      createdAt: new Date().toISOString(),
    };

    await this.db.add('posts', newPost);
    this.successMsg = 'Post created successfully!';
    setTimeout(() => this.router.navigate(['/home']), 1500);
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }
}
