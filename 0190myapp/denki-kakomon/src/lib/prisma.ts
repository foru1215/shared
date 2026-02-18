// Prisma Client singleton (lazy-loaded)
// Currently not used by any page/component, but prepared for API routes.
// Prisma v7 generated client requires ESM context, so we use dynamic import.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prismaInstance: any = null;

export async function getPrisma() {
    if (!prismaInstance) {
        // Dynamic import to avoid build-time issues with Prisma v7 ESM
        const mod = await import('@/generated/prisma/client');
        const client = new (mod.PrismaClient as any)();
        prismaInstance = client;
    }
    return prismaInstance;
}
