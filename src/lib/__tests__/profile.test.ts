import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearLocalProfile,
  getLocalProfile,
  LocalProfile,
  setLocalProfile,
} from '../profile';

describe('profile', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should return default profile when none exists', async () => {
    const profile = await getLocalProfile('user-1');

    expect(profile.username).toBe('user');
    expect(profile.email).toBe('user@example.com'); 
    expect(profile.photoUri).toBeNull();
  });

  it('should save and retrieve a profile', async () => {
    const userId = 'user-1';

    const savedProfile: LocalProfile = {
      username: 'kassandra',
      email: 'kass@example.com',
      photoUri: null,
    };

    await setLocalProfile(userId, savedProfile);

    const loaded = await getLocalProfile(userId);

    expect(loaded.username).toBe('kassandra');
    expect(loaded.email).toBe('kass@example.com');
    expect(loaded.photoUri).toBeNull();
  });

  it('should clear profile data', async () => {
    const userId = 'user-1';

    const savedProfile: LocalProfile = {
      username: 'kassandra',
      email: 'kass@example.com',
      photoUri: null,
    };

    await setLocalProfile(userId, savedProfile);

    await clearLocalProfile(userId);

    const profile = await getLocalProfile(userId);

    expect(profile.username).toBe('user');
    expect(profile.email).toBe('user@example.com'); 
    expect(profile.photoUri).toBeNull();
  });
});
