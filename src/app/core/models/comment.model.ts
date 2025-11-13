export interface Comment {
  id?: number;
  postId: number;
  parentId?: number | null;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
}
