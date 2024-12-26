import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { baseData64 } from '../base64';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export async function Certificate(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const documentDefinition = {
        content: [
          {
            columns: [
              {
                image: baseData64, // Logo en la izquierda
                width: 130,
              },
              {
                text: 'No. 84336',
                color: 'red',
                fontSize: 20,
                bold: true,
                alignment: 'right',
                margin: [0, 20, 10, 0],
              },
            ],
          },
          {
            text: '\nBarranquilla, 2024-09-17\n\nSeñores:\nA QUIEN INTERESE\nCiudad',
            fontSize: 12,
          },
          {
            text: 'Ref.: Constancia de Disposición de Baterías Posconsumo',
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 10],
          },
          {
            text: 'Por medio del presente, BATERIAS WILLARD S.A., en calidad de fabricante de Baterías Plomo Ácido, hace constar el recibo de las siguientes baterías usadas (BUPA) entregadas por parte de FRENOPARTES DE OCCIDENTE S.A.S, empresa identificada con el NIT n° 900336245-5 y por parte de POLLOS BUCANERO identificados con el NIT 800147463-4 :',
            fontSize: 12,
            alignment: 'justify',
          },
          {
            table: {
              headerRows: 1,
              widths: Array(12).fill('8%'), // Ancho fijo para 12 columnas
              body: [
                [
                  { text: 'MES', style: 'tableHeader' },
                  { text: 'BAT.22', style: 'tableHeader' },
                  { text: 'BAT.24', style: 'tableHeader' },
                  { text: 'BAT.27', style: 'tableHeader' },
                  { text: 'BAT.30', style: 'tableHeader' },
                  { text: 'BAT.34', style: 'tableHeader' },
                  { text: 'BAT.48', style: 'tableHeader' },
                  { text: 'BAT.4D', style: 'tableHeader' },
                  { text: 'BAT.8D', style: 'tableHeader' },
                  { text: 'SUBTOTAL', style: 'tableHeader' },
                  { text: 'EXTRA1', style: 'tableHeader' },
                  { text: 'EXTRA2', style: 'tableHeader' },
                ],
                ['SEPTIEMBRE.2024', '0.00', '1.00', '0.00', '23.00', '0.00', '0.00', '1.00', '0.00', '25.00', '0.00', '50.00'],
                ['SUBTOTAL.BAT', '0.00', '1.00', '0.00', '23.00', '0.00', '0.00', '1.00', '0.00', '25.00', '0.00', '50.00'],
                ['SUBTOTAL.PESO', '0.00', '14.80', '0.00', '506.00', '0.00', '0.00', '40.00', '0.00', '560.80', '0.00', '1000.00'],
              ],
            },
            layout: 'lightHorizontalLines', // Estilo de tabla predeterminado
          },
          {
            text: 'Las baterías identificadas en este documento fueron entregadas a PELAEZ HERMANOS S.A...',
            fontSize: 12,
            alignment: 'justify',
            margin: [0, 5, 0, 5],
          },
          {
            text: 'Con este proceso damos cumplimiento a las normas establecidas relacionadas con el manejo...',
            fontSize: 12,
            alignment: 'justify',
          },
          {
            text: '\nDenis Charris Caballero\nDirector de Gestión',
            fontSize: 12,
            alignment: 'center',
            margin: [0, 20, 0, 0],
          },
          {
            text: 'BATTERIAS WILLARD S.A.\nNIT: 800.022.558-4',
            fontSize: 12,
            alignment: 'center',
            margin: [0, 10, 0, 0],
          },
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 6, // Tamaño de texto pequeño para la tabla
            color: 'black',
            fillColor: '#D1C4E9',
            alignment: 'center',
          },
        },
        defaultStyle: {
          fontSize: 6, // Tamaño de fuente predeterminado pequeño para toda la tabla
        },
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 20], // Márgenes mínimos
      };

      pdfMake.createPdf(documentDefinition as any).open();
      resolve('PDF generado correctamente');
    } catch (error) {
      reject(error);
    }
  });
}
