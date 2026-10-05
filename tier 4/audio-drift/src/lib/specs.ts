// Single source of truth for every number on the site. Drift One is fictional;
// the figures are plausible for the category and internally consistent.

export const PRICE = 329;

export type ColorwayId = "slate" | "glacier" | "rosewood" | "graphite";

export const COLORWAYS: {
  id: ColorwayId;
  name: string;
  swatch: string;
  tint: string;
  finish: string;
}[] = [
  { id: "slate", name: "Slate", swatch: "#6b7686", tint: "#d9dee5", finish: "Bead-blasted anodised aluminium, charcoal leather" },
  { id: "glacier", name: "Glacier", swatch: "#afcbdd", tint: "#dde9f1", finish: "Ice-blue composite, cloud-grey leather" },
  { id: "rosewood", name: "Rosewood", swatch: "#8b5a4a", tint: "#ecdcd4", finish: "Copper-anodised yokes, oxblood leather" },
  { id: "graphite", name: "Graphite", swatch: "#23262b", tint: "#c9cdd3", finish: "Matte-black PVD steel, black leather" },
];

export const SPEC_GROUPS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Acoustics",
    rows: [
      ["Driver", "40 mm dynamic, carbon-reinforced LCP diaphragm"],
      ["Magnet", "N52 neodymium, dual-ring"],
      ["Voice coil", "Copper-clad aluminium wire (CCAW)"],
      ["Frequency response", "4 Hz – 40 kHz (wired) · 20 Hz – 20 kHz (BT)"],
      ["Impedance", "32 Ω"],
      ["Sensitivity", "102 dB SPL/mW @ 1 kHz"],
      ["THD", "< 0.08 % @ 94 dB SPL, 1 kHz"],
    ],
  },
  {
    title: "Noise control",
    rows: [
      ["ANC", "Hybrid feedforward + feedback, adaptive"],
      ["Microphones", "8 total — 6 ANC, 2 beamforming voice"],
      ["Peak attenuation", "42 dB @ 200 Hz"],
      ["Filter re-tune", "Every 20 ms"],
      ["Modes", "ANC · Transparency · Off"],
    ],
  },
  {
    title: "Wireless",
    rows: [
      ["Bluetooth", "5.4 with LE Audio"],
      ["Codecs", "LDAC · LC3 · AAC · SBC"],
      ["Latency", "38 ms (Game mode, LC3)"],
      ["Multipoint", "2 devices simultaneously"],
      ["Wired", "USB-C digital 24-bit/96 kHz · 3.5 mm analog"],
    ],
  },
  {
    title: "Power",
    rows: [
      ["Battery", "920 mAh Li-ion"],
      ["Playback", "40 h ANC on · 55 h ANC off"],
      ["Fast charge", "5 min → 4 h playback"],
      ["Full charge", "2.5 h, USB-C PD"],
      ["Cycle rating", "80 % capacity after 500 cycles"],
    ],
  },
  {
    title: "Build",
    rows: [
      ["Weight", "254 g"],
      ["Headband", "Stainless spring-steel core, memory-foam pad"],
      ["Yokes", "Anodised 6000-series aluminium"],
      ["Earcups", "Glass-fibre reinforced PA12, 90° swivel"],
      ["Cushions", "Protein leather over slow-recovery foam, magnetic"],
      ["Clamping force", "4.2 N"],
    ],
  },
];

export const COMPARISON: { label: string; drift: string; typical: string; driftBar: number; typicalBar: number }[] = [
  { label: "Peak ANC attenuation", drift: "42 dB", typical: "30 dB", driftBar: 1, typicalBar: 0.71 },
  { label: "Battery, ANC on", drift: "40 h", typical: "28 h", driftBar: 1, typicalBar: 0.7 },
  { label: "Wireless latency", drift: "38 ms", typical: "150 ms", driftBar: 0.25, typicalBar: 1 },
  { label: "Weight", drift: "254 g", typical: "300 g", driftBar: 0.85, typicalBar: 1 },
  { label: "Codecs", drift: "4", typical: "2", driftBar: 1, typicalBar: 0.5 },
  { label: "Fast charge", drift: "5 min → 4 h", typical: "10 min → 3 h", driftBar: 1, typicalBar: 0.38 },
];

export const IN_THE_BOX = [
  { item: "Drift One", note: "In your chosen colorway" },
  { item: "Folding hard case", note: "Recycled PET shell, felt-lined" },
  { item: "USB-C to USB-C cable", note: "1 m, braided, 60 W" },
  { item: "3.5 mm audio cable", note: "1.2 m, oxygen-free copper" },
  { item: "Quick-start card", note: "Printed on recycled stock" },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Does it work with both iPhone and Android?",
    a: "Yes. iPhone gets AAC, most Android phones get LDAC or LC3. Pairing is standard Bluetooth 5.4. You don't need an app, though the Drift app adds EQ and firmware updates.",
  },
  {
    q: "Can I use it wired, and does ANC still work?",
    a: "Both ports work. USB-C carries 24-bit/96 kHz digital audio and charges at the same time. The 3.5 mm input is analog, so it plays even with a flat battery. ANC works on either connection while there's charge.",
  },
  {
    q: "Is the ear pressure from ANC noticeable?",
    a: "The feedback loop watches the seal and backs off the low-frequency gain once the pressure difference passes a set threshold. Most people describe it as quiet, not blocked. Transparency mode is a single press if you want the room back.",
  },
  {
    q: "Are the cushions replaceable?",
    a: "Yes. They're magnetic, so you can swap them without tools. Replacement pairs are $39 in every colorway.",
  },
  {
    q: "How will the battery hold up?",
    a: "The cell is rated to keep 80 % of its capacity after 500 full cycles, which is roughly three years of daily use. A paid battery service is available after the warranty ends.",
  },
  {
    q: "What's the warranty and return window?",
    a: "Two years of warranty and 30 days of free returns, from the day it arrives.",
  },
];
