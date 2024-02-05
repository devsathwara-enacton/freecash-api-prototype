import { auth } from "../models";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
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
    const register = await auth.register(name, email, hashPassword);
    if (register) {
      let accessToken = Math.floor(Math.random() * 10);
      req.session.set("accessToken", accessToken);
      return reply.status(200).send({
        success: true,
        message: "Registered successfully!",
        accessToken: accessToken,
      });
    } else {
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};
function isMobile(userAgent: any) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}
export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };
  console.log(req.headers["user-agent"]);
  const userData = await auth.login(email);
  if (!userData) {
    return reply
      .status(401)
      .send({ success: false, error: "Invalid Credentials" });
  } else {
    const isValidPassord = await bcrypt.compare(password, userData.password);
    if (!isValidPassord) {
      return reply
        .status(401)
        .send({ success: false, error: "Invalid Password" });
    } else {
      //Checking session
      let checkSession = req.session.get("accessToken");
      if (checkSession !== undefined) {
        // return reply.status(200).send({
        //   success: true,
        // });
        return reply.redirect("/success");
      } else {
        let newAccessToken = Math.floor(Math.random() * 10);
        req.session.set("accessToken", newAccessToken);
        // return reply.status(200).send({
        //   success: true,
        // });
        return reply.redirect("/success");
      }
    }
  }
};
