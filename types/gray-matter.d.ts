declare module 'gray-matter' {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    orig: string;
    language: string;
    matter: string;
    stringify(data?: T): string;
  }
  interface GrayMatterOption {
    engines?: Record<string, (input: string) => any>;
    language?: string;
    delimiters?: string | [string, string];
  }
  function matter<T = any>(input: string, options?: GrayMatterOption): GrayMatterFile<T>;
  export = matter;
}
