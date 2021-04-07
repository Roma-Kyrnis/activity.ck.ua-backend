module.exports = {
  queryAccessibility: (filters) => {
    let query = '';

    if (filters) {
      const { accessibility, dogFriendly, childFriendly } = filters;

      if (accessibility) query = 'AND accessibility';
      if (dogFriendly) query += ' AND dog_friendly';
      if (childFriendly) query += ' AND child_friendly';
    }

    return query;
  },
};
