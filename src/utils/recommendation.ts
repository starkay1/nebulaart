import { Artwork } from '../types';

export interface UserPreferences {
  likedArtists: string[];
  viewedCategories: string[];
  interactionScore: Record<string, number>;
}

export const calculateRecommendationScore = (
  artwork: Artwork,
  userPreferences: UserPreferences
): number => {
  let score = 0;

  // 基于点赞数的推荐权重
  score += (artwork.stats?.likes || 0) * 0.3;

  // 基于评论数的活跃度指标
  score += (artwork.stats?.comments || 0) * 0.2;

  // 基于时间的新鲜度权重
  const nowTime = Date.now();
  const artworkTime = new Date(artwork.createdAt || '').getTime();
  const daysDiff = (nowTime - artworkTime) / (1000 * 60 * 60 * 24);
  
  score += Math.max(0, 30 - daysDiff) * 0.1; // 30天内的作品有新鲜度加分

  // 基于用户偏好的艺术家权重
  if (userPreferences.likedArtists.includes(artwork.artist.id)) {
    score += 50; // 喜欢的艺术家加分
  }

  // 基于互动评分
  const interactionScore = userPreferences.interactionScore[artwork.id] || 0;
  score += interactionScore * 0.4;

  return score;
};

export const sortArtworksByRecommendation = (
  artworks: Artwork[],
  userPreferences: UserPreferences
): Artwork[] => {
  return [...artworks].sort((a, b) => {
    const scoreA = calculateRecommendationScore(a, userPreferences);
    const scoreB = calculateRecommendationScore(b, userPreferences);
    return scoreB - scoreA;
  });
};

export const filterArtworksByCategory = (
  artworks: Artwork[],
  categories: string[]
): Artwork[] => {
  if (categories.length === 0) return artworks;
  
  return artworks.filter(artwork => {
    // 这里可以根据实际的分类字段进行过滤
    // 暂时使用标题进行简单匹配
    return categories.some(category => 
      artwork.title.toLowerCase().includes(category.toLowerCase())
    );
  });
};
