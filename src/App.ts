import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import { UserRoutes } from "./routes/UserRoutes";
import { ReviewRoutes } from "./routes/ReviewRoutes";
import { UserSchemas } from "./schemas/UserSchema";
import fastifyjwt from "@fastify/jwt";
import { isUserObject } from "./types/ModelTypes";
import Logging from "./utils/Logging";
import { FollowsRoutes } from "./routes/FollowsRoutes";
import { ReviewSchemas } from "./schemas/ReviewSchema";

dotenv.config();

export const Application = fastify({logger: true});
const PORT: number|undefined = Number(process.env.PORT);
const SECRET_KEY: string|undefined = process.env.SECRET_KEY 


declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

const buildServer = async () => {

    // adding schema to server
    for (const schema of [...UserSchemas, ...ReviewSchemas]) {
        Application.addSchema(schema);
      }
    if (SECRET_KEY) {
        Application.register(fastifyjwt, {
            secret: SECRET_KEY,
            
        })
    }
    Application.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const decodedUser = await req.jwtVerify();
            if (isUserObject(decodedUser)) {
                req.user = decodedUser;
                Logging.info("----JWT validated----")
            } else {
                Logging.warn("decoded user is not user object")
            }  
        } catch (error) {
            Logging.error(error)
            reply.send(error)
        } 
    })
    Application.register(FollowsRoutes, {prefix: "api/follows"})
    Application.register(UserRoutes, {prefix: "api/user"});
    Application.register(ReviewRoutes, {prefix: "api/review"});

    Application.get("/", (req, res) => {
        res.send({greetings: "Hello"});
    });
}


const startApplication = async () => {
    buildServer();
    try {  
        await Application.listen(PORT);
    } catch (error) {
        Application.log.error(error);
        process.exit(1);
    }
}



startApplication()