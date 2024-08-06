import Fastify from "fastify";
import cors from "@fastify/cors";
import { resourceRoutes } from "./routes/resourceRoutes";

const server = Fastify({
  logger: true,
});

server.register(cors);
server.register(resourceRoutes);

const port = 3000;

server.listen({ port: port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`Server running at ${address}`);
});
