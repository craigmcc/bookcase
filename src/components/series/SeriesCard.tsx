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
    const back = props.back ? props.back
        : `/base/${props.series.libraryId}/series/${props.series.id}`;
    const dest = props.dest ? props.dest
        : `/base/${props.series.libraryId}/series/${props.series.id}`;

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
