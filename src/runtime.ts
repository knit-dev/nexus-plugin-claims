import { plugin as schemaPlugin } from '@nexus/schema'

export const plugin = (settings: any) => (project: any) => {
  return {
    context: {
      create: (_req: any) => {
        return {}
      },
      typeGen: {
        fields: {
          userClaims: `any | null`,
        },
      },
    },
    schema: {
      plugins: [
        schemaPlugin({
          name: 'Nexus Schema Claims Plugin',
          onCreateFieldResolver(config) {
            return async (root, args, ctx, info, next) => {
              if (!ctx) {
                ctx = {}
              }

              const authenticationId = ctx?.token?.sub

              if (!ctx.userClaims && authenticationId) {
                const user = await ctx.db.user.findOne({
                  where: {
                    authenticationId,
                  },
                  include: {
                    claims: {
                      select: {
                        type: true,
                        value: true,
                      },
                    },
                  },
                })

                if (user && user.claims) {
                  ctx.userClaims = user.claims
                }
              }

              return await next(root, args, ctx, info)
            }
          },
        }),
      ],
    },
  }
}
