export type Partido = {
  id: number;
  start_time: string;
  end_time: string;
  level: string;
  price: number;
  players: number[];

  players_count: number;
  spots_left: number;
  is_full: boolean;
  is_joined: boolean;
  is_owner: boolean;
  can_join: boolean;
  can_delete: boolean;

  players_ratings?: Record<number, number | null>;
};
