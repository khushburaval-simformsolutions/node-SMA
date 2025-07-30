const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit),
    page: parseInt(page)
  };
};

const createPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: parseInt(limit)
  };
};

module.exports = {
  paginateResults,
  createPaginationResponse
};