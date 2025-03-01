import type { Object3D } from 'three'
import type { WorkerCollideEvent, WorkerRayhitEvent } from './Provider'
import type { AtomicProps, BodyProps, BodyShapeType } from './hooks'
import React, { createContext } from 'react'
import { isJSDocNullableType } from 'typescript'

export type Buffers = { positions: Float32Array; quaternions: Float32Array }
export type Refs = { [uuid: string]: Object3D }
export type Event =
  | (Omit<WorkerRayhitEvent['data'], 'body'> & { body: Object3D | null })
  | (Omit<WorkerCollideEvent['data'], 'body' | 'target'> & { body: Object3D; target: Object3D })
export type Events = { [uuid: string]: (e: Event) => void }
export type Subscriptions = {
  [id: string]: (value: AtomicProps[keyof AtomicProps] | number[]) => void
}

export type ProviderContext = {
  worker: Worker
  bodies: React.MutableRefObject<{ [uuid: string]: number }>
  buffers: Buffers
  refs: Refs
  events: Events
  subscriptions: Subscriptions
}

export type DebugApi = {
  add(id: string, props: BodyProps, type: BodyShapeType): void;
  remove(id: string): void;
}

export const context = createContext<ProviderContext>({} as ProviderContext)
export const debugContext = createContext<DebugApi>(null!)
