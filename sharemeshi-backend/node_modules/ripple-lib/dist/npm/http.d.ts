declare function createHTTPServer(options: any, httpPort: any): {
    server: any;
    start: () => Promise<{}>;
    stop: () => Promise<{}>;
};
export { createHTTPServer };
