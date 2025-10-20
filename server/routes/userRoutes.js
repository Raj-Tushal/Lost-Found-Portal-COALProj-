import express from 'express'

import createUser from '../controllers/user/createUser.js'
import { loginUser } from '../controllers/user/loginUser.js'
import { renewToken } from '../controllers/user/renewToken.js'
import { updateUser } from '../controllers/user/updateUser.js'
import { validateJWT } from '../middlewares/validateToken.js'
import findById from '../controllers/User/findById.js'

const router = express.Router()


router.post('/create', createUser)
router.put('/update/:id', validateJWT, updateUser)
router.post('/login', loginUser)
router.post('/find/:id',validateJWT, findById)
router.post('/renew', validateJWT, renewToken)


export default router
