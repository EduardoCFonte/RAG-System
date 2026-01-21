import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { DocumentArrowUpIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
interface UploadedFile extends File {
  preview?: string;
  path?: string;
}

interface ApiService {
  post: (url: string, data: FormData) => Promise<{ data: { success: boolean } }>;
}

const FileUpload: React.FC = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<UploadedFile[]>([]);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);
  const [contextName, setContextName] = useState<string>('');

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>((accepted: File[], rejections: FileRejection[]) => {
    const newFilesWithPreview = accepted.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as UploadedFile
    );

    setAcceptedFiles(prevFiles => [...prevFiles, ...newFilesWithPreview]);
    setFileRejections(prevRejections => [...prevRejections, ...rejections]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 5,
  });

  const handleExclusion = (fileToRemove: UploadedFile): void => {
    setAcceptedFiles(prevFiles => prevFiles.filter(file => file.name !== fileToRemove.name));
  };

  const handleUpload = async (): Promise<void> => {
    if (!contextName.trim()) {
      alert("Por favor, forneça um nome para o contexto (ex: Projeto A, Contrato X).");
      return;
    }

    if (acceptedFiles.length === 0) {
      alert("Por favor, selecione pelo menos um ficheiro.");
      return;
    }

    const formData = new FormData();
    formData.append('context', contextName);
    
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await api.post("/api/v1/upload-documents", formData);

      alert(`Sucesso! Documentos processados no contexto: ${contextName}`);
      setAcceptedFiles([]);
      setFileRejections([]);
      setContextName('');
    } catch (error) {
      console.error("Erro ao enviar os ficheiros:", error);
      alert("Ocorreu um erro ao enviar os ficheiros para o servidor.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label htmlFor="context" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <FolderIcon className="w-5 h-5 mr-2 text-indigo-500" />
          Nome do Contexto / Projeto
        </label>
        <input
          type="text"
          id="context"
          value={contextName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContextName(e.target.value)}
          placeholder="Ex: Documentos Jurídicos, Estudo de Caso..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
        />
      </div>

      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                    ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <DocumentArrowUpIcon className={`w-16 h-16 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
          {isDragActive ? (
            <p className="mt-4 text-xl font-semibold text-indigo-700">Solte os arquivos agora...</p>
          ) : (
            <p className="mt-4 text-xl font-semibold text-gray-700">Arraste e solte seus PDFs aqui</p>
          )}
          <p className="text-sm text-gray-500 mt-2">Máximo de 5 arquivos (apenas .pdf)</p>
        </div>
      </div>

      {(acceptedFiles.length > 0 || fileRejections.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h4 className="text-lg font-bold mb-4 text-gray-800">Resumo da Seleção</h4>
          
          {acceptedFiles.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-green-600 uppercase tracking-widest">Arquivos Prontos:</h5>
              <ul className="divide-y divide-gray-50">
                {acceptedFiles.map(file => (
                  <li key={file.name} className="py-3 flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => { 
                        e.stopPropagation(); 
                        handleExclusion(file); 
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fileRejections.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h5 className="text-xs font-bold text-red-600 uppercase tracking-widest">Erros de Seleção:</h5>
              <ul className="mt-2 space-y-1">
                {fileRejections.map(({ file, errors }) => (
                  <li key={(file as any).path || file.name} className="text-xs text-red-500 italic">
                    {(file as any).path || file.name}: {errors.map(e => e.message).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!contextName.trim() || acceptedFiles.length === 0}
            className={`w-full font-bold py-4 px-4 rounded-xl transition-all duration-300 mt-6 shadow-md
              ${(!contextName.trim() || acceptedFiles.length === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'}`}
          >
            {contextName.trim() 
              ? `Enviar para o contexto: ${contextName}` 
              : 'Defina um contexto para continuar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;