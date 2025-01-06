import { HomeIcon } from './ui/home';
import { CompassIcon } from './ui/compass';
import { FilePenLineIcon } from './ui/file-pen-line';
import { UserCircle } from 'lucide-react';

interface BottomNavProps {
  onProfileClick: () => void;
}

const BottomNav = ({ onProfileClick }: BottomNavProps) => {
  return (
    <nav className="fixed items-center flex flex-col bottom-0 w-full">
      <div className="w-full lg:w-[40%] bg-white px-2 pt-2 " style={{ borderRadius: "15px 15px 0 0"}}>

      <div className="max-w-lg mx-auto flex justify-between items-center">
        <button className="text-pink-600">
          <HomeIcon />
        </button>
        <button className="text-gray-600">
          <CompassIcon />
        </button>
        <button className="text-gray-600">
          <FilePenLineIcon />
        </button>
        <button className="text-gray-600 flex flex-col items-center p-2 justify-center hover:bg-accent rounded-md transition-colors duration-200" onClick={onProfileClick}>
          <UserCircle className="w-7 h-7" />
      <span className="text-xs mt-1">Profile</span>

        </button>
      </div>

      </div>
      <div className='w-full bottom-0 bg-white h-4'></div>
    </nav>
  );
}

export default BottomNav;