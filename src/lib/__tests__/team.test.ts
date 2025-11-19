import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTeam, setTeam } from '../team';

describe('team', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should return null when no team is set', async () => {
    const team = await getTeam();

    expect(team).toBeNull();
  });

  it('should save and retrieve cats team', async () => {
    await setTeam('cats');
    const team = await getTeam();

    expect(team).toBe('cats');
  });

  it('should save and retrieve dogs team', async () => {
    await setTeam('dogs');
    const team = await getTeam();

    expect(team).toBe('dogs');
  });
});