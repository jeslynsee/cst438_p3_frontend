import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Post } from '../postsStore';
import { clearWinners, closeWeekIfNeeded, currentWeekWindow, getWinners } from '../winners';

describe('winners', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should return empty array when no winners exist', async () => {
    const winners = await getWinners();

    expect(winners).toEqual([]);
  });

  it('should return current week start and end', () => {
    const { start, end } = currentWeekWindow();

    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it('should clear winners', async () => {
    const mockPosts: Post[] = [{
      id: 'p1',
      team: 'cats',
      author: 'test',
      title: 'Test',
      body: 'Body',
      likes: 100,
      createdAt: new Date().toISOString(),
      imageURL: null,
    }];

    await closeWeekIfNeeded(mockPosts);
    await clearWinners();
    const winners = await getWinners();

    expect(winners).toEqual([]);
  });
});