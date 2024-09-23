import React, { useState } from 'react';
import { Container, Navbar, Nav, Form, FormControl, Button, Row, Col, Table, Pagination, Accordion, Card, Badge } from 'react-bootstrap';

function Test2() {
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
  const [totalResults, setTotalResults] = useState(0);

  // Handle ID Search
  const handleIDSearch = (event) => {
    event.preventDefault();
    // Implement your search logic here
  };

  // Handle AI Search
  const handleAISearch = (event) => {
    event.preventDefault();
    // Implement your AI search logic here
  };

  // Handle Advanced Filters
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
            <Nav className="me-auto">
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
          <Col md={12}>
            <h2>Search Module</h2>
            {/* ID Search */}
            <Form onSubmit={handleIDSearch}>
              <Row className="mb-3">
                <Col md={8}>
                  <FormControl
                    type="text"
                    placeholder="Search by ID"
                    className="me-2"
                  />
                </Col>
                <Col md={4}>
                  <Button variant="primary" type="submit">Search</Button>
                </Col>
              </Row>
            </Form>

            {/* AI Assisted Search */}
            <Form onSubmit={handleAISearch} className="mb-3">
              <Row>
                <Col md={8}>
                  <FormControl
                    type="text"
                    placeholder="Search using AI Assistance"
                    className="me-2"
                  />
                </Col>
                <Col md={4}>
                  <Button variant="primary" type="submit">Search</Button>
                </Col>
              </Row>
            </Form>

            {/* Advanced Filters */}
            <Accordion className="mb-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Advanced Filters</Accordion.Header>
                <Accordion.Body>
                  <Form>
                    <Row>
                      {/* Example of filter fields */}
                      <Col md={4}>
                        <Form.Group controlId="filter1">
                          <Form.Label>Filter 1</Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Enter filter 1"
                            name="filter1"
                            onChange={handleFilterChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="filter2">
                          <Form.Label>Filter 2</Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Enter filter 2"
                            name="filter2"
                            onChange={handleFilterChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="filter3">
                          <Form.Label>Filter 3</Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Enter filter 3"
                            name="filter3"
                            onChange={handleFilterChange}
                          />
                        </Form.Group>
                      </Col>
                      {/* Add more filter fields as required */}
                    </Row>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* Search Results */}
            <h3>Search Results</h3>
            <p>Filters applied: <Badge bg="secondary">Filter 1</Badge> <Badge bg="secondary">Filter 2</Badge></p>
            <p>Total Results: {totalResults}</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.id}</td>
                    <td>{result.name}</td>
                    <td>{result.category}</td>
                    <td>{result.date}</td>
                    <td>{result.status}</td>
                    {/* Add more data cells as needed */}
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

export default Test2;
