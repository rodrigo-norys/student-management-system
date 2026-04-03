import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { FaTh, FaList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import {
  Container, HeaderToolbar, ControlsArea, SearchInput, ViewToggle, ToggleButton,
  NoResultsMessage, NewStudentLink, PaginationArea, PageButton
} from './styled.js';

import * as actions from '../../store/modules/student/actions';
import Loading from '../../components/Loading';

import StudentGrid from './components/StudentGrid.js';
import StudentTable from './components/StudentTable.js';

export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    students = [],
    totalPages = 1,
    isLoading = false
  } = useSelector(state => state.student || {});
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
      dispatch(actions.getStudentsRequest({
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
    dispatch(actions.deleteStudentRequest(id));
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

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${student.name} ${student.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.registration_number.includes(searchLower) ||
      student.cpf.includes(searchLower)
    );
  });

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <HeaderToolbar>
        <h1>Students</h1>
        <NewStudentLink to="/student/create">Add Student</NewStudentLink>
      </HeaderToolbar>

      <ControlsArea>
        <SearchInput>
          <FaSearch color="#444" />
          <input
            type="text"
            placeholder="Search students..."
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

      {filteredStudents.length === 0
        ? <NoResultsMessage>No students found.</NoResultsMessage>
        : isGridView
          ? <StudentGrid
            students={filteredStudents}
            animationParent={animationParent}
            confirmDeleteId={confirmDeleteId}
            handleDeleteAsk={handleDeleteAsk}
            handleDelete={handleDelete}
          />
          : <StudentTable
            students={filteredStudents}
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
