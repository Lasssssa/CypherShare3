import {createRouter} from "@/utils/create-router";
import axios from "axios";

const worldIdRouter = createRouter();

worldIdRouter.get('/verify-world-id', async function (req, res, next) {
    const { proof, merkle_root, nullifier_hash, action, signal } = req.body;

    try {
        const response = await axios.post("https://developer.worldcoin.org/api/v1/verify", {
            proof,
            merkle_root,
            nullifier_hash,
            action_id: action,
            signal,
        });

        const { success } = response.data;
        if (!success) return res.status(401).json({ message: "World ID verification failed." });

        // Ici tu peux créer une session, JWT, etc.
        return res.status(200).json({ message: "Login verified!", user: nullifier_hash });
    } catch (error) {
        console.error("Error verifying World ID:", error);
        return res.status(500).json({ message: "Server error verifying World ID." });
    }
});

export default worldIdRouter;
