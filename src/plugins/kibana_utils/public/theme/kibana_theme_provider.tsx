/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiThemeProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import useObservable from 'react-use/lib/useObservable';
import type { Observable } from 'rxjs';

import type { CoreTheme } from '@kbn/core/public';
import { getColorMode } from './utils';

interface KibanaThemeProviderProps {
  theme$: Observable<CoreTheme>;
}

const defaultTheme: CoreTheme = {
  darkMode: false,
};

const emotionCache = createCache({
  key: 'eui-styles',
  container: document.querySelector(`meta[name="eui-styles-global"]`) as HTMLElement,
});

/**
 * Copied from the `kibana_react` plugin, to avoid cyclical dependency
 */
export const KibanaThemeProvider: FC<KibanaThemeProviderProps> = ({ theme$, children }) => {
  const theme = useObservable(theme$, defaultTheme);
  const colorMode = useMemo(() => getColorMode(theme), [theme]);
  return (
    <EuiThemeProvider colorMode={colorMode} cache={emotionCache}>
      {children}
    </EuiThemeProvider>
  );
};
