import { ImagePickerAsset } from 'expo-image-picker';
import FriendshipService from './FriendshipService';
import NotificationService from './NotificationService';

export interface GratitudePost {
  id: string;
  username: string;
  bullets: string[];
  mediaUrls: string[];
  timestamp: string;
}

// Temporary in-memory storage until we implement a proper backend
let MOCK_POSTS: GratitudePost[] = [];

class ApiService {
  async createPost(username: string, bullets: string[], mediaAssets: ImagePickerAsset[]): Promise<GratitudePost> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, we would upload the media files to a server
    // and get back URLs. For now, we'll just use the local URIs
    const mediaUrls = mediaAssets.map(asset => asset.uri);

    const post: GratitudePost = {
      id: Date.now().toString(),
      username,
      bullets,
      mediaUrls,
      timestamp: new Date().toISOString()
    };

    // Add to mock database
    MOCK_POSTS = [post, ...MOCK_POSTS];

    // Notify mutual friends of the new post
    if (bullets.length > 0) {
      await NotificationService.notifyFriendsOfNewPost(username, bullets[0]);
    }

    return post;
  }

  async getFeed(currentUsername: string): Promise<GratitudePost[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get all mutual friends
    const mutualFriends = await FriendshipService.getMutualFriends(currentUsername);
    
    // Filter posts to only show those from mutual friends and the current user
    return MOCK_POSTS.filter(post => 
      post.username === currentUsername || 
      mutualFriends.includes(post.username)
    );
  }

  async getUserPosts(username: string): Promise<GratitudePost[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return MOCK_POSTS.filter(post => post.username === username);
  }

  async deletePost(postId: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    MOCK_POSTS = MOCK_POSTS.filter(post => post.id !== postId);
  }
}

export default new ApiService(); 