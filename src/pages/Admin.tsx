import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PostForm } from '@/components/admin/PostForm';
import { PostList } from '@/components/admin/PostList';

const POSTS_API = 'https://functions.poehali.dev/db373ce5-74a9-4e99-8495-f473299be4e2';

interface Post {
  id: number;
  title: string;
  preview: string;
  image_url: string;
  reactions: Record<string, number>;
  views: number;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    preview: '',
    image_url: '',
    post_url: '',
    views: 0,
    reactions: {} as Record<string, number>,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState<string>(() => {
    return localStorage.getItem('admin_jwt_token') || '';
  });
  
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const response = await fetch(POSTS_API);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить посты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(POSTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setJwtToken(data.token);
        localStorage.setItem('admin_jwt_token', data.token);
        setIsAuthenticated(true);
        toast({
          title: 'Успех!',
          description: 'Вы успешно вошли',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверные логин или пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPosts();
    
    const savedToken = localStorage.getItem('admin_jwt_token');
    if (savedToken) {
      setJwtToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${POSTS_API}?id=${editingId}` : POSTS_API;
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(formData),
      });
      
      if (response.status === 401) {
        setIsAuthenticated(false);
        toast({
          title: 'Ошибка',
          description: 'Неверные логин или пароль',
          variant: 'destructive',
        });
        return;
      }

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingId ? 'Пост обновлен' : 'Пост создан',
        });
        setFormData({ title: '', preview: '', image_url: '', post_url: '', views: 0, reactions: {} });
        setEditingId(null);
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить пост',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      preview: post.preview,
      image_url: post.image_url,
      post_url: (post as any).post_url || '',
      views: post.views,
      reactions: post.reactions || {},
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот пост?')) return;

    try {
      const response = await fetch(`${POSTS_API}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `Bearer ${jwtToken}`
        }
      });
      
      if (response.status === 401) {
        setIsAuthenticated(false);
        toast({
          title: 'Ошибка',
          description: 'Неверные логин или пароль',
          variant: 'destructive',
        });
        return;
      }

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Пост удален',
        });
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить пост',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', preview: '', image_url: '', post_url: '', views: 0, reactions: {} });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_jwt_token');
    setJwtToken('');
    setIsAuthenticated(false);
    toast({
      title: 'Выход',
      description: 'Вы вышли из системы',
    });
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <AdminHeader onLogout={handleLogout} onGoHome={handleGoHome} />
        
        <PostForm
          formData={formData}
          editingId={editingId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onChange={setFormData}
        />

        <PostList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Admin;