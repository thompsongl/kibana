/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// return window if it exists, otherwise just return an object literal
const windowObj = {
  location: null,
  localStorage: {} as Window['localStorage'],
  sessionStorage: {} as Window['sessionStorage'],
  innerWidth: 0,
  innerHeight: 0,
  addEventListener: () => {},
  removeEventListener: () => {},
};

export const getWindow = (): Window | typeof windowObj => {
  return typeof window === 'undefined' ? windowObj : window;
};
