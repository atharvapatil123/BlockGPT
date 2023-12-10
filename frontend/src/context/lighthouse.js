const { ethers } = require("ethers");
const lighthouse = require("@lighthouse-web3/sdk");
const kavach = require("@lighthouse-web3/kavach");
const fs = require("fs");

// Replace 'your_private_key' with your actual private key
const privateKey =
  "0x9787788500a5fd891ad3b1f445372d61e48805f2baa274fcfcfb49e828e9ab22";

const apiKey="eb22fe2d.ad56a88619dc450b9c76363c7f1d9611"

const signAuthMessage = async (privateKey) => {
  const signer = new ethers.Wallet(privateKey);
  const authMessage = await kavach.getAuthMessage(signer.address);
  const signedMessage = await signer.signMessage(authMessage.message);
  const { JWT, error } = await kavach.getJWT(signer.address, signedMessage);
  return JWT;
};

const uploadResponse = await lighthouse.upload(pathToFile, apiKey)

// const uploadResponse = await lighthouse.upload(
//   '/home/cosmos/Desktop/wow.jpg', 
//   'YOUR_API_KEY_HERE'
// )

console.log(uploadResponse)

const uploadEncrypted = async (pathToFile,apiKey,publicKey) => {
//   const pathToFile = "data3.txt";
//   const apiKey = "eb22fe2d.ad56a88619dc450b9c76363c7f1d9611";
//   const publicKey = "0x7f45AafFB2dc05161B8D06b8d954e174A78fb17c";
  const signedMessage = await signAuthMessage(privateKey);

  const response = await lighthouse.uploadEncrypted(
    pathToFile,
    apiKey,
    publicKey,
    signedMessage
  );
  console.log(response);

};
const decrypt = async (cid,publicKey,privateKey,exportFileName) => {
//   const cid = "QmXW6YDNE85bYnNjRxApEK5NiatBH7nKtHGVaTMLvT16ab"; 
//   const publicKey = "0x640dA600E123CF9bc1aED3B87088dB717078323B"; 
//   const privateKey =
//     "0x7a62aa11fa06bc5f21ef8819674ce87876b678f7e288b9c8347fdd3eff7faf89";
  // Get file encryption key
  const signedMessage = await signAuthMessage(publicKey, privateKey);
  const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage
  );

  // Decrypt File
  const decrypted = await lighthouse.decryptFile(
    cid,
    fileEncryptionKey.data.key
  );

  // Save File
  fs.createWriteStream(exportFileName).write(Buffer.from(decrypted));
};
const shareFile = async (cid,publicKey,publicKeyUserB) => {
  try {
    // CID of the encrypted file that you want to share
    // CID is generated by uploading a file with encryption
    // Only the owner of the file can share it with another wallet address
    // const cid = "QmXW6YDNE85bYnNjRxApEK5NiatBH7nKtHGVaTMLvT16ab"; 
    // const publicKey = "0x7f45AafFB2dc05161B8D06b8d954e174A78fb17c"; 
    // const signedMessage = await signAuthMessage(privateKey);
    // const publicKeyUserB = ["0x640dA600E123CF9bc1aED3B87088dB717078323B"];

    const shareResponse = await lighthouse.shareFile(
      publicKey,
      publicKeyUserB,
      cid,
      signedMessage
    );

    console.log(shareResponse);
    /* Sample Response
        {
          data: {
            cid: 'QmTsC1UxihvZYBcrA36DGpikiyR8ShosCcygKojHVdjpGd',
            shareTo: [ '0x487fc2fE07c593EAb555729c3DD6dF85020B5160' ],
            status: 'Success'
          }
        }
      */
  } catch (error) {
    console.log(error);
  }
};