import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { HelpDataContext } from "../context/HelpDataContext";
import { FaCartArrowDown } from "react-icons/fa";



function NavigationBar() {
  const {basket} =  useContext(HelpDataContext);
  const [basketCount, setBasketCount] = useState(0);

  //update the cart count bubble each time an item is added to the basket
  useEffect(() => {
    let basketItems = Object.keys(basket).length;
    setBasketCount(basketItems);
  }, [basket]);

  return (
    <Navbar expand="lg" className="fixed-top bg-body-tertiary shadow" data-bs-theme="light" >
      <Container>
        <Navbar.Brand className="fw-semibold" href="#home" >PyComWeb</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-end w-100">
            <NavLink className="text-uppercase nav-link" as={Link} to={"/"}>
              Search Protein
            </NavLink>
            <NavDropdown className=" text-uppercase" title="Data" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to={"biological_processes"}>
                Biological Processes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/cellular_components"}>
                Cellular Components
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/cofactors"}>
                Cofactors
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/diseases"}>
                Diseases
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/developmental_stages"}>
                Developmental Stages
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/domains"}>
                Domains
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/ligands"}>
                Ligands
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/molecular_functions"}>
                Molecular Functions
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/organisms"}>
                Organisms
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/ptm"} href="/ptm">
                Post Translational Modification
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link className=" text-uppercase" href="/search">Search Protein</Nav.Link> */}
            <Nav.Link className=" text-uppercase" href="/AI_help">AI Assistance</Nav.Link>
            {/* <NavLink className=" text-uppercase nav-link" to="/MSA">MSA</NavLink> */}
            {/* <NavLink className="text-uppercase nav-link" to="/pdb">
              PDB
            </NavLink> */}
            <Nav.Link as={Link} to={"basket"}><FaCartArrowDown size={20}/>
            {
              basketCount > 0 ? (<div className="basketCountBubble">{basketCount}</div>) : (<div></div>)
            }</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
