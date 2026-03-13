/**
 * Convert category name to URL slug
 * @param {string} categoryName - Category name (e.g., "International", "Business")
 * @returns {string} URL slug (e.g., "international", "business")
 */
export const categoryToSlug = (categoryName) => {
  return categoryName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Convert URL slug to category name
 * @param {string} slug - URL slug (e.g., "international", "business")
 * @returns {string} Category name (e.g., "International", "Business")
 */
export const slugToCategory = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get category URL path
 * @param {string} categoryName - Category name
 * @returns {string} Category URL path
 */
export const getCategoryPath = (categoryName) => {
  return `/category/${categoryToSlug(categoryName)}`;
};

/**
 * Category slug mappings for consistency
 */
export const CATEGORY_SLUGS = {
  'International': 'international',
  'Business': 'business',
  'Politics': 'politics',
  'Entertainment': 'entertainment',
  'Headlines': 'headlines',
  'Latest': 'latest'
};

/**
 * Reverse category slug mappings
 */
export const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([key, value]) => [value, key])
);