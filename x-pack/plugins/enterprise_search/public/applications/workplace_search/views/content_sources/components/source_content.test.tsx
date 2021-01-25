/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import '../../../../__mocks__/shallow_useeffect.mock';

import { setMockValues, setMockActions } from '../../../../__mocks__';

import React from 'react';
import { shallow } from 'enzyme';

import {
  EuiTable,
  EuiButton,
  EuiButtonEmpty,
  EuiEmptyPrompt,
  EuiFieldSearch,
  EuiLink,
} from '@elastic/eui';

import { mockMeta } from '../../../__mocks__/meta.mock';
import { fullContentSources } from '../../../__mocks__/content_sources.mock';

import { DEFAULT_META } from '../../../../shared/constants';
import { ComponentLoader } from '../../../components/shared/component_loader';
import { Loading } from '../../../../../applications/shared/loading';
import { TablePaginationBar } from '../../../components/shared/table_pagination_bar';

import { SourceContent } from './source_content';

describe('SourceContent', () => {
  const setActivePage = jest.fn();
  const searchContentSourceDocuments = jest.fn();
  const resetSourceState = jest.fn();
  const setContentFilterValue = jest.fn();

  const mockValues = {
    contentSource: fullContentSources[0],
    contentMeta: mockMeta,
    contentItems: [
      {
        id: '1234',
        last_updated: '2021-01-21',
      },
      {
        id: '1235',
        last_updated: '2021-01-20',
      },
    ],
    contentFilterValue: '',
    dataLoading: false,
    sectionLoading: false,
    isOrganization: true,
  };

  beforeEach(() => {
    setMockActions({
      setActivePage,
      searchContentSourceDocuments,
      resetSourceState,
      setContentFilterValue,
    });
    setMockValues({ ...mockValues });
  });

  it('renders', () => {
    const wrapper = shallow(<SourceContent />);

    expect(wrapper.find(EuiTable)).toHaveLength(1);
  });

  it('returns Loading when loading', () => {
    setMockValues({ ...mockValues, dataLoading: true });
    const wrapper = shallow(<SourceContent />);

    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  it('returns ComponentLoader when section loading', () => {
    setMockValues({ ...mockValues, sectionLoading: true });
    const wrapper = shallow(<SourceContent />);

    expect(wrapper.find(ComponentLoader)).toHaveLength(1);
  });

  describe('empty states', () => {
    beforeEach(() => {
      setMockValues({ ...mockValues, contentMeta: DEFAULT_META });
    });
    it('renders', () => {
      setMockValues({ ...mockValues, contentMeta: DEFAULT_META });
      const wrapper = shallow(<SourceContent />);

      expect(wrapper.find(EuiEmptyPrompt)).toHaveLength(1);
      expect(wrapper.find(EuiEmptyPrompt).prop('body')).toBeTruthy();
      expect(wrapper.find(EuiEmptyPrompt).prop('title')).toEqual(
        <h2>This source doesn&apos;t have any content yet</h2>
      );
    });

    it('shows custom source docs link', () => {
      setMockValues({
        ...mockValues,
        contentMeta: DEFAULT_META,
        contentSource: {
          ...fullContentSources[0],
          serviceType: 'google',
        },
      });
      const wrapper = shallow(<SourceContent />);

      expect(wrapper.find(EuiEmptyPrompt).prop('body')).toBeNull();
    });

    it('shows correct message when filter value set', () => {
      setMockValues({ ...mockValues, contentMeta: DEFAULT_META, contentFilterValue: 'Elastic' });
      const wrapper = shallow(<SourceContent />);

      expect(wrapper.find(EuiEmptyPrompt).prop('title')).toEqual(
        <h2>No results for &apos;Elastic&apos;</h2>
      );
    });
  });

  it('handles page change', () => {
    const wrapper = shallow(<SourceContent />);
    const tablePager = wrapper.find(TablePaginationBar).first();
    tablePager.prop('onChangePage')(3);

    expect(setActivePage).toHaveBeenCalledWith(4);
  });

  it('clears filter value when reset', () => {
    setMockValues({
      ...mockValues,
      contentSource: {
        ...fullContentSources[0],
        isFederatedSource: true,
      },
    });
    const wrapper = shallow(<SourceContent />);
    const button = wrapper.find(EuiButtonEmpty);
    button.simulate('click');

    expect(setContentFilterValue).toHaveBeenCalledWith('');
  });

  it('sets filter value', () => {
    setMockValues({
      ...mockValues,
      contentSource: {
        ...fullContentSources[0],
        isFederatedSource: true,
      },
    });
    const wrapper = shallow(<SourceContent />);
    const input = wrapper.find(EuiFieldSearch);
    input.simulate('change', { target: { value: 'Query' } });
    const button = wrapper.find(EuiButton);
    button.simulate('click');

    expect(setContentFilterValue).toHaveBeenCalledWith('');
  });

  describe('URL field link', () => {
    it('does not render link when not linkable', () => {
      setMockValues({
        ...mockValues,
        contentSource: fullContentSources[1],
      });
      const wrapper = shallow(<SourceContent />);
      const fieldCell = wrapper.find('[data-test-subj="URLFieldCell"]');

      expect(fieldCell.find(EuiLink)).toHaveLength(0);
    });

    it('renders links when linkable', () => {
      const wrapper = shallow(<SourceContent />);
      const fieldCell = wrapper.find('[data-test-subj="URLFieldCell"]');

      expect(fieldCell.find(EuiLink)).toHaveLength(2);
    });
  });
});
