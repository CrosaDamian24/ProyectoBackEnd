import { Router } from "express";
import { generateProducts } from '../utils.js'

const router= Router()

const products = []

router.get("/", (req, res)=>{
    try{
        for (let index = 0; index < 100; index++) {
            products.push(generateProducts())
        }
      
        res.send({ status: 'success', payload: products })
    }catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
})

export default router