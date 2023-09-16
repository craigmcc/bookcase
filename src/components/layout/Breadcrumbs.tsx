"use client"
// components/layout/Breadcrumbs.tsx

/**
 * Render a breadcrumb trail based on an array persisted in local storage.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";
import {Icons} from "@/components/layout/Icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
                <span key={`Breadcrumbs.${index}`}>
                    {(index > 0) ? (
                        <span>&nbsp;|&nbsp;</span>
                    ) : null }
                    <Item index={index} item={item}/>
                </span>
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
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipContent>
                        <p>Author</p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Icons.Author/>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        );
    } else if (props.item.href.includes("/series")) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipContent>
                        <p>Series</p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Icons.Series/>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        );
    } else if (props.item.href.includes("/stories")) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipContent>
                        <p>Story</p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Icons.Story/>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        );
    } else if (props.item.href.includes("/volumes")) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipContent>
                        <p>Volume</p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Icons.Volume/>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        );
    } else {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipContent>
                        <p>Library</p>
                    </TooltipContent>
                    <TooltipTrigger>
                        <Icons.Library/>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        );
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

    const router = useRouter();

    /**
     * Clear breadcrumbs back to one with the specified href,
     * and return the href to link to.
     */
    function onSelect(item: BreadcrumbUtils.BreadcrumbItem): void {
        const href = item.href;
        BreadcrumbUtils.trim(href);
        router.push(href);
    }

    return (
        <span key={`Breadcrumb.${props.item.href}`}>
            <Icon item={props.item}/>
            <span
                className={"text-info ps-1 hover:underline"}
                onClick={() => onSelect(props.item)}
            >
                {props.item.label}
            </span>
        </span>
    )
}

