import { Router } from "express";

const router= Router()

router.get("/", (req, res)=>{
    try{
        
        res.render("chat", {})
    }catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
})

export default router