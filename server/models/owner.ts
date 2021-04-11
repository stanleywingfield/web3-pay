import {Sequelize, BIGINT, STRING, UUIDV4} from "sequelize";

export type Owner = {
  id: string;
  address: string;
  ghostAPI: string;
  ghostAdminAPIKey: string;
  ghostContentAPIKey: string;
};

const owner = (sequelize: Sequelize) => {
    const model = sequelize.define('owner', {
        id: {
            type: UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        address: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        ghostAPI: {
            type: STRING,
        },
        ghostAdminAPIKey: {
            type: STRING,
        },
        ghostContentAPIKey: {
            type: STRING,
        }
    }, {
        indexes: [
            { fields: ['address'] },
            { fields: ['ghostAPI'] },
            { fields: ['ghostAdminAPIKey'] },
        ],
    });

    const createOwner = async (data: Owner) => {
        const result = await model.findOne({
            where: {
                address: data.address,
                ghostAPI: data.ghostAPI,
                ghostAdminAPIKey: data.ghostAdminAPIKey,
            },
        });

        if (result) {
            return Promise.reject(new Error('Owner profile already exist'));
        }

        return model.create({
            address: data.address,
            ghostAPI: data.ghostAPI,
            ghostAdminAPIKey: data.ghostAdminAPIKey,
            ghostContentAPIKey: data.ghostContentAPIKey,
        });
    }

    const updateOwner = async (data: Owner) => {
        const result = await model.findOne({
            where: {
                id: data.id,
            },
        });

        if (!result) {
            return Promise.reject(new Error(`Cannot find owner profile - ${data.id}`));
        }

        return result.update({
            address: data.address,
            ghostAPI: data.ghostAPI,
            ghostAdminAPIKey: data.ghostAdminAPIKey,
            ghostContentAPIKey: data.ghostContentAPIKey,
        });
    }

    const deleteOwner = async (data: Owner) => {
        const result = await model.findOne({
            where: {
                id: data.id,
            },
        });

        if (!result) {
            return Promise.reject(new Error(`Cannot find owner profile - ${data.id}`));
        }

        return result.destroy();
    }

    const getProfilesByAddress = async (address: string) => {
        const result = await model.findAll({
            where: {
                address: address,
            },
        });

        return result;
    }

    return {
        model,
        getProfilesByAddress,
        createOwner,
        updateOwner,
        deleteOwner,
    };
}

export default owner;