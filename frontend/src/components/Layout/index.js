import React from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';

import {
  FaHome, FaUserGraduate, FaUserTie, FaUsers,
  FaCog, FaPowerOff, FaUserPlus
} from 'react-icons/fa';

import {
  LayoutContainer, Sidebar, SidebarHeader, NavMenu, NavItem, MainArea, Topbar,
  UserProfile, ContentWrapper, TopActions, ActionLink, LogoutBtn, SidebarFooter,
  SidebarLogoutBtn
} from './styled';

export default function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoggedIn = false, user = {} } = useSelector(state => state.auth || {});

  const handleLogout = e => {
    e.preventDefault();
    dispatch(actions.logoutRequest());
    toast.info('You logged out');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const userName = user?.email ? user.email.split('@')[0] : 'Guest';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>SISBOSCHOOL</h2>
        </SidebarHeader>

        <NavMenu>
          <NavItem to="/" className={isActive('/')}>
            <FaHome /> Dashboard
          </NavItem>
          <NavItem to="/students" className={isActive('/students')}>
            <FaUserGraduate /> Students
          </NavItem>
          <NavItem to="/staff" className={isActive('/staff')}>
            <FaUserTie /> Staff
          </NavItem>
          <NavItem to="/guardians" className={isActive('/guardians')}>
            <FaUsers /> Guardians
          </NavItem>
          <NavItem to="/settings" className={isActive('/settings')}>
            <FaCog /> Settings
          </NavItem>
        </NavMenu>

        {isLoggedIn && (
          <SidebarFooter>
            <SidebarLogoutBtn onClick={handleLogout}>
              <FaPowerOff /> Logout
            </SidebarLogoutBtn>
          </SidebarFooter>
        )}
      </Sidebar>

      <MainArea>
        <Topbar>

          {isLoggedIn && (
            <TopActions>
              {(user?.access_level_id && user.access_level_id < 3) && (
                <ActionLink to='/register'>
                  <FaUserPlus size={14} />
                  <span>Accounts</span>
                </ActionLink>
              )}
            </TopActions>
          )}

          <UserProfile>
            <div className="user-info">
              <strong>{userName}</strong>
              <span>
                {user?.access_level_id === 1 ? 'Administrator' :
                 user?.access_level_id === 2 ? 'Staff' : 'User'}
              </span>
            </div>
            <div className="avatar">{userInitial}</div>
          </UserProfile>

        </Topbar>

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainArea>
    </LayoutContainer>
  );
}
