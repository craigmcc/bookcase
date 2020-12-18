// LibraryForm ---------------------------------------------------------------

// Detail editing form for Library objects.

// External Modules ----------------------------------------------------------

import React, { useState } from "react";
import { Formik, FormikHelpers, FormikValues } from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import { OnClick } from "../components/Types";
import Library from "../models/Library";
import * as Replacers from "../util/Replacers";
import { toEmptyStrings, toNullValues } from "../util/Transformations";
import LibraryClient from "../clients/LibraryClient";

export type HandleLibrary = (library: Library) => void;

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;        // Should first element receive autoFocus? [false]
    handleInsert: HandleLibrary;// Handle (library) insert request [no handler]
    handleRemove: HandleLibrary;// Handle (library) remove request [no handler]
    handleUpdate: HandleLibrary;// Handle (library) update request [no handler]
    library: Library;           // Library with initial values, id<0 for adding
    onConfirmNegative: OnClick; // Handle (event) on negative remove [no handler]
}

// Component Details ---------------------------------------------------------

const LibraryForm = (props: Props) => {

    const [adding] = useState<boolean>(props.library.id < 0);
    const [initialValues] = useState(toEmptyStrings(props.library));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
//    const [validated, setValidated] = useState<boolean>(false);

    const handleInsert = (values: any) => {
        console.info("LibraryForm.handleInsert("
            + JSON.stringify(values, Replacers.LIBRARY)
            + ")");
        if (props.handleInsert) {
            props.handleInsert(toNullValues(values));
        } else {
            alert("LibraryForm: Programming error, no handleInsert defined,"
                + "so no insert is possible.");
        }
    }

    const handleRemove = (values: any) => {
        console.info("LibraryForm.handleRemove("
            + JSON.stringify(values, Replacers.LIBRARY)
            + ")");
        if (props.handleRemove) {
            props.handleRemove(initialValues);
        } else {
            alert("LibraryForm: Programming error, no handleRemove defined,"
                + "so no remove is possible.");
        }
    }

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>) => {
        console.info("LibraryForm.handleSubmit("
            + JSON.stringify(values)
            + ")");
        actions.setSubmitting(true);
        if (adding) {
            handleInsert(values);
        } else {
            handleUpdate(values);
        }
        actions.setSubmitting(false);
    }

    const handleUpdate = (values: any) => {
        console.info("LibraryForm.handleUpdate("
            + JSON.stringify(values, Replacers.LIBRARY)
            + ")");
        if (props.handleUpdate) {
            props.handleUpdate(toNullValues(values));
        } else {
            alert("LibraryForm: Programming error, no handleUpdate defined,"
                + "so no update is possible.");
        }
    }

    const onConfirm = () => {
        console.info("LibraryForm.onConfirm()");
        setShowConfirm(true);
    }

    const onConfirmNegative = (event: React.MouseEvent<HTMLElement>) => {
        console.info("LibraryForm.onConfirmNegative()");
        setShowConfirm(false);
        if (props.onConfirmNegative) {
            props.onConfirmNegative(event);
        }
    }

    const onConfirmPositive = (event: React.MouseEvent<HTMLElement>) => {
        console.info("Library.onConfirmPositive()");
        setShowConfirm(false);
        handleRemove(event);
    }

    const validateUniqueName = async (name: any, id: number) => {
/*
        console.info("LibraryForm.validateUniqueInfo("
            + id + ", "
            + name
            + ")");
*/
        try {
            let current: Library = await LibraryClient.exact(name);
            // OK if it is the same row
            return (current.id === id);
        } catch (error) {
            // Not found, so definitely unique
            return true;
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            name: Yup.string()
                .required("Name is required")
                .test("unique-name",
                    "That name is already in use",
                    (value) => validateUniqueName(value, props.library.id)),
            notes: Yup.string()
        })
    }

    return (

        <>

            {/* Details Form */}
            <Container id="LibraryForm">

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
                    }}
                    validateOnBlur={true}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >

                    {( {
                           errors,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           isValid,
                           touched,
                           values,
                       }) => (

                        <>

                            <Form
                                //className="ml-1 mr-1"
                                //inline
                                noValidate
                                onSubmit={handleSubmit}
                                //validated={validated}
                            >

                                <Form.Row id="nameRow">
                                    <Form.Group
                                        as={Row}
                                        controlId="name"
                                    >
                                        <Form.Label>
                                            Name:
                                        </Form.Label>
                                        <Form.Control
                                            autoFocus={props.autoFocus ? props.autoFocus : undefined}
                                            htmlSize={30}
                                            isInvalid={touched.name && !!errors.name}
                                            isValid={!errors.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            //size="lg"
                                            type="text"
                                            value={values.name}
                                        />
                                        <Form.Control.Feedback type="valid">
                                            Name is required and must be globally unique.
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row id="activeRow">
                                    <Form.Group
                                        as={Row}
                                        controlId="active"
                                    >
                                        <Form.Check
                                            feedback={errors.active}
                                            defaultChecked={values.active}
                                            id="active"
                                            //isInvalid={touched && !!errors.active}
                                            label="Active?"
                                            name="active"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            //value={values.active}
                                        />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row id="notesRow">
                                    <Form.Group
                                        as={Row}
                                        controlId="notes"
                                    >
                                        <Form.Label>
                                            Notes:
                                        </Form.Label>
                                        <Form.Control
                                            htmlSize={60}
                                            isInvalid={touched.notes && !!errors.notes}
                                            isValid={touched.notes && !errors.notes}
                                            name="notes"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            //size="lg"
                                            type="text"
                                            value={values.notes}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.notes}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Row className="mb-3">
                                    <Col className="col-10">
                                        <Button
                                            disabled={isSubmitting}
                                            size="sm"
                                            type="submit"
                                            variant="primary"
                                        >
                                            Save
                                        </Button>
                                    </Col>
                                    <Col className="col-2 float-right">
                                        <Button
                                            disabled={adding}
                                            onClick={onConfirm}
                                            size="sm"
                                            type="button"
                                            variant="danger"
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>

                        </>

                    )}

                </Formik>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this Library is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Library as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default LibraryForm;
