const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const Search = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const Heart = (p) => (
  <svg {...base} {...p}>
    <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z" />
  </svg>
)

export const Bag = (p) => (
  <svg {...base} {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export const Arrow = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ChevLeft = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const ChevRight = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const Chat = (p) => (
  <svg {...base} {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export const Doc = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h6M12 12v6" />
  </svg>
)

export const Flask = (p) => (
  <svg {...base} {...p}>
    <path d="M9 2v6l-5 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V2" />
    <path d="M8 2h8M6.5 14h11" />
  </svg>
)

export const Syringe = (p) => (
  <svg {...base} {...p}>
    <path d="m18 2 4 4M17 3l4 4-9.5 9.5-5 1 1-5z" />
    <path d="M3 21h8" />
  </svg>
)

export const Stethoscope = (p) => (
  <svg {...base} {...p}>
    <path d="M4 3v6a5 5 0 0 0 10 0V3" />
    <path d="M4 3H2m12 0h2M9 14v2a5 5 0 0 0 10 0v-2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
)

export const Truck = (p) => (
  <svg {...base} {...p}>
    <path d="M1 4h13v12H1zM14 8h4l3 4v4h-7" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="17.5" cy="18.5" r="2" />
  </svg>
)

export const Pin = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Menu = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const Close = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const Check = (p) => (
  <svg {...base} strokeWidth="2.4" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const Star = (p) => (
  <svg {...base} {...p}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
)

export const Trash = (p) => (
  <svg {...base} {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
)

export const Filter = (p) => (
  <svg {...base} {...p}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </svg>
)

export const Grid = (p) => (
  <svg {...base} {...p}>
    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
  </svg>
)

export const Lock = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const Home = (p) => (
  <svg {...base} {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
)

export const Box = (p) => (
  <svg {...base} {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </svg>
)

export const Cart = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L22 7H6" />
  </svg>
)

export const Users = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0M16 5.2a3.2 3.2 0 0 1 0 6.1M21 20a6 6 0 0 0-4-5.7" />
  </svg>
)

export const Cog = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
)

export const Chart = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-4M12 16V8M16 16v-6" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Logout = (p) => (
  <svg {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export const iconMap = {
  chat: Chat,
  doc: Doc,
  flask: Flask,
  syringe: Syringe,
  stethoscope: Stethoscope,
  truck: Truck,
}
