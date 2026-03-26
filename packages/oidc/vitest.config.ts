// @ts-expect-error shared vitest config is published without local type metadata
import { vitestConfig } from '@batoanng/vite-config';
import { mergeConfig } from 'vite';

export default mergeConfig(vitestConfig, {});
