/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const React = require('react');
const eui = require('@elastic/eui');

const mockedEui = {
  ...eui,
  EuiPortal: props => <div>{props.children}</div>,
};

module.exports = mockedEui;
