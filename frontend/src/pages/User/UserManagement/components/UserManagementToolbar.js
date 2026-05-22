import React from 'react';
import { FaSearch, FaListUl, FaTh } from 'react-icons/fa';
import * as Styled from '../styled';

export default function UserManagementToolbar({
  activeTab,
  handleTabChange,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  viewMode,
  setViewMode,
}) {
  return (
    <Styled.ControlsArea>
      <Styled.Tabs>
        <Styled.TabButton
          $active={activeTab === 'active'}
          onClick={() => handleTabChange('active')}
        >
          Active Users
        </Styled.TabButton>
        <Styled.TabButton
          $active={activeTab === 'inactive'}
          onClick={() => handleTabChange('inactive')}
        >
          Inactive Users
        </Styled.TabButton>
        <Styled.TabButton
          $active={activeTab === 'pending'}
          onClick={() => handleTabChange('pending')}
        >
          Pending Access
        </Styled.TabButton>
      </Styled.Tabs>
      <Styled.SearchInput>
        <FaSearch />
        <input
          type="text"
          placeholder={
            activeTab !== 'pending'
              ? 'Search by email...'
              : 'Search by name, email or CPF...'
          }
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Styled.SearchInput>
      <Styled.ViewToggle>
        <Styled.ToggleButton
          $active={viewMode === 'table'}
          onClick={() => setViewMode('table')}
          title="Table View"
        >
          <FaListUl size={18} />
        </Styled.ToggleButton>
        <Styled.ToggleButton
          $active={viewMode === 'grid'}
          onClick={() => setViewMode('grid')}
          title="Grid View"
        >
          <FaTh size={18} />
        </Styled.ToggleButton>
      </Styled.ViewToggle>
    </Styled.ControlsArea>
  );
}
