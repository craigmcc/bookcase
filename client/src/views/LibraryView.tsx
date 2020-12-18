// LibraryView ------------------------------------------------------------------

// This will eventually become the editing page for Library instances.

// External Modules ----------------------------------------------------------

import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import { SharedContext, SharedContextType } from "../contexts/SharedContext";
import Library from "../models/Library";
import LibraryForm from "../forms/LibraryForm";
import * as Replacers from "../util/Replacers";
import ReportError from "../util/ReportError";

// Component Details ---------------------------------------------------------

const LibraryView = () => {

    const sharedContext: SharedContextType = useContext(SharedContext);

    const [index, setIndex] = useState<number>(-1);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [library, setLibrary] = useState<Library | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        const retrieveLibraries = async () => {
            try {
                let newLibraries: Library[] = await LibraryClient.all();
                console.info("LibraryView.retrieveLibraries("
                    + JSON.stringify(newLibraries, Replacers.LIBRARY)
                    + ")");
                setLibraries(newLibraries);
            } catch (error) {
                ReportError("LibraryView.retrieveLibraries()", error);
            }
        }

        setRefresh(false);
        console.info("LibraryView.useEffect setRefreshLibraries(true)");
        sharedContext.setRefreshLibraries(true);
        retrieveLibraries();

    }, [refresh, sharedContext]);

    const handleIndex = (newIndex: number): void => {
        if (newIndex === index) {
            console.info("LibraryView.handleIndex(-1)");
            setIndex(-1);
            setLibrary(null);
        } else {
            console.info("LibraryView.handleIndex(" +
                + newIndex + ","
                + JSON.stringify(libraries[newIndex], Replacers.LIBRARY)
                + ")");
            setIndex(newIndex)
            setLibrary(libraries[newIndex]);
        }
    }

    const handleInsert = async (newLibrary: Library) => {
        try {
            let inserted: Library = await LibraryClient.insert(newLibrary);
            console.info("LibraryView.handleInsert("
                + JSON.stringify(inserted, Replacers.LIBRARY)
                + ")");
            setIndex(-1);
            setLibrary(null);
            setRefresh(true);
        } catch (error) {
            ReportError("LibraryView.handleInsert()", error);
        }
    }

    const handleRemove = async (removed: Library) => {
        try {
            await LibraryClient.remove(removed.id);
            console.info("LibraryView.handleRemove("
                + JSON.stringify(removed, Replacers.LIBRARY)
                + ")");
            setIndex(-1);
            setLibrary(null);
            setRefresh(true);
        } catch (error) {
            ReportError("LibraryView.handleRemove()", error);
        }
    }

    const handleUpdate = async (newLibrary: Library) => {
        try {
            let updated: Library = await LibraryClient.update(newLibrary.id, newLibrary);
            console.info("LibraryView.handleUpdate("
                + JSON.stringify(updated, Replacers.LIBRARY)
                + ")");
            setIndex(-1);
            setLibrary(null);
            setRefresh(true);
        } catch (error) {
            ReportError("LibraryView.handleUpdate()", error);
        }
    }

/*
    const listFields = [
        "name",
        "active",
        "notes",
    ];
*/

    const listHeaders = [
        "Name",
        "Active",
        "Notes",
    ];

    const onAdd = () => {
        console.info("LibraryView.onAdd()");
        setIndex(-2);
        const blankLibrary: Library = {
            id: -1,
            active: true,
            name: "",
            notes: "",
        };
        setLibrary(blankLibrary);
    }

    const onBack = () => {
        console.info("LibraryView.onBack()");
        setIndex(-1);
        setLibrary(null);
        // No need to setRefresh(true) here since the data did not change
    }

    const renderValue = (value: any): string => {
    if (typeof(value) === "boolean") {
        return value ? "Yes" : "No"
    } else if (!value) {
            return "";
        } else {
            return value;
        }
    }

    const values = (library: Library): string[] => {
        let results: string[] = [];
        results.push(renderValue(library.name));
        results.push(renderValue(library.active));
        results.push(renderValue(library.notes));
        return results;
    }

    return (
        <>
            <Container fluid id="LibraryView">

                {(!library) ? (

                    <>

                        <Row className="mb-3 ml-1 mr-1">
                            <Table
                                bordered
                                hover
                                size="sm"
                                striped
                            >

                                <thead>
                                <tr
                                    className="table-dark"
                                    key={100}
                                >
                                    <th
                                        className="text-center"
                                        colSpan={3}
                                        key={101}
                                    >
                                        All Libraries
                                    </th>

                                </tr>
                                <tr
                                    className="table-secondary"
                                    key={200}
                                >
                                    {listHeaders.map((header, index) => (
                                        <th
                                            key={200 + index + 1}
                                            scope="col"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {libraries.map((library, rowIndex) => (
                                    <tr
                                        className={"table-" +
                                        (rowIndex === index ? "primary" : "default")}
                                        key={1000 + (rowIndex * 100)}
                                        onClick={() => (handleIndex(rowIndex))}
                                    >
                                        {values(library).map((value: string, colIndex: number) => (
                                            <td
                                                data-key={1000 + (rowIndex * 100) + colIndex + 1}
                                                key={1000 + (rowIndex * 100) + colIndex + 1}
                                            >
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>

                            </Table>
                        </Row>

                        <Row className="ml-1 mr-1">
                            <Button
                                onClick={onAdd}
                                size="sm"
                                variant="primary"
                            >
                                Add
                            </Button>
                        </Row>

                    </>

                ) : null }

                {(library) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(library.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;Library
                                    </>
                                </strong>
                            </Col>
                            <Col className="text-right">
                                <Button
                                    onClick={onBack}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >
                                    Back
                                </Button>
                            </Col>
                        </Row>

                        <Row className="ml-2 mr-2">
                            <LibraryForm
                                handleInsert={handleInsert}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                                library={library}
                                onConfirmNegative={onBack}
                            />
                        </Row>

                    </>

                ) : null }

            </Container>

        </>
    )

}

export default LibraryView;
