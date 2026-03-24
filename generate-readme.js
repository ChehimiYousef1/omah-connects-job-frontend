import fs from 'fs';
import path from 'path';

function generateTree(dirPath, prefix = '') {
  let tree = '';
  const items = fs.readdirSync(dirPath);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    tree += `${prefix}${isLast ? '└── ' : '├── '}${item}\n`;

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree += generateTree(itemPath, newPrefix);
    }
  });

  return tree;
}

const projectRoot = process.cwd();
const treeStructure = generateTree(projectRoot);

fs.writeFileSync('README.md', `# Project File Structure\n\n\`\`\`\n${treeStructure}\n\`\`\``);
console.log('README.md generated with project structure!');
