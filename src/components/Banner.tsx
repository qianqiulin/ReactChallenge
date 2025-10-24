// src/components/Banner.tsx
import type { User } from '../utils/firebase';

type Props = {
  title: string;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export default function Banner({ title, user, onSignIn, onSignOut }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user && (
          <>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
                style={{ width: 28, height: 28, borderRadius: '50%' }}
              />
            )}
            <span style={{ fontSize: 13, color: '#374151' }}>
              {user.displayName ?? user.email}
            </span>
          </>
        )}

        {user ? (
          <button
            onClick={onSignOut}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={onSignIn}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}
