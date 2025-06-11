export const adminAuth = (req,res,next)=>{
    let isAuthorized = false
    if(!isAuthorized){
        res.status(401).send("Un authorized ")
    }
    next()
}

export const userAuth = (req,res,next)=>{
    let isAuthorized = true
    if(!isAuthorized){
        res.status(401).send("Un authorized ")
    }
    next()
}