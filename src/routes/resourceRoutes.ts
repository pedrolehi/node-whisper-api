import { FastifyInstance } from "fastify";
import { resourceControllers } from "../controllers/resourceControllers";

export async function resourceRoutes(server: FastifyInstance) {
  server.post("/resources", resourceControllers.create);
}
