import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export const PostList = ({ posts, onEdit, onDelete }: PostListProps) => {
  return (
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
                onClick={() => onEdit(post)}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Icon name="Edit" size={16} className="mr-1" />
                Изменить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(post.id)}
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
  );
};