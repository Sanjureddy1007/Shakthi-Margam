const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const BusinessProfile = sequelize.define('BusinessProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  industry: {
    type: DataTypes.STRING
  },
  stage: {
    type: DataTypes.ENUM('idea', 'startup', 'growth', 'established'),
    defaultValue: 'startup'
  },
  // Location information
  location: {
    type: DataTypes.JSONB,
    defaultValue: {},
    get() {
      return {
        district: this.getDataValue('district'),
        city: this.getDataValue('city'),
        pincode: this.getDataValue('pincode')
      };
    },
    set(value) {
      this.setDataValue('district', value.district);
      this.setDataValue('city', value.city);
      this.setDataValue('pincode', value.pincode);
    }
  },
  district: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  pincode: {
    type: DataTypes.STRING
  },
  // Team information
  teamSize: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  employmentType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract'),
    defaultValue: 'full-time'
  },
  hasCoFounders: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Financial information
  fundingStatus: {
    type: DataTypes.ENUM('bootstrapped', 'seed', 'series-a', 'series-b', 'acquired'),
    defaultValue: 'bootstrapped'
  },
  revenue: {
    type: DataTypes.JSONB,
    defaultValue: {
      range: 'pre-revenue',
      amount: 0
    }
  },
  // Social media information
  socialMedia: {
    type: DataTypes.JSONB,
    defaultValue: {
      platforms: [],
      contentFrequency: 'irregular'
    }
  },
  // Product/Service information
  offerings: {
    type: DataTypes.JSONB,
    defaultValue: {
      type: 'product',
      count: 1,
      priceRange: {
        min: 0,
        max: 0
      }
    }
  },
  // Customer information
  customers: {
    type: DataTypes.JSONB,
    defaultValue: {
      targetSegments: [],
      demographics: {},
      geographicFocus: 'local',
      acquisitionChannels: []
    }
  },
  // Business challenges
  challenges: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  // Business goals
  goals: {
    type: DataTypes.JSONB,
    defaultValue: {
      shortTerm: [],
      longTerm: []
    }
  },
  // Telangana-specific information
  telanganaSpecific: {
    type: DataTypes.JSONB,
    defaultValue: {
      useGovernmentSchemes: false,
      memberOfAssociations: false,
      localMarketFocus: true,
      exportFocus: false
    }
  },
  // Assessment completion percentage
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = BusinessProfile;
