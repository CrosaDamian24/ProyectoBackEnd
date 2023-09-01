import passport from 'passport'

// middleware para colocar entre los endpoint y los router, asi agregamos una capa de cookie para mostrar los endpoint y hacerlos privados 
export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return  res.status(401).json({ status : 'error', error : info.messages ? info.messages : info.toString()})
            // res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
            
            req.user = user
            next()
        })(req, res, next)
    }
}

export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null
    
    if (policies.includes('ADMIN')) {
        if (user.role !== 'admin') {
            return res.status(403).render('errors/base', {
                error: 'Need to be an ADMIN'
            })
        }
    }
    if (policies.includes('USER')) {
        if (user.role !== 'user') {
            return res.status(403).render('errors/base', {
                error: 'Need to be an user'
            })
        }
    }
    return next()
}
