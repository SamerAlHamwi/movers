import React, { useEffect, useRef, useState } from 'react';
import { FilterIcon } from 'components/common/icons/FilterIcon';
import { SearchOverlay } from './searchOverlay/SearchOverlay/SearchOverlay';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { CategoryComponents } from '@app/components/header/components/HeaderSearch/HeaderSearch';
import { Btn, InputSearch } from '../HeaderSearch/HeaderSearch.styles';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
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
      {/* <Dropdown
        {...((!!data || isFilterVisible) && { trigger: ['click'], onVisibleChange: setOverlayVisible })}
        overlayClassName="search-dropdown"
        overlay={<SearchOverlay data={data} isFilterVisible={isFilterVisible} />}
        open={isOverlayVisible}
        getPopupContainer={() => ref.current}
      > */}
      <HeaderActionWrapper>
        <InputSearch
          width="100%"
          value={query}
          placeholder={t('header.search')}
          // filter={
          //   <Btn
          //     size="small"
          //     type={isFilterVisible ? 'ghost' : 'text'}
          //     aria-label="Filter"
          //     icon={<FilterIcon />}
          //     onClick={() => setFilterActive(!isFilterVisible)}
          //   />
          // }
          onChange={handleSearchChange}
          enterButton={null}
          addonAfter={null}
        />
        <div ref={ref} />
      </HeaderActionWrapper>
      {/* </Dropdown> */}
    </>
  );
};
