
import React from 'react';
import { ReportMetadata } from '../types';
import ReportHeader from './ReportHeader';

interface ReportPageProps {
  metadata: ReportMetadata;
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
}

const ReportPage: React.FC<ReportPageProps> = ({ metadata, pageNumber, totalPages, children }) => {
  return (
    <div className="a4-page page-break relative flex flex-col">
      {/* Institutional Header */}
      <ReportHeader metadata={metadata} />
      
      {/* Content Area */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer / Page Counter */}
      <div className="mt-8 text-right border-t border-gray-200 pt-2 text-[9pt] text-gray-400 italic">
        Relatório Fotográfico Institucional - Página {pageNumber} de {totalPages}
      </div>
    </div>
  );
};

export default ReportPage;
