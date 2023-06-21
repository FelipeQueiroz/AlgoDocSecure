export function convertPDFToUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                resolve(uint8Array);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsArrayBuffer(file);
    });
}


