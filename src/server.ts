import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Payments Gateway listening on http://localhost:${env.port}`);
});
