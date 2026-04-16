import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  Container, HeaderToolbar, ControlsArea, SearchInput, ViewToggle, ToggleButton,
  NoResultsMessage, NewStaffLink, PaginationArea, PageButton
} from './styled.js';
import * as actions from '../../store/modules/staff/actions';
import Loading from '../../components/Loading';
import StaffGrid from './components/StaffGrid.js';
import StaffTable from './components/StaffTable.js';

export default function Staff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    staff = [],
    totalPages = 1,
    isLoading = false
  } = useSelector(state => state.staff || {});

  const { isLoggedIn = false } = useSelector(state => state.auth || {});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [animationParent] = useAutoAnimate();
  const limit = 15;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(actions.getStaffRequest({
        page: currentPage,
        limit
      }));
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
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const filteredStaff = staff.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = (member.full_name || '').toLowerCase();
    const jobTitle = (member.job_title || '').toLowerCase();
    const email = (member.email || '').toLowerCase();

    return (
      fullName.includes(searchLower) ||
      jobTitle.includes(searchLower) ||
      email.includes(searchLower) ||
      (member.cpf && member.cpf.includes(searchLower))
    );
  });

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <HeaderToolbar>
        <h1>Staff Members</h1>
        <NewStaffLink to="/staff/create">Add Member</NewStaffLink>
      </HeaderToolbar>

      <ControlsArea>
        <SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search by name, job title or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <ViewToggle>
          <ToggleButton $active={!isGridView} onClick={() => setIsGridView(false)}>
            <FaList size={18} />
          </ToggleButton>
          <ToggleButton $active={isGridView} onClick={() => setIsGridView(true)}>
            <FaTh size={18} />
          </ToggleButton>
        </ViewToggle>
      </ControlsArea>

      {filteredStaff.length === 0
        ? <NoResultsMessage>No staff members found.</NoResultsMessage>
        : isGridView
          ? <StaffGrid
              staff={filteredStaff}
              animationParent={animationParent}
              confirmDeleteId={confirmDeleteId}
              handleDeleteAsk={handleDeleteAsk}
              handleDelete={handleDelete}
            />
          : <StaffTable
              staff={filteredStaff}
              animationParent={animationParent}
              confirmDeleteId={confirmDeleteId}
              handleDeleteAsk={handleDeleteAsk}
              handleDelete={handleDelete}
              currentPage={currentPage}
              limit={limit}
            />
      }

      <PaginationArea>
        <PageButton onClick={handlePreviousPage} disabled={currentPage === 1 || isLoading}>
          <FaChevronLeft size={14} /> Prev
        </PageButton>
        <span>Page {currentPage} of {totalPages}</span>
        <PageButton onClick={handleNextPage} disabled={currentPage === totalPages || isLoading}>
          Next <FaChevronRight size={14} />
        </PageButton>
      </PaginationArea>
    </Container>
  );
}
