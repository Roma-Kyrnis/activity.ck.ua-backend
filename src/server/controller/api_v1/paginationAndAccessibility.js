function getPaginationAndAccessibility(query) {
  let { _limit: limit, _page: page } = query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  const { accessibility, dog_friendly: dogFriendly, child_friendly: childFriendly } = query;

  const filters = {};

  if (accessibility !== undefined) filters.accessibility = accessibility;
  if (dogFriendly !== undefined) filters.dogFriendly = dogFriendly;
  if (childFriendly !== undefined) filters.childFriendly = childFriendly;

  return { limit, page, filters };
}

module.exports = getPaginationAndAccessibility;
