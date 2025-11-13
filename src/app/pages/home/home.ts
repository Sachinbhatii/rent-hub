import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DB } from '../../core/services/db';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  posts: any[] = [];
  favorites: any[] = [];

  constructor(private db: DB, private router: Router) {}

  async ngOnInit() {
    await this.db.init();
    this.posts = await this.db.getAll('posts');
    this.favorites = (await this.db.getAll('favorites')) || [];
  }

  isFavorite(post: any): boolean {
    return this.favorites.some((f: any) => f.id === post.id);
  }

  async toggleFavorite(post: any) {
    if (this.isFavorite(post)) {
      await this.db.delete('favorites', post.id);
    } else {
      await this.db.add('favorites', post);
    }
    this.favorites = await this.db.getAll('favorites');
  }

  viewDetails(post: any) {
    this.router.navigate(['/view-details', post.id]);
  }
}
