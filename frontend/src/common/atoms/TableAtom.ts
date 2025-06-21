import { atom } from 'jotai';

export const selectedColumnsAtom = atom<{ Header: string; accessor: string }[]>([]);
