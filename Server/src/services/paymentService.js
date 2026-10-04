export const processPayment = async (amount, paymentMethod) => {

    if (!amount || amount <= 0) {
        return {
            success: false,
            message: "Invalid payment amount"
        };
    }

    if (!paymentMethod) {
        return {
            success: false,
            message: "Payment method is required"
        };
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Temporary failure simulation
    if (paymentMethod === "FAIL") {
        return {
            success: false,
            message: "Payment failed"
        };
    }

    return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        amount,
        paymentMethod
    };
};