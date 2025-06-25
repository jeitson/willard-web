import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { baseData64 } from '../base64';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export async function Certificate(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // "2025-06-13"

      const documentDefinition = {
        content: [
          {
            columns: [
              { image: baseData64, width: 100 },
              {
                text: 'No. 84336',
                color: 'red',
                fontSize: 16,
                bold: true,
                alignment: 'right',
                margin: [0, 10, 5, 0],
              },
            ],
          },
         {
            text: `Barranquilla, ${formattedDate}\n\nSeñores:\nA QUIEN INTERESE\nCiudad`,
            fontSize: 10,
            margin: [0, 5, 0, 10],
          },
          {
            text: 'Ref.: Constancia de Disposición de Baterías Posconsumo',
            fontSize: 12,
            bold: true,
            margin: [0, 5, 0, 5],
          },
          {
            text: 'Por medio del presente, BATERIAS WILLARD S.A., en calidad de fabricante de Baterías Plomo Ácido, hace constar el recibo de las siguientes baterías usadas (BUPA) entregadas por parte de FRENOPARTES DE OCCIDENTE S.A.S, empresa identificada con el NIT n° 900336245-5 y por parte de POLLOS BUCANERO identificados con el NIT 800147463-4 :',
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: [
                '14%',
                '9%',
                '9%',
                '9%',
                '9%',
                '9%',
                '9%',
                '9%',
                '9%',
                '9%',
              ],
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
                ],
                [
                  'SEPT.2024',
                  '0.00',
                  '1.00',
                  '0.00',
                  '23.00',
                  '0.00',
                  '0.00',
                  '1.00',
                  '0.00',
                  '25.00',
                ],
                [
                  'SUBTOTAL.BAT',
                  '0.00',
                  '1.00',
                  '0.00',
                  '23.00',
                  '0.00',
                  '0.00',
                  '1.00',
                  '0.00',
                  '25.00',
                ],
                [
                  'SUBTOTAL.PESO',
                  '0.00',
                  '14.80',
                  '0.00',
                  '506.00',
                  '0.00',
                  '0.00',
                  '40.00',
                  '0.00',
                  '560.80',
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any) {
                return rowIndex === 0 ? '#BDB2D3' : null;
              },
            },
          },
          {
            text: 'Lo anterior, en virtud de las obligaciones establecidas por la Resolución No. 372 de 2009, modifcada por la Resolución No. 361 de 2011, norma que reglamenta los Planes de Gestión de Devolución de Productos Posconsumo de Baterías Usadas Plomo Acido (Y31/A1160, según decreto 4741 de 2005 y decreto 1076 de 2015, articulo 2.2.6.1.2.1 ANEXO 1 a 3 Y ANEXO 2) e impone al fabricante la obligación de contar con un plan de esta índole para la recolección de las BUPA y a los consumidores la obligación de la entregar los residuos posconsumo al mecanismo de retorno que el fabricante establezca. ',
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 5, 0, 5],
          },
          {
            text: 'Las baterías identifcadas en este documento fueron entregadas a PELAEZ HERMANOS S.A, empresa identifcada con el NIT No. 890.101.138-0, que hace parte de los centros de acopio autorizados a nivel nacional, según Plan de Gestión Posconsumo identifcado ante la Autoridad Nacional de Licencias Ambientales (ANLA) como el expediente GDP-0029 de titularidad de Baterías Willard S.A.',
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 5, 0, 5],
          },
          {
            text: 'Posterior a esto, son entregadas a FUNDIMETAL DE COLOMBIA S. A. S. (autorizado dentro del GDP-0029), identifcado con el NIT No. 8903231147, persona jurídica que cuenta con Licencia Ambiental otorgada mediante RES. 0100 No 0150-0562 del 25 de julio de 2018, gestor fnal que realiza el almacenamiento, desmantelamiento, aprovechamiento y fundición del plomo, para nuevamente ser APROVECHADO en el proceso de fabricación de nuestras baterías. ',
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 5, 0, 5],
          },
          {
            text: 'Con este proceso damos cumplimiento a las normas establecidas relacionadas con el manejo de residuos peligrosos, en especial la Ley 253 de 1996, la Ley 430 de 1998, el Decreto 1076 de 2015 en los numerales 2.2.6.1.4.1. y 2.2.6.1.4.2 de la sección 4 (Decreto 4741 de 2005), la Resolución No. 372 de 2009 y la Resolución No.361de2011. ',
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 5, 0, 5],
          },
          {
            alignment: 'center', // Alinea todo el contenido al centro
            margin: [0, 95, 0, 0], // Ajusta la posición vertical del bloque
            stack: [
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 200, // Asegura que la línea tenga el mismo ancho que el texto
                    y2: 0,
                    lineWidth: 2, // Ajusta el grosor de la línea
                  },
                ],
              },
              {
                text: 'Denis Charris Caballero\nDirector de Gestión',
                fontSize: 10,
                margin: [0, 10, 0, 0], // Espaciado después de la línea
              },
              {
                text: 'BATTERIAS WILLARD S.A.\nNIT: 800.022.558-4',
                fontSize: 10,
                margin: [0, 5, 0, 0], // Espaciado entre el nombre y la empresa
              },
            ],
          }
          
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 8,
            color: 'black',
            fillColor: '#D1C4E9',
            alignment: 'center',
          },
        },
        defaultStyle: { fontSize: 8 },
        pageSize: 'A4',
        pageMargins: [15, 15, 15, 15],
      };

      pdfMake.createPdf(documentDefinition as any).open();
      resolve('PDF generado correctamente');
    } catch (error) {
      reject(error);
    }
  });
}
