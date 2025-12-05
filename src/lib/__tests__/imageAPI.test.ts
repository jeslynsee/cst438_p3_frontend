import { getRandomImage } from '../imageAPI';

// Mock fetch globally
global.fetch = jest.fn();

describe('imageAPI', () => {
  let warnSpy: jest.SpyInstance;

  beforeAll(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRandomImage', () => {
    it('should fetch a cat image successfully', async () => {
      const mockCatResponse = [{ url: 'https://example.com/cat.jpg' }];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockCatResponse,
      });

      const result = await getRandomImage('cats');

      expect(result).toBe('https://example.com/cat.jpg');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.thecatapi.com/v1/images/search',
        expect.any(Object)
      );
    });

    it('should fetch a dog image successfully', async () => {
      const mockDogResponse = { message: 'https://example.com/dog.jpg' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockDogResponse,
      });

      const result = await getRandomImage('dogs');

      expect(result).toBe('https://example.com/dog.jpg');
      expect(global.fetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
    });

    it('should return null on fetch failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getRandomImage('cats');

      expect(result).toBeNull();
    });
  });
});