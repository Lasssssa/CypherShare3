import {createRouter} from "@/utils/create-router";
import {authMiddlewareForRoles} from "@/middlewares/auth";

const testRouter = createRouter();

testRouter.get('/', authMiddlewareForRoles(['USER']), async function (req, res, next) {
    res.status(200).json({message: 'Its a good test!'});
});

export default testRouter;
