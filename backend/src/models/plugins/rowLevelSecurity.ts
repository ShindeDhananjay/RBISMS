import mongoose from 'mongoose';

export function rowLevelSecurityPlugin(schema: mongoose.Schema) {
  // Add createdBy and adminId fields to every schema this plugin is attached to
  schema.add({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true } // The admin who owns this subdivision
  });

  // Automatically populate these fields before saving
  // Note: For this to work, the context (req.user) needs to be passed, which is tricky in Mongoose pre-save hooks.
  // Instead of doing it here, we will create an Express middleware that modifies req.body globally.
}
