import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  CheckCircle, Plus, User, LogOut, Search, Filter, 
  Calendar, Flag, Tag, Edit2, Trash2, Clock, 
  Briefcase, Heart, ShoppingBag, Book, UserIcon, Download
} from 'lucide-react';
import TaskForm from './TaskForm';
import { tasksAPI, categoriesAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: error.response?.data?.detail || error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await tasksAPI.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setIsTaskFormOpen(false);
      toast({
        title: "Task created!",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error creating task",
        description: error.response?.data?.detail || error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await mockAPI.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
      if (editingTask) {
        setEditingTask(null);
        setIsTaskFormOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await mockAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const csvData = filteredTasks.map(task => {
      const category = categories.find(c => c.id === task.categoryId);
      return {
        Title: task.title,
        Description: task.description,
        Category: category?.name || '',
        Priority: task.priority,
        'Due Date': task.dueDate,
        Status: task.completed ? 'Completed' : 'Pending',
        Tags: task.tags.join(', '),
        'Created Date': task.createdAt
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `${filteredTasks.length} tasks exported to CSV.`,
    });
  };

  const handleToggleComplete = async (taskId, completed) => {
    await handleUpdateTask(taskId, { completed });
    toast({
      title: completed ? "Task completed!" : "Task marked incomplete",
      description: completed ? "Great job! Keep up the momentum." : "Task moved back to active list.",
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || task.categoryId === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed) ||
                           (filterStatus === 'overdue' && !task.completed && isOverdue(task.dueDate));
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, filterCategory, filterPriority, filterStatus]);

  const getIconForCategory = (iconName) => {
    const icons = {
      briefcase: Briefcase,
      user: UserIcon,
      'shopping-bag': ShoppingBag,
      heart: Heart,
      book: Book
    };
    const IconComponent = icons[iconName] || Tag;
    return <IconComponent className="h-4 w-4" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button 
                onClick={exportToCSV}
                variant="outline"
                className="hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              
              <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-all duration-200 transform hover:scale-105"
                    onClick={() => setEditingTask(null)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                  </DialogHeader>
                  <TaskForm 
                    task={editingTask}
                    categories={categories}
                    onSubmit={editingTask ? 
                      (data) => handleUpdateTask(editingTask.id, data) : 
                      handleCreateTask
                    }
                    onCancel={() => {
                      setIsTaskFormOpen(false);
                      setEditingTask(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card 
            className={`bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
              filterStatus === 'all' ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => setFilterStatus('all')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-800">{tasks.length}</p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
              filterStatus === 'completed' ? 'ring-2 ring-green-400' : ''
            }`}
            onClick={() => setFilterStatus('completed')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-800">{tasks.filter(t => t.completed).length}</p>
                </div>
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
              filterStatus === 'pending' ? 'ring-2 ring-orange-400' : ''
            }`}
            onClick={() => setFilterStatus('pending')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-orange-800">{tasks.filter(t => !t.completed).length}</p>
                </div>
                <div className="p-2 bg-orange-200 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
              filterStatus === 'overdue' ? 'ring-2 ring-red-400' : ''
            }`}
            onClick={() => setFilterStatus('overdue')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-800">
                    {tasks.filter(t => !t.completed && isOverdue(t.dueDate)).length}
                  </p>
                </div>
                <div className="p-2 bg-red-200 rounded-lg">
                  <Flag className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No tasks found</p>
                <p className="text-gray-400">Create your first task or adjust your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map(task => {
              const category = categories.find(c => c.id === task.categoryId);
              const overdueTask = !task.completed && isOverdue(task.dueDate);
              
              return (
                <Card 
                  key={task.id} 
                  className={`backdrop-blur-sm border-white/20 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.01] ${
                    task.completed ? 'opacity-60' : ''
                  } ${overdueTask ? 'border-red-300 bg-red-50/30' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => handleToggleComplete(task.id, checked)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                          
                          {/* Metadata in top right corner */}
                          <div className="flex flex-col items-end gap-1 text-xs">
                            {category && (
                              <Badge 
                                variant="outline" 
                                className="flex items-center gap-1 text-xs h-5"
                                style={{ borderColor: category.color, color: category.color }}
                              >
                                {getIconForCategory(category.icon)}
                                {category.name}
                              </Badge>
                            )}
                            
                            <Badge className={`${getPriorityColor(task.priority)} text-xs h-5`}>
                              <Flag className="h-2 w-2 mr-1" />
                              {task.priority.toUpperCase()}
                            </Badge>
                            
                            <Badge 
                              variant="outline" 
                              className={`flex items-center gap-1 text-xs h-5 ${
                                overdueTask ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300'
                              }`}
                            >
                              <Calendar className="h-2 w-2" />
                              {task.dueDate}
                            </Badge>
                            
                            {/* Action buttons */}
                            <div className="flex items-center gap-1 mt-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskFormOpen(true);
                                }}
                                className="h-6 w-6 p-0 hover:bg-blue-100"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTask(task.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs h-5">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;