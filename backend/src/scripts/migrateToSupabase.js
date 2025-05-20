require('dotenv').config();
const { User, BusinessProfile } = require('../models/postgres');
const { Conversation } = require('../models/mongodb');
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Get Supabase admin client
const supabase = getSupabaseAdmin();

/**
 * Migrate users and profiles to Supabase
 */
async function migrateUsers() {
  try {
    logger.info('Starting user migration...');
    
    // Get all users from PostgreSQL
    const users = await User.findAll();
    logger.info(`Found ${users.length} users to migrate`);
    
    // Migrate each user
    for (const user of users) {
      try {
        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'TemporaryPassword123!', // Users will need to reset their password
          email_confirm: true
        });
        
        if (authError) {
          logger.error(`Error creating user ${user.email} in Supabase: ${authError.message}`);
          continue;
        }
        
        // Create profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phoneNumber,
            district: user.district,
            city: user.city,
            created_at: user.createdAt,
            updated_at: user.updatedAt
          });
        
        if (profileError) {
          logger.error(`Error creating profile for ${user.email} in Supabase: ${profileError.message}`);
          continue;
        }
        
        logger.info(`Migrated user ${user.email} to Supabase`);
      } catch (error) {
        logger.error(`Error migrating user ${user.email}: ${error.message}`);
      }
    }
    
    logger.info('User migration completed');
  } catch (error) {
    logger.error(`Error in user migration: ${error.message}`);
  }
}

/**
 * Migrate business profiles to Supabase
 */
async function migrateBusinessProfiles() {
  try {
    logger.info('Starting business profile migration...');
    
    // Get all business profiles from PostgreSQL
    const businessProfiles = await BusinessProfile.findAll({
      include: [{ model: User, as: 'owner' }]
    });
    
    logger.info(`Found ${businessProfiles.length} business profiles to migrate`);
    
    // Get user mapping (old ID to new ID)
    const userMapping = new Map();
    
    // Get all users from Supabase
    const { data: supabaseUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email');
    
    if (usersError) {
      logger.error(`Error getting users from Supabase: ${usersError.message}`);
      return;
    }
    
    // Create mapping from email to Supabase ID
    for (const user of supabaseUsers) {
      userMapping.set(user.email, user.id);
    }
    
    // Migrate each business profile
    for (const profile of businessProfiles) {
      try {
        const ownerEmail = profile.owner.email;
        const newUserId = userMapping.get(ownerEmail);
        
        if (!newUserId) {
          logger.error(`Could not find Supabase user ID for ${ownerEmail}`);
          continue;
        }
        
        // Create business profile in Supabase
        const { error: profileError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: newUserId,
            name: profile.name,
            description: profile.description,
            industry: profile.industry,
            stage: profile.stage,
            district: profile.district,
            city: profile.city,
            pincode: profile.pincode,
            team_size: profile.teamSize,
            employment_type: profile.employmentType,
            has_co_founders: profile.hasCoFounders,
            funding_status: profile.fundingStatus,
            revenue: profile.revenue,
            social_media: profile.socialMedia,
            offerings: profile.offerings,
            customers: profile.customers,
            challenges: profile.challenges,
            goals: profile.goals,
            telangana_specific: profile.telanganaSpecific,
            completion_percentage: profile.completionPercentage,
            created_at: profile.createdAt,
            updated_at: profile.updatedAt
          });
        
        if (profileError) {
          logger.error(`Error creating business profile for ${ownerEmail} in Supabase: ${profileError.message}`);
          continue;
        }
        
        logger.info(`Migrated business profile ${profile.name} for ${ownerEmail} to Supabase`);
      } catch (error) {
        logger.error(`Error migrating business profile: ${error.message}`);
      }
    }
    
    logger.info('Business profile migration completed');
  } catch (error) {
    logger.error(`Error in business profile migration: ${error.message}`);
  }
}

/**
 * Migrate conversations and messages to Supabase
 */
async function migrateConversations() {
  try {
    logger.info('Starting conversation migration...');
    
    // Get all conversations from MongoDB
    const conversations = await Conversation.find({});
    logger.info(`Found ${conversations.length} conversations to migrate`);
    
    // Get user mapping (old ID to new ID)
    const userMapping = new Map();
    
    // Get all users from Supabase
    const { data: supabaseUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email');
    
    if (usersError) {
      logger.error(`Error getting users from Supabase: ${usersError.message}`);
      return;
    }
    
    // Create mapping from email to Supabase ID
    for (const user of supabaseUsers) {
      userMapping.set(user.email, user.id);
    }
    
    // Migrate each conversation
    for (const conversation of conversations) {
      try {
        // Find user in Supabase
        // Note: This is a simplification. In a real migration, you would need to map MongoDB user IDs to Supabase user IDs
        const newUserId = userMapping.get(conversation.userId) || Object.values(userMapping)[0];
        
        if (!newUserId) {
          logger.error(`Could not find Supabase user ID for conversation ${conversation._id}`);
          continue;
        }
        
        // Create conversation in Supabase
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            user_id: newUserId,
            business_profile_id: null, // Would need mapping in a real migration
            title: conversation.title,
            active_module: conversation.activeModule,
            summary: conversation.summary,
            insights: conversation.insights,
            status: conversation.status,
            last_updated: conversation.lastUpdated,
            created_at: conversation.createdAt,
            updated_at: conversation.updatedAt
          })
          .select();
        
        if (conversationError) {
          logger.error(`Error creating conversation in Supabase: ${conversationError.message}`);
          continue;
        }
        
        // Migrate messages
        for (const message of conversation.messages) {
          const { error: messageError } = await supabase
            .from('messages')
            .insert({
              conversation_id: newConversation[0].id,
              role: message.role,
              content: message.content,
              metadata: message.metadata,
              created_at: message.timestamp
            });
          
          if (messageError) {
            logger.error(`Error creating message in Supabase: ${messageError.message}`);
          }
        }
        
        logger.info(`Migrated conversation ${conversation._id} with ${conversation.messages.length} messages to Supabase`);
      } catch (error) {
        logger.error(`Error migrating conversation ${conversation._id}: ${error.message}`);
      }
    }
    
    logger.info('Conversation migration completed');
  } catch (error) {
    logger.error(`Error in conversation migration: ${error.message}`);
  }
}

/**
 * Run the migration
 */
async function runMigration() {
  try {
    logger.info('Starting migration to Supabase...');
    
    // Migrate users first
    await migrateUsers();
    
    // Then migrate business profiles
    await migrateBusinessProfiles();
    
    // Finally migrate conversations and messages
    await migrateConversations();
    
    logger.info('Migration to Supabase completed successfully');
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error(`Migration script error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  migrateUsers,
  migrateBusinessProfiles,
  migrateConversations,
  runMigration
};
