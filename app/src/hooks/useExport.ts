import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportOptions } from '@/types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPNG = useCallback(
    async (element: HTMLElement, filename: string = 'diagram.png') => {
      setIsExporting(true);
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();
        setError(null);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const exportToPDF = useCallback(
    async (element: HTMLElement, filename: string = 'diagram.pdf') => {
      setIsExporting(true);
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const PX_TO_MM = 0.264583;
        const widthMm = canvas.width * PX_TO_MM;
        const heightMm = canvas.height * PX_TO_MM;
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [widthMm, heightMm],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm);
        pdf.save(filename);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const exportToJSON = useCallback(
    (data: any, filename: string = 'diagram.json') => {
      try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const export_ = useCallback(
    async (
      element: HTMLElement | any,
      format: ExportOptions['format'],
      filename?: string
    ) => {
      switch (format) {
        case 'png':
          return exportToPNG(element, filename);
        case 'pdf':
          return exportToPDF(element, filename);
        case 'json':
          return exportToJSON(element, filename);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    },
    [exportToPNG, exportToPDF, exportToJSON]
  );

  return {
    isExporting,
    error,
    export: export_,
    exportToPNG,
    exportToPDF,
    exportToJSON,
  };
};
