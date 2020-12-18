// LibraryClient -------------------------------------------------------------

// HTTP client for Library objects.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AxiosClient from "./AxiosClient";
import CrudClient from "./CrudClient";
//import Library from "../models/Library";

// Private Objects -----------------------------------------------------------

const LIBRARIES_BASE = "/libraries";

// Public Objects -----------------------------------------------------------

class LibraryClient implements CrudClient {

    // ***** Standard CRUD Methods *****

    async all<Library>(params?: object): Promise<Library[]> {
        return (await AxiosClient.get(LIBRARIES_BASE, params)).data;
    }

    async find<Library>(id: number, params?: object): Promise<Library> {
        return (await AxiosClient.get(LIBRARIES_BASE + `/${id}`)).data;
    }

    async insert<Library>(library: Library): Promise<Library> {
        return (await AxiosClient.post(LIBRARIES_BASE, library)).data;
    }

    async remove(id: number): Promise<void> {
        await AxiosClient.delete(LIBRARIES_BASE + `/${id}`);
    }

    async update<Library>(id: number, library: Library): Promise<Library> {
        return (await AxiosClient.put(LIBRARIES_BASE + `/${id}`, library)).data;
    }

    // ***** Model-Specific Methods *****

    async active<Library>(params?: object): Promise<Library[]> {
        return (await AxiosClient.get(LIBRARIES_BASE + "/active")).data;
    }

    async exact<Library>(name: string, params?: object): Promise<Library> {
        return (await AxiosClient.get(LIBRARIES_BASE + `/exact/${name}`)).data;
    }

    async name<Library>(name: string, params?: object): Promise<Library[]> {
        return (await AxiosClient.get(LIBRARIES_BASE + `/name/${name}`)).data;
    }

    // ***** Library->Author Relationships *****

    // ***** Library->Series Relationships *****

    // ***** Library->Story Relationships *****

    // ***** Library->Volume Relationships *****

}

export default new LibraryClient();
