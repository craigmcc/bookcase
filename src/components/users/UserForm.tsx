"use client"

// components/users/UserForm.tsx

/**
 * Input form for adding or editing a User.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Prisma, User} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
import {BackButton} from "@/components/shared/BackButton";
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

// Public Objects ------------------------------------------------------------

type UserFormProps = {
    // Navigation destination after successful save operation.
    destination?: string,
    // User to be edited
    user: User;
}

export default function UserForm(props: UserFormProps) {

    //console.log("UserForm.entry", JSON.stringify(props.user));
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            id: props.user.id,
            active: (typeof props.user.active === "boolean") ? props.user.active : true,
            google_books_api_key: props.user.google_books_api_key ? props.user.google_books_api_key : "",
            name: props.user.name ? props.user.name : "",
            password: props.user.password ? props.user.password : "",
            scope: props.user.scope ? props.user.scope : "",
            username: props.user.username ? props.user.username : "",
        },
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        //console.log("VALUES", JSON.stringify(values));
        if (values.id < 0) {
            const input: Prisma.UserCreateInput = {
                ...values,
                password: values.password ? values.password : "", // Can not happen
            }
            console.log("INSERT INPUT", JSON.stringify(input));
            try {
                await UserActions.insert(input);
                router.push(props.destination ? props.destination : "/users");
            } catch (error) {
                // TODO: - something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input: Prisma.UserUpdateInput = {
                ...values,
            }
            console.log("UPDATE INPUT", JSON.stringify(input));
            try {
                await UserActions.update(props.user.id, input);
                router.push(props.destination ? props.destination : "/users");
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.user.id < 0);

    return (
        <>

            <div className="grid grid-cols-3">
                <div>
                    <BackButton href="/users"/>
                </div>
                <div className="text-center">
                    <strong>
                        {(adding)? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;User
                    </strong>
                </div>
                <div/>
            </div>

            <Form {...form}>
                <form
                    className="container mx-auto py-6 space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Name of this User.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scope"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scope:</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Space-separated scope(s) granted to this user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username:</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Sign in username of this User (must be unique).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password:</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Sign in password of this User (set this ONLY on new Users or if you wish to change the password for an existing User).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* TODO: more stuff for Library-specific scopes */}

                    <div className="grid grid-cols-2 space-x-2">

                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            className="mr-2"
                                            onCheckedChange={() => field.onChange(!field.value)}
                                        />
                                    </FormControl>
                                    <FormLabel>Active User?</FormLabel>
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

const formSchema = z.object({
    id: z.number(),
    active: z.boolean().optional(),
    google_books_api_key: z.string().optional(),
    name: z.string()
        .nonempty(),
    password: z.string().optional(), // TODO: required on insert, optional on update
    scope: z.string()
        .nonempty(), // TODO: format validity, allowed scope?
    username: z.string()
        .nonempty(), // TODO: uniqueness check
})
    // Verify username is not already in use
    .superRefine(async (user, context) => {
        console.log("GET USERNAME REFINE RESPONSE", JSON.stringify(user));
        try {
            const response = await UserActions.exact(user.username);
            console.log("GOT USERNAME REFINE RESPONSE", JSON.stringify(response));
            if (response.id !== user.id) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Username '${user.username}' is already in use`,
                    path: ["username"],
                });
            }
        } catch (error) {
            console.log("GOT USERNAME REFINE RESPONSE", "Definitely Unique");
        }
    })
    // Verify password is present for a new User
    .superRefine((user, context) => {
        if (user.id < 0) {
            console.log("PASSWORD CHECK REFINE", JSON.stringify(user));
            if (!user.password || (user.password.length < 1)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Password is required for  new User`,
                    path: ["password"],
                });
            }
        }
    })
;
