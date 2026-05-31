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

const expenseForm = document.querySelector("#expense-form");
const expenseFormTitle = document.querySelector("#expense-form-title");
const expenseTitleInput = document.querySelector("#expense-title");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseDateInput = document.querySelector("#expense-date");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseMessage = document.querySelector("#expense-message");
const expenseSubmitButton = document.querySelector("#expense-submit-button");
const cancelEditExpenseButton = document.querySelector("#cancel-edit-expense-button");
const groupExpenseCount = document.querySelector("#group-expense-count");
const groupExpenseList = document.querySelector("#group-expense-list");
const emptyGroupExpenses = document.querySelector("#empty-group-expenses");
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
    const { error } = await supabaseClient.from("expenses").insert({
      group_id: groupIdMap.get(localExpense.groupId),
      created_by: data.currentUserId,
      paid_by: data.currentUserId,
      title: localExpense.title,
      amount: localExpense.amount,
      category: localExpense.category,
      expense_date: localExpense.expenseDate,
      notes: localExpense.notes || null,
    });

    if (error) {
      throw error;
    }
  }

  localStorage.setItem(getMigrationKey(data.currentUserId), "true");
}

async function loadRemoteAppData() {
  if (!supabaseClient || !data.currentUserId) {
    return;
  }

  const [groupsResult, membersResult, expensesResult] = await Promise.all([
    supabaseClient.from("groups").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("group_members").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("expenses").select("*").order("expense_date", { ascending: false }),
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

  data.groups = groupsResult.data.map(mapRemoteGroup);
  data.groupMembers = membersResult.data.map(mapRemoteMember);
  data.expenses = expensesResult.data.map(mapRemoteExpense);

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

function getMyGroup(groupId) {
  return getMyGroups().find((group) => group.id === groupId) || null;
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

function getMyExpenses() {
  const groupIds = new Set(getMyGroups().map((group) => group.id));
  return data.expenses.filter((expense) => groupIds.has(expense.groupId)).sort(sortExpensesNewestFirst);
}

function getGroupTotal(groupId) {
  return getGroupExpenses(groupId).reduce((total, expense) => total + expense.amount, 0);
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

function openGroupDetail(groupId) {
  const group = getMyGroup(groupId);

  if (!group) {
    selectedGroupId = null;
    showScreen("groups");
    return;
  }

  selectedGroupId = groupId;
  resetExpenseForm();
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

  groupDetailTitle.textContent = group.name;
  groupDetailTotal.textContent = formatCurrency(getGroupTotal(group.id));
  groupDetailRole.textContent = isOwner ? "Owner" : "Member";
  groupSettingsSection.classList.toggle("hidden", !isOwner);
  membersCount.textContent = formatCount(members.length, "member", "members");
  groupExpenseCount.textContent = formatCount(groupExpenses.length, "expense", "expenses");
  emptyGroupExpenses.classList.toggle("hidden", groupExpenses.length > 0);

  membersList.innerHTML = "";
  groupExpenseList.innerHTML = "";

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

  groupExpenses.forEach((expense) => {
    groupExpenseList.appendChild(createExpenseListItem(expense));
  });
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
  meta.textContent = `${expense.category} | ${formatDate(expense.expenseDate)} | Paid by ${getUserName(expense.paidBy)}`;
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
        paid_by: data.currentUserId,
      })
      .eq("id", selectedExpenseId)
      .eq("group_id", selectedGroupId);

    if (error) {
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Save expense";
      expenseMessage.textContent = error.message;
      return;
    }
  } else {
    const { error } = await supabaseClient.from("expenses").insert({
      group_id: group.id,
      created_by: data.currentUserId,
      paid_by: data.currentUserId,
      title,
      amount,
      category,
      expense_date: expenseDate,
    });

    if (error) {
      expenseSubmitButton.disabled = false;
      expenseSubmitButton.textContent = "Add expense";
      expenseMessage.textContent = error.message;
      return;
    }
  }

  await loadRemoteAppData();
  resetExpenseForm();
  renderGroups();
  renderRecentExpenses();
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
  renderReports();
  showScreen("groups");
});

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedExpenseId = null;
    renderGroups();
    renderRecentExpenses();
    renderReports();
    showScreen(button.dataset.screen);
  });
});

initializeApp();
