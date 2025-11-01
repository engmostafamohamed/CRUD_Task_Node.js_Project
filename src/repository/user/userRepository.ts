import connectDB from "../../config/database";
import { User } from "../../models/userModel";

export class UserRepository {
  async findAll(
    filters: any = {},
    pagination: { page: number; per_page: number } = { page: 1, per_page: 10 }
  ): Promise<{ data: User[]; pagination: any }> {
    const where: string[] = ["deleted_at IS NULL"];
    const params: any[] = [];

    // Dynamic filters
    if (filters.name) {
      where.push("name LIKE ?");
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      where.push("email LIKE ?");
      params.push(`%${filters.email}%`);
    }

    if (filters.verification_status) {
      where.push("is_verified = ?");
      params.push(filters.verification_status === "true");
    }

    if (filters.start_date && filters.end_date) {
      where.push("DATE(created_at) BETWEEN ? AND ?");
      params.push(filters.start_date, filters.end_date);
    } else if (filters.start_date) {
      where.push("DATE(created_at) >= ?");
      params.push(filters.start_date);
    } else if (filters.end_date) {
      where.push("DATE(created_at) <= ?");
      params.push(filters.end_date);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (pagination.page - 1) * pagination.per_page;

    const [rows] = await connectDB.query(
      `
      SELECT id, name, email, role, is_active, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pagination.per_page, offset]
    );

    const [countRows]: any = await connectDB.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const total = countRows[0]?.total || 0;

    return {
      data: rows as User[],
      pagination: {
        total,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil(total / pagination.per_page),
      },
    };
  }
    // Stats: total registered & verified users
  async getUserStats() {
    const [rows]: any = await connectDB.query(`
      SELECT 
        COUNT(*) AS total_registered,
        SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) AS total_verified
      FROM users
      WHERE deleted_at IS NULL
    `);

    return {
      total_registered: rows[0]?.total_registered || 0,
      total_verified: rows[0]?.total_verified || 0,
    };
  }
    async logLogin(userId: number): Promise<void> {
    await connectDB.query(
      `INSERT INTO login_logs (user_id) VALUES ( ?)`,
      [userId]
    );
  }
  
  async getTopUsersByLoginFrequency() {
    const [rows]: any = await connectDB.query(`
      SELECT u.id, u.name, u.email, COUNT(l.id) AS login_count
      FROM users u
      JOIN login_logs l ON u.id = l.user_id
      WHERE u.deleted_at IS NULL
      GROUP BY u.id
      ORDER BY login_count DESC
      LIMIT 3
    `);
    return rows;
  }

  async getInactiveUsers(hours = 1) {
    const sql = `
      SELECT u.id, u.name, u.email
      FROM users u
      LEFT JOIN login_logs l ON u.id = l.user_id
      WHERE l.login_time IS NULL OR l.login_time < (NOW() - INTERVAL ? HOUR);
    `;
    const [rows]: any = await connectDB.query(sql, [hours]);
    return rows;
  }
  async findById(id: number): Promise<User | null> {
    const [rows] = await connectDB.query(
      "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id]
    );
    return (rows as User[])[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await connectDB.query(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1",
      [email]
    );
    return (rows as User[])[0] || null;
  }

  async create(user: User): Promise<User> {

    const [result]: any = await connectDB.query(
      `
      INSERT INTO users (name, email, password, role, is_active, is_verified)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user.name,
        user.email,
        user.password,
        user.role ?? "user",
        user.is_active ?? true,
        user.is_verified ?? false,
      ]
    );

    const [rows]: any = await connectDB.query(
      `
      SELECT id, name, email, role, is_active, is_verified, created_at
      FROM users
      WHERE id = ?
      `,
      [result.insertId]
    );

    return rows[0];
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const keys = Object.keys(data);
    if (keys.length === 0) return (await this.findById(id))!;

    const updates = keys.map((key) => `${key} = ?`).join(", ");
    const values = [...keys.map((key) => (data as any)[key]), id];

    await connectDB.query(`UPDATE users SET ${updates} WHERE id = ?`, values);
    return (await this.findById(id))!;
  }

  async softDelete(id: number): Promise<void> {
    await connectDB.query(
      "UPDATE users SET deleted_at = NOW(), is_active = FALSE WHERE id = ?",
      [id]
    );
  }

  async restore(id: number): Promise<void> {
    await connectDB.query(
      "UPDATE users SET deleted_at = NULL, is_active = TRUE WHERE id = ?",
      [id]
    );
  }

  async activate(id: number): Promise<void> {
    await connectDB.query("UPDATE users SET is_active = TRUE WHERE id = ?", [
      id,
    ]);
  }

  async deactivate(id: number): Promise<void> {
    await connectDB.query("UPDATE users SET is_active = FALSE WHERE id = ?", [
      id,
    ]);
  }

  async verify(id: number): Promise<void> {
    await connectDB.query("UPDATE users SET is_verified = TRUE WHERE id = ?", [
      id,
    ]);
  }

  async unverify(id: number): Promise<void> {
    await connectDB.query("UPDATE users SET is_verified = FALSE WHERE id = ?", [
      id,
    ]);
  }
}
