import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../lib/prisma";
import { resourceSchema } from "../schemas/resourceSchema";

export const resourceControllers = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const parcedResource = resourceSchema.safeParse(request.body);

    if (!parcedResource.success) {
      return reply.status(500).send({ error: parcedResource.error.errors });
    }

    const resource = parcedResource.data;

    try {
      const addedResource = await db.resource.create({
        data: {
          name: resource.name,
          audioPath: resource.audioPath,
          videoUrl: resource.videoUrl || "",
          tags: {
            connectOrCreate:
              resource.tags?.map((tag) => ({
                where: { name: tag.name },
                create: { name: tag.name },
              })) || [],
          },
        },
      });

      return reply.send({
        message: "Resource created.",
        addedResource,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },
  addSubtitle: async (request: FastifyRequest, reply: FastifyReply) => {},
};
