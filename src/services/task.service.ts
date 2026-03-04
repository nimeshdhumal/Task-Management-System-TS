import { Op } from 'sequelize';
import { Task, Comment } from '../models';
import AppError from '../utils/app.error';
import logger from '../utils/logger';
import { IComment, ITask } from '../types';


const fetchComments = async (taskId: number, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const { rows, count } = await Comment.findAndCountAll({
        where: { taskId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        raw: true
    });
    return {
        data: rows as unknown as IComment[],
        meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    };
};

const createTask = async (data: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> => {
    try {
        const { id, title, description, status, priority, dueDate, userId, createdAt, updatedAt } = await Task.create(data);
        logger.info('Task Service: createTask successful');
        return { id, title, description, status, priority: priority || 'medium', dueDate, userId, createdAt, updatedAt };
    } catch (error) {
        logger.error('Task Service createTask: Failed', error);
        throw error;
    }
};

const getAllTasks = async (options: {
    page: number;
    limit: number;
    sort: string;
    order: string;
    userId: number;
    includeDeleted: boolean;
    status?: string;
    search?: string;
}): Promise<{
    data: ITask[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
    try {
        const { page, limit, sort, order, userId, includeDeleted, status, search } = options;
        const offset = (page - 1) * limit;
        const whereClause = { userId, ...(status && { status }), ...(search && { title: { [Op.like]: `%${search}%` } }) };

        const result = await Task.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[sort, order]],
            paranoid: !includeDeleted,
            raw: true
        });

        const total = result.count;
        const totalPages = Math.ceil(total / limit);

        logger.info('Task Service: getAllTasks successful');

        return {
            data: result.rows as unknown as ITask[],
            meta: { page, limit, total, totalPages }
        };
    } catch (error) {
        logger.error('Task Service getAllTasks Failed: ', error);
        throw error;
    }
};

const getTaskById = async (id: number, userId: number): Promise<ITask> => {
    try {
        const fetchDataByUserId = await Task.findOne({ where: { id, userId }, raw: true });
        if (!fetchDataByUserId) throw new AppError('Task not found', 404);
        return fetchDataByUserId as ITask;
    } catch (error) {
        logger.error('Task Service getTaskById Failed: ', error);
        throw error;
    }
};

const updateTask = async (id: number, requestBody: Record<string, unknown>, userId: number): Promise<ITask> => {

    try {

        const existingTask = await Task.findOne({ where: { id: id, userId }, raw: true });
        if (!existingTask) throw new AppError('Task not found', 404);

        await Task.update(requestBody, { where: { id } });

        const updatedTask = await Task.findByPk(id);
        if (!updatedTask) throw new AppError('Task not found after update', 404);

        logger.info('Task Service: updateTask successful');

        return updatedTask as ITask;

    } catch (error) {
        logger.error('Task Service updateTask Failed: ', error);
        throw error;
    }

};

const deleteTask = async (id: number, force: string | undefined, userId: number): Promise<{ deleted: boolean }> => {
    try {
        const deletedCount = await Task.destroy({
            where: { id, userId },
            force: force === 'true'
        });

        if (deletedCount === 0) {
            throw new AppError('Task not found', 404);
        }
        return { deleted: true }
    } catch (error) {
        logger.error('Task Service deleteTask Failed: ', error);
        throw error;
    }
};

const commentOnTask = async (commentData: { text: string; taskId: number; userId: number }): Promise<IComment> => {
    try {
        const taskExists = await Task.findByPk(commentData.taskId, { raw: true });
        if (!taskExists) throw new AppError('Task not found', 404);

        const comment = await Comment.create(commentData);
        logger.info('Task Service commentOnTask: success');

        return comment as unknown as IComment;
    } catch (error) {
        logger.error('Task Service commentOnTask Failed: ', error);
        throw error;
    }
};

const getAllCommentsOfTask = async (taskId: number, page: number, limit: number, userId: number, role: string): Promise<{ data: IComment[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {

    try {

        const task = await Task.findByPk(taskId, { attributes: ['userId'], raw: true });
        if (!task) throw new AppError('Task not found', 404);

        if (role === 'admin') return await fetchComments(taskId, page, limit);

        if (task.userId === userId) return await fetchComments(taskId, page, limit);

        const hasCommented = await Comment.findOne({ where: { taskId, userId }, attributes: ['id'], raw: true });
        if (hasCommented) return await fetchComments(taskId, page, limit);
        throw new AppError('Access denied', 403);

    } catch (error) {
        logger.error('Task Service getAllCommentsOfTask Failed: ', error);
        throw error;
    }

};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask, commentOnTask, getAllCommentsOfTask };