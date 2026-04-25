declare module '*.mdx' {
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  const ReactComponent: import('react').FunctionComponent<
    import('react').SVGProps<SVGSVGElement>
  >;
  export default ReactComponent;
}
