import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    items: async () => {
      return await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
    },
    item: async (_: any, { id }: { id: string }) => {
      return await prisma.item.findUnique({ where: { id } });
    },
    users: async () => {
      return await prisma.user.findMany({
        include: { items: true },
      });
    },
  },

  Mutation: {
    createItem: async (
      _: any,
      {
        name,
        description,
        imageUrl,
        userId,
      }: { name: string; description: string; imageUrl: string; userId: string }
    ) => {
      const item = await prisma.item.create({
        data: {
          name,
          description,
          imageUrl,
          userId,
        },
      });

      return item;
    },

    deleteItem: async (_: any, { id }: { id: string }) => {
      return await prisma.item.delete({ where: { id } });
    },
  },
};
