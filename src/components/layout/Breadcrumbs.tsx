"use client"
// components/layout/Breadcrumbs.tsx

/**
 * Render a breadcrumb trail based on an array persisted in local storage.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";
import {Icons} from "@/components/layout/Icons";

// Public Objects ------------------------------------------------------------

export default function Breadcrumbs() {

    const breadcrumbItems = BreadcrumbUtils.current();

    return (
/*
        <div className="flex flex-row">
            {breadcrumbItems.map((item, index) => (
                <>
                {(index > 0) ? (
                    <span> | </span>
                ) : null }
                Icon(item)
                Item(item, index)
            ))}
        </div>
*/
        <div className="flex flex-row">
            {breadcrumbItems.map((item, index) => (
                <>
                    <Item index={index} item={item} key={index}/>
                </>
            ))}
        </div>

    )

}

// Private Objects -----------------------------------------------------------

type IconProps = {
    item: BreadcrumbUtils.BreadcrumbItem,
}

/**
 * Return the UI for the Icon for the specified BreadcrumbItem
 */
function Icon(props: IconProps) {
    if (props.item.href.includes("/authors")) {
        return <Icons.Author/>;
    } else if (props.item.href.includes("/series")) {
        return <Icons.Series/>;
    } else if (props.item.href.includes("/stories")) {
        return <Icons.Story/>;
    } else if (props.item.href.includes("/volumes")) {
        return <Icons.Volume/>;
    } else {
        return <Icons.Library/>;
    }
}

type ItemProps = {
    item: BreadcrumbUtils.BreadcrumbItem;
    index: number;
}

/**
 * Return the UI for the specified BreadcrumbItem
 */
function Item(props: ItemProps) {
    return (
        <>
            <Icon item={props.item}/>
            <Link className="text-info ps-1 hover:underline" href={props.item.href}>
                {props.item.label}
            </Link>
        </>
    )
}

