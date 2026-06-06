const storageKey = "spendwise-mvp-data";
const supabaseUrl = "https://dvjtgdbezhognizqnebm.supabase.co";
const supabasePublishableKey = "sb_publishable_iQZxRPVJfUM1iw3mMlAiAw_eHnjpEcp";
const appRedirectUrl = "https://splituation.com";
const supabaseClient = window.supabase?.createClient(supabaseUrl, supabasePublishableKey) || null;

const authScreen = document.querySelector("#auth-screen");
const homeScreen = document.querySelector("#home-screen");
const groupsScreen = document.querySelector("#groups-screen");
const reportsScreen = document.querySelector("#reports-screen");
const groupDetailScreen = document.querySelector("#group-detail-screen");
const screens = [authScreen, homeScreen, groupsScreen, reportsScreen, groupDetailScreen];

const authForm = document.querySelector("#auth-form");
const authMessage = document.querySelector("#auth-message");
const authHelp = document.querySelector("#auth-help");
const authSubmitButton = document.querySelector("#auth-submit-button");
const loginModeButton = document.querySelector("#login-mode-button");
const signupModeButton = document.querySelector("#signup-mode-button");
const nameField = document.querySelector("#name-field");
const displayNameInput = document.querySelector("#display-name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const forgotPasswordButton = document.querySelector("#forgot-password-button");
const resetForm = document.querySelector("#reset-form");
const resetTitle = document.querySelector("#reset-title");
const cancelResetButton = document.querySelector("#cancel-reset-button");
const resetEmailField = document.querySelector("#reset-email-field");
const resetEmailInput = document.querySelector("#reset-email");
const newPasswordField = document.querySelector("#new-password-field");
const newPasswordInput = document.querySelector("#new-password");
const resetMessage = document.querySelector("#reset-message");
const resetHelp = document.querySelector("#reset-help");
const resetSubmitButton = document.querySelector("#reset-submit-button");

const logoutButton = document.querySelector("#logout-button");
const detailLogoutButton = document.querySelector("#detail-logout-button");
const profileName = document.querySelector("#profile-name");
const profileEmail = document.querySelector("#profile-email");
const sessionMessage = document.querySelector("#session-message");
const homeGroupCount = document.querySelector("#home-group-count");
const homeGroupList = document.querySelector("#home-group-list");
const emptyHome = document.querySelector("#empty-home");
const recentExpenseCount = document.querySelector("#recent-expense-count");
const recentExpenseList = document.querySelector("#recent-expense-list");
const emptyRecentExpenses = document.querySelector("#empty-recent-expenses");
const pendingInviteCount = document.querySelector("#pending-invite-count");
const pendingInviteList = document.querySelector("#pending-invite-list");
const emptyPendingInvites = document.querySelector("#empty-pending-invites");

const groupForm = document.querySelector("#group-form");
const groupNameInput = document.querySelector("#group-name");
const groupMessage = document.querySelector("#group-message");
const groupsCount = document.querySelector("#groups-count");
const groupsList = document.querySelector("#groups-list");
const emptyGroups = document.querySelector("#empty-groups");

const backToGroupsButton = document.querySelector("#back-to-groups-button");
const deleteGroupButton = document.querySelector("#delete-group-button");
const groupSettingsSection = document.querySelector("#group-settings-section");
const scrollToExpenseButton = document.querySelector("#scroll-to-expense-button");
const groupDetailTitle = document.querySelector("#group-detail-title");
const groupDetailTotal = document.querySelector("#group-detail-total");
const groupDetailRole = document.querySelector("#group-detail-role");
const membersCount = document.querySelector("#members-count");
const membersList = document.querySelector("#members-list");
const inviteForm = document.querySelector("#invite-form");
const inviteEmailInput = document.querySelector("#invite-email");
const inviteMessage = document.querySelector("#invite-message");
const inviteSubmitButton = document.querySelector("#invite-submit-button");
const groupInviteCount = document.querySelector("#group-invite-count");
const groupInviteList = document.querySelector("#group-invite-list");
const emptyGroupInvites = document.querySelector("#empty-group-invites");

const expenseForm = document.querySelector("#expense-form");
const expenseFormTitle = document.querySelector("#expense-form-title");
const expenseTitleInput = document.querySelector("#expense-title");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseDateInput = document.querySelector("#expense-date");
const expenseCategoryInput = document.querySelector("#expense-category");
const payerSplitList = document.querySelector("#payer-split-list");
const payerTotalLabel = document.querySelector("#payer-total-label");
const expenseMessage = document.querySelector("#expense-message");
const expenseSubmitButton = document.querySelector("#expense-submit-button");
const cancelEditExpenseButton = document.querySelector("#cancel-edit-expense-button");
const groupExpenseCount = document.querySelector("#group-expense-count");
const groupExpenseList = document.querySelector("#group-expense-list");
const emptyGroupExpenses = document.querySelector("#empty-group-expenses");
const settlementSummaryList = document.querySelector("#settlement-summary-list");
const settlementPaymentList = document.querySelector("#settlement-payment-list");
const emptySettlementSummary = document.querySelector("#empty-settlement-summary");
const emptySettlementPayments = document.querySelector("#empty-settlement-payments");
const settlementMessage = document.querySelector("#settlement-message");
const reportGroupFilter = document.querySelector("#report-group-filter");
const reportPeriodFilter = document.querySelector("#report-period-filter");
const reportTotalSpend = document.querySelector("#report-total-spend");
const reportExpenseCount = document.querySelector("#report-expense-count");
const reportTopCategory = document.querySelector("#report-top-category");
const reportCategoryChart = document.querySelector("#report-category-chart");
const reportGroupChart = document.querySelector("#report-group-chart");
const reportTrendList = document.querySelector("#report-trend-list");
const reportInsightsList = document.querySelector("#report-insights-list");
const reportMonthChart = document.querySelector("#report-month-chart");
const emptyReportCategory = document.querySelector("#empty-report-category");
const emptyReportGroup = document.querySelector("#empty-report-group");
const emptyReportTrend = document.querySelector("#empty-report-trend");
const emptyReportInsights = document.querySelector("#empty-report-insights");
const emptyReportMonth = document.querySelector("#empty-report-month");

let authMode = "login";
let resetMode = "request";
let selectedGroupId = null;
let selectedExpenseId = null;
let reportFilters = {
  groupId: "all",
  period: "90",
};
let data = loadData();

function loadData() {
  const storedData = localStorage.getItem(storageKey);

  if (!storedData) {
    return createEmptyData();
  }

  try {
    return normalizeData(JSON.parse(storedData));
  } catch {
    return createEmptyData();
  }
}

function createEmptyData() {
  return {
    currentUserId: null,
    users: [],
    groups: [],
    groupMembers: [],
    expenses: [],
    expensePayers: [],
    groupInvites: [],
    groupSettlements: [],
  };
}

function normalizeData(savedData) {
  const savedUsers = Array.isArray(savedData.users) ? savedData.users : [];

  return {
    currentUserId: savedData.currentUserId || null,
    users: savedUsers
      .map((user) => ({
        id: user.id,
        email: user.email || "",
        displayName: user.displayName || user.email?.split("@")[0] || "Your profile",
        createdAt: user.createdAt || new Date().toISOString(),
      }))
      .filter((user) => user.id),
    groups: Array.isArray(savedData.groups) ? savedData.groups : [],
    groupMembers: Array.isArray(savedData.groupMembers) ? savedData.groupMembers : [],
    expenses: Array.isArray(savedData.expenses) ? savedData.expenses : [],
    expensePayers: Array.isArray(savedData.expensePayers) ? savedData.expensePayers : [],
    groupInvites: Array.isArray(savedData.groupInvites) ? savedData.groupInvites : [],
    groupSettlements: Array.isArray(savedData.groupSettlements) ? savedData.groupSettlements : [],
  };
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function fromCents(cents) {
  return cents / 100;
}

function formatCount(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${month}/${day}/${year}`;
}

function getCurrentUser() {
  return data.users.find((user) => user.id === data.currentUserId) || null;
}

function getDisplayNameFromSupabaseUser(user, fallbackName = "") {
  return (
    fallbackName ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Your profile"
  );
}

function syncLocalProfile(user, displayName = "") {
  if (!user) {
    return null;
  }

  const profile = {
    id: user.id,
    displayName: getDisplayNameFromSupabaseUser(user, displayName),
    email: user.email || "",
    createdAt: user.created_at || new Date().toISOString(),
  };
  const existingIndex = data.users.findIndex((savedUser) => savedUser.id === user.id);

  if (existingIndex >= 0) {
    data.users[existingIndex] = {
      ...data.users[existingIndex],
      ...profile,
    };
  } else {
    data.users.push(profile);
  }

  data.currentUserId = user.id;
  saveData();

  return profile;
}

async function ensureRemoteProfile(user, displayName = "") {
  if (!supabaseClient || !user) {
    return;
  }

  const profile = syncLocalProfile(user, displayName);

  await supabaseClient.from("profiles").upsert(
    {
      id: user.id,
      email: profile.email,
      display_name: profile.displayName,
    },
    { onConflict: "id" },
  );
}

function mapRemoteProfile(profile) {
  return {
    id: profile.id,
    email: profile.email || "",
    displayName: profile.display_name || profile.email?.split("@")[0] || "Your profile",
    createdAt: profile.created_at || new Date().toISOString(),
  };
}

function mapRemoteGroup(group) {
  return {
    id: group.id,
    name: group.name,
    createdBy: group.created_by,
    createdAt: group.created_at,
    updatedAt: group.updated_at,
  };
}

function mapRemoteMember(member) {
  return {
    id: member.id,
    groupId: member.group_id,
    userId: member.user_id,
    role: member.role,
    createdAt: member.created_at,
  };
}

function mapRemoteExpense(expense) {
  return {
    id: expense.id,
    groupId: expense.group_id,
    createdBy: expense.created_by,
    paidBy: expense.paid_by,
    title: expense.title,
    amount: Number(expense.amount),
    category: expense.category,
    expenseDate: expense.expense_date,
    notes: expense.notes || "",
    createdAt: expense.created_at,
    updatedAt: expense.updated_at,
  };
}

function mapRemoteExpensePayer(expensePayer) {
  return {
    id: expensePayer.id,
    expenseId: expensePayer.expense_id,
    userId: expensePayer.user_id,
    percent: Number(expensePayer.percent),
    createdAt: expensePayer.created_at,
  };
}

function mapRemoteInvite(invite) {
  return {
    id: invite.id,
    groupId: invite.group_id,
    invitedEmail: invite.invited_email || "",
    invitedBy: invite.invited_by,
    status: invite.status,
    token: invite.token,
    expiresAt: invite.expires_at,
    createdAt: invite.created_at,
    acceptedAt: invite.accepted_at,
  };
}

function mapRemoteSettlement(settlement) {
  return {
    id: settlement.id,
    groupId: settlement.group_id,
    fromUser: settlement.from_user,
    toUser: settlement.to_user,
    amount: Number(settlement.amount),
    createdBy: settlement.created_by,
    settledAt: settlement.settled_at,
    createdAt: settlement.created_at,
  };
}

function replaceLocalProfiles(profiles) {
  const profileMap = new Map(data.users.map((user) => [user.id, user]));

  profiles.forEach((profile) => {
    profileMap.set(profile.id, profile);
  });

  data.users = Array.from(profileMap.values());
}

function getRemoteProfileIds() {
  return Array.from(
    new Set([
      data.currentUserId,
      ...data.groupMembers.map((member) => member.userId),
      ...data.expenses.map((expense) => expense.createdBy),
      ...data.expenses.map((expense) => expense.paidBy),
      ...data.expensePayers.map((payer) => payer.userId),
      ...data.groupInvites.map((invite) => invite.invitedBy),
      ...data.groupSettlements.map((settlement) => settlement.fromUser),
      ...data.groupSettlements.map((settlement) => settlement.toUser),
      ...data.groupSettlements.map((settlement) => settlement.createdBy),
    ].filter(Boolean)),
  );
}

function getMigrationKey(userId) {
  return `splituation-remote-migrated-${userId}`;
}

async function migrateLocalDataToSupabase() {
  if (!supabaseClient || !data.currentUserId || localStorage.getItem(getMigrationKey(data.currentUserId))) {
    return;
  }

  const localGroups = getMyGroups().filter((group) => !group.id.match(/^[0-9a-f-]{36}$/i));
  const groupIdMap = new Map();

  for (const localGroup of localGroups) {
    const { data: remoteGroup, error: groupError } = await supabaseClient
      .from("groups")
      .insert({
        name: localGroup.name,
        created_by: data.currentUserId,
      })
      .select()
      .single();

    if (groupError) {
      throw groupError;
    }

    const { error: memberError } = await supabaseClient.from("group_members").insert({
      group_id: remoteGroup.id,
      user_id: data.currentUserId,
      role: "owner",
    });

    if (memberError) {
      throw memberError;
    }

    groupIdMap.set(localGroup.id, remoteGroup.id);
  }

  const localExpenses = data.expenses.filter((expense) => groupIdMap.has(expense.groupId));

  for (const localExpense of localExpenses) {
    const { data: remoteExpense, error } = await supabaseClient
      .from("expenses")
      .insert({
        group_id: groupIdMap.get(localExpense.groupId),
        created_by: data.currentUserId,
        paid_by: data.currentUserId,
        title: localExpense.title,
        amount: localExpense.amount,
        category: localExpense.category,
        expense_date: localExpense.expenseDate,
        notes: localExpense.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabaseClient.from("expense_payers").insert({
      expense_id: remoteExpense.id,
      user_id: data.currentUserId,
      percent: 100,
    });
  }

  localStorage.setItem(getMigrationKey(data.currentUserId), "true");
}

async function loadRemoteAppData() {
  if (!supabaseClient || !data.currentUserId) {
    return;
  }

  const [groupsResult, membersResult, expensesResult, expensePayersResult, invitesResult, settlementsResult] = await Promise.all([
    supabaseClient.from("groups").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("group_members").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("expenses").select("*").order("expense_date", { ascending: false }),
    supabaseClient.from("expense_payers").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("group_invites").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("group_settlements").select("*").order("settled_at", { ascending: false }),
  ]);

  if (groupsResult.error) {
    throw groupsResult.error;
  }

  if (membersResult.error) {
    throw membersResult.error;
  }

  if (expensesResult.error) {
    throw expensesResult.error;
  }

  if (expensePayersResult.error && !expensePayersResult.error.message?.includes("expense_payers")) {
    throw expensePayersResult.error;
  }

  if (invitesResult.error) {
    throw invitesResult.error;
  }

  if (settlementsResult.error && !settlementsResult.error.message?.includes("group_settlements")) {
    throw settlementsResult.error;
  }

  data.groups = groupsResult.data.map(mapRemoteGroup);
  data.groupMembers = membersResult.data.map(mapRemoteMember);
  data.expenses = expensesResult.data.map(mapRemoteExpense);
  data.expensePayers = expensePayersResult.error ? [] : expensePayersResult.data.map(mapRemoteExpensePayer);
  data.groupInvites = invitesResult.data.map(mapRemoteInvite);
  data.groupSettlements = settlementsResult.error ? [] : settlementsResult.data.map(mapRemoteSettlement);

  const profileIds = getRemoteProfileIds();

  if (profileIds.length > 0) {
    const profilesResult = await supabaseClient
      .from("profiles")
      .select("id, email, display_name, created_at")
      .in("id", profileIds);

    if (profilesResult.error) {
      throw profilesResult.error;
    }

    replaceLocalProfiles(profilesResult.data.map(mapRemoteProfile));
  }

  saveData();
}

function getUserName(userId) {
  return data.users.find((user) => user.id === userId)?.displayName || "Unknown";
}

function getMyMemberships() {
  return data.groupMembers.filter((member) => member.userId === data.currentUserId);
}

function getMyGroups() {
  const groupIds = new Set(getMyMemberships().map((member) => member.groupId));
  return data.groups.filter((group) => groupIds.has(group.id));
}

function getPendingInvitesForCurrentUser() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return [];
  }

  return data.groupInvites.filter(
    (invite) => invite.status === "pending" && normalizeEmail(invite.invitedEmail) === normalizeEmail(currentUser.email),
  );
}

function getMyGroup(groupId) {
  return getMyGroups().find((group) => group.id === groupId) || null;
}

function getPendingInvitesForGroup(groupId) {
  return data.groupInvites.filter((invite) => invite.groupId === groupId && invite.status === "pending");
}

function getGroupMembers(groupId) {
  return data.groupMembers
    .filter((member) => member.groupId === groupId)
    .map((member) => ({
      ...member,
      user: data.users.find((user) => user.id === member.userId),
    }))
    .filter((member) => member.user);
}

function getGroupExpenses(groupId) {
  return data.expenses
    .filter((expense) => expense.groupId === groupId)
    .sort(sortExpensesNewestFirst);
}

function getExpensePayers(expenseId) {
  const payers = data.expensePayers.filter((payer) => payer.expenseId === expenseId);

  if (payers.length > 0) {
    return payers;
  }

  const expense = data.expenses.find((savedExpense) => savedExpense.id === expenseId);

  if (!expense?.paidBy) {
    return [];
  }

  return [
    {
      expenseId,
      userId: expense.paidBy,
      percent: 100,
    },
  ];
}

function getExpensePayerContributions(expense) {
  const payers = getExpensePayers(expense.id);
  const totalCents = toCents(expense.amount);
  let assignedCents = 0;

  return payers.map((payer, index) => {
    const isLastPayer = index === payers.length - 1;
    const amountCents = isLastPayer ? totalCents - assignedCents : Math.round((totalCents * payer.percent) / 100);

    assignedCents += amountCents;

    return {
      userId: payer.userId,
      percent: payer.percent,
      amountCents,
    };
  });
}

function getExpensePayerLabel(expense) {
  const payers = getExpensePayers(expense.id);

  if (payers.length === 0) {
    return "Paid by Unknown";
  }

  if (payers.length === 1 && Math.round(payers[0].percent) === 100) {
    return `Paid by ${getUserName(payers[0].userId)}`;
  }

  const payerLabels = payers
    .map((payer) => `${getUserName(payer.userId)} ${Number(payer.percent).toFixed(payer.percent % 1 === 0 ? 0 : 2)}%`)
    .join(", ");

  return `Paid by ${payerLabels}`;
}

function getGroupSettlements(groupId) {
  return data.groupSettlements
    .filter((settlement) => settlement.groupId === groupId)
    .sort((first, second) => (second.settledAt || "").localeCompare(first.settledAt || ""));
}

function getMyExpenses() {
  const groupIds = new Set(getMyGroups().map((group) => group.id));
  return data.expenses.filter((expense) => groupIds.has(expense.groupId)).sort(sortExpensesNewestFirst);
}

function getGroupTotal(groupId) {
  return getGroupExpenses(groupId).reduce((total, expense) => total + expense.amount, 0);
}

function getSettleUpSummary(groupId) {
  const members = getGroupMembers(groupId);
  const memberIds = members.map((member) => member.userId);
  const paidByMember = new Map(memberIds.map((userId) => [userId, 0]));
  const shareByMember = new Map(memberIds.map((userId) => [userId, 0]));
  const balanceByMember = new Map(memberIds.map((userId) => [userId, 0]));
  const groupExpenses = getGroupExpenses(groupId);
  const groupSettlements = getGroupSettlements(groupId);
  const totalCents = groupExpenses.reduce((sum, expense) => sum + toCents(expense.amount), 0);

  groupExpenses.forEach((expense) => {
    getExpensePayerContributions(expense).forEach((payer) => {
      if (!paidByMember.has(payer.userId)) {
        return;
      }

      paidByMember.set(payer.userId, paidByMember.get(payer.userId) + payer.amountCents);
    });
  });

  if (members.length > 0) {
    const baseShare = Math.floor(totalCents / members.length);
    const remainder = totalCents % members.length;

    members.forEach((member, index) => {
      shareByMember.set(member.userId, baseShare + (index < remainder ? 1 : 0));
    });
  }

  members.forEach((member) => {
    balanceByMember.set(member.userId, paidByMember.get(member.userId) - shareByMember.get(member.userId));
  });

  groupSettlements.forEach((settlement) => {
    const amountCents = toCents(settlement.amount);

    if (balanceByMember.has(settlement.fromUser)) {
      balanceByMember.set(settlement.fromUser, balanceByMember.get(settlement.fromUser) + amountCents);
    }

    if (balanceByMember.has(settlement.toUser)) {
      balanceByMember.set(settlement.toUser, balanceByMember.get(settlement.toUser) - amountCents);
    }
  });

  const rows = members.map((member) => ({
    userId: member.userId,
    name: member.user.displayName,
    paidCents: paidByMember.get(member.userId),
    shareCents: shareByMember.get(member.userId),
    balanceCents: balanceByMember.get(member.userId),
  }));
  const creditors = rows
    .filter((row) => row.balanceCents > 0)
    .map((row) => ({ ...row, remainingCents: row.balanceCents }))
    .sort((first, second) => second.remainingCents - first.remainingCents);
  const debtors = rows
    .filter((row) => row.balanceCents < 0)
    .map((row) => ({ ...row, remainingCents: Math.abs(row.balanceCents) }))
    .sort((first, second) => second.remainingCents - first.remainingCents);
  const payments = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amountCents = Math.min(creditor.remainingCents, debtor.remainingCents);

    if (amountCents > 0) {
      payments.push({
        fromUser: debtor.userId,
        fromName: debtor.name,
        toUser: creditor.userId,
        toName: creditor.name,
        amountCents,
      });
    }

    creditor.remainingCents -= amountCents;
    debtor.remainingCents -= amountCents;

    if (creditor.remainingCents === 0) {
      creditorIndex += 1;
    }

    if (debtor.remainingCents === 0) {
      debtorIndex += 1;
    }
  }

  return { rows, payments, totalCents, settlementCount: groupSettlements.length };
}

function sortExpensesNewestFirst(firstExpense, secondExpense) {
  const firstDate = `${firstExpense.expenseDate || ""}-${firstExpense.createdAt || ""}`;
  const secondDate = `${secondExpense.expenseDate || ""}-${secondExpense.createdAt || ""}`;
  return secondDate.localeCompare(firstDate);
}

function getCutoffDate(period) {
  if (period === "all") {
    return null;
  }

  const days = Number(period);

  if (!Number.isFinite(days)) {
    return null;
  }

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days + 1);
  return date;
}

function getMonthWindow(monthOffset) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

  return { start, end };
}

function isExpenseInWindow(expense, window) {
  const expenseDate = new Date(`${expense.expenseDate}T00:00:00`);
  return expenseDate >= window.start && expenseDate < window.end;
}

function getReportExpenses() {
  const allMyExpenses = getMyExpenses();
  const cutoffDate = getCutoffDate(reportFilters.period);

  return allMyExpenses.filter((expense) => {
    if (reportFilters.groupId !== "all" && expense.groupId !== reportFilters.groupId) {
      return false;
    }

    if (!cutoffDate) {
      return true;
    }

    const expenseDate = new Date(`${expense.expenseDate}T00:00:00`);
    return expenseDate >= cutoffDate;
  });
}

function getReportExpensesForMonth(monthOffset) {
  const monthWindow = getMonthWindow(monthOffset);

  return getMyExpenses().filter((expense) => {
    if (reportFilters.groupId !== "all" && expense.groupId !== reportFilters.groupId) {
      return false;
    }

    return isExpenseInWindow(expense, monthWindow);
  });
}

function aggregateByKey(expenses, keyGetter) {
  const totals = new Map();

  expenses.forEach((expense) => {
    const key = keyGetter(expense);
    const current = totals.get(key) || 0;
    totals.set(key, current + expense.amount);
  });

  return Array.from(totals.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((first, second) => second.amount - first.amount);
}

function renderBarList(targetList, dataPoints, maxAmount) {
  targetList.innerHTML = "";

  dataPoints.forEach((point) => {
    const item = document.createElement("li");
    const row = document.createElement("div");
    const strong = document.createElement("strong");
    const value = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("div");

    item.className = "chart-item";
    row.className = "chart-label-row";
    track.className = "bar-track";
    fill.className = "bar-fill";

    strong.textContent = point.label;
    value.textContent = formatCurrency(point.amount);
    fill.style.width = `${maxAmount > 0 ? (point.amount / maxAmount) * 100 : 0}%`;

    row.append(strong, value);
    track.append(fill);
    item.append(row, track);
    targetList.appendChild(item);
  });
}

function renderMonthComparison(currentMonthTotal, previousMonthTotal) {
  const maxAmount = Math.max(currentMonthTotal, previousMonthTotal);
  const monthRows = [
    { label: "This month", amount: currentMonthTotal },
    { label: "Last month", amount: previousMonthTotal, muted: true },
  ];

  reportMonthChart.innerHTML = "";
  emptyReportMonth.classList.toggle("hidden", maxAmount > 0);

  monthRows.forEach((row) => {
    const item = document.createElement("li");
    const labelRow = document.createElement("div");
    const label = document.createElement("strong");
    const value = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("div");

    item.className = "chart-item";
    labelRow.className = "chart-label-row";
    track.className = "bar-track";
    fill.className = row.muted ? "bar-fill bar-fill-muted" : "bar-fill";

    label.textContent = row.label;
    value.textContent = formatCurrency(row.amount);
    fill.style.width = `${maxAmount > 0 ? (row.amount / maxAmount) * 100 : 0}%`;

    labelRow.append(label, value);
    track.append(fill);
    item.append(labelRow, track);
    reportMonthChart.appendChild(item);
  });
}

function renderTrendList(expenses) {
  const totalsByMonth = new Map();

  expenses.forEach((expense) => {
    const monthKey = expense.expenseDate.slice(0, 7);
    const current = totalsByMonth.get(monthKey) || 0;
    totalsByMonth.set(monthKey, current + expense.amount);
  });

  const monthRows = Array.from(totalsByMonth.entries())
    .sort((first, second) => second[0].localeCompare(first[0]))
    .slice(0, 6);

  reportTrendList.innerHTML = "";
  emptyReportTrend.classList.toggle("hidden", monthRows.length > 0);

  monthRows.forEach(([monthKey, amount]) => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    const value = document.createElement("p");
    const [year, month] = monthKey.split("-");

    label.textContent = `${month}/${year}`;
    value.textContent = formatCurrency(amount);
    item.append(label, value);
    reportTrendList.appendChild(item);
  });
}

function createInsight(title, detail) {
  const item = document.createElement("li");
  const strong = document.createElement("strong");
  const paragraph = document.createElement("p");

  item.className = "insight-card";
  strong.textContent = title;
  paragraph.textContent = detail;
  item.append(strong, paragraph);

  return item;
}

function getMonthComparisonInsight(currentTotal, previousTotal) {
  if (currentTotal === 0 && previousTotal === 0) {
    return {
      title: "No monthly spending yet",
      detail: "Add expenses this month and last month to see a comparison.",
    };
  }

  if (previousTotal === 0) {
    return {
      title: "Spending started this month",
      detail: `You have logged ${formatCurrency(currentTotal)} this month and nothing last month.`,
    };
  }

  const difference = currentTotal - previousTotal;
  const percent = Math.abs((difference / previousTotal) * 100).toFixed(0);

  if (difference > 0) {
    return {
      title: `Up ${percent}% vs last month`,
      detail: `This month is ${formatCurrency(difference)} higher than last month.`,
    };
  }

  if (difference < 0) {
    return {
      title: `Down ${percent}% vs last month`,
      detail: `This month is ${formatCurrency(Math.abs(difference))} lower than last month.`,
    };
  }

  return {
    title: "Flat vs last month",
    detail: "Your spending is the same as last month so far.",
  };
}

function renderInsights(expenses, categoryTotals, groupTotals, currentMonthTotal, previousMonthTotal) {
  const insights = [getMonthComparisonInsight(currentMonthTotal, previousMonthTotal)];

  if (categoryTotals.length > 0) {
    const topCategory = categoryTotals[0];
    insights.push({
      title: `${topCategory.label} is your top category`,
      detail: `${formatCurrency(topCategory.amount)} of the selected spending is in ${topCategory.label.toLowerCase()}.`,
    });
  }

  if (groupTotals.length > 0 && reportFilters.groupId === "all") {
    const topGroup = groupTotals[0];
    insights.push({
      title: `${topGroup.label} is the highest group`,
      detail: `${formatCurrency(topGroup.amount)} has been logged in this group for the selected range.`,
    });
  }

  if (expenses.length > 0) {
    const average = expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length;
    insights.push({
      title: `${formatCurrency(average)} average expense`,
      detail: `This is the average across ${formatCount(expenses.length, "expense", "expenses")} in the selected range.`,
    });
  }

  reportInsightsList.innerHTML = "";
  emptyReportInsights.classList.toggle("hidden", insights.length > 0);

  insights.forEach((insight) => {
    reportInsightsList.appendChild(createInsight(insight.title, insight.detail));
  });
}

function syncReportGroupFilter() {
  const myGroups = getMyGroups();
  const previous = reportFilters.groupId;
  const validGroupIds = new Set(myGroups.map((group) => group.id));

  if (previous !== "all" && !validGroupIds.has(previous)) {
    reportFilters.groupId = "all";
  }

  reportGroupFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All groups";
  reportGroupFilter.appendChild(allOption);

  myGroups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    reportGroupFilter.appendChild(option);
  });

  reportGroupFilter.value = reportFilters.groupId;
}

function renderReports() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  syncReportGroupFilter();
  reportPeriodFilter.value = reportFilters.period;

  const expenses = getReportExpenses();
  const currentMonthExpenses = getReportExpensesForMonth(0);
  const previousMonthExpenses = getReportExpensesForMonth(-1);
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = aggregateByKey(expenses, (expense) => expense.category);
  const groupTotals = aggregateByKey(expenses, (expense) => getMyGroup(expense.groupId)?.name || "Group");
  const topCategory = categoryTotals[0]?.label || "None";
  const maxCategory = categoryTotals[0]?.amount || 0;
  const maxGroup = groupTotals[0]?.amount || 0;

  reportTotalSpend.textContent = formatCurrency(total);
  reportExpenseCount.textContent = String(expenses.length);
  reportTopCategory.textContent = topCategory;

  emptyReportCategory.classList.toggle("hidden", categoryTotals.length > 0);
  emptyReportGroup.classList.toggle("hidden", groupTotals.length > 0);

  renderBarList(reportCategoryChart, categoryTotals, maxCategory);
  renderBarList(reportGroupChart, groupTotals, maxGroup);
  renderMonthComparison(currentMonthTotal, previousMonthTotal);
  renderInsights(expenses, categoryTotals, groupTotals, currentMonthTotal, previousMonthTotal);
  renderTrendList(expenses);
}

function showScreen(screenName) {
  if (screenName !== "auth" && !getCurrentUser()) {
    screenName = "auth";
  }

  const screenMap = {
    auth: authScreen,
    home: homeScreen,
    groups: groupsScreen,
    reports: reportsScreen,
    detail: groupDetailScreen,
  };

  screens.forEach((screen) => {
    screen.classList.toggle("screen-active", screen === screenMap[screenName]);
  });
}

function setAuthMode(nextMode) {
  authMode = nextMode;
  const isSignup = authMode === "signup";

  nameField.classList.toggle("hidden", !isSignup);
  displayNameInput.required = isSignup;
  displayNameInput.value = isSignup ? displayNameInput.value : "";
  authSubmitButton.textContent = isSignup ? "Create account" : "Log in";
  loginModeButton.classList.toggle("mode-button-active", !isSignup);
  signupModeButton.classList.toggle("mode-button-active", isSignup);
  authHelp.textContent = isSignup
    ? "After signing up, check your email. If the confirmation page opens somewhere else, come back here and log in."
    : "After confirming your email, return here and log in.";
  authMessage.classList.remove("success-message");
  authMessage.textContent = "";
}

function showSessionMessage(message) {
  if (!message) {
    sessionMessage.classList.add("hidden");
    sessionMessage.textContent = "";
    return;
  }

  sessionMessage.textContent = message;
  sessionMessage.classList.remove("hidden");
}

function showAuthForm() {
  resetForm.classList.add("hidden");
  authForm.classList.remove("hidden");
  resetMessage.textContent = "";
  resetMessage.classList.remove("success-message");
  resetForm.reset();
}

function showResetForm(nextResetMode = "request", email = "") {
  resetMode = nextResetMode;
  authForm.classList.add("hidden");
  resetForm.classList.remove("hidden");
  resetMessage.textContent = "";
  resetMessage.classList.remove("success-message");

  const isUpdate = resetMode === "update";

  resetTitle.textContent = isUpdate ? "Set New Password" : "Reset Password";
  resetEmailField.classList.toggle("hidden", isUpdate);
  resetEmailInput.required = !isUpdate;
  resetEmailInput.value = email;
  newPasswordField.classList.toggle("hidden", !isUpdate);
  newPasswordInput.required = isUpdate;
  resetHelp.textContent = isUpdate
    ? "Enter a new password for your account."
    : "Enter your email and we will send a password reset link.";
  resetSubmitButton.textContent = isUpdate ? "Update password" : "Send reset link";
}

function getAuthReturnMessage() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const authType = hashParams.get("type") || queryParams.get("type");
  const errorDescription = hashParams.get("error_description") || queryParams.get("error_description");

  if (errorDescription) {
    return { kind: "error", message: errorDescription.replace(/\+/g, " ") };
  }

  if (authType === "signup" || authType === "email") {
    return { kind: "success", message: "Email confirmed. You are signed in." };
  }

  if (authType === "recovery") {
    return { kind: "recovery", message: "Choose a new password." };
  }

  return null;
}

async function handleAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");

  if (!code || !supabaseClient) {
    return null;
  }

  const { data: callbackData, error } = await supabaseClient.auth.exchangeCodeForSession(code);

  if (error) {
    return { kind: "error", message: error.message };
  }

  if (callbackData.session?.user) {
    const queryParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const authType = queryParams.get("type") || hashParams.get("type");

    if (authType === "recovery") {
      return { kind: "recovery", message: "Choose a new password." };
    }

    return { kind: "success", message: "Email confirmed. You are signed in." };
  }

  return null;
}

function renderApp() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    showScreen("auth");
    return;
  }

  profileName.textContent = currentUser.displayName;
  profileEmail.textContent = currentUser.email;
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  showScreen("home");
}

function renderGroups() {
  const myGroups = getMyGroups();
  const countLabel = formatCount(myGroups.length, "group", "groups");

  homeGroupCount.textContent = countLabel;
  groupsCount.textContent = countLabel;
  emptyHome.classList.toggle("hidden", myGroups.length > 0);
  emptyGroups.classList.toggle("hidden", myGroups.length > 0);

  homeGroupList.innerHTML = "";
  groupsList.innerHTML = "";

  myGroups.forEach((group) => {
    homeGroupList.appendChild(createGroupListItem(group));
    groupsList.appendChild(createGroupListItem(group));
  });
}

function createGroupListItem(group) {
  const memberCount = getGroupMembers(group.id).length;
  const groupTotal = getGroupTotal(group.id);
  const item = document.createElement("li");
  const details = document.createElement("div");
  const title = document.createElement("strong");
  const subtitle = document.createElement("span");
  const openButton = document.createElement("button");

  title.textContent = group.name;
  subtitle.textContent = `${formatCurrency(groupTotal)} total | ${formatCount(memberCount, "member", "members")}`;
  openButton.className = "open-group-button";
  openButton.type = "button";
  openButton.textContent = "Open";
  openButton.addEventListener("click", () => openGroupDetail(group.id));

  details.append(title, subtitle);
  item.append(details, openButton);

  return item;
}

function renderRecentExpenses() {
  const recentExpenses = getMyExpenses().slice(0, 5);

  recentExpenseCount.textContent = formatCount(recentExpenses.length, "expense", "expenses");
  emptyRecentExpenses.classList.toggle("hidden", recentExpenses.length > 0);
  recentExpenseList.innerHTML = "";

  recentExpenses.forEach((expense) => {
    const group = data.groups.find((savedGroup) => savedGroup.id === expense.groupId);
    const item = document.createElement("li");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const subtitle = document.createElement("span");
    const amount = document.createElement("p");

    title.textContent = expense.title;
    subtitle.textContent = `${group?.name || "Group"} | ${expense.category} | ${formatDate(expense.expenseDate)}`;
    amount.textContent = formatCurrency(expense.amount);

    details.append(title, subtitle);
    item.append(details, amount);
    recentExpenseList.appendChild(item);
  });
}

function renderPendingInvites() {
  const pendingInvites = getPendingInvitesForCurrentUser();

  pendingInviteCount.textContent = formatCount(pendingInvites.length, "invite", "invites");
  emptyPendingInvites.classList.toggle("hidden", pendingInvites.length > 0);
  pendingInviteList.innerHTML = "";

  pendingInvites.forEach((invite) => {
    const inviterName = getUserName(invite.invitedBy);
    const item = document.createElement("li");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const subtitle = document.createElement("span");
    const actions = document.createElement("div");
    const acceptButton = document.createElement("button");

    item.className = "invite-card";
    actions.className = "invite-actions";
    title.textContent = "Group invite";
    subtitle.textContent = `Invited by ${inviterName}`;
    acceptButton.type = "button";
    acceptButton.textContent = "Accept invite";
    acceptButton.addEventListener("click", async () => {
      try {
        await acceptInvite(invite.id);
      } catch (error) {
        window.alert(error.message || "Could not accept the invite. Please try again.");
      }
    });

    details.append(title, subtitle);
    actions.append(acceptButton);
    item.append(details, actions);
    pendingInviteList.appendChild(item);
  });
}

function openGroupDetail(groupId) {
  const group = getMyGroup(groupId);

  if (!group) {
    selectedGroupId = null;
    showScreen("groups");
    return;
  }

  selectedGroupId = groupId;
  resetExpenseForm();
  settlementMessage.textContent = "";
  settlementMessage.classList.remove("success-message");
  renderGroupDetail();
  showScreen("detail");
}

function renderGroupDetail() {
  const group = getMyGroup(selectedGroupId);

  if (!group) {
    showScreen("groups");
    return;
  }

  const currentMembership = data.groupMembers.find(
    (member) => member.groupId === group.id && member.userId === data.currentUserId,
  );
  const isOwner = currentMembership?.role === "owner";
  const members = getGroupMembers(group.id);
  const groupExpenses = getGroupExpenses(group.id);
  const pendingInvites = getPendingInvitesForGroup(group.id);

  groupDetailTitle.textContent = group.name;
  groupDetailTotal.textContent = formatCurrency(getGroupTotal(group.id));
  groupDetailRole.textContent = isOwner ? "Owner" : "Member";
  groupSettingsSection.classList.toggle("hidden", !isOwner);
  membersCount.textContent = formatCount(members.length, "member", "members");
  groupInviteCount.textContent = `${pendingInvites.length} pending`;
  groupExpenseCount.textContent = formatCount(groupExpenses.length, "expense", "expenses");
  emptyGroupExpenses.classList.toggle("hidden", groupExpenses.length > 0);
  emptyGroupInvites.classList.toggle("hidden", pendingInvites.length > 0);

  membersList.innerHTML = "";
  groupInviteList.innerHTML = "";
  groupExpenseList.innerHTML = "";
  settlementSummaryList.innerHTML = "";
  settlementPaymentList.innerHTML = "";

  members.forEach((member) => {
    const item = document.createElement("li");
    const details = document.createElement("div");
    const name = document.createElement("strong");
    const email = document.createElement("span");
    const role = document.createElement("span");

    name.textContent = member.user.displayName;
    email.textContent = member.user.email;
    role.textContent = member.role;

    details.append(name, email);
    item.append(details, role);
    membersList.appendChild(item);
  });

  pendingInvites.forEach((invite) => {
    groupInviteList.appendChild(createGroupInviteListItem(invite));
  });

  groupExpenses.forEach((expense) => {
    groupExpenseList.appendChild(createExpenseListItem(expense));
  });

  renderSettleUp(group.id);
}

function renderSettleUp(groupId) {
  const summary = getSettleUpSummary(groupId);
  const hasExpenses = summary.totalCents > 0;

  emptySettlementSummary.classList.toggle("hidden", hasExpenses);
  settlementSummaryList.classList.toggle("hidden", !hasExpenses);
  emptySettlementPayments.classList.toggle("hidden", !hasExpenses || summary.payments.length > 0);
  settlementPaymentList.classList.toggle("hidden", !hasExpenses || summary.payments.length === 0);

  if (!hasExpenses) {
    return;
  }

  summary.rows.forEach((row) => {
    settlementSummaryList.appendChild(createSettlementSummaryItem(row));
  });

  summary.payments.forEach((payment) => {
    settlementPaymentList.appendChild(createSettlementPaymentItem(payment));
  });
}

function createSettlementSummaryItem(row) {
  const item = document.createElement("li");
  const details = document.createElement("div");
  const name = document.createElement("strong");
  const meta = document.createElement("span");
  const balance = document.createElement("p");

  item.className = "settlement-card";
  balance.className = row.balanceCents > 0 ? "settlement-positive" : row.balanceCents < 0 ? "settlement-negative" : "";
  name.textContent = row.name;
  meta.textContent = `Paid ${formatCurrency(fromCents(row.paidCents))} | Share ${formatCurrency(fromCents(row.shareCents))}`;

  if (row.balanceCents > 0) {
    balance.textContent = `Owed ${formatCurrency(fromCents(row.balanceCents))}`;
  } else if (row.balanceCents < 0) {
    balance.textContent = `Owes ${formatCurrency(fromCents(Math.abs(row.balanceCents)))}`;
  } else {
    balance.textContent = "Settled";
  }

  details.append(name, meta);
  item.append(details, balance);

  return item;
}

function createSettlementPaymentItem(payment) {
  const item = document.createElement("li");
  const details = document.createElement("div");
  const title = document.createElement("strong");
  const subtitle = document.createElement("span");
  const actions = document.createElement("div");

  item.className = "settlement-card settlement-payment-card";
  actions.className = "settlement-actions";
  title.textContent = `${payment.fromName} pays ${payment.toName}`;
  subtitle.textContent = formatCurrency(fromCents(payment.amountCents));

  if (payment.toUser === data.currentUserId) {
    const paidButton = document.createElement("button");

    paidButton.type = "button";
    paidButton.textContent = "I've been paid";
    paidButton.addEventListener("click", async () => {
      paidButton.disabled = true;
      paidButton.textContent = "Saving...";

      try {
        await recordSettlement(payment);
      } catch (error) {
        paidButton.disabled = false;
        paidButton.textContent = "I've been paid";
        settlementMessage.classList.remove("success-message");
        settlementMessage.textContent = error.message || "Could not record the payment. Please try again.";
      }
    });

    actions.append(paidButton);
  } else {
    const note = document.createElement("span");

    note.className = "settlement-note";
    note.textContent =
      payment.fromUser === data.currentUserId
        ? `Pay ${payment.toName}, then they can confirm.`
        : `${payment.toName} can confirm after payment.`;
    actions.append(note);
  }

  details.append(title, subtitle);
  item.append(details, actions);

  return item;
}

function updatePayerTotalLabel() {
  const total = Array.from(payerSplitList.querySelectorAll("input")).reduce((sum, input) => {
    const value = Number(input.value);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  payerTotalLabel.textContent = `${total.toFixed(total % 1 === 0 ? 0 : 2)}%`;
  payerTotalLabel.classList.toggle("payer-total-warning", Math.abs(total - 100) > 0.01);
}

function renderPayerSplitInputs(expense = null) {
  const members = getGroupMembers(selectedGroupId);
  const existingPayers = new Map();

  if (expense) {
    getExpensePayers(expense.id).forEach((payer) => {
      existingPayers.set(payer.userId, payer.percent);
    });
  }

  payerSplitList.innerHTML = "";

  members.forEach((member) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const inputWrap = document.createElement("div");
    const input = document.createElement("input");
    const percentLabel = document.createElement("span");
    const defaultPercent = expense
      ? existingPayers.get(member.userId) || 0
      : member.userId === data.currentUserId
        ? 100
        : 0;

    row.className = "payer-split-row";
    inputWrap.className = "payer-percent-input";
    name.textContent = member.user.displayName;
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.step = "0.01";
    input.inputMode = "decimal";
    input.value = defaultPercent;
    input.dataset.userId = member.userId;
    input.setAttribute("aria-label", `${member.user.displayName} paid percent`);
    percentLabel.textContent = "%";
    input.addEventListener("input", updatePayerTotalLabel);

    inputWrap.append(input, percentLabel);
    row.append(name, inputWrap);
    payerSplitList.appendChild(row);
  });

  updatePayerTotalLabel();
}

function getPayerSplitsFromForm() {
  const payerSplits = Array.from(payerSplitList.querySelectorAll("input"))
    .map((input) => ({
      userId: input.dataset.userId,
      percent: Number(input.value),
    }))
    .filter((payer) => Number.isFinite(payer.percent) && payer.percent > 0);
  const total = payerSplits.reduce((sum, payer) => sum + payer.percent, 0);

  if (payerSplits.length === 0) {
    expenseMessage.textContent = "Add at least one payer percentage.";
    return null;
  }

  if (payerSplits.some((payer) => payer.percent > 100)) {
    expenseMessage.textContent = "A payer percentage cannot be more than 100%.";
    return null;
  }

  if (Math.abs(total - 100) > 0.01) {
    expenseMessage.textContent = "Payer percentages must add up to 100%.";
    return null;
  }

  return payerSplits;
}

function getPrimaryPayerId(payerSplits) {
  return [...payerSplits].sort((first, second) => second.percent - first.percent)[0].userId;
}

function getPayerSaveErrorMessage(error) {
  if (error.message?.includes("expense_payers")) {
    return "Run supabase/expense-payers.sql in Supabase before saving payer percentages.";
  }

  return error.message;
}

async function saveExpensePayers(expenseId, payerSplits, replaceExisting = false) {
  if (replaceExisting) {
    const { error: deleteError } = await supabaseClient.from("expense_payers").delete().eq("expense_id", expenseId);

    if (deleteError) {
      throw deleteError;
    }
  }

  const { error } = await supabaseClient.from("expense_payers").insert(
    payerSplits.map((payer) => ({
      expense_id: expenseId,
      user_id: payer.userId,
      percent: payer.percent,
    })),
  );

  if (error) {
    throw error;
  }
}

function createGroupInviteListItem(invite) {
  const item = document.createElement("li");
  const details = document.createElement("div");
  const email = document.createElement("strong");
  const subtitle = document.createElement("span");

  item.className = "invite-card";
  email.textContent = invite.invitedEmail;
  subtitle.textContent = `Pending since ${formatDate(invite.createdAt?.slice(0, 10))}`;

  details.append(email, subtitle);
  item.append(details);

  return item;
}

function createExpenseListItem(expense) {
  const item = document.createElement("li");
  const main = document.createElement("div");
  const details = document.createElement("div");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const amount = document.createElement("p");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  item.className = "expense-card";
  main.className = "expense-main";
  meta.className = "expense-meta";
  amount.className = "expense-amount";
  actions.className = "expense-actions";
  editButton.className = "small-button";
  deleteButton.className = "small-danger-button";

  title.textContent = expense.title;
  meta.textContent = `${expense.category} | ${formatDate(expense.expenseDate)} | ${getExpensePayerLabel(expense)}`;
  amount.textContent = formatCurrency(expense.amount);
  editButton.type = "button";
  editButton.textContent = "Edit";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  editButton.addEventListener("click", () => startEditExpense(expense.id));
  deleteButton.addEventListener("click", async () => {
    try {
      await deleteExpense(expense.id);
    } catch {
      expenseMessage.textContent = "Could not delete the expense. Please try again.";
    }
  });

  details.append(title, meta);
  main.append(details, amount);
  actions.append(editButton, deleteButton);
  item.append(main, actions);

  return item;
}

function resetExpenseForm() {
  selectedExpenseId = null;
  expenseForm.reset();
  expenseDateInput.value = getTodayValue();
  expenseFormTitle.textContent = "Add Expense";
  expenseSubmitButton.textContent = "Add expense";
  cancelEditExpenseButton.classList.add("hidden");
  expenseMessage.textContent = "";
  renderPayerSplitInputs();
}

function startEditExpense(expenseId) {
  const expense = data.expenses.find(
    (savedExpense) => savedExpense.id === expenseId && savedExpense.groupId === selectedGroupId,
  );

  if (!expense) {
    return;
  }

  selectedExpenseId = expense.id;
  expenseTitleInput.value = expense.title;
  expenseAmountInput.value = expense.amount.toFixed(2);
  expenseDateInput.value = expense.expenseDate;
  expenseCategoryInput.value = expense.category;
  renderPayerSplitInputs(expense);
  expenseFormTitle.textContent = "Edit Expense";
  expenseSubmitButton.textContent = "Save expense";
  cancelEditExpenseButton.classList.remove("hidden");
  expenseMessage.textContent = "";
  expenseForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleExpenseSubmit() {
  const group = getMyGroup(selectedGroupId);
  const title = expenseTitleInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const expenseDate = expenseDateInput.value;
  const category = expenseCategoryInput.value;
  const payerSplits = getPayerSplitsFromForm();

  if (!group) {
    expenseMessage.textContent = "Choose a group before adding an expense.";
    return;
  }

  if (!title) {
    expenseMessage.textContent = "Add a description.";
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    expenseMessage.textContent = "Amount must be greater than zero.";
    return;
  }

  if (!expenseDate) {
    expenseMessage.textContent = "Choose a date.";
    return;
  }

  if (!payerSplits) {
    return;
  }

  const primaryPayerId = getPrimaryPayerId(payerSplits);

  expenseSubmitButton.disabled = true;
  expenseSubmitButton.textContent = selectedExpenseId ? "Saving..." : "Adding...";

  if (selectedExpenseId) {
    const { error } = await supabaseClient
      .from("expenses")
      .update({
        title,
        amount,
        category,
        expense_date: expenseDate,
        paid_by: primaryPayerId,
      })
      .eq("id", selectedExpenseId)
      .eq("group_id", selectedGroupId);

    if (error) {
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Save expense";
      expenseMessage.textContent = error.message;
      return;
    }

    try {
      await saveExpensePayers(selectedExpenseId, payerSplits, true);
    } catch (payerError) {
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Save expense";
      expenseMessage.textContent = getPayerSaveErrorMessage(payerError);
      return;
    }
  } else {
    const { data: savedExpense, error } = await supabaseClient
      .from("expenses")
      .insert({
        group_id: group.id,
        created_by: data.currentUserId,
        paid_by: primaryPayerId,
        title,
        amount,
        category,
        expense_date: expenseDate,
      })
      .select()
      .single();

    if (error) {
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Add expense";
      expenseMessage.textContent = error.message;
      return;
    }

    try {
      await saveExpensePayers(savedExpense.id, payerSplits);
    } catch (payerError) {
      await supabaseClient.from("expenses").delete().eq("id", savedExpense.id);
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Add expense";
      expenseMessage.textContent = getPayerSaveErrorMessage(payerError);
      return;
    }
  }

  await loadRemoteAppData();
  resetExpenseForm();
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  renderGroupDetail();
}

async function deleteExpense(expenseId) {
  const expense = data.expenses.find(
    (savedExpense) => savedExpense.id === expenseId && savedExpense.groupId === selectedGroupId,
  );

  if (!expense) {
    return;
  }

  const shouldDelete = window.confirm(`Delete "${expense.title}"?`);

  if (!shouldDelete) {
    return;
  }

  const { error } = await supabaseClient.from("expenses").delete().eq("id", expense.id).eq("group_id", selectedGroupId);

  if (error) {
    expenseMessage.textContent = error.message;
    return;
  }

  if (selectedExpenseId === expense.id) {
    resetExpenseForm();
  }

  await loadRemoteAppData();
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  renderGroupDetail();
}

async function deleteSelectedGroup() {
  const group = getMyGroup(selectedGroupId);

  if (!group) {
    showScreen("groups");
    return;
  }

  const shouldDelete = window.confirm(`Delete "${group.name}"? This cannot be undone.`);

  if (!shouldDelete) {
    return;
  }

  const currentMembership = data.groupMembers.find(
    (member) => member.groupId === group.id && member.userId === data.currentUserId,
  );

  if (currentMembership?.role !== "owner") {
    window.alert("Only the group owner can delete this group.");
    return;
  }

  const { error } = await supabaseClient.from("groups").delete().eq("id", group.id);

  if (error) {
    window.alert(error.message);
    return;
  }

  selectedGroupId = null;
  selectedExpenseId = null;

  await loadRemoteAppData();
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  showScreen("groups");
}

async function recordSettlement(payment) {
  const group = getMyGroup(selectedGroupId);

  if (!group) {
    throw new Error("Open a group before recording a payment.");
  }

  if (payment.toUser !== data.currentUserId) {
    throw new Error("Only the person who is owed money can mark this as paid.");
  }

  const shouldRecord = window.confirm(
    `Record that ${payment.fromName} paid you ${formatCurrency(fromCents(payment.amountCents))}? Expenses will stay in the group history.`,
  );

  if (!shouldRecord) {
    renderGroupDetail();
    return;
  }

  const { error } = await supabaseClient.from("group_settlements").insert({
    group_id: group.id,
    from_user: payment.fromUser,
    to_user: payment.toUser,
    amount: fromCents(payment.amountCents),
    created_by: data.currentUserId,
  });

  if (error) {
    throw error;
  }

  await loadRemoteAppData();
  renderGroups();
  renderRecentExpenses();
  renderReports();
  renderGroupDetail();
  settlementMessage.classList.add("success-message");
  settlementMessage.textContent = "Payment recorded. The expenses stayed in your history.";
}

async function createInvite() {
  const group = getMyGroup(selectedGroupId);
  const invitedEmail = normalizeEmail(inviteEmailInput.value);

  if (!group) {
    inviteMessage.textContent = "Open a group before creating an invite.";
    return;
  }

  if (!invitedEmail) {
    inviteMessage.textContent = "Enter an email address.";
    return;
  }

  if (invitedEmail === normalizeEmail(getCurrentUser()?.email || "")) {
    inviteMessage.textContent = "You are already in this group.";
    return;
  }

  const isExistingMember = getGroupMembers(group.id).some(
    (member) => normalizeEmail(member.user.email) === invitedEmail,
  );

  if (isExistingMember) {
    inviteMessage.textContent = "That person is already a group member.";
    return;
  }

  const hasPendingInvite = getPendingInvitesForGroup(group.id).some(
    (invite) => normalizeEmail(invite.invitedEmail) === invitedEmail,
  );

  if (hasPendingInvite) {
    inviteMessage.textContent = "That email already has a pending invite.";
    return;
  }

  inviteSubmitButton.disabled = true;
  inviteSubmitButton.textContent = "Creating...";

  const { error } = await supabaseClient.from("group_invites").insert({
    group_id: group.id,
    invited_email: invitedEmail,
    invited_by: data.currentUserId,
    status: "pending",
  });

  inviteSubmitButton.disabled = false;
  inviteSubmitButton.textContent = "Create invite";

  if (error) {
    inviteMessage.classList.remove("success-message");
    inviteMessage.textContent = error.message;
    return;
  }

  inviteForm.reset();
  inviteMessage.classList.add("success-message");
  inviteMessage.textContent = "Invite created. Ask them to sign up or log in with that email.";
  await loadRemoteAppData();
  renderGroupDetail();
  renderPendingInvites();
}

async function acceptInvite(inviteId) {
  const { error } = await supabaseClient.rpc("accept_group_invite", {
    invite_id: inviteId,
  });

  if (error) {
    throw error;
  }

  await loadRemoteAppData();
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  showScreen("groups");
}

async function handleSignup() {
  const displayName = displayNameInput.value.trim();
  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;

  if (!supabaseClient) {
    authMessage.textContent = "Supabase could not load. Check your internet connection and refresh.";
    return;
  }

  if (!displayName) {
    authMessage.textContent = "Add your name to create a profile.";
    return;
  }

  if (password.length < 6) {
    authMessage.textContent = "Use at least 6 characters for the password.";
    return;
  }

  authSubmitButton.disabled = true;
  authSubmitButton.textContent = "Creating...";

  const { data: authData, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: appRedirectUrl,
      data: {
        display_name: displayName,
      },
    },
  });

  authSubmitButton.disabled = false;
  authSubmitButton.textContent = "Create account";

  if (error) {
    authMessage.classList.remove("success-message");
    authMessage.textContent = error.message;
    return;
  }

  if (!authData.session) {
    authForm.reset();
    setAuthMode("login");
    authMessage.classList.add("success-message");
    authMessage.textContent = "Account created. Check your email, confirm the account, then return here and log in.";
    return;
  }

  await ensureRemoteProfile(authData.user, displayName);
  await migrateLocalDataToSupabase();
  await loadRemoteAppData();
  authForm.reset();
  renderApp();
}

async function handleLogin() {
  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;

  if (!supabaseClient) {
    authMessage.textContent = "Supabase could not load. Check your internet connection and refresh.";
    return;
  }

  authSubmitButton.disabled = true;
  authSubmitButton.textContent = "Logging in...";

  const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  authSubmitButton.disabled = false;
  authSubmitButton.textContent = "Log in";

  if (error) {
    authMessage.classList.remove("success-message");
    if (error.message.toLowerCase().includes("email not confirmed")) {
      authMessage.textContent = "Your account exists, but the email is not confirmed yet. Check your inbox, confirm it, then come back here.";
      return;
    }

    authMessage.textContent = error.message;
    return;
  }

  await ensureRemoteProfile(authData.user);
  await migrateLocalDataToSupabase();
  await loadRemoteAppData();
  authForm.reset();
  renderApp();
}

async function handleResetRequest() {
  const email = normalizeEmail(resetEmailInput.value);

  if (!supabaseClient) {
    resetMessage.textContent = "Supabase could not load. Check your internet connection and refresh.";
    return;
  }

  if (!email) {
    resetMessage.textContent = "Enter your email address.";
    return;
  }

  resetSubmitButton.disabled = true;
  resetSubmitButton.textContent = "Sending...";

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: appRedirectUrl,
  });

  resetSubmitButton.disabled = false;
  resetSubmitButton.textContent = "Send reset link";

  if (error) {
    resetMessage.classList.remove("success-message");
    resetMessage.textContent = error.message;
    return;
  }

  resetMessage.classList.add("success-message");
  resetMessage.textContent = "Password reset email sent. Check your inbox, then return here after opening the link.";
}

async function handlePasswordUpdate() {
  const newPassword = newPasswordInput.value;

  if (!supabaseClient) {
    resetMessage.textContent = "Supabase could not load. Check your internet connection and refresh.";
    return;
  }

  if (newPassword.length < 6) {
    resetMessage.textContent = "Use at least 6 characters for the new password.";
    return;
  }

  resetSubmitButton.disabled = true;
  resetSubmitButton.textContent = "Updating...";

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  resetSubmitButton.disabled = false;
  resetSubmitButton.textContent = "Update password";

  if (error) {
    resetMessage.classList.remove("success-message");
    resetMessage.textContent = error.message;
    return;
  }

  resetForm.reset();
  showAuthForm();
  authMessage.classList.add("success-message");
  authMessage.textContent = "Password updated. You can keep using the app or log in again next time.";
}

async function logout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }

  showSessionMessage("");
  data.currentUserId = null;
  selectedGroupId = null;
  selectedExpenseId = null;
  saveData();
  authForm.reset();
  groupForm.reset();
  inviteForm.reset();
  resetExpenseForm();
  authMessage.textContent = "";
  groupMessage.textContent = "";
  showScreen("auth");
}

async function initializeApp() {
  setAuthMode("login");
  expenseDateInput.value = getTodayValue();
  const authReturn = getAuthReturnMessage();

  if (!supabaseClient) {
    authMessage.textContent = "Supabase could not load. Check your internet connection and refresh.";
    renderApp();
    return;
  }

  const callbackReturn = await handleAuthCallback();
  const finalAuthReturn = callbackReturn || authReturn;
  const { data: sessionData } = await supabaseClient.auth.getSession();

  try {
    if (sessionData.session?.user) {
      await ensureRemoteProfile(sessionData.session.user);
      await migrateLocalDataToSupabase();
      await loadRemoteAppData();
    } else {
      data.currentUserId = null;
      saveData();
    }
  } catch (error) {
    authMessage.textContent = error.message || "Could not load your Supabase data.";
  }

  renderApp();

  if (finalAuthReturn?.kind === "success" && getCurrentUser()) {
    showSessionMessage(finalAuthReturn.message);
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (finalAuthReturn?.kind === "recovery") {
    showScreen("auth");
    showResetForm("update");
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (finalAuthReturn?.kind === "error") {
    authMessage.textContent = finalAuthReturn.message;
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  try {
    if (authMode === "signup") {
      await handleSignup();
    } else {
      await handleLogin();
    }
  } catch {
    authSubmitButton.disabled = false;
    authSubmitButton.textContent = authMode === "signup" ? "Create account" : "Log in";
    authMessage.textContent = "Something went wrong. Please try again.";
  }
});

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  resetMessage.textContent = "";
  resetMessage.classList.remove("success-message");

  try {
    if (resetMode === "update") {
      await handlePasswordUpdate();
    } else {
      await handleResetRequest();
    }
  } catch {
    resetSubmitButton.disabled = false;
    resetSubmitButton.textContent = resetMode === "update" ? "Update password" : "Send reset link";
    resetMessage.textContent = "Something went wrong. Please try again.";
  }
});

inviteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  inviteMessage.textContent = "";
  inviteMessage.classList.remove("success-message");

  try {
    await createInvite();
  } catch {
    inviteSubmitButton.disabled = false;
    inviteSubmitButton.textContent = "Create invite";
    inviteMessage.textContent = "Could not create the invite. Please try again.";
  }
});

groupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  groupMessage.textContent = "";

  const groupName = groupNameInput.value.trim();

  if (!groupName) {
    groupMessage.textContent = "Add a group name.";
    return;
  }

  const submitButton = groupForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Creating...";

  try {
    const { data: group, error: groupError } = await supabaseClient
      .from("groups")
      .insert({
        name: groupName,
        created_by: data.currentUserId,
      })
      .select()
      .single();

    if (groupError) {
      throw groupError;
    }

    const { error: memberError } = await supabaseClient.from("group_members").insert({
      group_id: group.id,
      user_id: data.currentUserId,
      role: "owner",
    });

    if (memberError) {
      throw memberError;
    }

    await loadRemoteAppData();
    submitButton.disabled = false;
    submitButton.textContent = "Create group";
    groupForm.reset();
    renderGroups();
    renderRecentExpenses();
    renderPendingInvites();
    renderReports();
    openGroupDetail(group.id);
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Create group";
    groupMessage.textContent = error.message || "Could not create the group. Please try again.";
  }
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  expenseMessage.textContent = "";
  try {
    await handleExpenseSubmit();
  } catch {
    expenseSubmitButton.disabled = false;
    expenseSubmitButton.textContent = selectedExpenseId ? "Save expense" : "Add expense";
    expenseMessage.textContent = "Could not save the expense. Please try again.";
  }
});

loginModeButton.addEventListener("click", () => setAuthMode("login"));
signupModeButton.addEventListener("click", () => setAuthMode("signup"));
forgotPasswordButton.addEventListener("click", () => showResetForm("request", emailInput.value));
cancelResetButton.addEventListener("click", () => {
  showAuthForm();
  setAuthMode("login");
});
logoutButton.addEventListener("click", logout);
detailLogoutButton.addEventListener("click", logout);
deleteGroupButton.addEventListener("click", async () => {
  try {
    await deleteSelectedGroup();
  } catch {
    window.alert("Could not delete the group. Please try again.");
  }
});
cancelEditExpenseButton.addEventListener("click", resetExpenseForm);
scrollToExpenseButton.addEventListener("click", () => {
  expenseForm.scrollIntoView({ behavior: "smooth", block: "start" });
  expenseTitleInput.focus();
});
reportGroupFilter.addEventListener("change", () => {
  reportFilters.groupId = reportGroupFilter.value;
  renderReports();
});
reportPeriodFilter.addEventListener("change", () => {
  reportFilters.period = reportPeriodFilter.value;
  renderReports();
});
backToGroupsButton.addEventListener("click", () => {
  selectedExpenseId = null;
  renderGroups();
  renderRecentExpenses();
  renderPendingInvites();
  renderReports();
  showScreen("groups");
});

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedExpenseId = null;
    renderGroups();
    renderRecentExpenses();
    renderPendingInvites();
    renderReports();
    showScreen(button.dataset.screen);
  });
});

initializeApp();
