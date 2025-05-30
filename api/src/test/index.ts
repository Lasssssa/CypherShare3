import {createRouter} from "@/utils/create-router";

const testRouter = createRouter();

testRouter.get('/', async function (req, res, next) {
    res.status(200).json({message: 'Its a good test!'});
});

export default testRouter;
