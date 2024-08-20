import QRCode from 'qrcode'

export const generateQrCode = async (data) =>{
    try {
        return await QRCode.toDataURL(data)
    } catch (error) {
        console.log(error);
    }
}