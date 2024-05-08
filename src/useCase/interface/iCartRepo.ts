interface iCardRepo {
    save(data: any): Promise<{}>;
    cartDataForCheckout(userId: string): Promise<any>;
    deleteByUserId(userId: string): Promise<any>;
    

}

export default iCardRepo