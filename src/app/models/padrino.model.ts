// src/app/models/padrino.model.ts

export interface PadrinoAsignado {
  nombre: string;
  rol: string;
  // observaciones?: string;
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
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784653829/image-MFZivdlX880yHITKHWBXYkIpUROYvb_e4wpbh.png',
    descripcion:
      'Representan el apoyo y la bendición espiritual de los novios.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  arras: {
    nombre: 'Padrino de Arras',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784653709/image-367r2STELMzjNowNJZFAFwrdeVWaI1_a5dhmg.png',
    descripcion: 'Representan la prosperidad y el compromiso de la pareja.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  anillos: {
    nombre: 'Padrino de Anillos',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784682574/image-vcJLC5bmytdiyJ9kYwdL1M430epiFc_yscgra.png',
    descripcion:
      'Portan y entregan los anillos de boda, símbolo del amor eterno y la unión inquebrantable.',
    sugeridoPara: ['boda'],
    tipo: 'individual',
  },
  lazo: {
    nombre: 'Padrino de Lazo',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654295/image-2LGSUHqlra3bndszj3hWB6J9xlsVU6_eft1ez.png',
    descripcion:
      'Colocan el lazo alrededor de los novios durante la ceremonia, representando la unión indisoluble.',
    sugeridoPara: ['boda'],
    tipo: 'pareja',
  },
  biblia: {
    nombre: 'Padrino de Biblia',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654344/image-qkPaiXIyeUdKAPiPgXu1KR3MGRsmb1_dfvhvd.png',
    descripcion:
      'Portan la biblia durante la ceremonia, simbolizando la fe y los valores que guiarán a la pareja.',
    sugeridoPara: ['boda', 'comunion'],
    tipo: 'individual',
  },
  testigo: {
    nombre: 'Testigo de Boda',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654577/image-dae1lHATNY8hkh3GxeAnScrtd34Ii5_e5tgea.png',
    descripcion:
      'Firman el acta de matrimonio como testigos oficiales de la unión.',
    sugeridoPara: ['boda'],
    tipo: 'individual',
  },
  vela: {
    nombre: 'Padrino de Vela',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654703/image-vENIYcW9dddBsdd8GIl2eMzf6u9CYr_fzkaxp.png',
    descripcion:
      'Portan una vela durante el ritual de XV años, iluminando el camino de la quinceañera.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  copas: {
    nombre: 'Padrino de Copas',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654855/image-Wq0idg04XjpfyctnWBD3U0ChLODvmO_gkiukf.png',
    descripcion:
      'Entregan las copas en el brindis, simbolizando la alegría y celebración de la vida.',
    sugeridoPara: ['xv'],
    tipo: 'pareja',
  },
  anillo: {
    nombre: 'Padrino de Anillo',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654172/image-W68FVT8R1haHu0Vqbhq95CyitIQkWx_t7giko.png',
    descripcion:
      'Portan el anillo que la quinceañera usará como símbolo de su paso a la vida adulta.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  zapatos: {
    nombre: 'Padrino de Zapatos',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784654963/image-BJiV51Net40IYXkXUYMVVvV1qrol78_npz8sa.png',
    descripcion:
      'Entregan los zapatos a la quinceañera para que pueda bailar su vals con elegancia.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  pulsera: {
    nombre: 'Padrino de Pulsera',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655036/image-A1NDqn6z8DAp1XoQ0t5aTxR9lNZbpF_qd9km9.png',
    descripcion:
      'Colocan la pulsera a la quinceañera como símbolo de protección y buena fortuna.',
    sugeridoPara: ['xv'],
    tipo: 'individual',
  },
  misa: {
    nombre: 'Padrino de Misa',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655103/image-8J371flGy7HB7q2MNCiUQARQUA2UOU_mvghgd.png',
    descripcion:
      'Acompañan a la quinceañera en la misa de acción de gracias por su vida.',
    sugeridoPara: ['xv'],
    tipo: 'pareja',
  },
  bautizo: {
    nombre: 'Padrino de Bautizo',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655188/image-FtXFQpTRHwc2gu4MPf51VcQrAEizy7_nr00e2.png',
    descripcion:
      'Acompañan al niño en el sacramento del bautizo, comprometiéndose a guiarlo en la fe.',
    sugeridoPara: ['bautizo'],
    tipo: 'pareja',
  },
  vestido: {
    nombre: 'Padrino de Vestido',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655262/image-YQn5FpNL17Scjgl6MSCTuXJU5IZX3V_vy9m6n.png',
    descripcion:
      'Regalan el vestido del bautizo, símbolo de pureza y nuevo comienzo en la vida cristiana.',
    sugeridoPara: ['bautizo'],
    tipo: 'individual',
  },
  comunion: {
    nombre: 'Padrino de Comunión',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655103/image-8J371flGy7HB7q2MNCiUQARQUA2UOU_mvghgd.png',
    descripcion:
      'Acompañan al niño en su primera comunión, apoyándolo en este paso importante de su fe.',
    sugeridoPara: ['comunion'],
    tipo: 'individual',
  },
  personalizado: {
    nombre: 'Rol Personalizado',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784655493/image-K6ajnEunSyn0dpLf3ZXfW4cvI1dCO3_ums5ts.png',
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
