import { IActor, SortOrder } from "../types";
import { Request } from "express";

const buildActor = (req: Request): IActor => {
  return {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    userId: Number(req.user.id),
    userEmail: req.user.email as string,
    requestBody: req.body,
    sort: (req.query.sort as string) || "createdAt",
    order: (req.query.order as SortOrder) || "desc",
    id: Number(req.params.id),
    force: req.query.force as string,
    userRole: req.user.role,
  };
};

export default buildActor;
