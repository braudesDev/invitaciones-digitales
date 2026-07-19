// src/app/models/padrino.model.ts

export interface PadrinoAsignado {
  nombre: string;
  rol: string;
  observaciones?: string; // Solo observaciones, sin teléfono ni email
}

export type TipoRolPadrino =
  | 'velacion'
  | 'arras'
  | 'anillos'
  | 'lazo'
  | 'biblia'
  | 'testigo'
  | 'vela'
  | 'copas'
  | 'anillo'
  | 'zapatos'
  | 'pulsera'
  | 'misa'
  | 'bautizo'
  | 'vestido'
  | 'comunion'
  | 'personalizado';

export interface RolPadrinoInfo {
  nombre: string;
  icon: string;
  descripcion: string;
  sugeridoPara: ('boda' | 'xv' | 'bautizo' | 'comunion' | 'cumpleaños')[];
  tipo: 'individual' | 'pareja';
}

export const ROLES_PADrinos: Record<TipoRolPadrino, RolPadrinoInfo> = {
  velacion: {
    nombre: 'Padrino de Velación',
    icon: '💒',
    descripcion:
      'Acompañan a la pareja durante toda la ceremonia, simbolizando su apoyo y guía espiritual en este nuevo camino.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  arras: {
    nombre: 'Padrino de Arras',
    icon: '🪙',
    descripcion:
      'Entregan las 13 monedas durante la ceremonia, representando la prosperidad y el compromiso económico de la pareja.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  anillos: {
    nombre: 'Padrino de Anillos',
    icon: '💍',
    descripcion:
      'Portan y entregan los anillos de boda, símbolo del amor eterno y la unión inquebrantable.',
    sugeridoPara: ['boda'],
    tipo: 'individual',
  },
  lazo: {
    nombre: 'Padrino de Lazo',
    icon: '🎀',
    descripcion:
      'Colocan el lazo alrededor de los novios durante la ceremonia, representando la unión indisoluble.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  biblia: {
    nombre: 'Padrino de Biblia',
    icon: '📖',
    descripcion:
      'Portan la biblia durante la ceremonia, simbolizando la fe y los valores que guiarán a la pareja.',
    sugeridoPara: ['boda', 'comunion'],
    tipo: 'individual',
  },
  testigo: {
    nombre: 'Testigo de Boda',
    icon: '✍️',
    descripcion:
      'Firman el acta de matrimonio como testigos oficiales de la unión.',
    sugeridoPara: ['boda'],
    tipo: 'individual',
  },
  vela: {
    nombre: 'Padrino de Vela',
    icon: '🕯️',
    descripcion:
      'Portan una vela durante el ritual de XV años, iluminando el camino de la quinceañera.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  copas: {
    nombre: 'Padrino de Copas',
    icon: '🥂',
    descripcion:
      'Entregan las copas en el brindis, simbolizando la alegría y celebración de la vida.',
    sugeridoPara: ['xv'],
    tipo: 'pareja',
  },
  anillo: {
    nombre: 'Padrino de Anillo',
    icon: '💍',
    descripcion:
      'Portan el anillo que la quinceañera usará como símbolo de su paso a la vida adulta.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  zapatos: {
    nombre: 'Padrino de Zapatos',
    icon: '👠',
    descripcion:
      'Entregan los zapatos a la quinceañera para que pueda bailar su vals con elegancia.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  pulsera: {
    nombre: 'Padrino de Pulsera',
    icon: '📿',
    descripcion:
      'Colocan la pulsera a la quinceañera como símbolo de protección y buena fortuna.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  misa: {
    nombre: 'Padrino de Misa',
    icon: '⛪',
    descripcion:
      'Acompañan a la quinceañera en la misa de acción de gracias por su vida.',
    sugeridoPara: ['xv'],
    tipo: 'pareja',
  },
  bautizo: {
    nombre: 'Padrino de Bautizo',
    icon: '🫧',
    descripcion:
      'Acompañan al niño en el sacramento del bautizo, comprometiéndose a guiarlo en la fe.',
    sugeridoPara: ['bautizo'],
    tipo: 'pareja',
  },
  vestido: {
    nombre: 'Padrino de Vestido',
    icon: '👗',
    descripcion:
      'Regalan el vestido del bautizo, símbolo de pureza y nuevo comienzo en la vida cristiana.',
    sugeridoPara: ['bautizo'],
    tipo: 'individual',
  },
  comunion: {
    nombre: 'Padrino de Comunión',
    icon: '✝️',
    descripcion:
      'Acompañan al niño en su primera comunión, apoyándolo en este paso importante de su fe.',
    sugeridoPara: ['comunion'],
    tipo: 'individual',
  },
  personalizado: {
    nombre: 'Rol Personalizado',
    icon: '⭐',
    descripcion:
      'Define tu propio rol y significado para este padrino especial.',
    sugeridoPara: ['boda', 'xv', 'bautizo', 'comunion', 'cumpleaños'],
    tipo: 'individual',
  },
};

export function getRolesPorEvento(tipoEvento: string): TipoRolPadrino[] {
  const roles: TipoRolPadrino[] = [];
  for (const [key, value] of Object.entries(ROLES_PADrinos)) {
    if (value.sugeridoPara.includes(tipoEvento as any)) {
      roles.push(key as TipoRolPadrino);
    }
  }
  return roles;
}
