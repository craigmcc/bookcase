// CrudClient ----------------------------------------------------------------

// Base interface for Http Client implementations that interact with a
// library server.  These standard CRUD operations are common to all concrete
// implementations of this interface, but they can add model-specific
// endpoint calls as needed.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface CrudClient {

    all<M>(params?: object): Promise<M[]>;

    find<M>(id: number, params?: object): Promise<M>;

    insert<M>(model: M): Promise<M>;

    remove(id: number): Promise<void>;

    update<M>(id: number, model: M): Promise<M>;

}

export default CrudClient;
