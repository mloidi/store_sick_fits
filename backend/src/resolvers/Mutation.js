const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const dayExpire = 1000 * 60 * 60 * 24;

signin = (userId, ctx) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: dayExpire
  });
};

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const update = { ...args };
    delete update.id;
    const item = await ctx.db.mutation.updateItem(
      {
        data: update,
        where: { id: args.id }
      },
      info
    );
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title}`);
    console.log(item);
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    this.signin(user.id, ctx);
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Inavlid password');
    }
    this.signin(user.id, ctx);
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Sign out success' };
  },
  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({
      where: { email: args.email }
    });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    const randomBytesPromisify = promisify(randomBytes);
    const resetToken = (await randomBytesPromisify(20)).toString('hex');
    const resetTokenExpiry = (Date.now() + 3600000).toString(); // 1 hour from now
    const response = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    console.log(response);
    return { message: 'Sign out success' };
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Password don't match");
    }
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: (Date.now() - 3600000).toString()
      }
    });
    if (!user) {
      throw new Error('This token is invalid or expired');
    }
    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    this.signin(updatedUser.id, ctx);
    return updatedUser;
  }
};

module.exports = Mutations;
