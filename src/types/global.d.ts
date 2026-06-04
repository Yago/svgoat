import type { Alpine as AlpineType } from 'alpinejs';

declare global {
  // eslint-disable-next-line no-var -- required for global augmentation
  var Alpine: AlpineType;
}

export {};
