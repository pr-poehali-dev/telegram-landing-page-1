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

const TOP_POSTS = [
  {
    id: 1,
    thumbnail: 'https://cdn.poehali.dev/files/9165a5b8-ab3c-424b-87b5-0a62741b38ea.png',
    title: 'INBOUND_2025_30_Charts',
    text: 'Неделю назад на одной из самых крутых конференций по маркетингу INBOUND уважаемый дядька Нил Патель рассказал, к чему надо быть готовым в маркетинге...',
    views: 378,
    reactions: [
      { emoji: '🔥', count: 11 },
      { emoji: '❤️', count: 6 },
      { emoji: '⚡', count: 4 },
      { emoji: '💯', count: 1 }
    ]
  },
  {
    id: 2,
    thumbnail: 'https://cdn.poehali.dev/files/e8c5aca1-e954-401a-bb79-620656139ed2.jpg',
    text: 'Как мы получили $2M инвестиций через контент маркетинг. 3 главных инсайта от запуска стартапа, которые работают и сейчас. Делюсь опытом 🚀',
    views: 892,
    reactions: [
      { emoji: '🔥', count: 24 },
      { emoji: '👍', count: 18 },
      { emoji: '💪', count: 7 }
    ]
  },
  {
    id: 3,
    text: 'Разбор кейса: как маркетинг Яндекса увеличил конверсию на 340% за 3 месяца. Тактики, которые вы можете использовать уже сегодня. Сохраняйте пост ⚡',
    views: 1245,
    reactions: [
      { emoji: '🔥', count: 45 },
      { emoji: '❤️', count: 31 },
      { emoji: '👏', count: 12 },
      { emoji: '💡', count: 8 }
    ]
  }
];

const Index = () => {
  const handleSubscribe = () => {
    window.open(`https://t.me/${CHANNEL_INFO.handle}`, '_blank');
  };

  return (
    <div className="telegram-pattern min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-3 mb-8 text-white">
          <Icon name="Send" size={28} className="text-primary" />
          <span className="text-xl font-semibold">Telegram</span>
        </div>

        <Card className="bg-[#2d2d2d] border-0 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 ring-4 ring-gray-700/50">
              <img
                src={CHANNEL_INFO.avatarUrl}
                alt={CHANNEL_INFO.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {CHANNEL_INFO.name}
            </h1>

            <p className="text-gray-400 text-sm mb-4">
              {CHANNEL_INFO.subscribers} subscribers
            </p>

            <div className="mb-6">
              <p className="text-white text-sm leading-relaxed mb-1">
                <span className="text-gray-400">Автор:</span>{' '}
                <span className="text-primary">@{CHANNEL_INFO.handle}</span>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {CHANNEL_INFO.tagline}
              </p>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl py-6 text-base"
              onClick={handleSubscribe}
            >
              Подписаться
            </Button>
          </div>
        </Card>

        <div className="mt-8 space-y-4">
          <h2 className="text-white text-xl font-semibold mb-4 px-2">Топовые посты</h2>
          {TOP_POSTS.map((post) => (
            <Card
              key={post.id}
              className="bg-[#2d2d2d] border-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              onClick={handleSubscribe}
            >
              <div className="p-5">
                {post.thumbnail && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title || 'Post preview'}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                {post.title && (
                  <h3 className="text-white font-semibold text-base mb-2">
                    {post.title}
                  </h3>
                )}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.reactions.map((reaction, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-base">{reaction.emoji}</span>
                        <span className="text-gray-400 text-sm font-medium">
                          {reaction.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Icon name="Eye" size={16} />
                    <span className="text-sm font-medium">{post.views}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;