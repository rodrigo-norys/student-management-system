import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Loading from '../../components/Loading';
import GuardianGrid from './components/GuardianGrid.js';
import GuardianTable from './components/GuardianTable.js';

import * as actions from '../../store/modules/guardian/actions';

import {
  Container, HeaderToolbar, ControlsArea, SearchInput, ViewToggle, ToggleButton,
  NoResultsMessage, NewGuardianLink, PaginationArea, PageButton
} from './styled.js';

export default function Guardians() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    guardians = [],
    totalPages = 1,
    isLoading = false
  } = useSelector(state => state.guardian || {});

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
      dispatch(actions.getGuardiansRequest({
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
    dispatch(actions.deleteGuardianRequest(id));
    setConfirmDeleteId(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const filteredGuardians = guardians.filter(guardian => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${guardian.name} ${guardian.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      guardian.is_active.toLowerCase().includes(searchLower) ||
      guardian.email.toLowerCase().includes(searchLower) ||
      (guardian.phone && guardian.phone.includes(searchLower)) ||
      (guardian.cpf && guardian.cpf.includes(searchLower))
    );
  });

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <HeaderToolbar>
        <h1>Guardians</h1>
        <NewGuardianLink to="/guardian/create">Add Guardian</NewGuardianLink>
      </HeaderToolbar>

      <ControlsArea>
        <SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search guardians..."
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

      {filteredGuardians.length === 0
        ? <NoResultsMessage>No guardians found.</NoResultsMessage>
        : isGridView
          ? <GuardianGrid
            guardians={filteredGuardians}
            animationParent={animationParent}
            confirmDeleteId={confirmDeleteId}
            handleDeleteAsk={handleDeleteAsk}
            handleDelete={handleDelete}
          />
          : <GuardianTable
            guardians={filteredGuardians}
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
