import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { AuthScreen } from '../components/AuthScreen';

type LoginModalContextType = {
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error('useLoginModal must be used within LoginModalProvider');
  return ctx;
}

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const openLoginModal = useCallback((message = '') => {
    setPromptMessage(message);
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLoginModal(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeLoginModal]);

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      {isOpen && (
        <AuthScreen
          promptMessage={promptMessage}
          onClose={closeLoginModal}
          onSuccess={closeLoginModal}
          recaptchaId="modal-recaptcha-container"
        />
      )}
    </LoginModalContext.Provider>
  );
}
