import { Injectable } from '@angular/core';
import { DB } from './db'; // 👈 fixed capitalization
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class Post {
  constructor(private db: DB, private auth: Auth) {}

  async addPost(post: any) {
    const user = this.auth.getUser();
    if (!user) throw new Error('Not logged in');
    const newPost = { ...post, user: user.email, createdAt: new Date() };
    await this.db.add('posts', newPost);
  }

  async getAllPosts() {
    return this.db.getAll('posts');
  }
}
