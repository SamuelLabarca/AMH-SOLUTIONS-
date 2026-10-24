import {
  NAVEGACION,
  SERVICIOS,
  MODULOS,
  TIENDA,
  DEMO,
  CLIENTES,
  BENEFICIOS,
  PREGUNTAS,
  NOSOTROS,
  WHATSAPP,
  ATENCION,
  TARJETAS_HERO,
  VENTAJAS,
  PANEL,
} from "../data/contenido.js";
import { dolares, ahorro, desglose } from "../components/tienda.jsx";

/* ------------------------------------------------------------------
   PRUEBAS DE DATOS — smoke test que garantiza que contenido.js exporta
   estructuras con la forma esperada. Si un campo se borra o cambia de
   nombre, el build no rompe (JS no es tipado) pero estos tests sí.
------------------------------------------------------------------- */

describe("NAVEGACION", () => {
  it("tiene al menos un enlace con ruta", () => {
    const conRuta = NAVEGACION.filter((n) => n.ruta);
    expect(conRuta.length).toBeGreaterThanOrEqual(1);
  });

  it("el dropdown 'Productos' tiene hijos", () => {
    const productos = NAVEGACION.find((n) => n.etiqueta === "Productos");
    expect(productos).toBeDefined();
    expect(productos.hijos.length).toBeGreaterThanOrEqual(1);
  });
});

describe("SERVICIOS", () => {
  it("tiene exactamente 4 servicios", () => {
    expect(SERVICIOS).toHaveLength(4);
  });

  it("cada servicio tiene id, titulo, imagen, alt y texto", () => {
    SERVICIOS.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.titulo).toBeTruthy();
      expect(s.imagen).toBeTruthy();
      expect(s.alt).toBeTruthy();
      expect(typeof s.texto).toBe("string");
    });
  });
});

describe("MODULOS", () => {
  it("tiene los 5 módulos en orden de flujo de efectivo", () => {
    expect(MODULOS).toHaveLength(5);
    const nombres = MODULOS.map((m) => m.nombre);
    expect(nombres).toEqual([
      "Punto de venta",
      "Inventario",
      "Compras",
      "Recursos Humanos",
      "Finanzas",
    ]);
  });

  it("cada módulo tiene todos los campos requeridos", () => {
    MODULOS.forEach((m) => {
      expect(m.id).toBeTruthy();
      expect(m.nombre).toBeTruthy();
      expect(m.icono).toBeTruthy();
      expect(m.enCorto).toBeTruthy();
      expect(m.alt).toBeTruthy();
      expect(typeof m.general).toBe("string");
      expect(typeof m.detalle).toBe("string");
      expect(Array.isArray(m.destacados)).toBe(true);
      expect(m.destacados.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe("TIENDA", () => {
  it("tiene un solo producto", () => {
    expect(TIENDA.productos).toHaveLength(1);
  });

  it("el producto tiene tres formas de pago con una destacada", () => {
    const producto = TIENDA.productos[0];
    expect(producto.pagos).toHaveLength(3);
    const destacados = producto.pagos.filter((p) => p.destacado);
    expect(destacados).toHaveLength(1);
  });
});

describe("DEMO", () => {
  it("define eyebrow, titulo, texto y puntos", () => {
    expect(DEMO.eyebrow).toBeTruthy();
    expect(DEMO.titulo).toBeTruthy();
    expect(DEMO.texto).toBeTruthy();
    expect(Array.isArray(DEMO.puntos)).toBe(true);
    expect(DEMO.puntos.length).toBeGreaterThanOrEqual(2);
  });
});

describe("CLIENTES", () => {
  it("tiene tres perfiles", () => {
    expect(CLIENTES.perfiles).toHaveLength(3);
  });
});

describe("BENEFICIOS", () => {
  it("tiene una lista con al menos 4 elementos", () => {
    expect(Array.isArray(BENEFICIOS.lista)).toBe(true);
    expect(BENEFICIOS.lista.length).toBeGreaterThanOrEqual(4);
  });
});

describe("PREGUNTAS", () => {
  it("cada categoría tiene preguntas", () => {
    PREGUNTAS.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.titulo).toBeTruthy();
      expect(Array.isArray(cat.preguntas)).toBe(true);
      expect(cat.preguntas.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("NOSOTROS", () => {
  it("define proposito, intro y cierre", () => {
    expect(NOSOTROS.proposito).toBeTruthy();
    expect(NOSOTROS.intro).toBeTruthy();
    expect(NOSOTROS.cierre.titulo).toBeTruthy();
    expect(NOSOTROS.cierre.boton).toBeTruthy();
  });
});

describe("WHATSAPP y ATENCION", () => {
  it("el número de WhatsApp no lleva + ", () => {
    expect(WHATSAPP.numero).not.toMatch(/\+/);
  });

  it("ATENCION tiene teléfono", () => {
    expect(ATENCION.telefono).toMatch(/\+/);
  });
});

describe("TARJETAS_HERO", () => {
  it("tiene tres tarjetas", () => {
    expect(TARJETAS_HERO).toHaveLength(3);
  });
});

describe("VENTAJAS y PANEL", () => {
  it("VENTAJAS tiene tres elementos con forma", () => {
    expect(VENTAJAS).toHaveLength(3);
    VENTAJAS.forEach((v) => expect(v.forma).toBeTruthy());
  });

  it("PANEL define eyebrow, titulo, texto y módulos", () => {
    expect(PANEL.eyebrow).toBeTruthy();
    expect(PANEL.titulo).toBeTruthy();
    expect(PANEL.texto).toBeTruthy();
    expect(PANEL.modulos.length).toBe(5);
  });
});

/* ------------------------------------------------------------------
   PRUEBAS DE UTILIDADES DE LA TIENDA
------------------------------------------------------------------- */
describe("dolares", () => {
  it("formatea con separador de miles y coma decimal", () => {
    expect(dolares(1234.5)).toBe("$1.234,50");
  });

  it("sin decimales si es entero", () => {
    expect(dolares(700)).toBe("$700");
  });

  it("más de mil", () => {
    expect(dolares(12345.75)).toBe("$12.345,75");
  });
});

describe("ahorro", () => {
  it("calcula el porcentaje frente al mensual", () => {
    const pagos = [
      { meses: 1, precio: 100 },
      { meses: 3, precio: 270 },
      { meses: 12, precio: 700 },
    ];
    /* 270/3 = 90 por mes vs 100: ahorra 10% */
    expect(ahorro(pagos[1], pagos)).toBe(10);
  });

  it("null cuando es el propio mensual", () => {
    const pagos = [{ meses: 1, precio: 100 }];
    expect(ahorro(pagos[0], pagos)).toBeNull();
  });

  it("null cuando falta el precio", () => {
    expect(ahorro({ meses: 12 }, [{ meses: 1, precio: 100 }])).toBeNull();
  });
});

describe("desglose", () => {
  it("aplica el IVA y suma", () => {
    expect(desglose(100, 16)).toEqual({
      subtotal: 100,
      impuesto: 16,
      total: 116,
    });
  });

  it("null sin precio", () => {
    expect(desglose(null, 16)).toBeNull();
  });

  it("cero impuestos con iva undefined", () => {
    expect(desglose(200, null)).toEqual({
      subtotal: 200,
      impuesto: 0,
      total: 200,
    });
  });
});
