// Audit log schema example for MongoDB
// This is a TypeScript interface for reference and a sample document for MongoDB

export interface AuditLog {
  timestamp: Date;
  actorId: string; // id of the admin who performed the action
  action: string; // e.g., 'PROMOTE USER', 'DEMOTE USER', 'DELETE USER'
  targetUserId: string; // id of the user affected
  details?: Record<string, any>; // optional metadata
}

// Example MongoDB document:
/*
{
  timestamp: new Date(),
  actorId: "64b2f...", // admin's user id
  action: "PROMOTE USER",
  targetUserId: "64b2e...", // affected user's id
  details: {
    previousRole: "user",
    newRole: "admin"
  }
}
*/
