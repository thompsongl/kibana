/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ListsPluginRouter } from '../types';
import { EXCEPTION_LIST_URL } from '../../common/constants';
import { buildRouteValidation, buildSiemResponse, transformError } from '../siem_server_deps';
import { validate } from '../../common/shared_imports';
import {
  DeleteExceptionListSchemaDecoded,
  deleteExceptionListSchema,
  exceptionListSchema,
} from '../../common/schemas';

import { getErrorMessageExceptionList, getExceptionListClient } from './utils';

export const deleteExceptionListRoute = (router: ListsPluginRouter): void => {
  router.delete(
    {
      options: {
        tags: ['access:lists-all'],
      },
      path: EXCEPTION_LIST_URL,
      validate: {
        query: buildRouteValidation<
          typeof deleteExceptionListSchema,
          DeleteExceptionListSchemaDecoded
        >(deleteExceptionListSchema),
      },
    },
    async (context, request, response) => {
      const siemResponse = buildSiemResponse(response);
      try {
        const exceptionLists = getExceptionListClient(context);
        const { list_id: listId, id, namespace_type: namespaceType } = request.query;
        if (listId == null && id == null) {
          return siemResponse.error({
            body: 'Either "list_id" or "id" needs to be defined in the request',
            statusCode: 400,
          });
        } else {
          const deleted = await exceptionLists.deleteExceptionList({
            id,
            listId,
            namespaceType,
          });
          if (deleted == null) {
            return siemResponse.error({
              body: getErrorMessageExceptionList({ id, listId }),
              statusCode: 404,
            });
          } else {
            const [validated, errors] = validate(deleted, exceptionListSchema);
            if (errors != null) {
              return siemResponse.error({ body: errors, statusCode: 500 });
            } else {
              return response.ok({ body: validated ?? {} });
            }
          }
        }
      } catch (err) {
        const error = transformError(err);
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode,
        });
      }
    }
  );
};
