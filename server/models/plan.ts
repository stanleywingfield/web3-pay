import {BIGINT, Sequelize, STRING, UUIDV4} from "sequelize";
import {PaymentPlan} from "../../ui/src/ducks/profiles";

export type Plan = {
    id: string;
    ownerId: string;
    value: number;
    tokenAddress: string;
    interval: number;
    title: string;
    description: string;
};

export type CreatePlanPayload = {
    ownerId: string;
    value: number;
    tokenAddress: string;
    interval: number;
    title: string;
    description: string;
};

const plan = (sequelize: Sequelize) => {
    const model = sequelize.define('plan', {
        id: {
            type: UUIDV4,
            defaultValue: UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        ownerId: {
            type: UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tokenAddress: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        title: {
            type: STRING,
        },
        description: {
            type: STRING,
        },
        value: {
            type: BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true,
                min: 1,
            },
        },
        interval: {
            type: BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true,
                min: 1,
            },
        }
    }, {
        indexes: [
            { fields: ['ownerId'] },
        ],
    });

    const createPlan = async (data: CreatePlanPayload) => {
        const result = await model.findOne({
            where: {
                ownerId: data.ownerId,
                interval: data.interval,
            },
        });

        if (result) {
            return Promise.reject(new Error('Similar plan already exist'));
        }

        return model.create({
            ownerId: data.ownerId,
            tokenAddress: data.tokenAddress,
            value: data.value,
            interval: data.interval,
            title: data.title,
            description: data.description,
        });
    }

    const updatePlan = async (data: Plan) => {
        const result = await model.findOne({
            where: {
                id: data.id,
            },
        });

        if (!result) {
            return Promise.reject(new Error(`Cannot find plan - ${data.id}`));
        }

        return result.update({
            interval: data.interval,
            value: data.value,
            tokenAddress: data.tokenAddress,
            title: data.title,
            description: data.description,
        });
    }

    const deletePlan = async (data: Plan) => {
        const result = await model.findOne({
            where: {
                id: data.id,
            },
        });

        if (!result) {
            return Promise.reject(new Error(`Cannot find plan - ${data.id}`));
        }

        return result.destroy();
    }

    const getPlansByOwner = async (ownerId: string) => {
        const result = await model.findAll({
            where: {
                ownerId: ownerId,
            },
        });

        return result;
    }

    const deletePlansByOwner = async (ownerId: string) => {
        const result = await model.findAll({
            where: {
                ownerId: ownerId,
            },
        });

        for (let plan of result) {
            await plan.destroy();
        }
    }

    return {
        model,
        getPlansByOwner,
        deletePlansByOwner,
        createPlan,
        updatePlan,
        deletePlan,
    };
}

export default plan;