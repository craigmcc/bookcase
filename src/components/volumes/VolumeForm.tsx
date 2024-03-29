"use client"

// components/volumes/VolumeForm.tsx

/**
 * Input form for adding or editing a Volume.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Prisma, Volume} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import VolumeHeader from "./VolumeHeader";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import {SaveButton} from "@/components/shared/SaveButton";
import {Checkbox} from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {VolumePlus} from "@/types/models/Volume";
import {Parent} from "@/types/types";
import {
    VALID_VOLUME_LOCATIONS,
    VALID_VOLUME_TYPES,
    validateVolumeLocation,
    validateVolumeType
} from "@/util/ApplicationValidators";

// Public Objects ------------------------------------------------------------

type VolumeFormProps = {
    // Navigation route after back button [Not rendered]
    back?: string;
    // Navigation route after successful save operation
    dest: string;
    // Parent object for this Volume
    parent: Parent;
    // Show the back button and header title? [true]
    showHeader?: boolean;
    // Volume to be edited (id < 0 means adding)
    volume: VolumePlus;
}

export default function VolumeForm(props: VolumeFormProps) {

    console.log("VolumeForm.entry", JSON.stringify(props.volume));
    const form = useForm<Yup.InferType<typeof formSchema>>({
        defaultValues: {
            id: props.volume.id,
            active: (typeof props.volume.active === "boolean" ? props.volume.active : true),
            copyright: props.volume.copyright ? props.volume.copyright : "",
            googleId: props.volume.googleId ? props.volume.googleId : "",
            isbn: props.volume.isbn ? props.volume.isbn : "",
            libraryId: props.volume.libraryId,
            location: props.volume.location ? props.volume.location : "",
            name: props.volume.name ? props.volume.name : "",
            notes: props.volume.notes ? props.volume.notes : "",
            read: (typeof props.volume.read === "boolean" ? props.volume.read : false),
            type: props.volume.type ? props.volume.type : "",
        },
        mode: "onBlur",
        resolver: yupResolver(formSchema),
    });
    const router = useRouter();


    /**
     * Handle a validated form submit.
     */
    async function onSubmit(values: Yup.InferType<typeof formSchema>) {
        if (values.id && (values.id < 0)) {
            const input: Prisma.VolumeUncheckedCreateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await VolumeActions.insert(props.volume.libraryId, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input : Prisma.VolumeUpdateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await VolumeActions.update(props.volume.libraryId, values.id, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.volume.id < 0);
    const showHeader = (props.showHeader !== undefined) ? props.showHeader : true;

    return (
        <>

            {(showHeader) ? (
                <VolumeHeader
                    adding={adding}
                    back={props.back}
                    parent={props.parent}
                />
            ) : null }

            <Form {...form}>
                <form
                    className="container mx-auto space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >

                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Name of this Volume (must be unique within a Library)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Volume Location:</FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Volume location"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {VALID_VOLUME_LOCATIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Physical location of this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Volume Type:</FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Volume type"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {VALID_VOLUME_TYPES.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Type of content in this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Notes:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Miscellaneous notes about this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 space-x-4">
                        <FormField
                            control={form.control}
                            name="copyright"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Copyright:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Copyright Year (YYYY) of this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="googleId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Google ID:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Google Books identifier of this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isbn"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>ISBN:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        ISBN identifier of this Volume
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 space-x-2">
                        <FormField
                            control={form.control}
                            name="read"
                            render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            className="mr-2"
                                            onCheckedChange={() => field.onChange(!field.value)}
                                        />
                                    </FormControl>
                                    <FormLabel>Already Read?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            className="mr-2"
                                            onCheckedChange={() => field.onChange(!field.value)}
                                        />
                                    </FormControl>
                                    <FormLabel>Active Volume?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SaveButton/>
                   </div>

                </form>

            </Form>

        </>
    )

}

// Private Objects -----------------------------------------------------------

const formSchema = Yup.object().shape({
    id: Yup.number()
        .required(),
    active: Yup.boolean()
        .default(true),
    copyright: Yup.string()
        .defined(),
    googleId: Yup.string()
        .defined(),
    isbn: Yup.string()
        .defined(),
    libraryId: Yup.number()
        .required("Library ID is required"),
    location: Yup.string()
        .required("Location is required")
        .test("valid-location",
            "Invalid location value",
            (value) => validateVolumeLocation(value)
            ),
    name: Yup.string()
        .required("Name is required")
        .test("unique-name",
            "That name is already in use",
            async function (this) {
                const volume = this.parent as Volume;
                try {
                    const result = await VolumeActions.exact(volume.libraryId, volume.name);
                    return (result.id === volume.id);
                } catch (error) {
                    return true;        // Definitely unique
                }
            }),
    notes: Yup.string()
        .defined(),
    read: Yup.boolean()
        .defined(),
    type: Yup.string()
        .required("Type is required")
        .test("valid-type",
            "Invalid type value",
            (value) => validateVolumeType(value)
        ),
});
