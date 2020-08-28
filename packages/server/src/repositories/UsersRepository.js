import { pg } from '@createvid/common';

class UsersRepository {
  async getAll() {
    const { rows } = await pg.query('select id, email, admin from users');
    return rows;
  }

  async getByID(id) {
    const { rows } = await pg.query('select id, email, admin from users where id = $1 limit 1', [id]);
    return rows[0];
  }

  async create(email) {
    return pg.query('insert into users (email) values ($1)', [email]);
  }

  async remove(userId) {
    return pg.query('delete from users where id = $1', [userId]);
  }

  async update(userId, email, admin) {
    return pg.query('update users set email = $1, admin = $2 where id = $3', [email, admin, userId]);
  }
}

export default new UsersRepository();
