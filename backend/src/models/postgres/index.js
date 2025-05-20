const User = require('./User');
const BusinessProfile = require('./BusinessProfile');

// Define relationships
User.hasMany(BusinessProfile, {
  foreignKey: 'userId',
  as: 'businessProfiles'
});

BusinessProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner'
});

module.exports = {
  User,
  BusinessProfile
};
