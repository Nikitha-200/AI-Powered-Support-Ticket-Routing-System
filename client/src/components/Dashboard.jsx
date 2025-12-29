import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Card, Row, Col, Statistic, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
    } catch (error) {
      message.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tickets/${id}`, { status });
      message.success('Status updated');
      fetchTickets();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        let color = 'green';
        if (priority === 'Medium') color = 'orange';
        if (priority === 'High') color = 'red';
        return <Tag color={color}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select defaultValue={status} style={{ width: 140 }} onChange={(value) => handleStatusChange(record._id, value)}>
          <Option value="Open">Open</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Resolved">Resolved</Option>
        </Select>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    highPriority: tickets.filter((t) => t.priority === 'High').length,
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>Admin Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <Statistic title="Total Tickets" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <Statistic title="Open Tickets" value={stats.open} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <Statistic title="High Priority" value={stats.highPriority} valueStyle={{ color: '#fa541c' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          expandable={{ expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p> }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
