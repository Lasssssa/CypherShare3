import express, {Router} from "express";
import "express-async-errors";

export const createRouter: () => Router = () => express.Router();
