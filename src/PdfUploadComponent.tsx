import React, { ChangeEvent } from 'react';

interface IPdfUploadComponentProps {
    selectedFile: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PdfUploadComponent: React.FC<IPdfUploadComponentProps> = ({selectedFile, handleFileChange}: IPdfUploadComponentProps) => {


    return (
        <div>
            <label htmlFor="pdf-upload" className="block mb-2 font-medium text-gray-700">
                Selecione um arquivo pdf:
            </label>
            <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedFile && (
                <p className="mt-2 text-green-600">Arquivo selecionado: {selectedFile.name}</p>
            )}
        </div>
    );
};

export default PdfUploadComponent;
