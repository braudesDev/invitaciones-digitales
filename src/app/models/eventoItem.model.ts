export interface EventoItem {
  slug: string;
  name: string;
  tipo?: 'boda' | 'xv' | string;
  anfitrionId?: string;
  colaboradores?: string[];
  rol?: 'anfitrion' | 'colaborador';
  // Agrega aquí cualquier otra propiedad que tengan tus documentos de invitaciones en Firestore
}
