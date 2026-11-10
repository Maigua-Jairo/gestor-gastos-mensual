const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const OUTPUT_FILE = 'contexto_proyecto.md';

const IGNORE_DIRS = ['node_modules', '.expo', '.vscode', '.git', 'assets', '__tests__', 'android', 'ios', 'dist', 'build'];
const IGNORE_FILES = ['package-lock.json', 'yarn.lock', OUTPUT_FILE, 'export_context.js'];
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md'];

function buildContext(currentPath, chunks) {
  for (const item of fs.readdirSync(currentPath)) {
    const itemPath = path.join(currentPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(item)) buildContext(itemPath, chunks);
      continue;
    }

    // Nunca incluir archivos de entorno: pueden contener secretos
    if (item === '.env' || item.startsWith('.env.')) continue;

    const isAllowed = ALLOWED_EXTENSIONS.includes(path.extname(item));
    const isConfig = item.startsWith('.') || item.includes('config');
    if (IGNORE_FILES.includes(item) || !(isAllowed || isConfig)) continue;

    const relativePath = path.relative(ROOT_DIR, itemPath).split(path.sep).join('/');
    const content = fs.readFileSync(itemPath, 'utf8');
    const line = '='.repeat(48);
    chunks.push(`\n\n${line}\nARCHIVO: ${relativePath}\n${line}\n\n${content}`);
  }
}

const chunks = ['# Contexto completo del proyecto gestor-gastos-mensual\n'];
buildContext(ROOT_DIR, chunks);
fs.writeFileSync(path.join(ROOT_DIR, OUTPUT_FILE), chunks.join(''), 'utf8');
console.log(`Listo: ${OUTPUT_FILE}`);