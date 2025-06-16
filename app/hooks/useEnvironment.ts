import { useMemo } from 'react';
import APP_CONFIG from '../config/app.config';

export const useEnvironment = () => {
  return useMemo(() => ({
    ...APP_CONFIG,
    isDevelopment: APP_CONFIG.IS_DEV,
    isQA: APP_CONFIG.IS_QA,
    isStaging: APP_CONFIG.IS_STAGING,
    isProduction: APP_CONFIG.IS_PROD,
  }), []);
};

export default useEnvironment; 