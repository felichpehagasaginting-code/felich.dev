import { vi } from 'vitest';

export const mockDoc = vi.fn((_db: any, _collection: string, _docId: string) => ({
  id: _docId,
  path: `${_collection}/${_docId}`,
}));

export const mockCollection = vi.fn((_db: any, _name: string) => ({
  path: _name,
  name: _name,
}));

export const mockQuery = vi.fn((_coll: any, ..._args: any[]) => ({
  collection: _coll,
  constraints: _args,
}));

export const mockOrderBy = vi.fn((_field: string, _dir?: 'asc' | 'desc') => ({
  field: _field,
  direction: _dir || 'asc',
}));

export const mockOnSnapshot = vi.fn((_ref: any, _cb: any, _errCb?: any) => {
  if (typeof _cb === 'function') {
    _cb({
      exists: true,
      data: () => ({ count: 5, id: _ref?.id || 'test-id' }),
      docs: [],
      size: 0,
    });
  }
  return vi.fn();
});

export const mockGetDoc = vi.fn((_ref: any) =>
  Promise.resolve({
    exists: true,
    data: () => ({ count: 42, path: 'home' }),
    id: _ref?.id || 'test',
  })
);

export const mockSetDoc = vi.fn(() => Promise.resolve());
export const mockAddDoc = vi.fn(() => Promise.resolve({ id: 'mock-doc-id' }));
export const mockIncrement = vi.fn((n: number) => n);

export const mockRef = vi.fn((_db: any, _path: string) => ({
  key: _path.split('/').pop(),
  path: _path,
}));

export const mockOnValue = vi.fn((_ref: any, cb: any) => {
  cb({
    size: 3,
    val: () => ({}),
    forEach: vi.fn(),
  });
  return vi.fn();
});

export const mockRtdbSet = vi.fn(() => Promise.resolve());
export const mockRemove = vi.fn(() => Promise.resolve());
export const mockOnDisconnect = vi.fn(() => ({
  remove: mockRemove,
  set: vi.fn(),
}));
export const mockRtdbServerTimestamp = vi.fn(() => ({ '.sv': 'timestamp' }));

export const mockOnAuthStateChanged = vi.fn((_auth: any, cb: (user: any) => void) => {
  cb(null);
  return vi.fn();
});

export const mockSignInWithPopup = vi.fn(() =>
  Promise.resolve({
    user: {
      uid: 'mock-uid',
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: 'https://example.com/photo.jpg',
    },
  })
);

export const mockAuthSignOut = vi.fn(() => Promise.resolve());

export class MockGoogleAuthProvider {
  setCustomParameters(_params: Record<string, string>) {}
}
