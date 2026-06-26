import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFGenerationData {
  user: any;
  riskAssessments: any[];
  familyMembers: any[];
  recommendations: any[];
  passport: any;
}

export async function generatePDF(data: PDFGenerationData) {
  try {
    // Get the health passport content element
    const element = document.getElementById('health-passport-content');
    if (!element) {
      throw new Error('Health passport content not found');
    }

    // Configure html2canvas options for better PDF quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions for PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with user name and date
    const filename = `health-passport-${data.user?.name?.replace(/\s+/g, '-').toLowerCase() || 'user'}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export async function generatePDFBlob(data: PDFGenerationData): Promise<Blob> {
  try {
    const element = document.getElementById('health-passport-content');
    if (!element) {
      throw new Error('Health passport content not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('Failed to generate PDF blob');
  }
}
