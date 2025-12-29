import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// 🔥 Backend API URL
const API_URL = process.env.REACT_APP_API_URL;

const TicketForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/tickets`, values);
      message.success('Ticket submitted successfully!');
      setSubmittedTicket(response.data);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit ticket.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 12 }}>
            <Title level={2} style={{ textAlign: 'center' }}>
              Submit Support Ticket
            </Title>
            <Paragraph style={{ textAlign: 'center' }}>
              Describe your issue and our AI will route it to the right team.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="title"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Brief summary of the issue" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <TextArea rows={6} placeholder="Detailed explanation of the problem..." />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  Submit Ticket
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {submittedTicket && (
            <Card
              style={{
                marginTop: 20,
                borderColor: '#52c41a',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                borderRadius: 12
              }}
              title="Ticket Created"
            >
              <Paragraph>
                <strong>Ticket ID:</strong> {submittedTicket._id}
              </Paragraph>
              <Paragraph>
                <strong>Category:</strong> {submittedTicket.category}
              </Paragraph>
              <Paragraph>
                <strong>Priority:</strong> {submittedTicket.priority}
              </Paragraph>
              <Paragraph>
                <strong>Status:</strong> {submittedTicket.status}
              </Paragraph>
              <Button onClick={() => setSubmittedTicket(null)}>
                Submit Another
              </Button>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TicketForm;
