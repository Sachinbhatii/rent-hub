import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DB } from '../../core/services/db';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  favorites: any[] = [];

  constructor(private db: DB, private router: Router) {}

  async ngOnInit() {
    await this.db.init();
    this.favorites = await this.db.getAll('favorites');
  }

  viewDetails(post: any) {
    this.router.navigate(['/view-details', post.id]);
  }

  async remove(post: any) {
    await this.db.delete('favorites', post.id);
    this.favorites = await this.db.getAll('favorites');
  }
}
