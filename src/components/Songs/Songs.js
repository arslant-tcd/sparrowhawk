import React from "react";
import { Table, Container} from 'react-bootstrap';

export function Songs() {
        return (
            <Container>
                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Song ID</th>
                        <th>Song Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Test 1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Test 2</td>
                    </tr>
                </tbody>
            </Table>
            </Container>  
        );
    }

export default Songs;