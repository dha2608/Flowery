import type { Request } from 'express';
import { PAGINATION } from '../config/constants.js';

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getPagination = (req: Request): PaginationQuery => {
  const page = Math.max(1, Number(req.query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginateResponse = <T>(
  data: T[],
  total: number,
  { page, limit }: PaginationQuery
): PaginatedResponse<T> => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});
