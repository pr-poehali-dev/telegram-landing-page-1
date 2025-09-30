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
    placeholderEmoji: '📊',
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
    <div className="telegram-pattern min-h-screen flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Icon name="Send" size={24} className="text-primary" />
              <span className="text-lg font-semibold">Telegram</span>
            </div>
            <Card className="bg-[#2d2d2d] border-0 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
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
              {TOP_POSTS.map((post) => (
                <Card
                  key={post.id}
                  className="bg-[#2d2d2d] border-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                  onClick={handleSubscribe}
                >
                  <div className="p-4 flex flex-col">
                    <div className="flex gap-4 mb-3">
                      {post.thumbnail ? (
                        <div className="flex-shrink-0 rounded-lg overflow-hidden w-32 h-24">
                          <img
                            src={post.thumbnail}
                            alt={post.title || 'Post preview'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : post.placeholderEmoji ? (
                        <div className="flex-shrink-0 rounded-lg w-32 h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                          <span className="text-5xl">{post.placeholderEmoji}</span>
                        </div>
                      ) : null}
                      <div className="flex-1 min-w-0">
                        {post.title && (
                          <h3 className="text-white font-semibold text-sm mb-1.5">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                          {post.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                      <div className="flex items-center gap-2.5">
                        {post.reactions.slice(0, 3).map((reaction, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="text-sm">{reaction.emoji}</span>
                            <span className="text-gray-400 text-xs font-medium">
                              {reaction.count}
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
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;