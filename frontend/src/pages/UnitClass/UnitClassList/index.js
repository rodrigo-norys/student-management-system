import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/unitClass/actions';

import { CLASS_MANAGER_LEVELS } from '../constants';
import { ITEMS_PER_PAGE, INITIAL_SEARCH_STATE } from './constants';

import UnitClassTable from './components/UnitClassTable';
import * as Styled from './styled';

export default function UnitClasses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    unitClasses = [],
    totalPages = 1,
    isLoading = false,
  } = useSelector((state) => state.unitClass || {});
  const { isLoggedIn = false, user = {} } = useSelector(
    (state) => state.auth || {},
  );

  const canManage = CLASS_MANAGER_LEVELS.includes(user?.access_level_id);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(INITIAL_SEARCH_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [animationParent] = useAutoAnimate();

  const limit = ITEMS_PER_PAGE;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(
        actions.getUnitClassesRequest({
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
    dispatch(actions.deleteUnitClassRequest(id));
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

  const filteredUnitClasses = unitClasses.filter((unitClass) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      unitClass.name.toLowerCase().includes(searchLower) ||
      unitClass.grade_level.toLowerCase().includes(searchLower) ||
      unitClass.room_number.toLowerCase().includes(searchLower) ||
      (unitClass.unit?.name || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />

      <Styled.HeaderToolbar>
        <h1>Classes</h1>
        {canManage && (
          <Styled.NewUnitClassLink to="/unit-class/create">
            Add Class
          </Styled.NewUnitClassLink>
        )}
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Styled.SearchInput>
      </Styled.ControlsArea>

      <div ref={animationParent}>
        {filteredUnitClasses.length === 0 ? (
          <Styled.NoResultsMessage>No classes found.</Styled.NoResultsMessage>
        ) : (
          <UnitClassTable
            unitClasses={filteredUnitClasses}
            confirmDeleteId={confirmDeleteId}
            handleDeleteAsk={handleDeleteAsk}
            handleDelete={handleDelete}
            currentPage={currentPage}
            limit={limit}
            canManage={canManage}
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
