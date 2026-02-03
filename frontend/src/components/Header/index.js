import {
  FaHome,
  FaSignInAlt,
  FaPowerOff,
  FaUserCircle,
  FaUserCog,
  FaUserPlus
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';
import { Nav, Menu, Logo, UserInfo, LinkRegister, LinkLogin } from './styled';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  const id = useSelector(state => state.auth.user.id);

  const handleLogout = e => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    toast.info('You logged out');
    navigate('/login');
  };

  return (
    <Nav>
      <Logo>
        <Link to={id ? "/" : "/login"}>
          <FaHome size={22} />
          <span>SisboSchool</span>
        </Link>
      </Logo>

      <Menu>
        {isLoggedIn ? (
          <>
            <Link to="/register">
              <FaUserCog size={24} color="#fff" title="Update account" />
            </Link>

            <UserInfo>
              <FaUserCircle size={20} />
              <span>{user?.name || ''}</span>
              <div style={{ width: 8, height: 8, background: '#44dd44', borderRadius: '50%' }} title="Online" />
            </UserInfo>

            <Link onClick={handleLogout} to="/logout">
              <FaPowerOff size={22} color="#fff" title="Leave" />
            </Link>
          </>
        ) : (
          <>
            <LinkRegister to='/register'>
              <FaUserPlus size={16} />
              <span>Sign up</span>
            </LinkRegister>

            <LinkLogin to='/login'>
              <FaSignInAlt size={16} />
              <span>Sign in</span>
            </LinkLogin>

          </>
        )}
      </Menu>
    </Nav>
  );
}
