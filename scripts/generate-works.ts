import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('src/assets/gallery');
const output = path.resolve('src/data/works.ts');

const files = fs.readdirSync(imagesDir).filter((f) =>
  /\.(jpg|jpeg|png)$/i.test(f)
);

const imports = files.map((file, i) => {
  const varName = `img${i.toString().padStart(3, '0')}`;
  return `import ${varName} from '../assets/gallery/${file}';`;
}).join('\n');

const data = files.map((file, i) => {
  const varName = `img${i.toString().padStart(3, '0')}`;
  const id = file.replace(/\.[^/.]+$/, '');
  return `{ image: ${varName}, id: '${id}' }`;
}).join(',\n  ');

const result = `\
${imports}

export const works = [
  ${data}
];
`;

fs.writeFileSync(output, result);
console.log('✅ works.ts generated!');