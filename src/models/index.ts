import User from './user.model';
import Task from './task.model';
import Comment from './comment.model';

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: "CASCADE", onUpdate: "CASCADE" });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export { User, Task, Comment };