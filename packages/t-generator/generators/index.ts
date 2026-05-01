import path from 'node:path';
import { fileURLToPath } from 'node:url';

import GeneratorBase, { type PromptAnswers } from 'yeoman-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RootPromptAnswers extends PromptAnswers {
  stack: 'react' | 'nextjs' | 'nestjs' | 'nodejs';
  action: 'create-base' | 'add-feature';
}

const STACK_CHOICES = [
  {
    name: 'React',
    value: 'react',
    hint: 'Generate or extend a React + Vite application.',
  },
  {
    name: 'Next.js',
    value: 'nextjs',
    hint: 'Generate or extend a Next.js App Router application.',
  },
  {
    name: 'NestJS',
    value: 'nestjs',
    hint: 'Generate or extend a lean NestJS server.',
  },
  {
    name: 'Node.js',
    value: 'nodejs',
    hint: 'Generate or extend an Express + Prisma Node.js server.',
  },
] as const;

const ACTION_CHOICES = [
  {
    name: 'Create base project',
    value: 'create-base',
    hint: 'Scaffold a new generated base project.',
  },
  {
    name: 'Add feature to existing project',
    value: 'add-feature',
    hint: 'Extend an already generated project from its root directory.',
  },
] as const;

class RootGenerator extends GeneratorBase {
  private stack!: RootPromptAnswers['stack'];

  private action!: RootPromptAnswers['action'];

  async prompting(): Promise<void> {
    const answers = await this.prompt<RootPromptAnswers>([
      {
        type: 'select',
        name: 'stack',
        message: 'What do you want to work on?',
        choices: STACK_CHOICES,
      },
      {
        type: 'select',
        name: 'action',
        message: 'What should the generator do?',
        choices: ACTION_CHOICES,
      },
    ]);

    this.stack = answers.stack;
    this.action = answers.action;
  }

  async default(): Promise<void> {
    const namespace = this.action === 'create-base'
      ? `${this.stack}-app`
      : `${this.stack}-add`;
    const generatorExtension = path.extname(__filename) === '.ts' ? '.ts' : '.js';

    await this.composeWith(path.join(__dirname, namespace, `index${generatorExtension}`));
  }
}

export default RootGenerator;
