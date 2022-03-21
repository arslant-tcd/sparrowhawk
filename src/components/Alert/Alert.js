import React from "react";
import { Alert, Container } from 'react-bootstrap';

class MainAlert extends React.Component {
    render() {
        return (
            <Container>
                <Alert variant="success">
                    <Alert.Heading>Welcome!</Alert.Heading>
                    <p>
                        You can explore music and browse our recommendations.
                    </p>
                    <hr />
                    <p className="mb-0">
                        You can join our portal!
                    </p>
                </Alert>
            </Container>
        );
    }
}
export default MainAlert; 