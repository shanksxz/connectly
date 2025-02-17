import cors from "cors";
import express from "express";
import morgan from "morgan";
import { app, server } from "./socket";
import { getEnvVariable } from "./utils";

app.use(morgan("dev"));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = getEnvVariable("WS_PORT");
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
