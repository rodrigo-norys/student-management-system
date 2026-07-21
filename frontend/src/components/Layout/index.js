import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'store/modules/auth/actions.js';
import {
  FaHome,
  FaUserGraduate,
  FaUserTie,
  FaUsers,
  FaCog,
  FaPowerOff,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaEye,
  FaBuilding,
  FaBook,
  FaChalkboard,
} from 'react-icons/fa';
import {
  LayoutContainer,
  Sidebar,
  SidebarHeader,
  NavMenu,
  NavItem,
  MainArea,
  Topbar,
  UserProfile,
  ContentWrapper,
  SidebarFooter,
  SidebarLogoutBtn,
  Overlay,
  MenuToggleButton,
  DemoBanner,
} from './styled';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn = false, user = {} } = useSelector(
    (state) => state.auth || {},
  );

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.logoutRequest());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const userName = user?.email ? user.email.split('@')[0] : 'Guest';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <LayoutContainer>
      <Overlay $isOpen={isMenuOpen} onClick={toggleMenu} />
      <Sidebar $isOpen={isMenuOpen}>
        <SidebarHeader>
          <h2>SISBOSCHOOL</h2>
          <MenuToggleButton onClick={toggleMenu}>
            <FaTimes size={20} />
          </MenuToggleButton>
        </SidebarHeader>
        <NavMenu>
          <NavItem
            to="/dashboard"
            className={isActive('/dashboard')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHome /> Dashboard
          </NavItem>
          {
            <NavItem
              to="/users"
              className={isActive('/users')}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserFriends /> Users
            </NavItem>
          }
          <NavItem
            to="/students"
            className={isActive('/students')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUserGraduate /> Students
          </NavItem>
          <NavItem
            to="/staff"
            className={isActive('/staff')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUserTie /> Staff
          </NavItem>
          <NavItem
            to="/guardians"
            className={isActive('/guardians')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUsers /> Guardians
          </NavItem>
          <NavItem
            to="/units"
            className={isActive('/units')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBuilding /> Units
          </NavItem>
          <NavItem
            to="/subjects"
            className={isActive('/subjects')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBook /> Subjects
          </NavItem>
          <NavItem
            to="/unit-classes"
            className={isActive('/unit-classes')}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaChalkboard /> Classes
          </NavItem>
          <NavItem
            to="/settings"
            className={isActive('/settings')}
            onClick={() => setIsMenuOpen(false)}
          >
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
          <MenuToggleButton onClick={toggleMenu}>
            <FaBars size={22} />
          </MenuToggleButton>
          <div style={{ flex: 1 }} />
          <UserProfile>
            <div className="user-info">
              <strong>{userName}</strong>
              <span>
                {user?.access_level_id === 1
                  ? 'Administrator'
                  : user?.access_level_id === 2
                    ? 'Staff'
                    : 'User'}
              </span>
            </div>
            <div className="avatar">{userInitial}</div>
          </UserProfile>
        </Topbar>
        {user?.is_demo && (
          <DemoBanner>
            <FaEye /> Modo demonstração — somente leitura
          </DemoBanner>
        )}
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainArea>
    </LayoutContainer>
  );
}
