import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'services/axios';
import * as Styled from './styled';

// Componentes
import UserManagementToolbar from './components/UserManagementToolbar.js';
import UsersView from './components/UsersView.js';
import PendingAccessView from './components/PendingAccessView.js';
import ValidateAccessModal from './components/ValidateAccessModal.js';
import EditUserModal from './components/EditUserModal.js';

// Hooks
import useUsersData from './hooks/useUsersData';
import useUserActions from './hooks/useUserActions';

export default function UserManagement() {
  const [editingUser, setEditingUser] = useState(null);
  const [validatingTarget, setValidatingTarget] = useState(null);
  const [accessLevels, setAccessLevels] = useState([]);

  const {
    activeTab,
    searchTerm,
    setSearchTerm,
    dataList,
    setDataList,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    limit,
    handleTabChange,
    handleNextPage,
    handlePreviousPage,
    viewMode,
    setViewMode,
  } = useUsersData();

  const { handleSaveEdit, handleValidateSave } = useUserActions({
    setDataList,
    activeTab,
    setEditingUser,
    setValidatingTarget,
  });

  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        const response = await axios.get('/access-levels');
        setAccessLevels(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccessLevels();
  }, []);

  const renderContent = () => {
    if (loading) return <Styled.NoResultsMessage>Loading records...</Styled.NoResultsMessage>;
    if (dataList.length === 0) return <Styled.NoResultsMessage>No records found.</Styled.NoResultsMessage>;

    if (activeTab === 'pending') {
      return (
        <PendingAccessView
          dataList={dataList}
          currentPage={currentPage}
          limit={limit}
          onValidateClick={setValidatingTarget}
        />
      );
    }

    return (
      <UsersView
        dataList={dataList}
        currentPage={currentPage}
        limit={limit}
        onEditClick={setEditingUser}
        viewMode={viewMode}
      />
    );
  };

  return (
    <Styled.Container>
      <Styled.HeaderToolbar>
        <h1>User Management</h1>
      </Styled.HeaderToolbar>

      <UserManagementToolbar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {renderContent()}

      {dataList.length > 0 && (
        <Styled.PaginationArea>
          <Styled.PageButton onClick={handlePreviousPage} disabled={currentPage === 1 || loading}>
            <FaChevronLeft size={14} /> Prev
          </Styled.PageButton>
          <span>Page {currentPage} of {totalPages}</span>
          <Styled.PageButton onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
            Next <FaChevronRight size={14} />
          </Styled.PageButton>
        </Styled.PaginationArea>
      )}

      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        accessLevels={accessLevels}
        onSave={handleSaveEdit}
      />

      <ValidateAccessModal
        isOpen={!!validatingTarget}
        onClose={() => setValidatingTarget(null)}
        target={validatingTarget}
        accessLevels={accessLevels}
        onSave={handleValidateSave}
      />
    </Styled.Container>
  );
}
