import fastify from "fastify";
import dotenv from "dotenv";
import { UserRoutes } from "./routes/UserRoutes";
import { ReviewRoutes } from "./routes/ReviewRoutes";
import { UserSchemas } from "./schemas/UserSchema";

dotenv.config();

const Application = fastify({logger: true});
const PORT: number|undefined = Number(process.env.PORT);

const buildServer = async () => {

    // adding schema to server
    for (const schema of [...UserSchemas]) {
        Application.addSchema(schema);
      }

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