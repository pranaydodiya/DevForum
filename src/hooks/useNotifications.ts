
import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'comment' | 'vote' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  postId?: string;
  userId?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'comment',
        title: 'New Comment',
        message: 'John Doe commented on your React hooks post',
        timestamp: '2 minutes ago',
        read: false,
        postId: '123'
      },
      {
        id: '2',
        type: 'vote',
        title: 'Post Upvoted',
        message: 'Your TypeScript performance tips received 5 upvotes',
        timestamp: '1 hour ago',
        read: false,
        postId: '124'
      },
      {
        id: '3',
        type: 'mention',
        title: 'You were mentioned',
        message: 'Sarah mentioned you in a discussion about APIs',
        timestamp: '3 hours ago',
        read: true,
        postId: '125'
      },
      {
        id: '4',
        type: 'system',
        title: 'Weekly Digest',
        message: 'Your weekly DevForum digest is ready',
        timestamp: '1 day ago',
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate new notifications every 30 seconds
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'comment' : 'vote',
        title: Math.random() > 0.5 ? 'New Comment' : 'Post Liked',
        message: Math.random() > 0.5 
          ? 'Someone commented on your post' 
          : 'Your post received a new upvote',
        timestamp: 'just now',
        read: false,
        postId: Math.floor(Math.random() * 1000).toString()
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
