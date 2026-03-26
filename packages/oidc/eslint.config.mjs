import config from '@batoanng/eslint-config';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

export default [...config, ...typed, ...test];
