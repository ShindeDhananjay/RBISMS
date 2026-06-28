import { Router } from 'express';
import { loginWithPassword, generateOtp, loginWithOtp } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginWithPassword);
router.post('/otp/generate', generateOtp);
router.post('/otp/login', loginWithOtp);

export default router;
