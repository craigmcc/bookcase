"use client"

// components/stories/AuthorItems.tsx

/**
 * Abbreviated list of Authors that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import {CheckBox} from "@/components/shared/CheckBox";
import {Pagination} from "@/components/shared/Pagination";
import {SearchBar} from "@/components/shared/SearchBar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
//    TableHead,
//    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {AuthorPlus} from "@/types/models/Author";
import {LibraryPlus} from "@/types/models/Library";
import {SeriesPlus} from "@/types/models/Series";
import {StoryPlus} from "@/types/models/Story";
import {VolumePlus} from "@/types/models/Volume";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type AuthorItemsProps = {
    // Parent model for which to retrieve Authors
    parent: LibraryPlus | SeriesPlus | StoryPlus | VolumePlus;
    // Show principal values? [false]
    showPrincipal?: boolean;
    // TODO - will need navigation actions?
}

export default function AuthorItems(props: AuthorItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [authors, setAuthors] = useState<AuthorPlus[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 2;
    const [principals, setPrincipals] = useState<boolean[]>([]);
    const [search, setSearch] = useState<string>("");

    // Select the Authors that match the specified filter criteria
    useEffect(() => {

        async function fetchAuthors() {

            console.log("AuthorItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            let results: AuthorPlus[] = [];
            switch (_model) {

                case "Library":
                    results = await AuthorActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Series":
                    // @ts-ignore
                    results = await SeriesActions.authors(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Story":
                    // @ts-ignore
                    results = await StoryActions.authors(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Volume":
                    // @ts-ignore
                    results = await VolumeActions.authors(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                default:
                    alert(`AuthorItems: Unsupported parent model ${_model}`);
                    setAuthors([]);
                    break;

            }

            // TODO: sort by lastName/firstName first?
            setAuthors(results);

            // Save principals in case we were requested to display them
            const prins: boolean[] = [];
            for (const result of results) {
                if (props.showPrincipal) {
                    // @ts-ignore
                    prins.push(Boolean(result["_principal"]));
                } else {
                    prins.push(false);
                }
            }
            setPrincipals(prins);

        }

        fetchAuthors();

    }, [active, currentPage, search, props.parent, props.showPrincipal]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Authors</CardTitle>
                <CardContent className="p-1">

                    <div className="w-auto py-1">
                        <SearchBar
                            handleChange={(newSearch) => setSearch(newSearch)}
                            placeholder="Series name"
                            value={search}
                        />
                    </div>
                    <div className="flex flex-1 gap-2 py-1">
                        <CheckBox
                            handleValue={(newValue) => setActive(newValue)}
                            label="Active Only?"
                            value={active}
                        />
                        <Pagination
                            currentPage={currentPage}
                            handleNext={() => setCurrentPage(currentPage + 1)}
                            handlePrevious={() => setCurrentPage(currentPage - 1)}
                            lastPage={(authors.length === 0) ||
                                (authors.length < pageSize)}
                            size="xs"
                        />
                    </div>
                    <div className="w-full">
                        <hr/>
                    </div>


                    <Table className="container mx-auto">
{/*
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-auto p-1">Name</TableHead>
                            </TableRow>
                        </TableHeader>
*/}
                        <TableBody>
                            {authors.map((author, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        <Link href={`/base/${author.libraryId}/authors/${author.id}`}>
                                            {author.lastName}, {author.firstName}
                                            {(props.showPrincipal && principals[index]) ? (
                                                <span className="text-blue-500"> *</span>
                                            ) : null }
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </CardHeader>
        </Card>
    )

}
