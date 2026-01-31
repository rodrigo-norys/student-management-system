import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaPowerOff, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';
import { Nav, Menu, Logo, UserInfo } from './styled';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);


  // VERIFICAR O LOGOUT //
  const handleLogout = e => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    toast.info('You logged out');
    navigate('/login');
  };

  return (
    <Nav>
      <Logo>
        <Link to='/'>
          <FaHome size={22} />
          <span>SisboSchool</span>
        </Link>
      </Logo>

      <Menu>
        {isLoggedIn ? (
          <>
            <Link to="/register">
               <FaUserAlt size={20} title="My Account" />
            </Link>

            <UserInfo>
              <FaUserCircle size={20} />
              <span>{user?.name || ''}</span>
               <div style={{ width: 8, height: 8, background: '#44dd44', borderRadius: '50%' }} title="Online" />
            </UserInfo>

            <Link onClick={handleLogout} to="/logout">
              <FaPowerOff size={20} title="Leave" />
            </Link>
          </>
        ) : (
          <>
            <Link to='/register'>
              <FaUserAlt size={20} />
            </Link>

            <Link to='/login'>
              <FaSignInAlt size={20} />
            </Link>
          </>
        )}
      </Menu>
    </Nav>
  );
}
