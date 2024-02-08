import { auth } from "../models";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { createJWTToken, decodeToken } from "../utils/jwt";
import { sendEmail } from "../utils/sendEmail";
import { config } from "../config/config";

interface user {
  name: string;
  email: string;
  password: string;
}
export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = req.body as user;
  let hashPassword: string = await bcrypt.hash(password, 10);
  const userExist = await auth.login(email);
  if (userExist) {
    return reply
      .status(409)
      .send({ success: false, error: "User already exists" });
  } else {
    console.log(config.env.app.email, email);
    const register = await auth.register(name, email, hashPassword);
    if (register) {
      let accessToken = await createJWTToken(
        { name: name, email: email },
        `${parseInt(config.env.app.expiresIn)}h`
      );
      const info = await sendEmail(
        config.env.app.email,
        email,
        "Email Verification Link",
        `Hello👋,${name} 
      Please verify your email by clicking this link`,
        `${config.env.app.appUrl}/api/v1/auth/verify-email/?token=${accessToken}`
      );
      // req.session.set("accessToken", accessToken);
      reply.setCookie("accessToken", accessToken.toString(), {
        path: "/",
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
      });
      return reply.redirect("/success");
    } else {
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};
export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };
  const userData = await auth.login(email);
  if (!userData) {
    return reply
      .status(401)
      .send({ success: false, error: "Invalid Credentials" });
  } else {
    if (userData.password === null) {
      return reply
        .status(401)
        .send({ success: false, error: "Password is null" });
    }
    const isValidPassord = await bcrypt.compare(password, userData.password);
    if (!isValidPassord) {
      return reply
        .status(401)
        .send({ success: false, error: "Invalid Password" });
    } else {
      //Checking session
      let checkSession = req.cookies.accessToken;
      if (checkSession !== undefined) {
        return reply.redirect("/success");
      } else {
        let newAccessToken = await createJWTToken(
          { name: userData.name, email: userData.email },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        //Encrpted session
        // req.session.set("accessToken", newAccessToken);
        reply.setCookie("accessToken", newAccessToken.toString(), {
          path: "/",
          httpOnly: false,
          expires: new Date(Date.now() + 86400000), // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
          sameSite: "none",
          secure: true,
        });
        return reply.redirect("/success");
      }
    }
  }
};

export const verifyEmail = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { token } = req.query as { token: string };
  const decoded: any = decodeToken(reply, token);
  const user = await auth.login(decoded.email);
  if (user?.is_verified == 0) {
    await auth.updateIsVerified(decoded.email);
    const info = await sendEmail(
      config.env.app.email,
      decoded.email,
      "Welcome🙌🙌",
      `Hello👋, 
          Welcome to Freecash`,
      ""
    );
    return reply.status(200).send({
      message: "Your email is successfully verified you can login now",
    });
  } else {
    return reply.status(409).send({
      message: "Your email is already verified please login",
    });
  }
};
export const forgotPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { email } = req.body as unknown as {
    email: string;
  };
  const user = await auth.login(email);
  if (!user) {
    return reply.status(404).send({ message: "User Not Found" });
  } else {
    const resetToken = createJWTToken(
      { email: email },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    const resetLink = `${config.env.app.appUrl}/api/v1/auth/reset-password/?token=${resetToken}`;
    const info = await sendEmail(
      config.env.app.email,
      email,
      "Password Reset Link",
      `Hello👋, click the link below to reset your password`,
      `${resetLink}`
    );
    return reply.status(200).send({
      message: "Password reset link sent to your email",
    });
  }
};
export const resetPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { token } = req.query as { token: string };
  const { password } = req.body as { password: string };

  if (!token) {
    return reply.status(404).send({ message: "Token NOT FOUND" });
  } else {
    const decoded: any = decodeToken(reply, token);
    // Continue with your password reset logic
    const hashedPassword = await bcrypt.hash(password, 10);
    await auth.updatePassword(decoded.email, hashedPassword);
    return reply.status(200).send({
      message: "Password reset successful",
    });
  }
};
export const changePassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  let accessToken = req.cookies.accessToken;
  let decoded = await decodeToken(reply, accessToken);
  let email = decoded.email;
  console.log(email);
  const { currentPassword, password } = req.body as {
    currentPassword: string;
    password: string;
  };

  if (email) {
    const user = await auth.login(email);
    if (!user) {
      return reply.status(404).send({ message: "User Not Found" });
    } else {
      if (user.password === null) {
        return reply
          .status(401)
          .send({ success: false, error: "Password is null" });
      }
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!validPassword) {
        return reply.status(400).send({
          message: "Current Password is incorrect",
        });
      } else {
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await auth.updatePassword(email, hashedNewPassword);
        return reply.status(200).send({
          message: "Password changed successfully",
        });
      }
    }
  } else {
    return reply.status(500).send({ message: "Internal Server error" });
  }
};
