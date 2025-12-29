import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import TicketForm from './components/TicketForm';
import Dashboard from './components/Dashboard';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <div className="logo" style={{ float: 'left', color: 'white', fontSize: '20px', marginRight: '20px' }}>
            AI Support
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">Submit Ticket</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/admin">Admin Dashboard</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content" style={{ marginTop: '20px' }}>
            <Routes>
              <Route path="/" element={<TicketForm />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          AI-Powered Support Ticket System ©2025
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
