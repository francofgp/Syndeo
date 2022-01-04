import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function FormContainer({ children }) {
  /* el children es todo lo que yo le meto dentro del componente - ver login screen */
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default FormContainer;
