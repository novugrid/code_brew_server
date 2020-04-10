
export function paginate(page: number, pageSize: number) {
    const offset  = pageSize + page;
    const limit = offset + pageSize;
    return {offset, limit};
}
