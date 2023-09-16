"use client"

// components/serieses/SeriesItems.tsx

/**
 * Abbreviated list of Series that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
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
import {StoryPlus} from "@/types/models/Story";
import {SeriesPlus} from "@/types/models/Series";
//import {HandleBoolean, HandleString} from "@/types/types";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type SeriesItemsProps = {
    // Parent model for which to retrieve Series
    parent: AuthorPlus | LibraryPlus | StoryPlus;
    // TODO - will need navigation actions?
}

export default function SeriesItems(props: SeriesItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 2;
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [serieses, setSerieses] = useState<SeriesPlus[]>([]);

    // Select the Series that match the specified filter criteria
    useEffect(() => {

        async function fetchSeries() {

            console.log("SeriesItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            switch (_model) {

                case "Author":
                    // @ts-ignore
                    setSerieses(await AuthorActions.series(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    }));
                    break;

                case "Library":
                    setSerieses(await SeriesActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    }));
                    break;

                case "Story":
                    // @ts-ignore
                    setSerieses(await StoryActions.series(props.parent.libraryId, props.parent.id), {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                default:
                    alert(`SeriesItems: Unsupported parent model ${_model}`);
                    setSerieses([]);
                    break;

            }

        }

        fetchSeries();

    }, [active, currentPage, search, props.parent]);

    // No access validation needed, since this is not a page

    /**
     * Add a breadcrumb for this selection, and route to the
     * corresponding href.
     *
     * @param series                    The selected Series
     */
    function onSelect(series: SeriesPlus): void {
        const href = `/base/${series.libraryId}/series/${series.id}`;
        BreadcrumbUtils.add({
            href: href,
            label: series.name,
        });
        router.push(href);
    }

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Series</CardTitle>
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
                            lastPage={(serieses.length === 0) ||
                                (serieses.length < pageSize)}
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
                            {serieses.map((series, index) => (
                                <TableRow key={`Series.${series.id}`}>
                                    <TableCell className="p-1">
                                        <span
                                            className="hover:underline"
                                            onClick={() => onSelect(series)}
                                        >
                                            {series.name}
                                        </span>
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
