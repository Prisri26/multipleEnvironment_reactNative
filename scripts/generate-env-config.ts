/* eslint-disable no-console */
/**
 * Purpose of this file is to create environment configuration files for iOS and Android
 */

const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const envs = ['development', 'qa', 'staging', 'production'] as const;
type EnvType = (typeof envs)[number];

const appName = 'BaseProjectMultiple';

const getAppName = (env: EnvType) => {
  switch (env) {
    case 'development':
      return `${appName} Dev`;
    case 'qa':
      return `${appName} QA`;
    case 'staging':
      return `${appName} Stage`;
    case 'production':
      return appName;
  }
};

const getEnvName = (env: EnvType) => {
  switch (env) {
    case 'development':
      return 'Development';
    case 'qa':
      return 'QA';
    case 'staging':
      return 'Staging';
    case 'production':
      return 'Production';
  }
};

const getAndroidContent = (env: EnvType) => {
  const appName = getAppName(env);
  const envName = getEnvName(env);
  
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
    <string name="environment">${envName}</string>
</resources>`;
};

const getIOSContent = (env: EnvType) => {
  const appName = getAppName(env);
  const envName = getEnvName(env);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${appName}</string>
    <key>Environment</key>
    <string>${envName}</string>
</dict>
</plist>`;
};

// Questions
const questions = [
  {
    default: false,
    loop: false,
    message: 'Are you sure you want to replace the existing files?',
    name: 'confirmationValue',
    type: 'confirm',
  },
];

const shouldGenerateFiles = async () => {
  let atLeastOneFileExists = false;
  const existingFiles = [];

  // Check Android files
  for (const env of envs) {
    const fileName = path.resolve(__dirname, '..', 'android', 'app', 'src', env, 'res', 'values', 'strings.xml');
    if (fs.existsSync(fileName)) {
      atLeastOneFileExists = true;
      existingFiles.push(`android/app/src/${env}/res/values/strings.xml`);
    }
  }

  // Check iOS files
  for (const env of envs) {
    const fileName = path.resolve(__dirname, '..', 'ios', appName, 'Environments', env, 'Info.plist');
    if (fs.existsSync(fileName)) {
      atLeastOneFileExists = true;
      existingFiles.push(`ios/${appName}/Environments/${env}/Info.plist`);
    }
  }

  if (atLeastOneFileExists) {
    console.log(
      chalk.yellow(`The following files exist:\n${existingFiles.join('\n')} `),
    );
    const answers = await inquirer.prompt(questions);
    const { confirmationValue } = answers as {
      confirmationValue: boolean;
    };
    return confirmationValue;
  }
  return true;
};

// Creates directory if it doesn't exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generates environment configuration files for both platforms
const generateEnvConfigFiles = async () => {
  const bool = await shouldGenerateFiles();
  if (!bool) {
    console.log(chalk.magenta('Cancelled generating environment configuration files.'));
    return;
  }

  // Generate Android files
  for (const env of envs) {
    const androidDir = path.resolve(__dirname, '..', 'android', 'app', 'src', env, 'res', 'values');
    ensureDirectoryExists(androidDir);
    
    fs.writeFile(
      path.resolve(androidDir, 'strings.xml'),
      getAndroidContent(env),
      function (err: NodeJS.ErrnoException | null) {
        if (err) throw err;
        console.log(chalk.green(`Android strings.xml for ${env} created successfully.`));
      },
    );
  }

  // Generate iOS files
  for (const env of envs) {
    const iosDir = path.resolve(__dirname, '..', 'ios', appName, 'Environments', env);
    ensureDirectoryExists(iosDir);
    
    fs.writeFile(
      path.resolve(iosDir, 'Info.plist'),
      getIOSContent(env),
      function (err: NodeJS.ErrnoException | null) {
        if (err) throw err;
        console.log(chalk.green(`iOS Info.plist for ${env} created successfully.`));
      },
    );
  }

  console.log(chalk.blue('***************************************'));
  console.log(chalk.blue('Environment configuration files generated successfully!'));
  console.log(chalk.blue('***************************************'));
};

generateEnvConfigFiles();
