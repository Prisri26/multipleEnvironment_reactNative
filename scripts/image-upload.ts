const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

interface ImageConfig {
  name: string;
  path: string;
  type: 'local' | 'remote';
  url?: string;
}

interface ImageAnswers {
  imageName: string;
  imageType: 'local' | 'remote';
  imagePath?: string;
  imageUrl?: string;
}

const IMAGES_CONFIG_PATH = path.resolve(__dirname, '..', 'src', 'config', 'images.json');
const IMAGES_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Load existing image configurations
const loadImageConfigs = (): ImageConfig[] => {
  if (fs.existsSync(IMAGES_CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(IMAGES_CONFIG_PATH, 'utf8'));
    } catch (error) {
      console.error(chalk.red('Error loading image configs:'), error);
      return [];
    }
  }
  return [];
};

// Save image configurations
const saveImageConfigs = (configs: ImageConfig[]) => {
  const configDir = path.dirname(IMAGES_CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(IMAGES_CONFIG_PATH, JSON.stringify(configs, null, 2));
};

// Copy image to assets directory
const copyImageToAssets = (sourcePath: string, imageName: string): string => {
  const extension = path.extname(sourcePath);
  const destinationPath = path.join(IMAGES_DIR, `${imageName}${extension}`);
  
  try {
    fs.copyFileSync(sourcePath, destinationPath);
    return path.relative(path.resolve(__dirname, '..'), destinationPath);
  } catch (error) {
    console.error(chalk.red('Error copying image:'), error);
    throw error;
  }
};

// Generate image constants
const generateImageConstants = (configs: ImageConfig[]) => {
  const constantsPath = path.resolve(__dirname, '..', 'src', 'constants', 'images.ts');
  const constantsDir = path.dirname(constantsPath);
  
  if (!fs.existsSync(constantsDir)) {
    fs.mkdirSync(constantsDir, { recursive: true });
  }

  const content = `// This file is auto-generated. Do not modify manually.
export const Images = {
${configs.map(config => `  ${config.name}: ${config.type === 'local' ? `require('${config.path}')` : `'${config.url}'`},`).join('\n')}
} as const;

export type ImageName = keyof typeof Images;
`;

  fs.writeFileSync(constantsPath, content);
  console.log(chalk.green('Generated image constants'));
};

// Main function to handle image upload
const uploadImage = async () => {
  const questions = [
    {
      type: 'input',
      name: 'imageName',
      message: 'Enter a name for the image (camelCase):',
      validate: (input: string) => {
        if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
          return 'Please enter a valid camelCase name';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'imageType',
      message: 'Select image type:',
      choices: ['local', 'remote'],
    },
    {
      type: 'input',
      name: 'imagePath',
      message: 'Enter the image path or URL:',
      when: (answers: ImageAnswers) => answers.imageType === 'local',
      validate: (input: string) => {
        if (!fs.existsSync(input)) {
          return 'File does not exist';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'imageUrl',
      message: 'Enter the remote image URL:',
      when: (answers: ImageAnswers) => answers.imageType === 'remote',
      validate: (input: string) => {
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    const configs = loadImageConfigs();

    // Check if image name already exists
    if (configs.some(config => config.name === answers.imageName)) {
      console.log(chalk.red('An image with this name already exists'));
      return;
    }

    const newConfig: ImageConfig = {
      name: answers.imageName,
      type: answers.imageType,
      path: answers.imageType === 'local' ? copyImageToAssets(answers.imagePath, answers.imageName) : '',
      url: answers.imageType === 'remote' ? answers.imageUrl : undefined,
    };

    configs.push(newConfig);
    saveImageConfigs(configs);
    generateImageConstants(configs);

    console.log(chalk.green('Image configuration added successfully'));
  } catch (error) {
    console.error(chalk.red('Error uploading image:'), error);
  }
};

// List all images
const listImages = () => {
  const configs = loadImageConfigs();
  if (configs.length === 0) {
    console.log(chalk.yellow('No images configured'));
    return;
  }

  console.log(chalk.blue('\nConfigured Images:'));
  configs.forEach(config => {
    console.log(chalk.cyan(`\nName: ${config.name}`));
    console.log(`Type: ${config.type}`);
    if (config.type === 'local') {
      console.log(`Path: ${config.path}`);
    } else {
      console.log(`URL: ${config.url}`);
    }
  });
};

// Main menu
const main = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Upload new image', value: 'upload' },
        { name: 'List all images', value: 'list' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'upload':
      await uploadImage();
      break;
    case 'list':
      listImages();
      break;
    case 'exit':
      process.exit(0);
  }

  // Continue the menu
  await main();
};

// Start the script
main().catch(console.error); 