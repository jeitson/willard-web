import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { baseData64 } from '../base64';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export async function Certificate(
  producto: any,
  data: any,
  firma: any
): Promise<string> {
  console.log(data);
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
            text: `Por medio del presente, BATERÍAS WILLARD S.A., en calidad de fabricante de baterías de plomo-ácido, hace constar el recibo de las siguientes baterías usadas (BUPA) entregadas por parte de ${
              data.NombreCliente
            }, empresa identificada con el NIT N.º ${data.NitCliente}${
              data.Recuperadora
                ? `, y por parte de ${data.Recuperadora} identificados con el NIT ${data.NitRecuperadora}`
                : ''
            }.`,
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 0, 0, 10],
          },

          {
            table: {
              headerRows: 1,
              widths: ['auto', ...Array(producto.length).fill('auto'), 'auto'],
              body: generateBatteryTable(producto, data),
            },
            layout: 'lightHorizontalLines',
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
            text: `Posterior a esto, son entregadas a ${data.recuperadora}, autorizado dentro del GDP-0029, identificado con el NIT No. 8903231147, persona jurídica que cuenta con Licencia Ambiental otorgada mediante Resolución 0100 No. 0150-0562 del 25 de julio de 2018. Este gestor final realiza el almacenamiento, desmantelamiento, aprovechamiento y fundición del plomo, el cual posteriormente es aprovechado nuevamente en el proceso de fabricación de nuestras baterías.`,
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
            alignment: 'center',
            margin: [0, 60, 0, 0], // Ajusta separación desde arriba
            stack: [
              // 📌 Firma superior
              {
                image: firma, // base64 o dataURL
                width: 130,
                alignment: 'center',
                margin: [0, 0, 0, 5], // Espaciado debajo de la firma
              },

              // 📌 Línea horizontal
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 200,
                    y2: 0,
                    lineWidth: 1.5,
                  },
                ],
                margin: [0, 10, 0, 5],
              },

              // 📌 Nombre y cargo
              {
                text: 'Denis Charris Caballero\nDirector de Gestión',
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 3],
              },

              // 📌 Empresa y NIT
              {
                text: 'BATTERIAS WILLARD S.A.\nNIT: 800.022.558-4',
                fontSize: 9,
                margin: [0, 0, 0, 0],
              },
            ],
          },
          {
            text: `IRC: ${data.ircs.join(
              ', '
            )}.`,
            fontSize: 10,
            alignment: 'justify',
            margin: [0, 25, 0, 5],
          },
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 6,
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

function generateBatteryTable(productos: any[], data: any) {
  const mesLabel = getMesLabel(data.Fecha);

  // 1️⃣ Crear headers BAT.X dinámicos
  const headers = productos.map((p) => `BAT.${p.referencePH}`);

  // 2️⃣ Mapa de cantidades basado en data.productos
  const cantidadesMap: Record<string, number> = {};

  data.productos.forEach((item: any) => {
    if (!item.producto) return;

    const prod = productos.find((p) => p.referencePH === item.referencia);
    if (prod) {
      cantidadesMap[prod.name] =
        (cantidadesMap[prod.name] || 0) + item.cantidad;
    }
  });

  // 3️⃣ Cantidades ordenadas según el orden real de productos
  const cantidadesOrdenadas = productos.map((p) => cantidadesMap[p.name] || 0);

  // 4️⃣ SUBTOTAL.BAT
  const subtotalBAT = cantidadesOrdenadas.reduce((a, b) => a + b, 0);

  // 5️⃣ SUBTOTAL.PESO
  const subtotalPESO = productos.reduce((acc, p, idx) => {
    return acc + cantidadesOrdenadas[idx] * Number(p.averageKg || 0);
  }, 0);

  // 6️⃣ Construir el body completo para pdfmake
  const body: any[] = [];

  // HEADER
  body.push([
    { text: 'MES', style: 'tableHeader' },
    ...headers.map((h) => ({ text: h, style: 'tableHeader' })),
    { text: 'SUBTOTAL', style: 'tableHeader' },
  ]);

  // FILA DEL MES
  body.push([
    mesLabel,
    ...cantidadesOrdenadas.map((c) => c.toFixed(2)),
    subtotalBAT.toFixed(2),
  ]);

  // SUBTOTAL.BAT
  body.push([
    'SUBTOTAL.BAT',
    ...cantidadesOrdenadas.map((c) => c.toFixed(2)),
    subtotalBAT.toFixed(2),
  ]);

  // SUBTOTAL.PESO
  body.push([
    'SUBTOTAL.PESO',
    ...productos.map((p, idx) =>
      (cantidadesOrdenadas[idx] * Number(p.averageKg || 0)).toFixed(2)
    ),
    subtotalPESO.toFixed(2),
  ]);

  return body;
}

function getMesLabel(fecha: string): string {
  const meses = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEPT',
    'OCT',
    'NOV',
    'DIC',
  ];

  const d = new Date(fecha);
  const mes = meses[d.getUTCMonth()];
  const anio = d.getUTCFullYear();

  return `${mes}.${anio}`;
}
