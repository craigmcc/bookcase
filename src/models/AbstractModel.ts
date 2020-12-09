// AbstractModel -------------------------------------------------------------

// Abstract base class for Sequelize model classes used in this project.

// External Modules ----------------------------------------------------------

import { Column, CreatedAt, DataType, Model, Table, UpdatedAt }
    from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

// Public Modules ------------------------------------------------------------

/**
 * <p>Define the columns that should be included in every Sequelize Model
 * implementation that subclasses this abstract base class.  Each instance
 * of a concrete subclass represents a row in the underlying database table.</p>
 *
 * <p>Although not explicitly defined as a Column, a <code>version</code>
 * field will be incremented each time the underlying instance is updated.</p>
 */
@Table({
    comment: "Abstract base class for all concrete models.",
    timestamps: true,
    version: true
})
export abstract class AbstractModel<Model> extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        comment: "Primary key for this instance.",
        primaryKey: true,
        type: DataType.BIGINT,
    })
    id?: number;

    /**
     * <p>Timestamp when this instance was created.</p>
     */
    @Column({
        allowNull: false,
        type: DataType.DATE,
    })
    @CreatedAt
    readonly published?: Date;

    /**
     * <p>Timestamp when this instance was most recently updated.</p>
     */
    @Column({
        allowNull: false,
        type: DataType.DATE,
    })
    @UpdatedAt
    readonly updated?: Date;

}

export default AbstractModel;
