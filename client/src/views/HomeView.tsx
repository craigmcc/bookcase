// HomeView ------------------------------------------------------------------

// This will eventually become a login page or something.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

// Component Details ---------------------------------------------------------

const HomeView = () => {

    return (
        <>
            <Container fluid id="HomeView">
                <p>
                    This is HomeView for NODE_ENV {process.env.NODE_ENV}.
                </p>
                <p>
                    Entire Environment:
                    {JSON.stringify(process.env, null, 2)}
                </p>
            </Container>
        </>
    )

}

export default HomeView;
