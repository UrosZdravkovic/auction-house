/**
 * Central export point for all types
 * Re-exports from specific type files for convenient imports
 */

// Re-export all auction-related types
export * from './auction';

// User-related types
export type UserRole = 'user' | 'admin';
