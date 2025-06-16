/* eslint-disable no-console */
/**
 * Purpose of this file is to enable Android builds with inquirer interface
 */
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const { spawn } = require('child_process');

const androidEnvs = ['development', 'qa', 'stage', 'production'] as const;
const releaseType = ['apk', 'aab'] as const;

type AndroidEnvType = (typeof androidEnvs)[number];
type AndroidReleaseType = (typeof releaseType)[number];

const appName = 'BaseProjectMultiple';

// Questions
const questions = [
  {
    choices: androidEnvs,
    loop: false,
    message: 'Select the env to make android build',
    name: 'ENV',
    type: 'list',
  },
  {
    choices: releaseType,
    loop: false,
    message: 'Select the release type',
    name: 'release_type',
    type: 'list',
  },
];

const getOutputFileName = (env: AndroidEnvType) => {
  switch (env) {
    case 'development':
      return `${appName}-Dev`;
    case 'qa':
      return `${appName}-Qa`;
    case 'stage':
      return `${appName}-Stage`;
    case 'production':
      return appName;
  }
};

const getReleaseFolder = (env: AndroidEnvType) => {
  switch (env) {
    case 'development':
      return 'devRelease';
    case 'qa':
      return 'qaRelease';
    case 'stage':
      return 'stageRelease';
    case 'production':
      return 'release';
  }
};

// Move release apk or aab file to root builds folder
const moveBuildFile = async (
  env: AndroidEnvType,
  releaseType: AndroidReleaseType,
) => {
  const buildsFolderPath = path.resolve(__dirname, '..', 'builds');
  
  // Create builds folder if it doesn't exist
  if (!fs.existsSync(buildsFolderPath)) {
    try {
      fs.mkdirSync(buildsFolderPath, { recursive: true });
      console.log(chalk.blue('Created builds folder'));
    } catch (error) {
      console.error(chalk.red('Failed to create builds folder:'), error);
      return;
    }
  }

  const inputFileName =
    releaseType === 'aab'
      ? `app-${env}-release.aab`
      : `app-${env}-release.apk`;
  const outPutFileName =
    releaseType === 'aab'
      ? `${getOutputFileName(env)}.aab`
      : `${getOutputFileName(env)}.apk`;
  let outPutFilePath = '';

  if (releaseType === 'aab') {
    outPutFilePath = `android/app/build/outputs/bundle/${env}/${inputFileName}`;
  } else {
    outPutFilePath = `android/app/build/outputs/apk/${env}/release/${inputFileName}`;
  }

  const sourcePath = path.resolve(__dirname, '..', outPutFilePath);
  const destinationPath = path.resolve(buildsFolderPath, outPutFileName);

  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.log(chalk.red(`Source file not found: ${sourcePath}`));
      return;
    }

    // Copy the file
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(chalk.green(`Successfully moved ${outPutFileName} to builds folder`));
  } catch (error) {
    console.error(chalk.red(`Failed to move ${outPutFileName} to builds folder:`), error);
  }
};

// build apk or aab file
const buildAndroid = async () => {
  const answers = await inquirer.prompt(questions);
  const { ENV: env, release_type } = answers as {
    ENV: AndroidEnvType;
    release_type: AndroidReleaseType;
  };

  const command = 'cd android && ./gradlew';
  const args = [
    `${release_type === 'aab' ? 'bundle' : 'assemble'}${env === 'production' ? 'Release' : env.charAt(0).toUpperCase() + env.slice(1) + 'Release'}`,
  ];

  try {
    const build = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
    });

    build.on('close', async (code: number) => {
      if (code === 0) {
        console.log(chalk.green('Build Successful'));
        console.log('\n');
        await moveBuildFile(env, release_type);
      } else {
        console.log(
          chalk.red(`Failed to build ${release_type} for ENV: ${env}`),
        );
      }
    });
  } catch (e) {
    console.log(
      chalk.red(`Failed to build ${release_type} for ENV: ${env}`),
    );
    console.error(e);
  }
};

buildAndroid(); 