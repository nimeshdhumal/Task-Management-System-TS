import { getSingleComment, updateComment, deleteComment } from '../services/comment.service';
import { Request, Response, NextFunction } from 'express';
import buildActor from '../utils/actor.util';
import logger from '../utils/logger';

const getSingleCommentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const data = await getSingleComment(actor.id, actor.userId, actor.userRole);
        logger.info('Comment Controller calls getSingleComment.');
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        logger.error('Comment Controller getSingleComment Failed: ', error);
        next(error);
    }
};

const updateCommentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        const commentData = {
            ...actor.requestBody,
            userId: actor.userId,
            commentId: actor.id
        };
        const result = await updateComment(commentData as { commentId: number; userId: number; text: string });
        logger.info('Comment Controller: updateComment called.');
        res.status(200).json({ success: true, message: 'Comment updated successfully', data: result });
    } catch (error) {
        logger.error('Comment Controller updateComment Failed: ', error);
        next(error);
    }
};

const deleteCommentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const actor = buildActor(req);
        await deleteComment(actor.id, actor.userId);
        logger.info('Comment deleted successfully.');
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        logger.error('Comment Controller deleteComment Failed: ', error);
        next(error);
    }
};


export { getSingleCommentController, updateCommentController, deleteCommentController }