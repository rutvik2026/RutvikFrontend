



import { createContext} from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export const AuthContext = createContext();


function Head() {
  return (
    <AuthContext.Provider value={{ role, isLoggedIn }}>
      <Navbar collapseOnSelect expand="lg" className="bg-dark" fixed="top">
        <Container>
          <Navbar.Brand className="text-white">FoodApoint</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="bg-white"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
             
              <Nav.Link as={Link} className="text-white" to="/login">
                  Login
                </Nav.Link>
             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </AuthContext.Provider>
  );
}

export default Head;

