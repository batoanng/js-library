import path from 'node:path';

import GeneratorBase from 'yeoman-generator';

interface RootPromptAnswers extends GeneratorBase.Answers {
  stack: 'react' | 'nestjs' | 'nodejs';
  action: 'create-base' | 'add-feature';
}

const STACK_CHOICES = [
  {
    name: 'React',
    value: 'react',
    hint: 'Generate or extend a React + Vite application.',
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
        type: 'list',
        name: 'stack',
        message: 'What do you want to work on?',
        choices: STACK_CHOICES,
      },
      {
        type: 'list',
        name: 'action',
        message: 'What should the generator do?',
        choices: ACTION_CHOICES,
      },
    ]);

    this.stack = answers.stack;
    this.action = answers.action;
  }

  default(): void {
    const namespace = this.action === 'create-base'
      ? `${this.stack}-app`
      : `${this.stack}-add`;

    this.composeWith(path.join(__dirname, namespace));
  }
}

export = RootGenerator;
