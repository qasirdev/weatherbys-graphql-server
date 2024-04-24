export const authResolver = {
  Mutation: {
    async login (parent:any, { email, password }: Record<string, any>, context:any) {
      const { user } = await context.authenticate('graphql-local', { email, password });
      await context.login(user);
      return { user }
    },
    async signup (parent:any, { email,fullName, password }: Record<string, any>, context:any) {
      const existingUsers = await context.userService.getAllUsers();
      const userWithEmailAlreadyExists = !!existingUsers.find((user:any) => user.email === email);
      if (userWithEmailAlreadyExists) {
        throw new Error('User with email already exists');
      }
      const newUser = await context.userService.createUser({
        email,
        fullName,
        password,
      });
      await context.login(newUser);
      return { user: newUser };
    },
    async logout(_: any, {input}: Record<string, any>, context:any) {
      console.log('logout - context?.req?.user:', context?.req?.user);
      return context.logout();
    }
  },
};
