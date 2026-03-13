/**
 * Role-based permission system for Apple Fam TV
 * 
 * Roles:
 * - Admin: Full access to everything
 * - Editor: Can edit/delete any content, manage submissions
 * - Author: Can only edit/delete their own content, manage their submissions
 */

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author'
};

export const PERMISSIONS = {
  // Article permissions
  CREATE_ARTICLE: 'create_article',
  EDIT_ANY_ARTICLE: 'edit_any_article',
  EDIT_OWN_ARTICLE: 'edit_own_article',
  DELETE_ANY_ARTICLE: 'delete_any_article',
  DELETE_OWN_ARTICLE: 'delete_own_article',
  VIEW_ALL_ARTICLES: 'view_all_articles',

  // Event permissions
  CREATE_EVENT: 'create_event',
  EDIT_ANY_EVENT: 'edit_any_event',
  EDIT_OWN_EVENT: 'edit_own_event',
  DELETE_ANY_EVENT: 'delete_any_event',
  DELETE_OWN_EVENT: 'delete_own_event',
  VIEW_ALL_EVENTS: 'view_all_events',

  // Opportunity permissions
  CREATE_OPPORTUNITY: 'create_opportunity',
  EDIT_ANY_OPPORTUNITY: 'edit_any_opportunity',
  EDIT_OWN_OPPORTUNITY: 'edit_own_opportunity',
  DELETE_ANY_OPPORTUNITY: 'delete_any_opportunity',
  DELETE_OWN_OPPORTUNITY: 'delete_own_opportunity',
  VIEW_ALL_OPPORTUNITIES: 'view_all_opportunities',

  // Submission permissions
  VIEW_ALL_SUBMISSIONS: 'view_all_submissions',
  VIEW_OWN_SUBMISSIONS: 'view_own_submissions',
  APPROVE_SUBMISSIONS: 'approve_submissions',
  REJECT_SUBMISSIONS: 'reject_submissions',

  // User management permissions
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',

  // System permissions
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_NOTIFICATIONS: 'view_notifications'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Full access to everything
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.EDITOR]: [
    // Article permissions
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_ANY_ARTICLE,
    PERMISSIONS.DELETE_ANY_ARTICLE,
    PERMISSIONS.VIEW_ALL_ARTICLES,
    
    // Event permissions
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.EDIT_ANY_EVENT,
    PERMISSIONS.DELETE_ANY_EVENT,
    PERMISSIONS.VIEW_ALL_EVENTS,
    
    // Opportunity permissions
    PERMISSIONS.CREATE_OPPORTUNITY,
    PERMISSIONS.EDIT_ANY_OPPORTUNITY,
    PERMISSIONS.DELETE_ANY_OPPORTUNITY,
    PERMISSIONS.VIEW_ALL_OPPORTUNITIES,
    
    // Submission permissions
    PERMISSIONS.VIEW_ALL_SUBMISSIONS,
    PERMISSIONS.APPROVE_SUBMISSIONS,
    PERMISSIONS.REJECT_SUBMISSIONS,
    
    // System permissions
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_NOTIFICATIONS
  ],
  
  [ROLES.AUTHOR]: [
    // Article permissions (own only)
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_OWN_ARTICLE,
    PERMISSIONS.DELETE_OWN_ARTICLE,
    PERMISSIONS.VIEW_ALL_ARTICLES,
    
    // Event permissions (own only)
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.EDIT_OWN_EVENT,
    PERMISSIONS.DELETE_OWN_EVENT,
    PERMISSIONS.VIEW_ALL_EVENTS,
    
    // Opportunity permissions (own only)
    PERMISSIONS.CREATE_OPPORTUNITY,
    PERMISSIONS.EDIT_OWN_OPPORTUNITY,
    PERMISSIONS.DELETE_OWN_OPPORTUNITY,
    PERMISSIONS.VIEW_ALL_OPPORTUNITIES,
    
    // Submission permissions (own only)
    PERMISSIONS.VIEW_OWN_SUBMISSIONS,
    
    // System permissions
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_NOTIFICATIONS
  ]
};

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  
  // Super admin email always has all permissions
  if (user.email === 'afanyuemma2002@gmail.com') return true;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if user can edit/delete a specific item
 * @param {Object} user - User object
 * @param {Object} item - Item to check (article, event, opportunity)
 * @param {string} action - Action type ('edit' or 'delete')
 * @param {string} itemType - Type of item ('article', 'event', 'opportunity')
 * @returns {boolean}
 */
export function canModifyItem(user, item, action, itemType) {
  if (!user || !item) return false;
  
  // Super admin can do everything
  if (user.email === 'afanyuemma2002@gmail.com') return true;
  
  const permissionMap = {
    article: {
      edit: { any: PERMISSIONS.EDIT_ANY_ARTICLE, own: PERMISSIONS.EDIT_OWN_ARTICLE },
      delete: { any: PERMISSIONS.DELETE_ANY_ARTICLE, own: PERMISSIONS.DELETE_OWN_ARTICLE }
    },
    event: {
      edit: { any: PERMISSIONS.EDIT_ANY_EVENT, own: PERMISSIONS.EDIT_OWN_EVENT },
      delete: { any: PERMISSIONS.DELETE_ANY_EVENT, own: PERMISSIONS.DELETE_OWN_EVENT }
    },
    opportunity: {
      edit: { any: PERMISSIONS.EDIT_ANY_OPPORTUNITY, own: PERMISSIONS.EDIT_OWN_OPPORTUNITY },
      delete: { any: PERMISSIONS.DELETE_ANY_OPPORTUNITY, own: PERMISSIONS.DELETE_OWN_OPPORTUNITY }
    }
  };
  
  const permissions = permissionMap[itemType]?.[action];
  if (!permissions) return false;
  
  // Check if user has permission to modify any item of this type
  if (hasPermission(user, permissions.any)) return true;
  
  // Check if user has permission to modify their own items and owns this item
  if (hasPermission(user, permissions.own)) {
    // Check ownership - item belongs to user
    return item.author === user.displayName || 
           item.author === user.name || 
           item.createdBy === user.uid ||
           item.email === user.email;
  }
  
  return false;
}

/**
 * Get user role display name
 * @param {string} role - User role
 * @returns {string}
 */
export function getRoleDisplayName(role) {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.EDITOR]: 'Editor',
    [ROLES.AUTHOR]: 'Author'
  };
  return roleNames[role] || 'Unknown';
}

/**
 * Get available roles for user creation (based on current user's role)
 * @param {Object} currentUser - Current user object
 * @returns {Array}
 */
export function getAvailableRoles(currentUser) {
  if (!currentUser) return [];
  
  // Super admin can assign any role
  if (currentUser.email === 'afanyuemma2002@gmail.com') {
    return [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR];
  }
  
  // Admin can assign editor and author roles
  if (currentUser.role === ROLES.ADMIN) {
    return [ROLES.EDITOR, ROLES.AUTHOR];
  }
  
  // Editor can only assign author role
  if (currentUser.role === ROLES.EDITOR) {
    return [ROLES.AUTHOR];
  }
  
  // Authors cannot assign roles
  return [];
}

/**
 * Check if user can access admin panel
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function canAccessAdmin(user) {
  return hasPermission(user, PERMISSIONS.VIEW_DASHBOARD);
}

/**
 * Filter items based on user permissions
 * @param {Array} items - Array of items to filter
 * @param {Object} user - User object
 * @param {string} itemType - Type of items ('article', 'event', 'opportunity')
 * @returns {Array}
 */
export function filterItemsByPermission(items, user, itemType) {
  if (!user || !items) return [];
  
  // Super admin and users with "view any" permission see everything
  if (user.email === 'afanyuemma2002@gmail.com' || 
      hasPermission(user, PERMISSIONS[`VIEW_ALL_${itemType.toUpperCase()}S`])) {
    return items;
  }
  
  // Authors only see their own items
  return items.filter(item => 
    item.author === user.displayName || 
    item.author === user.name || 
    item.createdBy === user.uid ||
    item.email === user.email
  );
}