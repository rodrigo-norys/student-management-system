import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/unit/actions';

import { ITEMS_PER_PAGE, INITIAL_SEARCH_STATE } from './constants';

import UnitTable from './components/UnitTable';
import * as Styled from './styled';

export default function Units() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    units = [],
    totalPages = 1,
    isLoading = false,
  } = useSelector((state) => state.unit || {});
  const { isLoggedIn = false, isPowerUser = false } = useSelector(
    (state) => state.auth || {},
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(INITIAL_SEARCH_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [animationParent] = useAutoAnimate();

  const limit = ITEMS_PER_PAGE;

  const canManage = isPowerUser;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(
        actions.getUnitsRequest({
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
    dispatch(actions.deleteUnitRequest(id));
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

  const filteredUnits = units.filter((unit) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      unit.name.toLowerCase().includes(searchLower) ||
      unit.email.toLowerCase().includes(searchLower) ||
      (unit.cnpj && unit.cnpj.includes(searchLower)) ||
      (unit.phone && unit.phone.includes(searchLower))
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />

      <Styled.HeaderToolbar>
        <h1>Units</h1>
        {canManage && (
          <Styled.NewUnitLink to="/unit/create">Add Unit</Styled.NewUnitLink>
        )}
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Styled.SearchInput>
      </Styled.ControlsArea>

      <div ref={animationParent}>
        {filteredUnits.length === 0 ? (
          <Styled.NoResultsMessage>No units found.</Styled.NoResultsMessage>
        ) : (
          <UnitTable
            units={filteredUnits}
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
