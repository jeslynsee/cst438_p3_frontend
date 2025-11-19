// jest.setup.js

// Create a mock storage object
const mockStorage = {};

// Mock AsyncStorage with actual storage behavior
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn((key, value) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key) => {
      return Promise.resolve(mockStorage[key] || null);
    }),
    removeItem: jest.fn((key) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Object.keys(mockStorage));
    }),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([key, value]) => {
        mockStorage[key] = value;
      });
      return Promise.resolve();
    }),
    multiGet: jest.fn((keys) => {
      return Promise.resolve(
        keys.map(key => [key, mockStorage[key] || null])
      );
    }),
  },
}));