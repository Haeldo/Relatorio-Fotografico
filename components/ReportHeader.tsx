
import React from 'react';
import { ReportMetadata } from '../types';

interface ReportHeaderProps {
  metadata: ReportMetadata;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ metadata }) => {
  return (
    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-8">
      {/* Bloco de Informações (Esquerda) */}
      <div className="flex flex-col gap-0.5 max-w-[70%]">
        <h2 className="text-[14pt] font-extrabold text-gray-900 leading-tight uppercase tracking-tight">
          {metadata.orgao || 'ÓRGÃO OU ENTIDADE'}
        </h2>
        <div className="text-[12pt] font-medium text-gray-800 leading-snug">
          {metadata.objeto || 'Descrição do Objeto'}
        </div>
        <div className="text-[11pt] text-gray-700">
          <span className="font-semibold">Data:</span> {metadata.data || '___ de __________ de 202__'}
        </div>
      </div>

      {/* Bloco do Logo (Direita) */}
      <div className="w-40 h-20 flex items-center justify-center">
        {metadata.logoUrl ? (
          <img 
            src={metadata.logoUrl} 
            alt="Logo" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 no-print">
            <span className="text-gray-400 font-bold text-sm tracking-widest">LOGO</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHeader;
