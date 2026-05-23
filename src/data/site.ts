import { getDecadeImages, getPioneerImage, type ExhibitImage } from "./assets";

export type Pioneer = {
  id: string;
  name: string;
  title: string;
  years: string;
  summary: string;
  details: string[];
  effects: string[];
  accent: "cyan" | "mint" | "gold" | "candle";
  image?: ExhibitImage;
};

export type Decade = {
  decade: string;
  title: string;
  narrative: string;
  highlights: string[];
  developments: string[];
  majorEvent?: string;
  contributions?: string[];
  effects: string[];
  images: ExhibitImage[];
};

export const pioneers: Pioneer[] = [
  {
    id: "florence-nightingale",
    name: "Florence Nightingale",
    title: "Earliest Data-Driven Nursing Influence",
    years: "1820-1910",
    summary:
      "Used statistics and organized health data during the Crimean War, turning observation into evidence for safer care.",
    details: [
      "Used statistics and organized health data during the Crimean War.",
      "Represents the earliest influence of nursing informatics.",
      "Known as the Lady with the Lamp."
    ],
    effects: ["Candle glow", "Paper charts", "Statistics transformation"],
    accent: "candle",
    image: getPioneerImage("florence-nightingale")
  },
  {
    id: "harriet-werley",
    name: "Harriet H. Werley",
    title: "Standardized Nursing Data Pioneer",
    years: "1914-2002",
    summary:
      "Advanced nursing research, nursing databases, and standardized nursing data through the Nursing Minimum Data Set.",
    details: [
      "Pioneer in nursing research and standardized nursing data.",
      "Helped develop nursing information systems and nursing databases.",
      "Co-developer of the Nursing Minimum Data Set."
    ],
    effects: ["Floating data streams", "Database grids", "Information nodes"],
    accent: "cyan",
    image: getPioneerImage("harriet-werley")
  },
  {
    id: "kathleen-mccormick",
    name: "Kathleen A. McCormick",
    title: "Education and Health Technology Leader",
    years: "Modern Pioneer",
    summary:
      "Helped advance nursing informatics education and computer applications in nursing practice.",
    details: [
      "Leader in nursing informatics education and healthcare technology.",
      "Helped advance computer applications in nursing practice.",
      "Expanded the bridge between clinical care and informatics learning."
    ],
    effects: ["Holographic educational systems", "Healthcare dashboard", "UI overlays"],
    accent: "mint",
    image: getPioneerImage("kathleen-mccormick")
  },
  {
    id: "rita-zielstorff",
    name: "Rita D. Zielstorff",
    title: "Clinical Information Systems Advocate",
    years: "Modern Pioneer",
    summary:
      "Promoted computer-based nursing documentation, clinical information systems, and patient care technologies.",
    details: [
      "Helped develop clinical information systems.",
      "Promoted computer-based nursing documentation.",
      "Advanced patient care systems for clinical practice."
    ],
    effects: ["EHR visualizations", "Digital patient charts", "Clinical interfaces"],
    accent: "cyan",
    image: getPioneerImage("rita-zielstorff")
  },
  {
    id: "virginia-saba",
    name: "Virginia K. Saba",
    title: "Specialty Recognition and CCC System Pioneer",
    years: "Modern Pioneer",
    summary:
      "Helped establish Nursing Informatics as an official specialty and developed the Clinical Care Classification System.",
    details: [
      "Strong pioneer of Nursing Informatics.",
      "Helped establish Nursing Informatics as an official specialty under ANA.",
      "Known for the Clinical Care Classification System."
    ],
    effects: ["Gold recognition glow", "ANA recognition scene", "CCC network"],
    accent: "gold",
    image: getPioneerImage("virginia-saba")
  }
];

export const decades: Decade[] = [
  {
    decade: "1950s",
    title: "Early Computer Use in Healthcare",
    narrative:
      "Healthcare institutions began experimenting with computers to improve hospital administration and data management. Computers helped automate billing and record keeping.",
    highlights: [
      "Hospitals used computers for administrative tasks",
      "Automation of financial and record-keeping systems began"
    ],
    developments: [
      "Mainframe computers",
      "Electronic data processing systems",
      "Early hospital billing systems"
    ],
    effects: ["Vintage black-and-white hospital", "Film grain", "Rotating mainframe computer"],
    images: getDecadeImages("1950s")
  },
  {
    decade: "1960s",
    title: "Introduction of Hospital Information Systems",
    narrative:
      "Hospitals adopted computerized systems to organize patient information and improve efficiency beyond finance, including scheduling and laboratory services.",
    highlights: [
      "Growth of computerized hospital systems",
      "Increased efficiency in healthcare operations"
    ],
    developments: [
      "Hospital Information Systems",
      "Patient scheduling systems",
      "Laboratory information systems"
    ],
    effects: ["Holographic dashboards", "Data processing animations", "Healthcare interfaces"],
    images: getDecadeImages("1960s")
  },
  {
    decade: "1970s",
    title: "Birth of Nursing Informatics",
    narrative:
      "Nurses recognized the importance of computers in improving patient care and nursing documentation. Nursing education also started incorporating computer-related learning.",
    highlights: [
      "Emergence of Nursing Informatics",
      "Growth of computer-assisted nursing practice"
    ],
    developments: [
      "Electronic nursing documentation",
      "Nursing databases",
      "Computer-assisted instruction"
    ],
    contributions: [
      "Harriet Werley promoted standardized nursing data",
      "Virginia Saba advanced electronic nursing documentation"
    ],
    effects: ["CRT monitor glow", "Typing effects", "Nurse-computer interaction"],
    images: getDecadeImages("1970s")
  },
  {
    decade: "1980s",
    title: "Recognition of Nursing Informatics",
    narrative:
      "Nursing Informatics became officially recognized as a nursing specialty. Personal computers became more accessible in clinical practice.",
    highlights: ["Official recognition", "Increased computer use in nursing care"],
    developments: [
      "Personal computers",
      "Clinical Decision Support Systems",
      "Computerized nursing care plans"
    ],
    majorEvent: "1982 ANA recognition",
    effects: ["Retro PC visuals", "VHS transition", "Gold achievement animation"],
    images: getDecadeImages("1980s")
  },
  {
    decade: "1990s",
    title: "Expansion of Electronic Health Records",
    narrative:
      "Healthcare shifted from paper records to digital systems as the internet expanded healthcare communication.",
    highlights: ["Electronic documentation", "Internet healthcare communication"],
    developments: ["EHR systems", "Telemedicine", "Barcode medication systems"],
    contributions: ["NANDA", "NIC", "NOC"],
    effects: ["Paper chart transforms into EHR", "Internet data streams", "Digital healthcare interfaces"],
    images: getDecadeImages("1990s")
  },
  {
    decade: "2000s",
    title: "Modernization of Healthcare Technology",
    narrative:
      "Technology became essential in daily nursing practice, supporting evidence-based care, patient safety, and efficient care delivery.",
    highlights: ["Evidence-based care", "Patient safety"],
    developments: [
      "Wireless healthcare",
      "E-prescribing",
      "Smart infusion pumps",
      "Patient portals"
    ],
    effects: ["Wireless signal animations", "Floating dashboards", "Smart medical systems"],
    images: getDecadeImages("2000s")
  },
  {
    decade: "2010s",
    title: "Digital and Mobile Health Era",
    narrative:
      "Mobile and cloud-based healthcare technologies improved accessibility and communication across patients, nurses, and care teams.",
    highlights: ["Telehealth expansion", "Mobile healthcare technology"],
    developments: [
      "Mobile health apps",
      "Cloud medical records",
      "Wearables",
      "Big data",
      "AI applications"
    ],
    effects: ["Floating smartphones", "AI brain visualization", "Cloud sync", "Big data networks"],
    images: getDecadeImages("2010s")
  }
];

export const futureSignals = [
  "AI-assisted healthcare",
  "Smart hospitals",
  "Robotics",
  "VR healthcare training",
  "Predictive healthcare",
  "Digital twins"
];

export const students = [
  "Acala, Christian Jay S.",
  "Alameda, John Carl C.",
  "Bailado, Ashley Jade V.",
  "Berso, Marielle P.",
  "Budta, Alex Jr. G.",
  "Buhisan, Abegail B.",
  "Calipusan, Julienne A.",
  "Caraoa, Ryza Lois B.",
  "Creticio, Kayla L.",
  "Dismas, Kenjo Joacquine",
  "Fajardo, Queen May B.",
  "Forones, Keyshe Louivenze Khate P.",
  "Garcia, Alliah Gabrylle F.",
  "Gasulla, Vince U.",
  "Grande, Khlie Rose Ann S.",
  "Ignacio, Angeline B.",
  "Inodioan, Gella Joy",
  "Lerasan, Jeian Grace P.",
  "Llanita, Jeush Amiel P.",
  "Lumaghan, Princess May P.",
  "Mamilic, Borris R.",
  "Martin, Marwin June L.",
  "Masangay, Teriza C.",
  "Mesiona, Nica Mae M.",
  "Montero, Princess Rhazel M.",
  "Morales, Noah Charles C.",
  "Paganduman, Alex Murvy",
  "Paton-og, Neckisha M.",
  "Plaza, Denise Nicole T.",
  "Punay, Rheena B.",
  "Sabandon, Yza Shemiah T.",
  "Sanchez, Mark Vincent S.",
  "Saucejo, Avril Antonia R.",
  "Sumambot, Fredgie Lloyd M.",
  "Tolentino, Alyza May B.",
  "Tumaob, Alexie Marie T.",
  "Tumolac, Angel Lie S."
];
