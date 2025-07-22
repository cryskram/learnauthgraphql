import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    items: async () => {
      return await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
    },
    item: async (_: any, { id }: { id: string }) => {
      return await prisma.item.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createItem: async (
      _: any,
      {
        name,
        description,
        imageUrl,
      }: { name: string; description: string; imageUrl: string }
    ) => {
      const item = await prisma.item.create({
        data: {
          name,
          description,
          imageUrl,
        },
      });

      return item;
    },

    deleteItem: async (_: any, { id }: { id: string }) => {
      return await prisma.item.delete({ where: { id } });
    },
  },
};
