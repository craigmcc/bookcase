"use client"

// components/select/SelectLibraryForm.tsx

/**
 * Form for the /select page to choose which Library the user wants to
 * interact with.  Must be a client component so that we can update
 * LibraryContext with the selected Library.
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {ChangeEvent, useContext, useState} from "react";
//import * as z from "zod";
//import {zodResolver} from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import {LibraryPlus} from "@/actions/LibraryActions";
import {LibraryContext} from "@/components/layout/LibraryContext";
import {Button} from "@/components/ui/button";
import {SelectOption} from "@/types/types";
/*
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useForm} from "react-hook-form";
*/

// Public Objects ------------------------------------------------------------

type SelectLibraryFormProps = {
    // The set of Libraries to be offered to the current user (must be filtered
    // by authorization scopes).
    libraries: LibraryPlus[];
}


export default function SelectLibraryForm(props: SelectLibraryFormProps) {

    const [libraryId, setLibraryId] = useState<number>(-1);
/*
    const formSchema = z.object({
        libraryId: z.string(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            libraryId: "-1",
        },
        mode: "onChange",
        resolver: zodResolver(formSchema),
    });
*/
    const libraryContext = useContext(LibraryContext);
    const options: SelectOption[] = [];
    options.push({
        label: "Select a Library",
        value: "-1",
    });
    for (const library of props.libraries) {
        options.push({
            label: library.name,
            value: String(library.id),
        });
    }

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        //console.log("onChange", event.target.value);
        setLibraryId(Number(event.target.value))
    }

    function onSubmit() {
        //console.log("onSubmit", libraryId);
        libraryContext.library = null;
        for (const library of props.libraries) {
            if (libraryId === library.id) {
                libraryContext.library = library;
            }
        }
        //console.log("onChosen", libraryContext.library);
        redirect("/base");
    }

    /*
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("SPECIFIED", values);
        const libraryId = Number(values.libraryId);
        libraryContext.library = null;
        for (const library of props.libraries) {
            if (libraryId === library.id) {
                libraryContext.library = library;
                break;
            }
        }
        console.log("SELECTED", libraryContext.library);
    }
*/

    return (
        <>
            <select
                className="mb-2 border-2 w-full"
                onChange={onChange}
                value={libraryId}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Button
                className="bg-primary p-2 w-full"
                disabled={libraryId === -1}
                onClick={onSubmit}
            >
                Select Library
            </Button>
        </>
/*
        <Form {...form}>
            <form
                className="mx-auto p-2"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="libraryId"
                    render={({field}) => (
                        <FormItem>
                            <Select
                                defaultValue="-1"
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a library"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {props.libraries.map((library, index) => (
                                        <SelectItem key={index} value={String(library.id)}>
                                            {library.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            </form>
            {/!* TODO: disable if no choice made yet *!/}
            <Button className="bg-primary w-full" type="submit">
                Select Library
            </Button>
        </Form>
*/
    )

}
