import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPost, likePost, loadPosts } from '../postsStore';

describe('postsStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should load seed posts on first load', async () => {
    const posts = await loadPosts();
    
    expect(posts).toHaveLength(2);
    expect(posts[0].id).toBe('p1');
    expect(posts[1].id).toBe('p2');
  });

  it('should add a new post', async () => {
    const newPost = {
      team: 'cats' as const,
      author: 'test',
      title: 'Test Post',
      body: 'Test body',
      imageURL: null,
    };

    const result = await addPost(newPost);

    expect(result.id).toBeTruthy();
    expect(result.team).toBe('cats');
    expect(result.likes).toBe(0);
    
    const posts = await loadPosts();
    expect(posts[0].id).toBe(result.id);
  });

  it('should increment likes on a post', async () => {
    const posts = await loadPosts();
    const firstPost = posts[0];
    const initialLikes = firstPost.likes;

    await likePost(firstPost.id);

    const updatedPosts = await loadPosts();
    const updatedPost = updatedPosts.find(p => p.id === firstPost.id);
    
    expect(updatedPost?.likes).toBe(initialLikes + 1);
  });
});