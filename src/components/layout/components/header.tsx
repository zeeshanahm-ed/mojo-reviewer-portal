import { useNavigate } from 'react-router-dom';

import { Dropdown, Menu } from 'antd';

import UserIcon from 'assets/icons/user-icon.svg?react';

import * as authHelper from '../../../auth/core/auth-helpers';
import LogoutModal from 'auth/logout-modal';
import { useState } from 'react';
import LanguageSwitch from 'components/core-ui/language-switch/language-switch';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';


function Header() {
  const { t } = useTranslation();
  const direction = useDirection();
  const currentUser = authHelper.getUser();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Menu for the Dropdown
  const menu = (
    <Menu>
      <Menu.Item key='profile' onClick={() => navigate('/profile')}>
        {t("Profile")}
      </Menu.Item>
      <Menu.Item key='logout'>
        <button onClick={() => setLogoutModalOpen(true)} className='flex items-center gap-2 w-full'>
          <span>{t("Logout")}</span>
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <section className='flex text-secondary-600 font-barlow border-b-2 bg-white mb-7 fixed top-0 w-full max-w-screen-4xl z-20'>
      <div className='flex items-center justify-between w-full bg-white px-6 py-4 z-40'>
        <a href='/' className='flex items-center gap-7'>
          <span className="flex" dir={direction}>
            <h1 className="text-5xl font-bold font-secondary">{t("MOJO")}</h1>
            <h2 className="text-base font-medium mt-5 ms-2">{t("Reviewer Portal")}</h2>
          </span>
        </a>
        <div className='flex place-items-center gap-7 notification'>

          <div className='flex gap-8 items-center'>
            <LanguageSwitch />
            <div className='flex items-center gap-3'>
              <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
                <div className='bg-gray-200 font-semibold text-3xl rounded-full w-10 h-10 flex flex-centered cursor-pointer'>
                  {currentUser && (
                    <>
                      <UserIcon />
                    </>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
    </section >
  );
}

export default Header;
