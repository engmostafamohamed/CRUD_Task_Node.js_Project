export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;
  deleted_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}
