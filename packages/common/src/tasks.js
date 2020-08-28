import pg from './pg';
import channel from './channel';
import constants from './constants';
import storage from './storage';

class TasksService {

	static async countTasksByTemplate() {
		const ret = await pg.query('select templateid, count(*) as count from tasks group by templateid');
		const res = {};
		ret.rows.forEach(row => res[row.templateid] = row.count);
		return res;
	}

	static async countTasksByTemplateAndUser(userId) {
		const ret = await pg.query('select templateid, count(*) as count from tasks where user_id = $1 group by templateid', [userId]);
		const res = {};
		ret.rows.forEach(row => res[row.templateid] = row.count);
		return res;
	}

	static async getAllByTemplateId(templateId) {
		const ret = await pg.query('SELECT * FROM tasks WHERE templateid=$1;', [templateId]);
		return ret.rows;
	}

	static async getAll() {
		const ret = await pg.query('SELECT * FROM tasks;');
		return ret.rows;
	}

	static async getTaskById(id) {
		const ret = await pg.query('SELECT * FROM tasks WHERE id=$1;', [id]);
		if (ret.rows.length > 0) {
			const [task] = ret.rows;
			return {
				id: task.id,
				url: task.url,
				templateId: task.templateid,
				poster: task.poster,
				user_id: task.user_id,
				title: task.title
			};
		}
		throw new Error('Can\'t find video by id');

	}

	static async addTask(newTask) {
		const columns = Object.keys(newTask);
		const valPlaceholders = columns.map((col, idx) => '$' + (idx + 1));
		const values = Object.values(newTask).map(val => {
			if (Array.isArray(val)) {
				return JSON.stringify(val);
			} else {
				return val;
			}
		});

		await pg.query(`insert into tasks (${columns.join(',')}) values (${valPlaceholders.join(',')})`, values);
		channel.push(constants.queue.TASK_INFO, {
			type: constants.task.messages.ADD_NEW_TASK,
			taskId: newTask.id,
			data: newTask
		});
		return newTask;
	}

	static async deleteTask(taskId) {
		await pg.query(`delete from tasks where id = $1`, [taskId]);
		return storage.unlinkDir('/' + taskId);

	}

	static async updateTaskStatus(id, status) {
		await this.ensureTaskExist(id);
		await pg.query(`update tasks set status = $1 where id = $2`, [status, id]);
		channel.push(constants.queue.TASK_INFO, {
			type: constants.task.messages.UPDATE_TASK_STATUS,
			taskId: id,
			data: { status }
		});
	}

	static async updateTaskUrl(id, url, status) {

		await this.ensureTaskExist(id);
		await pg.query(`update tasks set status = $1, url = $2 where id = $3`, [status, url, id]);
		channel.push(constants.queue.TASK_INFO, {
			type: constants.task.messages.ADD_URL,
			taskId: id,
			data: { status, url }
		});
	}

	static async setError(id, error, stack) {
		this.ensureTaskExist(id);
		await pg.query(`update tasks set error = $1 where id = $2`, [error + stack, id]);
		channel.push(constants.queue.TASK_INFO, {
			type: constants.task.messages.ADD_ERROR,
			taskId: id,
			data: error + stack
		});
	}

	static async ensureTaskExist(id) {
		const ret = await pg.query('select * from tasks where id = $1', [id]);
		if (ret.rows.length > 0) {
			return;
		}
		throw new Error('Task didn\'t exist');
	}
}

export default TasksService;
