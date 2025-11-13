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
  styleUrls: ['./create-post.scss'],
})
export class CreatePost {
  form!: FormGroup;
  successMsg = '';
  photos: string[] = [];

  constructor(private fb: FormBuilder, private db: DB, private router: Router) {
    this.form = this.fb.group({
      apartment: ['', Validators.required],
      buildingName: ['', Validators.required],
      shared: ['no', Validators.required],
      address: ['', Validators.required],
      squareFeet: ['', Validators.required],
      leaseType: ['long', Validators.required],
      expectedRent: ['', Validators.required],
      negotiable: [false],
      priceMode: ['perMonth', Validators.required],
      utilitiesIncluded: [false],
      furnished: ['no', Validators.required],
      amenities: this.fb.group({
        gym: [false],
        swimmingPool: [false],
        carPark: [false],
        visitorsParking: [false],
        powerBackup: [false],
        garbageDisposal: [false],
        privateLawn: [false],
        waterHeater: [false],
        plantSecurity: [false],
        laundryService: [false],
        elevator: [false],
        clubHouse: [false],
      }),
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1400)]],
      contact: ['', Validators.required],
    });
  }

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
