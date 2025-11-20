import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVoteStatus, recordVote, clearVoteHistoryForAdmin } from '../votes';

describe('votes', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should return hasVotedToday as false when no vote exists', async () => {
    const status = await getVoteStatus();

    expect(status.hasVotedToday).toBe(false);
    expect(status.postId).toBeNull();
    expect(status.today).toBeTruthy();
  });

  it('should record a vote and return hasVotedToday as true', async () => {
    await recordVote('post123');
    const status = await getVoteStatus();

    expect(status.hasVotedToday).toBe(true);
    expect(status.postId).toBe('post123');
  });

  it('should clear vote history', async () => {
    await recordVote('post123');
    await clearVoteHistoryForAdmin();
    const status = await getVoteStatus();

    expect(status.hasVotedToday).toBe(false);
    expect(status.postId).toBeNull();
  });
});