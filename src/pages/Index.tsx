import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const CHANNEL_INFO = {
  name: 'Крохмалюк',
  handle: 'krokhmalyuk',
  tagline: 'Бывший CMO Ultimate Guitar и COO Яндекса с командой 60+ человек и миллиардными маркетинговыми бюджетами. Также, создател...',
  subscribers: 353,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
};

const Index = () => {
  const handleViewInTelegram = () => {
    window.open(`https://t.me/${CHANNEL_INFO.handle}`, '_blank');
  };

  const handleOpenInWeb = () => {
    window.open(`https://t.me/s/${CHANNEL_INFO.handle}`, '_blank');
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

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl py-6 text-base"
                onClick={handleViewInTelegram}
              >
                VIEW IN TELEGRAM
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent border-2 border-primary text-primary hover:bg-primary/10 font-medium rounded-xl py-6 text-base"
                onClick={handleOpenInWeb}
              >
                OPEN IN WEB
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;