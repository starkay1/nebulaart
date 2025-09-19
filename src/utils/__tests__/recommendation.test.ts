import { calculateRecommendationScore } from '../recommendation';
import { Artwork } from '../../types';

describe('Recommendation Algorithm', () => {
  const mockArtwork: Artwork = {
    id: 'test-1',
    title: 'Test Artwork',
    image: 'https://example.com/image.jpg',
    artist: {
      id: 'artist-1',
      name: 'Test Artist',
      avatar: 'https://example.com/avatar.jpg',
    },
    gradient: ['#FF6B6B', '#4ECDC4'],
    stats: {
      likes: 100,
      comments: 20,
    },
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-01T00:00:00Z',
  };

  describe('calculateRecommendationScore', () => {
    it('should calculate score based on likes', () => {
      const score = calculateRecommendationScore(mockArtwork, {
        likedArtists: [],
        viewedCategories: [],
        interactionScore: {},
      });

      expect(score).toBeGreaterThan(0);
      expect(score).toContain(mockArtwork.stats.likes * 0.3);
    });

    it('should give higher score for recent artworks', () => {
      const recentArtwork = {
        ...mockArtwork,
        createdAt: new Date().toISOString(),
      };

      const oldArtwork = {
        ...mockArtwork,
        createdAt: '2020-01-01T00:00:00Z',
      };

      const recentScore = calculateRecommendationScore(recentArtwork, {
        likedArtists: [],
        viewedCategories: [],
        interactionScore: {},
      });

      const oldScore = calculateRecommendationScore(oldArtwork, {
        likedArtists: [],
        viewedCategories: [],
        interactionScore: {},
      });

      expect(recentScore).toBeGreaterThan(oldScore);
    });

    it('should handle artworks with no stats gracefully', () => {
      const artworkWithoutStats = {
        ...mockArtwork,
        stats: {
          likes: 0,
          comments: 0,
        },
      };

      const score = calculateRecommendationScore(artworkWithoutStats, {
        likedArtists: [],
        viewedCategories: [],
        interactionScore: {},
      });

      expect(score).toBeGreaterThanOrEqual(0);
      expect(typeof score).toBe('number');
    });

    it('should boost score for liked artists', () => {
      const userPreferences = {
        likedArtists: ['artist-1'],
        viewedCategories: [],
        interactionScore: {},
      };

      const scoreWithLikedArtist = calculateRecommendationScore(mockArtwork, userPreferences);
      const scoreWithoutLikedArtist = calculateRecommendationScore(mockArtwork, {
        likedArtists: [],
        viewedCategories: [],
        interactionScore: {},
      });

      expect(scoreWithLikedArtist).toBeGreaterThan(scoreWithoutLikedArtist);
    });
  });
});
