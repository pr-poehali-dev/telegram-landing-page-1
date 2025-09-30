import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const CHANNEL_INFO = {
  name: 'Крохмалюк',
  handle: 'krokhmalyuk',
  tagline: 'Бывший CMO Ultimate Guitar и COO Яндекса с командой 60+ человек и миллиардными маркетинговыми бюджетами. Также, создател...',
  subscribers: 353,
  avatarUrl: 'https://cdn.poehali.dev/files/e8c5aca1-e954-401a-bb79-620656139ed2.jpg',
};

const POSTS_API = 'https://functions.poehali.dev/db373ce5-74a9-4e99-8495-f473299be4e2';

interface Post {
  id: number;
  title: string;
  preview: string;
  image_url: string;
  reactions: Record<string, number>;
  views: number;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(POSTS_API);
        const data = await response.json();
        setPosts(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubscribe = () => {
    window.open(`https://t.me/${CHANNEL_INFO.handle}`, '_blank');
  };

  return (
    <div className="telegram-pattern min-h-screen flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
          <div className="lg:flex lg:flex-col">
            <Card className="bg-[#2d2d2d] border-0 rounded-3xl overflow-hidden shadow-2xl relative lg:flex-1 lg:flex lg:flex-col">
            <div className="absolute top-4 left-4 z-10">
              <Icon name="Send" size={24} className="text-primary" />
            </div>
            <div className="p-6 text-center lg:flex lg:flex-col lg:justify-center lg:flex-1">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 ring-4 ring-gray-700/50">
                <img
                  src={CHANNEL_INFO.avatarUrl}
                  alt={CHANNEL_INFO.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                {CHANNEL_INFO.name}
              </h1>

              <p className="text-gray-400 text-xs mb-3">
                {CHANNEL_INFO.subscribers} subscribers
              </p>

              <div className="mb-4">
                <p className="text-white text-xs leading-relaxed mb-1">
                  <span className="text-gray-400">Автор:</span>{' '}
                  <span className="text-primary">@{CHANNEL_INFO.handle}</span>
                </p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {CHANNEL_INFO.tagline}
                </p>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl py-5 text-sm"
                onClick={handleSubscribe}
              >
                Подписаться
              </Button>
            </div>
          </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <span className="text-lg font-semibold">Топовые посты</span>
            </div>
            <div className="grid gap-3">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Загрузка постов...</div>
              ) : (
                posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-[#2d2d2d] border-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                    onClick={handleSubscribe}
                  >
                    <div className="p-4 flex gap-4">
                      {post.image_url ? (
                        <div className="flex-shrink-0 rounded-lg overflow-hidden w-32 self-stretch">
                          <img
                            src={post.image_url}
                            alt={post.title || 'Post preview'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 rounded-lg w-32 self-stretch bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                          <span className="text-5xl">📝</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {post.title && (
                            <h3 className="text-white font-semibold text-sm mb-1.5 truncate">
                              {post.title}
                            </h3>
                          )}
                          <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                            {post.preview}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center gap-2.5">
                            {Object.entries(post.reactions).slice(0, 3).map(([emoji, count], idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="text-sm">{emoji}</span>
                                <span className="text-gray-400 text-xs font-medium">
                                  {count}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Icon name="Eye" size={14} />
                            <span className="text-xs font-medium">{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;