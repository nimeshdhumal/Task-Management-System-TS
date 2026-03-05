import { Comment, Task } from '../models';
import AppError from '../utils/app.error';
import logger from '../utils/logger';
import { IComment } from '../types';

const getSingleComment = async (commentId: number, userId: number, role: string): Promise<IComment> => {
    try {
        const comment = await Comment.findByPk(commentId, {
            attributes: ['id', 'text', 'userId', 'taskId'],
            raw: true
        });
        if (!comment) throw new AppError('Comment not found', 404);

        if (role === 'admin') { logger.info('Comment sent successfully.'); return comment as IComment; }

        const task = await Task.findByPk(comment.taskId, { attributes: ['userId'], raw: true });
        if (!task) throw new AppError('Task not found', 404);

        if (task.userId === userId || comment.userId === userId) {
            logger.info('Comment sent successfully.');
            return comment as IComment;
        }
        throw new AppError('Access denied', 403);
    } catch (error) {
        logger.error('Comment Service getSingleComment Failed: ', error);
        throw error;
    }
};

const updateComment = async (commentData: { commentId: number; userId: number; text: string }): Promise<IComment> => {
    try {
        //Find out the comment id is available or not;;;
        const foundcommentId = await Comment.findOne({
            attributes: ['userId', 'id', 'taskId'],
            where: { id: commentData.commentId }
        });

        if (!foundcommentId) throw new AppError('Comment not found', 404);
        if (foundcommentId.userId !== commentData.userId) throw new AppError('Access denied', 403);

        const [updatedCount] = await Comment.update({ text: commentData.text }, { where: { id: commentData.commentId } });
        if (updatedCount === 0) {
            throw new AppError('Update Failed', 400);
        } else {
            const updatedComment = await Comment.findByPk(commentData.commentId, { raw: true });
            if (!updatedComment) throw new AppError('Comment not found after update', 404);
            logger.info('Comment Service: updateComment successful');
            return updatedComment as IComment;
        }
    } catch (error) {
        logger.error('Comment Service updateComment Failed: ', error);
        throw error;
    }
};

const deleteComment = async (commentId: number, tokenUserId: number, force?: string): Promise<{ deleted: boolean }> => {
    try {
        const deletedCount = await Comment.destroy({ where: { id: commentId, userId: tokenUserId }, force: force === 'true' });
        if (deletedCount === 0) throw new AppError('Comment not found or you are not allowed to delete it', 404);
        logger.info('Record deleted successfull.');
        return { deleted: true };
    } catch (error) {
        logger.error('Comment Service deleteComment Failed: ', error);
        throw error;
    }
};

export { getSingleComment, updateComment, deleteComment }