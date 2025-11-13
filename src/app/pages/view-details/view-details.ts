import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DB } from '../../core/services/db';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-details.html',
  styleUrls: ['./view-details.scss']
})
export class ViewDetails implements OnInit {
  post: any;
  comments: any[] = [];

  // Main comment form
  mainCommentForm!: FormGroup;

  // Reply forms mapped by commentId
  replyForms: { [key: number]: FormGroup } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DB,
    private fb: FormBuilder,
    private auth: Auth
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    await this.db.init();

    this.post = await this.db.getByKey('posts', id);
    this.comments = await this.db.getByIndex('comments', 'postId', id);

    this.mainCommentForm = this.fb.group({
      text: ['', Validators.required],
    });
  }

  async getUser() {
    return await this.auth.getUser();
  }

  /** Helper to get only top-level comments */
  getRootComments() {
    return this.comments.filter(c => !c.parentId);
  }

  /** Get replies for any comment */
  getReplies(parentId: number) {
    return this.comments.filter(c => c.parentId === parentId);
  }

  /** Add comment or reply */
  async addComment(parentId: number | null = null) {
    const form = parentId ? this.replyForms[parentId] : this.mainCommentForm;
    if (!form || form.invalid) return;

    const user = await this.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const newComment = {
      postId: this.post.id,
      parentId,
      userId: user.id,
      username: user.name,
      text: form.value.text,
      createdAt: new Date().toISOString(),
    };

    await this.db.add('comments', newComment);

    form.reset();

    // Reload all comments after adding
    this.comments = await this.db.getByIndex('comments', 'postId', this.post.id);
  }

  /** Toggle reply form for a comment */
  toggleReplyForm(commentId: number) {
    if (!this.replyForms[commentId]) {
      this.replyForms[commentId] = this.fb.group({
        text: ['', Validators.required],
      });
    } else {
      delete this.replyForms[commentId];
    }
  }
}
