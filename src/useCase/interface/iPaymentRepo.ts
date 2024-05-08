interface iPayment {
    confirmPayment(price: number, text: string): Promise<any>;

}

export default iPayment