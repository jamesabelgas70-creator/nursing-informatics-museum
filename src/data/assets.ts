export type ExhibitImage = {
  src: string;
  alt: string;
  caption: string;
};

export const uploadedAssets = {
  archivalNurses: "/assets/timeline/1950s/1.png",
  hospitalMainframe: "/assets/timeline/1950s/2.png",
  mainframeRoom: "/assets/timeline/1950s/3.png",
  controlConsole: "/assets/timeline/1950s/4.png",
  docxPixel: "/assets/docx/image1.gif",
  docxNurses: "/assets/docx/image3.jfif",
  docxHospitalSystems: "/assets/docx/image2.jfif",
  docxComputerConsole: "/assets/docx/image4.jpg",
  docxComputerRoom: "/assets/docx/image5.jpg",
  florenceNightingale: "/assets/pioneers/florence-nightingale.avif",
  harrietWerley: "/assets/pioneers/harriet-h-werley.jpg",
  kathleenMccormick: "/assets/pioneers/kathleen-a-mccormick.webp",
  ritaZielstorff: "/assets/pioneers/rita-d-zielstorff.jpg",
  virginiaSaba: "/assets/pioneers/virginia-k-saba.jpg"
} as const;

export const pioneerImageMap: Record<string, ExhibitImage> = {
  "florence-nightingale": {
    src: uploadedAssets.florenceNightingale,
    alt: "Portrait of Florence Nightingale",
    caption: "Florence Nightingale"
  },
  "harriet-werley": {
    src: uploadedAssets.harrietWerley,
    alt: "Portrait of Harriet H. Werley",
    caption: "Harriet H. Werley"
  },
  "kathleen-mccormick": {
    src: uploadedAssets.kathleenMccormick,
    alt: "Portrait of Kathleen A. McCormick",
    caption: "Kathleen A. McCormick"
  },
  "rita-zielstorff": {
    src: uploadedAssets.ritaZielstorff,
    alt: "Portrait of Rita D. Zielstorff",
    caption: "Rita D. Zielstorff"
  },
  "virginia-saba": {
    src: uploadedAssets.virginiaSaba,
    alt: "Portrait of Virginia K. Saba",
    caption: "Virginia K. Saba"
  }
};

export const decadeImageMap: Record<string, ExhibitImage[]> = {
  "1950s": [
    { src: "/assets/timeline/1950s/2.png", alt: "Early hospital computer room in the 1950s", caption: "1950s: Early hospital computer use" },
    { src: "/assets/timeline/1950s/1.png", alt: "Nurses in an archival hospital setting", caption: "1950s: Traditional nursing context" },
    { src: "/assets/timeline/1950s/4.png", alt: "Vintage electronic data processing console", caption: "1950s: Electronic data processing console" },
    { src: "/assets/timeline/1950s/3.png", alt: "Mainframe computer room", caption: "1950s: Mainframe computing environment" }
  ],
  "1960s": [
    { src: "/assets/timeline/1960s/1.png", alt: "Hospital information system terminal in the 1960s", caption: "1960s: First hospital information systems" },
    { src: "/assets/timeline/1960s/2.png", alt: "Early patient scheduling and lab systems", caption: "1960s: Computerized scheduling and lab services" },
    { src: "/assets/timeline/1960s/3.png", alt: "Healthcare data processing in the 1960s", caption: "1960s: Healthcare data processing expansion" }
  ],
  "1970s": [
    { src: "/assets/timeline/1970s/1.png", alt: "Nurse using an early computer terminal in the 1970s", caption: "1970s: Nurses and computers in clinical practice" },
    { src: "/assets/timeline/1970s/2.png", alt: "Early electronic nursing documentation system", caption: "1970s: Birth of electronic nursing documentation" },
    { src: "/assets/timeline/1970s/3.png", alt: "Computer-assisted nursing instruction in the 1970s", caption: "1970s: Computer-assisted nursing education" }
  ],
  "1980s": [
    { src: "/assets/timeline/1980s/1.png", alt: "Personal computer in a clinical nursing setting 1980s", caption: "1980s: Personal computers enter clinical practice" },
    { src: "/assets/timeline/1980s/2.png", alt: "Clinical decision support system interface 1980s", caption: "1980s: Clinical Decision Support Systems" },
    { src: "/assets/timeline/1980s/3.png", alt: "ANA recognition of nursing informatics specialty 1982", caption: "1982: ANA officially recognizes Nursing Informatics" }
  ],
  "1990s": [
    { src: "/assets/timeline/1990s/1.png", alt: "Electronic health record system in the 1990s", caption: "1990s: Rise of Electronic Health Records" },
    { src: "/assets/timeline/1990s/2.png", alt: "Telemedicine consultation in the 1990s", caption: "1990s: Telemedicine expands healthcare reach" },
    { src: "/assets/timeline/1990s/3.png", alt: "Barcode medication administration system", caption: "1990s: Barcode medication safety systems" },
    { src: "/assets/timeline/1990s/4.png", alt: "Internet-based healthcare communication 1990s", caption: "1990s: Internet transforms healthcare communication" },
    { src: "/assets/timeline/1990s/5.png", alt: "NANDA NIC NOC nursing classification systems", caption: "1990s: Standardized nursing classification systems" }
  ],
  "2000s": [
    { src: "/assets/timeline/2000s/1..png", alt: "Wireless healthcare technology in the 2000s", caption: "2000s: Wireless technology in hospitals" },
    { src: "/assets/timeline/2000s/2.png", alt: "Electronic prescribing system 2000s", caption: "2000s: E-prescribing improves medication safety" },
    { src: "/assets/timeline/2000s/3.png", alt: "Smart infusion pump technology 2000s", caption: "2000s: Smart infusion pumps and patient safety" },
    { src: "/assets/timeline/2000s/4.png", alt: "Patient portal interface 2000s", caption: "2000s: Patient portals empower healthcare consumers" }
  ],
  "2010s": [
    { src: "/assets/timeline/2010s/1.png", alt: "Mobile health application on smartphone 2010s", caption: "2010s: Mobile health apps transform patient care" },
    { src: "/assets/timeline/2010s/2.png", alt: "Cloud-based medical records system 2010s", caption: "2010s: Cloud medical records and big data" },
    { src: "/assets/timeline/2010s/3.png", alt: "AI and wearable health technology 2010s", caption: "2010s: AI and wearables usher in digital health era" }
  ]
};

export function getDecadeImages(decade: string) {
  return decadeImageMap[decade] ?? [];
}

export function getPioneerImage(id: string) {
  return pioneerImageMap[id];
}
