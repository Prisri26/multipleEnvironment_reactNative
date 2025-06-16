const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const ASSETS_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'images');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'src', 'constants', 'images.ts');

const generateImageConstants = () => {
  try {
    // Ensure assets directory exists
    if (!fs.existsSync(ASSETS_DIR)) {
      console.log(chalk.yellow('Creating assets directory...'));
      fs.mkdirSync(ASSETS_DIR, { recursive: true });
      console.log(chalk.green('Assets directory created. Please add your images to:', ASSETS_DIR));
      return;
    }

    // Get all image files
    const imageFiles = fs.readdirSync(ASSETS_DIR)
      .filter((file: string) => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
      })
      .map((file: string) => {
        const name = path.basename(file, path.extname(file))
          .replace(/@2x$/, '')
          .replace(/@3x$/, '');
        return name;
      });

    // Remove duplicates and sort
    const uniqueNames = [...new Set(imageFiles)].sort();

    if (uniqueNames.length === 0) {
      console.log(chalk.yellow('No images found in assets directory. Please add some images to:', ASSETS_DIR));
      return;
    }

    // Generate the constants file content
    const content = `// This file is auto-generated. Do not modify manually.
export const Images = {
${uniqueNames.map(name => `  ${name}: require('../assets/images/${name}.png'),`).join('\n')}
} as const;

export type ImageName = keyof typeof Images;
`;

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(chalk.green('Successfully generated image constants!'));
    console.log(chalk.blue('Found images:'), uniqueNames.length);
    console.log(chalk.blue('Output file:'), OUTPUT_FILE);
  } catch (error) {
    console.error(chalk.red('Error generating image constants:'), error);
  }
};

// Run the script
generateImageConstants(); 