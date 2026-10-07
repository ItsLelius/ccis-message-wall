export type FacultyCategory =
  | "CCIS"
  | "BLIS"
  | "Personnel"

export type FacultyMember = {
  id: number
  name: string
  slug: string
  category: FacultyCategory
}

export const facultyMembers: FacultyMember[] = [
  // =========================================================
  // CCIS
  // =========================================================

  {
    id: 1,
    name: "Cesar A. Tecson, PhD.",
    slug: "cesar-tecson",
    category: "CCIS",
  },
  {
    id: 2,
    name: "Benjie A. Pabroa, MIT",
    slug: "benjie-pabroa",
    category: "CCIS",
  },
  {
    id: 3,
    name: "Sergio A. Tecson, MIT",
    slug: "sergio-tecson",
    category: "CCIS",
  },
  {
    id: 4,
    name: "Ciemavil A. Alcain, MIT",
    slug: "ciemavil-alcain",
    category: "CCIS",
  },
  {
    id: 5,
    name: "Daryl Ivan E. Hisola",
    slug: "daryl-ivan-hisola",
    category: "CCIS",
  },
  {
    id: 6,
    name: "John Rey Pial",
    slug: "john-rey-pial",
    category: "CCIS",
  },
  {
    id: 7,
    name: "Sanny Jhon S. Reñes",
    slug: "sanny-jhon-renes",
    category: "CCIS",
  },
  {
    id: 8,
    name: "Jed Eph P. Jalipa",
    slug: "jed-eph-jalipa",
    category: "CCIS",
  },
  {
    id: 9,
    name: "David Roy Northrup",
    slug: "david-roy-northrup",
    category: "CCIS",
  },
  {
    id: 10,
    name: "Rinilign B. Oplas",
    slug: "rinilign-oplas",
    category: "CCIS",
  },
  {
    id: 11,
    name: "Kristian Joy Arendain",
    slug: "kristian-joy-arendain",
    category: "CCIS",
  },
  {
    id: 12,
    name: "Juvy Amor Galindo",
    slug: "juvy-amor-galindo",
    category: "CCIS",
  },
  {
    id: 13,
    name: "Harold Cres Laingo",
    slug: "harold-cres-laingo",
    category: "CCIS",
  },
  {
    id: 14,
    name: "Kim Lloyd D. Castro",
    slug: "kim-lloyd-castro",
    category: "CCIS",
  },

  // =========================================================
  // BLIS
  // =========================================================

  {
    id: 15,
    name: "Maria Lorena M. Abangan, PhD.",
    slug: "maria-lorena-abangan",
    category: "BLIS",
  },
  {
    id: 16,
    name: "Jennifer M. Reyes, RL, MLIS",
    slug: "jennifer-reyes",
    category: "BLIS",
  },
  {
    id: 17,
    name: "Eva Carla F. Gadia, RL, MLIS",
    slug: "eva-carla-gadia",
    category: "BLIS",
  },
  {
    id: 18,
    name: "Richard M. Florentino, RL",
    slug: "richard-florentino",
    category: "BLIS",
  },
  {
    id: 19,
    name: "Queenie Mariz G. Gulle, RL",
    slug: "queenie-mariz-gulle",
    category: "BLIS",
  },
  {
    id: 20,
    name: "Kenji A. Sanchez, RL",
    slug: "kenji-sanchez",
    category: "BLIS",
  },
  {
    id: 21,
    name: "Jude Francis Udo",
    slug: "jude-francis-udo",
    category: "BLIS",
  },
  {
    id: 22,
    name: "Rea I. Pamat, MLIS",
    slug: "rea-pamat",
    category: "BLIS",
  },
  {
    id: 23,
    name: "Leticia A. Cansancio, DM",
    slug: "leticia-cansancio",
    category: "BLIS",
  },

  // =========================================================
  // PERSONNEL
  // =========================================================

  {
    id: 24,
    name: "Chamie D. Talara",
    slug: "chamie-talara",
    category: "Personnel",
  },
  {
    id: 25,
    name: "John Bryan L. Maturan",
    slug: "john-bryan-maturan",
    category: "Personnel",
  },
  {
    id: 26,
    name: "Romeo R. Mendez Jr.",
    slug: "romeo-mendez-jr",
    category: "Personnel",
  },

]