import { getConfig } from './environment';

const config = getConfig();

export const APP_CONFIG = {
  API_URL: config.apiUrl,
  APP_NAME: config.appName,
  BUNDLE_ID: config.bundleId,
  VERSION: config.version,
  BUILD_NUMBER: config.buildNumber,
  ENVIRONMENT: config.environment,
  IS_DEV: config.environment === 'development',
  IS_QA: config.environment === 'qa',
  IS_STAGING: config.environment === 'staging',
  IS_PROD: config.environment === 'production',
} as const;

export default APP_CONFIG; 