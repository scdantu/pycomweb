import { Navbar, Nav, Container, Tabs, Tab, Form, Button, Accordion, Table, Pagination, Row, Col } from 'react-bootstrap';
import {  InputGroup, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
// import '../assets/css/style.css'
function TestLayout() {
return(
<>
<Navbar bg="dark" variant="dark" fixed="top">
  <Container>
    <Navbar.Brand href="#home">ProteinSearch</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#features">Features</Nav.Link>
      <Nav.Link href="#pricing">Pricing</Nav.Link>
    </Nav>
  </Container>
</Navbar>
<Tabs defaultActiveKey="uniprot" id="protein-search-tabs" className="mb-3">
  <Tab eventKey="uniprot" title="Search by Uniprot ID">
  <Form>
  <Form.Group controlId="uniprotSearch">
    <Form.Label>Enter Uniprot ID</Form.Label>
    <Form.Control type="text" placeholder="e.g., P12345" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Search
  </Button>
</Form>
  </Tab>
  <Tab eventKey="advanced" title="Advanced Search">
  <Form>
  <Accordion defaultActiveKey="0">
  <Accordion.Item eventKey="0">
    <Accordion.Header>Input Box</Accordion.Header>
    <Accordion.Body>
      
      <Form.Group as={Row} controlId="keywordInput" className="mb-3">
        <Form.Label column sm={2}>Keyword</Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Enter keyword" />
        </Col>
        </Form.Group>

    </Accordion.Body> 
  </Accordion.Item>
  
  <Accordion.Item eventKey="0">
    <Accordion.Header>Text Box</Accordion.Header>
    <Accordion.Body>
      {/* Text Box */}
      <Form.Group as={Row} controlId="descriptionTextBox" className="mb-3">
        <Form.Label column sm={2}>Description</Form.Label>
        <Col sm={10}>
          <Form.Control as="textarea" rows={3} placeholder="Enter description" />
        </Col>
      </Form.Group>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="0">
    <Accordion.Header>Select Box </Accordion.Header>
    <Accordion.Body>
      {/* Select Box */}
      <Form.Group as={Row} controlId="categorySelect" className="mb-3">
        <Form.Label column sm={2}>Category</Form.Label>
        <Col sm={10}>
          <Form.Control as="select">
            <option>Select category</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
            <option value="3">Category 3</option>
          </Form.Control>
        </Col>
      </Form.Group>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="0">
    <Accordion.Header>Radio Button</Accordion.Header>
    <Accordion.Body>
      {/* Option Button (Radio Button) */}
      <Form.Group as={Row} controlId="typeOption" className="mb-3">
        <Form.Label column sm={2}>Type</Form.Label>
        <Col sm={10}>
          <Form.Check 
            type="radio" 
            label="Type 1" 
            name="typeOptions" 
            id="type1" 
            value="type1"
          />
          <Form.Check 
            type="radio" 
            label="Type 2" 
            name="typeOptions" 
            id="type2" 
            value="type2"
          />
          <Form.Check 
            type="radio" 
            label="Type 3" 
            name="typeOptions" 
            id="type3" 
            value="type3"
          />
        </Col>
      </Form.Group>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="0">
    <Accordion.Header>Switch</Accordion.Header>
    <Accordion.Body>
    <Form.Group as={Row} controlId="filterToggle" className="mb-3">
        <Form.Label column sm={2}>Enable Filter</Form.Label>
        <Col sm={10}>
          <Form.Check 
            type="switch" 
            id="enableFilterSwitch" 
            label="Enable additional filter"
          />
        </Col>
      </Form.Group>

      {/* Submit Button */}
      <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" variant="primary">Search</Button>
        </Col>
      </Form.Group>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
</Form>
  </Tab>
  <Tab eventKey="ai" title="AI Search">
  <Form>
  <Form.Group controlId="aiSearch">
    <Form.Label>Enter your query</Form.Label>
    <Form.Control as="textarea" rows={3} placeholder="e.g., Find proteins related to cancer research..." />
  </Form.Group>
  <Button variant="primary" type="submit">
    Search
  </Button>
</Form>
  </Tab>
</Tabs>

<Row>
  <Col md={12}>
    <h5>Search Results</h5>
    <p>Filters: [Selected Filters]</p>
    <p>Total Results: 1000 | Category 1: 300 | Category 2: 700</p>
  </Col>
</Row>

<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>Protein Name</th>
      <th>Uniprot ID</th>
      <th>Category</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
  <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ABCD</td>
      <td>12345</td>
      <td>ABCS</td>
      <td>Details</td>
    </tr>
  </tbody>
</Table>

<Pagination>
  <Pagination.First />
  <Pagination.Prev />
  <Pagination.Item>{1}</Pagination.Item>
  <Pagination.Item>{2}</Pagination.Item>
  <Pagination.Next />
  <Pagination.Last />
</Pagination>

</>
);
}

export default TestLayout;
