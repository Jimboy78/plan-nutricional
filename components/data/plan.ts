export interface Macros {
  kcal: number;
  cho: number;
  pro: number;
  fat: number;
}

export interface OpcionComida {
  desc: string;
  macros: Macros;
}

export interface Comida {
  hora: string;
  nom: string;
  desc: string;
  macros: Macros;
  opciones?: OpcionComida[];
}

export interface DayPlan {
  label: string;
  kcal: number;
  cho: number;
  pro: number;
  fat: number;
  detalle: string;
  comidas: Comida[];
}

export interface BatchItem {
  nom: string;
  cant: string;
  tiempo: string;
  rinde: string;
  prep: string;
}

export interface BatchCategory {
  col: string;
  color: string;
  bg: string;
  border: string;
  tip: string;
  items: BatchItem[];
}

export interface Suplemento {
  nom: string;
  dosis: string;
  timing: string;
  nota: string;
  color: string;
}

export interface ShoppingCategory {
  cat: string;
  color: string;
  bg: string;
  border: string;
  items: [string, string][];
}

export const NAV = ["Perfil & Macros", "Suplementos", "Plan por Dia", "Batch Cooking", "Lista de Compras"];

export const BATCH_TABS = [
  { key: "proteina", label: "🍗 Proteinas", color: "#0f2744", bg: "#eff6ff", border: "#bfdbfe" },
  { key: "carbo", label: "🍚 Carbohidratos", color: "#1e3a5f", bg: "#f0fdf4", border: "#bbf7d0" },
  { key: "verdura", label: "🥦 Verduras", color: "#166534", bg: "#f9fafb", border: "#e5e7eb" },
  { key: "extras", label: "⚡ Extras", color: "#92400e", bg: "#fff7ed", border: "#fed7aa" },
];

export const SUPLEMENTOS: Suplemento[] = [
  { nom: "Creatina Monohidratada", dosis: "5g/dia", timing: "Con agua o en el batido post-entreno. Todos los dias, incluso sin entreno.", nota: "Dosis correcta. No necesitas carga previa. El efecto es acumulativo.", color: "#22c55e" },
  { nom: "Proteina en Polvo", dosis: "1 scoop post-entreno", timing: "Dentro de los 45 min post-esfuerzo.", nota: "Usarla para completar los 180g diarios cuando no llegas con comida real.", color: "#22c55e" },
  { nom: "Vitamina D3", dosis: "1000-2000 UI/dia", timing: "Con una comida que tenga grasa (mejor absorcion).", nota: "Deficit frecuente en deportistas indoor. Pedir analitica para ajustar dosis exacta.", color: "#22c55e" },
  { nom: "Vitamina C", dosis: "500-1000mg/dia", timing: "Con las comidas principales.", nota: "Cofactor esencial para sintesis de colageno. Relevante post-sutura de menisco.", color: "#22c55e" },
  { nom: "Centrum Hombre", dosis: "1 comprimido/dia", timing: "Con almuerzo o cena.", nota: "Tomarlo siempre con comida para evitar nauseas y mejorar absorcion.", color: "#22c55e" },
];

// ── Opciones compartidas ──

// Desayunos: 3 opciones por nivel calorico (alto/medio/bajo segun tipo de dia)
const OPCIONES_DESAYUNO_BASQUET: OpcionComida[] = [
  { desc: "Avena 80g (seca) + 300ml leche + 1 banana en rodajas + miel", macros: { kcal: 550, cho: 95, pro: 18, fat: 10 } },
  { desc: "3 tostadas pan lactal integral + 2 huevos revueltos + 1/2 palta + tomate", macros: { kcal: 520, cho: 48, pro: 24, fat: 26 } },
  { desc: "200g yogur natural + 80g granola/avena + 1 banana + 20g nueces + miel", macros: { kcal: 560, cho: 85, pro: 16, fat: 18 } },
  { desc: "Panqueques de avena (80g avena + 1 huevo + leche) + 1 banana + miel", macros: { kcal: 530, cho: 90, pro: 20, fat: 10 } },
];

const OPCIONES_DESAYUNO_GIMNASIO: OpcionComida[] = [
  { desc: "Avena 70g (seca) + 300ml leche + 1 fruta + miel. Mas liviano que dia de basquet.", macros: { kcal: 480, cho: 82, pro: 16, fat: 9 } },
  { desc: "2 tostadas pan lactal integral + 2 huevos revueltos + 1/2 palta", macros: { kcal: 440, cho: 32, pro: 22, fat: 24 } },
  { desc: "200g yogur natural + 60g granola/avena + 1 fruta + 15g nueces", macros: { kcal: 460, cho: 68, pro: 14, fat: 15 } },
  { desc: "Panqueques de avena (70g avena + 1 huevo + leche) + fruta + miel", macros: { kcal: 470, cho: 78, pro: 18, fat: 9 } },
];

const OPCIONES_DESAYUNO_DESCANSO: OpcionComida[] = [
  { desc: "Avena 60g (seca) + 300ml leche + 1 fruta. Sin miel o minima.", macros: { kcal: 400, cho: 68, pro: 15, fat: 7 } },
  { desc: "2 tostadas pan lactal integral + 1 huevo revuelto + queso magro", macros: { kcal: 350, cho: 30, pro: 20, fat: 16 } },
  { desc: "200g yogur natural + 50g granola/avena + 1 fruta", macros: { kcal: 380, cho: 60, pro: 13, fat: 10 } },
  { desc: "Panqueques de avena (60g avena + 1 huevo + leche) + fruta", macros: { kcal: 390, cho: 65, pro: 16, fat: 8 } },
];

const OPCIONES_COLACION_AM: OpcionComida[] = [
  { desc: "200g yogur natural + 20g nueces + miel", macros: { kcal: 280, cho: 30, pro: 12, fat: 14 } },
  { desc: "2 frutas + 20g almendras", macros: { kcal: 230, cho: 40, pro: 5, fat: 8 } },
  { desc: "2 tostadas pan lactal integral + queso magro + 1/2 palta", macros: { kcal: 280, cho: 28, pro: 14, fat: 13 } },
];

const OPCIONES_COLACION_PM: OpcionComida[] = [
  { desc: "200g yogur natural + 20g nueces", macros: { kcal: 250, cho: 20, pro: 12, fat: 14 } },
  { desc: "1 fruta + 20g frutos secos", macros: { kcal: 200, cho: 35, pro: 4, fat: 7 } },
  { desc: "2 huevos duros + 1 tostada pan lactal integral", macros: { kcal: 230, cho: 12, pro: 16, fat: 12 } },
];

const OPCIONES_PRE_BASQUET: OpcionComida[] = [
  { desc: "1 lata atun al agua + 2 fetas pan lactal. Sin grasa ni fibra alta. 2-3hs antes.", macros: { kcal: 250, cho: 25, pro: 30, fat: 3 } },
  { desc: "150g pollo en cubos + 80g arroz blanco (tupper liviano, sin verdura voluminosa). 2-3hs antes.", macros: { kcal: 350, cho: 58, pro: 30, fat: 3 } },
  { desc: "2 tostadas pan lactal + queso magro + tomate. Sin grasa ni fibra alta. 2-3hs antes.", macros: { kcal: 200, cho: 24, pro: 12, fat: 6 } },
];

const OPCIONES_PRE_GIMNASIO: OpcionComida[] = [
  { desc: "200g yogur + 1 fruta + 20g nueces. 1-1.5hs antes.", macros: { kcal: 280, cho: 35, pro: 12, fat: 14 } },
  { desc: "Avena 50g + leche + 1 banana. 1-1.5hs antes.", macros: { kcal: 350, cho: 62, pro: 12, fat: 6 } },
  { desc: "2 tostadas pan lactal + queso magro + miel. 1-1.5hs antes.", macros: { kcal: 250, cho: 38, pro: 12, fat: 5 } },
];

const OPCIONES_POST_ENTRENO: OpcionComida[] = [
  { desc: "Batido: 300ml leche + 1 scoop proteina + 1 banana + 3 cdas avena + 1 cda mantequilla mani + 5g creatina.", macros: { kcal: 620, cho: 80, pro: 42, fat: 17 } },
  { desc: "Batido liviano: 300ml leche + 1 scoop proteina + 1 banana + 5g creatina (si no tenes hambre).", macros: { kcal: 380, cho: 50, pro: 35, fat: 6 } },
  { desc: "Sin licuadora: 200g yogur natural + 1 scoop proteina + 1 fruta + 20g nueces + 5g creatina.", macros: { kcal: 370, cho: 35, pro: 35, fat: 14 } },
];

export const PLAN: Record<string, DayPlan> = {
  basquet: {
    label: "Dia de Basquet 🏀", kcal: 3400, cho: 450, pro: 180, fat: 100, detalle: "Lunes / Miercoles / Viernes",
    comidas: [
      { hora: "7:30", nom: "Desayuno", desc: "Avena 80g (seca) + 300ml leche + 1 banana en rodajas + miel. Preparar en el momento.", macros: { kcal: 550, cho: 95, pro: 18, fat: 10 } },
      { hora: "10:30", nom: "Colacion AM", desc: OPCIONES_COLACION_AM[1].desc, macros: OPCIONES_COLACION_AM[1].macros, opciones: OPCIONES_COLACION_AM },
      { hora: "13:30", nom: "Almuerzo - Tupper", desc: "150g proteina cocida + arroz 150g crudo (pesado antes de cocinar) + 150g verdura cocida.", macros: { kcal: 750, cho: 120, pro: 50, fat: 12 } },
      { hora: "16:30", nom: "Pre-Basquet", desc: OPCIONES_PRE_BASQUET[0].desc, macros: OPCIONES_PRE_BASQUET[0].macros, opciones: OPCIONES_PRE_BASQUET },
      { hora: "Post", nom: "Post-Basquet inmediato", desc: OPCIONES_POST_ENTRENO[0].desc, macros: OPCIONES_POST_ENTRENO[0].macros, opciones: OPCIONES_POST_ENTRENO },
      { hora: "22:30", nom: "Cena - Tupper", desc: "150g proteina cocida + papa/batata 200g crudo + ensalada libre con oliva y limon.", macros: { kcal: 700, cho: 90, pro: 45, fat: 20 } },
    ]
  },
  gimnasio: {
    label: "Dia de Gimnasio 💪", kcal: 3100, cho: 390, pro: 180, fat: 90, detalle: "Martes / Jueves / Sabado",
    comidas: [
      { hora: "7:30", nom: "Desayuno", desc: "Avena 70g (seca) + 300ml leche + 1 fruta + miel. Mas liviano que dia de basquet.", macros: { kcal: 480, cho: 82, pro: 16, fat: 9 } },
      { hora: "10:30", nom: "Colacion AM", desc: OPCIONES_COLACION_AM[0].desc, macros: OPCIONES_COLACION_AM[0].macros, opciones: OPCIONES_COLACION_AM },
      { hora: "13:30", nom: "Almuerzo - Tupper", desc: "150g proteina cocida + fideos 75g crudo o arroz 120g crudo + 150g verdura cocida.", macros: { kcal: 650, cho: 95, pro: 48, fat: 10 } },
      { hora: "16:30", nom: "Pre-Gimnasio", desc: OPCIONES_PRE_GIMNASIO[0].desc, macros: OPCIONES_PRE_GIMNASIO[0].macros, opciones: OPCIONES_PRE_GIMNASIO },
      { hora: "Post", nom: "Post-Gimnasio inmediato", desc: OPCIONES_POST_ENTRENO[0].desc, macros: OPCIONES_POST_ENTRENO[0].macros, opciones: OPCIONES_POST_ENTRENO },
      { hora: "21:30", nom: "Cena - Tupper", desc: "150g proteina cocida + arroz integral 120g crudo + 150g verdura cocida.", macros: { kcal: 620, cho: 85, pro: 48, fat: 10 } },
    ]
  },
  descanso: {
    label: "Dia de Descanso 😴", kcal: 2700, cho: 320, pro: 175, fat: 80, detalle: "Domingo",
    comidas: [
      { hora: "8:30", nom: "Desayuno", desc: "Avena 60g (seca) + 300ml leche + 1 fruta. Sin miel o minima.", macros: { kcal: 400, cho: 68, pro: 15, fat: 7 } },
      { hora: "11:30", nom: "Colacion AM", desc: OPCIONES_COLACION_AM[0].desc, macros: OPCIONES_COLACION_AM[0].macros, opciones: OPCIONES_COLACION_AM },
      { hora: "14:00", nom: "Almuerzo - Tupper", desc: "150g proteina cocida + papa/batata 120g crudo + pure de calabaza 150g. Sin agregar mas carbo.", macros: { kcal: 550, cho: 75, pro: 45, fat: 10 } },
      { hora: "17:30", nom: "Colacion PM", desc: OPCIONES_COLACION_PM[1].desc, macros: OPCIONES_COLACION_PM[1].macros, opciones: OPCIONES_COLACION_PM },
      { hora: "21:00", nom: "Cena - Tupper", desc: "150g proteina cocida + arroz 80g crudo + verduras grilladas libres.", macros: { kcal: 530, cho: 70, pro: 45, fat: 12 } },
    ]
  }
};

export const BATCH: Record<string, BatchCategory> = {
  proteina: {
    col: "🍗 PROTEINAS", color: "#0f2744", bg: "#eff6ff", border: "#bfdbfe",
    tip: "Preparar 2-3 opciones distintas para rotar. Porciona de 150g cocido por tupper antes de guardar.",
    items: [
      { nom: "Pollo al horno en cubos", cant: "600g crudo → ~450g cocido", tiempo: "35 min", rinde: "3 tuppers x 150g", prep: "Ajo, pimenton, oregano, oliva. 200° x 30 min. Cubos al enfriar. Heladera 3-4 dias." },
      { nom: "Milanesa de pollo al horno", cant: "6 unidades ~600g", tiempo: "25 min", rinde: "3 dias", prep: "Huevo batido + pan rallado + condimentos. 200° x 20 min. Sin freir." },
      { nom: "Albondigas de pollo al horno", cant: "12 unidades", tiempo: "30 min", rinde: "3-4 tuppers", prep: "Carne picada de pollo + ajo + perejil + huevo + pan rallado. 200° x 20 min." },
      { nom: "Carne picada magra salteada", cant: "400g crudo", tiempo: "20 min", rinde: "3 tuppers", prep: "Saltear con cebolla, ajo, pimenton. Sin grasa extra. Guardar con jugo." },
      { nom: "Merluza/Lenguado al horno", cant: "400g", tiempo: "18 min", rinde: "2 tuppers", prep: "Limon, ajo, sal. 180° x 18 min. Consumir en 48hs. No freezar." },
      { nom: "Medallones de lentejas", cant: "10 unidades", tiempo: "45 min", rinde: "Freezar porciones", prep: "Lentejas cocidas + zanahoria rallada + pan rallado + huevo + condimentos. Horno o plancha." },
      { nom: "Huevos duros batch", cant: "8 unidades", tiempo: "12 min", rinde: "4-5 dias", prep: "Hervir 10 min desde agua fria. Guardar con cascara. Pelar solo al momento." },
      { nom: "Atun/Caballa en lata", cant: "2-3 latas", tiempo: "0 min", rinde: "Inmediato", prep: "Sin preparacion. Al agua, no al aceite. Para pre-basquet o colaciones." },
    ]
  },
  carbo: {
    col: "🍚 CARBOHIDRATOS", color: "#1e3a5f", bg: "#f0fdf4", border: "#bbf7d0",
    tip: "Pesas siempre en CRUDO antes de cocinar. La cantidad varia segun el dia (ver tabla abajo).",
    items: [
      { nom: "Arroz blanco", cant: "Basquet 150g / Gym 120g / Descanso 80g (crudo)", tiempo: "20 min", rinde: "1 tupper por porcion", prep: "Batch grande. Unas gotas de oliva para que no se pegue. Heladera 4-5 dias." },
      { nom: "Arroz integral", cant: "Basquet 150g / Gym 120g / Descanso 80g (crudo)", tiempo: "45 min", rinde: "1 tupper por porcion", prep: "Mayor fibra. Preferido para cenas de dia gym. Lavar antes de cocinar." },
      { nom: "Fideos al dente", cant: "Basquet 90g / Gym 75g / Descanso 55g (crudo)", tiempo: "12 min", rinde: "1 tupper por porcion", prep: "Sin salsa si es batch. Oliva para que no se peguen. Heladera 3 dias." },
      { nom: "Papa y batata al horno", cant: "Basquet 200g / Gym 170g / Descanso 120g (crudo)", tiempo: "40 min", rinde: "1 tupper por porcion", prep: "Cubos sin cascara, oliva y sal. 200° x 35-40 min. No freezar." },
      { nom: "Batata entera al horno", cant: "Basquet 200g / Gym 170g / Descanso 120g (crudo)", tiempo: "45 min", rinde: "1 tupper por porcion", prep: "Entera con piel. 200° x 45 min. Facil de llevar, fria esta bien." },
      { nom: "Quinoa cocida", cant: "Basquet 130g / Gym 100g / Descanso 70g (crudo)", tiempo: "18 min", rinde: "1 tupper por porcion", prep: "Lavar bien antes. 1:2 (quinoa:agua). Proteina completa + carbo en uno." },
      { nom: "Pure de papa y batata", cant: "Basquet 200g / Gym 170g / Descanso 120g (crudo)", tiempo: "30 min", rinde: "3-4 porciones", prep: "Hervir y pisar. Sal y nuez moscada. Sin manteca." },
    ]
  },
  verdura: {
    col: "🥦 VERDURAS", color: "#166534", bg: "#f9fafb", border: "#e5e7eb",
    tip: "150-200g cocida por tupper. Las crudas armarlas el momento, no en batch.",
    items: [
      { nom: "Verduras grilladas mixtas", cant: "500g mixtas → ~400g cocido", tiempo: "25 min", rinde: "3-4 tuppers x 150g", prep: "Zapallito, berenjena, morron, cebolla. Grill o sarten, minimo aceite. Heladera 3 dias." },
      { nom: "Brocoli/Coliflor al vapor", cant: "400g", tiempo: "10 min", rinde: "3 tuppers", prep: "Vapor exacto 10 min. No pasar de coccion. Oliva + limon al servir." },
      { nom: "Espinaca/Acelga salteada", cant: "400g crudo → ~200g cocido", tiempo: "10 min", rinde: "3 tuppers", prep: "Saltear con ajo y oliva. Reduce mucho al cocinar, usar cantidad generosa." },
      { nom: "Zanahoria y choclo hervidos", cant: "4 zanahorias + 2 choclos", tiempo: "20 min", rinde: "4 porciones", prep: "Hervir juntos. Cortar choclos y guardar. Practicos y duran 4 dias." },
      { nom: "Pure de calabaza/zapallo", cant: "400g", tiempo: "25 min", rinde: "3-4 tuppers", prep: "Hervir y pisar. Sal y nuez moscada. Sin manteca." },
      { nom: "Tomate cherry + pepino", cant: "Libre", tiempo: "2 min", rinde: "2-3 dias", prep: "Cortar y guardar. Para sumar volumen sin cocinar. No cuenta como verdura cocida." },
      { nom: "Ensalada cruda", cant: "Libre", tiempo: "5 min", rinde: "Inmediato SIEMPRE", prep: "Lechuga, tomate, pepino, rucula. Oliva + limon. NO preparar en batch, se pudre." },
    ]
  },
  extras: {
    col: "⚡ EXTRAS POR TIPO DE ENTRENO", color: "#92400e", bg: "#fff7ed", border: "#fed7aa",
    tip: "No van al tupper principal. Son preparaciones separadas segun el dia.",
    items: [
      { nom: "Batido post-basquet / post-gym 🏀💪", cant: "1 preparacion", tiempo: "3 min", rinde: "Inmediato", prep: "300ml leche + 1 scoop proteina + 1 banana + 3 cdas avena + 1 cda man. mani + 5g creatina. Primeros 45 min post-esfuerzo." },
      { nom: "Pre-basquet liviano 🏀", cant: "Tupper chico", tiempo: "5 min", rinde: "Inmediato", prep: "1 lata atun + 2 fetas pan lactal. Sin grasa ni fibra alta. 2-3hs antes." },
      { nom: "Pre-gimnasio moderado 💪", cant: "Tupper chico", tiempo: "3 min", rinde: "Inmediato", prep: "200g yogur + 1 fruta + 20g nueces. 1-1.5hs antes." },
      { nom: "Snack recuperacion nocturna", cant: "Tupper chico", tiempo: "2 min", rinde: "Inmediato", prep: "200g yogur natural + 20g nueces. Caseina de lenta digestion. Antes de dormir en dias de entreno." },
    ]
  }
};

export const SHOPPING: ShoppingCategory[] = [
  { cat: "🍗 Proteinas", color: "#0f2744", bg: "#eff6ff", border: "#bfdbfe", items: [
    ["Pechuga o muslos de pollo", "1.5 kg"],
    ["Carne picada magra", "500 g"],
    ["Merluza o lenguado", "400 g"],
    ["Atun o caballa en lata (al agua)", "4 latas"],
    ["Huevos", "12 unidades"],
    ["Yogur natural entero", "700 g"],
    ["Leche", "1.5 L"],
    ["Queso magro / port salut light", "200 g"],
  ]},
  { cat: "🍚 Carbohidratos", color: "#1e3a5f", bg: "#f0fdf4", border: "#bbf7d0", items: [
    ["Arroz blanco", "1 kg"],
    ["Arroz integral", "500 g"],
    ["Fideos", "500 g"],
    ["Papa", "1 kg"],
    ["Batata", "500 g"],
    ["Avena arrollada", "500 g"],
    ["Pan lactal integral", "1 paquete"],
    ["Quinoa", "300 g"],
  ]},
  { cat: "🥦 Verduras", color: "#166534", bg: "#f9fafb", border: "#e5e7eb", items: [
    ["Zapallito", "4 unidades"],
    ["Berenjena", "2 unidades"],
    ["Morron (rojo o verde)", "3 unidades"],
    ["Brocoli", "1 cabeza"],
    ["Calabaza o zapallo", "500 g"],
    ["Zanahoria", "4 unidades"],
    ["Choclo", "2 unidades"],
    ["Espinaca o acelga", "1 atado"],
    ["Tomate", "4 unidades"],
    ["Lechuga / rucula", "1 bolsa"],
    ["Pepino", "2 unidades"],
  ]},
  { cat: "🥑 Grasas & Extras", color: "#78350f", bg: "#fff7ed", border: "#fed7aa", items: [
    ["Aceite de oliva extra virgen", "1 botella"],
    ["Palta", "3 unidades"],
    ["Nueces o almendras", "200 g"],
    ["Mantequilla de mani (sin azucar)", "1 frasco"],
    ["Miel", "1 frasco chico"],
    ["Limones", "4 unidades"],
    ["Pan rallado", "1 paquete chico"],
    ["Lentejas", "250 g"],
  ]},
  { cat: "🧴 Suplementos", color: "#374151", bg: "#f3f4f6", border: "#e5e7eb", items: [
    ["Proteina en polvo", "segun stock"],
    ["Creatina monohidratada", "segun stock"],
    ["Vitamina D3", "segun stock"],
    ["Vitamina C", "segun stock"],
    ["Centrum Hombre", "segun stock"],
  ]},
];

/** Auto-detect day type based on day of week */
export function getTodayDayType(): string {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ...
  if (day === 0) return "descanso";
  if ([1, 3, 5].includes(day)) return "basquet";
  return "gimnasio"; // 2, 4, 6
}

/** Get today's date key for localStorage */
export function getDateKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Get the effective macros for a meal considering selected option */
export function getMealMacros(comida: Comida, selectedOption?: number): Macros {
  if (comida.opciones && selectedOption !== undefined && selectedOption >= 0 && selectedOption < comida.opciones.length) {
    return comida.opciones[selectedOption].macros;
  }
  return comida.macros;
}
