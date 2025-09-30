import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Post {
  id: number;
  imageUrl: string;
  title: string;
  body: string;
  reactions: Record<string, number>;
  commentsCount: number;
  isPinned: boolean;
  publishedAt: Date;
}

const DEMO_POSTS: Post[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop',
    title: 'Секреты роста стартапов',
    body: 'Разобрали самые эффективные стратегии масштабирования бизнеса в 2025 году. Это реально работает, проверено на практике! Главное — фокус на продукт и правильную метрику роста.',
    reactions: { '👍': 247, '🔥': 189, '❤️': 156 },
    commentsCount: 42,
    isPinned: true,
    publishedAt: new Date('2025-09-28'),
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    title: 'Аналитика маркетинга',
    body: 'Как считать ROMI правильно и не терять деньги на неэффективных каналах? Полный разбор с примерами и калькулятором в комментариях.',
    reactions: { '👍': 198, '🔥': 234, '❤️': 87 },
    commentsCount: 38,
    isPinned: true,
    publishedAt: new Date('2025-09-27'),
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    title: 'Кейс: x3 конверсия за месяц',
    body: 'Реальная история компании, которая утроила конверсию благодаря простым изменениям в воронке продаж. Разбираем каждый шаг подробно.',
    reactions: { '👍': 312, '🔥': 267, '❤️': 203 },
    commentsCount: 67,
    isPinned: false,
    publishedAt: new Date('2025-09-26'),
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop',
    title: 'Тренды digital 2025',
    body: 'Топ-10 трендов, которые изменят правила игры в маркетинге и продажах. Кто успеет — тот победит конкурентов уже в этом квартале.',
    reactions: { '👍': 176, '🔥': 145, '❤️': 98 },
    commentsCount: 29,
    isPinned: false,
    publishedAt: new Date('2025-09-25'),
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop',
    title: 'Личная продуктивность х10',
    body: 'Система управления временем и энергией, которая помогает делать больше за меньшее время. Без магии, только проверенные методы.',
    reactions: { '👍': 289, '🔥': 198, '❤️': 234 },
    commentsCount: 51,
    isPinned: false,
    publishedAt: new Date('2025-09-24'),
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop',
    title: 'Нейросети для бизнеса',
    body: 'Практическое применение GPT-4 и MidJourney для автоматизации рутины и увеличения прибыли. Инструкции и промпты внутри поста.',
    reactions: { '👍': 401, '🔥': 356, '❤️': 287 },
    commentsCount: 93,
    isPinned: false,
    publishedAt: new Date('2025-09-23'),
  },
];

const CHANNEL_INFO = {
  name: 'Крохмалюк',
  handle: 'krokhmalyuk',
  tagline: 'Бывший CMO Ultimate Guitar и COO Яндекса с командой 60+ человек и миллиардными маркетинговыми бюджетами',
  subscribers: 353,
};

const Index = () => {
  const [posts] = useState<Post[]>(DEMO_POSTS);
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.publishedAt.getTime() - a.publishedAt.getTime();
  });

  const handleSubscribe = () => {
    window.open(`https://t.me/${CHANNEL_INFO.handle}`, '_blank');
  };

  return (
    <div className="telegram-pattern min-h-screen pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Send" size={40} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{CHANNEL_INFO.name}</h1>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-2 max-w-3xl mx-auto">
            {CHANNEL_INFO.tagline}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Icon name="Users" size={16} />
            <span>{CHANNEL_INFO.subscribers} подписчиков</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg animate-pulse-glow"
              onClick={handleSubscribe}
            >
              <Icon name="Send" size={20} className="mr-2" />
              Открыть в Telegram
            </Button>
          </div>

          <p className="text-sm text-accent font-medium">
            ⚡ Ежедневные инсайты. Не пропусти.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post, index) => {
            const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
            const isHot = index < 2 && post.isPinned;
            
            return (
              <Card
                key={post.id}
                className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={handleSubscribe}
              >
                <div className="relative">
                  <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {isHot && (
                    <Badge 
                      className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 font-semibold animate-pulse"
                    >
                      🔥 Сейчас обсуждают
                    </Badge>
                  )}
                </div>

                <div className="p-5">
                  {post.title && (
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.body}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      {Object.entries(post.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="flex items-center gap-1">
                          <span className="text-base">{emoji}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MessageCircle" size={16} />
                      <span>{post.commentsCount} комментариев</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {totalReactions} реакций
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-50">
        <Button 
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg animate-pulse-glow"
          onClick={handleSubscribe}
        >
          <Icon name="Send" size={20} className="mr-2" />
          Подписаться на канал
        </Button>
      </div>
    </div>
  );
};

export default Index;