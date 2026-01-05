
import React, { useState, useRef } from 'react';
import { Photo, ReportMetadata } from './types';
import ReportPage from './components/ReportPage';
import { 
  PlusIcon, 
  TrashIcon, 
  FolderPlusIcon, 
  PhotoIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [metadata, setMetadata] = useState<ReportMetadata>({
    objeto: '',
    data: '',
    orgao: '',
    logoUrl: undefined
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsGenerating(true);
    const newPhotos: Photo[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = url;
        });

        newPhotos.push({
          id: Math.random().toString(36).substr(2, 9),
          url,
          name: file.name.replace(/\.[^/.]+$/, ""),
          orientation: dimensions.width >= dimensions.height ? 'landscape' : 'portrait',
          width: dimensions.width,
          height: dimensions.height
        });
      }
      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error("Erro ao processar imagens:", error);
    } finally {
      setIsGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMetadata(prev => ({ ...prev, logoUrl: url }));
    }
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const removeLogo = () => {
    setMetadata(prev => ({ ...prev, logoUrl: undefined }));
  };

  const handlePrint = () => {
    if (photos.length === 0) {
      alert("Por favor, adicione fotos antes de gerar o relatório.");
      return;
    }
    window.print();
  };

  const landscapes = photos.filter(p => p.orientation === 'landscape');
  const portraits = photos.filter(p => p.orientation === 'portrait');

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const landscapePages = chunkArray(landscapes, 2);
  const portraitPages = chunkArray(portraits, 4);
  const totalPages = landscapePages.length + portraitPages.length;

  return (
    <div className="min-h-screen pb-20">
      {/* Interface de Configuração - Oculta na Impressão */}
      <div className="no-print max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
              <span className="bg-blue-600 text-white p-2 rounded-xl mr-3 shadow-lg shadow-blue-200">
                <FolderPlusIcon className="w-6 h-6" />
              </span>
              RELATÓRIO FOTOGRÁFICO
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-wider">Órgão ou Entidade</label>
              <input 
                type="text" 
                placeholder="Ex: PREFEITURA MUNICIPAL"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none focus:border-blue-400 transition-all shadow-sm"
                value={metadata.orgao}
                onChange={e => setMetadata({ ...metadata, orgao: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-wider">Objeto do Relatório</label>
              <input 
                type="text" 
                placeholder="Ex: Reforma da Escola"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none focus:border-blue-400 transition-all shadow-sm"
                value={metadata.objeto}
                onChange={e => setMetadata({ ...metadata, objeto: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-wider">Data do Registro</label>
              <input 
                type="text" 
                placeholder="Ex: Janeiro de 2025"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none focus:border-blue-400 transition-all shadow-sm"
                value={metadata.data}
                onChange={e => setMetadata({ ...metadata, data: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center border-t border-gray-50 pt-8">
            <button 
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm transition-all border border-gray-200 shadow-sm active:scale-95"
            >
              <PhotoIcon className="w-5 h-5 mr-2 text-gray-400" />
              {metadata.logoUrl ? 'Trocar Logo' : 'Inserir Logo'}
            </button>
            <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoChange} />

            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Adicionar Fotos
            </button>
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            
            <button 
              type="button"
              onClick={handlePrint}
              disabled={photos.length === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                photos.length > 0 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100 hover:shadow-green-200 cursor-pointer' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
              }`}
            >
              <PrinterIcon className="w-5 h-5 mr-2" />
              Gerar PDF / Imprimir
            </button>

            <div className="flex-grow"></div>

            {metadata.logoUrl && (
              <button 
                type="button"
                onClick={removeLogo}
                className="text-gray-400 text-[10px] hover:text-red-500 transition-colors uppercase font-black tracking-widest"
              >
                Remover Logo
              </button>
            )}
          </div>
          
          {isGenerating && (
            <div className="mt-6 flex items-center justify-center text-sm text-blue-600 font-bold bg-blue-50 p-4 rounded-xl animate-pulse">
              <PlusIcon className="w-5 h-5 mr-3 animate-spin" />
              PROCESSANDO IMAGENS...
            </div>
          )}
        </div>

        {/* Grade de Pré-visualização */}
        {photos.length > 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-black text-gray-800 tracking-tight">FOTOS SELECIONADAS ({photos.length})</h2>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest bg-gray-100 px-2 py-1 rounded-md">Preview Editável</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group bg-white p-2 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all hover:shadow-xl hover:-translate-y-1">
                  <img src={photo.url} alt={photo.name} className="h-28 w-full object-cover rounded-xl" />
                  <div className="mt-2 text-[10px] text-gray-700 font-bold truncate px-1" title={photo.name}>
                    {photo.name}
                  </div>
                  <div className="mt-0.5 text-[8px] uppercase font-black text-blue-500 tracking-widest px-1">
                    {photo.orientation === 'landscape' ? 'Horizontal' : 'Vertical'}
                  </div>
                  <button 
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 scale-75 group-hover:scale-100"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Renderização das Páginas A4 */}
      <div id="report-content" className="report-container relative overflow-visible">
        {photos.length === 0 ? (
          <div className="no-print a4-page flex flex-col items-center justify-center border-dashed border-4 border-gray-200 rounded-3xl opacity-50 select-none">
            <div className="bg-gray-50 p-8 rounded-full mb-6">
              <FolderPlusIcon className="w-16 h-16 text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold text-lg text-center leading-tight">
              O relatório será gerado automaticamente<br/>
              após você adicionar as fotos.
            </p>
          </div>
        ) : (
          <>
            {landscapePages.map((pagePhotos: Photo[], idx: number) => (
              <ReportPage 
                key={`landscape-${idx}`} 
                metadata={metadata} 
                pageNumber={idx + 1} 
                totalPages={totalPages}
              >
                <div className="flex flex-col gap-10 h-full justify-center py-4">
                  {pagePhotos.map((photo: Photo) => (
                    <div key={photo.id} className="flex flex-col items-center">
                      <div className="w-full h-[340px] bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex items-center justify-center p-1">
                        <img src={photo.url} alt={photo.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <p className="mt-3 text-[11pt] text-gray-800 font-semibold text-center border-l-2 border-blue-500 pl-3 leading-tight uppercase tracking-tight">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              </ReportPage>
            ))}

            {portraitPages.map((pagePhotos: Photo[], idx: number) => (
              <ReportPage 
                key={`portrait-${idx}`} 
                metadata={metadata} 
                pageNumber={landscapePages.length + idx + 1} 
                totalPages={totalPages}
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-10 h-full items-center py-4">
                  {pagePhotos.map((photo: Photo) => (
                    <div key={photo.id} className="flex flex-col items-center">
                      <div className="w-full h-[340px] bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex items-center justify-center p-1">
                        <img src={photo.url} alt={photo.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <p className="mt-3 text-[10pt] text-gray-800 font-semibold text-center border-l-2 border-blue-500 pl-3 leading-tight uppercase tracking-tight">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              </ReportPage>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
