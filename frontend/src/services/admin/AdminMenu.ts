// AdminMenu.ts
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const adminMenu: MenuItem[] = [
  {
    key: "/admin",
    label: "Dashboard",
  },
  {
    key: "/admin/konular",
    label: "Konular",
  },
  {
    key: "/admin/gramerkurallar",
    label: "Gramer",
  },
  {
    key: "/admin/ornekler",
    label: "Örnekler",
  },
  {
    key: "/admin/kelimeTema",
    label: "Kelime Temaları",
  },
  {
    key: "/admin/kelimeler",
    label: "Kelimeler",
  },
  {
    key: "/admin/metinTema",
    label: "Metin Temaları",
  },
  {
    key: "/admin/metinler",
    label: "Metinler",
  },
  {
    key: "/admin/tema",
    label: "Temalar",
  },
];