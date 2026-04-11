import config from '@batoanng/eslint-config';
import tailwind from '@batoanng/eslint-config/tailwind';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

export default [...config, ...typed, ...tailwind, ...test];
