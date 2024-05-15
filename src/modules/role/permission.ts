import { RolePermissions } from '../../utils';

export const vegeelSuperAdminPermissions: RolePermissions = {
  role: 'vegeelSuperAdmin',
  name: 'Vegeel Super Admin',
  slug: 'vegeel-super-admin',
  isCustom: false,
  description: 'Has site wide access to all vegeel functionalities',
  permissions: [
    {
      name: 'Dashboard',
      permissions: [
        {
          name: 'View Dashboard',
          permission: 'dashboard:view',
        },
        {
          name: 'View All Related Dashboard',
          permission: 'dashboard:all:view',
        },
      ],
    },
    {
      name: 'Businesses',
      permissions: [
        {
          name: 'View Businesses',
          permission: 'businesses:view',
        },
        {
          name: 'Suspend Businesses',
          permission: 'businesses:suspend',
        },
        {
          name: 'Unsuspend Businesses',
          permission: 'businesses:unsuspend',
        },
        {
          name: 'Accept Businesses Activation',
          permission: 'businesses:accept:activation',
        },
        {
          name: 'Decline Businesses Activation',
          permission: 'businesses:decline:activation',
        },
        {
          name: 'Manage Businesses ',
          permission: 'businesses:manage',
        },
        {
          name: 'Invite Businesses ',
          permission: 'businesses:invite',
        },
      ],
    },
    {
      name: 'Reports Monitoring',
      permissions: [
        {
          name: 'View Reports Monitoring',
          permission: 'reports:view',
        },
      ],
    },
    {
      name: 'Audit',
      permissions: [
        {
          name: 'View Audit',
          permission: 'audits:view',
        },
      ],
    },
    {
      name: 'Compliance',
      permissions: [
        {
          name: 'View Compliance',
          permission: 'compliance:view',
        },
      ],
    },
    {
      name: 'Team',
      permissions: [
        {
          name: 'View Team',
          permission: 'team:view',
        },
        {
          name: 'Suspend User',
          permission: 'team:suspend',
        },
        {
          name: 'Unsuspend User',
          permission: 'team:unsuspend',
        },
        {
          name: 'Change User Role',
          permission: 'team:change:role',
        },
        {
          name: 'Manage User Role',
          permission: 'team:manage:role',
        },
        {
          name: 'Invite User',
          permission: 'team:add',
        },
      ],
    },
    {
      name: 'Profile',
      permissions: [
        {
          name: 'View Profile',
          permission: 'profile:view',
        },
      ],
    },
    {
      name: 'Setting',
      permissions: [
        {
          name: 'View Setting',
          permission: 'setting:view',
        },
      ],
    },
  ],
};

export const superAdminPermissions: RolePermissions = {
  role: 'superAdmin',
  name: 'Super Admin',
  isCustom: false,
  description: 'Has site wide access to all admin functionalities',
  permissions: [
    {
      name: 'Dashboard',
      permissions: [
        {
          name: 'View Dashboard',
          permission: 'dashboard:view',
        },
        {
          name: 'View Super Admin Only Related Dashboard',
          permission: 'dashboard:admin:view',
        },
      ],
    },
    {
      name: 'Team',
      permissions: [
        {
          name: 'View Team',
          permission: 'team:view',
        },
        {
          name: 'Suspend User',
          permission: 'team:suspend',
        },
        {
          name: 'Unsuspend User',
          permission: 'team:unsuspend',
        },
        {
          name: 'Change User Role',
          permission: 'team:change:role',
        },
        {
          name: 'Manage User Role',
          permission: 'team:manage:role',
        },
        {
          name: 'Invite User',
          permission: 'team:add',
        },
      ],
    },
    {
      name: 'Profile',
      permissions: [
        {
          name: 'View Profile',
          permission: 'profile:view',
        },
      ],
    },
  ],
};

export const auditorPermissions: RolePermissions = {
  role: 'auditors',
  name: 'auditor',
  isCustom: false,
  description: "Has Auditor's related site functionalities",
  permissions: [
    {
      name: 'Dashboard',
      permissions: [
        {
          name: 'View Dashboard',
          permission: 'dashboard:view',
        },
        {
          name: 'View Auditors Only Related Dashboard',
          permission: 'dashboard:auditor:view',
        },
      ],
    },
    {
      name: 'Profile',
      permissions: [
        {
          name: 'View Profile',
          permission: 'profile:view',
        },
      ],
    },
  ],
};

export const supportStaffPermissions: RolePermissions = {
  role: 'supportStaff',
  name: 'SupportStaff',
  description: 'Has Support Staffs related site functionalities',
  isCustom: false,
  permissions: [
    {
      name: 'Dashboard',
      permissions: [
        {
          name: 'View Dashboard',
          permission: 'dashboard:view',
        },
        {
          name: 'View Support Staff Only Related Dashboard',
          permission: 'dashboard:supportstaff:view',
        },
      ],
    },
    {
      name: 'Profile',
      permissions: [
        {
          name: 'View Profile',
          permission: 'profile:view',
        },
      ],
    },
  ],
};

export const systemAdministratorPermission: RolePermissions = {
  role: 'systemAdmin',
  name: 'System Administrator',
  isCustom: false,
  description: 'Has Support Staffs related site functionalities',
  permissions: [
    {
      name: 'Dashboard',
      permissions: [
        {
          name: 'View Dashboard',
          permission: 'dashboard:view',
        },
        {
          name: 'View System Admin Only Related Dashboard',
          permission: 'dashboard:systemadmin:view',
        },
      ],
    },
    {
      name: 'Profile',
      permissions: [
        {
          name: 'View Profile',
          permission: 'profile:view',
        },
      ],
    },
  ],
};
