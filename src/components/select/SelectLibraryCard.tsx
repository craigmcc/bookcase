// components/select/SelectLibraryCard.tsx

/**
 * Card for the /select page to choose which Library the user
 * wants to interact with.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from 'next/image'
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActions";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function SelectLibraryCard() {

    const session = await getServerSession(authOptions);

    async function getData(): Promise<LibraryActions.LibraryPlus[]> {
        if (!session || !session.user) {
            return [];
        }
        const results: LibraryActions.LibraryPlus[] = [];
        const libraries = await LibraryActions.all();
        for (const library of libraries) {
            if (authorizedRegular(session.user, library)) {
                results.push(library);
            }
        }
        return results;
    }
    const libraries: LibraryActions.LibraryPlus[] = await getData();

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Select A Library</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-2">
                    <Image
                        alt="Library"
                        height={300}
                        src="/images/library.jpg"
                        width={300}
                    />
                </div>
                <div>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a library"/>
                        </SelectTrigger>
                        <SelectContent>
                            {libraries.map((library, index) => (
                                <SelectItem key={index} value={String(library.id)}>
                                    {library.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-primary"
                    // TODO - how to redirect and know the selected Library
                >
                    Select Library
                </Button>
            </CardFooter>
        </Card>
    )

}
