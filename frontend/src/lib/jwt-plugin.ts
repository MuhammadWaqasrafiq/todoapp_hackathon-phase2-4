
import jwt from 'jsonwebtoken';

export const jwtPlugin = (options) => {
  return {
    name: 'jwt',
    handlers: {
      token: async ({ user }) => {
        const payload = {
          sub: user.id,
          email: user.email,
        };
                const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: options.jwt.expiresIn,
          issuer: options.jwt.issuer,
        });
        return { token };
      },
    },
  };
};
