import { TIENDA } from "../data/contenido.js";
import { bolivares } from "../utils/dinero.js";
import { aplicarPrecios } from "./tienda.js";

const local = TIENDA.productos[0];

const api = (opciones) => ({ codigo: local.id, nombre: "Administrativo", iva: null, opciones });

describe("aplicarPrecios", () => {
  it("pone el precio de la API y conserva los textos locales", () => {
    const r = aplicarPrecios(local, api([{ codigo: "mensual", nombre: "Mensual", meses: 1, precio: 120, destacado: "" }]));
    expect(r.pagos).toHaveLength(1);
    expect(r.pagos[0].precio).toBe(120);
    expect(r.pagos[0].resumen).toBe(local.pagos.find((p) => p.id === "mensual").resumen);
    expect(r.marca).toBe(local.marca);
  });

  it("sigue el orden de la API y quita las opciones que ya no trae", () => {
    const r = aplicarPrecios(
      local,
      api([
        { codigo: "mensual", nombre: "Mensual", meses: 1, precio: 100, destacado: "" },
        { codigo: "anual", nombre: "Anual", meses: 12, precio: 700, destacado: "El plan más solicitado" },
      ]),
    );
    expect(r.pagos.map((p) => p.id)).toEqual(["mensual", "anual"]);
  });

  it("el sello destacado lo decide la API", () => {
    const r = aplicarPrecios(local, api([{ codigo: "anual", nombre: "Anual", meses: 12, precio: 700, destacado: "" }]));
    expect(r.pagos[0].destacado).toBeUndefined();
  });

  it("ignora una opción de la API sin textos locales", () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = aplicarPrecios(local, api([{ codigo: "semestral", nombre: "Semestral", meses: 6, precio: 400, destacado: "" }]));
    expect(r.pagos).toEqual([]);
    expect(aviso).toHaveBeenCalled();
    aviso.mockRestore();
  });
});

describe("bolivares", () => {
  it("usa punto de miles, coma decimal y dos decimales", () => {
    expect(bolivares(28017.5)).toBe("Bs 28.017,50");
    expect(bolivares(40.25, false)).toBe("40,25");
  });
});
