import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'services/axios';
import * as Styled from './styled';

import ActiveUsersTable from './components/ActiveUsersTable';
import PendingAccessTable from './components/PendingAccessTable';

const ITEMS_PER_PAGE = 15;

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const limit = ITEMS_PER_PAGE;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'active' ? '/users' : '/users/search-targets';
        const response = await axios.get(endpoint, {
          params: {
            searchTerm,
            page: currentPage,
            limit
          }
        });

        if (response.data && response.data.rows) {
          setDataList(response.data.rows);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setDataList([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, searchTerm, currentPage]);

  const handleTabChange = (tab) => {
    setDataList([]);
    setSearchTerm('');
    setCurrentPage(1);
    setTotalPages(1);
    setConfirmDeleteId(null);
    setActiveTab(tab);
  };

  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`/users/${id}`);
      setDataList((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
    setConfirmDeleteId(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Styled.Container>
      <Styled.HeaderToolbar>
        <h1>User Management</h1>
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.Tabs>
          <Styled.TabButton
            $active={activeTab === 'active'}
            onClick={() => handleTabChange('active')}
          >
            Active Users
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
            placeholder={activeTab === 'active' ? "Search by email..." : "Search by name, email or CPF..."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Styled.SearchInput>
      </Styled.ControlsArea>

      {loading ? (
        <Styled.NoResultsMessage>Loading records...</Styled.NoResultsMessage>
      ) : dataList.length === 0 ? (
        <Styled.NoResultsMessage>No records found.</Styled.NoResultsMessage>
      ) : activeTab === 'active' ? (
        <ActiveUsersTable
          dataList={dataList}
          currentPage={currentPage}
          limit={limit}
          confirmDeleteId={confirmDeleteId}
          handleDeleteAsk={handleDeleteAsk}
          handleDelete={handleDelete}
        />
      ) : (
        <PendingAccessTable dataList={dataList} currentPage={currentPage} limit={limit} />
      )}

      {dataList.length > 0 && (
        <Styled.PaginationArea>
          <Styled.PageButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
          >
            <FaChevronLeft size={14} /> Prev
          </Styled.PageButton>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Styled.PageButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
          >
            Next <FaChevronRight size={14} />
          </Styled.PageButton>
        </Styled.PaginationArea>
      )}
    </Styled.Container>
  );
}
