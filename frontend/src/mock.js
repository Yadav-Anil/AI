// Mock data for the to-do list app
export const mockUsers = [
  {
    id: '1',
    username: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User'
  }
];

export const mockCategories = [
  { id: '1', name: 'Work', color: '#3B82F6', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#10B981', icon: 'user' },
  { id: '3', name: 'Shopping', color: '#F59E0B', icon: 'shopping-bag' },
  { id: '4', name: 'Health', color: '#EF4444', icon: 'heart' },
  { id: '5', name: 'Learning', color: '#8B5CF6', icon: 'book' }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Complete project presentation',
    description: 'Prepare slides for quarterly review meeting',
    categoryId: '1',
    priority: 'high',
    dueDate: '2024-02-15',
    completed: false,
    createdAt: '2024-02-10',
    tags: ['urgent', 'presentation']
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and vegetables',
    categoryId: '3',
    priority: 'medium',
    dueDate: '2024-02-12',
    completed: false,
    createdAt: '2024-02-10',
    tags: ['food', 'weekly']
  },
  {
    id: '3',
    title: 'Morning jog',
    description: '30 minutes run in the park',
    categoryId: '4',
    priority: 'low',
    dueDate: '2024-02-11',
    completed: true,
    createdAt: '2024-02-09',
    tags: ['exercise', 'routine']
  },
  {
    id: '4',
    title: 'Read React documentation',
    description: 'Study new React 19 features',
    categoryId: '5',
    priority: 'medium',
    dueDate: '2024-02-20',
    completed: false,
    createdAt: '2024-02-10',
    tags: ['programming', 'react']
  },
  {
    id: '5',
    title: 'Call dentist',
    description: 'Schedule appointment for teeth cleaning',
    categoryId: '4',
    priority: 'high',
    dueDate: '2024-02-13',
    completed: false,
    createdAt: '2024-02-10',
    tags: ['health', 'appointment']
  }
];

// Mock API functions
export const mockAPI = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.username === email && u.password === password);
        if (user) {
          resolve({ user: { id: user.id, name: user.name, email: user.username }, token: 'mock-token' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  register: (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now().toString(),
          username: email,
          password,
          name
        };
        mockUsers.push(newUser);
        resolve({ user: { id: newUser.id, name: newUser.name, email: newUser.username }, token: 'mock-token' });
      }, 1000);
    });
  },

  getTasks: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTasks);
      }, 500);
    });
  },

  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300);
    });
  },

  createTask: (task) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...task,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString().split('T')[0],
          completed: false
        };
        mockTasks.push(newTask);
        // Store in localStorage for persistence
        localStorage.setItem('todoApp_tasks', JSON.stringify(mockTasks));
        resolve(newTask);
      }, 500);
    });
  },

  updateTask: (taskId, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
          resolve(mockTasks[taskIndex]);
        }
      }, 500);
    });
  },

  deleteTask: (taskId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          mockTasks.splice(taskIndex, 1);
          resolve(true);
        }
      }, 500);
    });
  }
};

// Local storage helpers for frontend-only functionality
export const localStorageAPI = {
  setAuth: (user, token) => {
    localStorage.setItem('todoApp_user', JSON.stringify(user));
    localStorage.setItem('todoApp_token', token);
  },
  
  getAuth: () => {
    const user = localStorage.getItem('todoApp_user');
    const token = localStorage.getItem('todoApp_token');
    return user && token ? { user: JSON.parse(user), token } : null;
  },
  
  clearAuth: () => {
    localStorage.removeItem('todoApp_user');
    localStorage.removeItem('todoApp_token');
  }
};