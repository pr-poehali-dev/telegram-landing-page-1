import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const UPLOAD_API = 'https://functions.poehali.dev/1d8298fc-c737-4135-bd22-4d9c96e6f07c';

interface PostFormData {
  title: string;
  preview: string;
  image_url: string;
  post_url: string;
  views: number;
  reactions: Record<string, number>;
}

interface PostFormProps {
  formData: PostFormData;
  editingId: number | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onChange: (data: PostFormData) => void;
}

const popularEmojis = ['🔥', '❤️', '👍', '😂', '😍', '🎉', '💯', '👏', '⭐', '✨', '💪', '🚀'];

export const PostForm = ({ formData, editingId, onSubmit, onCancel, onChange }: PostFormProps) => {
  const [imagePreview, setImagePreview] = useState<string>(formData.image_url || '');
  const [reactionInput, setReactionInput] = useState({ emoji: '', count: '' });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        
        try {
          const response = await fetch(UPLOAD_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64,
              filename: file.name
            })
          });
          
          if (response.ok) {
            onChange({ ...formData, image_url: base64 });
            toast({
              title: 'Успешно',
              description: 'Изображение загружено',
            });
          }
        } catch (error) {
          toast({
            title: 'Ошибка',
            description: 'Не удалось загрузить изображение',
            variant: 'destructive',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReaction = () => {
    if (reactionInput.emoji && reactionInput.count) {
      onChange({
        ...formData,
        reactions: {
          ...formData.reactions,
          [reactionInput.emoji]: parseInt(reactionInput.count) || 0,
        },
      });
      setReactionInput({ emoji: '', count: '' });
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setReactionInput({ ...reactionInput, emoji });
    setShowEmojiPicker(false);
  };

  const handleRemoveReaction = (emoji: string) => {
    const newReactions = { ...formData.reactions };
    delete newReactions[emoji];
    onChange({ ...formData, reactions: newReactions });
  };

  return (
    <Card className="bg-[#2d2d2d] border-0 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        {editingId ? 'Редактировать пост' : 'Создать новый пост'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Заголовок</label>
          <Input
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Название поста"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Превью текст</label>
          <Textarea
            value={formData.preview}
            onChange={(e) => onChange({ ...formData, preview: e.target.value })}
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
              onChange={(e) => {
                onChange({ ...formData, image_url: e.target.value });
                setImagePreview(e.target.value);
              }}
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
            onChange={(e) => onChange({ ...formData, views: parseInt(e.target.value) || 0 })}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-2 block">URL поста (Telegram)</label>
          <Input
            value={formData.post_url}
            onChange={(e) => onChange({ ...formData, post_url: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="https://t.me/channel/123"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Реакции</label>
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                value={reactionInput.emoji}
                onChange={(e) => setReactionInput({ ...reactionInput, emoji: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white w-20 text-center text-2xl h-12"
                placeholder="😀"
                maxLength={2}
              />
              <div className="relative">
                <Button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="bg-gray-700 border-0 text-white hover:bg-gray-600 px-3 h-12"
                >
                  <Icon name="Smile" size={20} />
                </Button>
                {showEmojiPicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowEmojiPicker(false)}
                    />
                    <div className="absolute z-50 mt-2 left-0 bg-gray-800 border border-gray-700 rounded-lg p-4 grid grid-cols-6 gap-2 shadow-2xl min-w-[320px]">
                      {popularEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-3xl hover:bg-gray-700 rounded-lg p-2 transition-colors w-12 h-12 flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
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
                className="bg-primary hover:bg-primary/90"
                disabled={!reactionInput.emoji || !reactionInput.count}
              >
                Добавить
              </Button>
            </div>
            {Object.keys(formData.reactions).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.reactions).map(([emoji, count]) => (
                  <div key={emoji} className="bg-gray-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <span className="text-xl">{emoji}</span>
                    <span className="text-white text-sm font-medium">{count}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReaction(emoji)}
                      className="text-red-400 hover:text-red-300 ml-1 text-lg font-bold"
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
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Отмена
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};