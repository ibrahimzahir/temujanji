import {
  DEFAULT_ROLE_PERMISSIONS,
  userPermissionsSchema,
  type OperationPermissionKey,
  type PagePermissionKey,
  type StudioRoleType,
  type UserPermissions,
} from "./schemas/studio";

export function resolveEffectivePermissions(
  role: "ADMIN" | "DEV" | "EDITOR",
  customPermissions?: unknown
): UserPermissions {
  const parsed = userPermissionsSchema.safeParse(customPermissions);
  if (parsed.success) {
    return parsed.data;
  }
  return DEFAULT_ROLE_PERMISSIONS[role];
}

export function hasPagePermission(
  permissions: UserPermissions,
  page: PagePermissionKey
): boolean {
  return permissions.pages.includes(page);
}

export function hasOperationPermission(
  permissions: UserPermissions,
  operation: OperationPermissionKey
): boolean {
  return permissions.operations.includes(operation);
}

export function roleToEnum(role: StudioRoleType): "ADMIN" | "DEV" | "EDITOR" {
  if (role === "admin") return "ADMIN";
  if (role === "dev") return "DEV";
  return "EDITOR";
}
