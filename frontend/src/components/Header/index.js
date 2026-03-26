import { FaHome, FaPowerOff, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';
import { Nav, Menu, Logo, UserInfo, StatusBadge, LinkRegister, LogoutButton } from './styled';

export default function Header() {
  const dispatch = useDispatch();

  const { isLoggedIn = false, user = {} } = useSelector(state => state.auth || {});

  const handleLogout = e => {
    e.preventDefault();
    dispatch(actions.logoutRequest());
    toast.info('You logged out');
  };

  return (
    <Nav>
      <Logo>
        <Link to={user?.id ? "/" : "/login"}>
          <FaHome size={22} />
          <span>SisboSchool</span>
        </Link>
      </Logo>

      <Menu>
        {isLoggedIn && (
          <>
            <UserInfo>
              <FaUserCircle size={20} />
              <span>{user?.email ? user.email.split('@')[0] : 'Guest'}</span>
              <StatusBadge title="Online" />
            </UserInfo>

            {(user?.access_level_id && user.access_level_id < 3) && (
              <LinkRegister to='/register'>
                <FaUserPlus size={16} />
                <span>Accounts</span>
              </LinkRegister>
            )}

            <LogoutButton onClick={handleLogout} title="Leave">
              <FaPowerOff size={22} color="#fff" />
            </LogoutButton>
          </>
        )}
      </Menu>
    </Nav>
  );
}
