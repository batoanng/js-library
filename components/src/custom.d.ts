import 'react-use';

declare module 'react-use' {
  type AsyncState<T> =
    | {
        loading: boolean;
        error?: undefined;
        value?: undefined;
      }
    | {
        loading: true;
        error?: Error | undefined;
        value?: T;
      }
    | {
        loading: false;
        error: Error;
        value?: undefined;
      }
    | {
        loading: false;
        error?: undefined;
        value: T;
      };
}

declare module '*.mdx' {
  const content: string;
  export default content;
}
