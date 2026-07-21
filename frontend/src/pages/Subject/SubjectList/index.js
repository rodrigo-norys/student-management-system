import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Loading from 'components/Loading';

import * as actions from 'store/modules/subject/actions';

import { ITEMS_PER_PAGE, INITIAL_SEARCH_STATE } from './constants';

import SubjectTable from './components/SubjectTable';
import * as Styled from './styled';

export default function Subjects() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    subjects = [],
    totalPages = 1,
    isLoading = false,
  } = useSelector((state) => state.subject || {});
  const { isLoggedIn = false } = useSelector((state) => state.auth || {});

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
        actions.getSubjectsRequest({
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
    dispatch(actions.deleteSubjectRequest(id));
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

  const filteredSubjects = subjects.filter((subject) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      subject.name.toLowerCase().includes(searchLower) ||
      subject.code.toLowerCase().includes(searchLower) ||
      (subject.knowledge_area &&
        subject.knowledge_area.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />

      <Styled.HeaderToolbar>
        <h1>Subjects</h1>
        <Styled.NewSubjectLink to="/subject/create">
          Add Subject
        </Styled.NewSubjectLink>
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Styled.SearchInput>
      </Styled.ControlsArea>

      <div ref={animationParent}>
        {filteredSubjects.length === 0 ? (
          <Styled.NoResultsMessage>No subjects found.</Styled.NoResultsMessage>
        ) : (
          <SubjectTable
            subjects={filteredSubjects}
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
