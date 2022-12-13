import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { AboutModal } from './app.modal';
import './app-layout.scss';

const { Content } = Layout;

export const BasicLayout: React.FC = () => {
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onAboutClick = () => {
    setShowAbout(!showAbout);
  }

  const modalProps = {
    isModalOpen: showAbout,
    handleOk: () => {
      setShowAbout(!setShowAbout);
    }
  }
  return (
    <Layout style={{ height: '100vh' }}>
      <AppSidebar collapsed={collapsed} />
      <Layout className="site-layout">
        <AppHeader setCollapsed={setCollapsed} collapsed={collapsed} onAboutClick={onAboutClick} />
        <Content
          style={{
            height: '100%',
            width: '100%',
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <AboutModal {...modalProps} />
    </Layout>
  );
};

