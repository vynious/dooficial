import fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const Application = fastify({logger: true});

Application.get("/", (req, res) => {
    res.send({greetings: "Hello"});
})


const startServer = async () => {
    try {
        await Application.listen(process.env.PORT);
    } catch (error) {
        Application.log.error(error);
        process.exit(1);
    }
}



startServer();