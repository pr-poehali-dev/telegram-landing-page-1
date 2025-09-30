import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onLogout: () => void;
  onGoHome: () => void;
}

export const AdminHeader = ({ onLogout, onGoHome }: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Icon name="Settings" size={32} className="text-primary" />
        Управление постами
      </h1>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onLogout}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
        >
          <Icon name="LogOut" size={18} className="mr-2" />
          Выйти
        </Button>
        <Button
          variant="outline"
          onClick={onGoHome}
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          На главную
        </Button>
      </div>
    </div>
  );
};