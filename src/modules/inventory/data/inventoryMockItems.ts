type EquipmentInventoryItem = {
  id: string;
  category: "equipo";
  toolName: string;
  identifier: string;
};

type UniqueProductInventoryItem = {
  id: string;
  category: "producto_unico";
  modelName: string;
  mac: string;
  code: string;
  status: "En stock" | "Asignado" | "Averiado" | "Retirado";
  responsible: string;
};

type ConsumableInventoryItem = {
  id: string;
  category: "consumible";
  name: string;
  identifier: string;
  stock: number;
  assignedStock: number;
  availableStock: number;
};

type InventoryMockItem =
  | EquipmentInventoryItem
  | UniqueProductInventoryItem
  | ConsumableInventoryItem;

const toolNames = [
  "Taladro SDS Plus",
  "Taladro Percutor",
  "Crimpadora RJ45",
  "Fusionadora de Fibra",
  "Medidor OTDR",
  "Cortadora de Fibra",
  "Pinza Amperimetrica",
  "Multimetro Digital",
  "Pelacables Profesional",
  "Ponchadora",
  "Destornillador Electrico",
  "Rotomartillo",
  "Escalera Telescopica",
  "Probador de Red",
  "Etiquetadora Industrial",
  "Generador de Tonos",
  "Linterna Tecnica",
  "Maletin de Herramientas",
  "Taladro Angular",
  "Amoladora Compacta",
  "Llave de Impacto",
  "Compresor Portatil",
  "Cinta Pasacables",
  "Probador PoE",
  "Camara de Inspeccion",
  "Analizador WiFi",
  "Pinza de Corte",
  "Pistola de Silicona",
  "Nivel Laser",
  "Soldador Electrico",
  "Remachadora Manual",
  "Tester de Continuidad",
  "Aspiradora Portatil",
  "Impresora de Etiquetas",
] as const;

const productModelNames = [
  "HGU WiFi 5",
  "HGU WiFi 6",
  "ONT XGS-PON",
  "Router Mesh AX3000",
  "Decodificador UHD",
  "Switch 8 Puertos",
  "Punto de Acceso AC",
  "Roseta Inteligente",
  "Bridge Inalambrico",
  "Nodo Mesh Interior",
  "Gateway IoT",
] as const;

const productStatuses = [
  "En stock",
  "Asignado",
  "Averiado",
  "Retirado",
] as const;

const responsibles = [
  "Almacen Central",
  "Juan Perez",
  "Lucia Martin",
  "Carlos Diaz",
  "Equipo Norte",
  "Equipo Sur",
] as const;

const consumableNames = [
  "Roseta Fibra Invisible",
  "Kit Fibra Invisible 40M",
  "Antena AFR 4G",
  "Cable Drop 50M",
  "Conector SC/APC",
  "Latiguillo Fibra 2M",
  "Caja Terminal Optica",
  "Grapa Redonda 8mm",
  "Brida Nylon 200mm",
  "Canaleta Blanca 20x12",
  "Cinta Aislante Negra",
  "Taco Universal 6mm",
  "Tornillo Rosca Chapa",
  "Splitter 1:8",
  "Adaptador SC/APC",
  "Mini PTO Interior",
] as const;

const equipmentItems = Array.from({ length: 34 }, (_, index) => ({
  id: `EQ-${String(index + 1).padStart(3, "0")}`,
  category: "equipo" as const,
  toolName: toolNames[index % toolNames.length],
  identifier: `HER-${202600 + index}`,
}));

const uniqueProductItems = Array.from({ length: 33 }, (_, index) => ({
  id: `PU-${String(index + 1).padStart(3, "0")}`,
  category: "producto_unico" as const,
  modelName: productModelNames[index % productModelNames.length],
  mac: `AC:DE:48:${String(index + 11).padStart(2, "0")}:${String(index + 21).padStart(2, "0")}:${String(index + 31).padStart(2, "0")}`,
  code: `0040070430862537442562${String(index + 1).padStart(10, "0")}`,
  status: productStatuses[index % productStatuses.length],
  responsible: responsibles[index % responsibles.length],
}));

const consumableItems = Array.from({ length: 11 }, (_, index) => ({
  id: `CO-${String(index + 1).padStart(3, "0")}`,
  category: "consumible" as const,
  name: consumableNames[index % consumableNames.length],
  identifier: `CON-${3100 + index}`,
  stock: 8 + (index % 18),
  assignedStock: 1 + (index % 7),
  availableStock: 8 + (index % 18) - (1 + (index % 7)),
}));

export const inventoryMockItems: InventoryMockItem[] = [
  ...equipmentItems,
  ...uniqueProductItems,
  ...consumableItems,
];

export type {
  ConsumableInventoryItem,
  EquipmentInventoryItem,
  InventoryMockItem,
  UniqueProductInventoryItem,
};
