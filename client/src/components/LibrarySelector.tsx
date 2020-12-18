// LibrarySelector -----------------------------------------------------------

// Selector drop-down to choose which Library the user wants to interact with.
// The selected object is stored in SharedContext for use by other components.

// TODO - the refreshLibraries flag in SharedContext is not effective

// External Modules ----------------------------------------------------------

import React, { useContext, useEffect, useState } from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import { SharedContext, SharedContextType } from "../contexts/SharedContext";
import {OnChange} from "./Types";
import Library from "../models/Library";
import * as Replacers from "../util/Replacers";
import ReportError from "../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    all?: boolean;              // Offer all Libraries, not just active? [false]
    autoFocus?: boolean;        // Should this element receive autoFocus? [false]
    disabled?: boolean;         // Should this element be disabled? [false]
    handleLibrary?: (library: Library) => void;
                                // Handle (library) when a new one is selected
                                // (no external handler)
    label?: string;              // Selector label [Library:]
    onChange?: OnChange;        // Handle (event) when value changes [*REQUIRED]
}

/*
export const UserContext = React.createContext<partial<user>>({});
   </partial<user>exportconst CompanyContext = React.createContext<partial<company>>({});</partial<company>
*/

// Component Details ---------------------------------------------------------

export const LibrarySelector = (props: Props) => {

    const sharedContext: SharedContextType = useContext(SharedContext);

    const [libraries, setLibraries] = useState<Library[]>([]);

    useEffect(() => {

        const retrieveLibraries = async () => {
            try {
                let newLibraries: Library[] = [];
                if (props.all) {
                    newLibraries = await LibraryClient.all();
                } else {
                    newLibraries = await LibraryClient.active();
                }
                console.info("LibrarySelector.retrieveLibraries("
                    + JSON.stringify(newLibraries, Replacers.LIBRARY)
                    + ")");
                setLibraries(newLibraries);
            } catch (error) {
                ReportError("LibrarySelector.retrieveLibraries()", error);
                setLibraries([
                    { id: -1, active: false, name: "(Error Occurred)"}
                ]);
            }
        }

        retrieveLibraries();
        console.info("LibrarySelector.useEffect setRefreshLibraries(false)");
        sharedContext.setRefreshLibraries(false);

    }, [props.all, sharedContext]);

    const onChange = (event: any) : void => {
        let newIndex: number = Number(event.target.value);
        let newLibrary: Library = libraries[newIndex];
        console.info("LibrarySelector.onChange("
            + newIndex + ", "
            + JSON.stringify(newLibrary, Replacers.LIBRARY)
            + ")");
        if (props.handleLibrary) {
            props.handleLibrary(newLibrary);
        }
//        setIndex(newIndex);
        sharedContext.setLibrary(newLibrary);
    }

    return (

        <>

        <label
            className="mr-2"
        >
            {props.label ? props.label : "Library:"}
        </label>

        <select
            autoFocus={props.autoFocus ? props.autoFocus : undefined}
            disabled={props.disabled ? props.disabled : undefined}
            onChange={onChange}
        >
            {libraries.map((library, index) => (
                <option key={index} value={index}>
                    {library.name}
                </option>
            ))}
        </select>

        </>

    );

}

export default LibrarySelector;
