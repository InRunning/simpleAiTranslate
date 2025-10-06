// Encrypted storage unit tests
// This file contains tests for the encrypted storage utilities

import { EncryptedStorage } from '../../src/lib/storage';

describe('EncryptedStorage', () => {
  let storage: EncryptedStorage;
  
  beforeEach(() => {
    storage = new EncryptedStorage();
  });
  
  test('should initialize correctly', () => {
    expect(storage).toBeDefined();
  });
  
  test('should set and get values', async () => {
    await storage.set('test-key', 'test-value');
    const value = await storage.get('test-key');
    expect(value).toBe('test-value');
  });
  
  test('should remove values', async () => {
    await storage.set('test-key', 'test-value');
    await storage.remove('test-key');
    const value = await storage.get('test-key');
    expect(value).toBeNull();
  });
});