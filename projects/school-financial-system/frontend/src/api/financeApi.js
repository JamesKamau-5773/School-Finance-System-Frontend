import apiClient from './apiClient';

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
  // 1. Fetch the ledger for the dashboard
  getTransactions: async () => {
    const response = await apiClient.get('/api/finance/transactions');
    return response.data;
  },

  // 2. Submit a new fee payment (Income)
  submitPayment: async (paymentData) => {
    const payload = {
      student_id: paymentData.studentId,
      amount: parseFloat(paymentData.amount),
      payment_method: paymentData.method,
      reference_no: paymentData.reference
    };
    
    const response = await apiClient.post('/api/finance/pay', payload);
    return response.data;
  },

  // 3. Submit a new expense (Outflow)
  submitExpense: async (expenseData) => {
    const payload = {
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      payment_method: expenseData.method,
      reference_no: expenseData.reference
    };
    
    const response = await apiClient.post('/api/finance/expense', payload);
    return response.data;
  },

  // 4. Receive MoE capitation and trigger backend statutory allocation
  receiveCapitation: async (capitationData) => {
    const payload = {
      amount: parseFloat(capitationData.amount),
      term: capitationData.term,
      reference_no: capitationData.reference,
    };

    const response = await apiClient.post('/api/finance/capitation', payload);
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

    const response = await apiClient.post('/api/finance/reallocate', payload);
    return response.data;
  },

  // 6. Fetch current vote head distribution
  getVoteHeads: async () => {
    const response = await apiClient.get('/api/finance/vote-heads');
    return response.data;
  },

  // 7. Fetch dashboard summary totals
  getSummary: async () => {
    const response = await apiClient.get('/api/finance/summary');
    return response.data;
  },

  // 8. Fetch trial balance report lines and totals
  getTrialBalance: async () => {
    const response = await apiClient.get('/api/finance/reports/trial-balance');
    return response.data;
  },
};