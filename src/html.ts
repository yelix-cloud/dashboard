// @ts-nocheck
export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yelix Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .spinner {
            border: 2px solid rgba(59, 130, 246, 0.1);
            border-radius: 50%;
            border-top: 2px solid #3b82f6;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .status-badge {
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-2xx { background-color: #dcfce7; color: #166534; }
        .status-3xx { background-color: #dbeafe; color: #0c4a6e; }
        .status-4xx { background-color: #fed7aa; color: #92400e; }
        .status-5xx { background-color: #fecaca; color: #7f1d1d; }
        .method-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
            font-family: monospace;
        }
        .method-get { background-color: #d1fae5; color: #065f46; }
        .dark .method-get { background-color: #064e3b; color: #6ee7b7; }
        .method-post { background-color: #dbeafe; color: #1e40af; }
        .dark .method-post { background-color: #1e3a8a; color: #93c5fd; }
        .method-put { background-color: #fef3c7; color: #92400e; }
        .dark .method-put { background-color: #78350f; color: #fde68a; }
        .method-delete { background-color: #fee2e2; color: #991b1b; }
        .dark .method-delete { background-color: #7f1d1d; color: #fca5a5; }
        .method-patch { background-color: #e9d5ff; color: #6b21a8; }
        .dark .method-patch { background-color: #581c87; color: #c4b5fd; }
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-success { background-color: #d1fae5; color: #065f46; }
        .dark .badge-success { background-color: #064e3b; color: #6ee7b7; }
        .badge-error { background-color: #fee2e2; color: #991b1b; }
        .dark .badge-error { background-color: #7f1d1d; color: #fca5a5; }
        .badge-warning { background-color: #fef3c7; color: #92400e; }
        .dark .badge-warning { background-color: #78350f; color: #fde68a; }
        .badge-info { background-color: #dbeafe; color: #1e40af; }
        .dark .badge-info { background-color: #1e3a8a; color: #93c5fd; }
        .request-row {
            cursor: pointer;
            transition: background-color 0.15s ease;
        }
        .request-row:hover {
            background-color: #f3f4f6 !important;
        }
        .dark .request-row:hover {
            background-color: #374151 !important;
        }
        .code-block {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .tab-button {
            padding: 0.5rem 1rem;
            border-bottom: 2px solid transparent;
            color: #6b7280;
            transition: all 0.2s ease;
            cursor: pointer;
            background: transparent;
        }
        .tab-button:hover {
            color: #000000 !important;
            background-color: #f3f4f6 !important;
            border-bottom-color: #d1d5db !important;
        }
        .tab-button.active {
            color: #000000 !important;
            background-color: #ffffff !important;
            border-bottom-color: #3b82f6 !important;
            font-weight: 600;
        }
        .dark .tab-button {
            color: #9ca3af;
        }
        .dark .tab-button:hover {
            color: #ffffff !important;
            background-color: #374151 !important;
            border-bottom-color: #4b5563 !important;
        }
        .dark .tab-button.active {
            color: #ffffff !important;
            background-color: #1f2937 !important;
            border-bottom-color: #3b82f6 !important;
        }
        .tab-panel {
            display: none;
        }
        .tab-panel:not(.hidden) {
            display: block;
        }
        .timeline-item {
            position: relative;
            padding-left: 2rem;
            padding-bottom: 1.5rem;
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0.5rem;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: #3b82f6;
            z-index: 1;
        }
        .timeline-item::after {
            content: '';
            position: absolute;
            left: 0.75rem;
            top: 1rem;
            width: 2px;
            height: calc(100% - 0.5rem);
            background-color: #e5e7eb;
        }
        .dark .timeline-item::after {
            background-color: #374151;
        }
        .timeline-item:last-child::after {
            display: none;
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <i data-lucide="rocket" class="w-6 h-6"></i>
                            Yelix Dashboard
                        </h1>
                    </div>
                    <div class="flex items-center gap-4">
                        <button id="refreshBtn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                            Refresh
                        </button>
                        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" id="autoRefresh" checked class="rounded">
                            <span>Auto-refresh (5s)</span>
                        </label>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" id="statsGrid">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Requests</h3>
                    <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="totalRequests">-</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Endpoints</h3>
                    <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="uniqueEndpoints">-</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg Response</h3>
                    <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="avgResponseTime">-</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Success</h3>
                    <div class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400" id="successCount">-</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Errors</h3>
                    <div class="mt-2 text-3xl font-bold text-red-600 dark:text-red-400" id="errorCount">-</div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <div class="flex flex-wrap gap-4 items-center">
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Search by path, method, or request ID..." 
                        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                    <select id="methodFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option value="">All Methods</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                    <select id="statusFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                        <option value="">All Status</option>
                        <option value="2xx">2xx Success</option>
                        <option value="4xx">4xx Client Error</option>
                        <option value="5xx">5xx Server Error</option>
                    </select>
                </div>
            </div>

            <!-- Requests Table -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Requests</h2>
                </div>
                <div id="requestsContainer" class="overflow-x-auto">
                    <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                        <div class="spinner mx-auto mb-2"></div>
                        <div>Loading requests...</div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Request Detail Modal -->
    <div id="requestModal" class="hidden fixed inset-0 z-50 overflow-y-auto">
        <div id="modalBackdrop" class="fixed inset-0 bg-black/50 transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Request Details</h2>
                    <button id="closeModalBtn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Modal Content -->
                <div class="flex-1 overflow-y-auto p-6" id="requestModalContent">
                    <div class="text-center text-gray-500 dark:text-gray-400">Loading...</div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        let allRequests = [];
        let autoRefreshInterval = null;
        const currentPath = window.location.pathname;
        // Dynamically detect the mount path from the current URL
        // Remove trailing slash and extract the base path
        // Examples:
        //   /dashboard -> /dashboard
        //   /dashboard/ -> /dashboard
        //   /admin -> /admin
        //   / -> (empty, use default)
        let mountPath = currentPath.replace(/\\/$/, ''); // Remove trailing slash
        // If we're at root or the path doesn't look like a mount path, use empty
        if (mountPath === '' || mountPath === '/') {
            mountPath = '';
        }
        // The API is always at {mountPath}/api/dashboard
        const API_BASE = mountPath ? \`\${mountPath}/api/dashboard\` : '/api/dashboard';

        // Utility functions
        function formatDuration(duration) {
            if (duration === null || duration === undefined || duration === '' || (typeof duration === 'number' && isNaN(duration))) return '-';
            if (typeof duration === 'string') {
                // Parse duration string like "123ms", "1.5s"
                const match = duration.match(/^([\\d.]+)(ms|μs|ns|s)$/);
                if (match) {
                    const value = parseFloat(match[1]);
                    if (isNaN(value)) return duration;
                    const unit = match[2];
                    if (unit === 's') return (value * 1000).toFixed(2) + 'ms';
                    if (unit === 'ms') return value.toFixed(2) + 'ms';
                    if (unit === 'μs') return (value / 1000).toFixed(2) + 'ms';
                    if (unit === 'ns') return (value / 1000000).toFixed(2) + 'ms';
                }
                return duration;
            }
            if (typeof duration === 'number') {
                if (isNaN(duration)) return '-';
                if (duration < 1) return duration.toFixed(3) + 'ms';
                if (duration < 1000) return duration.toFixed(2) + 'ms';
                return (duration / 1000).toFixed(2) + 's';
            }
            return String(duration);
        }

        function formatNumber(num) {
            if (num === null || num === undefined) return '-';
            return Number(num).toLocaleString();
        }

        function formatTime(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleTimeString();
        }

        function formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleString();
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function formatJson(obj, indent = 2) {
            try {
                return JSON.stringify(obj, null, indent);
            } catch (e) {
                return String(obj);
            }
        }

        function parseJson(str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return null;
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }

        function createMethodBadge(method) {
            const badge = document.createElement('span');
            badge.className = \`method-badge method-\${method.toLowerCase()}\`;
            badge.textContent = method;
            return badge;
        }

        function createStatusBadge(status) {
            const badge = document.createElement('span');
            const statusClass = status >= 200 && status < 300 ? 'badge-success' : 
                               status >= 400 ? 'badge-error' : 
                               status >= 300 ? 'badge-warning' : 'badge-info';
            badge.className = \`badge \${statusClass}\`;
            badge.textContent = status;
            return badge;
        }

        // Initialize dashboard when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        function init() {
            console.log('Initializing dashboard...');
            try {
                // Initialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                initializeEventListeners();
                loadDashboard();
                setupAutoRefresh();
                initModalHandlers();
                console.log('Dashboard initialized successfully');
            } catch (error) {
                console.error('Failed to initialize dashboard:', error);
            }
        }

        function initializeEventListeners() {
            // Refresh button
            document.getElementById('refreshBtn').addEventListener('click', () => {
                loadDashboard();
            });
            
            // Auto-refresh checkbox
            document.getElementById('autoRefresh').addEventListener('change', (e) => {
                if (e.target.checked) {
                    setupAutoRefresh();
                } else {
                    clearAutoRefresh();
                }
            });
            
            // Search input with debounce
            const searchInput = document.getElementById('searchInput');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    applyFilters();
                }, 300);
            });
            
            // Method filter
            document.getElementById('methodFilter').addEventListener('change', applyFilters);
            
            // Status filter
            document.getElementById('statusFilter').addEventListener('change', applyFilters);
        }

        function applyFilters() {
            const filters = {
                search: document.getElementById('searchInput').value.trim(),
                method: document.getElementById('methodFilter').value,
                status: document.getElementById('statusFilter').value,
            };
            
            loadRequestList(filters);
        }

        async function loadStats() {
            try {
                const response = await fetch(API_BASE + '/stats', {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.reload();
                        return null;
                    }
                    throw new Error(\`Failed to fetch stats: \${response.status}\`);
                }
                
                const stats = await response.json();
                
                document.getElementById('totalRequests').textContent = formatNumber(stats.totalRequests || 0);
                document.getElementById('uniqueEndpoints').textContent = formatNumber(stats.uniqueEndpoints || 0);
                document.getElementById('avgResponseTime').textContent = formatDuration(stats.avgDuration || 0);
                document.getElementById('successCount').textContent = formatNumber(stats.successCount || 0);
                document.getElementById('errorCount').textContent = formatNumber(stats.errorCount || 0);
            } catch (error) {
                console.error('Failed to load stats:', error);
                document.getElementById('totalRequests').textContent = 'Error';
                document.getElementById('uniqueEndpoints').textContent = 'Error';
                document.getElementById('avgResponseTime').textContent = 'Error';
                document.getElementById('successCount').textContent = 'Error';
                document.getElementById('errorCount').textContent = 'Error';
            }
        }

        async function loadRequestList(filters = {}) {
            const container = document.getElementById('requestsContainer');
            
            if (!container) {
                console.error('requestsContainer not found');
                return;
            }
            
            try {
                container.innerHTML = '<div class="p-8 text-center"><div class="spinner mx-auto"></div></div>';
                
                const params = new URLSearchParams({ limit: '50' });
                if (filters.method) params.append('method', filters.method);
                if (filters.status) params.append('status', filters.status);
                if (filters.search) params.append('search', filters.search);
                
                const response = await fetch(API_BASE + '/events?' + params, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.reload();
                        return;
                    }
                    throw new Error(\`Failed to fetch requests: \${response.status}\`);
                }
                
                let requests = await response.json();
                
                // Apply client-side filtering for search
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    requests = requests.filter(req => {
                        const haystack = (\`\${req.pathname}\${req.method}\${req.requestId}\`).toLowerCase();
                        return haystack.includes(search);
                    });
                }
                
                allRequests = requests;
                
                if (!requests || requests.length === 0) {
                    container.innerHTML = '<div class="p-8 text-center text-gray-500 dark:text-gray-400">No requests found</div>';
                    return;
                }

                container.innerHTML = \`
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Path</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Middleware</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Logs</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            \${requests.map(req => createRequestRow(req)).join('')}
                        </tbody>
                    </table>
                \`;

                // Add click handlers
                container.querySelectorAll('.request-row').forEach(row => {
                    row.addEventListener('click', () => {
                        const requestId = row.dataset.requestId;
                        showRequestDetails(requestId);
                    });
                });
            } catch (error) {
                console.error('loadRequestList error:', error);
                container.innerHTML = \`
                    <div class="p-8 text-center">
                        <div class="text-red-600 dark:text-red-400 font-semibold mb-2">Failed to load requests</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">\${escapeHtml(error.message || 'Unknown error')}</div>
                        <div class="mt-4">
                            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Reload Page
                            </button>
                        </div>
                    </div>
                \`;
            }
        }

        function createRequestRow(req) {
            const method = escapeHtml(req.method || '');
            const status = req.status || 0;
            const duration = formatDuration(req.duration);
            const time = formatTime(req.timestamp);
            const pathname = escapeHtml(req.pathname || '');
            const requestId = escapeHtml(req.requestId || '');
            const middlewareCount = Array.isArray(req.middlewares) ? req.middlewares.length : 0;
            const logCount = req.log_count || 0;
            
            const methodClass = \`method-badge method-\${method.toLowerCase()}\`;
            const statusClass = status >= 200 && status < 300 ? 'badge-success' : 
                               status >= 400 ? 'badge-error' : 
                               status >= 300 ? 'badge-warning' : 'badge-info';

            return \`
                <tr class="request-row" data-request-id="\${requestId}">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-medium">\${time}</td>
                    <td class="px-6 py-4 whitespace-nowrap"><span class="\${methodClass}">\${method}</span></td>
                    <td class="px-6 py-4 text-sm">
                        <div class="font-mono text-gray-900 dark:text-gray-100">\${pathname}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">\${requestId.substring(0, 20)}...</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap"><span class="badge \${statusClass}">\${status}</span></td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-medium">\${duration}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${middlewareCount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${logCount}</td>
                </tr>
            \`;
        }

        async function loadDashboard() {
            await Promise.all([
                loadStats(),
                loadRequestList(),
            ]);
        }

        function setupAutoRefresh() {
            clearAutoRefresh();
            autoRefreshInterval = setInterval(() => {
                loadDashboard();
            }, 5000);
        }

        function clearAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }

        function initModalHandlers() {
            const modal = document.getElementById('requestModal');
            const backdrop = document.getElementById('modalBackdrop');
            const closeBtn = document.getElementById('closeModalBtn');
            
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    closeRequestModal();
                });
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    closeRequestModal();
                });
            }
            
            // Close on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                    closeRequestModal();
                }
            });
        }

        async function showRequestDetails(requestId) {
            const modal = document.getElementById('requestModal');
            const content = document.getElementById('requestModalContent');
            
            modal.classList.remove('hidden');
            content.innerHTML = '<div class="text-center py-8"><div class="spinner mx-auto"></div></div>';
            
            try {
                // Try to fetch detailed request data
                const response = await fetch(API_BASE + '/request/' + requestId, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                let data = null;
                if (response.ok) {
                    data = await response.json();
                } else {
                    // Fallback to in-memory data
                    data = allRequests.find(r => r.requestId === requestId);
                    if (data) {
                        data = { request: data, middleware: data.middlewares || [], logs: [] };
                    }
                }
                
                if (!data) {
                    content.innerHTML = '<div class="text-center py-8 text-red-600">Request not found</div>';
                    return;
                }
                
                content.innerHTML = renderRequestDetail(data);
                
                // Add copy buttons functionality
                content.querySelectorAll('[data-copy]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const text = btn.dataset.copy;
                        copyToClipboard(text);
                    });
                });
                
                // Initialize tabs
                initTabs();
                
                // Refresh icons after content is loaded
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
            } catch (error) {
                content.innerHTML = \`
                    <div class="text-center py-8">
                        <div class="text-red-600">Failed to load request details: \${escapeHtml(error.message)}</div>
                    </div>
                \`;
            }
        }

        function closeRequestModal() {
            const modal = document.getElementById('requestModal');
            modal.classList.add('hidden');
        }

        function renderRequestDetail(data) {
            const { request, middleware, logs } = data;
            
            // Parse JSON strings if they exist
            const headers = request.headers ? (typeof request.headers === 'string' ? parseJson(request.headers) : request.headers) : {};
            const body = request.body ? (typeof request.body === 'string' ? parseJson(request.body) : request.body) : null;
            const queryParams = request.query_params ? (typeof request.query_params === 'string' ? parseJson(request.query_params) : request.query_params) : {};
            const pathParams = request.path_params ? (typeof request.path_params === 'string' ? parseJson(request.path_params) : request.path_params) : {};
            const responseBody = request.response_body ? (typeof request.response_body === 'string' ? parseJson(request.response_body) : request.response_body) : null;
            const responseHeaders = request.response_headers ? (typeof request.response_headers === 'string' ? parseJson(request.response_headers) : request.response_headers) : {};
            
            return \`
                <!-- Request Overview -->
                <div class="mb-6">
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">Method</div>
                                <div class="mt-1">\${createMethodBadge(request.method || 'N/A').outerHTML}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                <div class="mt-1">\${createStatusBadge(request.status || 0).outerHTML}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                                <div class="mt-1 font-semibold text-gray-900 dark:text-gray-100">\${formatDuration(request.duration)}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">Request ID</div>
                                <div class="mt-1 font-mono text-xs flex items-center gap-2">
                                    <span class="text-gray-900 dark:text-gray-100">\${escapeHtml(request.requestId || request.request_id || 'N/A')}</span>
                                    <button data-copy="\${escapeHtml(request.requestId || request.request_id || '')}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Copy">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-2">
                        <div class="text-sm text-gray-500 dark:text-gray-400">URL</div>
                        <div class="mt-1 font-mono text-sm break-all text-gray-900 dark:text-gray-100">\${escapeHtml(request.url || request.pathname || 'N/A')}</div>
                    </div>
                    <div class="mb-2">
                        <div class="text-sm text-gray-500 dark:text-gray-400">Started</div>
                        <div class="mt-1 text-sm text-gray-900 dark:text-gray-100">\${formatDate(request.timestamp || request.started_at)}</div>
                    </div>
                    \${request.ended_at ? \`
                        <div class="mb-2">
                            <div class="text-sm text-gray-500 dark:text-gray-400">Ended</div>
                            <div class="mt-1 text-sm text-gray-900 dark:text-gray-100">\${formatDate(request.ended_at)}</div>
                        </div>
                    \` : ''}
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav class="flex space-x-8 overflow-x-auto">
                        <button class="tab-button active" data-tab="headers">Request Headers</button>
                        <button class="tab-button" data-tab="body">Request Body</button>
                        <button class="tab-button" data-tab="query">Query & Params</button>
                        <button class="tab-button" data-tab="response-headers">Response Headers</button>
                        <button class="tab-button" data-tab="response">Response Body</button>
                        <button class="tab-button" data-tab="middleware">Middleware</button>
                        <button class="tab-button" data-tab="logs">Logs</button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div id="tabContent">
                    \${renderHeadersTab(headers, 'request')}
                    \${renderBodyTab(body, request.body_type, 'request')}
                    \${renderQueryTab(queryParams, pathParams)}
                    \${renderHeadersTab(responseHeaders, 'response')}
                    \${renderBodyTab(responseBody, request.response_body_type, 'response')}
                    \${renderMiddlewareTab(middleware, logs)}
                    \${renderLogsTab(logs)}
                </div>
            \`;
        }

        function renderHeadersTab(headers, type = 'request') {
            const headersHtml = Object.entries(headers || {}).map(([key, value]) => \`
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="px-4 py-2 font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">\${escapeHtml(key)}</td>
                    <td class="px-4 py-2 font-mono text-sm break-all text-gray-900 dark:text-gray-100">\${escapeHtml(String(value))}</td>
                </tr>
            \`).join('');
            
            const panelName = type === 'response' ? 'response-headers' : 'headers';
            
            return \`
                <div class="tab-panel \${type === 'response' ? 'hidden' : ''}" data-panel="\${panelName}">
                    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table class="min-w-full">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Header</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                \${headersHtml || '<tr><td colspan="2" class="px-4 py-8 text-center text-gray-500">No headers</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            \`;
        }

        function renderBodyTab(body, bodyType, type = 'request') {
            if (!body && bodyType !== 'json' && bodyType !== 'text') {
                const panelName = type === 'response' ? 'response' : 'body';
                return \`
                    <div class="tab-panel \${type === 'response' ? 'hidden' : 'hidden'}" data-panel="\${panelName}">
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">No \${type} body</div>
                    </div>
                \`;
            }
            
            const bodyStr = typeof body === 'string' ? body : formatJson(body);
            const panelName = type === 'response' ? 'response' : 'body';
            
            return \`
                <div class="tab-panel \${type === 'response' ? 'hidden' : 'hidden'}" data-panel="\${panelName}">
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-gray-500 dark:text-gray-400">\${type === 'response' ? 'Response' : 'Request'} Body Type: \${escapeHtml(bodyType || 'unknown')}</span>
                            <button data-copy="\${escapeHtml(bodyStr)}" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                                <i data-lucide="copy" class="w-3 h-3"></i>
                                Copy
                            </button>
                        </div>
                        <pre class="code-block">\${escapeHtml(bodyStr)}</pre>
                    </div>
                </div>
            \`;
        }

        function renderQueryTab(queryParams, pathParams) {
            const queryParamsObj = queryParams && typeof queryParams === 'object' ? queryParams : {};
            const pathParamsObj = pathParams && typeof pathParams === 'object' ? pathParams : {};
            
            const queryHtml = Object.entries(queryParamsObj).map(([key, value]) => \`
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="px-4 py-2 font-mono text-sm font-semibold">\${escapeHtml(key)}</td>
                    <td class="px-4 py-2 font-mono text-sm">\${escapeHtml(String(value))}</td>
                </tr>
            \`).join('');
            
            const paramsHtml = Object.entries(pathParamsObj).map(([key, value]) => \`
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="px-4 py-2 font-mono text-sm font-semibold">\${escapeHtml(key)}</td>
                    <td class="px-4 py-2 font-mono text-sm">\${escapeHtml(String(value))}</td>
                </tr>
            \`).join('');
            
            return \`
                <div class="tab-panel hidden" data-panel="query">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Query Parameters</h3>
                            <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table class="min-w-full">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Key</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${queryHtml || '<tr><td colspan="2" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No query parameters</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Path Parameters</h3>
                            <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table class="min-w-full">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Key</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${paramsHtml || '<tr><td colspan="2" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No path parameters</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderMiddlewareTab(middleware, logs) {
            if (!middleware || middleware.length === 0) {
                return \`
                    <div class="tab-panel hidden" data-panel="middleware">
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">No middleware data</div>
                    </div>
                \`;
            }
            
            // Group logs by middleware if available
            const logsByMiddleware = {};
            if (logs) {
                logs.forEach(log => {
                    const key = \`\${log.middleware_name || log.name}_\${log.middleware_count || 0}\`;
                    if (!logsByMiddleware[key]) logsByMiddleware[key] = [];
                    logsByMiddleware[key].push(log);
                });
            }
            
            const middlewareHtml = middleware.map((mw, index) => {
                const key = \`\${mw.middleware_name || mw.name}_\${mw.middleware_count || index}\`;
                const mwLogs = logsByMiddleware[key] || [];
                const duration = formatDuration(mw.duration || (mw.duration_ns != null ? mw.duration_ns / 1000000 : null));
                
                return \`
                    <div class="timeline-item">
                        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <div class="font-semibold text-lg text-black dark:text-white">\${escapeHtml(mw.middleware_name || mw.name || 'Unknown')}</div>
                                    <div class="text-sm text-gray-700 dark:text-gray-300">Execution #\${mw.middleware_count || index + 1}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-black dark:text-white">\${duration}</div>
                                    <div class="text-xs text-gray-700 dark:text-gray-300">\${formatDate(mw.started_at || mw.timestamp)}</div>
                                </div>
                            </div>
                            \${mwLogs.length > 0 ? \`
                                <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Logs (\${mwLogs.length})</div>
                                    <div class="space-y-1">
                                        \${mwLogs.map(log => {
                                            const messages = typeof log.messages === 'string' ? parseJson(log.messages) : log.messages;
                                            const messagesStr = Array.isArray(messages) 
                                                ? messages.map(m => {
                                                    if (typeof m === 'object' && m !== null) {
                                                        return formatJson(m);
                                                    }
                                                    return String(m);
                                                }).join(' ')
                                                : (typeof messages === 'object' && messages !== null ? formatJson(messages) : String(messages || ''));
                                            return \`
                                                <div class="text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                                                    \${escapeHtml(messagesStr)}
                                                </div>
                                            \`;
                                        }).join('')}
                                    </div>
                                </div>
                            \` : ''}
                        </div>
                    </div>
                \`;
            }).join('');
            
            return \`
                <div class="tab-panel hidden" data-panel="middleware">
                    <div class="space-y-4">
                        \${middlewareHtml}
                    </div>
                </div>
            \`;
        }

        function renderLogsTab(logs) {
            if (!logs || logs.length === 0) {
                return \`
                    <div class="tab-panel hidden" data-panel="logs">
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">No logs</div>
                    </div>
                \`;
            }
            
            const logsHtml = logs.map(log => {
                const messages = typeof log.messages === 'string' ? parseJson(log.messages) : log.messages;
                const messagesStr = Array.isArray(messages) 
                    ? messages.map(m => {
                        if (typeof m === 'object' && m !== null) {
                            return formatJson(m);
                        }
                        return String(m);
                    }).join(' ')
                    : (typeof messages === 'object' && messages !== null ? formatJson(messages) : String(messages || ''));
                
                return \`
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">\${formatDate(log.logged_at || log.timestamp)}</td>
                        <td class="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">\${escapeHtml(log.middleware_name || log.name || 'Unknown')}</td>
                        <td class="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">\${escapeHtml(messagesStr)}</td>
                    </tr>
                \`;
            }).join('');
            
            return \`
                <div class="tab-panel hidden" data-panel="logs">
                    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table class="min-w-full">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Middleware</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                \${logsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            \`;
        }

        function initTabs() {
            const buttons = document.querySelectorAll('.tab-button');
            const panels = document.querySelectorAll('.tab-panel');
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabName = button.dataset.tab;
                    
                    // Update buttons
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update panels
                    panels.forEach(panel => {
                        panel.classList.add('hidden');
                        if (panel.dataset.panel === tabName) {
                            panel.classList.remove('hidden');
                        }
                    });
                });
            });
        }
    </script>
</body>
</html>`;
