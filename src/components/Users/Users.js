import React from "react";
import { Table, Container} from 'react-bootstrap';

export function Users() {
        return (
            <Container>
                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>E-Mail</th>
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

export default Users;