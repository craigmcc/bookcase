import React, { useState } from "react";
import Table from "react-bootstrap/Table";

// List ----------------------------------------------------------------------

// Generic component that renders a list of items in a <Table> component,
// with an option to override the logic that generates each <tr>.  The
// default row generator implementation just renders the item properties
// listed in the "fields" list, using a custom or default column generator
// for each individual "td" element.

// Incoming Properties -------------------------------------------------------

// These properties are for the List component itself:

// bordered                 Show borders around the entire table?  [false]
// fields                   Array of Strings containing field names to be
//                          rendered, which determines how many columns are
//                          rendered as a side effect [*REQUIRED*]
// footer                   Show <tfoot> with same column headings as
//                          <thead>?  [false]
// handleIndex              Handle (index) when new row selected [no handler]
// headers                  Array of Strings containing column header labels
//                          to be rendered in the <thead> (and optional
//                          <tfoot> elements [column header labels not rendered]
// headersClassName         CSS styles for headers <tr> [generator default]
// headersGenerator         Generator component for the <tr>...</tr>
//                          containing the column labels in the <thead>
//                          (and optionally <tfoot>) elements
//                          [DefaultHeadersGenerator]
// hover                    Enable hover state on table rows? [false]
// index                    Zero-relative index of the selected row or -1 for none
// items                    Array of objects that will be rendered,
//                          one per row in <tbody> [*REQUIRED*]
// size                     Table size (lg|sm) [sm]
// striped                  Show zebra-striping on table rows/ [false]
// tdGenerator              Generator component for each individual field's
//                          <td>...</td> element within a <tr>...</tr>
//                          in the <tbody> element [{DefaultTdGenerator}]
// tdXxxxx                  Optional custom properties to pass on to the
//                          tdGenerator component (passed as is)
// title                    Optional extra heading above the column labels
//                          in the <thead> element, spanning all of the
//                          underlying columns [no extra heading]
// titleClassName           CSS styles for title <tr> [generator default]
// titleGenerator           Generator component for the <tr>...</tr>
//                          containing the table title in the <thead>
//                          element [{DefaultTitleGenerator}]
// trGenerator              Generator component for each item's
//                          <tr>...</tr> element in the <tbody> element
//                          [{DefaultTrGenerator}]
// trXxxxx                  Optional custom properties to pass on to the
//                          trGenerator component (passed as is)
// variant                  Specify table variant (dark|...) [not rendered]

// Properties passed on to each generator (default or otherwise) are listed
// in the descriptions of the default generator components below.


// List Component Details ----------------------------------------------------

const List = (props) => {

// TODO - dynamic component selection not passing props at compile time?
    /*
    const [HeadersGenerator] =
        useState(props.headersGenerator ? props.headersGenerator : DefaultHeadersGenerator);
    const [TdGenerator] =
        useState(props.tdGenerator ? props.tdGenerator : DefaultTdGenerator);
    const [TitleGenerator] =
        useState(props.titleGenerator ? props.titleGenerator : DefaultTitleGenerator);
    const [TrGenerator] =
        useState(props.trGenerator ? props.tdGenerator: DefaultTrGenerator);
*/

    const [index, setIndex] = useState(props.index ? props.index : -1);

    const handleIndex = (newIndex) => {
//        console.info("List.handleIndex(" + newIndex + ")");
        setIndex(newIndex);
        if (props.handleIndex) {
            props.handleIndex(newIndex);
        }
    }

    return (

        <Table
            bordered={props.bordered ? props.bordered : null}
            hover={props.hover ? props.hover : null}
            size={props.size ? props.size : "sm"}
            striped={props.striped ? props.striped : null}
            variant={props.variant ? props.variant : null}
        >

            {/* <thead> section */}
            {props.headers || props.title ? (
                <thead>
                {props.title ? (
                    <DefaultTitleGenerator
                        headers={props.headers ? props.headers : null}
                        keyBase={100}
                        title={props.title}
                        titleClassName={props.titleClassName ? props.titleClassName : null}
                    />
                ) : null }
                { props.headers ? (
                    <DefaultHeadersGenerator
                        headers={props.headers}
                        headersClassName={props.headersClassName ? props.headersClassName : null}
                        keyBase={200}
                    />
                ) : null }
                </thead>
            ) : null }

            {/* <tbody> section */}
            {props.items ? (
                <tbody>
                {props.items.map((item, rowIndex) => (
                    <>
                    <DefaultTrGenerator
                        fields={props.fields}
                        handleIndex={handleIndex}
                        item={item}
                        keyBase={1000 + (rowIndex * 100)}
                        matchIndex={index}
                        rowIndex={rowIndex}
                    />
                    </>
                ))}
                </tbody>
            ) : null }


            {/* <tfoot> section */}
            {props.headers && props.footer ? (
                <tfoot>
                    <DefaultHeadersGenerator
                        headers={props.headers}
                        headersClassName={props.headersClassName ? props.headersClassName : null}
                        keyBase={300}
                    />
                </tfoot>
            ) : null }

        </Table>

    );

}

// DEFAULT CUSTOMIZATION COMPONENTS ==========================================

// DefaultHeadersGenerator ---------------------------------------------------

// Default generator for a <tr>...</tr> element containing labels for the
// specified column headers.  Also used in the footer if requested.

// Incoming Properties -------------------------------------------------------

// headers                  Array of Strings with header labels [*REQUIRED*]
// headersClassName         CSS styles for <tr> [table-secondary]
// keyBase                  Base for generating unique element keys [*REQUIRED*]

// Component Details ---------------------------------------------------------

export const DefaultHeadersGenerator = (props) => {

    return (
        <tr
            className={ props.headersClassName ? props.headersClassName : "table-secondary"}
            // data-key={props.keyBase}
            key={props.keyBase}
        >
            {props.headers.map((header, index) => (
                <th
                    // data-key={props.keyBase + (index + 1)}
                    key={props.keyBase + (index + 1)}
                    scope="col"
                >
                    {header}
                </th>
            ))}
        </tr>
    );

}

// ===========================================================================

// DefaultTdGenerator --------------------------------------------------------

// Default generator for a <td>...</td> element for a specific field.  Supports
// customization of boolean fields based on optional properties.

// Incoming Properties -------------------------------------------------------

// colIndex                 Zero-relative index of this column
// keyBase                  Base for generating unique element keys [*REQUIRED*]
// rowIndex                 Zero-relative index of this row (for calculating key)
// name                     Field name for the value being rendered
// value                    Field value that is to be rendered in <td>...</td>

// Component Details --------------------------------------

export const DefaultTdGenerator = (props) => {

    const [ tdBooleanFalse ] = useState(props.booleanFalse ? props.booleanFalse : "No");
    const [ tdBooleanTrue ] = useState(props.booleanTrue ? props.booleanTrue : "Yes");

    let renderField = (field) => {
        if (typeof(field) === "boolean") {
            return field ? tdBooleanTrue : tdBooleanFalse;
        } else {
            return field;
        }
    }

    return (

        <td
            // data-key={props.keyBase + props.colIndex + 1}
            key={props.keyBase + props.colIndex + 1}
        >
            {renderField(props.value)}
        </td>

    )

}

// DefaultTitleGenerator -----------------------------------------------------

// Default generator for a <tr>...</tr> element containing the title portion
// of the <thead> element.

// Incoming Properties -------------------------------------------------------

// headers                  Array of Strings with header labels, used only
//                          to count how many columns to span [*REQUIRED*]
// keyBase                  Base for generating unique element keys [*REQUIRED*]
// title                    Title text to be rendered [*REQUIRED*]
// titleClassName           CSS styles for <tr> [table-dark]

// Component Details ---------------------------------------------------------

export const DefaultTitleGenerator = (props) => {

    return (
        <tr
            className={props.titleClassName ? props.titleClassName : "table-dark"}
            // data-key={props.keyBase}
            key={props.keyBase}
        >
            <th
                className="text-center"
                colSpan={props.headers ? props.headers.length : 1}
                // data-key={props.keyBase + 1}
                key={props.keyBase + 1}
            >
                {props.title}
            </th>
        </tr>
    );
}

// ===========================================================================

// DefaultTrGenerator --------------------------------------------------------

// Default generator for a <tr>...</tr> element for a specific item.  Uses the
// specified or default tdGenerator implementation for each field.

// Incoming Properties --------------------------------------------------------

// fields                   Names of the fields we will be rendering
// handleIndex              Handle (index) for newly selected row [no handler]
// item                     Item whose fields are to be handed to tdGenerator
// keyBase                  Base for generating unique element keys [*REQUIRED*]
// matchIndex               Zero-relative index for row to highlight, or -1
// rowIndex                 Zero-relative index for this row

// Component Details -----------------------------------------------------------

export const DefaultTrGenerator = (props) => {

    return (
        <tr
            className={"table-" +
                (props.rowIndex === props.matchIndex ? "primary" : "default")}
            // data-key={props.keyBase}
            key={props.keyBase}
            onClick={() => {
                if (props.handleIndex) {
                    props.handleIndex(props.rowIndex)
                }
            }}
        >
            {props.fields.map((field, colIndex) => (
                <DefaultTdGenerator
                    colIndex={colIndex}
                    keyBase={props.keyBase}
                    name={field}
                    rowIndex={props.rowIndex}
                    value={props.item[field]}
                />
            ))}
        </tr>
    );

}

export default List;
