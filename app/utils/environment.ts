import APP_CONFIG from '../config/app.config';

export const isDevelopment = () => APP_CONFIG.IS_DEV;
export const isQA = () => APP_CONFIG.IS_QA;
export const isStaging = () => APP_CONFIG.IS_STAGING;
export const isProduction = () => APP_CONFIG.IS_PROD;

export const getApiUrl = () => APP_CONFIG.API_URL;
export const getAppName = () => APP_CONFIG.APP_NAME;
export const getBundleId = () => APP_CONFIG.BUNDLE_ID;
export const getVersion = () => APP_CONFIG.VERSION;
export const getBuildNumber = () => APP_CONFIG.BUILD_NUMBER;
export const getEnvironment = () => APP_CONFIG.ENVIRONMENT;

export const isDebug = () => __DEV__;
export const isRelease = () => !__DEV__; 