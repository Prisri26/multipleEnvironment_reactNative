import Constants from 'expo-constants';

export type Environment = 'development' | 'qa' | 'staging' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: string;
  environment: Environment;
}

const getEnvironment = (): Environment => {
  const env = Constants.expoConfig?.extra?.EXPO_PUBLIC_ENV as Environment;
  return env || 'development';
};

const ENV: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: 'https://api.dev.baseprojectmultiple.com',
    appName: 'baseProjectMultiple Dev',
    bundleId: 'com.prithivirajan.baseProjectMultiple.development',
    version: '1.0.0',
    buildNumber: '1',
    environment: 'development',
  },
  qa: {
    apiUrl: 'https://api.qa.baseprojectmultiple.com',
    appName: 'baseProjectMultiple QA',
    bundleId: 'com.prithivirajan.baseProjectMultiple.qa',
    version: '1.0.0',
    buildNumber: '1',
    environment: 'qa',
  },
  staging: {
    apiUrl: 'https://api.stage.baseprojectmultiple.com',
    appName: 'baseProjectMultiple Stage',
    bundleId: 'com.prithivirajan.baseProjectMultiple.stage',
    version: '1.0.0',
    buildNumber: '1',
    environment: 'staging',
  },
  production: {
    apiUrl: 'https://api.baseprojectmultiple.com',
    appName: 'baseProjectMultiple',
    bundleId: 'com.prithivirajan.baseProjectMultiple',
    version: '1.0.0',
    buildNumber: '1',
    environment: 'production',
  },
};

export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return ENV[env];
};

export default getConfig; 