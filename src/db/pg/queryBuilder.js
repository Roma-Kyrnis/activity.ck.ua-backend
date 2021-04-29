module.exports = {
  queryAccessibility: (filters) => {
    let query = '';

    if (filters) {
      const { accessibility, dogFriendly, childFriendly } = filters;

      if (accessibility) query = 'accessibility AND ';
      if (dogFriendly) query += 'dog_friendly AND ';
      if (childFriendly) query += 'child_friendly AND ';
    }

    return query;
  },
};
