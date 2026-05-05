import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import * as actions from 'store/modules/staff/actions';
import Loading from 'components/Loading';

import {ITEMS_PER_PAGE, VIEW_MODES, INITIAL_SEARCH_STATE} from './constants.js';
import * as Styled from './styled.js';

import StaffGrid from './components/StaffGrid.js';
import StaffTable from './components/StaffTable.js';

export default function Staff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { staff = [], totalPages = 1, isLoading = false } = useSelector((state) => state.staff || {});
  const { isLoggedIn = false } = useSelector((state) => state.auth || {});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(INITIAL_SEARCH_STATE);
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [currentPage, setCurrentPage] = useState(1);
  const [animationParent] = useAutoAnimate();
  const limit = ITEMS_PER_PAGE;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(
        actions.getStaffRequest({
          page: currentPage,
        })
      );
    }
  }, [isLoggedIn, currentPage, navigate, dispatch]);

  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteStaffRequest(id));
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

  const filteredStaff = staff.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = (member.full_name || '').toLowerCase();
    const jobTitle = (member.job_title || '').toLowerCase();
    const email = (member.email || '').toLowerCase();
    const status = (member.status || '').toLowerCase();

    return (
      fullName.includes(searchLower) ||
      jobTitle.includes(searchLower) ||
      email.includes(searchLower) ||
      status.includes(searchLower) ||
      (member.cpf && member.cpf.includes(searchLower))
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />
      <Styled.HeaderToolbar>
        <h1>Staff Members</h1>
        <Styled.NewStaffLink to="/staff/create">Add Member</Styled.NewStaffLink>
      </Styled.HeaderToolbar>
      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Styled.SearchInput>
        <Styled.ViewToggle>
          <Styled.ToggleButton
            $active={viewMode === VIEW_MODES.TABLE}
            onClick={() => setViewMode(VIEW_MODES.TABLE)}
          >
            <FaList size={18} />
          </Styled.ToggleButton>
          <Styled.ToggleButton
            $active={viewMode === VIEW_MODES.GRID}
            onClick={() => setViewMode(VIEW_MODES.GRID)}
          >
            <FaTh size={18} />
          </Styled.ToggleButton>
        </Styled.ViewToggle>
      </Styled.ControlsArea>
      {filteredStaff.length === 0 ? (
        <Styled.NoResultsMessage>No staff members found.</Styled.NoResultsMessage>
      ) : viewMode === VIEW_MODES.GRID ? (
        <StaffGrid
          staff={filteredStaff}
          animationParent={animationParent}
          confirmDeleteId={confirmDeleteId}
          handleDeleteAsk={handleDeleteAsk}
          handleDelete={handleDelete}
        />
      ) : (
        <StaffTable
          staff={filteredStaff}
          animationParent={animationParent}
          confirmDeleteId={confirmDeleteId}
          handleDeleteAsk={handleDeleteAsk}
          handleDelete={handleDelete}
          currentPage={currentPage}
          limit={limit}
        />
      )}
      <Styled.PaginationArea>
        <Styled.PageButton onClick={handlePreviousPage} disabled={currentPage === 1 || isLoading}>
          <FaChevronLeft size={14} /> Prev
        </Styled.PageButton>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Styled.PageButton onClick={handleNextPage} disabled={currentPage === totalPages || isLoading}>
          Next <FaChevronRight size={14} />
        </Styled.PageButton>
      </Styled.PaginationArea>
    </Styled.Container>
  );
}
