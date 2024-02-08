import app from "./src/app";
import { config } from "./src/config/config";

app.ready((err) => {
  if (err) throw err;

  // Start listening for requests
  app.listen(
    { port: Number(config.env.app.port), host: config.env.app.host },
    (err: Error | null, address: string) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Server running on ${address}`);
    }
  );
});
