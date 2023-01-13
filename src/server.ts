import http, { RequestListener } from "node:http";

export type ServerOptions = {
  port?: number;
};

export const createServer = async (options: ServerOptions = {}) => {
  const port = options.port ?? 3000;

  const handler: RequestListener = (req, res) => {
    console.log(`incoming ${req.method} request on url="${req.url}"`);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        data: "Hello 🌎!",
      })
    );
  };

  const start = async (listen: boolean) => {
    try {
      const server = await http.createServer(handler);
      if (!listen) {
        return server;
      }
      await server.listen(port);
      console.log(`listening on port ${port} ...`);
      return server;
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  return { start, handler };
};
