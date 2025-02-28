import express from 'express';
import { getTransactionHistory, sendPayment, getAccountDetails } from '../../src/controllers/stellarController.js';
import authinticate from '../../src/middleware/authintication.js';

const router = express.Router();


router.post('/send-payment', authinticate ,sendPayment);

router.get('/account',authinticate, getAccountDetails);

router.get('/transactions',authinticate, getTransactionHistory);


export default router;