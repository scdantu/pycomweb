import React, { useState } from 'react';
import { Container, Navbar, Nav, Form, FormControl, Button, Row, Col, Table, Pagination, Accordion, Card, Badge } from 'react-bootstrap';

function Test3() {
  const [results, setResults] = useState([
    {
      id: "1",
      name: "John Doe",
      category: "Finance",
      date: "2023-08-01",
      status: "Active"
    },
    {
      id: "2",
      name: "Jane Smith",
      category: "Human Resources",
      date: "2023-07-25",
      status: "Inactive"
    },
    {
      id: "3",
      name: "Alice Johnson",
      category: "IT",
      date: "2023-07-30",
      status: "Active"
    },
    {
      id: "4",
      name: "Bob Brown",
      category: "Marketing",
      date: "2023-08-05",
      status: "Active"
    },
    {
      id: "5",
      name: "Charlie Davis",
      category: "Sales",
      date: "2023-07-20",
      status: "Inactive"
    },
    {
      id: "6",
      name: "Diana White",
      category: "Finance",
      date: "2023-08-02",
      status: "Active"
    },
    {
      id: "7",
      name: "Eve Black",
      category: "Human Resources",
      date: "2023-07-28",
      status: "Inactive"
    },
    {
      id: "8",
      name: "Frank Green",
      category: "IT",
      date: "2023-08-03",
      status: "Active"
    },
    {
      id: "9",
      name: "Grace Adams",
      category: "Marketing",
      date: "2023-07-29",
      status: "Active"
    },
    {
      id: "10",
      name: "Henry Wilson",
      category: "Sales",
      date: "2023-07-26",
      status: "Inactive"
    }
  ]);

  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(10);

  // Handle Filter Changes
  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Fetch new results based on the current page
  };

  return (
    <div>
      {/* Fixed Header */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Search</Nav.Link>
              <Nav.Link href="#">Reports</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container style={{ marginTop: '100px' }}>
        <Row>
          {/* Sidebar Filters */}
          <Col md={3}>
            <h4>Filters</h4>
            <Form>
              {/* Example Filters */}
              <Form.Group controlId="filterCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" name="category" onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="filterStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status" onChange={handleFilterChange}>
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
              {/* Add more filters as needed */}
            </Form>
          </Col>

          {/* Search Results and Stats */}
          <Col md={9}>
            <h4>Search Results</h4>

            {/* Statistics */}
            <Row className="mb-3">
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Total Results</Card.Title>
                    <Card.Text>{totalResults}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Active Results</Card.Title>
                    <Card.Text>{results.filter(result => result.status === 'Active').length}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Inactive Results</Card.Title>
                    <Card.Text>{results.filter(result => result.status === 'Inactive').length}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Results Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.id}</td>
                    <td>{result.name}</td>
                    <td>{result.category}</td>
                    <td>{result.date}</td>
                    <td>{result.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Test3;
