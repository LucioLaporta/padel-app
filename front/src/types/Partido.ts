export type Partido = {
  id: number;
  date: string;
  level: string;
  price: number;
  players: number[];
  players_count: number;
  spots_left: number;
  is_full: boolean;
  is_joined: boolean;
  can_join: boolean;
  can_delete: boolean;
};
