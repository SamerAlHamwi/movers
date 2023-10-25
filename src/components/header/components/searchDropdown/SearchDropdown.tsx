import React, { useEffect, useRef, useState } from 'react';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { CategoryComponents } from '@app/components/header/components/HeaderSearch/HeaderSearch';
import { InputSearch } from '../HeaderSearch/HeaderSearch.styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSearchString } from '@app/store/slices/searchSlice';

interface SearchOverlayProps {
  query: string;
  setQuery: (query: string) => void;
  data: CategoryComponents[] | null;
  isOverlayVisible: boolean;
  setOverlayVisible: (state: boolean) => void;
}

export const SearchDropdown: React.FC<SearchOverlayProps> = ({
  query,
  setQuery,
  data,
  isOverlayVisible,
  setOverlayVisible,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSearchChange = (event: any) => {
    const searchString = event.target.value;
    dispatch(setSearchString(searchString));
    setQuery(searchString);
  };

  const [isFilterVisible, setFilterActive] = useState(false);

  useEffect(() => {
    setOverlayVisible(!!query || isFilterVisible);
  }, [query, isFilterVisible, setOverlayVisible]);

  const ref = useRef<any>(null);

  return (
    <>
      <HeaderActionWrapper>
        <InputSearch
          width="100%"
          value={query}
          placeholder={t('header.search')}
          onChange={handleSearchChange}
          enterButton={null}
          addonAfter={null}
        />
        <div ref={ref} />
      </HeaderActionWrapper>
    </>
  );
};
