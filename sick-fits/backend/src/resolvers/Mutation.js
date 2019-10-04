const Mutations = {
    // args - contains the query from the client side, that's how the mutation knows what to return
    async createItem(parent, args, ctx, info) {
        // TODO: Check if they are logged in

        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args,
                },
            },
            info
        );

        console.log(item);

        return item;
    },

    async updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        console.log({ args, ctx, info })

        delete updates.id;

        const item = await ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            },
            info
        });

        return item;
    },

    async deleteItem(parent, args, ctx, info) {
        console.log({args, ctx, info })
        const where = { id: args.id };

        const item = await ctx.db.query.item({ where }, `{ id, title }`);
        ctx.db.mutation.deleteItem({ where }, info);
        return item;
    }
};

module.exports = Mutations;
