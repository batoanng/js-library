import fs from 'node:fs';
import path from 'node:path';

import GeneratorBase from 'yeoman-generator';

import { buildDefaultCodexScaffold } from '../lib/defaults';
import type { TemplateContext } from '../lib/types';
import { buildSharedScaffold } from '../nextjs-add/lib/shared-scaffold';

interface AppGeneratorOptions extends GeneratorBase.GeneratorOptions {
  appName?: string;
}

interface AppPromptAnswers extends GeneratorBase.Answers {
  appName: string;
}

function normalizeAppName(input: unknown): string {
  const normalizedInput = typeof input === 'string' ? input : '';

  return normalizedInput
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDisplayName(input: unknown, fallback: string): string {
  const trimmed = (typeof input === 'string' ? input : '').trim();

  if (trimmed) {
    return trimmed;
  }

  return fallback
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

class AppGenerator extends GeneratorBase {
  declare options: GeneratorBase['options'] & AppGeneratorOptions;

  private rawAppName?: string;

  private appName!: string;

  private displayName!: string;

  constructor(args: string | string[], opts: AppGeneratorOptions) {
    super(args, opts);
    this.sourceRoot(path.join(__dirname, 'templates'));

    this.argument('appName', {
      type: String,
      required: false,
      description: 'Name of the Next.js application directory to generate.',
    });

    this.rawAppName = this.options.appName;
  }

  async prompting(): Promise<void> {
    if (this.options.appName) {
      return;
    }

    const answers = await this.prompt<AppPromptAnswers>([
      {
        type: 'input',
        name: 'appName',
        message: 'Application name',
        default: 'my-next-app',
        validate: (value) => {
          if (!normalizeAppName(value)) {
            return 'Enter a valid application name.';
          }

          return true;
        },
      },
    ]);

    this.rawAppName = answers.appName;
    this.options.appName = answers.appName;
  }

  configuring(): void {
    const providedName = this.rawAppName || this.options.appName;
    const normalizedAppName = normalizeAppName(providedName);

    if (!normalizedAppName) {
      throw new Error('A valid application name is required.');
    }

    const projectRoot = path.resolve(this.destinationRoot(), normalizedAppName);

    if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length > 0) {
      throw new Error(
        `Target directory "${normalizedAppName}" already exists and is not empty.`,
      );
    }

    this.appName = normalizedAppName;
    this.displayName = toDisplayName(providedName, normalizedAppName);
    this.destinationRoot(projectRoot);
  }

  writing(): void {
    const templateContext: TemplateContext = {
      appName: this.appName,
      appDisplayName: this.displayName,
    };

    const templateFiles = [
      ['package.json.ejs', 'package.json'],
      ['README.md.ejs', 'README.md'],
      ['tsconfig.json.ejs', 'tsconfig.json'],
      ['next.config.mjs.ejs', 'next.config.mjs'],
      ['jest.config.js.ejs', 'jest.config.js'],
      ['eslint.config.mjs.ejs', 'eslint.config.mjs'],
      ['prettier.config.js.ejs', 'prettier.config.js'],
      ['next-env.d.ts.ejs', 'next-env.d.ts'],
      ['_gitignore.ejs', '.gitignore'],
      ['src/pages/home/index.ts.ejs', 'src/pages/home/index.ts'],
      ['src/shared/config/index.ts.ejs', 'src/shared/config/index.ts'],
      ['src/shared/ui/index.ts.ejs', 'src/shared/ui/index.ts'],
      ['src/shared/api/index.ts.ejs', 'src/shared/api/index.ts'],
      ['src/shared/lib/index.ts.ejs', 'src/shared/lib/index.ts'],
      ['src/app/providers/index.ts.ejs', 'src/app/providers/index.ts'],
    ] as const;

    templateFiles.forEach(([from, to]) => {
      this.fs.copyTpl(
        this.templatePath(from),
        this.destinationPath(to),
        templateContext,
      );
    });

    const sharedScaffold = buildSharedScaffold(templateContext, {
      tailwind: false,
      auth: false,
      uiLibrary: false,
      redux: false,
      reactQuery: false,
      apollo: false,
      pwa: false,
    });

    Object.entries(sharedScaffold).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });

    Object.entries(buildDefaultCodexScaffold()).forEach(
      ([filePath, contents]) => {
        this.fs.write(this.destinationPath(filePath), contents);
      },
    );

    ['src/widgets', 'src/features', 'src/entities'].forEach((directory) => {
      fs.mkdirSync(this.destinationPath(directory), { recursive: true });
    });
  }

  end(): void {
    this.log('');
    this.log(`Base app scaffolded in ./${this.appName}`);
    this.log('Next steps:');
    this.log(`  cd ${this.appName}`);
    this.log('  npm install');
    this.log('  npm run dev');
  }
}

export = AppGenerator;
