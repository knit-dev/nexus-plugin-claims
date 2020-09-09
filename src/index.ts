import { PluginEntrypoint } from 'nexus/plugin'

export const claims: PluginEntrypoint = () => ({
  packageJsonPath: require.resolve('../package.json'),
  runtime: {
    module: require.resolve('./runtime'),
    export: 'plugin',
  },
})
