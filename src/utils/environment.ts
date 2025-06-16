import { NativeModules, Platform } from 'react-native';

const { RNConfig } = NativeModules;

export const getEnvironment = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    try {
      return await RNConfig.getEnvironment();
    } catch (error) {
      console.error('Error getting environment:', error);
      return 'unknown';
    }
  }
  // For iOS, you can implement similar functionality
  return 'unknown';
};

export const isDevelopment = async (): Promise<boolean> => {
  const env = await getEnvironment();
  return env.toLowerCase() === 'development';
};

export const isStaging = async (): Promise<boolean> => {
  const env = await getEnvironment();
  return env.toLowerCase() === 'staging';
};

export const isQA = async (): Promise<boolean> => {
  const env = await getEnvironment();
  return env.toLowerCase() === 'qa';
};

export const isProduction = async (): Promise<boolean> => {
  const env = await getEnvironment();
  return env.toLowerCase() === 'production';
}; 