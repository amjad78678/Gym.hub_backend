interface iQrCode {
    generateQR(data: any): Promise<string>;

}

export default iQrCode