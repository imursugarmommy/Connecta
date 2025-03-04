export interface Post {
  id: number;
  profileImage: string;
  username: string;
  name: string;
  title: string;
  content: string;
  postImage: string;
  UserId: number;
  Comments: any[];
  Likes: any[];
}
