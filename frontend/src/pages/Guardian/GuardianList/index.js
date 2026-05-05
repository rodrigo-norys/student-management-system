import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/guardian/actions';

import { ITEMS_PER_PAGE, VIEW_MODES, INITIAL_SEARCH_STATE } from './constants';

import GuardianGrid from './components/GuardianGrid';
import GuardianTable from './components/GuardianTable';
import * as Styled from './styled';

export default function Guardians() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    guardians = [],
    totalPages = 1,
    isLoading = false,
  } = useSelector((state) => state.guardian || {});
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
        actions.getGuardiansRequest({
          page: currentPage,
          limit,
        }),
      );
    }
  }, [isLoggedIn, currentPage, navigate, dispatch, limit]);

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
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const filteredGuardians = guardians.filter((guardian) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${guardian.name} ${guardian.last_name || ''}`.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      guardian.is_active.toString().toLowerCase().includes(searchLower) ||
      guardian.email.toLowerCase().includes(searchLower) ||
      (guardian.phone && guardian.phone.includes(searchLower)) ||
      (guardian.cpf && guardian.cpf.includes(searchLower))
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />

      <Styled.HeaderToolbar>
        <h1>Guardians</h1>
        <Styled.NewGuardianLink to="/guardian/create">
          Add Guardian
        </Styled.NewGuardianLink>
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search guardians..."
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

      <div ref={animationParent}>
        {filteredGuardians.length === 0 ? (
          <Styled.NoResultsMessage>No guardians found.</Styled.NoResultsMessage>
        ) : viewMode === VIEW_MODES.GRID ? (
          <GuardianGrid
            guardians={filteredGuardians}
            confirmDeleteId={confirmDeleteId}
            handleDeleteAsk={handleDeleteAsk}
            handleDelete={handleDelete}
          />
        ) : (
          <GuardianTable
            guardians={filteredGuardians}
            confirmDeleteId={confirmDeleteId}
            handleDeleteAsk={handleDeleteAsk}
            handleDelete={handleDelete}
            currentPage={currentPage}
            limit={limit}
          />
        )}
      </div>

      <Styled.PaginationArea>
        <Styled.PageButton
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
        >
          <FaChevronLeft size={14} /> Prev
        </Styled.PageButton>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Styled.PageButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
        >
          Next <FaChevronRight size={14} />
        </Styled.PageButton>
      </Styled.PaginationArea>
    </Styled.Container>
  );
}
