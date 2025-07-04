export interface FullPageLoaderProps {
  /**
   * Determines if the loader should block the whole page.
   */
  fullPage?: boolean;
}

export interface LoaderProps extends FullPageLoaderProps {
  /**
   * A label to show under the loading spinner. Defaults to 'Loading...'.
   */
  label?: string;

  /**
   * Disables the loader when `true`. Defaults to `false`.
   */
  inactive?: boolean;
}
