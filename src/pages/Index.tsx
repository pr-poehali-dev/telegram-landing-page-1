import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Icon from '@/components/ui/icon';

const CHANNEL_INFO = {
  name: 'Крохмалюк',
  handle: 'growthsecrets',
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
  post_url?: string;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(POSTS_API);
        const data = await response.json();
        console.log('Posts data:', data.slice(0, 2));
        setPosts(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubscribe = (postUrl?: string) => {
    const link = postUrl || `https://t.me/${CHANNEL_INFO.handle}`;
    window.open(link, '_blank');
  };

  return (
    <div className="telegram-pattern min-h-screen flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:flex lg:flex-col">
            <Card className="bg-[#2d2d2d] border-0 rounded-3xl overflow-hidden shadow-2xl relative lg:h-full flex flex-col">
            <div className="absolute top-4 left-4 z-10">
              <Icon name="Send" size={24} className="text-primary" />
            </div>
            <div className="p-6 text-center flex flex-col justify-end flex-1">
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
                {CHANNEL_INFO.subscribers} подписчиков
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

          <div className="lg:col-span-2 flex flex-col max-h-full">
            <div className="flex items-center gap-3 text-white mb-4">
              <span className="text-lg font-semibold">Топовые посты</span>
            </div>
            <div className="grid gap-3 grid-rows-2 flex-1 overflow-hidden">
              {[0, 1].map((i) => {
                const post = posts[i];
                const isLoaded = !loading && post;
                
                return (
                  <Card
                    key={i}
                    className="bg-[#2d2d2d] border-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer h-full"
                    onClick={() => isLoaded && handleSubscribe(post.post_url)}
                  >
                    <div className="p-4 flex gap-4 h-full">
                      {!isLoaded ? (
                        <Skeleton className="flex-shrink-0 rounded-lg w-32 h-full bg-gray-700/50" />
                      ) : post.image_url ? (
                        <div className="flex-shrink-0 rounded-lg overflow-hidden w-32 h-full animate-in fade-in duration-500">
                          <img
                            src={post.image_url}
                            alt={post.title || 'Post preview'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 rounded-lg w-32 h-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center animate-in fade-in duration-500">
                          <span className="text-5xl">📝</span>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        {!isLoaded ? (
                          <>
                            <div>
                              <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700/50" />
                              <Skeleton className="h-3 w-full mb-1.5 bg-gray-700/50" />
                              <Skeleton className="h-3 w-5/6 bg-gray-700/50" />
                            </div>
                            <div className="flex items-center justify-between pt-3">
                              <div className="flex items-center gap-2.5">
                                <Skeleton className="h-5 w-12 bg-gray-700/50" />
                                <Skeleton className="h-5 w-12 bg-gray-700/50" />
                              </div>
                              <Skeleton className="h-4 w-10 bg-gray-700/50" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="animate-in fade-in duration-500">
                              {post.title && (
                                <h3 className="text-white font-semibold text-sm mb-1.5 truncate">
                                  {post.title}
                                </h3>
                              )}
                              <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                                {post.preview}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-3 animate-in fade-in duration-500" style={{ animationDelay: '100ms' }}>
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
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;