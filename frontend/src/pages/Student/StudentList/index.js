import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import * as Styled from './styled.js';

import { ITEMS_PER_PAGE, VIEW_MODES, INITIAL_SEARCH_STATE, } from './constants.js';

import * as actions from 'store/modules/student/actions';
import Loading from 'components/Loading';

import StudentGrid from './components/StudentGrid.js';
import StudentTable from './components/StudentTable.js';

export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    students = [],
    totalPages = 1,
    isLoading = false,
  } = useSelector((state) => state.student || {});
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
        actions.getStudentsRequest({
          page: currentPage,
          limit,
        }),
      );
    }
  }, [isLoggedIn, currentPage, navigate, dispatch]);

  const handleDeleteAsk = (e, id) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(actions.deleteStudentRequest(id));
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

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${student.name} ${student.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      student.is_active.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.registration_number.includes(searchLower) ||
      student.blood_type.includes(searchLower)
    );
  });

  return (
    <Styled.Container>
      <Loading isLoading={isLoading} />

      <Styled.HeaderToolbar>
        <h1>Students</h1>
        <Styled.NewStudentLink to="/student/create">
          Add Student
        </Styled.NewStudentLink>
      </Styled.HeaderToolbar>

      <Styled.ControlsArea>
        <Styled.SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search students..."
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

      {filteredStudents.length === 0 ? (
        <Styled.NoResultsMessage>No students found.</Styled.NoResultsMessage>
      ) : viewMode === VIEW_MODES.GRID ? (
        <StudentGrid
          students={filteredStudents}
          animationParent={animationParent}
          confirmDeleteId={confirmDeleteId}
          handleDeleteAsk={handleDeleteAsk}
          handleDelete={handleDelete}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          animationParent={animationParent}
          confirmDeleteId={confirmDeleteId}
          handleDeleteAsk={handleDeleteAsk}
          handleDelete={handleDelete}
          currentPage={currentPage}
          limit={limit}
        />
      )}

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
