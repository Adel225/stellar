    
    import StellarSdk from 'stellar-sdk';
    import asyncHandler from '../../src/utils/asyncHandler.js';
    import userModel from '../../database/models/user.model.js';

    
    export const sendPayment = asyncHandler(async (req, res) => {

        const { sourceSecret, destinationPublicKey, amount } = req.body;
        const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
        
        const server = new StellarSdk.Horizon.Server(process.env.STELLAR_HORIZON_URL);

        const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
            StellarSdk.Operation.payment({
                destination: destinationPublicKey,
                asset: StellarSdk.Asset.native(),
                amount: amount.toString(),
            })
            )
            .setTimeout(30)
            .build();

        transaction.sign(sourceKeypair);

        const result = await server.submitTransaction(transaction);

        res.status(200).json({ success: true, result });
    });

    export const getAccountDetails = asyncHandler(async (req, res) => {
    const { publicKey } = req.body;

    const server = new StellarSdk.Horizon.Server(process.env.STELLAR_HORIZON_URL);
    const account = await server.loadAccount(publicKey);

    res.status(200).json({
        success: true,
        account
    });
    });

    export const getTransactionHistory = asyncHandler(async (req, res) => {
        const { publicKey } = req.body;
    
        const server = new StellarSdk.Horizon.Server(process.env.STELLAR_HORIZON_URL);
    
        const transactions = await server
            .transactions()
            .forAccount(publicKey)
            .order('desc')
            .limit(20)
            .call();

            const transactionsfilterd = transactions.records.map(tx => {
                let totalAmount = tx.amount || 1; 
                let feePercentage = (tx.fee_charged / totalAmount) * 100;
            
                return {
                    id: tx.id,
                    timestamp: new Date(tx.created_at).toLocaleString(),
                    status: tx.successful ? "Success" : "Failed",
                    source: tx.source_account,
                    fee: tx.fee_charged,
                    operations: tx.operation_count,
                    feePercentage: feePercentage.toFixed(2) + "%",
                    hash: tx.hash,
                    link: tx._links.self.href
                };
            });
    
        res.status(200).json({ success: true, transactionsfilterd });
    });