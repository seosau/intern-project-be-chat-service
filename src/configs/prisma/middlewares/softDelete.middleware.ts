// import { Prisma } from "@prisma/client";

// export const softDeleteMiddleware: Prisma.Middleware = async(params, next) => {
//     const modelsWithSOftDelete = ['story', 'post', 'user'];

//     if(params.model && modelsWithSOftDelete.includes(params.model)) {
//         if(params.action === 'delete') {
//             params.action = 'update'
//             params.args['data'] = {deletedAt: new Date()}
//         }
//         if(params.action === 'deleteMany'){
//             params.action = 'updateMany'
//             if(!params.args.data) params.args.data = {}
//             params.args.data.deletedAt = new Date()
//         }
//         if(params.action === 'findMany') {
//             if(!params.args.where) params.args.where = {}
//             params.args.where.deletedAt = null
//         }
//         if(params.action === 'findFirst') {
//             if(!params.args.where) params.args.where = {}
//             params.args.where.deletedAt = null
//         }
//     }

//     return next(params)
// }

import { Prisma } from "@prisma/client";

export const softDeleteMiddleware = async (params, next) => {
  const modelsWithSoftDelete = ['story', 'post', 'user'];

  if (params.model && modelsWithSoftDelete.includes(params.model)) {
    // Soft delete: override delete to update
    if (params.action === 'delete') {
      params.action = 'update';
      params.args = {
        ...params.args,
        data: {
          ...(params.args?.data || {}),
          deletedAt: new Date(),
        },
      };
    }

    // Soft delete many
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args = {
        ...params.args,
        data: {
          ...(params.args?.data || {}),
          deletedAt: new Date(),
        },
      };
    }

    // Filter deleted in findMany / findFirst / findUnique
    if (['findMany', 'findFirst', 'findUnique'].includes(params.action)) {
      params.args = {
        ...params.args,
        where: {
          ...(params.args?.where || {}),
          deletedAt: null,
        },
      };
    }
  }

  return next(params);
};
