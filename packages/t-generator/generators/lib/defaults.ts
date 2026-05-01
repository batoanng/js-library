import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const BATOANNG_TYPES_VERSION = '^0.5.2';

const DEFAULT_CODEX_SCAFFOLD_PATHS = [
  '.codex/config.toml',
  '.codex/skills/use-types-structures/SKILL.md',
  '.codex/skills/use-types-structures/agents/openai.yaml',
  '.husky/pre-push',
] as const;

const DEFAULT_CODEX_TEMPLATE_ROOT = path.join(__dirname, 'templates');

export function buildDefaultCodexScaffold(): Record<string, string> {
  return Object.fromEntries(
    DEFAULT_CODEX_SCAFFOLD_PATHS.map((filePath) => [
      filePath,
      fs.readFileSync(path.join(DEFAULT_CODEX_TEMPLATE_ROOT, filePath), 'utf8'),
    ]),
  );
}
