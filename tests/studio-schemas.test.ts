import test from "node:test";
import assert from "node:assert/strict";
import {
  createAnalyticsSchema,
  createBackupSchema,
  createOrderSchema,
  createPinterestPinSchema,
  createTeamMemberSchema,
  createTrafficHitSchema,
  DEFAULT_ROLE_PERMISSIONS,
  devActionSchema,
  generatePinterestPinSchema,
  updateSystemConfigSchema,
  updateTeamMemberSchema,
} from "../lib/schemas/studio";
import {
  hasOperationPermission,
  hasPagePermission,
  resolveEffectivePermissions,
  roleToEnum,
} from "../lib/rbac";

test("createOrderSchema accepts valid Indonesian wedding order", () => {
  const parsed = createOrderSchema.safeParse({
    coupleName: "Hana & Fajar",
    email: "hana.fajar@gmail.com",
    whatsapp: "081234567890",
    designSlug: "senja-di-taman",
    packageName: "Paket Cerita",
    amount: "249000",
    eventDate: "18 Juni 2027",
    venue: "Hotel Majapahit, Surabaya",
    guestCount: "300",
    notes: "Segel lilin ungu plum",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.amount, 249000);
    assert.equal(parsed.data.guestCount, 300);
  }
});

test("createOrderSchema rejects invalid email and low amount", () => {
  const parsed = createOrderSchema.safeParse({
    coupleName: "Ab",
    email: "not-an-email",
    whatsapp: "123",
    designSlug: "senja-di-taman",
    packageName: "Paket Inti",
    amount: 1000,
    eventDate: "2027",
    venue: "BDG",
    guestCount: 5,
  });
  assert.equal(parsed.success, false);
});

test("team member schemas support role assignment, status, rollback, and micro permissions", () => {
  const create = createTeamMemberSchema.safeParse({
    name: "Nadia Pratiwi",
    email: "nadia@temujanji.id",
    role: "EDITOR",
    title: "Kurator Undangan",
    active: true,
  });
  assert.equal(create.success, true);

  const rollback = updateTeamMemberSchema.safeParse({
    id: "usr_123",
    rollbackRole: true,
  });
  assert.equal(rollback.success, true);

  const blockWithPerms = updateTeamMemberSchema.safeParse({
    id: "usr_123",
    status: "BLOCKED",
    permissions: {
      pages: ["ringkasan", "koleksi"],
      operations: ["cards.create", "content.update"],
    },
  });
  assert.equal(blockWithPerms.success, true);
});

test("analytics and traffic hit schemas enforce date and path formats", () => {
  assert.equal(
    createAnalyticsSchema.safeParse({
      date: "2026-11-24",
      desktopViews: 200,
      mobileViews: 550,
      rsvpSubmitted: 48,
      inquiries: 12,
    }).success,
    true
  );

  assert.equal(
    createAnalyticsSchema.safeParse({
      date: "24-11-2026",
      desktopViews: 200,
      mobileViews: 550,
      rsvpSubmitted: 48,
      inquiries: 12,
    }).success,
    false
  );

  assert.equal(
    createTrafficHitSchema.safeParse({
      path: "desain/senja",
      pageTitle: "Senja",
      location: "Jakarta, ID",
      deviceType: "Mobile",
      os: "iOS",
      browser: "Safari",
      hits: 10,
      uniqueVisitors: 8,
    }).success,
    false
  );

  assert.equal(
    createTrafficHitSchema.safeParse({
      path: "/desain/senja-di-taman",
      pageTitle: "Senja di Taman",
      location: "Jakarta, ID",
      deviceType: "Mobile",
      os: "iOS 19",
      browser: "Safari",
      hits: 120,
      uniqueVisitors: 95,
    }).success,
    true
  );
});

test("dev console and pinterest schemas validate cleanly", () => {
  assert.equal(
    updateSystemConfigSchema.safeParse({
      maintenanceMode: true,
      maintenanceMessage: "Pemeliharaan singkat 10 menit.",
      dailyBackupEnabled: true,
      backupRetentionDay: 30,
    }).success,
    true
  );

  assert.equal(
    createBackupSchema.safeParse({ label: "Pre-deploy Snapshot" }).success,
    true
  );

  assert.equal(
    devActionSchema.safeParse({ action: "healthcheck" }).success,
    true
  );

  assert.equal(
    generatePinterestPinSchema.safeParse({
      designSlug: "senja-di-taman",
      board: "Undangan Pernikahan Digital Elegan",
      angle: "promo-shopee",
      scheduledAt: "2026-11-25T09:00",
    }).success,
    true
  );

  assert.equal(
    createPinterestPinSchema.safeParse({
      title: "Undangan Digital Ungu Plum Elegan",
      description: "Desain botani hangat dengan RSVP real-time dan kurasi 1x24 jam.",
      board: "Tema Botani & Ungu Plum",
      designSlug: "senja-di-taman",
      imageUrl: "/images/garden.jpg",
      destinationUrl: "https://temujanji.id/desain/senja-di-taman?utm_source=pinterest",
      keywords: "undangan digital, temu janji",
      scheduledAt: "2026-11-25T09:00:00Z",
    }).success,
    true
  );
});

test("RBAC helpers resolve role defaults and custom per-user micro permissions", () => {
  assert.equal(roleToEnum("admin"), "ADMIN");
  assert.equal(roleToEnum("dev"), "DEV");
  assert.equal(roleToEnum("editor"), "EDITOR");

  const editorDefault = resolveEffectivePermissions("EDITOR", null);
  assert.equal(hasPagePermission(editorDefault, "koleksi"), true);
  assert.equal(hasPagePermission(editorDefault, "dev"), false);
  assert.equal(hasOperationPermission(editorDefault, "cards.delete"), true);
  assert.equal(hasOperationPermission(editorDefault, "users.manage"), false);

  const devDefault = resolveEffectivePermissions("DEV", undefined);
  assert.equal(hasPagePermission(devDefault, "dev"), true);
  assert.equal(hasOperationPermission(devDefault, "infra.manage"), true);

  const customEditor = resolveEffectivePermissions("EDITOR", {
    pages: ["ringkasan", "koleksi", "tim"],
    operations: ["cards.create", "users.manage"],
  });
  assert.equal(hasPagePermission(customEditor, "tim"), true);
  assert.equal(hasOperationPermission(customEditor, "users.manage"), true);
  assert.equal(hasOperationPermission(customEditor, "cards.delete"), false);
  assert.deepEqual(
    resolveEffectivePermissions("ADMIN", { invalid: true }),
    DEFAULT_ROLE_PERMISSIONS.ADMIN
  );
});
