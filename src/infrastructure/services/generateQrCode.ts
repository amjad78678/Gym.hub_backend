import iQrCode from "../../useCase/interface/qrCode";
import QR from 'qrcode';

class GenerateQrCode implements iQrCode {

  async generateQR(data: any): Promise<string> {
      
    const dataJSON = JSON.stringify(data); 

    return new Promise((resolve, reject) => {
        QR.toDataURL(dataJSON, function (err, code) {
            if (err) {
                
            } else {
                resolve(code);
            }
        });
    });
  }

}

export default GenerateQrCode;