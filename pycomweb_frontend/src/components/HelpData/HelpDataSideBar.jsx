import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const HelpDataSidebar = () => {
  return (
    <div className="helpdata-sidebar">
      <div className="sidebar-heading">
        <h2>Help Data</h2>
      </div>
      <Nav defaultActiveKey="biological_processes" className="helpdata-links-div flex-column">
        <NavLink as={Link} to={"/biological_processes"} className="nav-link">
          Biological Processes
        </NavLink>
        <NavLink as={Link} to={"/cellular_components"} className="nav-link">
          Cellular Components
        </NavLink>
        <NavLink as={Link} to={"/cofactors"} className="nav-link">
          Cofactors
        </NavLink>
        <NavLink as={Link} to={"/diseases"} className="nav-link">
          Diseases
        </NavLink>
        <NavLink as={Link} to={"/developmental_stages"} className="nav-link">
          Developmental Stages
        </NavLink>
        <NavLink as={Link} to={"/domains"} className="nav-link">
          Domains
        </NavLink>
        <NavLink as={Link} to={"/ligands"} className="nav-link">
          Ligands
        </NavLink>
        <NavLink as={Link} to={"/molecular_functions"} className="nav-link">
          Molecular Functions
        </NavLink>
        <NavLink as={Link} to={"/organisms"} className="nav-link">
          Organisms
        </NavLink>
        <NavLink as={Link} to={"/ptm"} href="/ptm" className="nav-link">
          Post Translational Modification
        </NavLink>
      </Nav>
    </div>
  );
};

export default HelpDataSidebar;
