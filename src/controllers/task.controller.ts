import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, commentOnTask, getAllCommentsOfTask } from '../services/task.service';
import { Request, Response, NextFunction } from 'express';
import buildActor from '../utils/actor.util';
import logger from '../utils/logger';
import { ITask } from '../types';

const createTaskController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const taskData = { ...actor.requestBody, userId: actor.userId };
        const result = await createTask(taskData as Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>);
        logger.info('Task Controller: createTask called.');
        res.status(201).json({ success: true, message: 'Task created successfully', data: result });
    } catch (error) {
        logger.error('Task Controller createTask Failed: ', error);
        next(error);
    }
};

const getAllTasksController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const result = await getAllTasks({
            page: actor.page,
            limit: actor.limit,
            sort: actor.sort,
            order: actor.order,
            userId: actor.userId,
            includeDeleted: false,
            status: actor.status,
            search: actor.search
        });
        logger.info('Task Controller: getAllTasks called.');
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        logger.error('Task Controller getAllTasks Failed: ', error);
        next(error);
    }
};

const getTaskByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const task = await getTaskById(actor.id, actor.userId);
        logger.info('Task Controller: getTaskById function called.');
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        logger.error('Task Controller getTaskById function Failed: ', error);
        next(error);
    }
};

const updateController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const updated = await updateTask(actor.id, actor.requestBody, actor.userId);
        logger.info('Task Controller: updateController function called.');
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        logger.error('Task Controller updateController function Failed: ', error);
        next(error);
    }
};

const deleteController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        await deleteTask(actor.id, actor.force, actor.userId);
        logger.info('Task deleted by user ', actor.id);
        res.status(200).json({ success: true, data: "Task deleted" });
    } catch (error) {
        logger.error('Task Controller deleteController function Failed: ', error);
        next(error);
    }
};

const commentOnTaskController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const commentData = {
            ...actor.requestBody,
            userId: actor.userId,
            taskId: actor.id
        };
        const result = await commentOnTask(commentData as { text: string; taskId: number; userId: number });
        logger.info('Task Controller: commentOnTask called.');
        res.status(201).json({ success: true, message: 'Comment added successfully', data: result });
    } catch (error) {
        logger.error('Task Controller commentOnTask Failed: ', error);
        next(error);
    }
};

const getAllCommentsTaskController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const data = await getAllCommentsOfTask(actor.id, actor.page, actor.limit, actor.userId, actor.userRole);
        res.status(200).json({ success: true, data });
    } catch (error) {
        logger.error('Task Controller getAllCommentsTaskController Failed: ', error);
        next(error);
    }
};

export { createTaskController, getAllTasksController, getTaskByIdController, updateController, deleteController, commentOnTaskController, getAllCommentsTaskController }