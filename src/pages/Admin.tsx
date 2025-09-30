import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
    views: 0,
    reactions: {} as Record<string, number>,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [reactionInput, setReactionInput] = useState({ emoji: '', count: '' });
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${POSTS_API}/${editingId}` : POSTS_API;
      
      let finalImageUrl = formData.image_url;
      
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        
        const uploadResponse = await fetch('https://cdn.poehali.dev/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
        }
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: finalImageUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingId ? 'Пост обновлен' : 'Пост создан',
        });
        setFormData({ title: '', preview: '', image_url: '', views: 0, reactions: {} });
        setEditingId(null);
        setImageFile(null);
        setImagePreview('');
        setReactionInput({ emoji: '', count: '' });
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
      views: post.views,
      reactions: post.reactions || {},
    });
    setImagePreview(post.image_url);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот пост?')) return;

    try {
      const response = await fetch(`${POSTS_API}/${id}`, {
        method: 'DELETE',
      });

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
    setFormData({ title: '', preview: '', image_url: '', views: 0, reactions: {} });
    setImageFile(null);
    setImagePreview('');
    setReactionInput({ emoji: '', count: '' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReaction = () => {
    if (reactionInput.emoji && reactionInput.count) {
      setFormData({
        ...formData,
        reactions: {
          ...formData.reactions,
          [reactionInput.emoji]: parseInt(reactionInput.count) || 0,
        },
      });
      setReactionInput({ emoji: '', count: '' });
    }
  };

  const handleRemoveReaction = (emoji: string) => {
    const newReactions = { ...formData.reactions };
    delete newReactions[emoji];
    setFormData({ ...formData, reactions: newReactions });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="Settings" size={32} className="text-primary" />
            Управление постами
          </h1>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На главную
          </Button>
        </div>

        <Card className="bg-[#2d2d2d] border-0 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Редактировать пост' : 'Создать новый пост'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Заголовок</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Название поста"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Превью текст</label>
              <Textarea
                value={formData.preview}
                onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                placeholder="Краткое описание поста"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Изображение</label>
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4"
                />
                {imagePreview && (
                  <div className="relative w-32 h-32">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Или вставьте URL изображения"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Просмотры</label>
              <Input
                type="number"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Реакции</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={reactionInput.emoji}
                    onChange={(e) => setReactionInput({ ...reactionInput, emoji: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white w-20"
                    placeholder="😀"
                  />
                  <Input
                    type="number"
                    value={reactionInput.count}
                    onChange={(e) => setReactionInput({ ...reactionInput, count: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white w-24"
                    placeholder="Кол-во"
                  />
                  <Button
                    type="button"
                    onClick={handleAddReaction}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    Добавить
                  </Button>
                </div>
                {Object.keys(formData.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.reactions).map(([emoji, count]) => (
                      <div key={emoji} className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <span className="text-white text-sm">{count}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveReaction(emoji)}
                          className="text-red-400 hover:text-red-300 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingId ? 'Сохранить изменения' : 'Создать пост'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel} className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Все посты ({posts.length})</h2>
          {posts.map((post) => (
            <Card key={post.id} className="bg-[#2d2d2d] border-0 p-6">
              <div className="flex gap-4">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{post.preview}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👁 {post.views} просмотров</span>
                    <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Icon name="Edit" size={16} className="mr-1" />
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40"
                  >
                    <Icon name="Trash2" size={16} className="mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;