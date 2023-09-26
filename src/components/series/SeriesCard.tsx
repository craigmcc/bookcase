"use client"

// components/series/SeriesCard.tsx

/**
 * Wrapper around SeriesForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import SeriesForm from "./SeriesForm";
import SeriesHeader from "./SeriesHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {SeriesPlus} from "@/types/models/Series";
import {Parent} from "@/types/types";
import {validateHref} from "@/util/ApplicationValidators";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";
import {usePathname, useSearchParams} from "next/navigation";

// Public Objects ------------------------------------------------------------

type SeriesCardProps = {
    // Navigation route for Back button [/base/:libraryId/series/:seriesId]
    back?: string,
    // Navigation route after successful save [/base/:libraryId/series/:seriesId]
    dest?: string,
    // Parent object for this Series
    parent: Parent;
    // Series to be edited (id < 0 means adding)
    series: SeriesPlus,
}

export default function SeriesCard(props: SeriesCardProps) {

    const adding = (props.series.id < 0);

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.series.name,
        });
    }
    console.log("SeriesCard.pathname", pathname);

    // Calculate relevant navigation hrefs
    const searchParams = useSearchParams();
    const back = searchParams.has("back") && validateHref(searchParams.get("back")!)
        ? searchParams.get("back")!
        : `/base/${props.series.libraryId}/series/${props.series.id}`;
    const dest = searchParams.has("dest") && validateHref(searchParams.get("dest")!)
        ? searchParams.get("dest")!
        : `/base/${props.series.libraryId}/series/${props.series.id}`;
    console.log("SeriesCard.back", back);
    console.log("SeriesCard.dest", dest);

    // Render the requested content
    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <SeriesHeader
                        adding={adding}
                        back={back}
                        parent={props.parent}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <SeriesForm
                    dest={dest}
                    parent={props.parent}
                    showHeader={false}
                    series={props.series}
                />
            </CardContent>
        </Card>
    )

}
