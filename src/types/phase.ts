export type PhaseNameType =
  | 'CatchUpRecoverBlockHeaderFromDbPhase'
  | 'CatchUpSyncBlockHeaderPhase'
  | 'CatchUpCheckpointPhase'
  | 'CatchUpFillBlockBodyPhase'
  | 'CatchUpSyncBlockPhase'
  | 'NormalSyncPhase'
