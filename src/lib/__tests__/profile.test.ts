import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearLocalProfile, getLocalProfile, setLocalProfile } from '../profile';

describe('profile', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should return default profile when none exists', async () => {
    const profile = await getLocalProfile();

    expect(profile.username).toBe('kassandra');
    expect(profile.email).toBe('kass@example.com');
    expect(profile.photoUri).toBeNull();
  });

  it('should save and retrieve a profile', async () => {
    const newProfile = {
      username: 'testuser',
      email: 'test@example.com',
      photoUri: 'https://example.com/photo.jpg',
    };

    await setLocalProfile(newProfile);
    const retrieved = await getLocalProfile();

    expect(retrieved.username).toBe('testuser');
    expect(retrieved.email).toBe('test@example.com');
    expect(retrieved.photoUri).toBe('https://example.com/photo.jpg');
  });

  it('should clear profile data', async () => {
    await setLocalProfile({
      username: 'testuser',
      email: 'test@example.com',
    });

    await clearLocalProfile();
    const profile = await getLocalProfile();

    expect(profile.username).toBe('kassandra');
    expect(profile.email).toBe('kass@example.com');
  });
});