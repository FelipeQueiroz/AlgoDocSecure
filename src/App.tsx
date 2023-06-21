import MyAlgoConnect from '@randlabs/myalgo-connect';
const myAlgoWallet = new MyAlgoConnect();
import './App.css'
import {ChangeEvent, useState} from "react";
import PdfUploadComponent from "./PdfUploadComponent.tsx";
import algosdk from "algosdk";
import storage from "./firebase.config.ts"
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import {Buffer} from "buffer";

const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();
const receiverWallet = 'WQT3AJ47HJFBJVEWWC3DEXECCTJNRIXQX2H7VSRQIM3QZ3B2LTYFBY5QBM'

window.Buffer = Buffer

function App() {

    const [addresses, setAddresses] = useState<string[]>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [percent, setPercent] = useState<number>(0);
    const [url, setUrl] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Perform additional checks if needed to ensure it's a PDF file
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            // Display an error message or provide feedback to the user
            console.log('Please select a PDF file.');
        }
    };

    async function connectToMyAlgo() {
        try {
            const accounts = await myAlgoWallet.connect();
            const addresses = accounts.map(account => account.address);

            setAddresses(addresses)

        } catch (err) {
            console.error(err);
        }
    }

    async function makeTransaction(address: string, file: File) {
        try {
            const storageRef = ref(storage, `/files/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    setPercent(percent);
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setUrl(url);
                    });
                }
            );


            const textEncoder = new TextEncoder();
            const uint8Array = textEncoder.encode(url);

           if(url.length > 0){
               const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                   suggestedParams: {
                       ...params,
                   },
                   from: address,
                   to: receiverWallet,
                   amount: 10,
                   note: uint8Array,
               });

               const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
               const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
               window.alert('Transação realizada com sucesso!' + response.txId)
               setUrl('')
               setSelectedFile(null)
           }
        } catch (error) {
            console.error("Error making transaction:", error);
        }
    }

  return (
      <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
              <section
                  className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
              >
                  <img
                      alt="Night"
                      src="https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />

                  <div className="hidden lg:relative lg:block lg:p-12">

                      <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                          Bem vindo ao AlgoDocSecure
                      </h2>

                      <p className="mt-4 leading-relaxed text-white/90">
                          Construindo um futuro transparente para verificação de documentos.
                      </p>
                  </div>
              </section>

              <main
                  className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
              >
                  <div className="max-w-xl lg:max-w-3xl">
                      <div className="relative -mt-16 block lg:hidden">

                          <h1
                              className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
                          >
                              Bem vindo ao AlgoDocSecure
                          </h1>

                          <p className="mt-4 leading-relaxed text-gray-500">
                              Construindo um futuro transparente para verificação de documentos.
                          </p>
                      </div>

                      <form action="#" className="mt-8 grid grid-cols-6 gap-6">

                          <div className="col-span-6 sm:flex sm:items-center sm:gap-4 items-center justify-center gap-5">
                              {addresses ? (
                                  <div className="mt-4 sm:mt-0 sm:col-span-2 gap-5">
                                      <h1
                                          className="mt-2 text-lg font-bold text-gray-900"
                                      >
                                          Conta: {addresses[0].substring(0,4) + '....' + addresses[0].substring(addresses[0].length - 4)}
                                      </h1>
                                      <PdfUploadComponent handleFileChange={handleFileChange} selectedFile={selectedFile}  />
                                      {selectedFile && (
                                          <button
                                              onClick={() => makeTransaction(addresses[0], selectedFile)}
                                              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                          >
                                              Autenticar Documento
                                          </button>
                                      )}
                                  </div>
                              ): (
                                  <div className={'col-span-6 sm:inline-block w-3/4 sm:items-center sm:gap-4 items-center justify-center text-center gap-2px'}>
                                      <h1
                                          className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
                                      >
                                          Faça o login para autenticar o seu documento
                                      </h1>
                                      <button
                                          onClick={connectToMyAlgo}
                                          className="inline-block shrink-0 mt-10 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                      >
                                          Fazer Login
                                      </button>
                                  </div>
                              )}
                          </div>
                      </form>
                  </div>
              </main>
          </div>
      </section>


  )
}

export default App
