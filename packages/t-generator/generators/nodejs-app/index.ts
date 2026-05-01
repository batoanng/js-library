import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import GeneratorBase, { type BaseOptions, type PromptAnswers, type PromptQuestion } from 'yeoman-generator';

import { buildDefaultCodexScaffold } from '../lib/defaults';
import type { NodeArchitecture, NodeServerTemplateContext } from './lib/types';
import { buildNodeServerArchitectureScaffold } from './lib/architecture-scaffold';
import {
  buildNodeServerPackageJson,
  buildNodeServerSharedScaffold,
} from './lib/shared-scaffold';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type NodeAppGeneratorOptions = BaseOptions & {
  appName?: string;
  architecture?: NodeArchitecture;
};

interface AppPromptAnswers extends PromptAnswers {
  appName: string;
  architecture: NodeArchitecture;
}

const ARCHITECTURE_CHOICES = [
  {
    name: 'Clean Architecture',
    value: 'clean',
    hint: 'Separates domain, use cases, infrastructure, and interfaces.',
  },
  {
    name: 'MVP',
    value: 'mvp',
    hint: 'Uses a lean controller/service/repository module structure.',
  },
] as const;

function normalizeAppName(input: unknown): string {
  const normalizedInput = typeof input === 'string' ? input : '';

  return normalizedInput
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeArchitecture(input: unknown): NodeArchitecture | null {
  if (input === 'clean' || input === 'mvp') {
    return input;
  }

  return null;
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

function toArchitectureLabel(architecture: NodeArchitecture): string {
  return architecture === 'clean' ? 'Clean Architecture' : 'MVP';
}

class NodeAppGenerator extends GeneratorBase {
  declare options: GeneratorBase['options'] & NodeAppGeneratorOptions;

  private rawAppName?: string;

  private appName!: string;

  private displayName!: string;

  private architecture!: NodeArchitecture;

  constructor(args: string | string[], opts: NodeAppGeneratorOptions) {
    super(Array.isArray(args) ? args : [args], opts);
    this.sourceRoot(path.join(__dirname, 'templates'));

    this.argument('appName', {
      type: String,
      required: false,
      description: 'Name of the Node.js application directory to generate.',
    });

    this.option('architecture', {
      type: String,
      description: 'Architecture to generate: clean or mvp.',
    });

    this.rawAppName = this.options.appName;
  }

  async prompting(): Promise<void> {
    const prompts: PromptQuestion<AppPromptAnswers>[] = [];

    if (!this.options.appName) {
      prompts.push({
        type: 'input',
        name: 'appName',
        message: 'Node.js application name',
        default: 'my-nodejs-server',
        validate: (value: unknown) => {
          if (!normalizeAppName(value)) {
            return 'Enter a valid application name.';
          }

          return true;
        },
      });
    }

    if (!normalizeArchitecture(this.options.architecture)) {
      prompts.push({
        type: 'select',
        name: 'architecture',
        message: 'Node.js server architecture',
        choices: ARCHITECTURE_CHOICES,
        default: 'clean',
      });
    }

    if (prompts.length === 0) {
      return;
    }

    const answers = await this.prompt<AppPromptAnswers>(prompts);

    if (answers.appName) {
      this.rawAppName = answers.appName;
      this.options.appName = answers.appName;
    }

    if (answers.architecture) {
      this.options.architecture = answers.architecture;
    }
  }

  configuring(): void {
    const providedName = this.rawAppName || this.options.appName;
    const normalizedAppName = normalizeAppName(providedName);
    const architecture = normalizeArchitecture(this.options.architecture);

    if (!normalizedAppName) {
      throw new Error('A valid application name is required.');
    }

    if (!architecture) {
      throw new Error('A valid architecture is required.');
    }

    const projectRoot = path.resolve(this.destinationRoot(), normalizedAppName);

    if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length > 0) {
      throw new Error(
        `Target directory "${normalizedAppName}" already exists and is not empty.`,
      );
    }

    this.appName = normalizedAppName;
    this.displayName = toDisplayName(providedName, normalizedAppName);
    this.architecture = architecture;
    this.destinationRoot(projectRoot);
  }

  writing(): void {
    const templateContext: NodeServerTemplateContext = {
      appName: this.appName,
      appDisplayName: this.displayName,
      architecture: this.architecture,
      architectureLabel: toArchitectureLabel(this.architecture),
    };

    const templateFiles = [
      ['README.md.ejs', 'README.md'],
      ['Dockerfile.ejs', 'Dockerfile'],
      ['tsconfig.json.ejs', 'tsconfig.json'],
      ['tsconfig.test.json.ejs', 'tsconfig.test.json'],
      ['jest.config.js.ejs', 'jest.config.js'],
      ['eslint.config.mjs.ejs', 'eslint.config.mjs'],
      ['nodemon.json.ejs', 'nodemon.json'],
      ['prettier.config.cjs.ejs', 'prettier.config.cjs'],
      ['_gitignore.ejs', '.gitignore'],
    ] as const;

    templateFiles.forEach(([from, to]) => {
      this.fs.copyTpl(
        this.templatePath(from),
        this.destinationPath(to),
        templateContext,
      );
    });

    this.fs.write(
      this.destinationPath('package.json'),
      `${JSON.stringify(
        buildNodeServerPackageJson(templateContext, {
          graphql: false,
          queue: false,
          cache: false,
          llm: false,
        }),
        null,
        2,
      )}\n`,
    );

    const sharedScaffold = buildNodeServerSharedScaffold(templateContext, {
      graphql: false,
      queue: false,
      cache: false,
      llm: false,
    });

    Object.entries(sharedScaffold).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });

    const architectureScaffold = buildNodeServerArchitectureScaffold(
      templateContext,
      {
        graphql: false,
        queue: false,
        cache: false,
        llm: false,
      },
    );

    Object.entries(architectureScaffold).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });

    Object.entries(buildDefaultCodexScaffold()).forEach(
      ([filePath, contents]) => {
        this.fs.write(this.destinationPath(filePath), contents);
      },
    );

  }

  end(): void {
    const prePushHookPath = this.destinationPath('.husky/pre-push');

    if (fs.existsSync(prePushHookPath)) {
      fs.chmodSync(prePushHookPath, 0o755);
    }

    this.log('');
    this.log(
      `Node.js ${toArchitectureLabel(this.architecture)} scaffolded in ./${this.appName}`,
    );
    this.log('Next steps:');
    this.log(`  cd ${this.appName}`);
    this.log('  npm install');
    this.log('  npm run dev');
  }
}

export default NodeAppGenerator;
