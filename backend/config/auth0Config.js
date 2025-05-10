import {auth} from "express-oauth2-jwt-bearer"

const jwtCheck = auth({
    audience: "http://localhost:3000",
    issuerBaseURL:"https://dev-nfg02ii4yd3b5isn.us.auth0.com",
    tokenSigningAlg:"RS256",
    credentialsRequired: true
})
export default jwtCheck