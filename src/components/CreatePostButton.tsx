
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostModal from './CreatePostModal';
import AuthModal from './AuthModal';

interface CreatePostButtonProps {
  onCreatePost: (post: any) => void;
}

const CreatePostButton = ({ onCreatePost }: CreatePostButtonProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      setShowCreateModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <Button onClick={handleClick} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Post
      </Button>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePost={onCreatePost}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default CreatePostButton;
