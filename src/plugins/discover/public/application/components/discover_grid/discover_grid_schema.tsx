/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { EuiCodeBlock, EuiDataGridPopoverContents } from '@elastic/eui';
import { geoPoint, kibanaJSON } from './constants';
import { KBN_FIELD_TYPES } from '../../../../../data/common';

export function getSchemaByKbnType(kbnType: string | undefined) {
  // Default DataGrid schemas: boolean, numeric, datetime, json, currency, string
  switch (kbnType) {
    case KBN_FIELD_TYPES.IP:
    case KBN_FIELD_TYPES.GEO_SHAPE:
    case KBN_FIELD_TYPES.NUMBER:
      return 'numeric';
    case KBN_FIELD_TYPES.BOOLEAN:
      return 'boolean';
    case KBN_FIELD_TYPES.STRING:
      return 'string';
    case KBN_FIELD_TYPES.DATE:
      return 'datetime';
    case KBN_FIELD_TYPES.GEO_POINT:
      return geoPoint;
    default:
      return kibanaJSON;
  }
}

export function getSchemaDetectors() {
  return [
    {
      type: kibanaJSON,
      detector() {
        return 0; // this schema is always explicitly defined
      },
      sortTextAsc: '',
      sortTextDesc: '',
      icon: '',
      color: '',
    },
    {
      type: geoPoint,
      detector() {
        return 0; // this schema is always explicitly defined
      },
      sortTextAsc: '',
      sortTextDesc: '',
      icon: 'tokenGeo',
    },
  ];
}

/**
 * Returns custom popover content for certain schemas
 */
export function getPopoverContents(): EuiDataGridPopoverContents {
  return {
    [geoPoint]: ({ children }) => {
      return <span className="geo-point">{children}</span>;
    },
    [kibanaJSON]: ({ children }) => {
      return (
        <EuiCodeBlock isCopyable language="json" paddingSize="none" transparentBackground={true}>
          {children}
        </EuiCodeBlock>
      );
    },
  };
}
