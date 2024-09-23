import { Container, Row, Col } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

const Layout = ({ sidebar, children }) => (
    <Container fluid className="main-content-wrapper">
        <Row>
            {/* <div className="top">
                <FaBars />
            </div> */}
            <Col md={3} lg={2} className="sidebar-div">
                {sidebar}
            </Col>
            <Col md={9} lg={10} className="right-content-div d-flex flex-column flex-column-fluid">
                {children}
            </Col>
        </Row>
    </Container>
);

export default Layout;