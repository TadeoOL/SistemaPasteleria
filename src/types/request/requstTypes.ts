export enum RequestStatus {
  Cancelada = 0,
  Creada = 1,
  Completada = 2
}

export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Creada]: 'Creada',
  [RequestStatus.Completada]: 'Completada',
  [RequestStatus.Cancelada]: 'Cancelada'
};


