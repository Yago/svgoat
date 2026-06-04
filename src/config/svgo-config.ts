import type { Config, PluginConfig } from 'svgo';

import pluginNames from './svgo.json';

export const svgoConfig = {
  plugins: pluginNames as PluginConfig[],
} satisfies Config;
