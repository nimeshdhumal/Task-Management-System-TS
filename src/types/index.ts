export type UserRole = 'admin' | 'user';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SortOrder = 'asc' | 'desc';

export interface IUser {
    id: number,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    createdAt: Date;
    updatedAt: Date;
}

export interface ITask {
    id: number,
    title: string,
    description?: string,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate?: Date,
    userId: number,
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    id: number,
    text: string,
    userId: number,
    taskId: number,
    createdAt: Date;
    updatedAt: Date;
}

export interface IActor {
    userId: number,
    userEmail: string,
    userRole: UserRole,
    requestBody: Record<string, unknown>,
    page: number,
    limit: number,
    sort: string,
    order: SortOrder,
    id: number,
    force?: string,
    status?: string,
    search?: string
}

export type IUserPublic = Omit<IUser, 'password'>;
export type ILoginInput = Pick<IUser, 'email' | 'password'>;
export type ISignUpInput = Pick<IUser, 'name' | 'email' | 'password' | 'role'>;