import apiClient from "./apiClient";

/**
 * Finance API Endpoints
 *
 * Routes include /api/finance/ prefix for backend compatibility.
 * Vite proxy (vite.config.js) intercepts /api/* and forwards to backend.
 *
 * Request Flow:
 * 1. Frontend: GET /api/finance/transactions
 * 2. Vite proxy: Intercepts /api/* and routes to http://localhost:5000
 * 3. Backend: Receives GET /api/finance/transactions
 *
 * Routes include full path:
 * - GET  /api/finance/transactions
 * - POST /api/finance/pay
 * - POST /api/finance/expense
 */

export const financeApi = {
  // 1. Fetch the ledger for the dashboard with optional filters
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();

    // Map 'omnisearch' to API 'search' parameter
    if (filters.omnisearch) params.append("search", filters.omnisearch);
    if (filters.date) params.append("date", filters.date);
    if (filters.minAmount && filters.minAmount > 0)
      params.append("minAmount", filters.minAmount);
    if (filters.type) params.append("type", filters.type);
    if (filters.category) params.append("category", filters.category);
    if (filters.method) params.append("method", filters.method);

    const queryString = params.toString();
    const url = queryString
      ? `/api/finance/transactions?${queryString}`
      : "/api/finance/transactions";
    const response = await apiClient.get(url);
    return response.data;
  },

  // 2. Submit a new fee payment (Income)
  submitPayment: async (paymentData) => {
    const payload = {
      student_id: paymentData.studentId,
      amount: parseFloat(paymentData.amount),
      payment_method: paymentData.method,
      reference_no: paymentData.reference,
    };

    const response = await apiClient.post("/api/finance/pay", payload);
    return response.data;
  },

  // 3. Submit a new expense (Outflow)
  submitExpense: async (expenseData) => {
    const payload = {
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      payment_method: expenseData.method,
      reference_no: expenseData.reference,
    };

    const response = await apiClient.post("/api/finance/expense", payload);
    return response.data;
  },

  // 4. Receive MoE capitation and trigger backend statutory allocation
  receiveCapitation: async (capitationData) => {
    const payload = {
      amount: parseFloat(capitationData.amount),
      term: capitationData.term,
      reference_no: capitationData.reference,
    };

    const response = await apiClient.post("/api/finance/capitation", payload);
    return response.data;
  },

  // 5. Reallocate money between vote heads
  reallocateFunds: async (reallocationData) => {
    const payload = {
      source_vote_head: reallocationData.sourceVoteHead,
      destination_vote_head: reallocationData.destinationVoteHead,
      amount: parseFloat(reallocationData.amount),
      reason: reallocationData.reason,
    };

    const response = await apiClient.post("/api/finance/reallocate", payload);
    return response.data;
  },

  // 6. Fetch current vote head distribution
  getVoteHeads: async () => {
    const response = await apiClient.get("/api/finance/vote-heads");
    return response.data;
  },

  // 6a. Create a new vote head
  createVoteHead: async (data) => {
    const response = await apiClient.post("/api/finance/vote-heads", data);
    return response.data;
  },

  // 6b. Update vote head percentage
  updateVoteHead: async ({ id, data }) => {
    const response = await apiClient.put(`/api/finance/vote-heads/${id}`, data);
    return response.data;
  },

  // 6c. Delete vote head
  deleteVoteHead: async (id) => {
    const response = await apiClient.delete(`/api/finance/vote-heads/${id}`);
    return response.data;
  },

  // 7. Fetch dashboard summary totals
  getSummary: async () => {
    const response = await apiClient.get("/api/finance/summary");
    return response.data;
  },

  // 8. Fetch trial balance report lines and totals
  getTrialBalance: async () => {
    const endpoints = [
      "/api/finance/reports/trial-balance",
      "/api/finance/trial-balance",
    ];

    let lastError;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status !== 400 && status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  // 9. Fetch ledger entries for a specific account
  getAccountLedger: async (accountName) => {
    const response = await apiClient.get(
      `/api/finance/ledger/${encodeURIComponent(accountName)}`,
    );
    return response.data;
  },

  // --- PHASE 5: FEE MASTER ENDPOINTS ---
  getFeeStructures: async (filters = {}) => {
    const endpoints = ["/api/fees/structures", "/api/finance/fees/structures"];

    let lastError;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint, { params: filters });
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  createFeeStructure: async (feeData) => {
    const payload = {
      name: feeData.name,
      amount: parseFloat(feeData.amount),
      academic_year: feeData.academic_year,
      term: feeData.term,
      target_cohort: feeData.target_cohort,
    };

    const endpoints = ["/api/fees/structures", "/api/finance/fees/structures"];

    let lastError;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.post(endpoint, payload);
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  getStudentDirectory: async (filters) => {
    const response = await apiClient.get("/api/students/directory", {
      params: filters,
    });
    return response.data;
  },

  getSpecificStudentLedger: async (id) => {
    console.log("[financeApi] Fetching ledger for student:", id);
    const response = await apiClient.get(`/api/students/${id}/ledger`);
    console.log(
      "[financeApi] Ledger response:",
      JSON.stringify(response.data, null, 2),
    );
    return response.data;
  },

  receiveStudentPayment: async (paymentData) => {
    console.log(
      "[financeApi] Payment request payload:",
      JSON.stringify(paymentData, null, 2),
    );
    const response = await apiClient.post("/api/finance/pay", paymentData);
    console.log(
      "[financeApi] Payment response:",
      JSON.stringify(response.data, null, 2),
    );
    return response.data;
  },

  issueCohortInvoices: async (structureId) => {
    const response = await apiClient.post(
      `/api/finance/fee-structures/${structureId}/invoice`,
    );
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await apiClient.post(
      "/api/students/directory/",
      studentData,
    );
    return response.data;
  },
  updateStudent: async ({ id, data }) => {
    const response = await apiClient.put(
      `/api/students/directory/${id}/`,
      data,
    );
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await apiClient.delete(`/api/students/directory/${id}/`);
    return response.data;
  },

  getInventoryStatus: async () => {
    try {
      const response = await apiClient.get("/api/inventory/status");
      return response.data;
    } catch (error) {
      if (error?.response?.status === 403) {
        try {
          const itemsResponse = await apiClient.get("/api/inventory/items");
          const items = Array.isArray(itemsResponse.data)
            ? itemsResponse.data
            : Array.isArray(itemsResponse.data?.data)
              ? itemsResponse.data.data
              : [];

          return { data: items, restricted: false, fallbackSource: "items" };
        } catch (fallbackError) {
          if (fallbackError?.response?.status === 403) {
            return { data: [], restricted: true };
          }

          throw fallbackError;
        }
      }

      throw error;
    }
  },

  // Fetch append-only transaction ledger with DB-level filtering
  getInventoryTransactions: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.action) params.append("action", filters.action);
    if (filters.startDate) params.append("start_date", filters.startDate);
    if (filters.endDate) params.append("end_date", filters.endDate);
    if (filters.itemId) params.append("item_id", filters.itemId);
    if (filters.recordedBy) params.append("recorded_by", filters.recordedBy);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.offset) params.append("offset", filters.offset);

    const queryString = params.toString();
    const url = queryString
      ? `/api/inventory/transactions?${queryString}`
      : "/api/inventory/transactions";
    const response = await apiClient.get(url);
    return response.data;
  },

  addStock: async (data) => {
    const response = await apiClient.post("/api/inventory/add-stock", data);
    return response.data;
  },
  consumeStock: async (data) => {
    const response = await apiClient.post("/api/inventory/consume", data);
    return response.data;
  },

  createInventoryItem: async (data) => {
    const response = await apiClient.post('/api/inventory/items', data);
    return response.data;
  },
  updateInventoryItem: async ({ id, data }) => {
    const response = await apiClient.put(`/api/inventory/items/${id}`, data);
    return response.data;
  },
  deleteInventoryItem: async (id) => {
    const response = await apiClient.delete(`/api/inventory/items/${id}`);
    return response.data;
  }
};
