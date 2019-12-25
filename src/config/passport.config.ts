// import passport from 'passport'
// import { Strategy, ExtractJwt } from 'passport-jwt'
// import { Request, Response, NextFunction } from 'express'

// import User from '../models/user'

// passport.serializeUser((user, done) => done(null, user))
// passport.deserializeUser((id, done) => done(null, id))

// passport.use(new Strategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_KEY
// }, async ({ id }, done) => {
//     try {
//         const user = await new User().load(id)

//         return done(null, user)
//     } catch(error) {
//         done(error)
//     }
// }))

// export const authenticate = (req: Request, res: Response, next: NextFunction) =>
//     passport.authenticate('jwt', { session: false }, async (err, user: User) => {
//         if(err) return res.sendStatus(500)
//         if(!user) return res.sendStatus(401)

//         req.user = user

//         next()
//     })(req, res, next)

// export default passport
