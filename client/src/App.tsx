// App -----------------------------------------------------------------------

// Overall implementation of the entire application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//import logo from './logo.svg';
//import './App.css';

// Internal Modules ----------------------------------------------------------

import LibrarySelector from "./components/LibrarySelector";
import { SharedContextProvider } from "./contexts/SharedContext";
import HomeView from "./views/HomeView";
import LibraryView from "./views/LibraryView";

// Component Details ---------------------------------------------------------

function App() {
  return (

      <>

        <SharedContextProvider>

          <Router>

            <Navbar
                bg="info"
                className="mb-3"
                expand="lg"
                sticky="top"
                variant="dark"
            >

              <Navbar.Brand>
                Library Explorer
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-brand"/>

              <Navbar.Collapse id="basic-navbar-brand">
                <Nav className="mr-auto">
                  <LinkContainer to="/home">
                    <NavItem className="nav-link">Home</NavItem>
                  </LinkContainer>
                </Nav>
                <Nav className="mr-auto">
                  <LinkContainer to="/library">
                    <NavItem className="nav-link">Library</NavItem>
                  </LinkContainer>
                </Nav>
                {/* NavDropdown things can go here */}
                {/* Right-justified non-nav stuff can go here */}
                <Row className="mr-1">
                  <span className="text-right">
                    <LibrarySelector
                        label="Library:"
                    />
                  </span>
                </Row>
              </Navbar.Collapse>

            </Navbar>

            <Switch>
              <Route exact path="/library">
                <LibraryView/>
              </Route>
              <Route path="/">
                <HomeView/>
              </Route>
            </Switch>

          </Router>

        </SharedContextProvider>

      </>

  );

}

export default App;
